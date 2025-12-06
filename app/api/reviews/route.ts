import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Hash IP address for privacy
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

// Get client IP from request
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profileId, reviewerName, rating, comment, reviewerAvatar } = body;

    if (!profileId || !reviewerName || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Get and hash IP address
    const clientIP = getClientIP(request);
    const hashedIP = hashIP(clientIP);

    // Check for recent reviews from same IP for this profile (24-hour cooldown)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentReview = await prisma.review.findFirst({
      where: {
        profileId,
        reviewerIp: hashedIP,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (recentReview) {
      const timeLeft = new Date(recentReview.createdAt.getTime() + 24 * 60 * 60 * 1000);
      const hoursLeft = Math.ceil((timeLeft.getTime() - Date.now()) / (1000 * 60 * 60));

      return NextResponse.json(
        { error: `You can only leave one review per 24 hours. Please try again in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}.` },
        { status: 429 }
      );
    }

    // Create review (not published by default)
    const review = await prisma.review.create({
      data: {
        profileId,
        reviewerName,
        rating,
        comment,
        reviewerAvatar: reviewerAvatar || null,
        reviewerIp: hashedIP,
        isPublished: false, // Owner must approve
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
