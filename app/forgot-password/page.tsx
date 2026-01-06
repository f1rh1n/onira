"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthPageWrapper from "@/components/AuthPageWrapper";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      // Store OTP if returned (development mode only)
      if (data.otp) {
        setDevOtp(data.otp);
      }

      setSuccess(true);
      // Redirect to OTP verification page after 3 seconds
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="mb-6">
            <Link href="/" className="inline-block mb-4 transition-transform hover:scale-105">
              <Logo size="text-4xl" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Forgot Password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email and we&apos;ll send you a code to reset your password
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-4">
                <p className="text-green-700 dark:text-green-300 text-center font-medium">
                  Reset code sent! Check your email.
                  <br />
                  Redirecting to verification page...
                </p>
              </div>

              {devOtp && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-4">
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm text-center">
                    <strong>Development Mode:</strong>
                    <br />
                    Your OTP code: <code className="font-mono text-lg">{devOtp}</code>
                  </p>
                </div>
              )}

              <Link
                href="/login"
                className="block text-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition font-semibold hover:underline"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl" role="alert">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition font-semibold hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthPageWrapper>
  );
}
