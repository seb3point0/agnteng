# Agentic Engineering Lisbon — 23 September 2026

Working folder for this event's video and the write-up.

## Where things go

| Path | What |
|---|---|
| `raw/` | Drop the camera files here, untouched. Never edited in place, never committed. |
| `clips/` | ffmpeg output — per-talk cuts, social crops. Not committed. |
| `article.md` | The write-up. This *is* committed. |

Media is gitignored (see the `content/` block in `/.gitignore`). A single talk
recording is bigger than this whole repo, and GitHub rejects files over 100 MB —
so the videos live here on disk and get published elsewhere, while only the
article is tracked.

Original filenames in `raw/` are left alone so a clip can always be traced back
to the source file and timecode it came from.

## Making the clips

```sh
python3 scripts/meetup_video.py probe      content/2026-09-23
python3 scripts/meetup_video.py transcribe content/2026-09-23   # needs XAI_API_KEY
python3 scripts/meetup_video.py cut        content/2026-09-23 --talk 'Name@START-END' …
```

Transcription is xAI `grok-voice-transcribe-2.0`, biased toward the speaker and
company names in `src/components/slides-2026-09-23/content.ts`. Put
`XAI_API_KEY=...` in the repo-root `.env` (gitignored).

`work/` holds the transcripts — tracked, they're small and worth keeping next to
the write-up. `work/audio.mp3` is not. The full workflow, including how to read
the transcript for talk boundaries, is in `.claude/skills/meetup-video/`.

Source: `raw/C0083.MP4` — 45.9 min, 1920x1080, 21.4 GB (uncompressed PCM audio).

## The event

- **Venue:** Lunar Strategy, Av. Duque de Loulé 24A, Lisboa
- **Luma:** [luma.com/kqlbak7w](https://luma.com/kqlbak7w) (`evt-S0uIAjkttvEDJ6Z`)
- **Deck:** [/slides/lisbon-2026-09-23](https://branding.agnteng.com/slides/lisbon-2026-09-23)

### Speakers, in running order

1. **Tim Haldorsson** — CEO, Lunar Strategy
2. **Doris Hernandez Argueta** — Co-Founder, Altana Network
3. **Jeremy Healsmith** — Co-Founder, Pravi

Talk titles aren't recorded anywhere — they need to come off the video or from
memory before the article can name them.

### Numbers, pulled from Luma on 2026-10-08

- **160** registered
- **37** checked in

Treat the 37 with care. Check-in depends on people actually being scanned at the
door, and 23% of registrations is far below what the room looked like. It is
more likely a measure of how rigorously check-in was run than of attendance. For
the article, either count the room from the video or describe the turnout
without a hard number.

Of the 37 who were scanned in: 22 founders, 9 engineers, 2 PMs, and one each of
VC/investor, marketer, BD/sales and DevRel. Five flagged that they are raising in
the next six months, two looking for a co-founder, two looking for a new role,
one hiring.

### Supporters

lajarre · Misha Kolesnik · ARTEM TOMIUK · Igor · Ryan Dickinson

### Sponsor

HackMeridian — Stellar's hackathon, 25–26 October, Warehouse ONE16 Lisbon.
