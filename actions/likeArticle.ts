"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const likeArticle = async (userId: string, articleId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const existingLike = await db.like.findFirst({
      where: {
        userId: user.id,
        articleId: articleId,
      },
    });
    if (existingLike) {
      const usersLikedArticle = await db.like.update({
        where: {
          id: existingLike.id,
        },
        data: {
          likeCount: existingLike.likeCount + 1,
        },
      });
      return { success: usersLikedArticle.likeCount };
    } else {
      const newLike = await db.like.create({
        data: {
          userId: userId,
          articleId: articleId,
        },
      });

      return { success: newLike.likeCount };
    }
  } catch (error) {
    return { error: "Failed to like article" };
  }
};
