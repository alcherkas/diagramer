import type { NotationPack } from '../../core/notation/types'

/**
 * C4 model notation pack (https://c4model.com).
 *
 * Skeleton pack: node/edge types, palette and semantic rules land with
 * REQ-001/REQ-002. The pack existing from day one proves the registry seam.
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
  nodeTypes: [],
  edgeTypes: [],
  palette: [],
  rules: {
    canConnect: (source, target) =>
      source.id === target.id ? 'An element cannot depend on itself' : true,
    canNest: () => true,
  },
}
