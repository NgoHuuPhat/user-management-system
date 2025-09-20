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