"use client";

import moment from "moment";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import { Article } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ArrowDown, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

interface StoriesListProps {
  articles: any;
}

const StoriesList = ({ articles }: StoriesListProps) => {
  return (
    <Tabs defaultValue="drafts">
      <TabsList className="bg-transparent">
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
        <TabsTrigger value="published">Published</TabsTrigger>
      </TabsList>
      <Separator className="-mt-1" />
      <TabsContent value="drafts">
        <div className="flex flex-col gap-2">
          {articles?.draftArticles.map((draft: Article) => (
            <div key={draft.id} className="p-3 border-b">
              <div className="flex flex-col">
                {(draft.editorData as any)?.blocks.map((item: any) => {
                  if (item.type === "header") {
                    const headerData = JSON.parse(item.data);
                    return (
                      <Link
                        href={`/article/${draft.id}`}
                        key={item}
                        className="p-2 font-bold hover:cursor-pointer"
                      >
                        {headerData.text}
                      </Link>
                    );
                  }
                })}
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mt-2 p-2">
                    Last edited {moment(draft.updatedAt).format("MMM do YYYY")}
                  </span>
                  ·
                  <span className="text-xs text-muted-foreground mt-2  p-2">
                    Read time {draft.readTime}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center">
                      <ChevronDown className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-2 p-2">
                      <DropdownMenuItem
                        asChild
                        className="hover:cursor-pointer"
                      >
                        <Link href={`/article/${draft.id}`}>Edit draft</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive hover:cursor-pointer hover:text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="published">
        make changes to publushed here
      </TabsContent>
    </Tabs>
  );
};

export default StoriesList;
