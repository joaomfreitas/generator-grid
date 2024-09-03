import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GridProvider } from './contexts/GridContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GridProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GridProvider>
  </StrictMode>,
)
