import { Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "@/pages/DashboardPage"
import LoginPage from "@/pages/LoginPagePage"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import PublicOnlyRoute from "@/components/auth/PublicOnlyRoute"
import ForgotPasswordPage from "@/pages/ForgotPasswordPage"
import VerifyOTPPage from "@/pages/VerifyOTPPage"
import ResetPasswordPage from "@/pages/ResetPassword"
import ManageUserPage from "@/pages/ManageUserPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/manage-users" element={<ProtectedRoute><ManageUserPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App
