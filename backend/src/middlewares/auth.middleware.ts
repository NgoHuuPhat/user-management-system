import { Request, Response, NextFunction } from 'express'
import { generateAccessToken, verifyRefreshToken, verifyAccessToken} from '@/services/token.service'
import { IUserRequest } from '@/types/user'

const authenticateToken = (req: IUserRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken
  if (!token){
    return res.status(401).json({ message: 'Access Token Required' })
  }
  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (error) {
    try {
      const refreshToken = req.cookies.refreshToken
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token Required' })
      }
      const payload = verifyRefreshToken(refreshToken)
      const newAccessToken = generateAccessToken(payload)

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 
      })

      req.user = payload
      next()
    } catch (error) {
      return res.status(403).json({ message: 'Invalid Token' })
    }
  }
}

export default authenticateToken