"use server";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const createReadingHistory = async (
  articleId: string,
  userId: string
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const userReadingHistory = await db.readingHistory.findMany({
      where: { userId: user.id },
      orderBy: { lastVisitedAt: "desc" },
    });
    if (!userReadingHistory) return { error: "No read articles yet" };
    if (userReadingHistory.length >= 20) {
      const entriesToRemove = userReadingHistory.length - 19;
      const oldestEntries = userReadingHistory.slice(-entriesToRemove);

      await db.readingHistory.deleteMany({
        where: {
          id: {
            in: oldestEntries.map((entry) => entry.id),
          },
        },
      });

      const existingReadingHistory = await db.readingHistory.findFirst({
        where: {
          userId: user.id,
          articleId: articleId,
        },
      });

      if (!existingReadingHistory) {
        await db.readingHistory.create({
          data: {
            userId: userId,
            articleId: articleId,
            lastVisitedAt: new Date(),
          },
        });
        return { success: "Created new history entry" };
      } else {
        await db.readingHistory.update({
          where: {
            id: existingReadingHistory.id,
          },
          data: {
            lastVisitedAt: new Date(),
          },
        });
        return { success: "Updated existing history entry" };
      }
    }

    const existingReadingHistory = await db.readingHistory.findFirst({
      where: {
        userId: user.id,
        articleId: articleId,
      },
    });

    if (!existingReadingHistory) {
      await db.readingHistory.create({
        data: {
          userId: userId,
          articleId: articleId,
          lastVisitedAt: new Date(),
        },
      });
      return { success: "Created new history entry" };
    } else {
      await db.readingHistory.update({
        where: {
          id: existingReadingHistory.id,
        },
        data: {
          lastVisitedAt: new Date(),
        },
      });
      return { success: "Updated existing history entry" };
    }
  } catch (error) {
    return { error: "Something went wrong saving reading history" };
  }
};
