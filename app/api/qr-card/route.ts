import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import QRCode from 'qrcode';
import sharp from 'sharp';

// Template configurations
const templates = {
  business: {
    bgColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#9333ea',
    borderColor: '#e5e7eb',
  },
  minimal: {
    bgColor: '#f9fafb',
    textColor: '#111827',
    accentColor: '#6366f1',
    borderColor: '#d1d5db',
  },
  instagram: {
    bgColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#e1306c',
    borderColor: '#dbdbdb',
  },
  dark: {
    bgColor: '#1f2937',
    textColor: '#f9fafb',
    accentColor: '#8b5cf6',
    borderColor: '#374151',
  },
  neon: {
    bgColor: '#0f172a',
    textColor: '#f0abfc',
    accentColor: '#c026d3',
    borderColor: '#a855f7',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      profileUrl,
      username = 'User',
      businessName,
      avatarUrl,
      template = 'business',
      fgColor,
      bgColor,
    } = body;

    if (!profileUrl) {
      return NextResponse.json(
        { error: 'profileUrl is required' },
        { status: 400 }
      );
    }

    // Get template colors
    const templateConfig = templates[template as keyof typeof templates] || templates.business;
    const finalBgColor = bgColor || templateConfig.bgColor;
    const finalTextColor = templateConfig.textColor;
    const finalAccentColor = fgColor || templateConfig.accentColor;

    // Canvas dimensions (high quality for mobile)
    const width = 1200;
    const height = 1800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = finalBgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw border if not dark/neon template
    if (template !== 'dark' && template !== 'neon') {
      ctx.strokeStyle = templateConfig.borderColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, width - 80, height - 80);
    }

    // Generate QR code
    const qrSize = 700;
    const qrDataUrl = await QRCode.toDataURL(profileUrl, {
      width: qrSize,
      margin: 2,
      color: {
        dark: finalAccentColor,
        light: finalBgColor,
      },
    });

    // Load and draw QR code
    const qrImage = await loadImage(qrDataUrl);
    const qrX = (width - qrSize) / 2;
    const qrY = 400;
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

    // Draw avatar if provided
    if (avatarUrl) {
      try {
        // Handle both data URLs and regular URLs
        let avatarImage;
        if (avatarUrl.startsWith('data:')) {
          avatarImage = await loadImage(avatarUrl);
        } else {
          // For external URLs, fetch with headers
          const response = await fetch(avatarUrl);
          const buffer = await response.arrayBuffer();
          avatarImage = await loadImage(Buffer.from(buffer));
        }

        const avatarSize = 200;
        const avatarX = (width - avatarSize) / 2;
        const avatarY = 150;

        // Draw circular avatar with border
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // Avatar border
        ctx.strokeStyle = finalAccentColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.stroke();
      } catch (err) {
        console.error('Failed to load avatar:', err);
        // Continue without avatar
      }
    }

    // Draw text
    ctx.fillStyle = finalTextColor;
    ctx.textAlign = 'center';

    // Username
    ctx.font = 'bold 80px Arial, sans-serif';
    ctx.fillText(username, width / 2, 1250);

    // Business name (if provided)
    if (businessName) {
      ctx.font = '60px Arial, sans-serif';
      ctx.fillStyle = finalAccentColor;
      ctx.fillText(businessName, width / 2, 1350);
    }

    // Scan instruction
    ctx.font = '50px Arial, sans-serif';
    ctx.fillStyle = finalTextColor;
    const opacity = template === 'dark' || template === 'neon' ? 0.7 : 0.6;
    ctx.globalAlpha = opacity;
    ctx.fillText('Scan to view my profile', width / 2, 1450);
    ctx.globalAlpha = 1;

    // Decorative accent line
    const lineWidth = 200;
    const lineX = (width - lineWidth) / 2;
    const lineY = 1500;
    ctx.fillStyle = finalAccentColor;
    ctx.fillRect(lineX, lineY, lineWidth, 12);

    // Convert canvas to PNG buffer using sharp for optimization
    const pngBuffer = canvas.toBuffer('image/png');

    // Optimize with sharp (compress, ensure proper format)
    const optimizedBuffer = await sharp(pngBuffer)
      .png({ quality: 95, compressionLevel: 6 })
      .toBuffer();

    // Return as image with proper MIME type
    return new NextResponse(optimizedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="qr-card.png"',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('QR Card generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR card', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Support GET requests for simple use cases
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const profileUrl = searchParams.get('url');
  const username = searchParams.get('username') || 'User';
  const businessName = searchParams.get('businessName') || undefined;
  const template = searchParams.get('template') || 'business';
  const avatarUrl = searchParams.get('avatarUrl') || undefined;

  if (!profileUrl) {
    return NextResponse.json(
      { error: 'url parameter is required' },
      { status: 400 }
    );
  }

  // Convert GET to POST internally
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({
        profileUrl,
        username,
        businessName,
        template,
        avatarUrl,
      }),
    })
  );
}
