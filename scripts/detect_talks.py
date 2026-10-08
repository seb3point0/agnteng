#!/usr/bin/env python3
"""Find the three talks in an event recording, automatically.

Two passes, because precision and context pull in opposite directions:

  coarse  60s chunks over the whole recording. Enough to see the shape of the
          event — intro, three talks, the handovers between them — but only
          locates a boundary to within a minute.
  fine    5s chunks in a 90s window around each coarse boundary. Enough to pin
          the exact second a speaker opens or applause dies.

Both passes get their timing from the chunk grid, never from the model. A model
asked to timestamp 46 minutes of audio drifts, and the drift is invisible: the
text reads fine while the numbers wander. Chunk `i` starts at `i * seconds`
because that is where ffmpeg cut it, so the timing is exact by construction and
the model is only ever asked what was said.

The structural judgement — which handover starts which talk — is the one part
genuinely worth a model, so that is all it is asked for.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import subprocess
import sys
import urllib.request

API = "https://openrouter.ai/api/v1/chat/completions"

STRUCTURE_PROMPT = """You are given a timestamped transcript of a tech meetup recording.
Each line is `[M:SS] text` where the timestamp is the exact start of that chunk.

The event has this shape: an opening by the host (welcome, community notices,
sponsor, housekeeping), then exactly THREE talks by three different speakers,
each roughly 10 minutes, separated by applause and a short break while the next
speaker sets up. There may be Q&A after a talk.

Identify the THREE talks. The host's opening is NOT a talk. A venue host briefly
introducing the space is NOT a talk.

For each talk give:
  - start_approx: seconds, when the SPEAKER begins their own talk (not when the
    host starts introducing them)
  - end_approx: seconds, after their closing line and the applause that follows
  - speaker: the speaker's name if stated, else null
  - topic: a short phrase
  - start_evidence / end_evidence: the exact quoted words that justify each

Return ONLY JSON: {"talks": [{...}, {...}, {...}]}"""

REFINE_PROMPT = """Below is a transcript of consecutive 5-second chunks of audio, each
labelled with its exact start time in seconds.

{question}

Answer with ONLY JSON: {{"second": <integer>, "evidence": "<the quoted words>"}}
Pick the start time of the chunk where it happens."""


def key() -> str:
    for p in (pathlib.Path(".env"),
              pathlib.Path(__file__).resolve().parent.parent / ".env"):
        if p.exists():
            for line in p.read_text().splitlines():
                if line.strip().startswith("OPENROUTER_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("error: OPENROUTER_API_KEY not found in .env")


def hm(s: float) -> str:
    m, sec = divmod(int(s), 60)
    return f"{m}:{sec:02d}"


def chat(prompt: str, k: str, model: str) -> str:
    body = json.dumps({"model": model,
                       "messages": [{"role": "user", "content": prompt}]}).encode()
    req = urllib.request.Request(
        API, data=body,
        headers={"Authorization": f"Bearer {k}", "Content-Type": "application/json"})
    r = json.loads(urllib.request.urlopen(req, timeout=300).read())
    return r["choices"][0]["message"]["content"]


def parse_json(text: str) -> dict:
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        sys.exit(f"model did not return JSON:\n{text[:400]}")
    return json.loads(m.group(0))


def transcribe_window(audio: pathlib.Path, out: pathlib.Path, start: float,
                      end: float, seconds: float) -> list[dict]:
    """Delegate to transcribe_chunks.py so there is one implementation of the
    chunk grid rather than two that can disagree."""
    here = pathlib.Path(__file__).resolve().parent
    subprocess.run([sys.executable, str(here / "transcribe_chunks.py"), str(audio),
                    "--out", str(out), "--seconds", str(seconds),
                    "--start", str(start), "--end", str(end), "--workers", "12",
                    "--prompt",
                    "Transcribe verbatim. Mark audience reactions like [applause] "
                    "or [laughter]. If there is only silence or room noise, output "
                    "[silence]. Output only the transcript."],
                   check=True, capture_output=True)
    return json.loads(out.read_text())


def render(chunks: list[dict]) -> str:
    return "\n".join(f"[{int(c['start'])}s] {' '.join(c['text'].split())}"
                     for c in chunks)


def refine(audio: pathlib.Path, work: pathlib.Path, centre: float, question: str,
           k: str, model: str, tag: str, window: float, pad: float) -> tuple[int, str]:
    lo = max(0.0, centre - window)
    hi = centre + window
    chunks = transcribe_window(audio, work / f"refine_{tag}.json", lo, hi, 5.0)
    answer = parse_json(chat(
        REFINE_PROMPT.format(question=question) + "\n\n" + render(chunks), k, model))
    return int(answer["second"]) + int(pad), answer.get("evidence", "")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("event")
    ap.add_argument("--model", default="google/gemini-3.1-pro-preview")
    ap.add_argument("--window", type=float, default=60.0,
                    help="half-width of the refine window, seconds")
    ap.add_argument("--lead", type=float, default=-2.0,
                    help="seconds of air before each talk start (default: -2)")
    ap.add_argument("--tail", type=float, default=3.0,
                    help="seconds of air after each talk end (default: +3)")
    args = ap.parse_args()

    d = pathlib.Path(args.event)
    if not d.is_dir():
        d = pathlib.Path("content") / args.event
    work = d / "work"
    audio = work / "audio.mp3"
    coarse = work / "coarse.json"
    if not coarse.exists():
        sys.exit(f"error: {coarse} missing — run transcribe_chunks.py first")

    k = key()
    chunks = json.loads(coarse.read_text())
    transcript = "\n".join(
        f"[{hm(c['start'])}] {' '.join(c['text'].split())}" for c in chunks)

    print("pass 1: finding the talks in the coarse transcript…", file=sys.stderr)
    found = parse_json(chat(STRUCTURE_PROMPT + "\n\n" + transcript, k, args.model))
    talks = found["talks"]
    if len(talks) != 3:
        print(f"warning: model found {len(talks)} talks, expected 3", file=sys.stderr)

    print("pass 2: refining each boundary to the second…", file=sys.stderr)
    out = []
    for i, t in enumerate(talks, 1):
        s, s_ev = refine(
            audio, work, float(t["start_approx"]),
            f"Find the exact moment the speaker BEGINS their own talk — their first "
            f"words, after the host finishes introducing them. Context: the talk is "
            f"about {t.get('topic')}. The host's introduction ends just before this.",
            k, args.model, f"t{i}s", args.window, args.lead)
        e, e_ev = refine(
            audio, work, float(t["end_approx"]),
            f"Find the exact moment this talk ENDS — after the speaker's closing line "
            f"and after the applause that follows it has finished. Context: the talk "
            f"is about {t.get('topic')}. Pick the chunk AFTER the applause ends.",
            k, args.model, f"t{i}e", args.window, args.tail)
        out.append({"n": i, "speaker": t.get("speaker"), "topic": t.get("topic"),
                    "start": s, "end": e,
                    "start_evidence": s_ev or t.get("start_evidence"),
                    "end_evidence": e_ev or t.get("end_evidence")})

    (work / "talks.json").write_text(json.dumps(out, indent=1))
    print()
    for t in out:
        print(f"{t['n']}. {t['speaker'] or '(name not stated)'} — {t['topic']}")
        print(f"   {hm(t['start'])} → {hm(t['end'])}  ({(t['end']-t['start'])/60:.1f} min)")
        print(f"   in : {t['start_evidence']}")
        print(f"   out: {t['end_evidence']}")
    print(f"\nwrote {work / 'talks.json'}", file=sys.stderr)


if __name__ == "__main__":
    main()
