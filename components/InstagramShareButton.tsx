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

      // Ensure blob has correct image type
      const blob = await response.blob();
      const imageBlob = new Blob([blob], { type: 'image/png' });
      const file = new File([imageBlob], `onira-review-${reviewId}.png`, { type: 'image/png' });

      // Check if Web Share API is available (browser only)
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Try Web Share API first (best for mobile)
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
            } else {
              return; // User cancelled, don't show fallback
            }
          }
        }

        // Fallback: Download the image with proper MIME type
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `onira-review-${reviewId}.png`;
        a.style.display = 'none';

        // Add to body, click, and remove
        document.body.appendChild(a);
        a.click();

        // Clean up after a short delay
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        // Show helpful message
        if (isMobile) {
          alert('✅ Image saved! Check your Downloads or Gallery, then open Instagram Stories to share it.');
        } else {
          alert('✅ Image downloaded! Transfer it to your phone and share to Instagram Stories.');
        }
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
