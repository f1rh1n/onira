"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";
import AnimatedBackground from "@/components/AnimatedBackground";
import InstagramShareButton from "@/components/InstagramShareButton";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiClock,
  FiCheck,
  FiX,
  FiMoreVertical,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiShare2,
  FiChevronDown,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isPublished: boolean;
  createdAt: string;
}

interface Profile {
  avatar?: string;
}

export default function ReviewsDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchReviews();
      fetchProfile();
    }
  }, [status]);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews/my-reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profiles/my-profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const togglePublish = async (reviewId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });

      if (response.ok) {
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? { ...review, isPublished: !currentStatus }
            : review
        ));
        showToast(
          currentStatus ? "Review unpublished successfully" : "Review published successfully",
          "success"
        );
        setActiveDropdown(null);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      showToast("Failed to update review", "error");
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId));
        setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
        showToast("Review deleted successfully", "success");
        setActiveDropdown(null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast("Failed to delete review", "error");
    }
  };

  const handleBulkPublish = async () => {
    try {
      await Promise.all(
        selectedReviews.map(id => {
          const review = reviews.find(r => r.id === id);
          if (review && !review.isPublished) {
            return togglePublish(id, false);
          }
        })
      );
      setSelectedReviews([]);
      showToast(`${selectedReviews.length} reviews published`, "success");
    } catch (error) {
      showToast("Failed to publish reviews", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedReviews.length} reviews?`)) {
      return;
    }
    try {
      await Promise.all(selectedReviews.map(id => deleteReview(id)));
      setSelectedReviews([]);
    } catch (error) {
      showToast("Failed to delete reviews", "error");
    }
  };

  const toggleSelectAll = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map(r => r.id));
    }
  };

  const filteredReviews = reviews.filter(review => {
    // Filter by status
    if (filter === "published" && !review.isPublished) return false;
    if (filter === "pending" && review.isPublished) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        review.reviewerName.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const pendingCount = reviews.filter(r => !r.isPublished).length;
  const publishedCount = reviews.filter(r => r.isPublished).length;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
        <AnimatedBackground />
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading reviews...</p>
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border ${
            toast.type === "success"
              ? "bg-green-500/90 border-green-400 text-white"
              : "bg-red-500/90 border-red-400 text-white"
          }`}>
            {toast.type === "success" ? (
              <FiCheckCircle className="w-5 h-5" />
            ) : (
              <FiAlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="transition-transform hover:scale-105">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              {profile?.avatar && (
                <Avatar avatarId={profile.avatar} size={40} className="ring-2 ring-purple-500/50" />
              )}

              <Link href="/dashboard" className="text-white/70 hover:text-white transition font-medium">
                ← Back to Dashboard
              </Link>
            </div>
          </nav>
        </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Manage Reviews</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FiStar className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Total Reviews</h3>
            <p className="text-4xl font-bold text-white">{reviews.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <FiCheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Published</h3>
            <p className="text-4xl font-bold text-white">{publishedCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <FiClock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Pending</h3>
            <p className="text-4xl font-bold text-white">{pendingCount}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reviews by name or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                filter === "all"
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              All ({reviews.length})
              {filter === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              )}
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                filter === "pending"
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                Pending
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-bold animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </span>
              {filter === "pending" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              )}
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                filter === "published"
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Published ({publishedCount})
              {filter === "published" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedReviews.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md border border-purple-500/50 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">
                {selectedReviews.length} review{selectedReviews.length > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkPublish}
                className="px-4 py-2 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition flex items-center gap-2"
              >
                <FiEye className="w-4 h-4" />
                Publish All
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => setSelectedReviews([])}
                className="px-4 py-2 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Select All Checkbox */}
        {filteredReviews.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedReviews.length === filteredReviews.length}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded border-2 border-white/30 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 bg-white/5 transition-all cursor-pointer"
              />
              <span className="text-white/80 font-medium group-hover:text-white transition">
                Select All ({filteredReviews.length})
              </span>
            </label>
          </div>
        )}

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12 text-center">
            <FiStar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-2">No reviews found</p>
            {searchQuery && (
              <p className="text-white/40 text-sm">Try adjusting your search query</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => {
              const isExpanded = expandedReview === review.id;
              const isSelected = selectedReviews.includes(review.id);
              const isDropdownOpen = activeDropdown === review.id;

              return (
                <div
                  key={review.id}
                  className={`bg-white/10 backdrop-blur-md rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "border-purple-500 bg-white/15"
                      : "border-white/20 hover:border-white/30 hover:bg-white/15"
                  } ${
                    review.isPublished ? "border-l-4 border-l-green-500" : "border-l-4 border-l-yellow-500"
                  } overflow-hidden`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedReviews(
                            isSelected
                              ? selectedReviews.filter(id => id !== review.id)
                              : [...selectedReviews, review.id]
                          );
                        }}
                        className="mt-1 w-5 h-5 rounded border-2 border-white/30 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 bg-white/5 transition-all cursor-pointer"
                      />

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-xl text-white">{review.reviewerName}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                review.isPublished
                                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 animate-pulse"
                              }`}
                            >
                              {review.isPublished ? (
                                <><FiCheckCircle className="w-3 h-3" /> Published</>
                              ) : (
                                <><FiClock className="w-3 h-3" /> Pending</>
                              )}
                            </span>
                          </div>

                          {/* Dropdown Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveDropdown(isDropdownOpen ? null : review.id)}
                              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                            >
                              <FiMoreVertical className="w-5 h-5" />
                            </button>

                            {isDropdownOpen && (
                              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl z-10 overflow-hidden">
                                <button
                                  onClick={() => togglePublish(review.id, review.isPublished)}
                                  className="w-full px-4 py-3 text-left hover:bg-purple-100 transition flex items-center gap-2 text-gray-700 font-medium"
                                >
                                  {review.isPublished ? (
                                    <><FiEyeOff className="w-4 h-4" /> Unpublish</>
                                  ) : (
                                    <><FiEye className="w-4 h-4" /> Publish</>
                                  )}
                                </button>
                                {review.isPublished && (
                                  <div className="border-t border-gray-200">
                                    <InstagramShareButton reviewId={review.id} variant="dropdown" />
                                  </div>
                                )}
                                <button
                                  onClick={() => deleteReview(review.id)}
                                  className="w-full px-4 py-3 text-left hover:bg-red-100 transition flex items-center gap-2 text-red-600 font-medium border-t border-gray-200"
                                >
                                  <FiTrash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-white/20"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-white/60 text-sm font-medium">
                            {review.rating}.0 / 5.0
                          </span>
                        </div>

                        {/* Comment Preview/Full */}
                        <div className="mb-3">
                          {isExpanded ? (
                            <p className="text-white/90 leading-relaxed">{review.comment}</p>
                          ) : (
                            <p className="text-white/90 leading-relaxed line-clamp-2">
                              {review.comment}
                            </p>
                          )}
                        </div>

                        {/* Expand/Collapse Button */}
                        {review.comment.length > 150 && (
                          <button
                            onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                            className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-1"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                            <FiChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        )}

                        {/* Date */}
                        <p className="text-sm text-white/40 mt-3">
                          {new Date(review.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <button
                        onClick={() => togglePublish(review.id, review.isPublished)}
                        className={`w-full px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
                          review.isPublished
                            ? "bg-white/10 text-white border-2 border-white/30 hover:bg-white/20"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl"
                        }`}
                      >
                        {review.isPublished ? (
                          <><FiEyeOff className="w-5 h-5" /> Unpublish Review</>
                        ) : (
                          <><FiEye className="w-5 h-5" /> Publish Review</>
                        )}
                      </button>

                      {/* Instagram Share Button - Only for Published Reviews */}
                      {review.isPublished && (
                        <div className="w-full">
                          <InstagramShareButton reviewId={review.id} variant="full" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
