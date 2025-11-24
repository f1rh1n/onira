"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface PostLikeButtonProps {
  postId: string;
}

export default function PostLikeButton({ postId }: PostLikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Fetch like status - wrapped in useCallback
  const fetchLikeStatus = useCallback(async (id: string) => {
    if (!id) return;
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
    fetchLikeStatus(id);
  }, [postId, fetchLikeStatus]);

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
      className="flex items-center gap-1.5 hover:text-purple-500 transition group min-h-[44px] min-w-[44px] -m-2 p-2"
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
