import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
export async function POST(req: Request) {
  const user = await currentUser();

  if (!user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const { imageKeys } = await req.json();

  try {
    if (!Array.isArray(imageKeys)) {
      return new NextResponse("Bad Request: imageKeys should be an array", {
        status: 400,
      });
    }

    for (const key of imageKeys) {
      const res = await utapi.deleteFiles(key);
      return NextResponse.json(res);
    }
  } catch (error) {
    console.log("error at uploadthing/delete", error);
    return new NextResponse("Internal Server Error/ delete", { status: 500 });
  }
}
