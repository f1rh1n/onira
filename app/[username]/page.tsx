import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReviewForm from "@/components/ReviewForm";
import Image from "next/image";
import Avatar from "@/components/Avatar";

async function getProfileByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: {
        include: {
          reviews: {
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
          },
          posts: {
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!user || !user.profile || !user.profile.isPublished) {
    return null;
  }

  return {
    user,
    profile: user.profile,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const data = await getProfileByUsername(params.username);

  if (!data) {
    notFound();
  }

  const { profile } = data;

  // Calculate average rating
  const averageRating = profile.reviews.length > 0
    ? profile.reviews.reduce((sum, review) => sum + review.rating, 0) / profile.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-3">
          <a href="/" className="transition-transform hover:scale-105 inline-block">
            <Image src="/logo.png" alt="Onira" width={40} height={40} />
          </a>
        </nav>
      </header>

      {/* Instagram-style Profile Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header - Instagram Style */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Profile Avatar - Centered on Mobile */}
              {profile.avatar && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <Avatar
                      avatarId={profile.avatar}
                      size={150}
                      className="rounded-full border-4 border-white dark:border-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.displayName}
                </h1>
                {profile.businessName && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-3">
                    {profile.businessName}
                  </p>
                )}

                {/* Stats Row - Instagram Style */}
                <div className="flex justify-center md:justify-start gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile.posts?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile.reviews.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">reviews</div>
                  </div>
                  {profile.reviews.length > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                        {averageRating.toFixed(1)} ★
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">rating</div>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Contact Links - Pill Style */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile.location && (
                    <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                      📍 {profile.location}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                      📞 {profile.phone}
                    </span>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:scale-105 transition"
                    >
                      🌐 Website
                    </a>
                  )}
                  {profile.instagram && (
                    <a
                      href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:scale-105 transition"
                    >
                      📸 {profile.instagram}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Posts and Reviews */}
            <div className="lg:col-span-2 space-y-8">

              {/* Posts Section */}
              {profile.posts && profile.posts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="text-3xl">📝</span>
                    Latest Posts
                  </h2>
                  <div className="space-y-6">
                    {profile.posts.map((post) => (
                      <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        {post.coverImage && (
                          <div className="relative h-64 md:h-80">
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
                            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full mb-3 shadow-md">
                              {post.category}
                            </span>
                          )}
                          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <time dateTime={post.createdAt}>
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </time>
                            <span>•</span>
                            <span>👁️ {post.views} views</span>
                          </div>
                          {post.images && JSON.parse(post.images).length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-2">
                              {JSON.parse(post.images).slice(0, 4).map((img: string, idx: number) => (
                                <div key={idx} className="relative h-20 rounded-xl overflow-hidden">
                                  <Image
                                    src={img}
                                    alt={`Gallery ${idx + 1}`}
                                    fill
                                    className="object-cover hover:scale-110 transition"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section - X (Twitter) Style */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-3xl">💬</span>
                  What People Are Saying
                </h2>

                {profile.reviews.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                    <div className="text-6xl mb-4">🌟</div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No reviews yet. Be the first to leave one!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.reviews.map((review) => (
                      <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-purple-500">
                        <div className="flex items-start gap-4">
                          {/* Reviewer Avatar */}
                          <div className="flex-shrink-0">
                            {review.reviewerAvatar ? (
                              <Avatar avatarId={review.reviewerAvatar} size={48} className="rounded-full" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                                {review.reviewerName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Review Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                  {review.reviewerName}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}>
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
                                    {review.rating}.0
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {review.comment}
                            </p>

                            {/* Engagement Buttons - X Style */}
                            <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-400">
                              <button className="flex items-center gap-1.5 hover:text-purple-500 transition group">
                                <span className="text-xl group-hover:scale-110 transition">💜</span>
                                <span className="text-sm">Like</span>
                              </button>
                              <button className="flex items-center gap-1.5 hover:text-pink-500 transition group">
                                <span className="text-xl group-hover:scale-110 transition">🔁</span>
                                <span className="text-sm">Share</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Review Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-1">
                  <div className="bg-white dark:bg-gray-800 rounded-xl">
                    <ReviewForm profileId={profile.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
