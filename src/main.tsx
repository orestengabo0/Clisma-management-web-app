import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from './lib/authStore'

// Load persisted token before app mounts
useAuthStore.getState().loadFromStorage()

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
)
