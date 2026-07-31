import { useCallback } from 'react'
import type { DragEvent } from 'react'
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import '@xyflow/react/dist/style.css'
import { getEdgeTypesMap, getNodeTypesMap } from '../core/notation/registry'
import { useStore } from '../core/store'
import { PALETTE_DRAG_MIME } from './Palette'

const nodeTypes = getNodeTypesMap()
const edgeTypes = getEdgeTypesMap()

export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useStore(
      useShallow((state) => ({
        nodes: state.document.nodes,
        edges: state.document.edges,
        onNodesChange: state.onNodesChange,
        onEdgesChange: state.onEdgesChange,
        onConnect: state.onConnect,
        addNode: state.addNode,
      })),
    )
  const theme = useStore((state) => state.ui.theme)
  const { screenToFlowPosition } = useReactFlow()

  const onDragOver = useCallback((event: DragEvent) => {
    if (event.dataTransfer.types.includes(PALETTE_DRAG_MIME)) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      const payload = event.dataTransfer.getData(PALETTE_DRAG_MIME)
      if (!payload) return
      event.preventDefault()
      const { nodeTypeId, data } = JSON.parse(payload)
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      addNode(nodeTypeId, position, data)
    },
    [screenToFlowPosition, addNode],
  )

  return (
    <div className="canvas" data-testid="canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        connectionMode={ConnectionMode.Loose}
        colorMode={theme}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  )
}
