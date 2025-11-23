"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface Profile {
  id: string;
  displayName: string;
  bio?: string;
  businessName?: string;
  isPublished: boolean;
  _count: {
    reviews: number;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Onira" width={50} height={50} />
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              {(session?.user as any)?.username}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-400 hover:text-white transition"
            >
              Sign out
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>

        {!profile ? (
          <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">Welcome to Onira!</h2>
            <p className="text-gray-400 mb-6">
              You haven&apos;t set up your portfolio yet. Get started by creating your profile.
            </p>
            <Link
              href="/profile/setup"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition inline-block"
            >
              Create Your Profile
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Profile Status Card */}
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{profile.displayName}</h2>
                  {profile.businessName && (
                    <p className="text-gray-400">{profile.businessName}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Status: {profile.isPublished ? (
                      <span className="text-green-400">Published</span>
                    ) : (
                      <span className="text-yellow-400">Draft</span>
                    )}
                  </p>
                </div>
                <Link
                  href="/profile/edit"
                  className="bg-[#0a0a0a] text-gray-300 px-4 py-2 rounded border border-gray-700 hover:bg-gray-800 transition"
                >
                  Edit Profile
                </Link>
              </div>
              {profile.bio && (
                <p className="text-gray-300 mb-4">{profile.bio}</p>
              )}
              <div className="flex space-x-4">
                <Link
                  href={`/${(session?.user as any)?.username}`}
                  className="text-purple-400 hover:text-purple-300 transition"
                  target="_blank"
                >
                  View Public Profile →
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
                <h3 className="text-gray-400 text-sm font-medium">Total Reviews</h3>
                <p className="text-3xl font-bold text-purple-400 mt-2">
                  {profile._count?.reviews || 0}
                </p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
                <h3 className="text-gray-400 text-sm font-medium">Profile Views</h3>
                <p className="text-3xl font-bold text-purple-400 mt-2">-</p>
                <p className="text-xs text-gray-600 mt-1">Coming soon</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
                <h3 className="text-gray-400 text-sm font-medium">Published Reviews</h3>
                <p className="text-3xl font-bold text-purple-400 mt-2">-</p>
                <p className="text-xs text-gray-600 mt-1">Coming soon</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/reviews"
                  className="border-2 border-purple-500 text-purple-400 px-6 py-3 rounded-lg hover:bg-purple-900/30 transition text-center"
                >
                  Manage Reviews
                </Link>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/${(session?.user as any)?.username}`;
                    navigator.clipboard.writeText(url);
                    alert("Profile link copied to clipboard!");
                  }}
                  className="border border-gray-700 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Copy Profile Link
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
