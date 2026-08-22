import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { VerifyEmailPage } from '@/pages/VerifyEmailPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
