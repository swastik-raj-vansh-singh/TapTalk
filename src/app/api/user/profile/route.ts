
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!user) {
      // Create user if doesn't exist
      const clerkUser = await currentUser();
      if (clerkUser) {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            name: clerkUser.firstName || clerkUser.username || "User",
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            profilePicUrl: clerkUser.imageUrl,
          },
          include: {
            _count: {
              select: { posts: true },
            },
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate total claps
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      select: { clapCount: true },
    });

    const totalClaps = posts.reduce((sum, post) => sum + post.clapCount, 0);

    return NextResponse.json({
      ...user,
      totalClaps,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { name, bio },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    // Calculate total claps
    const posts = await prisma.post.findMany({
      where: { userId: updatedUser.id },
      select: { clapCount: true },
    });

    const totalClaps = posts.reduce((sum, post) => sum + post.clapCount, 0);

    return NextResponse.json({
      ...updatedUser,
      totalClaps,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
