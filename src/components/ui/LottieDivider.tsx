import { LottieLoader } from './LottieLoader'

interface LottieDividerProps {
  // Ideally this would be typed stronger, but for initial wrapper `any` or `unknown` works
  animationData: unknown 
  className?: string
}

export const LottieDivider = ({ animationData, className = "w-full max-w-sm" }: LottieDividerProps) => {
  return (
    <div className={`py-8 my-8 flex items-center justify-center opacity-80 ${className}`}>
        <LottieLoader 
           animationData={animationData} 
           loop={true} 
           className="w-full h-auto" 
        />
    </div>
  )
}
