"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Smooth spring easing - feels more natural
const smoothSpring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 0.5,
};

// Ultra smooth cubic bezier
const ultraSmooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Fade and slide up transition
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
        transition={{
          duration: 0.4,
          ease: ultraSmooth,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Fade only transition (lighter, faster)
export function FadeTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: ultraSmooth,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Scale and fade transition (modern feel)
export function ScaleTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
        transition={{
          ...smoothSpring,
          opacity: { duration: 0.3, ease: ultraSmooth },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Slide from right transition (good for navigation)
export function SlideTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -15, filter: "blur(2px)" }}
        transition={{
          duration: 0.45,
          ease: ultraSmooth,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
