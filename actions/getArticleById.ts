"use server";
import db from "@/db/db";
import { ObjectId } from "mongodb";

export const getArticleById = async (articleId: string) => {
  const newArticleId = new ObjectId().toHexString();
  try {
    const article = await db.article.findUnique({
      where: {
        id: articleId === "new" ? newArticleId : articleId,
      },
      include: {
        user: true,
        comments: true,
        favorite: true,
      },
    });

    if (!article) return null;

    return article;
  } catch (error: any) {
    throw new Error(error);
  }
};
