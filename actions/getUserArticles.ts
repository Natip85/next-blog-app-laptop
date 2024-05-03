import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getUserArticles = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;
    const articles = await db.article.findMany({
      where: { userId: user.id },
      include: { category: true },
    });
    if (!articles) return null;
    return articles;
  } catch (error: any) {
    return { error: error.message };
  }
};
