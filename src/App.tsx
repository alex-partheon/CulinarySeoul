import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AppRouter } from './router'
import { BrandThemeProvider } from './components/theme/BrandThemeProvider'
import { ClerkAuthProvider } from './contexts/ClerkAuthContext'
import { AuthProvider } from './contexts/AuthContext'

const queryClient = new QueryClient()

function App() {
  const USE_CLERK_AUTH = import.meta.env.VITE_USE_CLERK_AUTH === 'true'

  return (
    <QueryClientProvider client={queryClient}>
      <BrandThemeProvider>
        {USE_CLERK_AUTH ? (
          <ClerkAuthProvider>
            <AppRouter />
          </ClerkAuthProvider>
        ) : (
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        )}
        <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
        />
      </BrandThemeProvider>
    </QueryClientProvider>
  )
}

export default App