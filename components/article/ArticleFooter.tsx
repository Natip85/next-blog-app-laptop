"use client";
import { MailPlus, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArticleWithUser } from "./ArticleDetailsClient";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const ArticleFooter = ({ article }: ArticleWithUser) => {
  return (
    <div className="bg-gray-100 sm:p-20 p-5">
      <div className="sm:container sm:max-w-3xl flex flex-col gap-10">
        <Avatar className="size-20">
          <AvatarImage src={article?.user?.image} />
          <AvatarFallback className="bg-green-600">
            <User2 className="text-white size-10" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-lg font-semibold">
              Written by {article.user.name}
            </h3>
            <div className="flex items-center gap-3">
              <Button className="rounded-3xl">Follow</Button>

              <Button className="rounded-full p-3">
                <MailPlus className="size-5" />
              </Button>
            </div>
          </div>

          <div className="text-sm">5.3k followers</div>
        </div>
        <div className="text-sm">{article.user.bio}</div>
        <Separator className="my-5" />
      </div>
    </div>
  );
};

export default ArticleFooter;
