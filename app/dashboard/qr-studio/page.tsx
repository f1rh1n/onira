"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import AnimatedBackground from "@/components/AnimatedBackground";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import Avatar from "@/components/Avatar";
import {
  FiDownload,
  FiRefreshCw,
  FiShare2,
  FiCheckCircle,
  FiAlertCircle,
  FiSave,
  FiTrash2,
  FiCamera,
  FiAlertTriangle,
} from "react-icons/fi";
import { predefinedAvatars, getAvatarUrl } from "@/lib/avatars";

interface Profile {
  id: string;
  displayName: string;
  businessName?: string;
  avatar?: string;
}

type CardTemplate = "business" | "instagram" | "minimalist" | "dark" | "neon";
type DownloadFormat = "PNG" | "JPG" | "SVG";

interface ColorPreset {
  name: string;
  fg: string;
  bg: string;
  category: string;
}

interface SavedPreset extends ColorPreset {
  id: string;
}

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

  // New state for enhancements
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("PNG");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [showPresetSave, setShowPresetSave] = useState(false);
  const [presetName, setPresetName] = useState("");

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

  // Load saved presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("qr-presets");
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load presets");
      }
    }
  }, []);

  // Helper functions
  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getContrastRatio = (color1: string, color2: string) => {
    const getLuminance = (color: string) => {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      const [rs, gs, bs] = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  };

  const contrastRatio = getContrastRatio(fgColor, bgColor);
  const hasGoodContrast = contrastRatio >= 4.5;

  const savePreset = () => {
    if (!presetName.trim()) {
      showToast("Please enter a preset name", "error");
      return;
    }

    const newPreset: SavedPreset = {
      id: Date.now().toString(),
      name: presetName,
      fg: fgColor,
      bg: bgColor,
      category: "Custom",
    };

    const updated = [...savedPresets, newPreset];
    setSavedPresets(updated);
    localStorage.setItem("qr-presets", JSON.stringify(updated));
    setPresetName("");
    setShowPresetSave(false);
    showToast("Preset saved successfully!", "success");
  };

  const deletePreset = (id: string) => {
    const updated = savedPresets.filter(p => p.id !== id);
    setSavedPresets(updated);
    localStorage.setItem("qr-presets", JSON.stringify(updated));
    showToast("Preset deleted", "success");
  };

  const applyPreset = (preset: ColorPreset) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
    showToast(`Applied "${preset.name}" preset`, "success");
  };

  const resetToDefaults = () => {
    setFgColor("#7c3aed");
    setBgColor("#ffffff");
    setSize(200);
    setTemplate("business");
    setAvatarInQR(true);
    setDownloadFormat("PNG");
    showToast("Reset to default settings", "success");
  };

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

      let dataUrl: string;
      let filename: string;
      let mimeType: string;

      if (downloadFormat === "PNG") {
        dataUrl = canvas.toDataURL("image/png");
        filename = "qr-code.png";
        mimeType = "image/png";
      } else if (downloadFormat === "JPG") {
        dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        filename = "qr-code.jpg";
        mimeType = "image/jpeg";
      } else {
        // SVG format - will be handled differently if needed
        dataUrl = canvas.toDataURL("image/png");
        filename = "qr-code.png";
        mimeType = "image/png";
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      showToast(`QR code downloaded as ${downloadFormat}!`, "success");
    } catch (error) {
      console.error("Error downloading QR card:", error);
      showToast("Failed to download QR code", "error");
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
        showToast("Image saved! Open Gallery to share to Instagram", "success");
      } else {
        showToast("Image downloaded! Transfer to phone to share", "success");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to create image", "error");
    }
  };

  const defaultPresets: ColorPreset[] = [
    { name: "Purple", fg: "#7c3aed", bg: "#ffffff", category: "Professional" },
    { name: "Classic", fg: "#000000", bg: "#ffffff", category: "Professional" },
    { name: "Pink", fg: "#ec4899", bg: "#ffffff", category: "Vibrant" },
    { name: "Cyber", fg: "#06b6d4", bg: "#000000", category: "Neon" },
    { name: "Emerald", fg: "#10b981", bg: "#ffffff", category: "Vibrant" },
    { name: "Orange", fg: "#f97316", bg: "#ffffff", category: "Vibrant" },
  ];

  const sizePresets = [
    { name: "Small", value: 150 },
    { name: "Medium", value: 200 },
    { name: "Large", value: 300 },
    { name: "Extra Large", value: 400 },
  ];

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

  const currentTemplate = templates[template];

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
        <AnimatedBackground />
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading QR Studio...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-12">
            <p className="text-white/80 text-lg mb-6">
              Please create a profile first
            </p>
            <Link
              href="/profile/setup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 font-semibold text-lg"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
      <AnimatedBackground />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border ${
            toast.type === "success"
              ? "bg-green-500/90 border-green-400 text-white"
              : toast.type === "error"
              ? "bg-red-500/90 border-red-400 text-white"
              : "bg-yellow-500/90 border-yellow-400 text-white"
          }`}>
            {toast.type === "success" ? (
              <FiCheckCircle className="w-5 h-5" />
            ) : toast.type === "error" ? (
              <FiAlertCircle className="w-5 h-5" />
            ) : (
              <FiAlertTriangle className="w-5 h-5" />
            )}
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="transition-transform hover:scale-105">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              {profile.avatar && (
                <Avatar avatarId={profile.avatar} size={40} className="ring-2 ring-purple-500/50" />
              )}

              <Link href="/dashboard" className="text-white/70 hover:text-white transition font-medium">
                ← Back to Dashboard
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
                <FiCamera className="w-8 h-8 text-purple-400" />
                QR Code Studio
              </h1>
              <p className="text-white/70 text-lg">
                Create beautiful, professional QR codes for your profile
              </p>
            </div>
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl hover:bg-white/20 transition font-medium"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Customization Panel */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
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
  </div>
  );
}
