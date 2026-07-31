# REQ-002: C4 relationship edges with label and technology

- **Status**: ready
- **Priority**: P1
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want to connect elements with labeled relationships
(e.g. "Reads from [JDBC]") so that diagrams communicate interactions.

## Acceptance criteria

- [ ] Dragging from a node handle to another node creates a `c4.relationship`
      edge (registered as the pack's `defaultEdgeTypeId`).
- [ ] Edge renders as a dashed bezier with an editable label and an optional
      `[technology]` chip via `EdgeLabelRenderer`.
- [ ] Invalid connections (per `pack.rules.canConnect`) are rejected with the
      reason shown in the error toast; self-loops are invalid.
- [ ] Selecting an edge and pressing Delete removes it.
- [ ] e2e: one handle-drag connection test; other edge tests seed via
      `window.__diagramer.loadDocument`.

## Notes

Label editing may go through the Inspector (REQ-003) if it lands first;
otherwise a double-click inline editor is acceptable.
