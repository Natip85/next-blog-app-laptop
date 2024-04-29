"use server";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getArticleComments = async (articleId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }

  if (!articleId) return { error: "No article found" };

  const comments = await db.comment.findMany({
    where: { articleId: articleId },
    include: { user: true },
  });

  return comments;
};
