import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute
