# Diagramer

A browser-based diagramming app for software architecture diagrams, built on
the [C4 model](https://c4model.com) first and designed to grow into other
notations. Runs entirely in your browser — no backend, no accounts, no data
leaves your machine.

**Live app:** https://alcherkas.github.io/diagramer/

## Key properties

- **Notation-aware**: elements and relationships follow C4 semantics, not a
  generic whiteboard. New notations plug in as packs.
- **Session-only storage**: your diagram lives in the browser session
  (survives reloads). Save durable copies via JSON export; re-import anytime.
- **Exports**: versioned JSON, PNG, SVG (browser-compatible; see ADR-0005).

## Development

```sh
npm install
npm run dev          # dev server
npm run typecheck    # tsc
npm run lint         # oxlint
npm run test:unit    # vitest
npm run test:e2e     # playwright (builds with VITE_E2E=1)
```

Pushing to `main` runs CI and deploys to GitHub Pages.

## How this project is built

Diagramer is developed by a two-loop autonomous process:

- a **product loop** that tests the deployed app, records feedback in
  `docs/feedback/`, and maintains the requirements backlog in
  `docs/requirements/`;
- an **engineering loop** that implements `ready` requirements with tests,
  records decisions as ADRs in `docs/adr/`, and ships through CI.

See `CLAUDE.md` and `.claude/skills/` for the process definitions.
