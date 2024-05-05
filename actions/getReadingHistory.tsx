"use server";

import { currentUser } from "@/lib/auth";
import db from "@/db/db";

export const getReadingHistory = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const readingHistory = await db.readingHistory.findMany({
      where: { userId: user.id },
      include: {
        user: true,
        article: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!readingHistory) {
      return { error: "Start reading articles to build a history" };
    }

    return readingHistory;
  } catch (error) {
    return { error: "Something went wrong getting art history" };
  }
};

export const deleteAllHistory = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const userReadingHistory = await db.readingHistory.findMany({
      where: { userId: user.id },
    });

    if (!userReadingHistory) {
      return { error: "No reading history to delete" };
    }

    await db.readingHistory.deleteMany({
      where: { userId: user.id },
    });

    return { success: "All reading history deleted successfully" };
  } catch (error) {
    return { error: "Something went wrong deleting reading history" };
  }
};
