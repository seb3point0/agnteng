---
name: meetup-video
description: Turn an Agentic Engineering meetup recording into per-talk video clips and a talk-descriptions markdown file. Use whenever raw event footage lands in content/<date>/raw/, or the user asks to cut the talks, transcribe an event, or write up the talks from a recording.
---

# Meetup video → clips + descriptions

One camera file per event. An optional intro nobody wants cut, then three
~10 minute talks. The job: find where each talk starts and ends, cut them out,
and write a description for each in the house style.

`scripts/meetup_video.py` owns the mechanical half. Reading the transcript and
deciding the boundaries is yours — see **Why boundaries aren't automated**.

## Setup, once

`XAI_API_KEY` in `.env` at the repo root (gitignored). Transcription is xAI's
`grok-voice-transcribe-2.0`. `ffmpeg` and `ffprobe` must be on PATH.

## The workflow

### 1. Confirm what landed

```sh
python3 scripts/meetup_video.py probe content/<YYYY-MM-DD>
```

Duration, codecs, size. If it's much shorter than an event, the camera split the
recording — the script takes the largest file in `raw/` and says so. Ask before
proceeding on a partial file.

### 2. Transcribe

```sh
python3 scripts/meetup_video.py transcribe content/<YYYY-MM-DD>
```

Extracts mono 16 kHz mp3, sends it to xAI, and writes into `content/<date>/work/`:

| File | What |
|---|---|
| `transcript.timed.txt` | **Read this one.** One line per speaker-turn, each with a seekable timecode and speaker label |
| `boundaries.txt` | Candidate cut points — long pauses, speaker changes ranked first, with the words either side |
| `transcript.txt` | Flat text, for writing the descriptions |
| `transcript.json` | Raw API response, word-level timings |
| `keyterms.txt` | What the model was biased toward |

Two options do most of the quality work, both on by default:

- **`keyterm`** biases the model toward terms it would otherwise mangle. Seeded
  automatically from that event's `src/components/slides-<date>/content.ts` —
  speaker names, their companies, the sponsor — plus a standing vocabulary of
  agentic-engineering jargon. Add more with `--keyterm 'Some Product'`. This is
  what stops "Altana Network" coming back as "Atlanta network".
- **`diarize`** labels each word with a speaker. A speaker change at a long
  pause is a much stronger handover signal than either alone.

Long recordings: `--chunk-minutes 20` splits the audio and stitches the
timestamps back onto the original timeline. Only needed past the API's 500 MB
ceiling — about 17 hours at this bitrate — or if a single request times out.

### 3. Find the boundaries — read, don't guess

Open `transcript.timed.txt`. Start from `boundaries.txt`, but confirm every cut
against the transcript. What you're looking for:

- **Start of a talk:** the host finishing an introduction — "please welcome",
  "our next speaker is", "take it away" — then a speaker change. The talk starts
  at the *new speaker's first word*, not at the host's last.
- **End of a talk:** "thank you", applause, the host coming back. End *after*
  the applause, not on the speaker's last word — cutting tight sounds abrupt.
- **The intro is not a talk.** Leave it out unless asked.
- **Expect three.** Fewer means a handover was missed; more means a mid-talk
  pause was mistaken for one. Both are reasons to re-read, not to proceed.

Give a couple of seconds of air either side. Then state the boundaries you found
and what evidence put them there, so they can be corrected before anything is
encoded.

### 4. Cut

```sh
python3 scripts/meetup_video.py cut content/<YYYY-MM-DD> \
  --talk 'Tim Haldorsson@12:04-22:31' \
  --talk 'Doris Hernandez Argueta@24:10-34:02' \
  --talk 'Jeremy Healsmith@35:48-45:30' --dry-run
```

`--dry-run` first — it prints the spans and durations without encoding. A talk
far off ten minutes is a wrong boundary. Drop the flag to write
`clips/01-tim-haldorsson.mp4` and so on.

`--mode hw` (the default) is hardware H.264 on Apple Silicon: frame accurate and
fast. `--mode copy` is instant and lossless but snaps to the nearest keyframe,
so a clip can start up to a GOP early and open on a frozen frame — the script
warns when the result drifts more than a second from what was asked for. Use it
only for a rough check.

### 5. Write the descriptions

Read `references/descriptions.md` for the house format and six real examples,
then write one description per talk into `content/<date>/talks.md`.

Speaker names and affiliations come from
`src/components/slides-<date>/content.ts`. Luma has the registration data if
something is missing — `src/lib/luma.ts` is the client, and the event id is in
that same `content.ts`.

Leave placeholders for anything not on hand — video URLs, social links — and
list what's missing at the end. Don't block on metadata, and don't invent a
link.

## Why boundaries aren't automated

Silence alone is a bad signal: speakers pause mid-talk, rooms applaud mid-talk,
a demo sits quiet for thirty seconds. Diarization alone is no better — a Q&A
exchange looks exactly like a handover. The reliable signal is what's actually
said at the transition, which needs reading.

So the script gathers evidence and something that can read decides. A wrong
boundary wastes an encode and ships a clip that opens mid-sentence; the minute
spent reading the transcript is cheaper than either.

## Gotchas

- **Never edit `raw/`.** Original filenames stay as they are so a clip can
  always be traced back to its source and timecode.
- **Media is gitignored.** `raw/` and `clips/` contents, and every common video
  and audio extension. `talks.md` and `README.md` are tracked.
- **`work/` is disposable** but not gitignored by the media rules — the
  transcripts are small and worth keeping alongside the write-up.
- **Check the speaker count** against the event's `SPEAKERS` in `content.ts`
  before trusting diarization. The host counts as a speaker, so three talks
  usually means four or more labels.
