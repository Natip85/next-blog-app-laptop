"use client";

import { MoreHorizontal, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import moment from "moment";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { createFavorite } from "@/actions/createFavorite";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getUserFavorites } from "@/actions/getUserFavorites";
import { toggleFollowAuthor } from "@/actions/toggleFollowAuthor";
import { getUserFollowingList } from "@/actions/getUserFollowingList";

interface ArticleCardProps {
  articles: any;
}
const ArticleCard = ({ articles }: ArticleCardProps) => {
  const user = useCurrentUser();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [userFollowing, setUserFollowing] = useState<any[]>([]);

  useEffect(() => {
    getUserFavorites().then((favorites: any) => {
      setUserFavorites(favorites);
    });
  }, []);

  useEffect(() => {
    handleFollowState();
  }, []);
  async function handleFollowState() {
    getUserFollowingList().then((res: any) => {
      setUserFollowing(res);
    });
  }
  function handleSaveArticle(id: string, article: any) {
    setUserFavorites((prevFavorites) => {
      const index = prevFavorites.findIndex((fav) => fav.id === article.id);
      if (index === -1) {
        return [...prevFavorites, article];
      } else {
        const updatedFavorites = [...prevFavorites];
        updatedFavorites.splice(index, 1);
        return updatedFavorites;
      }
    });
    setError("");
    setSuccess("");
    startTransition(() => {
      if (!user?.id) return;
      createFavorite(user.id, id).then((res) => {
        if (res.error) {
          setError(res.error);
          toast.error(res.error);
        }
        if (res.success) {
          setSuccess(res.success);
          toast.success(res.success);
        }
        router.refresh();
      });
    });
  }
  function handleFollowAuthor(articleUserId: string) {
    startTransition(() => {
      if (!user?.id) return;
      toggleFollowAuthor(articleUserId, user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
          router.refresh();
        }
        if (res.success) {
          handleFollowState();
          toast.success(res.success);
          router.refresh();
        }
      });
    });
  }
  return (
    <div className="flex flex-col gap-3">
      <>
        {articles.map((article: any) => (
          <Card
            key={article.id}
            className="border-0 border-b-[1px] shadow-none rounded-none"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div>
                  <Link href={`/profile/${article.user.id}`}>
                    {" "}
                    <Avatar>
                      <AvatarImage src={article?.user?.image} />
                      <AvatarFallback className="bg-green-600">
                        <User2 />
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
                <div className="font-medium">
                  <Link href={`/profile/${article.user.id}`}>
                    {article?.user?.name}
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground">
                  · {moment(article.updatedAt).format("MMM D YYYY")}
                </div>
              </div>
              <div className="flex items-center justify-between gap-10">
                <div>
                  <Link
                    href={`/article-details/${article.id}`}
                    className="hover:cursor-pointer flex flex-col gap-3"
                  >
                    {(article?.editorData as any)?.blocks.map(
                      (item: any, index: number) => {
                        if (item.type === "header") {
                          const headerData = JSON.parse(item.data);
                          return (
                            <div
                              key={`${article.id}-header-${index}`}
                              className="font-bold text-xl"
                            >
                              {headerData.text}
                            </div>
                          );
                        }
                      }
                    )}
                    <div className="font-normal hidden md:block">
                      {article?.previewSubtitle}
                    </div>
                  </Link>
                </div>
                <div className="border">
                  <div className="relative size-16 sm:size-20 md:size-28 aspect-video flex justify-center items-center">
                    {article.image ? (
                      <Image
                        src={article?.image}
                        alt={"article-pic"}
                        fill
                        sizes="1"
                        className="w-full mx-auto"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src={"/sound-waves.png"}
                          alt="logo"
                          width={50}
                          height={50}
                        />
                        <span>Yarcone</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-3 p-0 py-5">
              <div className="flex items-center gap-3">
                <Badge variant={"secondary"} className="h-8 whitespace-nowrap">
                  <span key={article.id}>{article.category?.title}</span>
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {article.readTime} min read
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled={isPending}
                        variant={"ghost"}
                        size={"xs"}
                        onClick={() => handleSaveArticle(article.id, article)}
                      >
                        {userFavorites.some(
                          (fav: any) => fav.id === article.id
                        ) ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M7.5 3.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2h-9z"
                              fill="#000"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                              fill="#000"
                            ></path>
                          </svg>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex items-center gap-3 text-sm">
                        Save article
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <MoreHorizontal className="size-5" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="flex items-center gap-3 text-sm">
                            More
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <span className="hover:cursor-pointer">
                          Show less like this
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => handleFollowAuthor(article.userId)}
                      >
                        <span className="hover:cursor-pointer">
                          {userFollowing.some(
                            (follow: any) => follow.id === article.id
                          )
                            ? "Unfollow author"
                            : "Follow author"}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        ))}
      </>
    </div>
  );
};

export default ArticleCard;
