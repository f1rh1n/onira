"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { predefinedAvatars, getAvatarUrl } from "@/lib/avatars";

interface ReviewFormProps {
  profileId: string;
}

export default function ReviewForm({ profileId }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    reviewerName: "",
    rating: 5,
    comment: "",
    reviewerAvatar: predefinedAvatars[0].id,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          profileId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
      setFormData({
        reviewerName: "",
        rating: 5,
        comment: "",
        reviewerAvatar: predefinedAvatars[0].id,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
      <h3 className="text-xl font-bold mb-4 text-white">Leave a Review</h3>
      <p className="text-sm text-gray-400 mb-4">
        Share your experience anonymously. Choose an avatar and any name you like!
      </p>

      {success && (
        <div className="bg-green-900/50 border border-green-700 text-green-200 p-3 rounded mb-4">
          Review submitted! The profile owner will review it before publishing.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Choose Your Avatar
          </label>
          <div className="grid grid-cols-6 gap-2">
            {predefinedAvatars.slice(0, 12).map((avatar) => (
              <motion.button
                key={avatar.id}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, reviewerAvatar: avatar.id })}
                className={`
                  relative w-full aspect-square rounded-full overflow-hidden border-2 transition
                  ${formData.reviewerAvatar === avatar.id
                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                    : 'border-gray-700 hover:border-purple-500/50'
                  }
                `}
              >
                <img
                  src={getAvatarUrl(avatar.seed, avatar.style)}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-300 mb-1">
            Your Name (can be anything!)
          </label>
          <input
            id="reviewerName"
            type="text"
            required
            maxLength={50}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={formData.reviewerName}
            onChange={(e) =>
              setFormData({ ...formData, reviewerName: e.target.value })
            }
            placeholder="e.g., Happy Customer, Alice, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            No account needed. Choose any name!
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                whileTap={{ scale: 0.9 }}
                animate={
                  star <= formData.rating
                    ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, 360],
                        transition: { duration: 0.5 }
                      }
                    : {}
                }
                className="text-3xl cursor-pointer"
              >
                <span className={star <= formData.rating ? "text-yellow-400" : "text-gray-600"}>
                  {star <= formData.rating ? "⭐" : "☆"}
                </span>
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {formData.rating === 5 && "🎉 Excellent!"}
            {formData.rating === 4 && "😊 Great!"}
            {formData.rating === 3 && "👍 Good"}
            {formData.rating === 2 && "😐 Okay"}
            {formData.rating === 1 && "😕 Poor"}
          </p>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            required
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            placeholder="Share your experience..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/500 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 disabled:opacity-50 transition"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
