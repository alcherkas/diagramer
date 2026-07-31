# ADR-0002: Notation packs as the extensibility mechanism

- **Status**: accepted
- **Date**: 2026-07-31

## Context

C4 is the first supported notation, but the product vision requires more
(ArchiMate, UML, cloud icon sets). A generic whiteboard has no semantics; a
hardcoded C4 editor cannot grow.

## Decision

The editor core (`src/core/`) is notation-agnostic. A notation is a
`NotationPack` (`src/core/notation/types.ts`): namespaced node/edge types with
React components, palette entries, diagram kinds, and `canConnect`/`canNest`
validation rules. Packs register via `registerNotation()`
(`src/core/notation/registry.ts`); documents are self-describing
(`notation`, `diagramKind`, `schemaVersion`).

Dependency rule: `core/` never imports from `notations/`; `notations/` never
imports from `editor/`.

## Consequences

- Adding a notation = new folder under `src/notations/` + one registration
  call; no editor-core changes.
- Semantic validation lives in packs, so the editor can reject invalid
  connections with notation-specific reasons.
- The registry returns referentially stable maps (React Flow requirement).
