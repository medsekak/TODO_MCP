import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectRoute from './components/ProtectRoute.js'
import PublicLayout from './components/PublicLayout.js'
import Layout from './components/Layout.js'
import SignIn from './pages/SignIn.js'
import SignUp from './pages/SignUp.js'
import Profile from './pages/Profile.js'
import EmailVerification from './pages/EmailVerification.js'
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectRoute/>,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <App /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
    ],
  },
  {
    element: <PublicLayout/>,
    children: [
      { path: "/verify-email", element: <EmailVerification /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0f172a",
          color: "#f8fafc",
          border: "1px solid #1e293b",
          borderRadius: "1rem",
        },
        success: {
          iconTheme: { primary: "#10b981", secondary: "#0f172a" },
        },
        error: {
          iconTheme: { primary: "#f43f5e", secondary: "#0f172a" },
        },
      }}
    />
    <RouterProvider router={router} />
  </StrictMode>,
)
