"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return;

  return (
    <nav className="container max-w-6xl flex justify-between items-stretch">
      {children}
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "hover:bg-secondary focus-visible:bg-secondary text-sm flex items-center p-5 min-w-fit",
        pathname === props.href && "text-amber-400 bg-secondary"
      )}
    />
  );
}
