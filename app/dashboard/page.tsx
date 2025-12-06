"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiTrendingUp, FiStar, FiMessageSquare, FiSettings, FiLogOut, FiCamera } from "react-icons/fi";
import StatsCard from "@/components/StatsCard";
import ThemeToggle from "@/app/components/ThemeToggle";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";

interface Profile {
  id: string;
  displayName: string;
  bio?: string;
  businessName?: string;
  avatar?: string;
  isPublished: boolean;
  _count: {
    reviews: number;
    posts: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profiles/my-profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-gray-600 dark:text-gray-400"
        >
          Loading...
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm"
      >
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo />
          </Link>
          <div className="flex items-center space-x-4">
            {profile?.avatar && (
              <Avatar avatarId={profile.avatar} size={40} className="ring-2 ring-purple-500/20" />
            )}
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{(session?.user as any)?.username}</span>
            <ThemeToggle />
            <button
              onClick={() => router.push("/profile/edit")}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              title="Settings"
            >
              <FiSettings size={20} />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
              title="Sign Out"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        {!profile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Onira!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Create your professional portfolio and start receiving anonymous reviews from your audience.
            </p>
            <Link
              href="/profile/setup"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-500 transition inline-flex items-center gap-2 font-medium"
            >
              <FiTrendingUp /> Create Your Profile
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {profile.displayName}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Here&apos;s what&apos;s happening with your profile today
                </p>
              </div>
              <Link
                href={`/${(session?.user as any)?.username}`}
                target="_blank"
                className="w-full sm:w-auto text-center bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-lg hover:border-purple-500/50 transition font-medium"
              >
                View Public Profile
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <StatsCard
                title="Total Reviews"
                value={profile._count?.reviews || 0}
                icon={<FiMessageSquare />}
                trend={12}
                delay={0.1}
              />
              <StatsCard
                title="Average Rating"
                value={4.8}
                icon={<FiStar />}
                suffix="/5"
                delay={0.2}
              />
              <StatsCard
                title="Total Posts"
                value={profile._count?.posts || 0}
                icon={<FiTrendingUp />}
                trend={-2}
                delay={0.3}
              />
            </div>

            {/* Quick Actions Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/reviews"
                    className="block p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-purple-500/50 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <FiMessageSquare className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                          Manage Reviews
                        </span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">→</span>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/posts"
                    className="block p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-purple-500/50 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <FiTrendingUp className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                          Create New Post
                        </span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">→</span>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/qr-studio"
                    className="block p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-purple-500/50 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <FiCamera className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                          QR Code Studio
                        </span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">→</span>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const url = `${window.location.origin}/${(session?.user as any)?.username}`;
                        navigator.clipboard.writeText(url);
                        alert("Profile link copied!");
                      }
                    }}
                    className="w-full p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-purple-500/50 transition group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <FiStar className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                          Share Profile Link
                        </span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">→</span>
                    </div>
                  </button>
                </div>
            </motion.div>

            {/* Profile Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Profile Status</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {profile.isPublished ? (
                      <>Your profile is <span className="text-green-600 dark:text-green-400 font-medium">live and visible</span> to everyone</>
                    ) : (
                      <>Your profile is currently <span className="text-yellow-600 dark:text-yellow-400 font-medium">in draft mode</span></>
                    )}
                  </p>
                </div>
                <Link
                  href="/profile/edit"
                  className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition border border-gray-300 dark:border-white/10"
                >
                  Edit Profile
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
