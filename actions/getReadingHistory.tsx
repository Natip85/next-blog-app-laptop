"use server";

import { currentUser } from "@/lib/auth";
import db from "@/db/db";

export const getReadingHistory = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  const readingHistory = await db.readingHistory.findMany({
    where: { userId: user.id },
  });
  if (!readingHistory) {
    return { error: "Start reading articles to build a history" };
  }
  return readingHistory;
};
