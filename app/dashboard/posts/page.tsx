  "use client";

  import { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import { useSession } from "next-auth/react";
  import Link from "next/link";
  import Image from "next/image";
  import Logo from "@/components/Logo";
  import { HiPlus, HiPencil, HiTrash } from "react-icons/hi2";

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
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this post?")) return;

      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setPosts(posts.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    };

    if (status === "loading" || loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-950 flex items-center justify-center">
          <div className="text-foreground">Loading...</div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-950">
        {/* Header */}
        <header className="glass-nav sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="transition-transform hover:scale-105">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition">
                Dashboard
              </Link>
              <Link href="/dashboard/reviews" className="text-foreground/80 hover:text-foreground transition">
                Reviews
              </Link>
              <Link href="/profile/edit" className="text-foreground/80 hover:text-foreground transition">
                Edit Profile
              </Link>

            </div>
          </nav>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  My Posts
                </h1>
                <p className="text-foreground/70 mt-2">Create and manage your blog posts</p>
              </div>
              <Link
                href="/dashboard/posts/new"
                className="bg-gradient-purple-pink text-white px-6 py-3 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <HiPlus className="w-5 h-5" />
                New Post
              </Link>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-xl font-semibold mb-2 text-foreground">No posts yet</h2>
                <p className="text-foreground/70 mb-6">Start sharing your story by creating your first post</p>
                <Link
                  href="/dashboard/posts/new"
                  className="bg-gradient-purple-pink text-white px-6 py-3 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                >
                  <HiPlus className="w-5 h-5" />
                  Create First Post
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="glass-card overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    {post.coverImage && (
                      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.category && (
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-2 inline-block">
                          {post.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold mb-2 text-foreground line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-foreground/60 mb-4">
                        <div>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className={`px-2 py-1 rounded-full ${post.isPublished ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                          {post.isPublished ? 'Published' : 'Draft'}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/posts/edit/${post.id}`}
                          className="flex-1 glass border border-primary-400 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full hover:shadow-lg transition-all text-center text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <HiPencil className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="glass border border-red-400 text-red-600 dark:text-red-400 px-4 py-2 rounded-full hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
