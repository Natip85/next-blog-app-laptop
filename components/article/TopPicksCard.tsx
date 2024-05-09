"use client";

import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";

interface TopPicksCardProps {
  articles: any;
}
const TopPicksCard = ({ articles }: TopPicksCardProps) => {
  console.log({ articles });

  return (
    <div className="flex flex-col gap-5">
      {articles.map((article: any) => (
        <Card key={article.id} className="w-full border-0 shadow-none">
          <CardContent className="w-full p-0">
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarImage src={article.user.image} />
                <AvatarFallback>
                  <User2 className="bg-green-700 rounded-full size-8" />
                </AvatarFallback>
              </Avatar>

              <span className="text-xs font-semibold">{article.user.name}</span>
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
      ))}
    </div>
  );
};

export default TopPicksCard;
