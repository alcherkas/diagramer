# Diagramer

Browser-based diagramming app for architecture diagrams (C4 first), hosted on
GitHub Pages. No backend: diagram state is session-only (ADR-0004).

- Live app: https://alcherkas.github.io/diagramer/
- Stack: React 19 + TypeScript + Vite, @xyflow/react v12, Zustand, zod.

## Commands

- `npm run dev` — dev server
- `npm run typecheck && npm run lint && npm run test:unit && npm run test:e2e`
  — the full local gate; all four must pass before any push
- e2e note: Playwright builds with `VITE_E2E=1`, which compiles in the
  `window.__diagramer` seeding hooks (`src/core/testing/testHooks.ts`)

## Architecture (details in docs/adr/)

- `src/core/` — notation-agnostic editor engine (model, zod schema +
  migrations, store, export, notation registry). Never imports `notations/`.
- `src/notations/<pack>/` — notation packs (node/edge components, palette,
  validation rules). Never import `editor/`. Register in `main.tsx`.
- `src/editor/` — editor chrome (Canvas, toolbar, panels).
- Node types are namespaced (`c4.person`) and double as React Flow types.
- The Zustand store is the single mutation point for nodes/edges.
- React Flow v12: parent (boundary) nodes must precede children in the nodes
  array (`sortParentsFirst`), measured sizes live on `node.measured`.

## Development process

Two-loop process, run via skills: `product-loop` (backlog + testing the
deployed app), `engineering-loop` (implementation), `cycle` (one full
iteration; used by the autonomous `/loop`). Requirements live in
`docs/requirements/`, feedback in `docs/feedback/`, binding decisions in
`docs/adr/`. A `STOP` file at repo root pauses the autonomous loop.

## Deploy

Push to `main` → CI (`ci.yml`) + Pages deploy (`deploy.yml`,
`BASE_PATH=/diagramer/`). Never leave `main` red; fix forward.
