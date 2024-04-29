"use client";

import moment from "moment";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { deleteArticle } from "@/actions/deleteArticle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StoriesListProps {
  articles: any;
}

const StoriesList = ({ articles }: StoriesListProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState<any[]>();
  const [published, setPublished] = useState<any[]>();
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (articles) {
      const publishedArticles = articles.filter(
        (article: any) => article.isPublished
      );
      const draftArticles = articles.filter(
        (article: any) => !article.isPublished
      );
      setDrafts(draftArticles);
      setPublished(publishedArticles);
    }
  }, [articles]);
  if (articles?.length === 0) return <div>No articles yet</div>;
  function handleDelete(id: string | undefined) {
    startTransition(() => {
      deleteArticle(id).then((res) => {
        if (res.success) {
          setOpenDelete(!openDelete);
          toast.success("Article successfully deleted");
          router.refresh();
        }
      });
    });
  }
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
                    Last edited {moment(draft.updatedAt).format("MMM D YYYY")}
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
                      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                        <DialogTrigger className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors focus:bg-accent hover:bg-accent focus:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                          Delete
                        </DialogTrigger>
                        <DialogContent className="shadow-md rounded-none flex flex-col gap-10 justify-center items-center py-48">
                          <DialogHeader className="flex flex-col gap-5">
                            <DialogTitle className="text-3xl text-center">
                              Delete story
                            </DialogTitle>
                            <DialogDescription>
                              Deletion is not reversible, and the story will be
                              completely deleted.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-5">
                            <DialogClose className="text-sm text-destructive rounded-3xl border border-destructive hover:text-red-700 hover:border-red-700 hover:bg-transparent px-3">
                              Cancel
                            </DialogClose>
                            <Button
                              disabled={isPending}
                              onClick={() => handleDelete(draft.id)}
                              className="bg-destructive text-white rounded-3xl hover:bg-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                        href={`/article-details/${published.id}`}
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
                    {moment(published.updatedAt).format("MMM, D YYYY")}
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
                          Edit article
                        </Link>
                      </DropdownMenuItem>
                      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                        <DialogTrigger className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors focus:bg-accent hover:bg-accent focus:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                          Delete article
                        </DialogTrigger>
                        <DialogContent className="shadow-md rounded-none flex flex-col gap-10 justify-center items-center py-48">
                          <DialogHeader className="flex flex-col gap-5">
                            <DialogTitle className="text-3xl text-center">
                              Delete story
                            </DialogTitle>
                            <DialogDescription>
                              Deletion is not reversible, and the story will be
                              completely deleted.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-5">
                            <DialogClose className="text-sm text-destructive rounded-3xl border border-destructive hover:text-red-700 hover:border-red-700 hover:bg-transparent px-3">
                              Cancel
                            </DialogClose>
                            <Button
                              disabled={isPending}
                              onClick={() => handleDelete(published.id)}
                              className="bg-destructive text-white rounded-3xl hover:bg-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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
