
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, imageUrl } = await request.json();

    if (!text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Ensure user exists in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create user if doesn't exist
      const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });
      
      if (clerkUser.ok) {
        const userData = await clerkUser.json();
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            name: userData.first_name || userData.username || "User",
            email: userData.email_addresses[0]?.email_address || "",
            profilePicUrl: userData.image_url,
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        text,
        imageUrl,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicUrl: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
