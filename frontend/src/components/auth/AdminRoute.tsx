import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user?.role?.name || user?.role?.name !== "admin") {
    return <Navigate to="/login" />
  }

  return children
}

export default AdminRoute
