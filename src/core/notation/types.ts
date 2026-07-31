import type { ComponentType } from 'react'
import type { NodeProps, EdgeProps } from '@xyflow/react'
import type { BaseEdgeData, BaseNodeData, DiagramNode } from '../model/types'

export interface NodeTypeDef<TData extends BaseNodeData = BaseNodeData> {
  /** Namespaced id, e.g. "c4.person". Used as the React Flow node `type`. */
  id: string
  displayName: string
  component: ComponentType<NodeProps>
  defaultData: TData
  defaultSize: { width: number; height: number }
  /** Boundary/scope node: resizable, accepts children via parentId. */
  isGroup?: boolean
  resizable?: boolean
  /** Diagram kinds this element may appear on (C4: context | container | component). */
  diagramKinds: string[]
}

export interface EdgeTypeDef {
  /** Namespaced id, e.g. "c4.relationship". */
  id: string
  displayName: string
  component: ComponentType<EdgeProps>
  defaultData: BaseEdgeData
}

export interface PaletteEntry {
  /** Unique id for this entry; defaults to nodeTypeId. Needed when several
   * entries share a node type (e.g. internal vs external system). */
  id?: string
  nodeTypeId: string
  label: string
  /** Palette section header. */
  group?: string
  /** Overrides merged into the node type's defaultData on add. */
  data?: Partial<BaseNodeData>
}

export interface ValidationRules {
  /** Return true to allow, or a human-readable reason string to reject. */
  canConnect(
    source: DiagramNode,
    target: DiagramNode,
    diagramKind: string,
  ): true | string
  canNest(
    child: DiagramNode,
    parent: DiagramNode,
    diagramKind: string,
  ): true | string
}

export interface DiagramKindDef {
  id: string
  displayName: string
}

export interface NotationPack {
  id: string
  displayName: string
  /** Pack schema version, stored in exports as `notationVersion`. */
  version: string
  diagramKinds: DiagramKindDef[]
  defaultDiagramKind: string
  nodeTypes: NodeTypeDef[]
  edgeTypes: EdgeTypeDef[]
  defaultEdgeTypeId?: string
  palette: PaletteEntry[]
  rules: ValidationRules
}
