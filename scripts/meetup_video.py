#!/usr/bin/env python3
"""Turn one event recording into per-talk clips.

One big camera file per event, an optional intro nobody wants cut, then three
~10 minute talks. This script owns the mechanical half:

    probe       what is in raw/, how long, what codecs
    transcribe  extract audio -> xAI Grok Voice Transcribe -> timestamped,
                speaker-labelled transcript + candidate boundaries
    cut         cut the talks out with ffmpeg

Boundary detection is deliberately NOT decided here. Silence alone is a bad
signal: speakers pause mid-talk, rooms applaud mid-talk, a demo sits quiet for
thirty seconds. The reliable signal is the host saying "please welcome" and the
speaker saying "thank you" — which needs reading. So `transcribe` gathers the
evidence (what was said, when, and by whom), something that can read decides the
timecodes, and `cut` takes them as input.

Transcription is xAI's grok-voice-transcribe-2.0. Two of its options carry most
of the quality here:

  keyterm   biases the model toward terms it would otherwise mangle — speaker
            names, company names, and the jargon this meetup actually uses.
            Seeded automatically from the event's deck content.ts plus a
            standing vocabulary list, which is why --keyterm rarely needs
            passing by hand.
  diarize   per-word speaker labels. A speaker change at a long pause is a far
            stronger boundary signal than either on its own.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

STT_URL = "https://api.x.ai/v1/stt"
STT_MODEL = "grok-voice-transcribe-2.0"

VIDEO_EXTS = {".mp4", ".mov", ".mkv", ".m4v", ".avi"}

# Long enough to be a handover rather than a breath or a slide change.
SILENCE_DB = "-30dB"
SILENCE_MIN_SEC = 1.5

# Terms the model would otherwise mangle, independent of who is speaking. The
# per-event names get added to this from the deck's content.ts.
# xAI caps keyterm at 100 entries of 50 chars each.
STANDING_KEYTERMS = [
    "Agentic Engineering", "Lisbon", "agentic", "agent", "agents", "LLM",
    "Claude", "Claude Code", "Anthropic", "OpenAI", "GPT", "Codex", "Cursor",
    "MCP", "Model Context Protocol", "RAG", "embeddings", "vector database",
    "prompt", "prompting", "context window", "token", "tokens", "inference",
    "fine-tune", "fine-tuning", "eval", "evals", "benchmark", "guardrails",
    "orchestration", "subagent", "tool use", "function calling", "harness",
    "repo", "pull request", "PR", "CI", "CD", "deploy", "Docker", "Kubernetes",
    "API", "SDK", "webhook", "latency", "throughput", "observability",
    "TypeScript", "Python", "React", "Next.js", "Astro", "Postgres", "Supabase",
    "onchain", "Stellar", "Solana", "crypto", "wallet", "smart contract",
    "seed round", "pre-seed", "YC", "MVP", "GTM", "churn", "runway",
]

KEYTERM_MAX = 100
KEYTERM_CHARS = 50


def die(msg: str) -> None:
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)


def need(binary: str) -> None:
    if not shutil.which(binary):
        die(f"{binary} not found on PATH")


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def hms(seconds: float) -> str:
    if seconds < 0:
        seconds = 0.0
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def hm(seconds: float) -> str:
    """Compact MM:SS or H:MM:SS — what a human reads off a transcript."""
    h, rem = divmod(int(seconds), 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def parse_ts(value: str) -> float:
    """Accept 93, 1:33, 01:33.5 or 00:01:33.500."""
    value = value.strip()
    if not value:
        die("empty timecode")
    try:
        nums = [float(p) for p in value.split(":")]
    except ValueError:
        die(f"bad timecode: {value!r}")
    total = 0.0
    for n in nums:
        total = total * 60 + n
    return total


# ── the API key ───────────────────────────────────────────────────────────


def api_key() -> str:
    """XAI_API_KEY from the environment, or from .env if present.

    Never printed, never passed as a command-line argument — a key in argv ends
    up in shell history and in any process listing.
    """
    key = os.environ.get("XAI_API_KEY", "").strip()
    if key:
        return key
    for env_file in (Path(".env"), Path(__file__).resolve().parent.parent / ".env"):
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                line = line.strip()
                if line.startswith("XAI_API_KEY="):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if val:
                        return val
    die("XAI_API_KEY is not set.\n"
        "       Add it to .env (gitignored) as XAI_API_KEY=... or export it.")


# ── locating the source ───────────────────────────────────────────────────


def event_dir(arg: str) -> Path:
    d = Path(arg)
    if d.is_dir():
        return d
    alt = Path("content") / arg
    if alt.is_dir():
        return alt
    die(f"not a directory: {arg}")


def find_source(d: Path) -> Path:
    raw = d / "raw"
    if not raw.is_dir():
        die(f"no raw/ directory in {d}")
    vids = sorted(
        (p for p in raw.iterdir()
         if p.suffix.lower() in VIDEO_EXTS and not p.name.startswith(".")),
        key=lambda p: p.stat().st_size, reverse=True)
    if not vids:
        die(f"no video in {raw} (looked for {', '.join(sorted(VIDEO_EXTS))})")
    if len(vids) > 1:
        print(f"note: {len(vids)} videos in raw/, using the largest: {vids[0].name}",
              file=sys.stderr)
    return vids[0]


@dataclass
class Probe:
    duration: float
    vcodec: str
    acodec: str
    width: int
    height: int
    fps: str


def probe(path: Path) -> Probe:
    need("ffprobe")
    r = run(["ffprobe", "-v", "error", "-print_format", "json",
             "-show_format", "-show_streams", str(path)])
    if r.returncode != 0:
        die(f"ffprobe failed: {r.stderr.strip()[:300]}")
    data = json.loads(r.stdout)
    v = next((s for s in data["streams"] if s.get("codec_type") == "video"), {})
    a = next((s for s in data["streams"] if s.get("codec_type") == "audio"), {})
    return Probe(
        duration=float(data.get("format", {}).get("duration", 0.0)),
        vcodec=v.get("codec_name", "?"), acodec=a.get("codec_name", "?"),
        width=int(v.get("width", 0) or 0), height=int(v.get("height", 0) or 0),
        fps=v.get("r_frame_rate", "?"))


# ── keyterms ──────────────────────────────────────────────────────────────


def deck_keyterms(date_slug: str) -> list[str]:
    """Speaker names and affiliations from that event's deck content.ts.

    The deck already holds exactly the proper nouns the transcript will contain,
    and getting those right is most of the quality difference.
    """
    content = Path("src/components") / f"slides-{date_slug}" / "content.ts"
    if not content.exists():
        return []
    text = content.read_text()
    terms: list[str] = []
    for name in re.findall(r"name:\s*['\"]([^'\"]+)['\"]", text):
        terms.append(name)
        terms.extend(p for p in name.split() if len(p) > 2)
    for title in re.findall(r"title:\s*['\"]([^'\"]+)['\"]", text):
        # "Co-Founder, Altana Network" -> the company half is what matters
        if "," in title:
            terms.append(title.split(",", 1)[1].strip())
    return terms


def build_keyterms(date_slug: str, extra: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for t in [*extra, *deck_keyterms(date_slug), *STANDING_KEYTERMS]:
        t = t.strip()
        if not t or len(t) > KEYTERM_CHARS:
            continue
        low = t.lower()
        if low in seen:
            continue
        seen.add(low)
        out.append(t)
        if len(out) >= KEYTERM_MAX:
            break
    return out


# ── audio + transcription ─────────────────────────────────────────────────


def extract_audio(src: Path, dest: Path) -> None:
    """Mono 16 kHz mp3. Speech-grade, and small enough that a three-hour
    recording still lands far under the API's 500 MB ceiling."""
    need("ffmpeg")
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = run(["ffmpeg", "-y", "-i", str(src), "-vn", "-ac", "1", "-ar", "16000",
             "-c:a", "libmp3lame", "-b:a", "64k", str(dest)])
    if r.returncode != 0:
        die(f"audio extraction failed: {r.stderr.strip()[-500:]}")


