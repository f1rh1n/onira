"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiStar, HiChevronDown } from "react-icons/hi2";
import ReviewForm from "./ReviewForm";

interface CollapsibleReviewFormProps {
  profileId: string;
  username: string;
  reviewCount?: number;
}

export default function CollapsibleReviewForm({ profileId, username, reviewCount = 0 }: CollapsibleReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      {!isOpen ? (
        <div className="relative">
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg group relative overflow-hidden"
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

            <HiStar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            Leave an Anonymous Review
            <HiChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />

            {/* Review count badge */}
            {reviewCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-yellow-500 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1"
              >
                <HiStar className="w-3 h-3" />
                {reviewCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20 rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HiStar className="w-6 h-6 text-yellow-500" />
                Leave an Anonymous Review
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                <HiChevronDown className="w-6 h-6 rotate-180" />
              </button>
            </div>
            <ReviewForm profileId={profileId} username={username} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
