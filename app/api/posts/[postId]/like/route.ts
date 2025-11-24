import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Check if user has liked the post and get like count
export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get("anonymousId");

    // Get like count
    const likeCount = await prisma.postLike.count({
      where: { postId: params.postId },
    });

    // Check if this anonymous user has liked
    let hasLiked = false;
    if (anonymousId) {
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_anonymousId: {
            postId: params.postId,
            anonymousId,
          },
        },
      });
      hasLiked = !!existingLike;
    }

    return NextResponse.json({ likeCount, hasLiked });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

// POST - Toggle like on a post
export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { anonymousId } = await request.json();

    if (!anonymousId) {
      return NextResponse.json(
        { error: "Anonymous ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_anonymousId: {
          postId: params.postId,
          anonymousId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.postLike.delete({
        where: { id: existingLike.id },
      });

      const likeCount = await prisma.postLike.count({
        where: { postId: params.postId },
      });

      return NextResponse.json({
        liked: false,
        likeCount,
        message: "Post unliked",
      });
    } else {
      // Like
      await prisma.postLike.create({
        data: {
          postId: params.postId,
          anonymousId,
        },
      });

      const likeCount = await prisma.postLike.count({
        where: { postId: params.postId },
      });

      return NextResponse.json({
        liked: true,
        likeCount,
        message: "Post liked",
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
