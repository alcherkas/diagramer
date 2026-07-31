---
name: cycle
description: Run one full Diagramer development cycle - product loop (test deployed app, update backlog) then engineering loop (implement top requirement, deploy). Use for /cycle or when running the autonomous development loop.
---

# Development cycle

One full iteration of the two-loop process. Designed to be run repeatedly via
`/loop` (autonomous mode) or one-off for a supervised cycle.

## Steps

1. **Stop check**: if a file named `STOP` exists at the repo root, do nothing
   except report that the loop is stopped. The user creates/deletes this file
   to pause/resume autonomous cycles. Also stop and report if the working tree
   has uncommitted changes you didn't make — the user may be working.

2. **Sync**: `git pull --rebase` on `main`.

3. **Product loop**: follow `.claude/skills/product-loop/SKILL.md` end to end
   (test deployed app → feedback file → backlog update → commit + push).

4. **Engineering loop**: follow `.claude/skills/engineering-loop/SKILL.md` end
   to end (pick top ready REQ → ADR if needed → implement → tests green →
   push → CI and Deploy green).

5. **Report**: summarize in a few sentences — what the product loop found,
   which REQ was implemented, CI/deploy status, and what is queued next.

## Pacing (when driven by /loop dynamic mode)

- After a cycle that pushed code, schedule the next wakeup ~20 minutes out.
- If blocked (CI persistently red after 3 fix attempts, deploy broken,
  ambiguous requirement), do NOT keep looping on the same failure: leave the
  requirement `in-progress` with notes, stop the loop, and clearly report what
  needs a human decision.

## Budget guardrails

- At most one feature REQ per cycle (plus trivial fixes).
- If the backlog has no `ready` items and the product loop found nothing
  actionable, stop the loop and say the project is idle rather than inventing
  low-value work.
