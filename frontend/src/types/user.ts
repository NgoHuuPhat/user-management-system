import type { IRole } from "@/types/role"

interface IUser {
  id: number
  name: string
  email: string
  active: boolean
  phone: string
  avatar?: string
  roleId: number
  createdAt: string
  updatedAt: string
  role?: IRole
}

interface IUserCard {
  id: number
  active: boolean
}

type BulkAction = "activate" | "deactivate" | "delete"


export type { IUser, IUserCard, BulkAction }