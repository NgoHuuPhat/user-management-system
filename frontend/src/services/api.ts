import axios from "axios"

const request = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
})

export const getUsers = async () => {
  const res = await request.get("/users")
  return res.data
}

export const login = async (email: string, password: string, rememberMe: boolean) => {
  const res = await request.post("/auth/login", { email, password, rememberMe })
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