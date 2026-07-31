# Diagramer — Product Vision

## What

A browser-based diagramming app for software architecture diagrams, free and
instantly usable at a URL — no signup, no backend, no data leaving the browser.

## Who

- Software architects and engineers who need to sketch and share architecture
  diagrams quickly.
- Teams practicing lightweight architecture documentation (C4 model, ADRs).

## Principles

1. **Notation-first.** Diagrams follow real notations with semantics (C4 first;
   ArchiMate, UML, BPMN, cloud-provider icon sets later). The editor
   understands element types and valid relationships — it is not a generic
   whiteboard.
2. **Zero friction.** Open the URL, draw, export. State survives reloads via
   the browser session; nothing is uploaded anywhere.
3. **Portable output.** JSON (re-importable, versioned schema), PNG and SVG
   exports.
4. **Extensible core.** New notations plug in as packs without touching the
   editor engine.

## Roadmap themes (product loop owns prioritization)

1. **C4 editing fundamentals** — palette, relationships, boundaries, editing UX.
2. **Output quality** — exports, auto-layout, theming.
3. **Editing power** — undo/redo, shortcuts, copy/paste, multi-diagram documents.
4. **More notations** — second pack proves the abstraction (candidate: cloud icons or ArchiMate).

## Non-goals (for now)

- Real-time collaboration, accounts, server-side persistence.
- Mobile editing (viewing is fine).
- Diagram-as-code DSLs (may become an import format later).
