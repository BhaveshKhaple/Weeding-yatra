import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { profile } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  // If already logged in, redirect to their dashboard
  if (profile) {
    navigate(profile.role === 'host' ? '/host' : '/traveller', { replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) { setError(error.message); setLoading(false); return }

    // Redirect: if there was a guarded page they tried to visit, go there; else dashboard
    const from = (location.state as { from?: Location })?.from?.pathname
    navigate(from ?? (data.user ? '/host' : '/traveller'), { replace: true })
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card-base w-full max-w-md p-8"
      >
        <h1 className="font-display text-4xl text-charcoal mb-2">Welcome back</h1>
        <p className="font-sans text-charcoal/60 mb-8 text-sm">
          Log in to continue your journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-sans font-medium text-charcoal mb-1">Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-turmeric/40 rounded-xl px-4 py-3 font-sans text-charcoal
                         focus:outline-none focus:ring-2 focus:ring-saffron/50 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-sans font-medium text-charcoal mb-1">Password</label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-turmeric/40 rounded-xl px-4 py-3 font-sans text-charcoal
                         focus:outline-none focus:ring-2 focus:ring-saffron/50 transition"
            />
          </div>

          {error && <p className="text-rose text-sm font-sans">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-charcoal/60 mt-6 font-sans">
          Don't have an account?{' '}
          <Link to="/signup" className="text-saffron font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
