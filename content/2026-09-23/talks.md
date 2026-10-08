# Agentic Engineering Lisbon #5 — 23 September 2026

Lunar Strategy, Av. Duque de Loulé 24A. Three talks, written in the house
format. Video URLs and some social links are placeholders — see **Still
missing** at the bottom.

---

[A Bot for Every Part of the Job](VIDEO_URL)
Tim Haldorsson walks through the Grokbot setup his marketing team runs daily, one agent per area of the work.
Main Takeaways

An agent is a goal, a harness in the middle, and the data you feed it
One bot per area of daily work: intel, outreach, content, experiments, images
His intel bot replaced six news sites, delivering relevant articles twice a day
An "overheard" bot catches Reddit and X mentions a team would otherwise miss
Agents grouped into teams share one conversation, each keeping its own history
Tim's [X](X_URL), [LinkedIn](LINKEDIN_URL)

---

[Harnesses Matter More Than Models](VIDEO_URL)
Doris Hernandez Argueta breaks down what a harness actually is, and builds one with five orchestrated agents in 30 hours.
Main Takeaways

An agent is a model plus a harness — the two are not interchangeable
A harness is tools, memory, context, guardrails, and above all evaluation
Evaluation is the core: can the agent tell success, and loop until it gets there
Y Combinator's last batch backed two things — hardware and harnesses
Her 30-hour build ran a PM agent orchestrating frontend, backend, engine and QA
Doris's [X](X_URL), [GitHub](GITHUB_URL), [LinkedIn](LINKEDIN_URL)

---

[LLMs Are Structurally Anti-Privacy](VIDEO_URL)
Jeremy Healsmith shows why stripping PII fails, using k-anonymity and his NGO work with former child soldiers.
Main Takeaways

"Strip the names out" is structurally insufficient — LLMs persist across sessions
Family of five, arrived March, daughter with an impairment: identified in 3,000
Each aid-worker session adds one attribute until the model can name the person
Stripped medical records re-identify after seven or eight doctor visits
If a watermark can encode one bit, nothing stops it encoding your IP and session
Capture fields, not narratives. Tell the model only what it needs
Jeremy's [X](X_URL), [GitHub](GITHUB_URL), [LinkedIn](LINKEDIN_URL)

---

## The clips

| File | Span | Length | Opens / closes on |
|---|---|---|---|
| `clips/01-tim-haldorsson.mp4` | 7:58–18:13 | 10.2 min | "All right. So today I'm going to dive into Grokbot" → "Thanks so much for listening. [applause]" |
| `clips/02-doris-hernandez-argueta.mp4` | spliced, see below | 10.9 min | "Hi guys, thank you so much for hosting this" → the demo, ending "thank you very much, guys. [applause]" |
| `clips/03-jeremy-healsmith.mp4` | 31:18–41:21 | 10.1 min | "Hello, I'm Jeremy" → "thank you very much. [applause]" |

Each boundary was checked against the audio of the finished clip, not just the
transcript. ~750 MB each: the camera shoots 1080p100, so the clips inherit that
frame rate. Re-cut with `-r 30` if upload size matters.

## Still missing

- **Video URLs** for all three, once they're uploaded.
- **Social links** for all three speakers. The deck carried names and
  affiliations only, and nobody gave handles on stage.
- **Talk titles are proposed, not given.** None of the three announced a title,
  so these are written in the series' voice from what the talk actually argued.
  Change them freely.
- **Tim's affiliation** — he's CEO of Lunar Strategy, which also hosted. He
  opened by presenting the venue before his talk; that part is not in the clip.

## Two things worth knowing about the cut

**Doris's clip is spliced from four spans.** Her screen share died mid-talk and
she finished without the demo, then came back after Jeremy's talk to show it.
The clip removes both dead patches and appends the recovered demo:

| Span | What |
|---|---|
| 19:23–27:08 | the talk, up to the moment the demo fails |
| 28:10–29:48 | *(62s of the failed demo cut)* takeaways, close, applause |
| 43:07–43:19 | her bridge: "I just want to show you the output" |
| 43:54–45:15 | *(34s of a second fumble cut)* the demo, close, applause |

The demo is **appended rather than injected** into the gap where it failed.
Injecting it there would have her deliver the demo and then say "I can continue
without it" — the surrounding audio contradicts the splice. As a coda it plays
naturally, and her bridge line explains why it's there.

Rebuild it with:

```sh
python3 scripts/meetup_video.py splice content/2026-09-23 \
  --out '02-doris-hernandez-argueta' \
  --span '19:23-27:08' --span '28:10-29:48' \
  --span '43:07-43:19' --span '43:54-45:15'
```

**Q&A is excluded.** The host held questions to the end, so the Q&A at
41:20–43:00 covers all three talks at once and doesn't belong to any single
clip.
