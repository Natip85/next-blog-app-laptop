"use server";
import db from "@/db/db";

export const toggleFollowAuthor = async (
  articleUserId: string,
  userId: string
) => {
  try {
    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: userId,
        followedById: articleUserId,
      },
    });

    if (existingFollow) {
      await db.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      return { success: "Unfollowed author" };
    } else {
      await db.follow.create({
        data: {
          followerId: userId,
          followedById: articleUserId,
        },
      });
      return { success: "Followed author" };
    }
  } catch (error) {
    return { error: "Couldn't follow author", details: error };
  }
};
