import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle, CardHeader} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Check, Mail, Lock } from "lucide-react"
import { login } from "@/services/api"
import { handleError } from "@/utils/handleError"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "react-router-dom"

export const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if(!email || !password) {
      setError("Please fill in all fields.")
      setIsLoading(false)
      return
    }

    try {
      const res = await login(email, password, rememberMe)
      setUser(res.user)
    } catch (error) {
      console.error("Login error:", error)
      setError(handleError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-300 via-cyan-200 to-teal-300">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-100/40 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-100/40 rounded-full blur-lg animate-ping"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-100/40 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-12 h-12 bg-teal-100/35 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute top-2/3 right-1/3 w-28 h-28 bg-cyan-100/35 rounded-full blur-2xl animate-bounce delay-700"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">
              User Management System
            </h1>
          </div>

          <Card className="bg-white border-gray-200 gap-4 shadow-2xl py-10 px-6" id="login-card">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl text-gray-800 font-bold">LOGIN</CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit}> 
              <CardContent className="space-y-4">
                {error && (
                  <Alert className="bg-red-100/50 border-red-300/50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-700 font-semibold text-base">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      className="pl-12 h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 focus:border-cyan-400 transition-all duration-300"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-gray-700 font-semibold text-base">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-12 pr-12 h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 focus:border-cyan-400 transition-all duration-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />

                    <Button 
                      type="button"
                      variant="link"
                      size="lg"
                      className="absolute right-0 top-0 h-full px-4 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                      className="w-5 h-5 border-gray-300 relative cursor-pointer flex items-center justify-center data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-300 data-[state=checked]:to-cyan-300 data-[state=checked]:border-none"
                    >
                      <span className="absolute text-white w-3 h-3 data-[state=unchecked]:hidden">
                        <Check className="w-3 h-3 stroke-3" />
                      </span>
                    </Checkbox>
                    <Label htmlFor="remember" className="cursor-pointer text-gray-700 font-semibold">Remember Me</Label>
                  </div>
                  <Link to="/forgot-password" className="px-0 text-gray-600 hover:text-blue-400 font-semibold cursor-pointer text-sm">
                    Forgot Password?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r transition-all duration-300 hover:scale-102 from-blue-300 via-cyan-300 to-teal-300 hover:from-blue-400 hover:via-cyan-400 hover:to-teal-400 text-white font-bold text-lg shadow-2xl cursor-pointer" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      <span>Sending request...</span>
                    </div>
                  ) : "Login"}
                </Button>

                <div className="relative w-full">
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-gradient-to-r from-blue-200/20 to-cyan-200/20 px-4 py-1 text-gray-600 font-semibold rounded-full">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button 
                    type="button"
                    variant="outline" 
                    disabled={isLoading} 
                    className="flex items-center justify-center cursor-pointer gap-3 h-12 bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 transform hover:scale-102"
                  >
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-5 h-5"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                    <span className="font-semibold">Google</span>
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    disabled={isLoading}
                    className="flex items-center justify-center cursor-pointer gap-3 h-12 bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 transform hover:scale-102"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="font-semibold">Facebook</span>
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage