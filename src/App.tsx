import { useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Canvas } from './editor/Canvas'
import { Inspector } from './editor/Inspector'
import { Palette } from './editor/Palette'
import { useStore } from './core/store'
import './App.css'

export default function App() {
  const documentName = useStore((state) => state.document.meta.name)
  const renameDocument = useStore((state) => state.renameDocument)
  const lastError = useStore((state) => state.ui.lastError)
  const setError = useStore((state) => state.setError)

  useEffect(() => {
    if (!lastError) return
    const timer = setTimeout(() => setError(undefined), 4000)
    return () => clearTimeout(timer)
  }, [lastError, setError])

  return (
    <ReactFlowProvider>
      <div className="app">
        <header className="app-header" data-testid="app-header">
          <h1 className="app-title">Diagramer</h1>
          <input
            className="app-doc-name"
            data-testid="doc-name"
            aria-label="Diagram name"
            value={documentName}
            onChange={(event) => renameDocument(event.target.value)}
          />
        </header>
        <main className="app-main">
          <Palette />
          <Canvas />
          <Inspector />
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
