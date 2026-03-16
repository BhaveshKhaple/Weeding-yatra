import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../../components/motion/PageTransition'
import { useDirectory } from '../../hooks/useDirectory'
import { WeddingCard } from '../../components/listing/WeddingCard'


export function DirectoryPage() {
  const { listings, loading, error } = useDirectory()

  return (
    <PageTransition>
      <div className="min-h-screen bg-charcoal text-ivory pb-24">
        {/* Navigation Bar */}
        <nav className="p-6">
          <Link to="/" className="text-ivory/60 hover:text-turmeric text-sm transition-colors font-sans">
            ← Back to Home
          </Link>
        </nav>

        {/* Hero Section */}
        <header className="px-6 py-12 text-center flex flex-col items-center max-w-2xl mx-auto gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="text-5xl"
          >
            🪷
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-turmeric mt-2"
          >
            Discover Weddings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-ivory/80 text-lg md:text-xl"
          >
            Explore upcoming authentic Indian wedding celebrations, and find one to join.
          </motion.p>
        </header>

        {/* Filter Bar Placeholder */}
        <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between border-b border-ivory/10 pb-4">
          <h2 className="font-sans text-xl font-medium text-ivory/90">
            All Open Weddings
          </h2>
          {/* Note: Plan 03-02 will add the filter bar here */}
        </div>

        {/* Grid / States */}
        <main className="max-w-7xl mx-auto px-6">
          {error ? (
            <div className="py-20 text-center text-rose">
              <p>Failed to load weddings. Please try again later.</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5,  6].map((i) => (
                <div key={i} className="bg-white/5 rounded-2xl aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="text-6xl opacity-70">🐘</div>
              <h3 className="font-display text-3xl text-ivory/90">No weddings found</h3>
              <p className="font-sans text-ivory/60 max-w-sm">
                There are currently no open weddings accepting requests. Please check back soon!
              </p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {listings.map((listing) => (
                  <WeddingCard key={listing.id} listing={listing} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  )
}
