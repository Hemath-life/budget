"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function AuthTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.5,
        opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
