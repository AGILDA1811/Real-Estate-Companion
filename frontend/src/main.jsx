import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import { CompareProvider } from './context/CompareContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CompareProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CompareProvider>
)
