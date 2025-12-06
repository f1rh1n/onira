"use client";

import { motion } from "framer-motion";

export default function Logo({ size = "text-3xl" }: { size?: string }) {
  return (
    <span className={`${size} font-bold tracking-wider inline-flex items-center select-none`}>
      <span className="text-purple-600">ON</span>
      <motion.span
        className="text-pink-500 cursor-pointer"
        whileHover={{ y: [-2, -8, -2] }}
        whileTap={{ y: [-2, -8, -2] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        i
      </motion.span>
      <span className="text-purple-600">RA</span>
    </span>
  );
}
