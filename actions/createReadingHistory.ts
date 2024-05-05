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

    if (userReadingHistory.length >= 20) {
      const entriesToRemove = userReadingHistory.length - 19;
      const oldestEntries = userReadingHistory.slice(-entriesToRemove);

      const deletedHistory = await db.readingHistory.deleteMany({
        where: {
          id: {
            in: oldestEntries.map((entry) => entry.id),
          },
        },
      });
      console.log("deletedHistory>>", deletedHistory);

      return deletedHistory;
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
      console.log("creytaed history");

      return { success: "added to history" };
    } else {
      await db.readingHistory.update({
        where: {
          id: existingReadingHistory.id,
        },
        data: {
          lastVisitedAt: new Date(),
        },
      });
      console.log("updated history>>>");

      return { success: "Updated reading history" };
    }
  } catch (error) {
    return { error: "Something went wrong saving reading history" };
  }
};
