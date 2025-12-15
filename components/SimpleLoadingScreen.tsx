"use client";

export default function SimpleLoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
        <p className="text-purple-200">Please wait...</p>
      </div>
    </div>
  );
}
