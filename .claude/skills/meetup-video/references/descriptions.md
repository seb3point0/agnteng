# Talk description format

The output sits in a list beside previous ones on
[agnteng.substack.com](https://agnteng.substack.com/). Consistency with those
matters more than creativity — it has to look like it belongs. A reader scans
one in about twenty seconds.

## Template

```
[Talk Title](video-url)
One sentence: Speaker Full Name + active verb + what the talk covers and how.
Main Takeaways

Bullet 1
Bullet 2
Bullet 3
Bullet 4
Speaker's [X](url), [GitHub](url), [LinkedIn](url)
```

Bare lines, not markdown bullets. No headers other than the literal text
"Main Takeaways". No intro or outro prose around the description.

## The title

Short and punchy — often a pun, a question, or a flat claim. "Faster Isn't
Free", "Nobody Reviews 4,093 PRs a Month", "Mind as Model". Not a description of
the topic. If the speaker didn't give one, propose one in that voice and flag it
as proposed.

## The one-line summary

- Opens with the speaker's full name and an active present-tense verb: *shows,
  breaks down, walks through, describes, demos, presents, explains, shares*.
- States both the subject and the method — what they built, demoed or argued,
  and through what.
- One sentence.

## Main Takeaways

- **4 bullets by default.** 5 only when a fifth idea genuinely stands alone.
  Fewer than 4 only for a short demo talk.
- **15 words maximum per bullet.** Count them. Over? Cut qualifiers, not
  substance.
- Each is a self-contained idea a reader gets without watching — a claim, a
  pattern, an architecture, or a number. Not a chapter marker: never "He then
  discusses X".
- **Keep the concrete specifics.** Dollar amounts, token counts, percentages,
  tool names, named patterns. These carry most of the value: "Over 15 million
  payments totaling $1M processed monthly", "17,000 to 1,400 tokens",
  "roughly six months of salary".
- Punchy and declarative. Opinionated phrasing from the talk survives intact —
  don't smooth a strong claim into neutral summary-speak.
- Order: thesis first, then architecture or mechanism, then war stories or
  numbers, then the prescriptive takeaway.

## The speaker line

Possessive first name, then whichever platforms exist, comma separated:

```
Sean's [X](https://x.com/scrollinondubs), [GitHub](https://github.com/scrollinondubs), [LinkedIn](https://www.linkedin.com/in/seantierney/)
```

A platform the speaker doesn't have is **omitted entirely** — Rachel's line
below carries only GitHub and LinkedIn. A website can take X's place where
that's what they have. Unknown URLs become placeholders, flagged at the end;
never guess a handle.

## Length

Roughly 90–130 words total. If a draft runs long, cut the bullets down before
touching the summary sentence.

---

# Six real examples

## Lisbon #3 — 26 Aug 2026

```
[AiFi](https://www.youtube.com/watch?v=YCtQPsC0pJA)
Youssef Allali discusses x402, a protocol enabling agents to make onchain payments for data access.
Main Takeaways

Payment infrastructure wasn't designed for agents without traditional banking requirements
x402 implements HTTP 402 with onchain settlement for per-query microtransactions
Over 15 million payments totaling $1M processed monthly at minimal cost
Major platforms like Cloudflare and AWS already support it
Data subscriptions shift from monthly fees to "five cents per query"
Youssef's [X](https://x.com/0xyoussea), [GitHub](https://github.com/youssefea), [LinkedIn](https://www.linkedin.com/in/youssef-el-allali/)
```

```
[Nobody Reviews 4,093 PRs a Month](https://www.youtube.com/watch?v=yQT7knDtpUw)
Harley Alexander explains how PostHog automated pull request review to handle 5,000 merged PRs monthly.
Main Takeaways

Agents generate 81% of pull requests despite only 15% headcount growth
Automated review systems categorize PRs by risk level
Deterministic approval gates bypass human review; security decisions remain human-controlled
PR complexity increased but reversion rates dropped
Computational resources scaled faster than human attention
Harley's [GitHub](https://github.com/mayteio), [LinkedIn](https://www.linkedin.com/in/harleytalexander/)
```

```
[Design to Code for Enterprise Systems](https://www.youtube.com/watch?v=_T7etJSiCfc)
Joel D'Silva describes four systems Nokia's design team built to constrain coding agents within enterprise design guidelines.
Main Takeaways

Agents need constraints, not expanded context
Documentation drift causes agents to implement unavailable patterns
Validation loops catch violations before code merges
Machine-parseable logs outperform prose documentation
A Figma plugin reduced screen context from 17,000 to 1,400 tokens
Joel's [Website](https://joeldsilva.com/), [GitHub](https://github.com/joeldfs), [LinkedIn](https://www.linkedin.com/in/joeldsilvaf/)
```

## Lisbon #2 — 29 Jul 2026

```
[Faster Isn't Free](VIDEO_URL)
AI gave back productivity, not hours, and explains why moving from the creative seat to the reviewing seat is quietly draining people.
Main Takeaways

Reviewing agent output replaces earned dopamine with spike-and-crash hits that lower your baseline.
Parallel tabs and agents erase natural pauses; nothing finishes, so background stress never stops.
AI burnout never hits while you type. It hits at 9pm, Sunday evening.
Losing one burned-out person who stayed costs a founder roughly six months of salary.
We sandbox our agents obsessively, then run ourselves with no curfew or permissions.
```

```
[Behalf.bot](VIDEO_URL)
Sean Tierney demos behalf.bot, the open-source personal agent he runs daily to ship software, handle life admin, and screen his dates.
Main Takeaways

Loom videos convey ideas to an agent better than typing. His Loom Vision skill reads screen and audio together, then reports back as audio.
The dating bot drives an Android emulator, writes openers, learns his type, books coffee dates.
The same agent runs life admin: insurance claims, HOA negotiations, a partner buyout.
Everything is open source at behalf.bot.
Sean's [X](https://x.com/scrollinondubs), [GitHub](https://github.com/scrollinondubs), [LinkedIn](https://www.linkedin.com/in/seantierney/)
```

```
[Mind as Model](VIDEO_URL)
Rachel Papirmeister presents a puzzle benchmark that current AI can't solve, and the human learning mechanism her user study uncovered inside it.
Main Takeaways

Neural networks transfer skills well but adapt poorly to unfamiliar rules and environments.
Humans learn without a clear reward signal, something her benchmark is built to isolate.
Across 75 participants she found a third mechanism between exploration and exploitation: establish.
Establish is hypothesis testing — you form, revise, and confirm rules while operating on a partial world model.
Symbolic approaches offer interpretability and data efficiency; cognition points toward architectures with built-in hypothesis testing.
Rachel's [GitHub](https://github.com/r-papir), [LinkedIn](https://www.linkedin.com/in/r-papir/)
```

Note the drift between the two events: #2 ends bullets with full stops and runs
some past 15 words, #3 doesn't and is tighter. **Follow #3** — it's the most
recent and the tighter of the two.
