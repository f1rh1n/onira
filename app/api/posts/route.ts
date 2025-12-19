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

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { profile: true },
    });

    if (!user?.profile) {
      return NextResponse.json(
        { error: "Profile not found. Please create a profile first." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, images, category, tags, isPublished } = body;

    const post = await prisma.post.create({
      data: {
        profileId: user.profile.id,
        title,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        images: images || null,
        category: category || null,
        tags: tags || null,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

   return NextResponse.json(
  {
    ...post,
    tags: post.tags ? JSON.parse(post.tags) : [],
    images: post.images ? JSON.parse(post.images) : [],
  },
  { status: 201 }
);

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
