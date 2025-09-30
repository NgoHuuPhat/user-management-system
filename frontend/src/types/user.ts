interface IRole {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

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

interface IAuthContextType {
  user: IUser | null
  setUser: (user: IUser | null) => void
  loading: boolean
  logout: () => Promise<void>
}

export type { IAuthContextType, IUser, IRole }