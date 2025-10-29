import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ReactGA from "react-ga4";
import { BrowserRouter as Router } from "react-router";
ReactGA.initialize("G-3FD14SKH74");  
// ReactGA.pageview(window.location.pathname + window.location.search);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
