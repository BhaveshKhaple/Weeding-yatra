import { motion } from 'framer-motion'

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-ivory font-sans flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-8 p-4 bg-saffron/10 rounded-full w-24 h-24 flex items-center justify-center">
        <span className="text-4xl">🪷</span>
      </div>

      <h1 className="font-display text-4xl sm:text-6xl text-saffron mb-4">
        Wedding Yatra
      </h1>
      <p className="font-sans text-charcoal/70 text-xl max-w-lg mb-8">
        Scaffolding complete. The full animation suite and Indian UI design tokens are ready.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <button className="btn-primary">Host a Wedding</button>
        <button className="btn-outline">Find a Wedding</button>
      </div>

      <div className="mt-12 w-full max-w-sm">
        <div className="divider-ornate"></div>
        <p className="text-charcoal/40 text-sm font-sans">v1.0 MVP Base Scaffold</p>
      </div>
    </motion.div>
  )
}
