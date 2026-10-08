---
name: meetup-video
description: Turn an Agentic Engineering meetup recording into per-talk video clips and a talk-descriptions markdown file. Use whenever raw event footage lands in content/<date>/raw/, or the user asks to cut the talks, transcribe an event, or write up the talks from a recording.
---

# Meetup video → clips + descriptions

One camera file per event. An opening by the host that nobody wants cut, then
three ~10 minute talks separated by applause and a setup break. The job: find
each talk, cut it, and describe it in the house style.

## Setup, once

`OPENROUTER_API_KEY` in `.env` at the repo root (gitignored). `ffmpeg` and
`ffprobe` on PATH.

**Transcription goes through OpenRouter's chat-completions API with an
`input_audio` content block.** OpenRouter does *not* proxy a speech-to-text
endpoint — there is no `/v1/audio/transcriptions`, and xAI's
`grok-voice-transcribe-2.0` is not reachable through it. Audio-capable chat
models are, and `google/gemini-2.5-flash` is the cheap, accurate default
(roughly $0.003 per 90 seconds; a 46-minute event costs well under a dollar).

## The workflow

```sh
python3 scripts/meetup_video.py probe content/<YYYY-MM-DD>

python3 scripts/transcribe_chunks.py content/<YYYY-MM-DD>/work/audio.mp3 \
  --out content/<YYYY-MM-DD>/work/coarse.json --seconds 60 --workers 10

python3 scripts/detect_talks.py content/<YYYY-MM-DD>

python3 scripts/meetup_video.py cut content/<YYYY-MM-DD> \
  --talk 'Name@7:58-18:13' --talk … --dry-run
```

`meetup_video.py transcribe` is the older single-request path and is **not**
used — it targets the xAI endpoint directly. Use `transcribe_chunks.py`.

### Why two passes

Timing and context pull in opposite directions:

- **coarse** — 60s chunks over the whole recording. Shows the shape of the
  event, but locates a boundary only to within a minute.
- **fine** — 5s chunks in a 90s window around each coarse boundary. Pins the
  exact second a speaker opens or applause dies.

`detect_talks.py` runs both and writes `work/talks.json`.

### Timing comes from the chunk grid, never from the model

A model asked to timestamp 46 minutes of audio drifts, and **the drift is
invisible** — the text reads fine while the numbers wander. Chunk `i` starts at
`i * seconds` because that is where ffmpeg cut it, so timing is exact by
construction and the model is only ever asked *what* was said. The structural
judgement — which handover starts which talk — is the one part worth a model.

### What a boundary looks like

From the 2026-09-23 recording, which is the reference case:

```
 7:25 | So, Tim, you can come up for your talk.     ← host hands over
 7:30 | [silence]                                    ← setup
 8:00 | Alright                                      ← TALK STARTS
18:00 | That was it. Thanks so much for listening. [applause]
18:05 | [applause]
18:10 | I have the $200 one and I have never hit the max.   ← TALK ENDS, chatter
```

Start at the speaker's first word, not the host's last. End after the applause
finishes, not on the closing line — cutting tight sounds abrupt. Two seconds of
air before, three after.

### Rebuilding a talk that isn't contiguous

A talk whose demo failed live and got shown later, or that has a minute of dead
air while someone fights a projector, is assembled from spans:

```sh
python3 scripts/meetup_video.py splice content/<date> --out '02-name' \
  --span '19:23-27:08' --span '28:10-29:48' --span '43:54-45:15' --dry-run
```

Spans play in the order given. Each is encoded with identical settings so the
joins concatenate without re-encoding, and the result is checked against the sum
of the spans.

**Append the late material, don't inject it.** On 2026-09-23 the obvious move
was to drop the recovered demo into the gap where it failed — but the audio
either side contradicts that: she says "I can continue without it" moments after
where the demo would now sit. Appended after her closing applause it plays as a
coda, and her own bridge line ("I just want to show you the output") explains
why it's there. Check what the speaker *says* around a splice before deciding
where it goes.

## Traps, all of them hit for real

**Silence detection does not work in a live room.** `silencedetect` at -30dB
found exactly one gap in 46 minutes. Forty people in a room never drop that low.
The transcript is the signal; acoustic analysis is not.

**A window past the end of the file makes the model hallucinate.** ffmpeg
produces empty chunks and the model invents plausible speech to fill them — on
this recording it produced confident applause and dialogue for audio that does
not exist. `transcribe_chunks.py` clamps to the real duration; do not remove
that.

**A coarse chunk can be wrong where a fine chunk is right.** The 30:00 coarse
chunk reported a Q&A exchange that the 5s pass showed to be 90 seconds of
silence. Shorter windows give the model less room to drift. When they disagree,
trust the fine pass.

**Count the talks before trusting the structure.** On this recording the third
speaker's segment appeared to run to 45:15, which would have made it a 14-minute
talk. It was actually two things: Jeremy's talk ending at 41:10, and the
*second* speaker returning at 43:00 to demo what a screen-share failure stopped
her showing live. A talk far off ten minutes is a wrong boundary, not a long
talk — go back and read.

**zsh does not word-split unquoted variables.** `for w in "a b c"; do set -- $w`
silently passes empty arguments. Write the invocations out.

## Writing the descriptions

Read `references/descriptions.md` — the house format and six real examples from
the Substack. Write one per talk into `content/<date>/talks.md`.

Speaker names and affiliations come from `src/components/slides-<date>/content.ts`.
The transcript is the better source for what was actually said — the planned
line-up and the real one differ. On 2026-09-23 the host confirmed the second
speaker's name only in passing at 41:35 ("or Jeremy or Doris"), which is the
kind of detail worth grepping for.

Leave placeholders for video URLs and social links, and list what is missing at
the end. Never guess a handle.

## Gotchas

- **Never edit `raw/`.** Original filenames stay so a clip traces back to its
  source and timecode.
- **Media is gitignored**, `raw/` and `clips/` contents and every common video
  and audio extension. `talks.md`, `README.md` and the transcripts are tracked.
- **Check the source frame rate.** This camera records 1080p100, so clips are
  large. Add `-r 30` to the cut if that matters for upload.
