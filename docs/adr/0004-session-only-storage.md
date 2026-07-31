# ADR-0004: Session-only storage, no backend

- **Status**: accepted
- **Date**: 2026-07-31

## Context

The app is hosted on GitHub Pages (static). The product decision is that no
user data leaves the browser and there is no database.

## Decision

Diagram state lives in the Zustand store, mirrored to `sessionStorage` via the
`persist` middleware (`diagramer.session.v1`) so it survives reloads. Durable
storage is the user's own filesystem via JSON export/import (versioned schema,
`src/core/model/schema.ts`, migrations in `migrations.ts`).

## Consequences

- Closing the tab discards unsaved work — export is the save mechanism; the UI
  should make that obvious.
- `sessionStorage` is per-tab (~5 MB quota); duplicating a tab copies the
  diagram. Acceptable and documented.
- No auth, no privacy surface, trivially cacheable static hosting.
- localStorage-based drafts or File System Access API autosave may be proposed
  later as a *new* ADR; they must remain local-only.
