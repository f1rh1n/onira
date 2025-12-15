import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
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

    const body = await request.json();
    const { isPublished } = body;

    // Get user and verify the review belongs to them
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { profile: true },
    });

    if (!user?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const review = await prisma.review.findUnique({
      where: { id: params.reviewId },
      include: {
        profile: true,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.profile.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: params.reviewId },
      data: {
        isPublished: isPublished !== undefined ? isPublished : review.isPublished,
      },
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    console.error("Review update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
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

    // Get user and verify the review belongs to them
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { profile: true },
    });

    if (!user?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const review = await prisma.review.findUnique({
      where: { id: params.reviewId },
      include: {
        profile: true,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.profile.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: params.reviewId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review delete error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
