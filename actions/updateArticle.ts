// import * as z from "zod";
// import db from "@/db/db";
// import { currentUser } from "@/lib/auth";

// export const updateArticle = async (
//   values: any,
//   asPublished: boolean,
//   topic: string | undefined
// ) => {
//   try {
//     const user = await currentUser();
//     if (!user) {
//       return { error: "No user found" };
//     }

//     await db.article.update({
//       where: { id },
//       data: {
//         editorData: { ...values },
//         readTime: 1,
//         userId: user.id,
//         categoryId: "6615237c3d24caf8d6534449",
//         isPublished: asPublished,
//       },
//     });

//     return { success: "Article updated successfully" };
//   } catch (error) {
//     return { error: "Failed to update article" };
//   }
// };
