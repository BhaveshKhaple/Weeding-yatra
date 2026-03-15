import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { UserRole } from '../../lib/types'

interface Props {
  requiredRole?: UserRole
}

export function ProtectedRoute({ requiredRole }: Props) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  // Show nothing while auth initialises — prevents flash of redirect
  if (loading) return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-saffron font-display text-2xl animate-pulse">
        Wedding Yatra...
      </div>
    </div>
  )

  // Not logged in → redirect to login, preserve intended URL
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in, but wrong role
  if (requiredRole && profile?.role !== requiredRole) {
    const redirect = profile?.role === 'host' ? '/host' : '/traveller'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
