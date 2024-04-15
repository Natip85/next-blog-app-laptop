"use client";

import { logout } from "@/actions/logout";
// import { auth } from "@/auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { signOut } from "next-auth/react";

export default function FeedPage() {
  // const session = await auth();
  const user = useCurrentUser();
  const onClick = () => {
    // signOut();
    logout();
  };
  return <div>feed page</div>;
}
