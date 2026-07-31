import { DIAGRAM_SCHEMA_VERSION, diagramFileSchema } from '../model/schema'
import type { DiagramFile } from '../model/schema'
import { migrateDiagramFile } from '../model/migrations'
import type { DiagramDocument, DiagramNode } from '../model/types'
import { getNotation, hasNotation } from '../notation/registry'

/** Strip runtime-only props so exports are stable and portable. */
function serializeNode(node: DiagramNode) {
  return {
    id: node.id,
    type: node.type ?? '',
    position: node.position,
    width: node.width ?? node.measured?.width,
    height: node.height ?? node.measured?.height,
    parentId: node.parentId,
    extent: node.extent === 'parent' ? ('parent' as const) : undefined,
    data: node.data,
  }
}

export function serializeDocument(document: DiagramDocument): DiagramFile {
  const pack = getNotation(document.notation)
  return {
    schemaVersion: DIAGRAM_SCHEMA_VERSION,
    notation: document.notation,
    notationVersion: pack.version,
    diagramKind: document.diagramKind,
    meta: document.meta,
    nodes: document.nodes.map(serializeNode),
    edges: document.edges.map((edge) => ({
      id: edge.id,
      type: edge.type,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      markerEnd: edge.markerEnd,
      data: edge.data,
    })),
  }
}

/**
 * Parse untrusted JSON into a document: migrate -> validate shape ->
 * check notation is available -> check referential integrity.
 * Throws with a human-readable message on any failure.
 */
export function parseDiagramFile(raw: unknown): DiagramDocument {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Diagram file must be a JSON object')
  }
  const migrated = migrateDiagramFile(raw as Record<string, unknown>)
  const result = diagramFileSchema.safeParse(migrated)
  if (!result.success) {
    const issue = result.error.issues[0]
    throw new Error(
      `Invalid diagram file at "${issue.path.join('.')}": ${issue.message}`,
    )
  }
  const file = result.data
  if (!hasNotation(file.notation)) {
    throw new Error(`Unknown notation "${file.notation}"`)
  }
  const nodeIds = new Set(file.nodes.map((n) => n.id))
  for (const node of file.nodes) {
    if (node.parentId && !nodeIds.has(node.parentId)) {
      throw new Error(`Node "${node.id}" references missing parent "${node.parentId}"`)
    }
  }
  for (const edge of file.edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      throw new Error(`Edge "${edge.id}" references a missing node`)
    }
  }
  return {
    meta: {
      id: file.meta.id,
      name: file.meta.name,
      createdAt: file.meta.createdAt,
    },
    notation: file.notation,
    diagramKind: file.diagramKind,
    nodes: file.nodes as DiagramDocument['nodes'],
    edges: file.edges as DiagramDocument['edges'],
  }
}
