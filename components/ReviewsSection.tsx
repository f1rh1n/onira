"use client";

import { useState, useMemo } from "react";
import { HiStar, HiChevronDown } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";

type Review = {
  id: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  rating: number;
  comment: string;
  createdAt: Date;
};

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const sortedAndFilteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterRating !== null) {
      filtered = filtered.filter((review) => review.rating === filterRating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, sortBy, filterRating]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 : 0,
  }));

  const getSentimentColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 dark:text-green-400";
    if (rating === 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSentimentBg = (rating: number) => {
    if (rating >= 4) return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (rating === 3) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  return (
    <div className="mb-6">
      {/* Section Header with Stats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gradient-to-r from-yellow-500 to-orange-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <HiStar className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500" />
            <span>Reviews</span>
            <span className="text-base sm:text-lg font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
              {reviews.length}
            </span>
          </h2>
        </div>

        {/* Rating Overview */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl p-4 sm:p-6 mb-4 border border-yellow-200 dark:border-yellow-800/30">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating) ? "text-yellow-500 fill-current" : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex-1 w-full space-y-2">
              {ratingCounts.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                    {rating} <HiStar className="inline w-3 h-3 text-yellow-500" />
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                filterRating === null
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                  filterRating === rating
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {rating} <HiStar className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <AnimatePresence mode="popLayout">
        {sortedAndFilteredReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            No reviews match your filters.
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedAndFilteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-4 sm:p-5 shadow-md border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${getSentimentBg(review.rating)}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {review.reviewerAvatar ? (
                    <Avatar avatarId={review.reviewerAvatar} size={48} className="rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white text-lg">
                        {review.reviewerName}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <HiStar key={i} className={`w-5 h-5 ${getSentimentColor(review.rating)} fill-current`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{review.comment}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        review.rating >= 4
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : review.rating === 3
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}>
                        {review.rating >= 4 ? "Positive" : review.rating === 3 ? "Neutral" : "Negative"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
