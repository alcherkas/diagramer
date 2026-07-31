# REQ-003: Inspector panel for editing element properties

- **Status**: ready
- **Priority**: P1
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want to edit the selected element's name, description and
technology in a side panel so that I can annotate diagrams precisely.

## Acceptance criteria

- [ ] Selecting a single node or edge shows an inspector panel with fields:
      label (required), description, technology.
- [ ] Edits update the canvas live (`updateNodeData` / edge equivalent).
- [ ] No selection (or multi-selection) shows an empty/neutral state.
- [ ] Keyboard shortcuts are suppressed while typing in inspector fields.
- [ ] Diagram name in the header is editable (feeds exports' `meta.name`).
- [ ] e2e: select node → edit label → canvas text and document state update.
