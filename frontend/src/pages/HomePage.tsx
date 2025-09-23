import { useAuth } from "@/hooks/useAuth"

export const HomePage = () => {
  const { user } = useAuth()

  if(user){
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
      </div>
    )
  }
}

export default HomePage
