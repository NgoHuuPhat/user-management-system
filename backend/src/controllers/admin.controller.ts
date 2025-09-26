import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { IUser } from '@/types/user'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

class AdminController {
  async createRole(req: Request, res: Response) {
    try {
      const { name } = req.body
      const existingRole = await prisma.role.findUnique({
        where: { name }
      })
      if (existingRole) {
        return res.status(400).json({ message: 'Role already exists' })
      }
      const role = await prisma.role.create({
        data: {
          name
        }
      })
      res.status(201).json({
        message: 'Role created successfully',
        role
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async listRoles(req: Request, res: Response) {
    try {
      const roles = await prisma.role.findMany()
      res.status(200).json(roles)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name } = req.body
      const role = await prisma.role.update({
        where: { id: Number(id) },
        data: { name }
      })
      res.status(200).json({
        message: 'Role updated successfully',
        role
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params
      await prisma.role.delete(
        {
          where: { id: Number(id) }
        }
      )
      res.status(204).json({ message: 'Role deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await prisma.user.findUnique({
        where: { id: Number(id) }
      })
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, roleId } = req.body
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser: IUser = { name, email, password: hashedPassword, roleId }
      const user = await prisma.user.create({
        data: newUser
      })
      const { password: _, ...userWithoutPassword } = user
      res.status(201).json({
        message: 'User created successfully',
        user: userWithoutPassword
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) }
      })
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      const { name, password, roleId } = req.body
      const updateData: Partial<IUser> = { name, roleId }
      if (password) {
        updateData.password = await bcrypt.hash(password, 10)
      }
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData
      })
      const {password: _, ...userWithoutPassword} = user

      res.status(200).json({
        message: 'User updated successfully',
        user: userWithoutPassword
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) }
      })
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      await prisma.user.delete({
        where: { id: Number(id) }
      })
      res.status(204).json({ message: 'User deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
    
}

export default new AdminController()