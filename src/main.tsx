import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerNotation } from './core/notation/registry'
import { initDocument } from './core/store'
import { installTestHooks } from './core/testing/testHooks'
import { c4Pack } from './notations/c4'

registerNotation(c4Pack)
initDocument()

// Statically replaced at build time; the call (and module, via tree
// shaking) is dropped from production bundles.
if (import.meta.env.VITE_E2E) {
  installTestHooks()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
