import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2e3ca]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e2a1b] mx-auto mb-4"></div>
          <p className="text-[#3e2a1b] text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirecionar para login, salvando a página atual
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredUserType && user?.tipo_usuario !== requiredUserType) {
    // Usuário não tem permissão para acessar esta rota
    return <Navigate to="/acesso-negado" replace />
  }

  return children
}

export default ProtectedRoute

