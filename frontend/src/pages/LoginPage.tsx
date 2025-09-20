import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle, CardHeader} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@radix-ui/react-checkbox"
import { Separator } from "@radix-ui/react-separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"
import { login } from "@/services/api"
import { handleError } from "@/utils/handleError"

export const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      await login(email, password, rememberMe)
      alert("Login successful!")
    } catch (error) {
      console.error("Login error:", error)
      setError(handleError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-400 via-red-500 to-pink-500 opacity-50"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-400/40 rounded-full blur-lg animate-ping"></div>
      <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-400/30 rounded-full blur-xl animate-pulse delay-1000"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shadow-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Chào mừng trở lại!
            </h1>
            <p className="mt-3 text-lg text-white/90 drop-shadow">
              Đăng nhập để tiếp tục hành trình của bạn
            </p>
          </div>
          
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl text-white font-bold">Đăng Nhập</CardTitle>
              <CardDescription className="text-white/80 text-base">
                Nhập thông tin để truy cập tài khoản
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}> 
              <CardContent className="space-y-6">
                {error && (
                  <Alert className="bg-red-500/20 border-red-300/50 backdrop-blur-sm">
                    <AlertDescription className="text-white">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white font-semibold text-base">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      className="pl-12 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30 focus:border-white/60 transition-all duration-300"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email của bạn"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-white font-semibold text-base">Mật khẩu</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      className="pl-12 pr-12 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30 focus:border-white/60 transition-all duration-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />

                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-4 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                      className="w-5 h-5 border-white/30 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-violet-500"
                    />
                    <Label htmlFor="remember" className="text-white/90 font-medium">Ghi nhớ đăng nhập</Label>
                  </div>
                  <Button variant="link" className="px-0 text-white/80 hover:text-white font-semibold">
                    Quên mật khẩu?
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : "Đăng Nhập"}
                </Button>

                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-white/30" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-1 text-white/80 font-semibold rounded-full">
                      Hoặc tiếp tục với
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button 
                    variant="outline" 
                    disabled={isLoading} 
                    className="flex items-center justify-center gap-3 h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
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
                    variant="outline" 
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
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