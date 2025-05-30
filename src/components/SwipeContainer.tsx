
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwipeContainerProps {
  children: React.ReactNode;
  currentPage: string;
}

const pageVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};

export const SwipeContainer: React.FC<SwipeContainerProps> = ({
  children,
  currentPage,
}) => {
  return (
    <div className="h-full overflow-hidden">
      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={currentPage}
          custom={1}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
