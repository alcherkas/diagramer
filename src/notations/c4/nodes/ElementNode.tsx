import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { BaseNodeData } from '../../../core/model/types'

const CAPTIONS: Record<string, string> = {
  'c4.person': 'Person',
  'c4.system': 'Software System',
  'c4.container': 'Container',
  'c4.component': 'Component',
}

type C4Data = BaseNodeData & { external?: boolean }

/** Shared card for Person / System / Container / Component. */
export function ElementNode({ id, type, data }: NodeProps) {
  const { label, description, technology, external } = data as C4Data
  const kind = type.split('.')[1]
  const caption = [CAPTIONS[type] ?? kind, technology].filter(Boolean).join(': ')

  return (
    <div
      className={`c4-node c4-node--${kind}${external ? ' c4-node--external' : ''}`}
      data-testid={`c4-node-${id}`}
      data-nodetype={type}
    >
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <div className="c4-node__label">{label}</div>
      <div className="c4-node__meta">
        [{caption}
        {external ? ' — External' : ''}]
      </div>
      {description && <div className="c4-node__description">{description}</div>}
    </div>
  )
}
