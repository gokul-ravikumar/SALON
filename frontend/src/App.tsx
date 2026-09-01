import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from '@/pages/DashboardPage'
import { UserDashboardPage } from '@/pages/UserDashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { VerifyEmailPage } from '@/pages/VerifyEmailPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { useAuthStore } from '@/store/authStore'

function HomeRoute() {
  const role = useAuthStore((state) => state.user?.role)
  return role === 'admin' ? <DashboardPage /> : <UserDashboardPage />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><HomeRoute /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
