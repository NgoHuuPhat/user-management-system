import { createContext, useState, useEffect } from 'react'
import { getCurrentUser } from '@/services/api'
import type { IAuthContextType, IUser} from '@/types/user'

const AuthContext = createContext<IAuthContextType>({
    user: null,
    setUser: () => {},
    loading: true
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getCurrentUser()
                setUser(res.user)
            } catch (error) {
                setUser(null)
                console.error('Error fetching user data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }

