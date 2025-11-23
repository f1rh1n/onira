import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: {
        userId: (session.user as any).id,
      },
      include: {
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ reviews: [] });
    }

    return NextResponse.json({ reviews: profile.reviews });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
