import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Fetch profile by username with related data
    const profile = await prisma.profile.findUnique({
      where: { username: username },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        },
        posts: {
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const reviewCount = profile.reviews.length;
    const averageRating =
      reviewCount > 0
        ? profile.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        : 0;
    const postCount = profile.posts.length;

    // Return public profile data
    const publicProfile = {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      businessName: profile.businessName,
      bio: profile.bio,
      profileType: profile.profileType,
      location: profile.location,
      phone: profile.phone,
      website: profile.website,
      instagram: profile.instagram,
      profileImage: profile.profileImage,
      coverImage: profile.coverImage,
      avatarId: profile.avatar,
      avatarUrl: profile.avatar,
      reviewCount,
      averageRating: Number(averageRating.toFixed(1)),
      postCount,
    };

    return NextResponse.json(publicProfile);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
