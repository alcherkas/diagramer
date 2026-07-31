import { useState } from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'
import type { BaseEdgeData } from '../../../core/model/types'
import { useStore } from '../../../core/store'

export function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const [editing, setEditing] = useState(false)
  const updateEdgeData = useStore((state) => state.updateEdgeData)
  const onEdgesChange = useStore((state) => state.onEdgesChange)
  const { label, technology } = (data ?? {}) as BaseEdgeData

  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const commit = (value: string) => {
    updateEdgeData(id, { label: value.trim() })
    setEditing(false)
  }

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} className="c4-edge" />
      <EdgeLabelRenderer>
        <div
          className={`c4-edge__label nodrag nopan${selected ? ' c4-edge__label--selected' : ''}`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          data-testid={`c4-edge-label-${id}`}
          onClick={() => onEdgesChange([{ id, type: 'select', selected: true }])}
          onDoubleClick={() => setEditing(true)}
        >
          {editing ? (
            <input
              className="c4-edge__input"
              autoFocus
              defaultValue={label ?? ''}
              onBlur={(event) => commit(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commit(event.currentTarget.value)
                if (event.key === 'Escape') setEditing(false)
              }}
            />
          ) : (
            <>
              <span className="c4-edge__text">{label || 'unlabeled'}</span>
              {technology && <span className="c4-edge__tech">[{technology}]</span>}
            </>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
