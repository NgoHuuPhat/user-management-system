import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
import { forgotPassword } from "@/services/api"
import { handleError } from "@/utils/handleError"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState(sessionStorage.getItem("email") || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if(!email) {
      setError("Email is required")
      setLoading(false)
      return
    }

    try {
      await forgotPassword(email)
      sessionStorage.setItem("email", email)
      navigate("/verify-otp")
    } catch (error) {
      setError(handleError(error))
    } finally {
      setLoading(false)
    }
  }

   return (
    <div className="min-h-screen flex flex-col space-y-10 items-center justify-center bg-gradient-to-br from-blue-300 via-cyan-200 to-teal-300 p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl py-10 px-4 gap-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Quên mật khẩu?</CardTitle>
          <CardDescription>Không sao, chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-gray-700 font-semibold text-base">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="pl-12 h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 focus:border-cyan-400 transition-all duration-300"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r transition-all duration-300 hover:scale-102 from-blue-300 via-cyan-300 to-teal-300 hover:from-blue-400 hover:via-cyan-400 hover:to-teal-400 text-white font-bold text-lg shadow-2xl cursor-pointer" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <span>Đang gửi yêu cầu...</span>
                </div>
              ) : "Gửi yêu cầu"}
            </Button>
          </form>
          {error && (
            <Alert className="bg-red-100/50 border-red-300/50 mt-4">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            to="/login"
            className="text-gray-600 hover:text-blue-400 font-semibold cursor-pointer text-sm"
          >
            Trở về Đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage