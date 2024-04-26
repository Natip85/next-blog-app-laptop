"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const deleteArticle = async (articleId: string | undefined) => {
  try {
    if (!articleId) return { error: "No article id found" };
    const user = currentUser();
    if (!user) return { error: "No user found" };
    const existingArticle = await db.article.findFirst({
      where: { id: articleId },
    });
    if (!existingArticle) return { error: "No article found!" };
    if (existingArticle.categoryId === null) {
      await db.article.delete({
        where: { id: articleId },
      });
      return { success: "Article deleted" };
    } else {
      const existingCategory = await db.category.findFirst({
        where: { id: existingArticle.categoryId },
      });
      if (existingCategory) {
        await db.category.delete({
          where: { id: existingCategory.id },
        });
        return { success: "Article deleted" };
      } else {
        return { error: "Associated category not found" };
      }
    }
  } catch (error: any) {
    return { error: error.message };
  }
};
