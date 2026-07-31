import type { EdgeTypes, NodeTypes } from '@xyflow/react'
import type { EdgeTypeDef, NodeTypeDef, NotationPack } from './types'

const packs = new Map<string, NotationPack>()

// React Flow requires nodeTypes/edgeTypes props to be referentially stable,
// so the flattened maps are mutated in place and handed out as-is.
const nodeTypesMap: NodeTypes = {}
const edgeTypesMap: EdgeTypes = {}

export function registerNotation(pack: NotationPack): void {
  if (packs.has(pack.id)) {
    throw new Error(`Notation pack "${pack.id}" is already registered`)
  }
  for (const nodeType of pack.nodeTypes) {
    if (!nodeType.id.startsWith(`${pack.id}.`)) {
      throw new Error(
        `Node type "${nodeType.id}" must be namespaced under "${pack.id}."`,
      )
    }
    nodeTypesMap[nodeType.id] = nodeType.component
  }
  for (const edgeType of pack.edgeTypes) {
    // EdgeProps has optional `type` while EdgeTypes components declare it
    // required; React Flow always passes it at runtime.
    edgeTypesMap[edgeType.id] = edgeType.component as EdgeTypes[string]
  }
  packs.set(pack.id, pack)
}

export function getNotation(id: string): NotationPack {
  const pack = packs.get(id)
  if (!pack) throw new Error(`Unknown notation pack "${id}"`)
  return pack
}

export function hasNotation(id: string): boolean {
  return packs.has(id)
}

export function getNodeTypeDef(nodeTypeId: string): NodeTypeDef | undefined {
  const packId = nodeTypeId.split('.')[0]
  return packs.get(packId)?.nodeTypes.find((n) => n.id === nodeTypeId)
}

export function getEdgeTypeDef(edgeTypeId: string): EdgeTypeDef | undefined {
  for (const pack of packs.values()) {
    const def = pack.edgeTypes.find((e) => e.id === edgeTypeId)
    if (def) return def
  }
  return undefined
}

export function getNodeTypesMap(): NodeTypes {
  return nodeTypesMap
}

export function getEdgeTypesMap(): EdgeTypes {
  return edgeTypesMap
}
