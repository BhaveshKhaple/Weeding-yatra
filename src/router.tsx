import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AnimatePresence } from 'framer-motion'
import { useSmoothScroll } from './lib/lenis'

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

// The Root Layout handles AnimatePresence and Lenis initiation
const AppLayout = () => {
  const location = useLocation()
  
  // Immersive pages that require smooth scrolling
  const isImmersive = location.pathname === '/' || location.pathname.startsWith('/weddings')
  // Automatically instantiate/destroy Lenis based on the current route
  useSmoothScroll(isImmersive)

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />} key={location.pathname}>
        <Outlet />
      </Suspense>
    </AnimatePresence>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Public routes
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/weddings',
        element: <DirectoryPage />,
      },
      {
        path: '/weddings/:slug',
        element: <ListingPage />,
      },
    
      // Auth routes
      { path: '/login',  element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
    
      // Host-protected routes
      {
        element: <ProtectedRoute requiredRole="host" />,
        children: [
          { path: '/host', element: <HostDashboard /> },
        ],
      },
    
      // Traveller-protected routes
      {
        element: <ProtectedRoute requiredRole="traveller" />,
        children: [
          { path: '/traveller', element: <TravellerDash /> },
        ],
      },
    
      // Fallback
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
])
