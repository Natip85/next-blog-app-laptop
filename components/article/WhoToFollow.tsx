"use client";

import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { toggleFollowAuthor } from "@/actions/toggleFollowAuthor";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WhoToFollowProps {
  articles: any;
}
const WhoToFollow = ({ articles }: WhoToFollowProps) => {
  console.log({ articles });
  const router = useRouter();
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  function handleFollowAuthor(id: string) {
    startTransition(() => {
      if (!user?.id) return;
      toggleFollowAuthor(id, user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        }
        if (res.success) {
          toast.success(res.success);
          router.refresh();
        }
      });
    });
  }
  return (
    <div className="flex flex-col gap-3">
      {articles.map((article: any) => (
        <Card key={article.id} className="w-full border-0 shadow-none">
          <CardContent className="w-full p-0 flex items-center justify-between gap-3">
            <Link href={`#`}>
              <div className="flex items-center justify-between gap-2">
                <Avatar className="size-8 self-start">
                  <AvatarImage src={article.image} />
                  <AvatarFallback>
                    <User2 className="bg-green-700 rounded-full size-8" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 flex flex-col">
                  <span className="font-semibold">{article.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {article.bio}
                  </span>
                </div>
              </div>
            </Link>
            <div>
              <Button
                variant={"outline"}
                className="rounded-3xl"
                onClick={() => handleFollowAuthor(article.id)}
              >
                Follow
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <div>
        <Button
          asChild
          variant={"link"}
          size={"xs"}
          className="p-0 text-green-600 hover:text-black hover:no-underline"
        >
          <Link href={"#"} className="text-xs">
            See more suggestions
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default WhoToFollow;
