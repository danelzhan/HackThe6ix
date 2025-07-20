import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-cg6bd6y3gzvggvzl.us.auth0.com"
    clientId="MLjAtFC1AOA9V9nEjFATFppUPwG7KdzK"
    authorizationParams={{
      redirect_uri: "http://localhost:5173/login"
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>,
)
