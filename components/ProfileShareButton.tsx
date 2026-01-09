"use client";

import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import html2canvas from "html2canvas";

interface ProfileShareButtonProps {
  profileElementId: string;
  profileName: string;
  className?: string;
}

export default function ProfileShareButton({
  profileElementId,
  profileName,
  className = "",
}: ProfileShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const shareToInstagram = async () => {
    setIsGenerating(true);

    try {
      const element = document.getElementById(profileElementId);
      if (!element) {
        throw new Error("Profile element not found");
      }

      // Generate canvas from the profile card
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        }, "image/jpeg", 0.95);
      });

      // Create File object
      const file = new File([blob], `${profileName}-profile.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      // Try Web Share API (works on mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${profileName}'s Profile`,
            text: `Check out ${profileName}'s profile!`,
          });
          return;
        } catch (err: any) {
          if (err.name === "AbortError") {
            return;
          }
          console.error("Share error:", err);
        }
      }

      // Fallback: Download the image
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${profileName}-profile.jpg`;
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
          alert(
            "📱 Profile image saved!\n\nOpen your Gallery app and find the image.\n\nTo share to Instagram:\n1. Open the image\n2. Tap Share\n3. Select Instagram Stories"
          );
        }, 300);
      } else {
        alert(
          "💻 Profile image downloaded! Transfer to your phone and share to Instagram Stories from your Gallery app."
        );
      }
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={shareToInstagram}
      disabled={isGenerating}
      className={`bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2.5 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <FaInstagram className="w-5 h-5" />
      <span>{isGenerating ? "Generating..." : "Share to Instagram"}</span>
    </button>
  );
}
