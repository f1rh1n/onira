"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PostLikeButtonProps {
  postId: string;
}

export default function PostLikeButton({ postId }: PostLikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>("");

  // Get or create anonymous ID
  useEffect(() => {
    let id = localStorage.getItem("anonymousId");
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("anonymousId", id);
    }
    setAnonymousId(id);
    fetchLikeStatus(id);
  }, [postId]);

  const fetchLikeStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like?anonymousId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setLiked(data.hasLiked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const handleLike = async () => {
    if (loading || !anonymousId) return;

    setLoading(true);
    const previousLiked = liked;
    const previousCount = likeCount;

    // Optimistic update
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonymousId }),
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      } else {
        // Revert on error
        setLiked(previousLiked);
        setLikeCount(previousCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-1.5 hover:text-purple-500 transition group"
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        className="text-xl group-hover:scale-110 transition"
        animate={liked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {liked ? "💜" : "🤍"}
      </motion.span>
      <span className="text-sm">{likeCount > 0 ? likeCount : ""}</span>
    </motion.button>
  );
}
