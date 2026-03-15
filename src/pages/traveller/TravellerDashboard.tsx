import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

export function TravellerDashboard() {
  const { profile, signOut } = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-charcoal flex flex-col items-center justify-center p-8 gap-6"
    >
      <h1 className="font-display text-5xl text-turmeric">Traveller Dashboard</h1>
      <p className="font-sans text-ivory/80 text-lg">
        Welcome, {profile?.full_name || 'Traveller'} ✈️
      </p>
      <p className="font-sans text-ivory/50 text-sm">
        Phase 3 will build the wedding directory. Coming soon.
      </p>
      <button onClick={signOut} className="btn-outline border-ivory text-ivory hover:bg-ivory hover:text-charcoal">
        Log Out
      </button>
    </motion.div>
  )
}
