  "use client";

  import { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import { useSession } from "next-auth/react";
  import Link from "next/link";
  import Image from "next/image";
  import Logo from "@/components/Logo";
  import AnimatedBackground from "@/components/AnimatedBackground";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEyeOff,
  FiMoreVertical,
  FiTrash2,
  FiEdit,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFile,
  FiBarChart,
  FiShare2,
  FiChevronDown,
} from "react-icons/fi";

  interface Post {
    id: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    category: string | null;
    isPublished: boolean;
    createdAt: string;
  }

  export default function PostsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
      }
    }, [status, router]);

    useEffect(() => {
      fetchPosts();
    }, []);

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/my-posts");
        if (res.ok) {
          const data = await res.json();
setPosts(data.posts ?? []);

        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const showToast = (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this post?")) return;

      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setPosts(posts.filter((p) => p.id !== id));
          showToast("Post deleted successfully", "success");
        } else {
          showToast("Failed to delete post", "error");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        showToast("Failed to delete post", "error");
      }
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: !currentStatus }),
        });

        if (res.ok) {
          setPosts(posts.map(p => p.id === id ? { ...p, isPublished: !currentStatus } : p));
          showToast(currentStatus ? "Post unpublished" : "Post published", "success");
          setActiveDropdown(null);
        } else {
          showToast("Failed to update post", "error");
        }
      } catch (error) {
        console.error("Error updating post:", error);
        showToast("Failed to update post", "error");
      }
    };

    const handleBulkDelete = async () => {
      if (!confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) return;

      try {
        await Promise.all(selectedPosts.map(id => handleDelete(id)));
        setSelectedPosts([]);
        showToast(`${selectedPosts.length} posts deleted`, "success");
      } catch (error) {
        showToast("Failed to delete posts", "error");
      }
    };

    const handleBulkPublish = async () => {
      try {
        await Promise.all(
          selectedPosts.map(id => {
            const post = posts.find(p => p.id === id);
            if (post && !post.isPublished) {
              return handleTogglePublish(id, false);
            }
          })
        );
        setSelectedPosts([]);
        showToast(`${selectedPosts.length} posts published`, "success");
      } catch (error) {
        showToast("Failed to publish posts", "error");
      }
    };

    const toggleSelectAll = () => {
      if (selectedPosts.length === filteredPosts.length) {
        setSelectedPosts([]);
      } else {
        setSelectedPosts(filteredPosts.map(p => p.id));
      }
    };

    const filteredPosts = posts.filter(post => {
      if (filter === "published" && !post.isPublished) return false;
      if (filter === "draft" && post.isPublished) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.category?.toLowerCase().includes(query)
        );
      }

      return true;
    });

    const publishedCount = posts.filter(p => p.isPublished).length;
    const draftCount = posts.filter(p => !p.isPublished).length;

    if (status === "loading" || loading) {
      return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>
          <AnimatedBackground />
          <div className="relative z-10">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading posts...</p>
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
                : "bg-red-500/90 border-red-400 text-white"
            }`}>
              {toast.type === "success" ? (
                <FiCheckCircle className="w-5 h-5" />
              ) : (
                <FiAlertCircle className="w-5 h-5" />
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
                <Link href="/dashboard" className="text-white/70 hover:text-white transition font-medium">
                  Dashboard
                </Link>
                <Link href="/dashboard/reviews" className="text-white/70 hover:text-white transition font-medium">
                  Reviews
                </Link>
                <Link href="/profile/edit" className="text-white/70 hover:text-white transition font-medium">
                  Edit Profile
                </Link>
              </div>
            </nav>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">My Posts</h1>
                  <p className="text-white/70 text-lg">Create and manage your blog posts</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <FiFile className="w-4 h-4" />
                      {posts.length} Total
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCheckCircle className="w-4 h-4 text-green-400" />
                      {publishedCount} Published
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4 text-yellow-400" />
                      {draftCount} Drafts
                    </span>
                  </div>
                </div>
                <Link
                  href="/dashboard/posts/new"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 font-semibold"
                >
                  <HiPlus className="w-5 h-5" />
                  New Post
                </Link>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search posts by title, excerpt, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-6 overflow-hidden">
                <div className="flex">
                  <button
                    onClick={() => setFilter("all")}
                    className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                      filter === "all" ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    All Posts
                    {filter === "all" && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setFilter("published")}
                    className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                      filter === "published" ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Published
                      {publishedCount > 0 && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-bold">
                          {publishedCount}
                        </span>
                      )}
                    </span>
                    {filter === "published" && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setFilter("draft")}
                    className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                      filter === "draft" ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Drafts
                      {draftCount > 0 && (
                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-bold animate-pulse">
                          {draftCount}
                        </span>
                      )}
                    </span>
                    {filter === "draft" && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {selectedPosts.length > 0 && (
                <div className="bg-purple-600/90 backdrop-blur-md rounded-2xl border border-purple-500 p-4 mb-6 flex items-center justify-between">
                  <span className="text-white font-semibold">
                    {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBulkPublish}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition flex items-center gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      Publish All
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition flex items-center gap-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedPosts([])}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Select All Checkbox */}
              {filteredPosts.length > 0 && (
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded border-2 border-white/30 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 bg-white/5 transition-all cursor-pointer"
                    />
                    <span className="font-medium">Select All ({filteredPosts.length})</span>
                  </label>
                </div>
              )}

              {/* Posts Grid */}
              {posts.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiFile className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-white">No posts yet</h2>
                  <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                    Start sharing your story by creating your first post
                  </p>
                  <Link
                    href="/dashboard/posts/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 font-semibold text-lg"
                  >
                    <HiPlus className="w-5 h-5" />
                    Create First Post
                  </Link>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-12 text-center">
                  <FiSearch className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2 text-white">No posts found</h2>
                  <p className="text-white/70 mb-6">Try adjusting your search or filter</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                    }}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => {
                    const isSelected = selectedPosts.includes(post.id);
                    const isDropdownOpen = activeDropdown === post.id;

                    return (
                      <div
                        key={post.id}
                        className={`bg-white/10 backdrop-blur-md rounded-2xl border-2 transition-all overflow-hidden ${
                          isSelected ? "border-purple-500 bg-white/15" : "border-white/20 hover:border-white/30 hover:bg-white/15"
                        } ${
                          post.isPublished ? "border-l-4 border-l-green-500" : "border-l-4 border-l-yellow-500"
                        }`}
                      >
                        {post.coverImage && (
                          <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedPosts(
                                  isSelected
                                    ? selectedPosts.filter(id => id !== post.id)
                                    : [...selectedPosts, post.id]
                                );
                              }}
                              className="mt-1 w-5 h-5 rounded border-2 border-white/30 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 bg-white/5 transition-all cursor-pointer"
                            />

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                {/* Status Badge */}
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                    post.isPublished
                                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                      : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 animate-pulse"
                                  }`}
                                >
                                  {post.isPublished ? (
                                    <><FiCheckCircle className="w-3 h-3" /> Published</>
                                  ) : (
                                    <><FiClock className="w-3 h-3" /> Draft</>
                                  )}
                                </span>

                                {/* Dropdown Menu */}
                                <div className="relative">
                                  <button
                                    onClick={() => setActiveDropdown(isDropdownOpen ? null : post.id)}
                                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                                  >
                                    <FiMoreVertical className="w-5 h-5" />
                                  </button>

                                  {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl z-10 overflow-hidden">
                                      <button
                                        onClick={() => handleTogglePublish(post.id, post.isPublished)}
                                        className="w-full px-4 py-3 text-left hover:bg-purple-100 transition flex items-center gap-2 text-gray-700 font-medium"
                                      >
                                        {post.isPublished ? (
                                          <><FiEyeOff className="w-4 h-4" /> Unpublish</>
                                        ) : (
                                          <><FiEye className="w-4 h-4" /> Publish</>
                                        )}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setActiveDropdown(null);
                                          handleDelete(post.id);
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center gap-2 text-red-600 font-medium"
                                      >
                                        <FiTrash2 className="w-4 h-4" /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Category */}
                              {post.category && (
                                <span className="text-xs font-semibold text-purple-300 mb-2 inline-block">
                                  {post.category}
                                </span>
                              )}

                              {/* Title */}
                              <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">
                                {post.title}
                              </h3>

                              {/* Excerpt */}
                              {post.excerpt && (
                                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                                  {post.excerpt}
                                </p>
                              )}

                              {/* Metadata */}
                              <div className="flex items-center gap-3 text-xs text-white/50 mb-4">
                                <div className="flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                              </div>

                              {/* Primary Action */}
                              <Link
                                href={`/dashboard/posts/edit/${post.id}`}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-sm flex items-center justify-center gap-2 hover:scale-[1.02]"
                              >
                                <FiEdit className="w-4 h-4" />
                                Edit Post
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