def slice_audio(src: Path, dest: Path, start: float, length: float) -> None:
    r = run(["ffmpeg", "-y", "-ss", hms(start), "-i", str(src), "-t", hms(length),
             "-c", "copy", str(dest)])
    if r.returncode != 0:
        die(f"audio slice failed: {r.stderr.strip()[-400:]}")


def _multipart(fields: list[tuple[str, str]], file_field: str,
               filename: str, blob: bytes, content_type: str) -> tuple[bytes, str]:
    boundary = "----meetupvideo" + os.urandom(16).hex()
    buf = bytearray()
    for k, v in fields:
        buf += f"--{boundary}\r\n".encode()
        buf += f'Content-Disposition: form-data; name="{k}"\r\n\r\n'.encode()
        buf += v.encode() + b"\r\n"
    buf += f"--{boundary}\r\n".encode()
    buf += (f'Content-Disposition: form-data; name="{file_field}"; '
            f'filename="{filename}"\r\n').encode()
    buf += f"Content-Type: {content_type}\r\n\r\n".encode()
    buf += blob + b"\r\n"
    buf += f"--{boundary}--\r\n".encode()
    return bytes(buf), f"multipart/form-data; boundary={boundary}"


def stt(audio: Path, key: str, keyterms: list[str], lang: str,
        diarize: bool, timeout: int) -> dict:
    fields = [("model", STT_MODEL), ("format", "true")]
    if lang != "auto":
        fields.append(("language", lang))
    if diarize:
        fields.append(("diarize", "true"))
    fields += [("keyterm", t) for t in keyterms]

    body, ctype = _multipart(fields, "file", audio.name,
                             audio.read_bytes(), "audio/mpeg")
    req = urllib.request.Request(
        STT_URL, data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": ctype})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")[:400]
        die(f"xAI STT returned HTTP {e.code}: {detail}")
    except urllib.error.URLError as e:
        die(f"could not reach the xAI API: {e.reason}")


