# REQ-003: Inspector panel for editing element properties

- **Status**: done
- **Priority**: P1
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want to edit the selected element's name, description and
technology in a side panel so that I can annotate diagrams precisely.

## Acceptance criteria

- [x] Selecting a single node or edge shows an inspector panel with fields:
      label (required), description, technology.
- [x] Edits update the canvas live (`updateNodeData` / edge equivalent).
- [x] No selection (or multi-selection) shows an empty/neutral state.
- [x] Keyboard shortcuts are suppressed while typing in inspector fields.
- [x] Diagram name in the header is editable (feeds exports' `meta.name`).
- [x] e2e: select node → edit label → canvas text and document state update.
- [x] Error toast (`ui.lastError`) auto-dismisses after a few seconds and
      clears on the next successful action (cycle-2 feedback).
