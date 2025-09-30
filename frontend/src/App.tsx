import { Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "@/pages/DashboardPage"
import LoginPage from "@/pages/LoginPagePage"
import PublicOnlyRoute from "@/components/auth/PublicOnlyRoute"
import AdminRoute from "@/components/auth/AdminRoute"
import ForgotPasswordPage from "@/pages/ForgotPasswordPage"
import VerifyOTPPage from "@/pages/VerifyOTPPage"
import ResetPasswordPage from "@/pages/ResetPassword"
import ManageUserPage from "@/pages/ManageUserPage"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <Toaster position="top-center" richColors/>

      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/manage-users" element={<AdminRoute><ManageUserPage /></AdminRoute>} />
        <Route path="/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App