def transcribe_all(audio: Path, key: str, keyterms: list[str], lang: str,
                   diarize: bool, chunk_min: float, work: Path,
                   timeout: int) -> dict:
    """One request when the file is small enough, otherwise chunked with the
    word timestamps shifted back onto the original timeline."""
    total = probe(audio).duration
    if chunk_min <= 0 or total <= chunk_min * 60:
        return stt(audio, key, keyterms, lang, diarize, timeout)

    span = chunk_min * 60
    words: list[dict] = []
    texts: list[str] = []
    n = int(total // span) + (1 if total % span else 0)
    for i in range(n):
        offset = i * span
        part = work / f"chunk-{i:02d}.mp3"
        slice_audio(audio, part, offset, min(span, total - offset))
        print(f"  chunk {i+1}/{n} ({hm(offset)}–{hm(min(offset+span, total))})…",
              file=sys.stderr)
        data = stt(part, key, keyterms, lang, diarize, timeout)
        texts.append(data.get("text", ""))
        for w in data.get("words", []):
            words.append({**w,
                          "start": float(w.get("start", 0)) + offset,
                          "end": float(w.get("end", 0)) + offset})
        part.unlink(missing_ok=True)
    return {"text": " ".join(t.strip() for t in texts if t.strip()),
            "words": words, "duration": total}


# ── turning words into something readable ─────────────────────────────────


def group_words(words: list[dict], gap: float = 1.2) -> list[dict]:
    """Words -> lines, broken on a speaker change or a pause.

    A line per sentence would hide the handovers; this keeps each line anchored
    to a seekable timecode and a speaker, which is what boundary-finding needs.
    """
    lines: list[dict] = []
    cur: dict | None = None
    for w in words:
        text = (w.get("text") or "").strip()
        if not text:
            continue
        start, end = float(w.get("start", 0)), float(w.get("end", 0))
        spk = w.get("speaker")
        new = (cur is None or spk != cur["speaker"] or start - cur["end"] > gap
               or len(cur["text"]) > 220)
        if new:
            if cur:
                lines.append(cur)
            cur = {"start": start, "end": end, "speaker": spk, "text": text}
        else:
            cur["text"] += " " + text
            cur["end"] = end
    if cur:
        lines.append(cur)
    return lines


def write_readable(lines: list[dict], dest: Path) -> None:
    with dest.open("w") as fh:
        for ln in lines:
            spk = f" S{ln['speaker']}" if ln.get("speaker") is not None else ""
            fh.write(f"[{hm(ln['start'])}{spk}] {ln['text']}\n")


def detect_silences(audio: Path, min_len: float) -> list[tuple[float, float]]:
    r = run(["ffmpeg", "-i", str(audio), "-af",
             f"silencedetect=noise={SILENCE_DB}:d={SILENCE_MIN_SEC}", "-f", "null", "-"])
    out, start = [], None
    for line in r.stderr.splitlines():
        m = re.search(r"silence_start:\s*(-?[\d.]+)", line)
        if m:
            start = float(m.group(1))
        m = re.search(r"silence_end:\s*([\d.]+)\s*\|\s*silence_duration:\s*([\d.]+)", line)
        if m and start is not None:
            dur = float(m.group(2))
            if dur >= min_len:
                out.append((start, dur))
            start = None
    return out


def candidates(lines: list[dict], sils: list[tuple[float, float]]) -> list[dict]:
    """Where a long pause coincides with a speaker change — the shape of a
    handover. Still only candidates: the transcript decides."""
    out = []
    for s, dur in sils:
        before = [ln for ln in lines if ln["end"] <= s + 0.5]
        after = [ln for ln in lines if ln["start"] >= s - 0.5]
        if not before or not after:
            continue
        b, a = before[-1], after[0]
        changed = b.get("speaker") != a.get("speaker")
        out.append({"at": s, "silence": dur, "speaker_change": changed,
                    "before": b["text"][-90:], "after": a["text"][:90]})
    out.sort(key=lambda c: (not c["speaker_change"], -c["silence"]))
    return out


# ── commands ──────────────────────────────────────────────────────────────


def cmd_probe(args) -> None:
    d = event_dir(args.event)
    src = find_source(d)
    p = probe(src)
    print(f"source   : {src}")
    print(f"size     : {src.stat().st_size / 1e9:.2f} GB")
    print(f"duration : {hms(p.duration)}  ({p.duration/60:.1f} min)")
    print(f"video    : {p.vcodec} {p.width}x{p.height} @ {p.fps}")
    print(f"audio    : {p.acodec}")


def cmd_transcribe(args) -> None:
    d = event_dir(args.event)
    src = find_source(d)
    work = d / "work"
    work.mkdir(exist_ok=True)
    key = api_key()

    audio = work / "audio.mp3"
    if audio.exists() and not args.force:
        print(f"reusing {audio}", file=sys.stderr)
    else:
        print("extracting audio…", file=sys.stderr)
        extract_audio(src, audio)
    size_mb = audio.stat().st_size / 1e6
    if size_mb > 500:
        die(f"audio is {size_mb:.0f} MB, over the API's 500 MB limit — "
            f"pass --chunk-minutes 20")

    keyterms = build_keyterms(d.name, args.keyterm or [])
    (work / "keyterms.txt").write_text("\n".join(keyterms) + "\n")

    print(f"transcribing {size_mb:.0f} MB with {STT_MODEL} "
          f"({len(keyterms)} keyterms, diarize={not args.no_diarize})…",
          file=sys.stderr)
    data = transcribe_all(audio, key, keyterms, args.lang,
                          not args.no_diarize, args.chunk_minutes, work,
                          args.timeout)

    (work / "transcript.json").write_text(json.dumps(data, indent=1))
    words = data.get("words", [])
    lines = group_words(words)
    write_readable(lines, work / "transcript.timed.txt")
    (work / "transcript.txt").write_text((data.get("text") or "") + "\n")

    sils = detect_silences(audio, args.min_silence)
    cands = candidates(lines, sils)
    with (work / "boundaries.txt").open("w") as fh:
        fh.write("# candidate talk boundaries — a long pause, ranked with\n")
        fh.write("# speaker changes first. CONFIRM against transcript.timed.txt.\n\n")
        for c in cands[:40]:
            mark = "SPEAKER CHANGE" if c["speaker_change"] else "pause"
            fh.write(f"{hm(c['at'])}  {c['silence']:.1f}s  {mark}\n")
            fh.write(f"    …{c['before']}\n")
            fh.write(f"    >>> {c['after']}…\n\n")

    speakers = sorted({ln["speaker"] for ln in lines if ln.get("speaker") is not None})
    dur = data.get("duration") or probe(src).duration
    print()
    print(f"source        : {src.name}  ({dur/60:.1f} min)")
    print(f"words         : {len(words)}")
    print(f"lines         : {len(lines)}")
    print(f"speakers found: {len(speakers)}")
    print(f"candidates    : {len(cands)} ({sum(1 for c in cands if c['speaker_change'])} with a speaker change)")
    print()
    print("written:")
    for f in ("transcript.timed.txt", "transcript.txt", "transcript.json",
              "boundaries.txt", "keyterms.txt"):
        print(f"  {work / f}")
    print()
    print("next: read transcript.timed.txt to pin each talk's start and end,")
    print("      then:  meetup_video.py cut <event> --talk 'Name@START-END' …")


def slugify(name: str) -> str:
    s = re.sub(r"[^\w\s-]", "", name.lower())
    return re.sub(r"[\s_]+", "-", s).strip("-") or "talk"


def cut_clip(src: Path, dest: Path, start: float, end: float, mode: str) -> None:
    need("ffmpeg")
    dest.parent.mkdir(parents=True, exist_ok=True)
    length = end - start
    if length <= 0:
        die(f"{dest.name}: end must be after start")
    if mode == "copy":
        # Instant and lossless, but -ss before -i snaps to the nearest keyframe,
        # so the clip can start early and may open on a frozen frame.
        cmd = ["ffmpeg", "-y", "-ss", hms(start), "-i", str(src), "-t", hms(length),
               "-c", "copy", "-avoid_negative_ts", "make_zero", str(dest)]
    else:
        vcodec = (["-c:v", "h264_videotoolbox", "-b:v", "10M"] if mode == "hw"
                  else ["-c:v", "libx264", "-preset", "veryfast", "-crf", "20"])
        cmd = ["ffmpeg", "-y", "-ss", hms(start), "-i", str(src), "-t", hms(length),
               *vcodec, "-c:a", "aac", "-b:a", "192k",
               "-movflags", "+faststart", str(dest)]
    r = run(cmd)
    if r.returncode != 0:
        die(f"cut failed for {dest.name}: {r.stderr.strip()[-500:]}")


def cmd_splice(args) -> None:
    """Build one clip from several spans of the source.

    For a talk that has to be reassembled: a demo that failed live and was shown
    later, dead air while someone fights a projector, a question that interrupts.
    Each span is encoded with identical settings so the pieces concatenate
    without a re-encode of the join.
    """
    d = event_dir(args.event)
    src = find_source(d)
    total = probe(src).duration
    clips = d / "clips"
    clips.mkdir(exist_ok=True)

    spans = []
    for spec in args.span:
        if "-" not in spec:
            die(f"--span needs START-END, got {spec!r}")
        a, _, b = spec.partition("-")
        start, end = parse_ts(a), parse_ts(b)
        if end <= start:
            die(f"span {spec}: end must be after start")
        if end > total + 1:
            die(f"span {spec}: end {hm(end)} is past the source ({hm(total)})")
        spans.append((start, end))

    out = clips / f"{args.out}.mp4"
    kept = sum(e - s for s, e in spans)
    print(f"source: {src.name}  ({hm(total)})")
    for i, (s, e) in enumerate(spans, 1):
        print(f"  part {i}  {hm(s)} → {hm(e)}  ({(e-s)/60:5.2f} min)")
    print(f"  → {out.name}  ({kept/60:.2f} min from {len(spans)} parts)")
    if args.dry_run:
        print("\n(dry run, nothing written)")
        return

    work = d / "work" / "_splice"
    work.mkdir(parents=True, exist_ok=True)
    parts = []
    for i, (s, e) in enumerate(spans):
        part = work / f"part{i:02d}.mp4"
        print(f"encoding part {i+1}/{len(spans)}…", file=sys.stderr)
        cut_clip(src, part, s, e, args.mode)
        parts.append(part)

    listing = work / "concat.txt"
    listing.write_text("".join(f"file '{p.resolve()}'\n" for p in parts))
    r = run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listing),
             "-c", "copy", "-movflags", "+faststart", str(out)])
    if r.returncode != 0:
        die(f"concat failed: {r.stderr.strip()[-500:]}")

    got = probe(out).duration
    drift = got - kept
    flag = "" if abs(drift) < 1.5 else f"  ⚠ {drift:+.1f}s vs the sum of the spans"
    print(f"\n  {out}  ({got/60:.2f} min){flag}")
    for p in parts:
        p.unlink(missing_ok=True)
    listing.unlink(missing_ok=True)


