import { Link } from 'react-router-dom'
export function ListingPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl text-charcoal mb-4">Wedding Detail</h1>
        <p className="font-sans text-charcoal/60 mb-6">Built in Phase 3.</p>
        <Link to="/weddings" className="btn-outline">← Directory</Link>
      </div>
    </div>
  )
}
