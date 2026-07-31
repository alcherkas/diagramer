import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../core/store'

export function Inspector() {
  const { selectedNode, selectedEdge, selectionCount } = useStore(
    useShallow((state) => {
      const nodes = state.document.nodes.filter((n) => n.selected)
      const edges = state.document.edges.filter((e) => e.selected)
      return {
        selectedNode: nodes.length === 1 && edges.length === 0 ? nodes[0] : undefined,
        selectedEdge: edges.length === 1 && nodes.length === 0 ? edges[0] : undefined,
        selectionCount: nodes.length + edges.length,
      }
    }),
  )
  const updateNodeData = useStore((state) => state.updateNodeData)
  const updateEdgeData = useStore((state) => state.updateEdgeData)

  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="inspector" data-testid="inspector" aria-label="Inspector">
        <p className="inspector__empty">
          {selectionCount > 1
            ? `${selectionCount} elements selected`
            : 'Select an element to edit its properties.'}
        </p>
      </aside>
    )
  }

  const data = (selectedNode?.data ?? selectedEdge?.data ?? {}) as {
    label?: string
    description?: string
    technology?: string
  }
  const update = (patch: Record<string, string>) => {
    if (selectedNode) updateNodeData(selectedNode.id, patch)
    else if (selectedEdge) updateEdgeData(selectedEdge.id, patch)
  }

  return (
    <aside className="inspector" data-testid="inspector" aria-label="Inspector">
      <h2 className="inspector__title">
        {selectedNode ? 'Element' : 'Relationship'}
      </h2>
      <label className="inspector__field">
        <span>Label</span>
        <input
          data-testid="inspector-label"
          value={data.label ?? ''}
          onChange={(event) => update({ label: event.target.value })}
        />
      </label>
      {selectedNode && (
        <label className="inspector__field">
          <span>Description</span>
          <textarea
            data-testid="inspector-description"
            rows={4}
            value={data.description ?? ''}
            onChange={(event) => update({ description: event.target.value })}
          />
        </label>
      )}
      <label className="inspector__field">
        <span>Technology</span>
        <input
          data-testid="inspector-technology"
          placeholder={selectedEdge ? 'e.g. JSON/HTTPS' : 'e.g. React, Postgres'}
          value={data.technology ?? ''}
          onChange={(event) => update({ technology: event.target.value })}
        />
      </label>
    </aside>
  )
}
