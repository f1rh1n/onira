import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CollapsibleReviewForm from "@/components/CollapsibleReviewForm";
import PostsGrid from "@/components/PostsGrid";
import Logo from "@/components/Logo";
import Image from "next/image";
import Avatar from "@/components/Avatar";
import { HiMapPin, HiPhone, HiGlobeAlt, HiStar } from "react-icons/hi2";
import { FaInstagram } from "react-icons/fa";

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

  const { profile, user } = data;

  // Calculate average rating
  const averageRating = profile.reviews.length > 0
    ? profile.reviews.reduce((sum, review) => sum + review.rating, 0) / profile.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-3">
          <a href="/" className="transition-transform hover:scale-105 inline-block">
            <Logo size="text-2xl sm:text-3xl" />
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">

        {/* Cover Image */}
        {profile.coverImage ? (
          <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
            <Image
              src={profile.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" />
        )}

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 -mt-20 relative z-10 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            {/* Profile Avatar */}
            <div className="relative -mt-16 sm:-mt-20">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full blur-sm opacity-75"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-full p-2">
                {profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.displayName}
                    width={120}
                    height={120}
                    className="rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover"
                  />
                ) : profile.avatar ? (
                  <Avatar
                    avatarId={profile.avatar}
                    size={120}
                    className="rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {profile.displayName}
              </h1>
              {profile.businessName && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {profile.businessName}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-6 justify-center sm:justify-start mb-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{profile.posts?.length || 0}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{profile.reviews.length}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">reviews</div>
                </div>
                {profile.reviews.length > 0 && (
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-500 flex items-center gap-1">
                      {averageRating.toFixed(1)} <HiStar className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">rating</div>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 max-w-xl">
                  {profile.bio}
                </p>
              )}

              {/* Contact Pills */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {profile.location && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium flex items-center gap-1">
                    <HiMapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                    <HiPhone className="w-3.5 h-3.5" />
                    {profile.phone}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium hover:scale-105 transition flex items-center gap-1"
                  >
                    <HiGlobeAlt className="w-3.5 h-3.5" />
                    Website
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium hover:scale-105 transition flex items-center gap-1"
                  >
                    <FaInstagram className="w-3.5 h-3.5" />
                    {profile.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leave a Review Section - Collapsible Button */}
        <CollapsibleReviewForm profileId={profile.id} username={user.username} />

        {/* Instagram-Style Posts Grid */}
        {profile.posts && profile.posts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📸</span>
              Posts
            </h2>
            <PostsGrid posts={profile.posts} />
          </div>
        )}

        {/* Reviews Section */}
        {profile.reviews.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiStar className="w-6 h-6 text-yellow-500" />
              Reviews ({profile.reviews.length})
            </h2>
            <div className="space-y-3">
              {profile.reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start gap-3 mb-2">
                    {review.reviewerAvatar ? (
                      <Avatar avatarId={review.reviewerAvatar} size={40} className="rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                        {review.reviewerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">{review.reviewerName}</span>
                        <div className="flex items-center">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <HiStar key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
