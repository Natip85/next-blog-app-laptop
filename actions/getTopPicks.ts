import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getTopPicks = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const topPicks = await db.article.findMany({
      include: {
        likes: true,
        user: true,
      },
    });

    const articlesWithLikesCount = topPicks.map((article) => ({
      ...article,
      totalLikesCount: article.likes.reduce(
        (total, like) => total + like.likeCount,
        0
      ),
    }));

    const sortedArticles = articlesWithLikesCount.sort(
      (a, b) => b.totalLikesCount - a.totalLikesCount
    );

    const top5Articles = sortedArticles.slice(0, 5);

    return top5Articles;
  } catch (error) {
    return { error: "Error fetching top picks", details: error };
  }
};
