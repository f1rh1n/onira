"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import ThemeToggle from "@/app/components/ThemeToggle";
import Avatar from "@/components/Avatar";
import { FiDownload, FiRefreshCw } from "react-icons/fi";
import { predefinedAvatars, getAvatarUrl } from "@/lib/avatars";

interface Profile {
  id: string;
  displayName: string;
  businessName?: string;
  avatar?: string;
}

type CardTemplate = "business" | "instagram" | "minimalist" | "dark" | "neon";

export default function QRStudioPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  // QR Customization Options
  const [fgColor, setFgColor] = useState("#7c3aed"); // purple-600
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(200);
  const [template, setTemplate] = useState<CardTemplate>("business");
  const [includeAvatar, setIncludeAvatar] = useState(true);
  const [avatarInQR, setAvatarInQR] = useState(true);
  const [profileUrl, setProfileUrl] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  // Set profile URL - SSR safe
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user) {
      setProfileUrl(`${window.location.origin}/${(session.user as any).username}`);
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profiles/my-profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch and convert avatar to data URL for QR code
  useEffect(() => {
    const loadAvatarDataUrl = async () => {
      if (!profile?.avatar) {
        setAvatarDataUrl(undefined);
        return;
      }

      const avatarData = predefinedAvatars.find(a => a.id === profile.avatar);
      if (!avatarData) {
        setAvatarDataUrl(undefined);
        return;
      }

      try {
        const avatarUrl = getAvatarUrl(avatarData.seed, avatarData.style);
        console.log('Fetching avatar for QR:', avatarUrl);
        const response = await fetch(avatarUrl, { mode: 'cors' });

        if (!response.ok) {
          throw new Error(`Failed to fetch avatar: ${response.status}`);
        }

        const svgText = await response.text();
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        console.log('Avatar data URL created successfully');
        setAvatarDataUrl(dataUrl);
      } catch (error) {
        console.error("Error loading avatar for QR:", error);
        setAvatarDataUrl(undefined);
      }
    };

    loadAvatarDataUrl();
  }, [profile?.avatar]);

  const downloadQRCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Convert canvas to data URL (base64) with proper MIME type
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

      // Use data URL for download (ensures proper MIME type)
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qr-code.jpg";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      // Check if mobile
      const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Show helpful message
      if (isMobile) {
        setTimeout(() => {
          alert('📱 QR code saved!\n\nOpen your Gallery app and you should find "qr-code.jpg" there.');
        }, 300);
      } else {
        alert("✅ QR code downloaded!");
      }
    } catch (error) {
      console.error("Error downloading QR card:", error);
      alert("Failed to download QR card. Please try again.");
    }
  };

  const shareToInstagram = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Convert canvas to data URL (base64) with proper MIME type
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

      // Convert data URL to blob with explicit MIME type
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Ensure blob has correct MIME type
      const imageBlob = new Blob([blob], { type: "image/jpeg" });

      // Create File with proper MIME type and extension
      const file = new File([imageBlob], "qr-code.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      // Try Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "My QR Code",
            text: "Scan to view my profile",
          });
          return; // Successfully shared
        } catch (err: any) {
          if (err.name === 'AbortError') {
            return; // User cancelled
          }
          console.error("Share failed:", err);
        }
      }

      // Fallback: Use data URL for download (ensures proper MIME type)
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qr-code.jpg";
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
          alert('📱 Image saved!\n\nOpen your Gallery app and you should find "qr-code.jpg" there.\n\nTo share to Instagram:\n1. Open the image\n2. Tap Share\n3. Select Instagram Stories');
        }, 300);
      } else {
        alert('💻 Image downloaded! Transfer to your phone and share to Instagram Stories.');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create image. Please try again.");
    }
  };

  const templates = {
    business: {
      name: "Business Card",
      bg: "bg-white",
      text: "text-gray-900",
      accent: "bg-purple-600",
      border: "border-gray-200",
    },
    instagram: {
      name: "Instagram Style",
      bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
      text: "text-white",
      accent: "bg-white/20",
      border: "border-white/20",
    },
    minimalist: {
      name: "Minimalist",
      bg: "bg-gray-50",
      text: "text-gray-800",
      accent: "bg-gray-900",
      border: "border-gray-300",
    },
    dark: {
      name: "Dark Mode",
      bg: "bg-gray-900",
      text: "text-white",
      accent: "bg-purple-500",
      border: "border-gray-700",
    },
    neon: {
      name: "Neon",
      bg: "bg-black",
      text: "text-white",
      accent: "bg-gradient-to-r from-cyan-500 to-pink-500",
      border: "border-cyan-500",
    },
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="text-lg text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please create a profile first
          </p>
          <Link
            href="/profile/setup"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  const currentTemplate = templates[template];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            {profile.avatar && (
              <Avatar avatarId={profile.avatar} size={40} className="ring-2 ring-purple-500/20" />
            )}
            <ThemeToggle />
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              ← Back to Dashboard
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Code Studio ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create beautiful QR codes for your profile
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customization Panel */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Customize Your QR Code
              </h2>

              {/* Template Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Card Template
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(templates) as CardTemplate[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`p-4 rounded-lg border-2 transition ${
                        template === t
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {templates[t].name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Customization */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  QR Code Colors
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Foreground
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Background
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  QR Code Size: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="300"
                  step="8"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Avatar in QR Option */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={avatarInQR}
                    onChange={(e) => setAvatarInQR(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show avatar in center of QR code
                  </span>
                </label>
              </div>

              {/* Quick Presets */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setFgColor("#7c3aed");
                      setBgColor("#ffffff");
                    }}
                    className="px-3 py-1.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                  >
                    Purple
                  </button>
                  <button
                    onClick={() => {
                      setFgColor("#000000");
                      setBgColor("#ffffff");
                    }}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Classic
                  </button>
                  <button
                    onClick={() => {
                      setFgColor("#ec4899");
                      setBgColor("#ffffff");
                    }}
                    className="px-3 py-1.5 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full hover:bg-pink-200 dark:hover:bg-pink-900/50 transition"
                  >
                    Pink
                  </button>
                  <button
                    onClick={() => {
                      setFgColor("#06b6d4");
                      setBgColor("#000000");
                    }}
                    className="px-3 py-1.5 text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition"
                  >
                    Cyber
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Download */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Preview
              </h2>

              {/* QR Card Preview */}
              <div className="flex justify-center mb-6">
                <div
                  ref={cardRef}
                  className={`${currentTemplate.bg} ${currentTemplate.text} rounded-2xl border-2 ${currentTemplate.border} p-8 shadow-2xl`}
                  style={{ width: "400px" }}
                >
                  {/* Card Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-1">
                      {profile.displayName}
                    </h3>
                    {profile.businessName && (
                      <p className="text-sm opacity-80">
                        {profile.businessName}
                      </p>
                    )}
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                      {/* Fun Avatar Background Pattern */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 30L15 0l15 30l-15 30zM15 0l15 30h-30zM30 30l15-30l15 30l-15 30zM45 0l15 30h-30z'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                      }} />

                      {/* Small Random Avatars as Background */}
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2 opacity-[0.08] pointer-events-none">
                        {Array.from({ length: 24 }).map((_, i) => {
                          const randomAvatar = predefinedAvatars[i % predefinedAvatars.length];
                          return (
                            <div key={i} className="w-full h-full flex items-center justify-center">
                              <img
                                src={getAvatarUrl(randomAvatar.seed, randomAvatar.style)}
                                alt=""
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* QR Code */}
                      <div className="relative z-10">
                        <QRCodeSVG
                          value={profileUrl}
                          size={size}
                          fgColor={fgColor}
                          bgColor={bgColor}
                          level="H"
                          imageSettings={
                            avatarInQR && avatarDataUrl
                              ? {
                                  src: avatarDataUrl,
                                  x: undefined,
                                  y: undefined,
                                  height: size * 0.2,
                                  width: size * 0.2,
                                  excavate: true,
                                }
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center">
                    <p className="text-xs opacity-70 mb-2">
                      Scan to view my profile
                    </p>
                    <div className={`${currentTemplate.accent} h-1 w-16 mx-auto rounded-full`}></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {/* Download Button */}
                <button
                  onClick={downloadQRCard}
                  className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                >
                  <FiDownload size={20} />
                  Download
                </button>

                {/* Instagram Share Button */}
                <button
                  onClick={shareToInstagram}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-4 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 font-medium shadow-lg"
                >
                  <span className="text-xl">📸</span>
                  Share to IG
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-900 dark:text-purple-300">
                  💡 <strong>Tip:</strong> Share to your Instagram Stories or print this on your business cards, flyers, and marketing materials!
                </p>
              </div>

              {/* Profile URL */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Your Profile URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profileUrl);
                      alert("URL copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
