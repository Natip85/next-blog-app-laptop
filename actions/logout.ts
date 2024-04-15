"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  //do server actions before logout if you want here
  await signOut();
};
