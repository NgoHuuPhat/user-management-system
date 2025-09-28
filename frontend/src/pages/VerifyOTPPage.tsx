import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { verifyOTP, forgotPassword } from "@/services/api"
import { handleError } from "@/utils/handleError"

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loadingOTP, setLoadingOTP] = useState(false)
  const [loadingResend, setLoadingResend] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const email = sessionStorage.getItem("email") || ""
  const navigate = useNavigate()

  useEffect(() => {
    if(!email) {
      navigate("/forgot-password")
      return
    }
  }, [navigate, email])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoadingOTP(true)
    setError("")

    if(!otp) {
      setError("OTP is required")
      setLoadingOTP(false)
      return
    }

    try {
      await verifyOTP(email, otp)
      navigate("/reset-password")
    } catch (error) {
      setError(handleError(error))
    } finally {
      setLoadingOTP(false)
    }
  }

  const handleResendEmail = async () => {
    setLoadingResend(true)
    setError("")
    setSuccessMessage("")

    try {
      await forgotPassword(email)
      setSuccessMessage("OTP has been resent to your email.")
    } catch (error) {
      setError(handleError(error))
    } finally {
      setLoadingResend(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 via-cyan-200 to-teal-300 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <Card className="relative w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 gap-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Enter OTP</CardTitle>
          <p className=" text-gray-600 text-md">
            We have sent a 6-digit verification code to <span className="font-medium">{email}</span>. Please check your inbox.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Input
                id="otp"
                type="text"
                value={otp}
                className="pl-6 h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 focus:border-cyan-400 transition-all duration-300"
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập OTP đã gửi ở email"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r transition-all duration-300 hover:scale-102 from-blue-300 via-cyan-300 to-teal-300 hover:from-blue-400 hover:via-cyan-400 hover:to-teal-400 text-white font-bold text-lg shadow-2xl cursor-pointer" 
              disabled={loadingOTP}
            >
              {loadingOTP ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : "Send OTP"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 items-center">
          {error && (
            <Alert className="bg-red-100/50 border-red-300/50 w-full">
              <AlertDescription className="text-red-700 text-center">{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="bg-green-100/50 border-green-300/50 w-full">
              <AlertDescription className="text-green-700 text-center">{successMessage}</AlertDescription>
            </Alert>
          )}

          <p className="text-sm text-gray-500 text-center">
            <span>Didn't receive the email? </span>
            <button onClick={handleResendEmail} className="text-blue-400 hover:text-blue-500 font-medium transition-colors cursor-pointer">
              {loadingResend ? "Resending..." : "Resend OTP"}
            </button>
          </p>
          <Link
            to="/login"
            className="text-gray-600 hover:text-blue-400 font-semibold cursor-pointer text-sm"
          >
            Go back to login
          </Link>
        </CardFooter>

      </Card>
    </div>
  )
}

export default VerifyOTPPage