import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt-auth";

export async function POST(request: NextRequest) {
  try {
    // Try JWT authentication first (for mobile)
    const jwtUser = verifyJWT(request);

    // Fallback to NextAuth session (for web)
    const session = await getServerSession(authOptions);

    // Get user ID from either source
    const userId = jwtUser?.id || (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      displayName,
      businessName,
      bio,
      profileType,
      location,
      phone,
      website,
      instagram,
      avatar,
      profileImage,
      coverImage,
    } = body;

    if (!displayName) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      );
    }

    // Check if user already has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      );
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId: userId,
        displayName,
        businessName: businessName || null,
        bio: bio || null,
        profileType: profileType || "business",
        location: location || null,
        phone: phone || null,
        website: website || null,
        instagram: instagram || null,
        avatar: avatar || null,
        profileImage: profileImage || null,
        coverImage: coverImage || null,
        isPublished: true,
      },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Try JWT authentication first (for mobile)
    const jwtUser = verifyJWT(request);

    // Fallback to NextAuth session (for web)
    const session = await getServerSession(authOptions);

    // Get user ID from either source
    const userId = jwtUser?.id || (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      displayName,
      businessName,
      bio,
      profileType,
      location,
      phone,
      website,
      instagram,
      isPublished,
      avatar,
      profileImage,
      coverImage,
    } = body;

    // Update profile
    const profile = await prisma.profile.update({
      where: {
        userId: userId,
      },
      data: {
        displayName,
        businessName: businessName || null,
        bio: bio || null,
        profileType: profileType || "business",
        location: location || null,
        phone: phone || null,
        website: website || null,
        instagram: instagram || null,
        isPublished: isPublished !== undefined ? isPublished : true,
        avatar: avatar || null,
        profileImage: profileImage !== undefined ? profileImage : undefined,
        coverImage: coverImage !== undefined ? coverImage : undefined,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
