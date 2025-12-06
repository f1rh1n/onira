import { Resend } from 'resend';

// Use placeholder during build, real key at runtime
const apiKey = process.env.RESEND_API_KEY || 'build-time-placeholder';

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(apiKey);

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPExpiryTime(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10); // OTP valid for 10 minutes
  return now;
}
