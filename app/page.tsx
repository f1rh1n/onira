"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Logo from "@/components/Logo";
import { HiLink, HiChatBubbleLeftRight, HiSparkles } from "react-icons/hi2";
import SignupLoadingScreen from "@/components/SignupLoadingScreen";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but login failed. Please try logging in.");
        setLoading(false);
      } else {
        // Show loading screen before redirecting
        setShowLoadingScreen(true);
        // Wait 3 seconds to show the animation
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  // Show loading screen during successful signup
  if (showLoadingScreen) {
    return <SignupLoadingScreen />;
  }

  // Random background image
  const backgroundImages = [
    '/photos/0e958fc52e2041a181dd5f5e5db5e240.jpg',
    '/photos/2f44b645f350e5ab5b0af515eca2765c.jpg',
    '/photos/38f176db36e57fed2b2aff43b7295e25.jpg',
    '/photos/41f267491032c24bbf9c9ccec7e5a691.jpg',
    '/photos/f476c829853e16534c9b857cffd1f128.jpg',
  ];
  const randomBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: `url(${randomBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better contrast - reduced opacity */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-foreground/80 hover:text-foreground transition">
              Login
            </Link>
            <a
              href="#signup"
              className="bg-gradient-purple-pink text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section - Reduced height for better mobile experience */}
      <main className="flex items-center justify-center py-20 md:py-32 lg:py-40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading mb-4 md:mb-6 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Get Anonymous Reviews
            <br />
            For Your Business
          </h2>
          <p className="text-lg sm:text-xl font-body-bold text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Let your customers share honest feedback anonymously.
            Build trust and showcase authentic reviews on your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4 sm:px-0">
            <a
              href="#signup"
              className="w-full sm:w-auto bg-gradient-purple-pink text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-block text-center"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto glass border-2 border-white/30 text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 inline-block text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </main>

      {/* Features Section - Cleaner with icons instead of emoji */}
      <section id="features" className="section-padding bg-black/20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-heading text-center mb-8 md:mb-12 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">How It Works</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            <div className="card-padding card-shadow-lg bg-white/95 dark:bg-gray-900/95 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <HiLink className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Share Your Link</h4>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Get your unique review link and share it with customers.
                Perfect for businesses, services, and professionals.
              </p>
            </div>
            <div className="card-padding card-shadow-lg bg-white/95 dark:bg-gray-900/95 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <HiChatBubbleLeftRight className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Collect Anonymous Feedback</h4>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Customers leave honest reviews without creating accounts.
                They choose any name they want - completely anonymous.
              </p>
            </div>
            <div className="card-padding card-shadow-lg bg-white/95 dark:bg-gray-900/95 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <HiSparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Publish & Share</h4>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Display reviews on your public page and share the best ones
                directly to your Instagram stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section id="signup" className="section-padding bg-black/30">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl card-shadow-lg card-padding">
            <h3 className="text-2xl sm:text-3xl font-heading text-center mb-2 text-foreground">
              Create Your Account
            </h3>
            <p className="text-center text-foreground/60 mb-6">
              Start receiving anonymous reviews today
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-foreground/20 bg-white dark:bg-gray-800 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-foreground/20 bg-white dark:bg-gray-800 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  required
                  disabled={loading}
                  minLength={3}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-foreground/20 bg-white dark:bg-gray-800 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-foreground/20 bg-white dark:bg-gray-800 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-purple-pink text-white py-3 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="text-center text-sm text-foreground/60 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-nav border-t border-foreground/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-white/40 mb-2">
            reach us at ceo@onira.sbs
          </p>
          <p className="text-xs text-white/50 font-semibold tracking-wide">
            made with claude & way too much coffee ☕✨
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
