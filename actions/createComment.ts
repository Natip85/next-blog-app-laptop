"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const createComment = async (
  description: string | undefined,
  userId: string,
  articleId: string
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }

  if (!description) {
    return { error: "A response with at least 1 character is required" };
  }
  if (!articleId) {
    return { error: "Something went wrong: No article id" };
  }
  // const existingArticle = await db.article.findFirst({
  //   where: { id: articleId },
  // });
  // if (existingArticle?.userId === userId) {
  //   return { error: "You cannot comment on your own article" };
  // }
  await db.comment.create({
    data: {
      description: description,
      userId: userId,
      articleId: articleId,
    },
  });

  return { success: "Your response was successfully added!" };
};
