import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt-auth";

export async function GET(request: NextRequest) {
  try {
    // Try JWT authentication first (for mobile)
    const jwtUser = verifyJWT(request);

    // Fallback to NextAuth session (for web)
    const session = await getServerSession(authOptions);

    // Get user ID from either source
    const userId = jwtUser?.id || (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
      include: {
        _count: {
          select: {
            reviews: true,
            posts: true,
          },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
