import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJoinRequests } from '../../hooks/useJoinRequests'
import { JoinRequestWithTraveller, JoinRequestStatus } from '../../lib/types'
import { RequestCard } from './RequestCard'
import { RequestActionModal } from './RequestActionModal'

export function HostRequestsSection({ listingId }: { listingId: string }) {
  const { fetchHostRequests, updateRequestStatus, loading } = useJoinRequests()

  // ── State ─────────────────────────────────────────────────────────────────
  const [requests, setRequests] = useState<JoinRequestWithTraveller[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'declined'>('pending')
  
  // Modal state
  const [selectedRequest, setSelectedRequest] = useState<JoinRequestWithTraveller | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Initial fetch
  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      const data = await fetchHostRequests(listingId)
      if (mounted) setRequests(data)
    }
    loadData()
    return () => { mounted = false }
  }, [listingId])

  // ── Derived Data ──────────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    all:      requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    declined: requests.filter(r => r.status === 'declined').length,
  }), [requests])

  const filtered = useMemo(() => {
    if (activeTab === 'all') return requests
    return requests.filter(r => r.status === activeTab)
  }, [requests, activeTab])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleApproveClick = (req: JoinRequestWithTraveller) => {
    setSelectedRequest(req)
    setActionType('approve')
  }

  const handleDeclineClick = (req: JoinRequestWithTraveller) => {
    setSelectedRequest(req)
    setActionType('decline')
  }

  const handleCloseModal = () => {
    if (actionLoading) return
    setSelectedRequest(null)
    setActionType(null)
  }

  const handleConfirmAction = async (reason?: string) => {
    if (!selectedRequest || !actionType) return
    
    setActionLoading(true)

    // 1. Optimistic Update
    const newStatus: JoinRequestStatus = actionType === 'approve' ? 'approved' : 'declined'
    const previousRequests = [...requests]

    setRequests(prev => 
      prev.map(r => 
        r.id === selectedRequest.id 
          ? { ...r, status: newStatus, decline_reason: reason ?? r.decline_reason }
          : r
      )
    )

    // 2. Immediately close modal to trigger card animation 
    const cachedRequest = selectedRequest
    setSelectedRequest(null)
    setActionType(null)

    // 3. Persist to DB
    const { success, error } = await updateRequestStatus(cachedRequest.id, newStatus, reason)

    // 4. Rollback if failure
    if (!success) {
      setRequests(previousRequests)
      console.error('Failed to update request status:', error)
      alert('Failed to update request. Please try again.')
    }
    
    setActionLoading(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading && requests.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-pulse mt-8">
        <div className="h-6 w-48 bg-white/10 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/10 rounded-2xl" />)}
        </div>
        <div className="h-40 bg-white/10 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full py-8 text-ivory">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-3xl">Incoming Requests</h2>
        {counts.pending > 0 && (
          <span className="w-2.5 h-2.5 rounded-full bg-turmeric animate-pulse" />
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'all', label: 'Total', count: counts.all, color: 'text-ivory' },
          { id: 'pending', label: 'Pending', count: counts.pending, color: 'text-turmeric' },
          { id: 'approved', label: 'Approved', count: counts.approved, color: 'text-emerald-400' },
          { id: 'declined', label: 'Declined', count: counts.declined, color: 'text-rose' },
        ].map(stat => (
          <div key={stat.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
            <div className="text-sm text-ivory/50 font-sans">{stat.label}</div>
            <div className={`text-3xl font-display mt-1 ${stat.color}`}>{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-6 border-b border-white/10 overflow-x-auto scrollbar-hide">
        {(['pending', 'approved', 'declined', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-3 px-1 font-medium text-sm transition-colors whitespace-nowrap outline-none ${
              activeTab === tab ? 'text-saffron' : 'text-ivory/50 hover:text-ivory/80'
            }`}
          >
            <span className="capitalize">{tab}</span>
            <span className="ml-2 text-xs bg-black/30 px-2 py-0.5 rounded-full border border-white/5">
              {counts[tab]}
            </span>
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-saffron rounded-t-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="min-h-[200px] relative">
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center bg-white/5 border border-white/10 rounded-2xl border-dashed"
              >
                <div className="text-4xl mb-3 opacity-50">
                  {activeTab === 'pending' && '🌸'}
                  {activeTab === 'approved' && '🎉'}
                  {activeTab === 'declined' && '🍃'}
                  {activeTab === 'all' && '📫'}
                </div>
                <p className="text-ivory/60 text-sm">
                  {activeTab === 'pending' && 'No pending requests yet — share your listing to start receiving enquiries.'}
                  {activeTab === 'approved' && 'No approved guests yet.'}
                  {activeTab === 'declined' && 'No declined requests.'}
                  {activeTab === 'all' && 'No requests yet.'}
                </p>
              </motion.div>
            ) : (
              filtered.map((req, i) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  index={i}
                  onApprove={handleApproveClick}
                  onDecline={handleDeclineClick}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {selectedRequest && actionType && (
          <RequestActionModal
            request={selectedRequest}
            action={actionType}
            onConfirm={handleConfirmAction}
            onClose={handleCloseModal}
            isLoading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
