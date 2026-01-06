"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  FiTrendingUp,
  FiStar,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiCamera,
  FiCopy,
  FiCheck,
  FiArrowUp,
  FiArrowDown,
  FiEdit,
  FiEye,
  FiChevronRight,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import AnimatedBackground from "@/components/AnimatedBackground";

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
  const [copied, setCopied] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const copyProfileLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/${(session?.user as any)?.username}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
        <AnimatedBackground />
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="transition-transform hover:scale-105">
                <Logo />
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-4">
                {profile?.avatar && (
                  <Avatar avatarId={profile.avatar} size={40} className="ring-2 ring-purple-500/50" />
                )}
                <span className="hidden sm:block text-white text-sm font-medium">
                  {(session?.user as any)?.username}
                </span>

                <button
                  onClick={() => router.push("/profile/edit")}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                  title="Settings"
                >
                  <FiSettings size={20} />
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-lg transition"
                  title="Sign Out"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8">
          {!profile ? (
            /* Welcome New User */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HiSparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-white">Welcome to Onira!</h2>
                <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                  Create your professional portfolio and start receiving anonymous reviews from your audience.
                </p>
                <Link
                  href="/profile/setup"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 font-semibold text-lg"
                >
                  <FiTrendingUp /> Create Your Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    Welcome back, {profile.displayName}!
                  </h1>
                  <p className="text-white/70 text-lg">
                    Here&apos;s what&apos;s happening with your profile today
                  </p>
                </div>
                <Link
                  href={`/${(session?.user as any)?.username}`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition font-semibold"
                >
                  <FiEye /> View Public Profile
                </Link>
              </div>

              {/* Stats Grid with Enhanced Design */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Reviews Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <FiMessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                      <FiArrowUp className="w-4 h-4" />
                      <span>12%</span>
                    </div>
                  </div>
                  <h3 className="text-white/60 text-sm font-medium mb-1">Total Reviews</h3>
                  <p className="text-4xl font-bold text-white">{profile._count?.reviews || 0}</p>
                  <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>

                {/* Average Rating Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                      <FiStar className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                      <FiArrowUp className="w-4 h-4" />
                      <span>5%</span>
                    </div>
                  </div>
                  <h3 className="text-white/60 text-sm font-medium mb-1">Average Rating</h3>
                  <p className="text-4xl font-bold text-white">
                    4.8<span className="text-2xl text-white/60">/5</span>
                  </p>
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`} />
                    ))}
                  </div>
                </div>

                {/* Total Posts Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition group sm:col-span-2 lg:col-span-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <FiTrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex items-center gap-1 text-red-400 text-sm font-semibold">
                      <FiArrowDown className="w-4 h-4" />
                      <span>2%</span>
                    </div>
                  </div>
                  <h3 className="text-white/60 text-sm font-medium mb-1">Total Posts</h3>
                  <p className="text-4xl font-bold text-white">{profile._count?.posts || 0}</p>
                  <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <HiSparkles className="w-6 h-6 text-purple-400" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/dashboard/reviews"
                    className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition">
                        <FiMessageSquare className="w-6 h-6 text-blue-400" />
                      </div>
                      <FiChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Manage Reviews</h3>
                    <p className="text-white/60 text-sm">View and respond to customer feedback</p>
                  </Link>

                  <Link
                    href="/dashboard/posts"
                    className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition">
                        <FiTrendingUp className="w-6 h-6 text-purple-400" />
                      </div>
                      <FiChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Create New Post</h3>
                    <p className="text-white/60 text-sm">Share your latest work and updates</p>
                  </Link>

                  <Link
                    href="/dashboard/qr-studio"
                    className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition">
                        <FiCamera className="w-6 h-6 text-pink-400" />
                      </div>
                      <FiChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">QR Code Studio</h3>
                    <p className="text-white/60 text-sm">Generate QR codes for easy sharing</p>
                  </Link>

                  <button
                    onClick={copyProfileLink}
                    className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:border-purple-500/50 transition-all hover:scale-[1.02] text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition">
                        {copied ? (
                          <FiCheck className="w-6 h-6 text-green-400" />
                        ) : (
                          <FiCopy className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <FiChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {copied ? "Link Copied!" : "Share Profile Link"}
                    </h3>
                    <p className="text-white/60 text-sm">Copy your profile URL to clipboard</p>
                  </button>
                </div>
              </div>

              {/* Profile Status */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${profile.isPublished ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`}></div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Profile Status</h3>
                      <p className="text-white/80">
                        {profile.isPublished ? (
                          <>
                            Your profile is <span className="text-green-400 font-semibold">live and visible</span> to everyone
                          </>
                        ) : (
                          <>
                            Your profile is currently <span className="text-yellow-400 font-semibold">in draft mode</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition font-semibold whitespace-nowrap"
                  >
                    <FiEdit /> Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
