"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import AvatarPicker from "@/components/AvatarPicker";
import Avatar from "@/components/Avatar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { predefinedAvatars } from "@/lib/avatars";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    displayName: "",
    businessName: "",
    bio: "",
    profileType: "business",
    location: "",
    phone: "",
    website: "",
    instagram: "",
    avatar: predefinedAvatars[0].id,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
        <AnimatedBackground />
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
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
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="transition-transform hover:scale-105">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              {formData.avatar && (
                <Avatar avatarId={formData.avatar} size={40} className="ring-2 ring-purple-500/50" />
              )}

              <Link href="/dashboard" className="text-white/70 hover:text-white transition font-medium">
                ← Back to Dashboard
              </Link>
            </div>
          </nav>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Set Up Your Profile</h1>
            <p className="text-white/70 text-lg mb-8">
              Tell us about your business or personal brand
            </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl" role="alert">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <AvatarPicker
              selectedAvatar={formData.avatar}
              onSelect={(avatarId) => setFormData({ ...formData, avatar: avatarId })}
            />

            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-white mb-2">
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                required
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Your name or brand name"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-semibold text-white mb-2">
                Business Name
              </label>
              <input
                id="businessName"
                type="text"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="e.g., Sweet Dreams Bakery"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-white mb-2">
                Bio / Description
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell people about what you do..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-white mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-white mb-2">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-semibold text-white mb-2">
                  Instagram Handle
                </label>
                <input
                  id="instagram"
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  placeholder="@yourusername"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3.5 rounded-xl text-lg font-semibold hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
              >
                {loading ? "Creating..." : "Create Profile"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3.5 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
