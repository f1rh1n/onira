"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { predefinedAvatars, getAvatarUrl } from "@/lib/avatars";
import Avatar from "./Avatar";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  commenterName: string;
  commenterAvatar: string | null;
  comment: string;
  anonymousId: string;
  createdAt: string;
}

interface PostCommentsProps {
  postId: string;
  profileUserId?: string; // To check if current user can delete
}

export default function PostComments({ postId, profileUserId }: PostCommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    commenterName: "",
    commenterAvatar: predefinedAvatars[0].id,
    comment: "",
  });

  // Fetch comments - wrapped in useCallback
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [postId]);

  // Get or create anonymous ID - SSR safe
  useEffect(() => {
    setMounted(true);

    // Only access localStorage in browser
    if (typeof window === 'undefined') return;

    let id = localStorage.getItem("anonymousId");
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("anonymousId", id);
    }
    setAnonymousId(id);
    fetchComments();
  }, [postId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !anonymousId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          anonymousId,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setFormData({
          commenterName: "",
          commenterAvatar: predefinedAvatars[0].id,
          comment: "",
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments?commentId=${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const canDeleteComments = session?.user && profileUserId;

  return (
    <div className="space-y-4">
      {/* Comment Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition text-sm min-h-[44px] min-w-[44px] -m-2 p-2"
      >
        <span className="text-xl">💬</span>
        <span>{comments.length > 0 ? comments.length : ""}</span>
      </button>

      {/* Comment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose Avatar
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {predefinedAvatars.slice(0, 8).map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData({ ...formData, commenterAvatar: avatar.id })}
                      className={`
                        relative w-full aspect-square rounded-full overflow-hidden border-2 transition
                        ${formData.commenterAvatar === avatar.id
                          ? 'border-purple-500 ring-2 ring-purple-500/30'
                          : 'border-gray-300 dark:border-gray-600 hover:border-purple-500/50'
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

              {/* Name Input */}
              <input
                type="text"
                required
                maxLength={50}
                placeholder="Your name (can be anything!)"
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.commenterName}
                onChange={(e) => setFormData({ ...formData, commenterName: e.target.value })}
              />

              {/* Comment Input */}
              <textarea
                required
                maxLength={500}
                rows={3}
                placeholder="Write your comment..."
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
              <p className="text-xs text-gray-500">{formData.comment.length}/500</p>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-purple-500 disabled:opacity-50 transition text-sm font-medium min-h-[44px]"
                >
                  {loading ? "Posting..." : "Post Comment"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-medium min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3 mt-4">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.commenterAvatar ? (
                  <Avatar avatarId={comment.commenterAvatar} size={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {comment.commenterName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {comment.commenterName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {canDeleteComments && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-500 hover:text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {comment.comment}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
