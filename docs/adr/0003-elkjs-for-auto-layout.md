# ADR-0003: elkjs (layered) for auto-layout, not dagre

- **Status**: accepted
- **Date**: 2026-07-31

## Context

C4 diagrams contain boundary (compound) nodes with children. Auto-layout must
lay out children inside parents and size parents to fit.

## Decision

Use elkjs with `org.eclipse.elk.layered` (direction DOWN). dagre's compound
support is effectively unmaintained; ELK supports hierarchical graphs natively
and its layered algorithm matches C4's directional flow.

Constraints: elkjs (~1.4 MB) must be dynamically imported on first use and run
in a web worker — never in the initial chunk. Layout is triggered by an
explicit toolbar action, never continuously.

## Consequences

- Larger dependency, mitigated by lazy loading.
- ELK's parent-relative child coordinates map directly onto React Flow's
  parent-relative positions.
