import { FacebookAdsApi, InstagramApi } from "facebook-nodejs-business-sdk";
import { prisma } from "./prisma";

export interface InstagramCredentials {
  accessToken: string;
  userId: string;
}

export async function getInstagramCredentials(): Promise<InstagramCredentials | null> {
  const auth = await prisma.instagramAuth.findUnique({
    where: { id: "instagram" },
  });

  if (!auth || new Date() >= auth.expiresAt) {
    return null;
  }

  return {
    accessToken: auth.accessToken,
    userId: auth.userId,
  };
}

export async function createInstagramPost(
  credentials: InstagramCredentials,
  mediaUrl: string,
  caption: string
): Promise<string> {
  const api = FacebookAdsApi.init(credentials.accessToken);
  const igApi = new InstagramApi(credentials.userId);

  // First, create a media container
  const mediaContainer = await igApi.createMediaContainer({
    image_url: mediaUrl,
    caption: caption,
  });

  // Then publish the container
  const publishResult = await igApi.publishMedia({
    creation_id: mediaContainer.id,
  });

  return publishResult.id;
}

export async function scheduleInstagramPost(
  mediaUrl: string,
  caption: string,
  scheduleFor: Date
): Promise<void> {
  await prisma.instagramPost.create({
    data: {
      mediaUrl,
      caption,
      scheduleFor,
      status: "PENDING",
    },
  });
}

export async function processScheduledPosts(): Promise<void> {
  const now = new Date();
  const pendingPosts = await prisma.instagramPost.findMany({
    where: {
      status: "PENDING",
      scheduleFor: {
        lte: now,
      },
    },
  });

  const credentials = await getInstagramCredentials();
  if (!credentials) {
    throw new Error("Instagram credentials not found or expired");
  }

  for (const post of pendingPosts) {
    try {
      await createInstagramPost(credentials, post.mediaUrl, post.caption);
      await prisma.instagramPost.update({
        where: { id: post.id },
        data: { status: "POSTED" },
      });
    } catch (error) {
      await prisma.instagramPost.update({
        where: { id: post.id },
        data: {
          status: "FAILED",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
}
