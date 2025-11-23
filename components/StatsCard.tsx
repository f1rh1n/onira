"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import AnimatedCounter from "./AnimatedCounter";

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  suffix = "",
  prefix = "",
  delay = 0
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <div className="text-purple-400 text-2xl">{icon}</div>
        </div>
        {trend !== undefined && (
          <div className={`text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </p>
    </motion.div>
  );
}
