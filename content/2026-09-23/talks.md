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
| `clips/02-doris-hernandez-argueta.mp4` | 19:23–29:48 | 10.4 min | "Hi guys, thank you so much for hosting this" → "that's pretty much it. Thank you so much. [applause]" |
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

**Doris's talk has an addendum.** Her screen share died around 28:30 ("it's not
able to connect to the TV") and she finished without the demo. She came back
after Jeremy's talk, at **43:00–45:15**, to show the output — the visual-identity
harness and `senddo.design`. That segment is *not* in her clip, because it isn't
contiguous with her talk. It's worth appending if the video is edited rather
than cut.

**Q&A is excluded.** The host held questions to the end, so the Q&A at
41:20–43:00 covers all three talks at once and doesn't belong to any single
clip.
