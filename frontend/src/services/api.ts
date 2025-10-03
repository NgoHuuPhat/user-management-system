import axios from "axios"

const request = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
})

export const getAllUsers = async () => {
  const res = await request.get("/admin/users")
  return res.data
}

export const getFilteredUsers = async (search: string, role: string, status: string) => {
  const res = await request.get("/admin/users", { params: { role, status, search } })
  return res.data
}

export const login = async (email: string, password: string, rememberMe: boolean) => {
  const res = await request.post("/auth/login", { email, password, rememberMe })
  return res.data
}

export const logout = async () => {
  const res = await request.post("/auth/logout")
  return res.data
}

export const getCurrentUser = async () => {
  const res = await request.get("/auth/me")
  return res.data
}

export const forgotPassword = async (email: string) => {
  const res = await request.post("/auth/forgot-password", { email })
  return res.data
}

export const verifyOTP = async (email: string, otp: string) => {
  const res = await request.post("/auth/verify-otp", { email, otp })
  return res.data
}

export const resetPassword = async (password: string, confirmPassword: string) => {
  const res = await request.post("/auth/reset-password", { password, confirmPassword })
  return res.data
}

export const createUser = async (user: { name: string; email: string; password: string; roleId: number; avatar?: string; phone?: string }) => {
  const res = await request.post("/admin/users", user)
  return res.data
}

export const updateUser = async (id: number, user: { name?: string; password?: string; roleId?: number; avatar?: string; active?: boolean; phone?: string }) => {
  const res = await request.patch(`/admin/users/${id}`, user)
  return res.data
}

export const deleteUser = async (id: number) => {
  const res = await request.delete(`/admin/users/${id}`)
  return res.data
}

export const getRoles = async () => {
  const res = await request.get("/admin/roles")
  return res.data
}