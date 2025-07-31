import React from 'react'
import { Outlet } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingPage } from '../ui/LoadingSpinner'

export function RootLayout() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingPage message="애플리케이션을 초기화하는 중..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
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
    </div>
  )
}