import { Request } from 'express'
export interface IUser {
  name: string
  email: string
  password: string
  roleId: number
}

export interface IUserPayload {
  id: number
  role: string
}

export interface IUserRequest extends Request {
  user?: IUserPayload
}