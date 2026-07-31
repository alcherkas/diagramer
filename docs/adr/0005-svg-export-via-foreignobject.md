# ADR-0005: SVG export via foreignObject; true vector SVG deferred

- **Status**: accepted
- **Date**: 2026-07-31

## Context

React Flow renders nodes as HTML (not SVG), so there is no cheap way to get a
portable vector export. `html-to-image`'s `toSvg` wraps serialized HTML+CSS in
a `<foreignObject>` — it renders in browsers but not in Office, Confluence, or
most SVG tooling.

## Decision

- PNG export: `html-to-image` `toPng` over the viewport, framed via
  `getNodesBounds` + `getViewportForBounds`, 2x pixel ratio. This is the
  primary image export.
- SVG export: ship `toSvg` labeled "SVG (browser-compatible)" and document the
  limitation.
- True vector SVG: deferred. The correct approach is a renderer that walks the
  domain model and emits real shapes/text per node type (future optional
  `renderSvg` hook on notation packs). DOM-to-vector conversion is explicitly
  rejected as a tar pit.
- Fonts must be self-hosted or system-stack (CORS-loaded stylesheets silently
  break html-to-image).

## Consequences

- Users needing SVG for external tools are partially served until the
  model-driven renderer exists.
