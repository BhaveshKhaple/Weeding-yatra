import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

export function HostDashboard() {
  const { profile, signOut } = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-charcoal flex flex-col items-center justify-center p-8 gap-6"
    >
      <h1 className="font-display text-5xl text-saffron">Host Dashboard</h1>
      <p className="font-sans text-ivory/80 text-lg">
        Welcome, {profile?.full_name || 'Host'} 🪷
      </p>
      <p className="font-sans text-ivory/50 text-sm">
        Phase 2 will build this dashboard. Check back soon.
      </p>
      <button onClick={signOut} className="btn-outline border-ivory text-ivory hover:bg-ivory hover:text-charcoal">
        Log Out
      </button>
    </motion.div>
  )
}
