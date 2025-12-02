/**
 * Client-side helper for downloading and sharing server-generated images
 * Works with QR cards, review images, and any server-generated media
 */

export interface ShareImageOptions {
  url: string;
  filename: string;
  title?: string;
  text?: string;
  showInstructions?: boolean;
}

/**
 * Downloads and shares an image from a server endpoint
 * Automatically tries Web Share API first, falls back to download
 *
 * @param options - Configuration for image sharing
 * @returns Promise that resolves when sharing/download is complete
 */
export async function shareImage(options: ShareImageOptions): Promise<void> {
  const {
    url,
    filename,
    title = 'Share',
    text = 'Check this out!',
    showInstructions = true,
  } = options;

  try {
    // Fetch the real image from server
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the actual image blob with proper MIME type from server
    const blob = await response.blob();

    // Verify it's an actual image
    if (!blob.type.startsWith('image/')) {
      throw new Error(`Invalid image type: ${blob.type}`);
    }

    // Create File object with proper MIME type (from server response)
    const file = new File([blob], filename, {
      type: blob.type, // Use actual MIME type from server (image/png or image/jpeg)
      lastModified: Date.now(),
    });

    // Try Web Share API first (works on mobile for Instagram Stories)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title,
          text,
        });
        return; // Successfully shared
      } catch (err: any) {
        // User cancelled - not an error
        if (err.name === 'AbortError') {
          return;
        }
        console.error('Share failed:', err);
        // Fall through to download
      }
    }

    // Fallback: Download the image
    // Create object URL from the real image blob
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    }, 100);

    // Show helpful instructions
    if (showInstructions) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        setTimeout(() => {
          alert(
            `📱 Image saved!\n\nOpen your Gallery app and find "${filename}".\n\nTo share to Instagram:\n1. Open the image in Gallery\n2. Tap Share\n3. Select Instagram Stories`
          );
        }, 300);
      }
    }
  } catch (error) {
    console.error('Image share/download failed:', error);
    throw error;
  }
}

/**
 * Downloads an image without showing share dialog
 * @param url - Image URL
 * @param filename - Filename for download
 */
export async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }, 100);
}

/**
 * Generate QR card and share/download it
 * @param options - QR card generation options
 */
export interface QRCardOptions {
  profileUrl: string;
  username?: string;
  businessName?: string;
  avatarUrl?: string;
  template?: 'business' | 'minimal' | 'instagram' | 'dark' | 'neon';
  fgColor?: string;
  bgColor?: string;
}

export async function shareQRCard(options: QRCardOptions): Promise<void> {
  // Build API URL
  const apiUrl = '/api/qr-card';

  // Use POST for better data handling
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to generate QR card');
  }

  // Get the real PNG blob from server
  const blob = await response.blob();

  // Create File with proper MIME
  const file = new File([blob], 'qr-code.png', {
    type: 'image/png',
    lastModified: Date.now(),
  });

  // Try Web Share API
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'My QR Code',
        text: 'Scan to view my profile',
      });
      return;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Share failed:', err);
    }
  }

  // Fallback: Download
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'qr-code.png';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }, 100);

  // Show instructions
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    setTimeout(() => {
      alert(
        '📱 QR code saved to Gallery!\n\nTo share to Instagram:\n1. Open Gallery app\n2. Find "qr-code.png"\n3. Tap Share → Instagram Stories'
      );
    }, 300);
  }
}

/**
 * Download QR card without sharing
 */
export async function downloadQRCard(options: QRCardOptions): Promise<void> {
  const apiUrl = '/api/qr-card';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    throw new Error('Failed to generate QR card');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'qr-code.png';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }, 100);
}
