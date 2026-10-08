#!/usr/bin/env python3
"""Chunked transcription through OpenRouter, with trustworthy timings.

Why chunks rather than one request for the whole file: a model asked to
timestamp 46 minutes of audio drifts, and the drift is invisible — the text
reads fine while the numbers wander. Cutting video on those numbers produces
clips that open mid-sentence.

So timing comes from the chunk grid, which is exact by construction: chunk `i`
starts at `i * seconds` in the source, and ffmpeg cuts it there. The model only
ever sees a short window and is only asked what was said, never when. The
resulting resolution is the chunk length, which a second pass then refines.
"""

from __future__ import annotations

import argparse
import base64
import json
import pathlib
import subprocess
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

API = "https://openrouter.ai/api/v1/chat/completions"
PROMPT = (
    "Transcribe this audio verbatim. Include speaker changes and audience "
    "reactions in square brackets, e.g. [applause], [laughter]. "
    "Output only the transcript, no commentary."
)


def key() -> str:
    for p in (pathlib.Path(".env"), pathlib.Path(__file__).resolve().parent.parent / ".env"):
        if p.exists():
            for line in p.read_text().splitlines():
                if line.strip().startswith("OPENROUTER_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("error: OPENROUTER_API_KEY not found in .env")


def hm(s: float) -> str:
    h, rem = divmod(int(s), 3600)
    m, sec = divmod(rem, 60)
    return f"{h}:{m:02d}:{sec:02d}" if h else f"{m}:{sec:02d}"


def cut(src: pathlib.Path, dest: pathlib.Path, start: float, length: float) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-ss", str(start), "-i", str(src), "-t", str(length),
         "-c", "copy", str(dest)],
        capture_output=True, check=False)


def ask(blob64: str, k: str, model: str, prompt: str, retries: int = 3) -> str:
    body = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": [
            {"type": "text", "text": prompt},
            {"type": "input_audio", "input_audio": {"data": blob64, "format": "mp3"}}]}],
    }).encode()
    last = ""
    for attempt in range(retries):
        req = urllib.request.Request(
            API, data=body,
            headers={"Authorization": f"Bearer {k}", "Content-Type": "application/json"})
        try:
            r = json.loads(urllib.request.urlopen(req, timeout=300).read())
            return (r["choices"][0]["message"]["content"] or "").strip()
        except urllib.error.HTTPError as e:
            last = f"HTTP {e.code}: {e.read().decode(errors='replace')[:200]}"
        except Exception as e:  # noqa: BLE001 - transient network
            last = str(e)
    return f"[TRANSCRIPTION FAILED: {last}]"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--out", required=True)
    ap.add_argument("--seconds", type=float, default=60.0)
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--end", type=float, default=0.0, help="0 = to the end")
    ap.add_argument("--model", default="google/gemini-2.5-flash")
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--prompt", default=PROMPT)
    args = ap.parse_args()

    src = pathlib.Path(args.audio)
    k = key()
    dur = float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(src)], capture_output=True, text=True).stdout.strip())
    # Clamp: a window past the end yields empty chunks, and a model handed
    # an empty chunk invents plausible-sounding speech rather than nothing.
    end = min(args.end or dur, dur)
    tmp = pathlib.Path(args.out).parent / "_chunks"
    tmp.mkdir(parents=True, exist_ok=True)

    spans = []
    t = args.start
    while t < end:
        spans.append((len(spans), t, min(args.seconds, end - t)))
        t += args.seconds
    print(f"{len(spans)} chunks of {args.seconds:g}s "
          f"({hm(args.start)}–{hm(end)}) via {args.model}", file=sys.stderr)

    def work(spec):
        i, off, length = spec
        part = tmp / f"c{i:04d}.mp3"
        cut(src, part, off, length)
        blob = base64.b64encode(part.read_bytes()).decode()
        text = ask(blob, k, args.model, args.prompt)
        part.unlink(missing_ok=True)
        print(f"  {hm(off)} done", file=sys.stderr)
        return {"i": i, "start": off, "end": off + length, "text": text}

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        results = sorted(ex.map(work, spans), key=lambda r: r["i"])

    out = pathlib.Path(args.out)
    out.write_text(json.dumps(results, indent=1))
    txt = out.with_suffix(".txt")
    with txt.open("w") as fh:
        for r in results:
            fh.write(f"[{hm(r['start'])}] {r['text']}\n\n")
    failed = sum(1 for r in results if r["text"].startswith("[TRANSCRIPTION FAILED"))
    print(f"\nwrote {out} and {txt}" + (f"  ({failed} chunks failed)" if failed else ""),
          file=sys.stderr)


if __name__ == "__main__":
    main()
