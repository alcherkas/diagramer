import { describe, expect, it } from 'vitest'
import { getPaletteForKind, paletteEntryId } from '../../core/notation/palette'
import { c4Pack } from './index'

describe('c4 pack integrity', () => {
  it('namespaces every node type under c4.', () => {
    for (const nodeType of c4Pack.nodeTypes) {
      expect(nodeType.id).toMatch(/^c4\./)
    }
  })

  it('resolves every palette entry to a registered node type', () => {
    const nodeTypeIds = new Set(c4Pack.nodeTypes.map((n) => n.id))
    for (const entry of c4Pack.palette) {
      expect(nodeTypeIds.has(entry.nodeTypeId)).toBe(true)
    }
  })

  it('uses only declared diagram kinds', () => {
    const kinds = new Set(c4Pack.diagramKinds.map((k) => k.id))
    for (const nodeType of c4Pack.nodeTypes) {
      for (const kind of nodeType.diagramKinds) {
        expect(kinds.has(kind)).toBe(true)
      }
    }
  })

  it('has unique palette entry ids', () => {
    const ids = c4Pack.palette.map(paletteEntryId)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getPaletteForKind', () => {
  it('offers Person and Systems on context diagrams, no Container/Component/Boundary', () => {
    const ids = getPaletteForKind(c4Pack, 'context').map(paletteEntryId)
    expect(ids).toContain('c4.person')
    expect(ids).toContain('c4.system')
    expect(ids).toContain('c4.system-external')
    expect(ids).not.toContain('c4.container')
    expect(ids).not.toContain('c4.component')
    expect(ids).not.toContain('c4.boundary')
  })

  it('adds Container and Boundary on container diagrams', () => {
    const ids = getPaletteForKind(c4Pack, 'container').map(paletteEntryId)
    expect(ids).toContain('c4.container')
    expect(ids).toContain('c4.boundary')
    expect(ids).not.toContain('c4.component')
  })
})

describe('c4 connection rules', () => {
  const node = (id: string, type: string) => ({
    id,
    type,
    position: { x: 0, y: 0 },
    data: { label: id },
  })

  it('rejects self-loops', () => {
    const a = node('a', 'c4.system')
    expect(c4Pack.rules.canConnect(a, a, 'context')).not.toBe(true)
  })

  it('rejects boundary connections', () => {
    const a = node('a', 'c4.boundary')
    const b = node('b', 'c4.container')
    expect(c4Pack.rules.canConnect(a, b, 'container')).not.toBe(true)
  })

  it('allows person -> system', () => {
    const a = node('a', 'c4.person')
    const b = node('b', 'c4.system')
    expect(c4Pack.rules.canConnect(a, b, 'context')).toBe(true)
  })
})
