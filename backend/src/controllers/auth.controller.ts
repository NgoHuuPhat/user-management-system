import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { generateAccessToken, generateRefreshToken, verifyResetToken, generateResetToken, verifyRefreshToken} from '@/services/token.service'
import bcrypt from 'bcrypt'
import { IUserRequest } from '@/types/user'
import { mailTemplate, sendEmail } from '@/services/mail.service'
import redisClient from '@/services/redis.service'

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
          role: user.role,
          roleId: user.roleId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
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
      const { password, ...userWithoutPassword } = user
      return res.status(200).json({ user: userWithoutPassword })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(404).json({ message: 'User not found' })
      
      const otp = Math.floor(100000 + Math.random() * 900000)
      const result = await redisClient.set(`otp:${email}`, otp.toString(), { EX: 600, NX: true }) 
      if(!result) {
        return res.status(429).json({ message: 'OTP already exists, do not recreate' })
      }

      const html = mailTemplate(otp)
      const subject = 'Password Reset OTP'
      await sendEmail(email, subject, html)

      return res.status(200).json({ message: 'OTP sent to email' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
    
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body
      const storedOtp = await redisClient.get(`otp:${email}`)
      
      if (!storedOtp) return res.status(400).json({ message: 'OTP expired or not found' })
      if (storedOtp !== otp.toString()) return res.status(400).json({ message: 'Invalid OTP' })

      if (!storedOtp) return res.status(400).json({ message: 'OTP expired or not found' })
      if (storedOtp !== otp.toString()) return res.status(400).json({ message: 'Invalid OTP' })

      await redisClient.del(`otp:${email}`)

      const resetToken = generateResetToken(email)
      res.cookie('resetToken', resetToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
      })

      return res.status(200).json({ message: 'OTP verified' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const resetToken = req.cookies.resetToken
      if (!resetToken) {
        return res.status(401).json({
          message: 'Reset token is missing. Please request a new OTP.'
        })
      }

      let decoded: { email: string }
      try {
        decoded = verifyResetToken(resetToken)
      } catch {
        return res.status(403).json({
          message: 'Invalid or expired reset token. Please request a new OTP.'
        })
      }

      const { email } = decoded

      const { password, confirmPassword } = req.body

      if (!password || !confirmPassword) {
        return res.status(400).json({
          message: 'Password and confirm password are required'
        })
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          message: 'Passwords do not match'
        })
      }

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const isSamePassword = await bcrypt.compare(password, user.password)
      if (isSamePassword) {
        return res.status(400).json({
          message: 'New password must be different from the old password'
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      })

      res.clearCookie('resetToken')
      return res.status(200).json({ message: 'Password reset successful' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

}

export default new AuthController()