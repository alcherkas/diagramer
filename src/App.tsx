import { ReactFlowProvider } from '@xyflow/react'
import { Canvas } from './editor/Canvas'
import { Palette } from './editor/Palette'
import { useStore } from './core/store'
import './App.css'

export default function App() {
  const documentName = useStore((state) => state.document.meta.name)
  const lastError = useStore((state) => state.ui.lastError)

  return (
    <ReactFlowProvider>
      <div className="app">
        <header className="app-header" data-testid="app-header">
          <h1 className="app-title">Diagramer</h1>
          <span className="app-doc-name" data-testid="doc-name">
            {documentName}
          </span>
        </header>
        <main className="app-main">
          <Palette />
          <Canvas />
        </main>
        {lastError && (
          <div className="app-error" role="alert" data-testid="error-toast">
            {lastError}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  )
}
