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
      await db.like.update({
        where: {
          id: existingLike.id,
        },
        data: {
          likeCount: existingLike.likeCount + 1,
        },
      });
      return { success: "liked" };
    } else {
      await db.like.create({
        data: {
          userId: userId,
          articleId: articleId,
        },
      });

      return { success: "liked!" };
    }
  } catch (error) {
    return { error: "Failed to like article" };
  }
};
