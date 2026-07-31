# REQ-007: PNG and SVG image export

- **Status**: ready
- **Priority**: P2
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As an architect, I want to export the diagram as an image so that I can paste
it into docs and slides.

## Acceptance criteria

- [ ] "Export PNG": whole diagram framed via `getNodesBounds` +
      `getViewportForBounds`, 2x pixel ratio, minimap/controls excluded,
      correct in dark and light theme.
- [ ] "Export SVG (browser-compatible)" via `toSvg`, limitation noted in the
      UI per ADR-0005.
- [ ] Empty diagram: export buttons disabled.
- [ ] e2e: PNG download event fires and the file is non-empty.

## Notes

`html-to-image` is the approved dependency (ADR-0005). System font stack only.
