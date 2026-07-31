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
import type { FinalConnectionState } from '@xyflow/react'
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
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow()

  // Dropping a connection on a node's body (not a handle) still connects:
  // hit-test the drop point and pick the handle nearest to it.
  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (connectionState.isValid || !connectionState.fromNode) return
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event
      const point = screenToFlowPosition({ x: clientX, y: clientY })
      const target = getIntersectingNodes({ ...point, width: 1, height: 1 })[0]
      if (!target || target.id === connectionState.fromNode.id) return
      const width = target.measured?.width ?? target.width ?? 0
      const height = target.measured?.height ?? target.height ?? 0
      const dx = (point.x - (target.position.x + width / 2)) / (width || 1)
      const dy = (point.y - (target.position.y + height / 2)) / (height || 1)
      const targetHandle =
        Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'bottom' : 'top'
      onConnect({
        source: connectionState.fromNode.id,
        target: target.id,
        sourceHandle: connectionState.fromHandle?.id ?? null,
        targetHandle,
      })
    },
    [screenToFlowPosition, getIntersectingNodes, onConnect],
  )

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
        onConnectEnd={onConnectEnd}
        onDragOver={onDragOver}
        onDrop={onDrop}
        connectionMode={ConnectionMode.Loose}
        connectionRadius={45}
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
