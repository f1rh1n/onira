"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/app/components/ThemeToggle";
import Avatar from "@/components/Avatar";

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
        // Update local state
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? { ...review, isPublished: !currentStatus }
            : review
        ));
      }
    } catch (error) {
      console.error("Error updating review:", error);
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
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const shareToInstagram = (review: Review) => {
    // Create a shareable text
    const shareText = `${review.reviewerName} said:\n\n"${review.comment}"\n\n${"⭐".repeat(review.rating)}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareText);
    alert("Review text copied to clipboard! You can now paste it into your Instagram story.");

    // Note: Direct Instagram sharing requires the Instagram API and is limited.
    // For now, we'll provide the text for manual sharing.
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === "published") return review.isPublished;
    if (filter === "pending") return !review.isPublished;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.isPublished).length;
  const publishedCount = reviews.filter(r => r.isPublished).length;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="text-lg text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <Image src="/logo.png" alt="Onira" width={50} height={50} />
          </Link>
          <div className="flex items-center gap-4">
            {profile?.avatar && (
              <Avatar avatarId={profile.avatar} size={40} className="ring-2 ring-purple-500/20" />
            )}
            <ThemeToggle />
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              ← Back to Dashboard
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Manage Reviews</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-gray-600 dark:text-gray-500 text-sm font-medium">Total Reviews</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {reviews.length}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-gray-600 dark:text-gray-500 text-sm font-medium">Published</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {publishedCount}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-gray-600 dark:text-gray-500 text-sm font-medium">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 font-medium ${
                  filter === "all"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                All ({reviews.length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-6 py-3 font-medium ${
                  filter === "pending"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter("published")}
                className={`px-6 py-3 font-medium ${
                  filter === "published"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Published ({publishedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No reviews found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{review.reviewerName}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          review.isPublished
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {review.isPublished ? "Published" : "Pending"}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? "text-yellow-400" : "text-gray-400 dark:text-gray-600"}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-600">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => togglePublish(review.id, review.isPublished)}
                    className={`px-4 py-2 rounded ${
                      review.isPublished
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {review.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  {review.isPublished && (
                    <button
                      onClick={() => shareToInstagram(review)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600"
                    >
                      Share to Instagram
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
