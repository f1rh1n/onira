import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
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
        userId: (session.user as any).id,
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
        userId: (session.user as any).id,
        displayName,
        businessName: businessName || null,
        bio: bio || null,
        profileType: profileType || "business",
        location: location || null,
        phone: phone || null,
        website: website || null,
        instagram: instagram || null,
        avatar: avatar || null,
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

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
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
    } = body;

    // Update profile
    const profile = await prisma.profile.update({
      where: {
        userId: (session.user as any).id,
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
