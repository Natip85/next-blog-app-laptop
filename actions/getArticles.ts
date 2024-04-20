import db from "@/db/db";

export const getArticles = async () => {
  try {
    const articles = await db.article.findMany();

    if (!articles) return null;

    return articles;
  } catch (error: any) {
    throw new Error(error);
  }
};
