import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MarkerType, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import type { Connection, EdgeChange, NodeChange, XYPosition } from '@xyflow/react'
import type { DiagramDocument, DiagramEdge, DiagramNode } from '../model/types'
import { getNodeTypeDef, getNotation } from '../notation/registry'

export const DEFAULT_NOTATION = 'c4'

export type ThemeMode = 'light' | 'dark' | 'system'

interface UiState {
  theme: ThemeMode
  lastError?: string
}

export interface AppState {
  document: DiagramDocument
  ui: UiState
  onNodesChange: (changes: NodeChange<DiagramNode>[]) => void
  onEdgesChange: (changes: EdgeChange<DiagramEdge>[]) => void
  onConnect: (connection: Connection) => void
  addNode: (
    nodeTypeId: string,
    position: XYPosition,
    dataOverrides?: Partial<DiagramNode['data']>,
  ) => DiagramNode | undefined
  updateNodeData: (nodeId: string, data: Partial<DiagramNode['data']>) => void
  updateEdgeData: (edgeId: string, data: Partial<NonNullable<DiagramEdge['data']>>) => void
  loadDocument: (document: DiagramDocument) => void
  newDocument: () => void
  setTheme: (theme: ThemeMode) => void
  setError: (message?: string) => void
}

export function createEmptyDocument(): DiagramDocument {
  const pack = getNotation(DEFAULT_NOTATION)
  return {
    meta: {
      id: crypto.randomUUID(),
      name: 'Untitled diagram',
      createdAt: new Date().toISOString(),
    },
    notation: pack.id,
    diagramKind: pack.defaultDiagramKind,
    nodes: [],
    edges: [],
  }
}

/** React Flow v12 requires parent (group) nodes before their children. */
export function sortParentsFirst(nodes: DiagramNode[]): DiagramNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const sorted: DiagramNode[] = []
  const visited = new Set<string>()
  const visit = (node: DiagramNode) => {
    if (visited.has(node.id)) return
    visited.add(node.id)
    if (node.parentId) {
      const parent = byId.get(node.parentId)
      if (parent) visit(parent)
    }
    sorted.push(node)
  }
  nodes.forEach(visit)
  return sorted
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Placeholder replaced on rehydrate/boot; see initDocument() in main.tsx.
      document: {
        meta: { id: '', name: 'Untitled diagram', createdAt: '' },
        notation: DEFAULT_NOTATION,
        diagramKind: 'context',
        nodes: [],
        edges: [],
      },
      ui: { theme: 'system' },

      onNodesChange: (changes) =>
        set((state) => ({
          document: {
            ...state.document,
            nodes: applyNodeChanges(changes, state.document.nodes),
          },
        })),

      onEdgesChange: (changes) =>
        set((state) => ({
          document: {
            ...state.document,
            edges: applyEdgeChanges(changes, state.document.edges),
          },
        })),

      onConnect: (connection) => {
        const { document } = get()
        const source = document.nodes.find((n) => n.id === connection.source)
        const target = document.nodes.find((n) => n.id === connection.target)
        if (!source || !target) return
        const pack = getNotation(document.notation)
        const verdict = pack.rules.canConnect(source, target, document.diagramKind)
        if (verdict !== true) {
          set((state) => ({ ui: { ...state.ui, lastError: verdict } }))
          return
        }
        const edgeType = pack.edgeTypes.find((e) => e.id === pack.defaultEdgeTypeId)
        const edge: Partial<DiagramEdge> = {
          id: crypto.randomUUID(),
          type: edgeType?.id,
          data: edgeType ? { ...edgeType.defaultData } : { label: '' },
          markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
        }
        set((state) => ({
          document: {
            ...state.document,
            edges: addEdge({ ...connection, ...edge }, state.document.edges),
          },
        }))
      },

      addNode: (nodeTypeId, position, dataOverrides) => {
        const def = getNodeTypeDef(nodeTypeId)
        if (!def) {
          set((state) => ({
            ui: { ...state.ui, lastError: `Unknown node type "${nodeTypeId}"` },
          }))
          return undefined
        }
        const node: DiagramNode = {
          id: crypto.randomUUID(),
          type: def.id,
          position,
          width: def.defaultSize.width,
          height: def.defaultSize.height,
          data: { ...def.defaultData, ...dataOverrides },
        }
        set((state) => ({
          document: {
            ...state.document,
            nodes: def.isGroup
              ? [node, ...state.document.nodes]
              : [...state.document.nodes, node],
          },
        }))
        return node
      },

      updateNodeData: (nodeId, data) =>
        set((state) => ({
          document: {
            ...state.document,
            nodes: state.document.nodes.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
            ),
          },
        })),

      updateEdgeData: (edgeId, data) =>
        set((state) => ({
          document: {
            ...state.document,
            edges: state.document.edges.map((e) =>
              e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e,
            ),
          },
        })),

      loadDocument: (document) =>
        set(() => ({
          document: { ...document, nodes: sortParentsFirst(document.nodes) },
        })),

      newDocument: () => set(() => ({ document: createEmptyDocument() })),

      setTheme: (theme) => set((state) => ({ ui: { ...state.ui, theme } })),

      setError: (message) =>
        set((state) => ({ ui: { ...state.ui, lastError: message } })),
    }),
    {
      name: 'diagramer.session.v1',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ document: state.document }),
      version: 1,
    },
  ),
)

/** Seed a fresh document when nothing was rehydrated from sessionStorage. */
export function initDocument(): void {
  const { document, newDocument } = useStore.getState()
  if (!document.meta.id) newDocument()
}
