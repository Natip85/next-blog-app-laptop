"use server";
import db from "@/db/db";
import { currentUser } from "@/lib/auth";

export const getWhoToFollow = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }

  try {
    // Fetch IDs of users the current user is following
    const following = await db.follow.findMany({
      where: {
        followerId: user.id,
      },
    });
    const followingIds = following.map((follow) => follow.followedById);

    // Fetch users and include their published articles
    const usersWithPublishedArticleCount = await db.user.findMany({
      include: {
        articles: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    // Filter out current user and users that the current user is already following
    const suggestedUsers = usersWithPublishedArticleCount.filter(
      (currUser) =>
        currUser.id !== user.id && !followingIds.includes(currUser.id)
    );

    // Sort suggested users based on the number of published articles
    const suggestedUsersSorted = suggestedUsers.sort(
      (a, b) => b.articles.length - a.articles.length
    );

    // Return the top 3 suggested users
    const top3Users = suggestedUsersSorted.slice(0, 3);

    return top3Users;
  } catch (error) {
    return { error: "Error fetching suggested users", details: error };
  }
};
