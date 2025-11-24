'use client';

import { useState } from 'react';

interface InstagramShareButtonProps {
  reviewId: string;
  className?: string;
  variant?: 'icon' | 'full';
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

      const blob = await response.blob();
      const file = new File([blob], `review-${reviewId}.png`, { type: 'image/png' });

      // Check if Web Share API is available
      if (navigator.share && navigator.canShare) {
        try {
          // Try to share with files
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Customer Review',
              text: 'Check out this amazing review!',
            });
            return;
          }
        } catch (shareError: any) {
          // User cancelled share or share failed
          if (shareError.name !== 'AbortError') {
            console.error('Share error:', shareError);
          }
        }
      }

      // Fallback: Download the image
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `review-${reviewId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show helpful message
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        alert('Image downloaded! Open Instagram Stories and upload it from your gallery.');
      } else {
        alert('Image downloaded! Transfer it to your phone and share to Instagram Stories.');
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
