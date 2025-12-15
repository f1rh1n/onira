"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";

export default function LoadingDemoPage() {
  const [showLoading, setShowLoading] = useState(false);

  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Loading Animation Demo
        </h1>
        <p className="text-gray-300 mb-8">
          Click the button below to see the animated loading screen
        </p>

        <button
          onClick={() => setShowLoading(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition mb-4"
        >
          Show Loading Animation
        </button>

        <Link
          href="/"
          className="block text-purple-300 hover:text-purple-200 text-sm transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
