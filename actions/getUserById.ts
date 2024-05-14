"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getUserById = async (userId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const user = db.user.findUnique({
      where: { id: userId },
      include: { followers: true },
    });
    if (!user) return null;
    return user;
  } catch (error) {
    return { error: "Error finding user" };
  }
};
