import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt-auth";

export async function GET(request: NextRequest) {
  try {
    // Try JWT authentication first (for mobile)
    const jwtUser = verifyJWT(request);
    let userEmail: string | null = null;

    if (jwtUser) {
      userEmail = jwtUser.email;
    } else {
      // Fall back to NextAuth session (for web)
      const session = await getServerSession(authOptions);
      userEmail = session?.user?.email || null;
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        profile: {
          include: {
            posts: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!user?.profile) {
      return NextResponse.json({ posts: [] });
    }

    return NextResponse.json({ posts: user.profile.posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
