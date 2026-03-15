import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Auth pages (eagerly loaded — small, needed immediately)
import { LoginPage }  from './pages/auth/LoginPage'
import { SignUpPage } from './pages/auth/SignUpPage'

// Lazy-load all other pages (reduces initial bundle)
const HomePage        = lazy(() => import('./pages/public/HomePage').then(m => ({ default: m.HomePage })))
const DirectoryPage   = lazy(() => import('./pages/public/DirectoryPage').then(m => ({ default: m.DirectoryPage })))
const ListingPage     = lazy(() => import('./pages/public/ListingPage').then(m => ({ default: m.ListingPage })))
const HostDashboard   = lazy(() => import('./pages/host/HostDashboard').then(m => ({ default: m.HostDashboard })))
const TravellerDash   = lazy(() => import('./pages/traveller/TravellerDashboard').then(m => ({ default: m.TravellerDashboard })))

const PageLoader = () => (
  <div className="min-h-screen bg-ivory flex items-center justify-center">
    <div className="text-saffron font-display text-2xl animate-pulse">
      Wedding Yatra...
    </div>
  </div>
)

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense>,
  },
  {
    path: '/weddings',
    element: <Suspense fallback={<PageLoader />}><DirectoryPage /></Suspense>,
  },
  {
    path: '/weddings/:slug',
    element: <Suspense fallback={<PageLoader />}><ListingPage /></Suspense>,
  },

  // Auth routes
  { path: '/login',  element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },

  // Host-protected routes
  {
    element: <ProtectedRoute requiredRole="host" />,
    children: [
      { path: '/host', element: <Suspense fallback={<PageLoader />}><HostDashboard /></Suspense> },
    ],
  },

  // Traveller-protected routes
  {
    element: <ProtectedRoute requiredRole="traveller" />,
    children: [
      { path: '/traveller', element: <Suspense fallback={<PageLoader />}><TravellerDash /></Suspense> },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
])
