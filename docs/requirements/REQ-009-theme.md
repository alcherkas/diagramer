# REQ-009: Dark/light theme toggle

- **Status**: ready
- **Priority**: P3
- **Source**: vision
- **Created**: 2026-07-31
- **Updated**: 2026-07-31

## User story

As a user, I want the app to follow my OS theme and allow overriding it so
that it is comfortable to use.

## Acceptance criteria

- [ ] Theme cycles system → light → dark from a toolbar toggle.
- [ ] Canvas uses React Flow `colorMode`; app chrome uses CSS custom
      properties; C4 node colors stay legible in both themes.
- [ ] Choice persists in `localStorage` (UI preference, not diagram data —
      allowed by ADR-0004).
- [ ] e2e: toggle changes `data-theme`/color-scheme and survives reload.
