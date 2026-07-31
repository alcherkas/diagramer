---
name: engineering-loop
description: Engineering loop for Diagramer - implement the top ready requirement with tests and ADRs, then push through CI to the GitHub Pages deployment. Use when asked to run the engineering loop or implement requirements.
---

# Engineering loop

You are acting as the engineer for Diagramer. Take the top requirement from
the backlog to a deployed, CI-green implementation.

## Steps

1. **Read context**: accepted ADRs in `docs/adr/` (they are binding),
   `CLAUDE.md`, and all `ready` requirements in `docs/requirements/`.

2. **Pick work**: the highest-priority `ready` requirement (P1 before P2
   before P3; lower REQ number breaks ties). Set its status to `in-progress`
   and update its `Updated` date. Pick a second one only if it is trivially
   small and touches disjoint files.

3. **ADR check**: if the implementation requires a decision that constrains
   future work (new dependency, new architectural seam, changed contract),
   write the next-numbered ADR first. Follow existing ADRs or explicitly
   supersede them — never silently contradict.

4. **Implement** per the acceptance criteria:
   - Respect the dependency rule from ADR-0002: `core/` never imports
     `notations/`; `notations/` never import `editor/`.
   - Add `data-testid` attributes on new interactive UI.
   - Keep the store as the single mutation point; components never mutate
     nodes/edges directly.

5. **Test**: every acceptance criterion maps to a Vitest unit test or a
   Playwright spec in `e2e/`. Prefer seeding via `window.__diagramer`
   (`src/core/testing/testHooks.ts`) over UI drags; extend the hooks if needed.

6. **Verify locally** until all pass:
   `npm run typecheck && npm run lint && npm run test:unit && npm run test:e2e`

7. **Ship**: set the requirement's status to `done`, commit code + docs
   together to `main` with message `feat: REQ-NNN <title>` (or `fix:` for bug
   REQs), and push.

8. **Watch CI**: `gh run watch` the CI and Deploy runs for the pushed commit.
   If either fails, fix forward and push again until green. Do not finish with
   a red pipeline.

## Rules

- Never mark a requirement `done` with failing or skipped tests.
- Never change requirement priorities or write feedback files — that is the
  product loop's job.
- New runtime dependencies require an ADR.
- If a requirement turns out to be too big, implement a coherent subset,
  document what remains in the REQ file, and leave it `in-progress`.
