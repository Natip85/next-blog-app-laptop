"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function AuthNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/article/")) return;

  return <nav>{children}</nav>;
}
