# REQ-005: Undo/redo

- **Status**: ready
- **Priority**: P1
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want undo/redo for every editing action so that I can
experiment without fear.

## Acceptance criteria

- [ ] Cmd/Ctrl+Z undoes; Shift+Cmd/Ctrl+Z redoes; toolbar buttons with
      disabled states reflect `canUndo`/`canRedo`.
- [ ] Undoable: add/delete node or edge, move, resize, re-parent, property
      edits, layout runs, import. Not undoable: selection changes, viewport
      pan/zoom, theme.
- [ ] One drag = one undo step (pause/resume zundo around drag, or throttle).
- [ ] History limit 100 entries; import/new-document clears history.
- [ ] Unit tests for history partialize/equality; e2e for add → undo → redo.

## Notes

Use zundo `temporal` middleware (already a dependency) wrapped around the
store per the composition sketched in ADR-0004's store description.
