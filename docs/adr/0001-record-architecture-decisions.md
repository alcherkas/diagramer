# ADR-0001: Record architecture decisions

- **Status**: accepted
- **Date**: 2026-07-31

## Context

Diagramer is developed by an autonomous product/engineering loop. Decisions
made in one cycle must be discoverable and binding in later cycles, or the
codebase will drift.

## Decision

Record architecturally significant decisions as MADR-style ADRs in `docs/adr/`,
numbered sequentially. The engineering loop writes an ADR whenever a decision
(a) constrains future work, (b) picks between competing libraries/approaches,
or (c) reverses an earlier ADR (mark the old one `superseded`).

## Consequences

- Every cycle starts by reading accepted ADRs; implementations must comply or
  supersede explicitly.
- Small, reversible choices do not get ADRs — they'd bury the important ones.
