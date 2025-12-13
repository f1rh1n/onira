import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt-auth";

/**
 * Get current authenticated user
 * Works with JWT token from mobile app
 */
export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const user = verifyJWT(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get full user data from database
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            displayName: true,
            businessName: true,
            bio: true,
            profileType: true,
            location: true,
            phone: true,
            website: true,
            instagram: true,
            avatar: true,
            profileImage: true,
            coverImage: true,
            isPublished: true,
          },
        },
      },
    });

    if (!fullUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: fullUser,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