def cmd_cut(args) -> None:
    d = event_dir(args.event)
    src = find_source(d)
    total = probe(src).duration
    clips = d / "clips"
    clips.mkdir(exist_ok=True)

    specs = []
    for i, spec in enumerate(args.talk, 1):
        if "@" not in spec:
            die(f"--talk needs Name@START-END, got {spec!r}")
        name, _, span = spec.partition("@")
        if "-" not in span:
            die(f"--talk needs START-END, got {span!r}")
        a, _, b = span.partition("-")
        start, end = parse_ts(a), parse_ts(b)
        if end > total + 1:
            die(f"{name}: end {hm(end)} is past the source ({hm(total)})")
        specs.append((i, name.strip(), start, end))

    for (_, n1, _, e1), (_, n2, s2, _) in zip(specs, specs[1:]):
        if s2 < e1:
            print(f"warning: {n1} ends {hm(e1)} but {n2} starts {hm(s2)} — overlap",
                  file=sys.stderr)

    print(f"source: {src.name}  ({hm(total)})")
    for i, name, start, end in specs:
        out = clips / f"{i:02d}-{slugify(name)}.mp4"
        print(f"  {i:02d}  {hm(start)} → {hm(end)}  ({(end-start)/60:5.1f} min)  {out.name}")
    if args.dry_run:
        print("\n(dry run, nothing written)")
        return
    print()
    for i, name, start, end in specs:
        out = clips / f"{i:02d}-{slugify(name)}.mp4"
        print(f"cutting {out.name}…", file=sys.stderr)
        cut_clip(src, out, start, end, args.mode)
        got = probe(out).duration
        drift = got - (end - start)
        flag = "" if abs(drift) < 1.0 else f"  ⚠ {drift:+.1f}s vs requested"
        print(f"  {out}  ({got/60:.1f} min){flag}")


