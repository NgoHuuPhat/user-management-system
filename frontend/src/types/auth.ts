import type { IUser } from "@/types/user"

interface IAuthContextType {
  user: IUser | null
  setUser: (user: IUser | null) => void
  loading: boolean
  logout: () => Promise<void>
}

export type { IAuthContextType }