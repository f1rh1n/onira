'use client';

import { useState } from 'react';

interface InstagramShareButtonProps {
  reviewId: string;
  className?: string;
  variant?: 'icon' | 'full' | 'dropdown';
}

export default function InstagramShareButton({
  reviewId,
  className = '',
  variant = 'icon'
}: InstagramShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate image from API
      const response = await fetch(`/api/reviews/share-image?id=${reviewId}`);

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      // Get blob
      const blob = await response.blob();

      // Convert blob to dataURL with proper MIME type
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Ensure blob has correct MIME type
      const imageBlob = new Blob([blob], { type: "image/jpeg" });

      // Create File object with proper metadata for sharing
      const file = new File([imageBlob], "review.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      // Try Web Share API (works on mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Customer Review',
            text: 'Check out this review!',
          });
          return; // Successfully shared
        } catch (err: any) {
          if (err.name === 'AbortError') {
            return; // User cancelled
          }
          console.error('Share error:', err);
        }
      }

      // Fallback: Use dataURL for download (ensures proper MIME type)
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = "review.jpg";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      // Show helpful instructions
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        setTimeout(() => {
          alert('📱 Image saved!\n\nOpen your Gallery app and you should find "review.jpg" there.\n\nTo share to Instagram:\n1. Open the image\n2. Tap Share\n3. Select Instagram Stories');
        }, 300);
      } else {
        alert('💻 Image downloaded! Transfer to your phone and share to Instagram Stories from your Gallery app.');
      }

    } catch (err) {
      console.error('Share failed:', err);
      setError('Failed to share. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        disabled={isGenerating}
        className={`flex items-center gap-1.5 hover:text-pink-500 transition group disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Share to Instagram Stories"
      >
        <span className="text-xl group-hover:scale-110 transition">📸</span>
        <span className="text-sm">{isGenerating ? 'Sharing...' : 'Share'}</span>
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <button
        onClick={handleShare}
        disabled={isGenerating}
        className={`w-full px-4 py-3 text-left hover:bg-purple-100 transition flex items-center gap-2 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <span className="text-xl">📸</span>
        <span>{isGenerating ? 'Generating...' : 'Share to Instagram'}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleShare}
        disabled={isGenerating}
        className={`px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg font-medium hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg ${className}`}
      >
        <span className="text-xl">📸</span>
        <span>{isGenerating ? 'Generating...' : 'Share to Instagram Stories'}</span>
      </button>
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
}
