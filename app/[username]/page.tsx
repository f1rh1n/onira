import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CollapsibleReviewForm from "@/components/CollapsibleReviewForm";
import PostsGrid from "@/components/PostsGrid";
import Logo from "@/components/Logo";
import Image from "next/image";
import Avatar from "@/components/Avatar";
import GoogleAdSense from "@/components/GoogleAdSense";
import ReviewsSection from "@/components/ReviewsSection";
import { HiMapPin, HiPhone, HiGlobeAlt, HiStar, HiCheckBadge } from "react-icons/hi2";
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

  // Check if profile is verified (5+ reviews with 4+ average rating)
  const isVerified = profile.reviews.length >= 5 && averageRating >= 4;

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
          <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 group">
            <Image
              src={profile.coverImage}
              alt="Cover"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
        ) : (
          <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 -mt-20 relative z-10 mb-6 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 flex items-center justify-center sm:justify-start gap-2">
                {profile.displayName}
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-lg group-hover:scale-110 transition-transform" title="Verified profile with 5+ reviews and 4+ rating">
                    <HiCheckBadge className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </h1>
              {profile.businessName && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {profile.businessName}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-4 sm:gap-6 justify-center sm:justify-start mb-3">
                <div className="text-center group cursor-default">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl px-4 py-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{profile.posts?.length || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">posts</div>
                  </div>
                </div>
                <div className="text-center group cursor-default">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl px-4 py-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{profile.reviews.length}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">reviews</div>
                  </div>
                </div>
                {profile.reviews.length > 0 && (
                  <div className="text-center group cursor-default">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl px-4 py-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-1 justify-center">
                        {averageRating.toFixed(1)} <HiStar className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500 drop-shadow-lg group-hover:rotate-12 transition-transform" />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">rating</div>
                    </div>
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
                  <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-default">
                    <HiMapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <HiPhone className="w-4 h-4" />
                    {profile.phone}
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 group"
                  >
                    <HiGlobeAlt className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Website
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 group"
                  >
                    <FaInstagram className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    {profile.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leave a Review Section - Collapsible Button */}
        <CollapsibleReviewForm profileId={profile.id} username={user.username} reviewCount={profile.reviews.length} />

        {/* AdSense Ad - Top Section */}
        <div className="mb-6">
          <GoogleAdSense
            adSlot="2599313330"
            adFormat="auto"
            className="mb-4"
            adStyle={{ display: "block", textAlign: "center" }}
          />
        </div>

        {/* Instagram-Style Posts Grid */}
        {profile.posts && profile.posts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gradient-to-r from-purple-500 to-pink-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-3xl">📸</span>
                <span>Posts</span>
                <span className="text-base sm:text-lg font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                  {profile.posts.length}
                </span>
              </h2>
            </div>
            <PostsGrid posts={profile.posts} />
          </div>
        )}

        {/* AdSense Ad - Middle Section */}
        <div className="mb-6">
          <GoogleAdSense
            adSlot="5963843278"
            adFormat="auto"
            className="mb-4"
            adStyle={{ display: "block", textAlign: "center" }}
          />
        </div>

        {/* Reviews Section */}
        {profile.reviews.length > 0 && (
          <ReviewsSection reviews={profile.reviews} />
        )}
      </main>
    </div>
  );
}
