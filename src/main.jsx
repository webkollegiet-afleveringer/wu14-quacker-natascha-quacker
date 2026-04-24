import { StrictMode } from 'react'
import { AuthProvider } from "./hooks/useAuth.jsx";
import { createRoot } from 'react-dom/client'
import './main.sass'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* set up the authentication provider */}
    {/* this will provide authentication context to all child components - in this case, the App component which all components will be nested under */}
    {/* this way, any component within the App component can access the authentication state and functions and will update their UI accordingly */}
    {/* so when a user logs in or out, all components that consume the AuthContext will update their UI accordingly (if I set them up to change if the authentication state changes) */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
