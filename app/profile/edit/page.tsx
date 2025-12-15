"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";
import AvatarPicker from "@/components/AvatarPicker";

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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="text-lg text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            {avatar && (
              <Avatar avatarId={avatar} size={40} className="ring-2 ring-purple-500/20" />
            )}
            
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              ← Back to Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg shadow border border-gray-200 dark:border-gray-800 p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Edit Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Update your business or personal brand information
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded">
                {error}
              </div>
            )}

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image
              </label>
              <div className="space-y-3">
                {coverImagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">No cover image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 1200x400px. This will appear as a banner behind your profile picture.
                </p>
              </div>
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                        className="rounded-full object-cover w-28 h-28 ring-4 ring-purple-500/20"
                      />
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full text-xs font-bold transition"
                      >
                        ✕
                      </button>
                    </div>
                  ) : avatar ? (
                    <Avatar avatarId={avatar} size={112} className="ring-4 ring-purple-500/20 rounded-full" />
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
                      className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Upload a custom photo or choose an avatar below. Custom photo takes priority.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Picker (fallback if no custom profile image) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or Choose an Avatar
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                This will be used if you don&apos;t upload a custom profile picture.
              </p>
              <AvatarPicker
                selectedAvatar={avatar}
                onSelect={(avatarId) => setAvatar(avatarId)}
              />
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                required
                className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Your name or brand name"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Name
              </label>
              <input
                id="businessName"
                type="text"
                className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="e.g., Sweet Dreams Bakery"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio / Description
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell people about what you do..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instagram Handle
                </label>
                <input
                  id="instagram"
                  type="text"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  placeholder="@yourusername"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="rounded border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-300">
                  Make profile public
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-6 mt-1">
                When unchecked, your profile won&apos;t be visible to others
              </p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-[#0a0a0a]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
