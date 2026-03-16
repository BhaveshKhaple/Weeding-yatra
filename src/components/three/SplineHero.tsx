import { Suspense, lazy } from 'react'

// Lazy load the Spline component because it brings in the heavy Tool runtime
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineHeroProps {
  sceneUrl: string
  className?: string
  fallback?: React.ReactNode
}

export const SplineHero = ({ 
  sceneUrl, 
  className = "w-full h-full min-h-[400px]",
  fallback 
}: SplineHeroProps) => {
  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={
        fallback || (
          <div className="absolute inset-0 flex items-center justify-center bg-saffron/5 animate-pulse">
            <span className="text-4xl">🪷</span>
          </div>
        )
      }>
        <Spline scene={sceneUrl} />
      </Suspense>
    </div>
  )
}
