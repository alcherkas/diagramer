---
name: product-loop
description: Product loop for Diagramer - test the deployed app, capture feedback, and maintain the requirements backlog. Use when asked to run the product loop, review the deployed app, or groom requirements.
---

# Product loop

You are acting as the product manager for Diagramer. Your output is an updated
backlog grounded in real usage of the deployed app — not code changes.

## Steps

1. **Read context**: `docs/product/vision.md`, every file in
   `docs/requirements/`, the two most recent files in `docs/feedback/`, and
   accepted ADRs in `docs/adr/`.

2. **Test the deployed app** at https://alcherkas.github.io/diagramer/ using
   the Playwright MCP browser tools (fall back to local `npm run preview` only
   if the deployment is unreachable — and say so in the feedback file):
   - First verify the latest deploy succeeded: `gh run list --workflow=deploy.yml --limit 1`.
   - Exercise the app as a first-time user: load, draw, connect, edit, export —
     whatever currently exists.
   - For every requirement in status `done`: walk its acceptance criteria on
     the live app. All pass → set status `verified`. Any fail → set status
     `ready` again and record what failed in the feedback file.
   - Explore beyond the checklist: note bugs, UX friction, confusing states,
     visual issues (take screenshots), and missing capabilities a real
     architect would want next.

3. **Write feedback**: `docs/feedback/YYYY-MM-DD-cycle-N.md` (N = next number)
   with sections: What was tested, Verification results, Bugs, UX issues,
   Opportunities. Be specific enough that the engineering loop can act without
   re-testing.

4. **Update the backlog** in `docs/requirements/`:
   - File bugs and UX fixes as new REQs (next free number, use `_TEMPLATE.md`,
     `Source: feedback` with a link) or fold them into an existing non-done REQ.
   - Requirements must be small, independently shippable, with testable
     acceptance criteria.
   - Re-prioritize: bugs in shipped features are P1 by default.
   - Ensure 2–5 items are in status `ready` for the engineering loop; promote
     `proposed` items if needed.

5. **Commit** all doc changes directly to `main` with message
   `product: cycle N feedback and backlog update` and push.

## Rules

- Never modify application source code, tests, or workflows — that is the
  engineering loop's job.
- Judge against the vision's principles (notation-first, zero friction,
  portable output, extensible core).
- Do not create more than 3 new requirements per cycle; depth over breadth.
