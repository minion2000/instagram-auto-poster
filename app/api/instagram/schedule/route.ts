import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const scheduleSchema = z.object({
  mediaUrl: z.string().url(),
  caption: z.string(),
  scheduleFor: z.string().datetime(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaUrl, caption, scheduleFor } = scheduleSchema.parse(body);

    const post = await prisma.instagramPost.create({
      data: {
        mediaUrl,
        caption,
        scheduleFor: new Date(scheduleFor),
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to schedule Instagram post:", error);
    return NextResponse.json(
      { success: false, error: "投稿のスケジュールに失敗しました" },
      { status: 500 }
    );
  }
}
