"use client";

import {
  HelpCircle,
  Library,
  ListMinus,
  LogOut,
  Settings,
  User2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { Separator } from "../ui/separator";

const UserButton = () => {
  const user = useCurrentUser();

  const maskEmail = (email: string): string => {
    const [username, domain] = email ? email.split("@") : ["email not avaible"];
    const maskedUsername =
      username.slice(0, 2) + "*".repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-10">
          <AvatarImage src={user?.image} />
          <AvatarFallback className="bg-amber-500">
            <User2 className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[250px] flex flex-col p-2 gap-2"
      >
        <DropdownMenuItem className="gap-2 hover:cursor-pointer" asChild>
          <Link href={"/profile"}>
            <User2 className="size-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 hover:cursor-pointer" asChild>
          <Link href={"/stories"}>
            <ListMinus className="size-4" /> Stories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 hover:cursor-pointer" asChild>
          <Link href={"/library"}>
            <Library className="size-4" /> Library
          </Link>
        </DropdownMenuItem>
        <Separator className="my-3" />
        <DropdownMenuItem className="gap-2 hover:cursor-pointer" asChild>
          <Link href={"#"}>
            <Settings className="size-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 hover:cursor-pointer" asChild>
          <Link href={"#"}>
            <HelpCircle className="size-4" /> Help
          </Link>
        </DropdownMenuItem>
        <Separator className="my-3" />
        <LogoutButton>
          <DropdownMenuItem className="hover:cursor-pointer flex flex-col items-start">
            <div className="flex items-center mb-3">
              <LogOut className="size-4 mr-2" />
              Sign out
            </div>
            <div className="text-xs">
              {maskEmail(user?.email || "email not available")}
            </div>
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
