//this is basically user detials for server components
import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user.role;
};

export const testdata = {
  title: "Example Article",
  description: {
    time: 1712410603214,
    blocks: [
      {
        id: "cduFYLWt3Q",
        type: "header",
        data: {
          text: "heding",
          level: 1,
          alignment: "left",
        },
      },
      {
        id: "DQlBSTO3ly",
        type: "paragraph",
        data: {
          text: "test desxcrip",
          alignment: "left",
        },
      },
    ],
    version: "2.29.1",
  },
  image: "https://example.com/image.jpg",
  views: 100,
  readTime: 10,
  categoryId: "category_id_here",
  userId: "user_id_here",
  comments: [
    {
      text: "This is a comment on the example article.",
      userId: "commenter_user_id_here",
    },
  ],
};
