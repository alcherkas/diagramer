# REQ-004: Boundary grouping and nesting

- **Status**: ready
- **Priority**: P2
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want to drop elements into a system/container boundary so
that diagrams show scope, and move the boundary with its contents.

## Acceptance criteria

- [ ] Dropping a node fully inside a boundary re-parents it (`parentId`,
      `extent: 'parent'`, position converted to parent-relative).
- [ ] Dragging a node out of a boundary detaches it.
- [ ] `pack.rules.canNest` is consulted; rejections show the reason toast
      (e.g. Person cannot be nested).
- [ ] Moving a boundary moves its children; deleting a boundary re-parents its
      children to the canvas (does not delete them).
- [ ] Parent-before-children array order is preserved (store invariant +
      unit test).
- [ ] e2e: seed diagram, drag node into boundary, assert `parentId` in
      document state.
