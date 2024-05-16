import "../globals.css";
import UserButton from "@/components/auth/UserButton";
import { Bell, Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { AuthNav } from "@/components/nav/AuthNav";
import Image from "next/image";
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthNav>
        <nav className="flex items-center justify-between gap-5 px-2 md:px-10 py-2 md:py-4 border-b-[1.5px]">
          <div className="flex flex-1 gap-5">
            <Link href={"/feed"} className="flex items-center gap-2">
              <div>
                <Image
                  src={"/sound-waves.png"}
                  alt="logo"
                  width={50}
                  height={50}
                />
              </div>
              <span className="hidden  sm:block sm:text-xl md:text-3xl font-semibold font-mono">
                Yarcone
              </span>
            </Link>
            <div className="flex items-center border rounded-2xl p-1 bg-gray-50">
              <span>
                <Search className="size-5" />
              </span>
              <Input
                placeholder="Search"
                className="h-[30px] border-none focus-visible:ring-transparent bg-gray-50 focus:bg-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span>
              <Link
                href={"/article/new"}
                className="flex items-center gap-2 text-sm"
              >
                <Edit className="size-5" strokeWidth={1} /> Write
              </Link>
            </span>
            <span>
              <Bell className="size-5" strokeWidth={1} />
            </span>
          </div>
          <UserButton />
        </nav>
      </AuthNav>
      <Toaster />
      {children}
    </div>
  );
}
