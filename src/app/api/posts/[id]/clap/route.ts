
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        clapCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error clapping post:", error);
    return NextResponse.json({ error: "Failed to clap post" }, { status: 500 });
  }
}
