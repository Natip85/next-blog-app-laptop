"use client";

import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

interface TopPicksCardProps {
  articles: any;
}
const TopPicksCard = ({ articles }: TopPicksCardProps) => {
  return (
    <div className="flex flex-col gap-3">
      {articles.map((article: any) => (
        <Link key={article.id} href={`/article-details/${article.id}`}>
          <Card className="w-full border-0 shadow-none">
            <CardContent className="w-full p-0">
              <div className="flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarImage src={article.user.image} />
                  <AvatarFallback>
                    <User2 className="bg-green-700 rounded-full size-8" />
                  </AvatarFallback>
                </Avatar>

                <span className="text-xs font-semibold">
                  {article.user.name}
                </span>
              </div>
              <div>
                {(article?.editorData as any)?.blocks.map(
                  (item: any, index: number) => {
                    if (item.type === "header") {
                      const headerData = JSON.parse(item.data);
                      return (
                        <div
                          key={`${article.id}-header-${index}`}
                          className="font-bold"
                        >
                          {headerData.text}
                        </div>
                      );
                    }
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      <div>
        <Button
          asChild
          variant={"link"}
          size={"xs"}
          className="p-0 text-green-600 hover:text-black hover:no-underline"
        >
          <Link href={"#"} className="text-xs">
            See all top picks
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TopPicksCard;
