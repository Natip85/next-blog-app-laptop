"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getUserFavorites = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }

  try {
    const favorites = await db.favorite.findMany({
      where: {
        userId: user.id,
      },
    });
    if (!favorites) {
      return { error: "No favorites yet" };
    }
    const favoriteArticleIds = favorites.map((favorite) => favorite.articleId);

    const favoriteArticles = await db.article.findMany({
      where: {
        id: {
          in: favoriteArticleIds,
        },
      },
      include: { user: true },
    });
    return favoriteArticles;
  } catch (error) {
    return { error: "Something went wrong getting my favorites" };
  }
};
