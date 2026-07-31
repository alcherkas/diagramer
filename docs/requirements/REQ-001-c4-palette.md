# REQ-001: C4 element palette with click/drag-to-add

- **Status**: done
- **Priority**: P1
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want a palette of C4 elements (Person, Software System,
Container, Component, Boundary) that I can add to the canvas so that I can
build a C4 diagram.

## Acceptance criteria

- [x] Palette panel lists the C4 elements valid for the current diagram kind,
      each with `data-testid="palette-<nodeTypeId>"`.
- [x] Clicking a palette entry adds the element at the viewport center.
- [x] Dragging a palette entry onto the canvas adds it at the drop position
      (`screenToFlowPosition`).
- [x] Added nodes render as styled C4 shapes (label, optional
      description/technology, C4 blue for internal, gray for external) with
      four connection handles.
- [x] Node components live in the c4 pack (`src/notations/c4/nodes/`) and are
      registered via the pack's `nodeTypes` (ADR-0002); the palette itself is
      notation-agnostic (`renders pack.palette`).
- [x] e2e: click-to-add produces a node visible on canvas and present in
      `window.__diagramer.getDocument()`.

## Notes

Fixed default sizes per element from `NodeTypeDef.defaultSize`. Boundary node
is resizable (`NodeResizer`) and dashed per C4 convention; nesting behavior is
REQ-004, only rendering here.
