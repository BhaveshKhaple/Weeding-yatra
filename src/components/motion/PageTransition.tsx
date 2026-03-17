import { HTMLMotionProps, motion, useReducedMotion } from 'framer-motion'

export const PageTransition = (props: HTMLMotionProps<'div'>) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-grow flex flex-col"
      {...props}
    >
      {props.children}
    </motion.div>
  )
}
