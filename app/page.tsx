"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Logo from "@/components/Logo";
import AnimatedBackground from "@/components/AnimatedBackground";
import { HiLink, HiChatBubbleLeftRight, HiSparkles, HiEye, HiEyeSlash } from "react-icons/hi2";
import SimpleLoadingScreen from "@/components/SimpleLoadingScreen";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({ score: 0, label: "", color: "" });

  // Email validation with real-time feedback
  const validateEmail = (email: string): string | undefined => {
    if (!email) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  // Username validation
  const validateUsername = (username: string): string | undefined => {
    if (!username) return undefined;
    if (username.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return undefined;
  };

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    // Calculate score
    if (checks.length) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    // Determine label and color
    let label = "";
    let color = "";
    if (score <= 20) {
      label = "Very Weak";
      color = "bg-red-500";
    } else if (score <= 40) {
      label = "Weak";
      color = "bg-orange-500";
    } else if (score <= 60) {
      label = "Fair";
      color = "bg-yellow-500";
    } else if (score <= 80) {
      label = "Good";
      color = "bg-blue-500";
    } else {
      label = "Strong";
      color = "bg-green-500";
    }

    setPasswordStrength({ score, label, color });
  };

  // Password validation
  const validatePassword = (password: string): string | undefined => {
    if (!password) return undefined;
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return undefined;
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword) return undefined;
    if (confirmPassword !== formData.password) {
      return "Passwords do not match";
    }
    return undefined;
  };

  // Handle field blur for real-time validation
  const handleBlur = (field: string) => {
    let error: string | undefined;
    switch (field) {
      case "email":
        error = validateEmail(formData.email);
        break;
      case "username":
        error = validateUsername(formData.username);
        break;
      case "password":
        error = validatePassword(formData.password);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.confirmPassword);
        break;
    }
    setFieldErrors({ ...fieldErrors, [field]: error });
  };

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const errors = {
      email: validateEmail(formData.email),
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== undefined)) {
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
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Show loading screen during successful signup
  if (showLoadingScreen) {
    return <SimpleLoadingScreen message="Creating your account" />;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>

      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>

      {/* Animated particles */}
      <AnimatedBackground />

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with improved accessibility */}
        <header className="glass-nav sticky top-0 z-50" role="banner">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center" aria-label="Main navigation">
            <Link
              href="/"
              className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
              aria-label="Onira - Home"
            >
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-white/90 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg px-3 py-2"
              >
                Login
              </Link>
              <button
                onClick={() => scrollToSection("signup")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-95"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </header>

        {/* Hero Section with improved typography and spacing */}
        <main className="flex items-center justify-center py-24 md:py-32 lg:py-40 px-4">
          <div className="container mx-auto text-center max-w-5xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 text-white leading-tight tracking-tight">
              Get Anonymous Reviews
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                For Your Business
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Let your customers share honest feedback anonymously.
              <br className="hidden sm:block" />
              Build trust and showcase authentic reviews on your profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <button
                onClick={() => scrollToSection("signup")}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 active:scale-95"
              >
                Get Started Free
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 active:scale-95"
              >
                Learn More
              </button>
            </div>
          </div>
        </main>

        {/* Features Section with improved spacing and visual hierarchy */}
        <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-transparent to-black/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-6 text-white">
              How It Works
            </h2>
            <p className="text-xl text-white/80 text-center mb-16 max-w-2xl mx-auto">
              Three simple steps to start collecting authentic reviews
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HiLink className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Share Your Link
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get your unique review link and share it with customers.
                  Perfect for businesses, services, and professionals.
                </p>
              </div>
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HiChatBubbleLeftRight className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Collect Anonymous Feedback
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  Customers leave honest reviews without creating accounts.
                  They choose any name they want - completely anonymous.
                </p>
              </div>
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HiSparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Publish & Share
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  Display reviews on your public page and share the best ones
                  directly to your Instagram stories.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sign Up Section with enhanced form validation */}
        <section id="signup" className="py-24 md:py-32 bg-gradient-to-b from-black/30 to-black/50">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-10">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900 dark:text-white">
                Create Your Account
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Start receiving anonymous reviews today
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6" role="alert">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) {
                        setFieldErrors({ ...fieldErrors, email: undefined });
                      }
                    }}
                    onBlur={() => handleBlur("email")}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      fieldErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all`}
                    required
                    disabled={loading}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      if (fieldErrors.username) {
                        setFieldErrors({ ...fieldErrors, username: undefined });
                      }
                    }}
                    onBlur={() => handleBlur("username")}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      fieldErrors.username
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all`}
                    required
                    disabled={loading}
                    minLength={3}
                    aria-invalid={!!fieldErrors.username}
                    aria-describedby={fieldErrors.username ? "username-error" : undefined}
                  />
                  {fieldErrors.username && (
                    <p id="username-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        calculatePasswordStrength(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors({ ...fieldErrors, password: undefined });
                        }
                      }}
                      onBlur={() => handleBlur("password")}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                        fieldErrors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all`}
                      required
                      disabled={loading}
                      minLength={6}
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby={fieldErrors.password ? "password-error" : passwordStrength.label ? "password-strength" : undefined}
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
                  {passwordStrength.label && (
                    <div id="password-strength" className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {fieldErrors.password && (
                    <p id="password-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (fieldErrors.confirmPassword) {
                          setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
                        }
                      }}
                      onBlur={() => handleBlur("confirmPassword")}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                        fieldErrors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all`}
                      required
                      disabled={loading}
                      minLength={6}
                      aria-invalid={!!fieldErrors.confirmPassword}
                      aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p id="confirm-password-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Footer with improved accessibility */}
        <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-10" role="contentinfo">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-white/60 mb-3">
              Need help? Reach us at{" "}
              <a
                href="mailto:ceo@onira.sbs"
                className="text-white/80 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              >
                ceo@onira.sbs
              </a>
            </p>
            <p className="text-sm text-white/70 font-semibold tracking-wide">
              made with claude & way too much coffee ☕✨
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
