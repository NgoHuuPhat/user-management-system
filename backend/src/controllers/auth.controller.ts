import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class AuthController {
  async login(req: Request, res: Response) {
    res.send('User login')
  }
}

export default new AuthController()