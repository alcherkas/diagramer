import { beforeAll, describe, expect, it } from 'vitest'
import { parseDiagramFile, serializeDocument } from '../export/json'
import { hasNotation, registerNotation } from '../notation/registry'
import { sortParentsFirst } from '../store'
import type { DiagramDocument, DiagramNode } from './types'
import { c4Pack } from '../../notations/c4'

const sampleDocument: DiagramDocument = {
  meta: { id: 'doc-1', name: 'Sample', createdAt: '2026-07-31T00:00:00.000Z' },
  notation: 'c4',
  diagramKind: 'context',
  nodes: [
    {
      id: 'a',
      type: 'c4.person',
      position: { x: 0, y: 0 },
      width: 200,
      height: 120,
      data: { label: 'User' },
    },
    {
      id: 'b',
      type: 'c4.system',
      position: { x: 0, y: 240 },
      width: 220,
      height: 140,
      data: { label: 'Diagramer', description: 'Draws diagrams' },
    },
  ],
  edges: [
    { id: 'e1', source: 'a', target: 'b', data: { label: 'Uses' } },
  ],
}

beforeAll(() => {
  if (!hasNotation('c4')) registerNotation(c4Pack)
})

describe('serialize/parse round trip', () => {
  it('round-trips a document through the file format', () => {
    const file = serializeDocument(sampleDocument)
    expect(file.schemaVersion).toBe(1)
    expect(file.notation).toBe('c4')
    const parsed = parseDiagramFile(JSON.parse(JSON.stringify(file)))
    expect(parsed.nodes).toHaveLength(2)
    expect(parsed.edges).toHaveLength(1)
    expect(parsed.meta.name).toBe('Sample')
  })

  it('rejects files with an unsupported schema version', () => {
    const file = { ...serializeDocument(sampleDocument), schemaVersion: 99 }
    expect(() => parseDiagramFile(file)).toThrow(/schema version/)
  })

  it('rejects edges pointing at missing nodes', () => {
    const file = serializeDocument(sampleDocument)
    file.edges[0] = { ...file.edges[0], target: 'ghost' }
    expect(() => parseDiagramFile(file)).toThrow(/missing node/)
  })

  it('rejects an unknown notation', () => {
    const file = { ...serializeDocument(sampleDocument), notation: 'uml' }
    expect(() => parseDiagramFile(file)).toThrow(/Unknown notation/)
  })

  it('rejects nodes with a dangling parentId', () => {
    const file = serializeDocument(sampleDocument)
    file.nodes[0] = { ...file.nodes[0], parentId: 'ghost' }
    expect(() => parseDiagramFile(file)).toThrow(/missing parent/)
  })
})

describe('sortParentsFirst', () => {
  it('orders parents before children regardless of input order', () => {
    const nodes: DiagramNode[] = [
      {
        id: 'child',
        type: 'c4.system',
        parentId: 'boundary',
        position: { x: 10, y: 10 },
        data: { label: 'Child' },
      },
      {
        id: 'boundary',
        type: 'c4.boundary',
        position: { x: 0, y: 0 },
        data: { label: 'Boundary' },
      },
    ]
    const sorted = sortParentsFirst(nodes)
    expect(sorted.map((n) => n.id)).toEqual(['boundary', 'child'])
  })
})
