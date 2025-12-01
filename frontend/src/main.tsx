import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const app = (
  // false ?
  // <StrictMode>
  //   <BrowserRouter>
  //     <App />
  //   </BrowserRouter>
  // </StrictMode> :   
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

createRoot(document.getElementById('root')!).render(app)
