import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { resetPassword } from "@/services/api"
import { handleError } from "@/utils/handleError"

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email")
    if (!savedEmail) {
      navigate("/forgot-password")
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if(!password || !confirmPassword) {
      setError("Both password fields are required")
      setLoading(false)
      return
    }

    try {
      await resetPassword(password, confirmPassword)
      sessionStorage.removeItem("email")
      navigate("/login")
    } catch (error) {
      setError(handleError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 via-cyan-200 to-teal-300 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative w-full max-w-lg px-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl py-10 px-4 gap-4">
          <CardHeader className="text-center mb-2">
            <CardTitle className="text-3xl font-bold">Create New Password</CardTitle>
            <p className="text-gray-600 text-sm mt-1">Please enter your new password</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className="pl-6 h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 focus:border-cyan-400 transition-all duration-300"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    className="pl-6 h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 focus:border-cyan-400 transition-all duration-300"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter your new password"
                  />
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
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
                    <span>Updating...</span>
                  </div>
                ) : "Update Password"}
              </Button>
            </form>
            {error && (
              <Alert className="bg-red-100/50 border-red-300/50 mt-4">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-400 font-semibold cursor-pointer text-sm"
            >
              Go back to login
            </Link>
            {error === "Invalid or expired reset token. Please request a new OTP." && (
              <>
                <span>|</span>
                <Link
                  to="/forgot-password"
                  className="text-gray-600 hover:text-blue-400 font-semibold cursor-pointer text-sm"
                >
                  Request New OTP
                </Link>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordPage
