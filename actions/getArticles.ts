import db from "@/db/db";

export const getArticles = async () => {
  try {
    const articles = await db.article.findMany();

    if (!articles) return null;

    const publishedArticles = articles.filter((article) => article.isPublished);
    const draftArticles = articles.filter((article) => !article.isPublished);
    const allArticles = { publishedArticles, draftArticles };
    return allArticles;
  } catch (error: any) {
    throw new Error(error);
  }
};
