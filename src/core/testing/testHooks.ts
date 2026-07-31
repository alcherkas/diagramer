import type { XYPosition } from '@xyflow/react'
import { parseDiagramFile, serializeDocument } from '../export/json'
import type { DiagramFile } from '../model/schema'
import { useStore } from '../store'

export interface DiagramerTestApi {
  getDocument: () => DiagramFile
  loadDocument: (file: unknown) => void
  newDocument: () => void
  addNode: (nodeTypeId: string, position: XYPosition) => string | undefined
}

declare global {
  interface Window {
    __diagramer?: DiagramerTestApi
  }
}

/**
 * Programmatic seeding/inspection API for Playwright. Only installed when
 * the bundle is built with VITE_E2E=1 — never in production builds.
 */
export function installTestHooks(): void {
  window.__diagramer = {
    getDocument: () => serializeDocument(useStore.getState().document),
    loadDocument: (file) => useStore.getState().loadDocument(parseDiagramFile(file)),
    newDocument: () => useStore.getState().newDocument(),
    addNode: (nodeTypeId, position) =>
      useStore.getState().addNode(nodeTypeId, position)?.id,
  }
}
