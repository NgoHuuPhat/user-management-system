import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken} from '@/services/token.service'
import bcrypt from 'bcrypt'
import { IUserRequest } from '@/types/user'

const prisma = new PrismaClient()

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password, rememberMe } = req.body
      const user = await prisma.user.findUnique({ where: { email }, include: { role: true } })  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      const payload = { id: user.id, role: user.role.name }
      const accessToken = generateAccessToken(payload)
      const refreshToken = generateRefreshToken(payload, rememberMe)
      res.cookie('accessToken', accessToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 
      })
      res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
      })
      
      return res.status(200).json({ 
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      return res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is missing' })
      }
      const userData = verifyRefreshToken(refreshToken)
      if (!userData) {
        return res.status(403).json({ message: 'Invalid refresh token' })
      }
      const newAccessToken = generateAccessToken(userData)
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 
      })
      return res.status(200).json({ message: 'Refresh token successful' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async getMe(req: IUserRequest, res: Response) {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user?.id }, include: { role: true } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.status(200).json({ user })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new AuthController()