import { createContext, useState, useEffect } from 'react'
import { getCurrentUser, logout} from '@/services/api'
import type { IUser} from '@/types/user'
import type { IAuthContextType } from '@/types/auth'

const AuthContext = createContext<IAuthContextType>({
    user: null,
    setUser: () => {},
    loading: true,
    logout: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getCurrentUser()
                setUser(data.user)
            } catch (error) {
                setUser(null)
                console.error('Error fetching user data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const handleLogout = async () => {
      await logout()
      setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }

