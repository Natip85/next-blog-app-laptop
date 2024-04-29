import db from "@/db/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const CurrUser = await currentUser();
    if (!params.userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }
    if (!CurrUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await db.user.delete({
      where: {
        id: params.userId,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log("Error at /api/auth/delete/userId DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
