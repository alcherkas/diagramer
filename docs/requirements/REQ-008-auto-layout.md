# REQ-008: Auto-layout

- **Status**: ready
- **Priority**: P2
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want a one-click tidy layout so that I don't hand-arrange
boxes.

## Acceptance criteria

- [ ] Toolbar "Auto-layout" runs elkjs layered layout, direction DOWN,
      per ADR-0003 (dynamic import, web worker, never in initial chunk).
- [ ] Boundary children are laid out inside their parent; parent resizes to
      fit with padding for its label.
- [ ] Layout applies as a single undo step followed by animated `fitView`.
- [ ] Button shows a busy state while layout runs; canvas stays interactive.
- [ ] Unit test: ELK graph construction from a nested document (elk mocked).
- [ ] e2e: seed overlapping nodes → layout → node positions differ and do not
      overlap.
