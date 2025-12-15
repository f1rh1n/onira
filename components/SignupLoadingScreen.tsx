"use client";

import { motion } from "framer-motion";

export default function SignupLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 0L11.545 6.91L18 8.5L11.545 10.09L10 17L8.455 10.09L2 8.5L8.455 6.91L10 0Z"
                fill="rgba(255, 255, 255, 0.8)"
              />
            </svg>
          </motion.div>
        ))}

        {/* Confetti-like elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            className="absolute w-2 h-6 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              background: `linear-gradient(${Math.random() * 360}deg, #667eea, #764ba2, #f093fb)`,
            }}
            animate={{
              y: ["0vh", "110vh"],
              rotate: [0, 360],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Success Circle with Checkmark */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Outer rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-400/30"
              style={{ width: 140, height: 140, left: -10, top: -10 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

            {/* Main circle */}
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.4)",
                  "0 0 40px rgba(34, 197, 94, 0.6)",
                  "0 0 20px rgba(34, 197, 94, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <motion.svg
                className="w-20 h-20 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Text Content with Staggered Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Account Created! 🎉
          </motion.h2>

          <motion.p
            className="text-purple-200 text-lg mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Welcome to the Onira family!
          </motion.p>

          <motion.p
            className="text-purple-300 text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            We've sent a welcome email to your inbox 📧
          </motion.p>
        </motion.div>

        {/* Loading Progress */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-center space-x-2 text-purple-200 text-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.div>
            <span>Setting up your account...</span>
          </div>

          {/* Progress Bar */}
          <motion.div
            className="w-72 h-2 bg-white/10 rounded-full overflow-hidden mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[
            { icon: "🎯", text: "Profile Created" },
            { icon: "📱", text: "QR Code Ready" },
            { icon: "⭐", text: "Ready for Reviews" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.3 + i * 0.1, type: "spring" }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-purple-200">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
