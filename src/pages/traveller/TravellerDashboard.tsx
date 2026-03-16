import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useJoinRequests } from '../../hooks/useJoinRequests'
import { PageTransition } from '../../components/motion/PageTransition'
import { RequestStatusCard } from '../../components/traveller/RequestStatusCard'
import type { JoinRequestWithListing } from '../../lib/types'

type FilterType = 'All' | 'Pending' | 'Approved' | 'Declined'

export function TravellerDashboard() {
  const { user, profile, signOut } = useAuth()
  const { fetchMyRequests } = useJoinRequests()
  const navigate = useNavigate()

  const [requests, setRequests] = useState<JoinRequestWithListing[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('All')

  useEffect(() => {
    if (!user) return

    async function loadData() {
      setLoading(true)
      const data = await fetchMyRequests(user!.id)
      setRequests(data)
      setLoading(false)
    }

    loadData()
  }, [user, fetchMyRequests])

  const handleSignout = async () => {
    await signOut()
    navigate('/')
  }

  const filteredRequests = useMemo(() => {
    if (filter === 'All') return requests
    return requests.filter(r => r.status.toLowerCase() === filter.toLowerCase())
  }, [requests, filter])

  // Stats
  const statCounts = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      declined: requests.filter(r => r.status === 'declined').length
    }
  }, [requests])

  return (
    <PageTransition>
      <div className="min-h-screen bg-charcoal text-ivory pb-24 font-sans border-t border-t-white/10">
        
        {/* Navigation */}
        <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-turmeric font-display text-2xl tracking-wide">
            Wedding Yatra
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/weddings" className="text-ivory/60 hover:text-turmeric text-sm transition-colors hidden sm:block">
              Browse Weddings
            </Link>
            <button 
              onClick={handleSignout}
              className="px-4 py-2 border border-white/10 rounded-full text-sm text-ivory/80 hover:bg-white/5 transition-colors"
            >
              Log Out
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 mt-8">
          
          {/* Header */}
          <header className="mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl sm:text-5xl text-ivory flex items-center gap-3 drop-shadow-sm"
            >
             <span className="text-4xl drop-shadow-none">🙏</span> Namaste, {profile?.full_name?.split(' ')[0] || 'Traveler'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-ivory/60 mt-2 text-lg font-sans"
            >
              Track your requests to join Indian weddings across the country.
            </motion.p>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="bg-white/5 h-48 rounded-2xl" />)}
            </div>
          ) : requests.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="py-32 flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-3xl mt-8"
            >
              <div className="text-6xl mb-6 opacity-80">🐘</div>
              <h3 className="font-display text-3xl text-ivory mb-2">No Requests Yet</h3>
              <p className="font-sans text-ivory/60 max-w-md mx-auto mb-8">
                You haven't requested to join any weddings yet! Go explore the directory to find a celebration.
              </p>
              <Link to="/weddings" className="btn-primary px-8 py-3 bg-gradient-to-r from-turmeric to-saffron rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.2)]">
                Explore Weddings →
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Summary Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <StatCard title="Total Requests" value={statCounts.all} icon="📜" />
                <StatCard title="Pending" value={statCounts.pending} icon="⏳" colorClass="text-amber-500" />
                <StatCard title="Approved" value={statCounts.approved} icon="✅" colorClass="text-green-500" />
                <StatCard title="Declined" value={statCounts.declined} icon="❌" colorClass="text-rose" />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 sm:gap-6 border-b border-ivory/10 mb-8 overflow-x-auto no-scrollbar">
                {(['All', 'Pending', 'Approved', 'Declined'] as FilterType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                      filter === tab ? 'text-ivory' : 'text-ivory/40 hover:text-ivory/70'
                    }`}
                  >
                    {tab}
                    {filter === tab && (
                      <motion.div 
                        layoutId="activeTabUnderline"
                        className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-turmeric"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req, i) => (
                      <RequestStatusCard key={req.id} request={req} index={i} />
                    ))
                  ) : (
                    <motion.div 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full py-20 text-center border-dashed border border-white/10 rounded-2xl bg-charcoal/20"
                    >
                      <p className="text-ivory/50">No {filter.toLowerCase()} requests found.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          )}

        </main>
      </div>
    </PageTransition>
  )
}

function StatCard({ title, value, icon, colorClass = "text-ivory" }: { title: string, value: number, icon: string, colorClass?: string }) {
  return (
    <div className="bg-charcoal/50 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 transition-transform hover:-translate-y-1 hover:border-white/20">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl sm:text-2xl shrink-0 border border-white/5 shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-sm text-ivory/50 font-medium mb-1 drop-shadow-md">{title}</p>
        <p className={`text-2xl sm:text-3xl font-display ${colorClass}`}>{value}</p>
      </div>
    </div>
  )
}
