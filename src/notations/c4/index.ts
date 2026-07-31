import type { NotationPack } from '../../core/notation/types'
import { RelationshipEdge } from './edges/RelationshipEdge'
import { BoundaryNode } from './nodes/BoundaryNode'
import { ElementNode } from './nodes/ElementNode'
import './styles.css'

/**
 * C4 model notation pack (https://c4model.com).
 * Relationship edge type and semantic connection rules land with REQ-002.
 */
export const c4Pack: NotationPack = {
  id: 'c4',
  displayName: 'C4 Model',
  version: '0.1.0',
  diagramKinds: [
    { id: 'context', displayName: 'System Context' },
    { id: 'container', displayName: 'Container' },
    { id: 'component', displayName: 'Component' },
  ],
  defaultDiagramKind: 'context',
  nodeTypes: [
    {
      id: 'c4.person',
      displayName: 'Person',
      component: ElementNode,
      defaultData: { label: 'Person', description: '' },
      defaultSize: { width: 180, height: 110 },
      diagramKinds: ['context', 'container', 'component'],
    },
    {
      id: 'c4.system',
      displayName: 'Software System',
      component: ElementNode,
      defaultData: { label: 'Software System', description: '' },
      defaultSize: { width: 200, height: 120 },
      diagramKinds: ['context', 'container', 'component'],
    },
    {
      id: 'c4.container',
      displayName: 'Container',
      component: ElementNode,
      defaultData: { label: 'Container', description: '', technology: '' },
      defaultSize: { width: 200, height: 120 },
      diagramKinds: ['container', 'component'],
    },
    {
      id: 'c4.component',
      displayName: 'Component',
      component: ElementNode,
      defaultData: { label: 'Component', description: '', technology: '' },
      defaultSize: { width: 200, height: 110 },
      diagramKinds: ['component'],
    },
    {
      id: 'c4.boundary',
      displayName: 'Boundary',
      component: BoundaryNode,
      defaultData: { label: 'Boundary' },
      defaultSize: { width: 480, height: 360 },
      isGroup: true,
      resizable: true,
      diagramKinds: ['container', 'component'],
    },
  ],
  edgeTypes: [
    {
      id: 'c4.relationship',
      displayName: 'Relationship',
      component: RelationshipEdge,
      defaultData: { label: 'Uses', technology: '' },
    },
  ],
  defaultEdgeTypeId: 'c4.relationship',
  palette: [
    { nodeTypeId: 'c4.person', label: 'Person', group: 'Elements' },
    { nodeTypeId: 'c4.system', label: 'Software System', group: 'Elements' },
    {
      id: 'c4.system-external',
      nodeTypeId: 'c4.system',
      label: 'External System',
      group: 'Elements',
      data: { label: 'External System', external: true },
    },
    { nodeTypeId: 'c4.container', label: 'Container', group: 'Elements' },
    { nodeTypeId: 'c4.component', label: 'Component', group: 'Elements' },
    { nodeTypeId: 'c4.boundary', label: 'Boundary', group: 'Scopes' },
  ],
  rules: {
    canConnect: (source, target) => {
      if (source.id === target.id) return 'An element cannot depend on itself'
      if (source.type === 'c4.boundary' || target.type === 'c4.boundary') {
        return 'Boundaries cannot have relationships'
      }
      return true
    },
    canNest: () => true,
  },
}
