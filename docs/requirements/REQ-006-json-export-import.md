# REQ-006: JSON export/import UI

- **Status**: ready
- **Priority**: P1
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want to save my diagram as a JSON file and load it later so
that my work is durable despite session-only storage (ADR-0004).

## Acceptance criteria

- [ ] Toolbar "Export JSON" downloads `<diagram-name>.diagramer.json` via the
      existing `serializeDocument` (`src/core/export/json.ts`).
- [ ] Toolbar "Import" opens a file picker; valid files load via the existing
      `parseDiagramFile`; import clears undo history.
- [ ] Invalid files show the parse error in the toast; the current diagram is
      untouched.
- [ ] "New diagram" action with confirmation when the canvas is non-empty.
- [ ] e2e: export → parse download → re-import → state round-trips.
