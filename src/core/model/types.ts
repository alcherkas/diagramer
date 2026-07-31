import type { Edge, Node } from '@xyflow/react'

/**
 * Data payload every diagram node carries. Notation packs extend this
 * shape but must keep it JSON-serializable.
 */
export interface BaseNodeData extends Record<string, unknown> {
  label: string
  description?: string
  technology?: string
}

export interface BaseEdgeData extends Record<string, unknown> {
  label?: string
  technology?: string
}

export type DiagramNode = Node<BaseNodeData>
export type DiagramEdge = Edge<BaseEdgeData>

export interface DocumentMeta {
  id: string
  name: string
  createdAt: string
}

/**
 * The single source of truth for a diagram. Self-describing: `notation`
 * and `diagramKind` let a viewer without the pack fail gracefully.
 */
export interface DiagramDocument {
  meta: DocumentMeta
  notation: string
  diagramKind: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}
