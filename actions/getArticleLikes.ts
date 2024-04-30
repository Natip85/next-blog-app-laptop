"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getArticleLikes = async (articleId: string) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  try {
    const allArticleLikes = await db.like.findMany({
      where: {
        articleId: articleId,
      },
    });
    if (!allArticleLikes) {
      return null;
    }
    return allArticleLikes;
  } catch (error) {
    throw new Error();
    // return null;
  }
};
