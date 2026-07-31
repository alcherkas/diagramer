import { z } from 'zod'

export const DIAGRAM_SCHEMA_VERSION = 1

const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  position: z.object({ x: z.number(), y: z.number() }),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  parentId: z.string().optional(),
  extent: z.literal('parent').optional(),
  data: z.looseObject({ label: z.string() }),
})

const edgeSchema = z.object({
  id: z.string().min(1),
  type: z.string().optional(),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().nullish(),
  targetHandle: z.string().nullish(),
  markerEnd: z
    .union([z.string(), z.looseObject({ type: z.string() })])
    .optional(),
  data: z.looseObject({ label: z.string().optional() }).optional(),
})

/** Envelope written by JSON export and accepted by import. */
export const diagramFileSchema = z.object({
  schemaVersion: z.number().int().positive(),
  notation: z.string().min(1),
  notationVersion: z.string(),
  diagramKind: z.string().min(1),
  meta: z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
  }),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
})

export type DiagramFile = z.infer<typeof diagramFileSchema>
