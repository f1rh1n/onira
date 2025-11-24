import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return new Response('Missing review ID', { status: 400 });
    }

    // Fetch review data from Node.js API route
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const dataResponse = await fetch(`${baseUrl}/api/reviews/${reviewId}/data`);

    if (!dataResponse.ok) {
      return new Response('Review not found', { status: 404 });
    }

    const reviewData = await dataResponse.json();

    // Truncate long comments for better display
    const displayComment = reviewData.comment.length > 250
      ? reviewData.comment.substring(0, 247) + '...'
      : reviewData.comment;

    // Random background images from photos folder
    const backgroundImages = [
      '0e958fc52e2041a181dd5f5e5db5e240.jpg',
      '2f44b645f350e5ab5b0af515eca2765c.jpg',
      '38f176db36e57fed2b2aff43b7295e25.jpg',
      '41f267491032c24bbf9c9ccec7e5a691.jpg',
      'f476c829853e16534c9b857cffd1f128.jpg',
    ];
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    const imageUrl = `${baseUrl}/photos/${randomImage}`;

    // Fetch the background image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageArrayBuffer = await imageResponse.arrayBuffer();

    // Convert ArrayBuffer to base64 without Buffer (Edge Runtime compatible)
    const bytes = new Uint8Array(imageArrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const imageBase64 = btoa(binary);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '1080px',
            height: '1920px',
            backgroundImage: `url(data:image/jpeg;base64,${imageBase64})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Dark Quote Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(20, 20, 20, 0.95)',
              borderRadius: '40px',
              padding: '100px 80px',
              maxWidth: '880px',
              width: '100%',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
              alignItems: 'center',
            }}
          >
            {/* Reviewer Name - Top Center */}
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '30px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {reviewData.reviewerName}
            </div>

            {/* Star Rating */}
            <div
              style={{
                display: 'flex',
                fontSize: '56px',
                marginBottom: '50px',
                lineHeight: 1,
              }}
            >
              {'⭐'.repeat(reviewData.rating)}
            </div>

            {/* Opening Quote */}
            <div
              style={{
                display: 'flex',
                fontSize: '80px',
                color: '#aaa',
                lineHeight: 1,
                marginBottom: '20px',
              }}
            >
              &quot;
            </div>

            {/* Review Comment - White Text */}
            <div
              style={{
                display: 'flex',
                fontSize: '40px',
                lineHeight: '1.6',
                color: 'white',
                textAlign: 'center',
                fontWeight: '600',
                marginBottom: '20px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {displayComment}
            </div>

            {/* Closing Quote */}
            <div
              style={{
                display: 'flex',
                fontSize: '80px',
                color: '#aaa',
                lineHeight: 1,
                marginBottom: '50px',
              }}
            >
              &quot;
            </div>

            {/* Account Name & Profile URL */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '40px',
                borderTop: '2px solid rgba(255, 255, 255, 0.2)',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '12px',
                  fontFamily: 'serif',
                }}
              >
                {reviewData.businessName}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  color: '#bbb',
                  fontWeight: '500',
                  fontFamily: 'monospace',
                }}
              >
                onira.vercel.app/{reviewData.username}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (error) {
    console.error('Error generating review image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
