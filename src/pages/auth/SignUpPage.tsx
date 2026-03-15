import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import type { UserRole } from '../../lib/types'

export function SignUpPage() {
  const navigate = useNavigate()
  const [role, setRole]         = useState<UserRole>('traveller')
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [nationality, setNationality] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          nationality: role === 'traveller' ? nationality : null,
        },
      },
    })

    if (error) { setError(error.message); setLoading(false); return }

    // Redirect based on role — profile trigger will have created the row
    navigate(role === 'host' ? '/host' : '/traveller')
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card-base w-full max-w-md p-8"
      >
        <h1 className="font-display text-4xl text-charcoal mb-2">Join Wedding Yatra</h1>
        <p className="font-sans text-charcoal/60 mb-8 text-sm">
          Create your account to get started
        </p>

        {/* Role Toggle */}
        <div className="flex rounded-full border border-turmeric p-1 mb-6">
          {(['traveller', 'host'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-full text-sm font-sans font-semibold capitalize transition-all duration-300 ${
                role === r
                  ? 'bg-saffron text-white shadow'
                  : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              {r === 'traveller' ? '✈️ Traveller' : '🪷 Host'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-sans font-medium text-charcoal mb-1">
              Full Name
            </label>
            <input
              type="text" required value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder={role === 'host' ? 'e.g., Priya & Rahul' : 'Your name'}
              className="w-full border border-turmeric/40 rounded-xl px-4 py-3 font-sans text-charcoal
                         focus:outline-none focus:ring-2 focus:ring-saffron/50 transition"
            />
          </div>

          <AnimatePresence mode="popLayout">
            {role === 'traveller' && (
              <motion.div
                key="nationality"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-sans font-medium text-charcoal mb-1">
                  Nationality
                </label>
                <input
                  type="text" value={nationality} required={role === 'traveller'}
                  onChange={e => setNationality(e.target.value)}
                  placeholder="e.g., German, Japanese, Brazilian"
                  className="w-full border border-turmeric/40 rounded-xl px-4 py-3 font-sans text-charcoal
                             focus:outline-none focus:ring-2 focus:ring-saffron/50 transition"
                />
              </motion.div>
            )}
          </AnimatePresence>

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
              type="password" required minLength={8} value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-turmeric/40 rounded-xl px-4 py-3 font-sans text-charcoal
                         focus:outline-none focus:ring-2 focus:ring-saffron/50 transition"
            />
          </div>

          {error && (
            <p className="text-rose text-sm font-sans">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-charcoal/60 mt-6 font-sans">
          Already have an account?{' '}
          <Link to="/login" className="text-saffron font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
