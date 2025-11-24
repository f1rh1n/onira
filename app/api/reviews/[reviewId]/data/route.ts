import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const reviewId = params.reviewId;

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Missing review ID' },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        profile: {
          include: {
            user: true
          }
        }
      },
    });

    if (!review || !review.isPublished) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Return only the data needed for image generation
    return NextResponse.json({
      reviewerName: review.reviewerName,
      reviewerAvatar: review.reviewerAvatar,
      rating: review.rating,
      comment: review.comment,
      businessName: review.profile.businessName || review.profile.displayName,
      username: review.profile.user.username,
    });

  } catch (error) {
    console.error('Error fetching review data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review data' },
      { status: 500 }
    );
  }
}
