import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// Page transition variants — dramatic slide + fade
const variants = {
  initial: {
    opacity: 0,
    y: 30,
    clipPath: 'inset(0 0 100% 0)',
  },
  animate: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    clipPath: 'inset(0 0 0 0)',
    transition: {
      duration: 0.35,
      ease: [0.87, 0, 0.13, 1] as [number, number, number, number],
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ position: 'relative', minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
