import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) return null

  if (user?.role?.name === "admin") {
    return <Navigate to="/" />
  }

  // if(user) {
  //   return <Navigate to="/user" />
  // }

  return children
}

export default PublicOnlyRoute
