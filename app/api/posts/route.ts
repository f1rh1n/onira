import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user?.profile) {
      return NextResponse.json(
        { error: "Profile not found. Please create a profile first." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, images, category, tags, isPublished } = body;

    const post = await prisma.post.create({
      data: {
        profileId: user.profile.id,
        title,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        images: images || null,
        category: category || null,
        tags: tags || null,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
