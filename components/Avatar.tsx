"use client";

import { predefinedAvatars, getAvatarUrl } from "@/lib/avatars";
import { useState } from "react";

interface AvatarProps {
  avatarId?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({ avatarId, size = 40, className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const avatar = avatarId
    ? predefinedAvatars.find(a => a.id === avatarId) || predefinedAvatars[0]
    : predefinedAvatars[0];

  const avatarUrl = getAvatarUrl(avatar.seed, avatar.style);

  // Placeholder when image fails to load
  if (imageError || !avatarUrl) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
          ?
        </span>
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt="Avatar"
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
      onError={() => setImageError(true)}
      loading="lazy"
      crossOrigin="anonymous"
    />
  );
}
