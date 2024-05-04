"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const createFavorite = async (userId: string, articleId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return { error: "Article not found" };
    }
    const existingFavorite = await db.favorite.findFirst({
      where: {
        userId,
        articleId,
      },
    });
    if (existingFavorite) {
      await db.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      return { success: "Article removed from favorites" };
    } else {
      await db.favorite.create({
        data: {
          user: { connect: { id: userId } },
          article: { connect: { id: articleId } },
        },
      });

      return { success: "Article added to favorites" };
    }
  } catch (error) {
    return { error: "Somethng went wrong!" };
  }
};
