import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resend } from "@/lib/resend";
import { getWelcomeEmailHTML, getWelcomeEmailText } from "@/lib/email-templates";

// Email validation function
function isValidEmail(email: string): boolean {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Check for common disposable email domains
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', 'mailinator.com',
    '10minutemail.com', 'throwaway.email', 'trashmail.com'
  ];

  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.includes(domain)) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Try to send welcome email first to verify email exists
    console.log(`[REGISTER] Attempting to send welcome email to: ${email}`);
    try {
      const emailResult = await resend.emails.send({
        from: "Onira <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Onira! 🎉",
        html: getWelcomeEmailHTML(username),
        text: getWelcomeEmailText(username),
      });
      console.log(`[REGISTER] Email sent successfully! Email ID: ${emailResult.data?.id}`);
      console.log(`[REGISTER] Full email result:`, JSON.stringify(emailResult, null, 2));
    } catch (emailError: any) {
      console.error("[REGISTER] Email sending error:", emailError);
      console.error("[REGISTER] Error details:", JSON.stringify(emailError, null, 2));
      console.error("[REGISTER] Error message:", emailError.message);
      console.error("[REGISTER] Error name:", emailError.name);

      // Check if it's a delivery error (invalid email)
      if (emailError.message?.includes('invalid') ||
          emailError.message?.includes('not found') ||
          emailError.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: "Email address does not exist. Please provide a valid email address." },
          { status: 400 }
        );
      }

      // For other email errors, log but continue (don't block registration)
      console.warn("[REGISTER] Failed to send welcome email, but continuing with registration");
    }

    // Create user only after email validation
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
