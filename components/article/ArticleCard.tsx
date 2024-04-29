"use client";

import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import moment from "moment";
import { Badge } from "../ui/badge";
interface ArticleCardProps {
  articles: any;
}
const ArticleCard = ({ articles }: ArticleCardProps) => {
  console.log("card articles>>", articles);
  console.log(
    "card blocks>>",
    articles.map((item: any) => {
      return item.editorData;
    })
  );

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
          <CardFooter>
            <Badge variant={"secondary"}>
              {articles?.category?.map((item: any) => {
                return item;
              })}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ArticleCard;
