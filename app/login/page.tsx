"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import AnimatedBackground from "@/components/AnimatedBackground";
import SimpleLoadingScreen from "@/components/SimpleLoadingScreen";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        // Show loading screen before redirecting
        setShowLoadingScreen(true);
        // Wait 2 seconds to show the animation
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Show loading screen during successful login
  if (showLoadingScreen) {
    return <SimpleLoadingScreen message="Signing you in" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>

      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>

      {/* Animated particles */}
      <AnimatedBackground />

      <div className="max-w-md w-full space-y-8 p-8 md:p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl m-4 relative z-10">
        <div>
          <Link href="/" className="inline-block mb-4 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg">
            <Logo size="text-4xl" />
          </Link>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your credentials.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl" role="alert">
              <p className="font-medium">{error}</p>
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
