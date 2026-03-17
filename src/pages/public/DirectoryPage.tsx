import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../../components/motion/PageTransition'
import { useDirectory } from '../../hooks/useDirectory'
import { WeddingCard } from '../../components/listing/WeddingCard'
import { DirectoryFilterBar, DirectoryFilters } from '../../components/listing/DirectoryFilters'

export function DirectoryPage() {
  const { listings, loading, error, cities } = useDirectory()

  const [filters, setFilters] = useState<DirectoryFilters>({
    city: null,
    dateFrom: null,
    dateTo: null
  })

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // City Match
      if (filters.city && listing.city !== filters.city) {
        return false
      }
      
      // Date Range Match
      if (filters.dateFrom && listing.wedding_date < filters.dateFrom) {
        return false
      }
      if (filters.dateTo && listing.wedding_date > filters.dateTo) {
        return false
      }

      return true
    })
  }, [listings, filters])

  return (
    <PageTransition>
      <div className="min-h-screen bg-charcoal text-ivory pb-24">
        {/* Navigation Bar */}
        <nav className="p-6">
          <Link to="/" className="text-ivory/60 hover:text-turmeric text-sm transition-colors font-sans flex items-center gap-2">
            <span>←</span> Back to Home
          </Link>
        </nav>

        {/* Hero Section */}
        <header className="px-6 py-6 pb-12 text-center flex flex-col items-center max-w-2xl mx-auto gap-4">
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

        {/* Filter Bar */}
        {!loading && !error && listings.length > 0 && (
          <DirectoryFilterBar 
            cities={cities} 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        )}

        {/* Meta / Results Count */}
        {!loading && !error && listings.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
            <h2 className="font-sans text-xl font-medium text-ivory/90">
              Open Weddings
            </h2>
            <span className="text-sm text-ivory/50">
              Showing {filteredListings.length} of {listings.length}
            </span>
          </div>
        )}

        {/* Grid / States */}
        <main className="max-w-7xl mx-auto px-6">
          {error ? (
            <div className="py-20 text-center text-rose border border-rose/10 bg-rose/5 rounded-2xl">
              <p>Failed to load weddings. Please try again later.</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 rounded-2xl aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center gap-4 border border-white/5 rounded-3xl bg-white/5"
            >
              <div className="text-6xl opacity-70">🐘</div>
              <h3 className="font-display text-3xl text-ivory/90">No weddings found</h3>
              <p className="font-sans text-ivory/60 max-w-sm">
                There are currently no open weddings accepting requests. Please check back soon!
              </p>
            </motion.div>
          ) : filteredListings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 flex flex-col items-center justify-center text-center gap-4 bg-charcoal/50 border border-white/5 rounded-2xl"
            >
              <div className="text-5xl opacity-50 mb-2">🔍</div>
              <h3 className="font-display text-2xl text-ivory/90">No matches found</h3>
              <p className="font-sans text-ivory/50">
                Try adjusting or removing your filters to find more weddings.
              </p>
              <button 
                onClick={() => setFilters({ city: null, dateFrom: null, dateTo: null })}
                className="mt-4 text-turmeric hover:text-saffron transition-colors text-sm font-medium border border-turmeric/20 px-4 py-2 rounded-full hover:bg-turmeric/10"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredListings.map((listing) => (
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

