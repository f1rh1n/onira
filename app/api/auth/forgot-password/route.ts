import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, generateOTP, getOTPExpiryTime } from "@/lib/resend";
import { getPasswordResetEmailHTML, getPasswordResetEmailText } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive a password reset code." },
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiryTime();

    console.log("=================================");
    console.log(`Password Reset OTP for ${email}: ${otp}`);
    console.log(`Expires at: ${expiresAt.toISOString()}`);
    console.log("=================================");

    // Delete any existing password reset requests for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Create new password reset request
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        email: user.email,
        otp,
        expiresAt,
      },
    });

    // Send email with OTP
    try {
      const result = await resend.emails.send({
        from: 'Onira <onboarding@resend.dev>', // Update this with your verified domain
        to: email,
        subject: 'Password Reset OTP - Onira',
        html: getPasswordResetEmailHTML(otp),
        text: getPasswordResetEmailText(otp),
      });
      console.log("Email sent successfully:", result);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the request - user can still use the OTP from console in development
      console.log("⚠️  Email failed to send, but OTP is logged above for testing");
    }

    return NextResponse.json(
      {
        message: "If an account exists with this email, you will receive a password reset code.",
        // Include OTP in development mode for testing
        ...(process.env.NODE_ENV === 'development' && { otp })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
