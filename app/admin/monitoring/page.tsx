"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { HiUsers, HiDocumentText, HiStar, HiHeart, HiChatAlt, HiRefresh } from "react-icons/hi";

interface Metrics {
  timestamp: string;
  users: {
    total: number;
    last24h: number;
    lastWeek: number;
    lastMonth: number;
    growthRate: string;
    recent: Array<{
      id: string;
      email: string;
      username: string;
      createdAt: string;
      profile: { displayName: string; isPublished: boolean } | null;
    }>;
  };
  profiles: {
    total: number;
    published: number;
    unpublished: number;
    top: Array<{
      username: string;
      displayName: string;
      reviewCount: number;
      postCount: number;
    }>;
  };
  reviews: {
    total: number;
    published: number;
    pending: number;
    last24h: number;
    averageRating: number;
  };
  posts: {
    total: number;
    published: number;
    unpublished: number;
    last24h: number;
  };
  engagement: {
    totalLikes: number;
    totalComments: number;
  };
  system: {
    databaseConnection: string;
    uptime: number;
  };
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/metrics");
      if (!response.ok) throw new Error("Failed to fetch metrics");
      const data = await response.json();
      setMetrics(data);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Failed to load metrics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchMetrics}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <HiRefresh className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg transition ${
                autoRefresh
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              Auto-refresh: {autoRefresh ? "ON" : "OFF"}
            </button>
            
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 ONIRA Monitoring Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time platform metrics and analytics
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {metrics && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiUsers className="w-10 h-10 text-purple-600" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {metrics.users.growthRate}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.users.total}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  <p>Last 24h: {metrics.users.last24h}</p>
                  <p>Last week: {metrics.users.lastWeek}</p>
                  <p>Last month: {metrics.users.lastMonth}</p>
                </div>
              </div>

              {/* Profiles */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiDocumentText className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.profiles.total}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Profiles</p>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  <p>Published: {metrics.profiles.published}</p>
                  <p>Unpublished: {metrics.profiles.unpublished}</p>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiStar className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.reviews.total}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Reviews</p>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  <p>Avg Rating: {metrics.reviews.averageRating.toFixed(1)} ⭐</p>
                  <p>Last 24h: {metrics.reviews.last24h}</p>
                  <p>Pending: {metrics.reviews.pending}</p>
                </div>
              </div>

              {/* Posts */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <HiChatAlt className="w-10 h-10 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.posts.total}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Posts</p>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  <p>Published: {metrics.posts.published}</p>
                  <p>Last 24h: {metrics.posts.last24h}</p>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiHeart className="w-8 h-8 text-red-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Engagement</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Likes</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {metrics.engagement.totalLikes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Comments</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {metrics.engagement.totalComments}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Database</span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                      {metrics.system.databaseConnection}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatUptime(metrics.system.uptime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Profiles */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🏆 Top Profiles by Reviews
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Username</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Display Name</th>
                      <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">Reviews</th>
                      <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.profiles.top.map((profile, index) => (
                      <tr
                        key={profile.username}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {index + 1}. @{profile.username}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {profile.displayName}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                          {profile.reviewCount}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                          {profile.postCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                👥 Recent Users
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Username</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Email</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Profile</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.users.recent.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          @{user.username}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {user.profile ? user.profile.displayName : "Not created"}
                        </td>
                        <td className="py-3 px-4">
                          {user.profile?.isPublished ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded text-xs font-medium">
                              Unpublished
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
