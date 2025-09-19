import jwt from 'jsonwebtoken'
import { IUserPayload } from '../types/user'

export const generateAccessToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE } as jwt.SignOptions)
}

export const generateRefreshToken = (payload: IUserPayload, rememberMe: boolean): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: rememberMe ? process.env.JWT_REMEMBER_REFRESH_EXPIRE : process.env.JWT_REFRESH_EXPIRE } as jwt.SignOptions)
}

export const verifyAccessToken = (token: string): IUserPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as IUserPayload
}

export const verifyRefreshToken = (token: string): IUserPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as IUserPayload
}