import { motion } from 'framer-motion'

export const slideAnimation = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { type: 'spring', stiffness: 260, damping: 20 }
}

export const MotionDiv = motion.div
export const MotionButton = motion.button