import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt-auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
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
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify ownership
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post || post.profileId !== user.profile.id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id: params.postId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
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
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify ownership
    const existingPost = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!existingPost || existingPost.profileId !== user.profile.id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, images, category, tags, isPublished } = body;

    const post = await prisma.post.update({
      where: { id: params.postId },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        images: images || null,
        category: category || null,
        tags: tags || null,
        isPublished: isPublished !== undefined ? isPublished : existingPost.isPublished,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
