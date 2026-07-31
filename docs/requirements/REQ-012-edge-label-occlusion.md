# REQ-012: Edge labels must stay clickable (not occluded by nodes)

- **Status**: verified
- **Priority**: P1
- **Source**: feedback (docs/feedback/2026-07-31-cycle-3.md)
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want to always be able to click and edit a relationship's
label, even when the diagram is dense, so that no edge becomes uneditable.

## Acceptance criteria

- [x] An edge label whose position falls inside a node's bounds still receives
      clicks and double-clicks (label layer stacks above unselected nodes).
- [x] A selected node still raises above edge labels (React Flow's
      elevate-on-select keeps working) so dragging isn't obstructed.
- [x] e2e: seed a diagram where the label midpoint is under a node; double-
      click the label and edit it successfully.

## Notes

React Flow renders `.react-flow__edgelabel-renderer` below the nodes layer by
default. Raising the layer via CSS (z-index above default nodes, below the
selected-node z-index of 1000) is the expected fix.
