import { Response, NextFunction } from "express"
import { IUserRequest } from "@/types/user"

enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

const checkAdmin = (req: IUserRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== Role.ADMIN) {
    return res.status(403).json({ message: 'Admin Access Required' })
  }
  next()
}

export default checkAdmin