import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPExpiryTime(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10); // OTP valid for 10 minutes
  return now;
}
