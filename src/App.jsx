import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { LocationProvider } from './contexts/LocationContext'

// Components
import ClientLanding from './components/client/ClientLanding'
import ClientDashboard from './components/client/ClientDashboard'
import SupplierDashboard from './components/supplier/SupplierDashboard'
import ManagerDashboard from './components/manager/ManagerDashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (!user.id) {
    return <Navigate to="/" replace />
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            
            <div className="App min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<ClientLanding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/ClientDashboard" element={<ClientDashboard />} />
                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <ClientDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/supplier/*" 
                  element={
                    <ProtectedRoute requiredRole="supplier">
                      <SupplierDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/manager/*" 
                  element={
                    <ProtectedRoute requiredRole="manager">
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App