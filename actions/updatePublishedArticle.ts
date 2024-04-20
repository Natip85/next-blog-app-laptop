"use server";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const updatePublishedArticle = async (
  articleId: string,
  values: any
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }

  const existingArticle = await db.article.findUnique({
    where: { id: articleId },
  });
  if (!existingArticle) return { error: "No article found" };

  const updatedArticle = await db.article.update({
    where: { id: existingArticle.id },
    data: {
      editorData: { ...values },
    },
  });
  return { success: updatedArticle };
};
