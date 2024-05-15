"use server";

import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getUserById = async (userId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  try {
    const foundUser = await db.user.findUnique({
      where: { id: userId },
      include: { followers: true, following: true },
    });

    if (!foundUser) return null;
    const followingIds = foundUser.following.map(
      (follow) => follow.followedById
    );

    const followingUsers = await db.user.findMany({
      where: {
        id: { in: followingIds },
      },
    });

    return { foundUser, followingUsers };
  } catch (error) {
    return { error: "Error finding user" };
  }
};
