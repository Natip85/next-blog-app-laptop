"use server";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getAllArticles = async (page: number) => {
  try {
    const perPage = 3;
    const user = await currentUser();
    if (!user) return null;
    const offset = (page - 1) * perPage;
    const articles = await db.article.findMany({
      where: { isPublished: true },
      skip: offset,
      take: perPage,
      include: { user: true, category: true },
    });
    return articles;
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return null;
  }
};
