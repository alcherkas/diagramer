import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import '@xyflow/react/dist/style.css'
import { getEdgeTypesMap, getNodeTypesMap } from '../core/notation/registry'
import { useStore } from '../core/store'

const nodeTypes = getNodeTypesMap()
const edgeTypes = getEdgeTypesMap()

export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow((state) => ({
      nodes: state.document.nodes,
      edges: state.document.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    })),
  )
  const theme = useStore((state) => state.ui.theme)

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
