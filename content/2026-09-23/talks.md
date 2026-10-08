# Agentic Engineering Lisbon #5 — 23 September 2026

Lunar Strategy, Av. Duque de Loulé 24A. Three talks, written in the house
format. Video URLs and some social links are placeholders — see **Still
missing** at the bottom.

---

[A Bot for Every Part of the Job](VIDEO_URL)
Tim Haldorsson shows the Grokbot setup his marketing agency runs on, with a separate bot for each part of his day.
Main Takeaways

He replaced the six sites he used to read every morning with one bot that briefs him twice a day
An "overheard" bot watches Reddit and X for mentions the team would otherwise hear about secondhand
His content and BD "teams" are several agents in one chat, each with its own history, and he asks them for status like people
Grokbot is free with X Premium and comes with X API credits, which is why he moved off everything else
Tim's [X](X_URL), [LinkedIn](LINKEDIN_URL)

---

[Harnesses Matter More Than Models](VIDEO_URL)
Doris Hernandez Argueta argues the harness matters more than the model, and walks through the one she built with five agents in 30 hours.
Main Takeaways

The part that matters is evaluation. If the agent can tell when it's done, it can run the loop until it is
Five agents built her visual identity tool, a PM reviewing every PR from the frontend, backend, engine and QA agents
A YAML heartbeat checked every ten minutes that nothing had died, because an expired API quietly stopping an agent is the normal failure
She had spent seven weeks on it by hand first. Knowing the outcome is what made the 30 hours possible
Doris's [X](X_URL), [GitHub](GITHUB_URL), [LinkedIn](LINKEDIN_URL)

---

[LLMs Are Structurally Anti-Privacy](VIDEO_URL)
Jeremy Healsmith shows why stripping names out of prompts protects nobody, drawing on his work with an NGO for former child soldiers.
Main Takeaways

Taking the names out doesn't help, because the model keeps what it learned across sessions
Family of five, arrived in March, eldest daughter with a mobility impairment. That's enough to find one person in a camp of 3,000
Every conversation an aid worker has adds one more attribute, until there's only one person it can be
Capture fields, not narratives, and don't let the model keep what it doesn't need in its MD files
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
