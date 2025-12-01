import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { resetId, newPassword } = await request.json();

    if (!resetId || !newPassword) {
      return NextResponse.json(
        { error: "Reset ID and new password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find verified password reset request
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { id: resetId },
    });

    if (!resetRequest || !resetRequest.verified) {
      return NextResponse.json(
        { error: "Invalid or unverified reset request" },
        { status: 400 }
      );
    }

    // Check if reset request has expired
    if (new Date() > resetRequest.expiresAt) {
      return NextResponse.json(
        { error: "Reset request has expired. Please start over." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword },
    });

    // Delete all password reset requests for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: resetRequest.userId },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
