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
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface StoriesListProps {
  articles: Article[] | null;
}

const StoriesList = ({ articles }: StoriesListProps) => {
  const [drafts, setDrafts] = useState<Article[]>();
  const [published, setPublished] = useState<Article[]>();
  useEffect(() => {
    if (articles) {
      const publishedArticles = articles.filter(
        (article) => article.isPublished
      );
      const draftArticles = articles.filter((article) => !article.isPublished);
      setDrafts(draftArticles);
      setPublished(publishedArticles);
    }
  }, [articles]);
  if (articles?.length === 0) return <div>No articles yet</div>;
  return (
    <Tabs defaultValue="drafts">
      <TabsList className="bg-transparent">
        <TabsTrigger value="drafts">
          Drafts ({drafts != null ? drafts.length : "0"})
        </TabsTrigger>
        <TabsTrigger value="published">
          Published ({published != null ? published.length : "0"})
        </TabsTrigger>
      </TabsList>
      <Separator className="-mt-1" />
      <TabsContent value="drafts">
        <div className="flex flex-col gap-2">
          {drafts?.map((draft) => (
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
        <div className="flex flex-col gap-2">
          {published?.map((published) => (
            <div key={published.id} className="p-3 border-b">
              <div className="flex flex-col">
                {(published.editorData as any)?.blocks.map((item: any) => {
                  if (item.type === "header") {
                    const headerData = JSON.parse(item.data);
                    return (
                      <Link
                        href={`/article/${published.id}`}
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
                    Last edited{" "}
                    {moment(published.updatedAt).format("MMM do YYYY")}
                  </span>
                  ·
                  <span className="text-xs text-muted-foreground mt-2  p-2">
                    Read time {published.readTime}
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
                        <Link href={`/article/${published.id}`}>
                          Edit draft
                        </Link>
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
    </Tabs>
  );
};

export default StoriesList;
