"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getUserFollowingList = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const followingList = await db.follow.findMany({
      where: {
        followerId: user.id,
      },
    });

    const authorIds = followingList.map((follow) => follow.followedById);

    const articles = await db.article.findMany({
      where: {
        userId: {
          in: authorIds,
        },
      },
      include: { user: true },
    });

    return articles;
  } catch (error) {
    return { error: "Error fetching follow list", details: error };
  }
};
