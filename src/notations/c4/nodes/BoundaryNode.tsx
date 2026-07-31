import { NodeResizer } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { BaseNodeData } from '../../../core/model/types'

export function BoundaryNode({ id, data, selected }: NodeProps) {
  const { label } = data as BaseNodeData

  return (
    <div className="c4-boundary" data-testid={`c4-node-${id}`} data-nodetype="c4.boundary">
      <NodeResizer isVisible={selected} minWidth={240} minHeight={160} />
      <div className="c4-boundary__label">
        {label}
        <span className="c4-boundary__meta">[Boundary]</span>
      </div>
    </div>
  )
}
