"use server";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const createArticle = async (
  values: any,
  asPublished: boolean,
  topic: string | undefined,
  previewSubtitle: string | undefined,
  image: string | undefined
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }

  if (!topic) {
    const article = await db.article.create({
      data: {
        editorData: { ...values },
        readTime: 1,
        userId: user.id,
        categoryId: undefined,
        isPublished: asPublished,
        previewSubtitle: previewSubtitle,
        image: image,
      },
    });
    return { success: article };
  } else {
    const newCategory = await db.category.create({
      data: { title: topic },
    });

    if (!newCategory) {
      return { error: "No category found" };
    }
    const article = await db.article.create({
      data: {
        editorData: { ...values },
        readTime: 1,
        userId: user.id,
        categoryId: newCategory.id,
        isPublished: asPublished,
        previewSubtitle: previewSubtitle,
        image: image,
      },
    });
    return { success: article };
  }
};
