import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Optional: Add authentication check if you want to protect this endpoint
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Get time ranges
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all metrics in parallel for better performance
    const [
      totalUsers,
      usersLast24h,
      usersLastWeek,
      usersLastMonth,
      totalProfiles,
      publishedProfiles,
      totalReviews,
      publishedReviews,
      totalPosts,
      publishedPosts,
      totalLikes,
      totalComments,
      reviewsLast24h,
      postsLast24h,
    ] = await Promise.all([
      // User metrics
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: oneDayAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: oneMonthAgo } } }),

      // Profile metrics
      prisma.profile.count(),
      prisma.profile.count({ where: { isPublished: true } }),

      // Review metrics
      prisma.review.count(),
      prisma.review.count({ where: { isPublished: true } }),

      // Post metrics
      prisma.post.count(),
      prisma.post.count({ where: { isPublished: true } }),

      // Engagement metrics
      prisma.postLike.count(),
      prisma.postComment.count(),

      // Recent activity
      prisma.review.count({ where: { createdAt: { gte: oneDayAgo } } }),
      prisma.post.count({ where: { createdAt: { gte: oneDayAgo } } }),
    ]);

    // Get top profiles by review count
    const topProfiles = await prisma.profile.findMany({
      where: { isPublished: true },
      include: {
        _count: {
          select: { reviews: true, posts: true },
        },
        user: {
          select: { username: true },
        },
      },
      orderBy: {
        reviews: {
          _count: "desc",
        },
      },
      take: 5,
    });

    // Get recent users (last 10)
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            isPublished: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Calculate growth rates
    const userGrowthRate =
      totalUsers > 0 ? ((usersLast24h / totalUsers) * 100).toFixed(2) : "0";

    // Calculate average rating
    const reviewsWithRating = await prisma.review.findMany({
      where: { isPublished: true },
      select: { rating: true },
    });
    const averageRating =
      reviewsWithRating.length > 0
        ? (
            reviewsWithRating.reduce((sum, r) => sum + r.rating, 0) /
            reviewsWithRating.length
          ).toFixed(2)
        : "0";

    return NextResponse.json({
      timestamp: now.toISOString(),
      users: {
        total: totalUsers,
        last24h: usersLast24h,
        lastWeek: usersLastWeek,
        lastMonth: usersLastMonth,
        growthRate: `${userGrowthRate}%`,
        recent: recentUsers,
      },
      profiles: {
        total: totalProfiles,
        published: publishedProfiles,
        unpublished: totalProfiles - publishedProfiles,
        top: topProfiles.map((p) => ({
          username: p.user.username,
          displayName: p.displayName,
          reviewCount: p._count.reviews,
          postCount: p._count.posts,
        })),
      },
      reviews: {
        total: totalReviews,
        published: publishedReviews,
        pending: totalReviews - publishedReviews,
        last24h: reviewsLast24h,
        averageRating: parseFloat(averageRating),
      },
      posts: {
        total: totalPosts,
        published: publishedPosts,
        unpublished: totalPosts - publishedPosts,
        last24h: postsLast24h,
      },
      engagement: {
        totalLikes: totalLikes,
        totalComments: totalComments,
      },
      system: {
        databaseConnection: "healthy",
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    console.error("Metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
