"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";
import AvatarPicker from "@/components/AvatarPicker";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    displayName: "",
    businessName: "",
    bio: "",
    profileType: "business",
    location: "",
    phone: "",
    website: "",
    instagram: "",
    isPublished: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

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

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profiles/my-profile");
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setFormData({
            displayName: data.profile.displayName || "",
            businessName: data.profile.businessName || "",
            bio: data.profile.bio || "",
            profileType: data.profile.profileType || "business",
            location: data.profile.location || "",
            phone: data.profile.phone || "",
            website: data.profile.website || "",
            instagram: data.profile.instagram || "",
            isPublished: data.profile.isPublished !== undefined ? data.profile.isPublished : true,
          });
          setAvatar(data.profile.avatar);
          setProfileImage(data.profile.profileImage || null);
          setCoverImage(data.profile.coverImage || null);
          setProfileImagePreview(data.profile.profileImage || null);
          setCoverImagePreview(data.profile.coverImage || null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        setProfileImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCoverImage(base64String);
        setCoverImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          avatar,
          profileImage,
          coverImage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
        <AnimatedBackground />
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
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

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="transition-transform hover:scale-105">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              {avatar && (
                <Avatar avatarId={avatar} size={40} className="ring-2 ring-purple-500/50" />
              )}

              <Link href="/dashboard" className="text-white/70 hover:text-white transition font-medium">
                ← Back to Dashboard
              </Link>
            </div>
          </nav>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Edit Your Profile</h1>
          <p className="text-white/70 text-lg mb-8">
            Update your business or personal brand information
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl" role="alert">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Cover Image
              </label>
              <div className="space-y-3">
                {coverImagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">No cover image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white hover:file:from-purple-700 hover:file:to-pink-700 file:cursor-pointer file:transition-all"
                />
                <p className="text-xs text-white/60">
                  Recommended: 1200x400px. This will appear as a banner behind your profile picture.
                </p>
              </div>
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Profile Picture (Custom Photo)
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  {profileImagePreview ? (
                    <div className="relative">
                      <Image
                        src={profileImagePreview}
                        alt="Profile preview"
                        width={120}
                        height={120}
                        className="rounded-full object-cover w-28 h-28 ring-4 ring-purple-500/50"
                      />
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full text-xs font-bold transition-all hover:scale-110 shadow-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ) : avatar ? (
                    <Avatar avatarId={avatar} size={112} className="ring-4 ring-purple-500/50 rounded-full" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                      ?
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white hover:file:from-purple-700 hover:file:to-pink-700 file:cursor-pointer file:transition-all"
                    />
                    <p className="text-xs text-white/60 mt-2">
                      Upload a custom photo or choose an avatar below. Custom photo takes priority.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Picker (fallback if no custom profile image) */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Or Choose an Avatar
              </label>
              <p className="text-xs text-white/60 mb-3">
                This will be used if you don&apos;t upload a custom profile picture.
              </p>
              <AvatarPicker
                selectedAvatar={avatar}
                onSelect={(avatarId) => setAvatar(avatarId)}
              />
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-white mb-2">
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                required
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Your name or brand name"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-semibold text-white mb-2">
                Business Name
              </label>
              <input
                id="businessName"
                type="text"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="e.g., Sweet Dreams Bakery"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-white mb-2">
                Bio / Description
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell people about what you do..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-white mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9+]/g, '');
                    setFormData({ ...formData, phone: value });
                  }}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-white mb-2">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-semibold text-white mb-2">
                  Instagram Handle
                </label>
                <input
                  id="instagram"
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  placeholder="@yourusername"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-2 border-white/30 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 bg-white/5 transition-all cursor-pointer"
                />
                <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition">
                  Make profile public
                </span>
              </label>
              <p className="text-xs text-white/60 ml-8 mt-1">
                When unchecked, your profile won&apos;t be visible to others
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3.5 rounded-xl text-lg font-semibold hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3.5 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