def main() -> None:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("probe", help="what is in raw/")
    p.add_argument("event")
    p.set_defaults(func=cmd_probe)

    p = sub.add_parser("transcribe", help="audio -> transcript + boundary candidates")
    p.add_argument("event")
    p.add_argument("--lang", default="en", help="'auto' to detect (default: en)")
    p.add_argument("--keyterm", action="append",
                   help="extra term to bias toward; repeatable")
    p.add_argument("--no-diarize", action="store_true",
                   help="skip per-word speaker labels")
    p.add_argument("--chunk-minutes", type=float, default=0,
                   help="split the audio into N-minute chunks (default: one request)")
    p.add_argument("--min-silence", type=float, default=2.0,
                   help="shortest pause treated as a candidate (default: 2.0)")
    p.add_argument("--timeout", type=int, default=1800,
                   help="per-request timeout in seconds (default: 1800)")
    p.add_argument("--force", action="store_true", help="re-extract audio")
    p.set_defaults(func=cmd_transcribe)

    p = sub.add_parser("cut", help="cut talks out of the source")
    p.add_argument("event")
    p.add_argument("--talk", action="append", required=True, metavar="NAME@START-END",
                   help="repeat per talk, e.g. --talk 'Tim Haldorsson@12:04-22:31'")
    p.add_argument("--mode", choices=["hw", "x264", "copy"], default="hw",
                   help="hw: videotoolbox, frame accurate, fast (default); "
                        "x264: slower, more portable; "
                        "copy: instant but snaps to keyframes")
    p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_cut)

    p = sub.add_parser("splice", help="build one clip from several spans")
    p.add_argument("event")
    p.add_argument("--span", action="append", required=True, metavar="START-END",
                   help="repeat in playback order, e.g. --span 19:23-27:08")
    p.add_argument("--out", required=True, help="output basename, no extension")
    p.add_argument("--mode", choices=["hw", "x264", "copy"], default="hw")
    p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_splice)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
