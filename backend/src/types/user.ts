import { Request } from 'express'
export interface IUser {
  name: string
  email: string
  password: string
  phone: string
  roleId: number
  active: boolean
  avatar?: string
}

export interface IUserPayload {
  id: number
  role: string
}

export interface IUserRequest extends Request {
  user?: IUserPayload
}