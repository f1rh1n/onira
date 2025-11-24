import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get all comments for a post
export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = await prisma.postComment.findMany({
      where: { postId: params.postId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { commenterName, commenterAvatar, comment, anonymousId } =
      await request.json();

    // Validation
    if (!commenterName || !comment || !anonymousId) {
      return NextResponse.json(
        { error: "Name, comment, and anonymous ID are required" },
        { status: 400 }
      );
    }

    if (comment.length > 500) {
      return NextResponse.json(
        { error: "Comment must be 500 characters or less" },
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

    // Create comment
    const newComment = await prisma.postComment.create({
      data: {
        postId: params.postId,
        commenterName,
        commenterAvatar: commenterAvatar || null,
        comment,
        anonymousId,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment (only post owner can delete)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Get comment and check if user owns the post
    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if the logged-in user owns the post
    if (comment.post.profile.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "You can only delete comments on your own posts" },
        { status: 403 }
      );
    }

    // Delete the comment
    await prisma.postComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
