import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt-auth";

export async function POST(request: NextRequest) {
  try {
    // Try JWT authentication first (for mobile)
    const jwtUser = verifyJWT(request);
    let userEmail: string | null = null;

    if (jwtUser) {
      userEmail = jwtUser.email;
    } else {
      // Fall back to NextAuth session (for web)
      const session = await getServerSession(authOptions);
      userEmail = session?.user?.email || null;
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      username,
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
        userId: user.id,
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
        userId: user.id,
        username: username || null,
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
    let userEmail: string | null = null;

    if (jwtUser) {
      userEmail = jwtUser.email;
    } else {
      // Fall back to NextAuth session (for web)
      const session = await getServerSession(authOptions);
      userEmail = session?.user?.email || null;
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      username,
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

    // Check if username is already taken (if changing username)
    if (username !== undefined && username !== null) {
      const existingProfile = await prisma.profile.findUnique({
        where: { username: username },
      });

      if (existingProfile && existingProfile.userId !== user.id) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    // Update profile
    const profile = await prisma.profile.update({
      where: {
        userId: user.id,
      },
      data: {
        username: username !== undefined ? (username || null) : undefined,
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
  } catch (error: any) {
    console.error("Profile update error:", error);

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
