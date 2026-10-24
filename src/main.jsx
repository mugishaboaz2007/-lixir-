import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            window.dispatchEvent(new Event('elixir-update-ready'))
          }
        })
      })
      registration.update().catch(() => {})
      let updateRequested = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (updateRequested) window.location.reload()
      })
      window.elixirApplyUpdate = () => {
        if (!registration.waiting) return
        updateRequested = true
        registration.waiting.postMessage('SKIP_WAITING')
      }
    } catch (error) {
      console.error('Could not register the offline app worker.', error)
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
