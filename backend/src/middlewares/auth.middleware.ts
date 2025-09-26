import { Request, Response, NextFunction } from 'express'
import { generateAccessToken, verifyRefreshToken, verifyAccessToken} from '@/services/token.service'
import { IUserRequest } from '@/types/user'

const authenticateToken = (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken
    if(token){
      const decoded = verifyAccessToken(token)
      req.user = decoded
      return next()
    }

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const payload = verifyRefreshToken(refreshToken)
    const newAccessToken = generateAccessToken({ id: payload.id, role: payload.role })

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000 
    })
    
    req.user = { id: payload.id, role: payload.role }
    return next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}

export default authenticateToken