# REQ-011: Diagram kind switcher

- **Status**: ready
- **Priority**: P2
- **Source**: feedback (docs/feedback/2026-07-31-cycle-1.md)
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want to choose whether I'm drawing a System Context,
Container, or Component diagram so that the palette offers the right C4
elements.

## Acceptance criteria

- [ ] Header/toolbar select lists the active notation's `diagramKinds`
      (notation-agnostic: reads the pack, no hardcoded C4 list).
- [ ] Switching kinds updates `document.diagramKind` and re-filters the
      palette immediately.
- [ ] Switching kinds with existing elements that are invalid for the new kind
      warns the user but does not delete anything (elements stay, palette just
      changes).
- [ ] Kind is persisted in the document and round-trips through JSON
      export/import.
- [ ] e2e: switch context → container, assert palette gains Container and
      Boundary entries.
