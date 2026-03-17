import { Link } from 'react-router-dom'
import { PageTransition } from '../../components/motion/PageTransition'

export function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-8 p-6 sm:p-8 overflow-x-hidden">
        <h1 className="font-display text-4xl sm:text-7xl text-saffron text-center leading-tight">
          Wedding Yatra
        </h1>
        <p className="font-sans text-charcoal/70 text-lg sm:text-xl text-center max-w-md">
          Experience authentic Indian weddings as a cultural traveller.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Link to="/weddings" className="btn-primary text-center">Browse Weddings</Link>
          <Link to="/signup" className="btn-outline text-center">Join as Host</Link>
        </div>
      </div>
    </PageTransition>
  )
}
