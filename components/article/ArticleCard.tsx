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
interface ArticleCardProps {
  articles: any;
}
const ArticleCard = ({ articles }: ArticleCardProps) => {
  console.log("These articles>>>", articles);

  return (
    <div className="flex flex-col gap-3">
      {articles.map((article: any) => (
        <Card
          key={article.id}
          className="border-0 border-b-[1px] shadow-none rounded-none"
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div>
                <Avatar>
                  <AvatarImage src={article?.user?.image} />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="font-medium">{article?.user?.name}</div>
              <div className="text-xs text-muted-foreground">
                · {moment(article.updatedAt).format("MMM D YYYY")}
              </div>
            </div>
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
                <div className="font-normal">{article?.previewSubtitle}</div>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between gap-3 p-0 py-5">
            <div className="flex items-center gap-3">
              <Badge variant={"secondary"} className="h-8">
                <span key={article.id}>{article.category.title}</span>
              </Badge>
              <span className="text-xs text-muted-foreground">
                {article.readTime} min read
              </span>
            </div>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"ghost"} size={"xs"}>
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
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center gap-3 text-sm">
                      Save article
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"ghost"} size={"xs"}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15.22 4.93a.42.42 0 0 1-.12.13h.01a.45.45 0 0 1-.29.08.52.52 0 0 1-.3-.13L12.5 3v7.07a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5V3.02l-2 2a.45.45 0 0 1-.57.04h-.02a.4.4 0 0 1-.16-.3.4.4 0 0 1 .1-.32l2.8-2.8a.5.5 0 0 1 .7 0l2.8 2.8a.42.42 0 0 1 .07.5zm-.1.14zm.88 2h1.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2H8a.5.5 0 0 1 .35.14c.1.1.15.22.15.35a.5.5 0 0 1-.15.35.5.5 0 0 1-.35.15H6.4c-.5 0-.9.4-.9.9v10.2a.9.9 0 0 0 .9.9h11.2c.5 0 .9-.4.9-.9V8.96c0-.5-.4-.9-.9-.9H16a.5.5 0 0 1 0-1z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center gap-3 text-sm">
                      Copy article link
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
                    <DropdownMenuItem>
                      <span className="hover:cursor-pointer">
                        Follow author
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ArticleCard;
