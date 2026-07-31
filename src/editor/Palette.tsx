import type { DragEvent } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import { getPaletteForKind, paletteEntryId } from '../core/notation/palette'
import { getNotation } from '../core/notation/registry'
import type { PaletteEntry } from '../core/notation/types'
import { useStore } from '../core/store'

export const PALETTE_DRAG_MIME = 'application/diagramer'

export function Palette() {
  const { notation, diagramKind, nodeCount } = useStore(
    useShallow((state) => ({
      notation: state.document.notation,
      diagramKind: state.document.diagramKind,
      nodeCount: state.document.nodes.length,
    })),
  )
  const addNode = useStore((state) => state.addNode)
  const { screenToFlowPosition } = useReactFlow()

  const pack = getNotation(notation)
  const entries = getPaletteForKind(pack, diagramKind)
  const groups = [...new Set(entries.map((e) => e.group ?? 'Elements'))]

  const handleClick = (entry: PaletteEntry) => {
    // Add at the viewport center, cascading a little so repeated clicks
    // don't stack exactly on top of each other.
    const canvas = document.querySelector('.react-flow')
    const rect = canvas?.getBoundingClientRect()
    const offset = (nodeCount % 5) * 24
    const position = screenToFlowPosition({
      x: (rect ? rect.left + rect.width / 2 : window.innerWidth / 2) + offset,
      y: (rect ? rect.top + rect.height / 2 : window.innerHeight / 2) + offset,
    })
    addNode(entry.nodeTypeId, position, entry.data)
  }

  const handleDragStart = (event: DragEvent, entry: PaletteEntry) => {
    event.dataTransfer.setData(
      PALETTE_DRAG_MIME,
      JSON.stringify({ nodeTypeId: entry.nodeTypeId, data: entry.data }),
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="palette" data-testid="palette" aria-label="Element palette">
      {groups.map((group) => (
        <section key={group} className="palette-group">
          <h2 className="palette-group__title">{group}</h2>
          {entries
            .filter((e) => (e.group ?? 'Elements') === group)
            .map((entry) => (
              <button
                key={paletteEntryId(entry)}
                type="button"
                className="palette-entry"
                data-testid={`palette-${paletteEntryId(entry)}`}
                draggable
                onClick={() => handleClick(entry)}
                onDragStart={(event) => handleDragStart(event, entry)}
              >
                <span
                  className={`palette-entry__swatch palette-entry__swatch--${entry.nodeTypeId.split('.')[1]}${entry.data?.external ? ' palette-entry__swatch--external' : ''}`}
                />
                {entry.label}
              </button>
            ))}
        </section>
      ))}
    </aside>
  )
}
