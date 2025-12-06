"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiStar, HiChevronDown } from "react-icons/hi2";
import ReviewForm from "./ReviewForm";

interface CollapsibleReviewFormProps {
  profileId: string;
  username: string;
}

export default function CollapsibleReviewForm({ profileId, username }: CollapsibleReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      {!isOpen ? (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg"
        >
          <HiStar className="w-6 h-6" />
          Leave an Anonymous Review
          <HiChevronDown className="w-5 h-5" />
        </motion.button>
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
