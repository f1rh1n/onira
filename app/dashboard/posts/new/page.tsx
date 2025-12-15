"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { HiPhoto, HiXMark } from "react-icons/hi2";

export default function NewPostPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    isPublished: true,
  });
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 500KB for SQLite)
    if (file.size > 500 * 1024) {
      setError("Image size should be less than 500KB. Please compress your image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (isCover) {
        setCoverImage(result);
      } else {
        setAdditionalImages([...additionalImages, result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          coverImage,
          images: JSON.stringify(additionalImages),
          tags: JSON.stringify(tags),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create post");
      }

      router.push("/dashboard/posts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-950">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="transition-transform hover:scale-105">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/posts" className="text-foreground/80 hover:text-foreground transition">
              ← Back to Posts
            </Link>
            
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-8">
            Create New Post
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Cover Image */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-foreground/80 mb-3">
                Cover Image
              </label>
              {coverImage ? (
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src={coverImage}
                    alt="Cover"
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-foreground/20 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <HiPhoto className="w-12 h-12 text-foreground/40 mb-2" />
                  <span className="text-sm text-foreground/60">Click to upload cover image</span>
                  <span className="text-xs text-foreground/40 mt-1">Max 500KB (compress if needed)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Title */}
            <div className="glass-card p-6">
              <label htmlFor="title" className="block text-sm font-medium text-foreground/80 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 glass border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-semibold"
                placeholder="Enter post title..."
              />
            </div>

            {/* Excerpt */}
            <div className="glass-card p-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-foreground/80 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 glass border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief description of your post..."
              />
            </div>

            {/* Content */}
            <div className="glass-card p-6">
              <label htmlFor="content" className="block text-sm font-medium text-foreground/80 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                rows={15}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 glass border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Write your post content here..."
              />
            </div>

            {/* Additional Images */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-foreground/80 mb-3">
                Additional Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {additionalImages.map((img, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`Additional ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                      <HiXMark className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {additionalImages.length < 8 && (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-foreground/20 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <HiPhoto className="w-8 h-8 text-foreground/40 mb-1" />
                    <span className="text-xs text-foreground/60">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Category and Tags */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <label htmlFor="category" className="block text-sm font-medium text-foreground/80 mb-2">
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 glass border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Recipes, Updates..."
                />
              </div>

              <div className="glass-card p-6">
                <label htmlFor="tags" className="block text-sm font-medium text-foreground/80 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 glass border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="baking, dessert, chocolate..."
                />
              </div>
            </div>

            {/* Publish Status */}
            <div className="glass-card p-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-foreground font-medium">Publish immediately</span>
              </label>
              <p className="text-sm text-foreground/60 mt-2 ml-8">
                Uncheck to save as draft
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-purple-pink text-white px-6 py-3 rounded-full hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-300 hover:scale-105 font-medium"
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
              <Link
                href="/dashboard/posts"
                className="glass border-2 border-foreground/20 text-foreground px-6 py-3 rounded-full hover:shadow-lg transition-all text-center font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
