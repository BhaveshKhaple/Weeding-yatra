import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-8 p-8"
    >
      <h1 className="font-display text-7xl text-saffron text-center leading-tight">
        Wedding Yatra
      </h1>
      <p className="font-sans text-charcoal/70 text-xl text-center max-w-md">
        Experience authentic Indian weddings as a cultural traveller.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/weddings" className="btn-primary">Browse Weddings</Link>
        <Link to="/signup" className="btn-outline">Join as Host</Link>
      </div>
    </motion.div>
  )
}
