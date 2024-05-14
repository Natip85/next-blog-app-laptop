"use client";
import { MailPlus, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArticleWithUser } from "./ArticleDetailsClient";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleFollowAuthor } from "@/actions/toggleFollowAuthor";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import Link from "next/link";

const ArticleFooter = ({ article }: ArticleWithUser) => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const followerIds = article.user.followers.map(
      (follower: any) => follower.followerId
    );

    setIsFollowing(followerIds.includes(user?.id));
  }, []);
  function handleFollowAuthor() {
    setIsFollowing(!isFollowing);
    startTransition(() => {
      if (!user?.id) return;
      toggleFollowAuthor(article.userId, user.id).then((res) => {
        if (res?.error) {
          toast.error(res.error);
        }
        if (res?.success) {
          toast.success(isFollowing ? "Unfollowed author" : "Following author");
        }
      });
    });
  }
  return (
    <div className="bg-gray-100 sm:p-20 p-5">
      <div className="sm:container sm:max-w-3xl flex flex-col gap-10">
        <Link href={`/profile/${article.user.id}`}>
          <Avatar className="size-20">
            <AvatarImage src={article?.user?.image} />
            <AvatarFallback className="bg-green-600">
              <User2 className="text-white size-10" />
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <div className="flex items-center justify-between">
            <Link href={`/profile/${article.user.id}`}>
              <h3 className="text-sm md:text-lg font-semibold">
                Written by {article.user.name}
              </h3>
            </Link>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleFollowAuthor}
                variant={isFollowing ? "outline" : "default"}
                className={cn(
                  "rounded-3xl",
                  isFollowing &&
                    "border border-green-600 text-green-600 hover:text-green-700"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>

              <Button className="rounded-full p-3">
                <MailPlus className="size-5" />
              </Button>
            </div>
          </div>

          <div className="text-sm">
            {article.user.followers.length} Followers
          </div>
        </div>
        <div className="text-sm">{article.user.bio}</div>
        <Separator className="my-5" />
      </div>
    </div>
  );
};

export default ArticleFooter;
