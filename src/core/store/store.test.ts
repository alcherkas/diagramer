import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { hasNotation, registerNotation } from '../notation/registry'
import { c4Pack } from '../../notations/c4'
import { useStore } from './index'

beforeAll(() => {
  if (!hasNotation('c4')) registerNotation(c4Pack)
})

beforeEach(() => {
  useStore.getState().newDocument()
  useStore.getState().setError(undefined)
})

describe('addNode', () => {
  it('applies default data, size, and overrides', () => {
    const node = useStore
      .getState()
      .addNode('c4.system', { x: 10, y: 20 }, { label: 'Billing', external: true })!
    expect(node.type).toBe('c4.system')
    expect(node.width).toBe(200)
    expect(node.data.label).toBe('Billing')
    expect(node.data.external).toBe(true)
    expect(useStore.getState().document.nodes).toHaveLength(1)
  })

  it('reports unknown node types via lastError', () => {
    const node = useStore.getState().addNode('c4.nope', { x: 0, y: 0 })
    expect(node).toBeUndefined()
    expect(useStore.getState().ui.lastError).toMatch(/Unknown node type/)
  })
})

describe('onConnect', () => {
  it('creates a c4.relationship edge with default label and arrow marker', () => {
    const { addNode, onConnect } = useStore.getState()
    const a = addNode('c4.person', { x: 0, y: 0 })!
    const b = addNode('c4.system', { x: 0, y: 300 })!
    onConnect({ source: a.id, target: b.id, sourceHandle: 'bottom', targetHandle: 'top' })
    const edges = useStore.getState().document.edges
    expect(edges).toHaveLength(1)
    expect(edges[0].type).toBe('c4.relationship')
    expect(edges[0].data?.label).toBe('Uses')
    expect(edges[0].markerEnd).toMatchObject({ type: 'arrowclosed' })
  })

  it('rejects invalid connections with the pack reason', () => {
    const { addNode, onConnect } = useStore.getState()
    const a = addNode('c4.person', { x: 0, y: 0 })!
    onConnect({ source: a.id, target: a.id, sourceHandle: 'right', targetHandle: 'left' })
    expect(useStore.getState().document.edges).toHaveLength(0)
    expect(useStore.getState().ui.lastError).toMatch(/cannot depend on itself/)
  })
})

describe('updateEdgeData', () => {
  it('merges data into the target edge', () => {
    const { addNode, onConnect } = useStore.getState()
    const a = addNode('c4.person', { x: 0, y: 0 })!
    const b = addNode('c4.system', { x: 0, y: 300 })!
    onConnect({ source: a.id, target: b.id, sourceHandle: 'bottom', targetHandle: 'top' })
    const edgeId = useStore.getState().document.edges[0].id
    useStore.getState().updateEdgeData(edgeId, { label: 'Reads from', technology: 'HTTPS' })
    const edge = useStore.getState().document.edges[0]
    expect(edge.data?.label).toBe('Reads from')
    expect(edge.data?.technology).toBe('HTTPS')
  })
})
