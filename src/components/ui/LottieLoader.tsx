import Lottie, { LottieComponentProps } from 'lottie-react'

// Generic wrapper that sets defaults
export const LottieLoader = ({ 
  animationData, 
  loop = true, 
  className = "w-24 h-24",
  ...props 
}: Partial<LottieComponentProps> & { animationData: unknown, className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie 
        animationData={animationData} 
        loop={loop} 
        style={{ width: '100%', height: '100%' }}
        {...props} 
      />
    </div>
  )
}
