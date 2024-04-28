import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getAllArticles = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;
    const articles = await db.article.findMany();
    if (!articles) return null;
    return articles;
  } catch (error: any) {
    throw new Error(error);
  }
};
