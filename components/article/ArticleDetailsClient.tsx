"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import EditorJS from "@editorjs/editorjs";
import { EditorTools } from "@/lib/editorTools";
import { convertFromJSON } from "./ArticleForm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MoreHorizontal, User2 } from "lucide-react";
import { Favorite, Like, User } from "@prisma/client";
import moment from "moment";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Textarea } from "../ui/textarea";
import { createComment } from "@/actions/createComment";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { likeArticle } from "@/actions/likeArticle";
import { stagger, useAnimate, animate } from "framer-motion";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import ArticleFooter from "./ArticleFooter";
import { createFavorite } from "@/actions/createFavorite";
import Link from "next/link";
import { createReadingHistory } from "@/actions/createReadingHistory";

export interface ArticleDetailsClientProps {
  article: ArticleWithUser | null;
  comments: any;
  likes: Like[] | null;
}
export type ArticleWithUser = any & {
  user: User;
};
const randomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

type AnimationSequence = Parameters<typeof animate>[0];

const ArticleDetailsClient = ({
  article,
  comments,
  likes,
}: ArticleDetailsClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();
  const ref = useRef<EditorJS | null>(null);
  const [editEditorData, setEditEditorData] = useState<any>(() => {
    return {
      time: new Date().getTime(),
      blocks: convertFromJSON(article?.editorData?.blocks),
    };
  });
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [likedCount, setLikedCount] = useState(0);
  const [myLikedCount, setMyLikedCount] = useState(1);
  const [liked, setLiked] = useState(false);
  const isUserFavorite = article.favorite.some(
    (favorite: Favorite) => favorite.userId === user?.id
  );
  const [isFavorite, setIsFavorite] = useState(isUserFavorite);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (article) {
      if (!ref.current) {
        const editor = new EditorJS({
          readOnly: true,
          holder: "read-editor",
          tools: EditorTools,
          data: editEditorData,
        });
        ref.current = editor;
      }
    }
  }, [article, editEditorData]);

  useEffect(() => {
    const allLikesCount = likes
      ? likes.reduce((acc, like) => acc + like.likeCount, 0)
      : 0;
    setLikedCount(allLikesCount);
    const userLikesCount =
      likes && user ? likes.filter((like) => like.userId === user.id) : null;
    if (userLikesCount && userLikesCount?.length > 0) {
      setLiked(true);
    }
  }, [likes, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user?.id) return;
      createReadingHistory(article.id, user.id).then((res) => {
        if (res.success) {
          router.refresh();
        }
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  function handleResponseSubmit() {
    setError("");
    setSuccess("");
    startTransition(() => {
      if (user && user.id) {
        createComment(response, user.id, article?.id).then((res) => {
          if (res.error) {
            setError(res.error);
            toast.error(res.error);
          }
          if (res.success) {
            setSuccess(res.success);
            toast.success(res.success);
          }
          setResponse("");
          router.refresh();
        });
      } else {
        console.error("User is undefined");
      }
    });
  }

  function handleLikeArticle() {
    setLiked(true);
    setLikedCount((prev) => prev + 1);
    setError("");
    setSuccess("");
    startTransition(() => {
      if (user && user.id) {
        likeArticle(user.id, article?.id).then((res) => {
          if (res.error) {
            setError(res.error);
            toast.error(error);
          }
          if (res.success) {
            setMyLikedCount(res.success + 1);
          }
          router.refresh();
        });
      } else {
      }
    });
  }

  const onButtonClick = () => {
    const sparkles = Array.from({ length: 20 });
    const sparklesAnimation: AnimationSequence = sparkles.map((_, index) => [
      `.sparkle-${index}`,
      {
        x: randomNumberBetween(-100, 100),
        y: randomNumberBetween(-100, 100),
        scale: randomNumberBetween(0.8, 1.1),
        opacity: 1,
      },
      {
        duration: 0.4,
        at: "<",
      },
    ]);

    const sparklesFadeOut: AnimationSequence = sparkles.map((_, index) => [
      `.sparkle-${index}`,
      {
        opacity: 0,
        scale: 0,
      },
      {
        duration: 0.3,
        at: "<",
      },
    ]);

    const sparklesReset: AnimationSequence = sparkles.map((_, index) => [
      `.sparkle-${index}`,
      {
        x: 0,
        y: 0,
      },
      {
        duration: 0.000001,
      },
    ]);

    animate([
      ...sparklesReset,
      [".letter", { y: -32 }, { duration: 0.2, delay: stagger(0.05) }],
      ["#ike-button", { scale: 0.8 }, { duration: 0.1, at: "<" }],
      ["#ike-button", { scale: 1 }, { duration: 0.1 }],
      ...sparklesAnimation,
      [".letter", { y: 0 }, { duration: 0.000001 }],
      ...sparklesFadeOut,
    ]);
    animate("#bubble", { opacity: 1, y: [0, -40] }, { duration: 0.2 });

    setTimeout(() => {
      animate("#bubble", { opacity: 0, y: -80 }, { duration: 0.5 });
    }, 1000);
  };
  const handleCopyLink = () => {
    const fullURL = window.location.origin + pathname;
    navigator.clipboard
      .writeText(fullURL)
      .then(() => {
        toast.success("Article link copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy article link");
      });
  };

  function handleSaveArticle() {
    setError("");
    setSuccess("");
    setIsFavorite(!isFavorite);
    startTransition(() => {
      if (!user?.id) return;
      createFavorite(user.id, article.id).then((res) => {
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
  return (
    <>
      <div className="container max-w-3xl py-20">
        <div className="flex items-center gap-3">
          <div>
            <Avatar className="size-10">
              <AvatarImage src={article?.user?.image} />
              <AvatarFallback className="bg-green-600">
                <User2 className="text-white" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="font-medium">{article.user.name}</div>
            <span className="text-xs text-muted-foreground">
              {moment(article.updatedAt).format("MMM D YYYY")}
            </span>
            {" · "}
            <span className="text-xs text-muted-foreground mt-2">
              {article.readTime} min read
            </span>
          </div>
        </div>

        <div className="border-t-[2px] border-b-[2px] py-3 my-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={scope} className="relative flex items-center">
                    <div
                      id="bubble"
                      className="absolute rounded-full opacity-0 size-8 bg-black flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-semibold">
                        +{myLikedCount}
                      </span>
                    </div>
                    <Button
                      id="like-button"
                      onClick={() => {
                        handleLikeArticle();
                        onButtonClick();
                      }}
                      variant={"ghost"}
                      size={"xs"}
                      className="relative flex gap-1"
                    >
                      {liked ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          aria-label="clap"
                        >
                          <path d="M11.37.83L12 3.28l.63-2.45h-1.26zM15.42 1.84l-1.18-.39-.34 2.5 1.52-2.1zM9.76 1.45l-1.19.4 1.53 2.1-.34-2.5zM20.25 11.84l-2.5-4.4a1.42 1.42 0 0 0-.93-.64.96.96 0 0 0-.75.18c-.25.19-.4.42-.45.7l.05.05 2.35 4.13c1.62 2.95 1.1 5.78-1.52 8.4l-.46.41c1-.13 1.93-.6 2.78-1.45 2.7-2.7 2.51-5.59 1.43-7.38zM12.07 9.01c-.13-.69.08-1.3.57-1.77l-2.06-2.07a1.12 1.12 0 0 0-1.56 0c-.15.15-.22.34-.27.53L12.07 9z"></path>
                          <path d="M14.74 8.3a1.13 1.13 0 0 0-.73-.5.67.67 0 0 0-.53.13c-.15.12-.59.46-.2 1.3l1.18 2.5a.45.45 0 0 1-.23.76.44.44 0 0 1-.48-.25L7.6 6.11a.82.82 0 1 0-1.15 1.15l3.64 3.64a.45.45 0 1 1-.63.63L5.83 7.9 4.8 6.86a.82.82 0 0 0-1.33.9c.04.1.1.18.18.26l1.02 1.03 3.65 3.64a.44.44 0 0 1-.15.73.44.44 0 0 1-.48-.1L4.05 9.68a.82.82 0 0 0-1.4.57.81.81 0 0 0 .24.58l1.53 1.54 2.3 2.28a.45.45 0 0 1-.64.63L3.8 13a.81.81 0 0 0-1.39.57c0 .22.09.43.24.58l4.4 4.4c2.8 2.8 5.5 4.12 8.68.94 2.27-2.28 2.71-4.6 1.34-7.1l-2.32-4.08z"></path>
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          aria-label="clap"
                        >
                          <path d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"></path>
                        </svg>
                      )}
                      {/* <span className="sr-only">Likes</span> */}

                      {/* <span
                        aria-hidden
                        className="flex items-center justify-center h-8 overflow-hidden"
                      >
                        {["L", "i", "k", "e", "s"].map((letter, index) => (
                          <span
                            key={`${letter}-${index}`}
                            className="leading-8 letter inline-block relative h-8 after:h-8 after:absolute after:left-0 after:top-full after:content-[attr(data-letter)]"
                            data-letter={letter}
                          >
                            {letter}
                          </span>
                        ))}
                      </span> */}
                      <span className="font-light">{likedCount}</span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 block"
                      >
                        {Array.from({ length: 20 }).map((_, index) => (
                          <svg
                            className={`absolute left-1/2 top-1/2 opacity-0 sparkle-${index}`}
                            key={index}
                            viewBox="0 0 122 117"
                            width="8"
                            height="8"
                          >
                            <path
                              className="fill-blue-600"
                              d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z"
                            />
                          </svg>
                        ))}
                      </span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-3 text-sm">
                    Like article
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="flex items-center">
                  <Button
                    variant={"ghost"}
                    size={"xs"}
                    onClick={() => setOpen(!open)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
                    </svg>
                    {article.comments.length > 0 ? (
                      <span className="font-light">
                        {article.comments.length}
                      </span>
                    ) : null}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-3 text-sm">
                    Leave a comment
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="flex flex-col gap-5 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    Responses ({article?.comments?.length})
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 flex flex-col gap-3">
                  <div className="p-4 shadow-xl rounded-md flex flex-col gap-3 border-[0.5px] border-gray-100">
                    <div className="flex items-center gap-5">
                      <Avatar>
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>
                          <User2 />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user?.name}</span>
                    </div>
                    <div>
                      <Textarea
                        value={response}
                        placeholder="What are your thoughts?"
                        className="border-none ring-offset-0 focus-visible:ring-0"
                        onChange={(e) => setResponse(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        onClick={handleResponseSubmit}
                        disabled={!response || isPending}
                        className="bg-green-600 rounded-3xl hover:bg-green-700"
                      >
                        Respond
                      </Button>
                    </div>
                  </div>
                  <div>
                    {comments.map((comment: any) => (
                      <div
                        key={comment.id}
                        className="flex flex-col gap-3 border-b-[1px] p-4"
                      >
                        <div className="flex items-center gap-3 ">
                          <div>
                            <Avatar className="size-10">
                              <AvatarImage src={comment?.user?.image} />
                              <AvatarFallback>
                                <User2 className="text-white" />
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="font-medium text-sm">
                            {comment?.user?.name}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {moment(comment.createdAt).format("MMM D YYYY")}
                          </span>
                        </div>
                        <div className="text-sm">{comment.description}</div>
                        <div className="flex items-center justify-between">
                          <Button variant={"link"} size={"xs"} className="p-0">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              aria-label="clap"
                            >
                              <path d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"></path>
                            </svg>
                          </Button>
                          <Button variant={"link"}>Reply</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={isPending}
                    variant={"ghost"}
                    size={"xs"}
                    onClick={handleSaveArticle}
                  >
                    {isFavorite ? (
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="hidden sm:block">
                  <Button
                    variant={"ghost"}
                    size={"xs"}
                    onClick={handleCopyLink}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                    <span className="hover:cursor-pointer">Follow author</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-10">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={article.image || ""}
              alt="Image"
              fill
              className="object-contain"
            />
          </AspectRatio>
        </div>

        <div id="read-editor" />
        {/* <div>
          <h5>Thank you for reading until the end. Before you go:</h5> <br />
          <br />
          - Please consider clapping and following the writer! 👏 <br />
          - Follow us on Twitter(X), LinkedIn, and YouTube. <br />- Visit
          Stackademic.com to find out more about how we are democratizing free
          programming education around the world.
        </div> */}
        <div className="font-mono">
          <h5 className="text-lg font-semibold mb-4">
            Thank you for reading until the end. Before you go:
          </h5>
          <ul className="list-disc pl-5 mb-4">
            <li>Please consider clapping and following the writer! 👏</li>
            <li>
              Follow us on{" "}
              <Button variant={"link"} className="p-0" asChild>
                <Link href={"#"}>Twitter(X)</Link>
              </Button>
              ,{" "}
              <Button variant={"link"} className="p-0" asChild>
                <Link href={"#"}>LinkedIn</Link>
              </Button>
              , and{" "}
              <Button variant={"link"} className="p-0" asChild>
                <Link href={"#"}>YouTube</Link>
              </Button>
              .
            </li>
          </ul>
        </div>
        <div className="border-t-[2px] border-b-[2px] py-3 mt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center">
                    <div
                      id="bubble1"
                      className="absolute rounded-full opacity-0 size-8 bg-black flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-semibold">
                        +{myLikedCount}
                      </span>
                    </div>
                    <Button
                      id="like-button1"
                      onClick={() => {
                        handleLikeArticle();
                        onButtonClick();
                      }}
                      variant={"ghost"}
                      size={"xs"}
                      className="relative flex gap-1"
                    >
                      {liked ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          aria-label="clap"
                        >
                          <path d="M11.37.83L12 3.28l.63-2.45h-1.26zM15.42 1.84l-1.18-.39-.34 2.5 1.52-2.1zM9.76 1.45l-1.19.4 1.53 2.1-.34-2.5zM20.25 11.84l-2.5-4.4a1.42 1.42 0 0 0-.93-.64.96.96 0 0 0-.75.18c-.25.19-.4.42-.45.7l.05.05 2.35 4.13c1.62 2.95 1.1 5.78-1.52 8.4l-.46.41c1-.13 1.93-.6 2.78-1.45 2.7-2.7 2.51-5.59 1.43-7.38zM12.07 9.01c-.13-.69.08-1.3.57-1.77l-2.06-2.07a1.12 1.12 0 0 0-1.56 0c-.15.15-.22.34-.27.53L12.07 9z"></path>
                          <path d="M14.74 8.3a1.13 1.13 0 0 0-.73-.5.67.67 0 0 0-.53.13c-.15.12-.59.46-.2 1.3l1.18 2.5a.45.45 0 0 1-.23.76.44.44 0 0 1-.48-.25L7.6 6.11a.82.82 0 1 0-1.15 1.15l3.64 3.64a.45.45 0 1 1-.63.63L5.83 7.9 4.8 6.86a.82.82 0 0 0-1.33.9c.04.1.1.18.18.26l1.02 1.03 3.65 3.64a.44.44 0 0 1-.15.73.44.44 0 0 1-.48-.1L4.05 9.68a.82.82 0 0 0-1.4.57.81.81 0 0 0 .24.58l1.53 1.54 2.3 2.28a.45.45 0 0 1-.64.63L3.8 13a.81.81 0 0 0-1.39.57c0 .22.09.43.24.58l4.4 4.4c2.8 2.8 5.5 4.12 8.68.94 2.27-2.28 2.71-4.6 1.34-7.1l-2.32-4.08z"></path>
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          aria-label="clap"
                        >
                          <path d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"></path>
                        </svg>
                      )}
                      {/* <span className="sr-only">Likes</span> */}

                      {/* <span
                        aria-hidden
                        className="flex items-center justify-center h-8 overflow-hidden"
                      >
                        {["L", "i", "k", "e", "s"].map((letter, index) => (
                          <span
                            key={`${letter}-${index}`}
                            className="leading-8 letter inline-block relative h-8 after:h-8 after:absolute after:left-0 after:top-full after:content-[attr(data-letter)]"
                            data-letter={letter}
                          >
                            {letter}
                          </span>
                        ))}
                      </span> */}
                      <span className="font-light">{likedCount}</span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 block"
                      >
                        {Array.from({ length: 20 }).map((_, index) => (
                          <svg
                            className={`absolute left-1/2 top-1/2 opacity-0 sparkle1-${index}`}
                            key={index}
                            viewBox="0 0 122 117"
                            width="8"
                            height="8"
                          >
                            <path
                              className="fill-blue-600"
                              d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z"
                            />
                          </svg>
                        ))}
                      </span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-3 text-sm">
                    Like article
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="flex items-center">
                  <Button
                    variant={"ghost"}
                    size={"xs"}
                    onClick={() => setOpen(!open)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
                    </svg>
                    {article.comments.length > 0 ? (
                      <span className="font-light">
                        {article.comments.length}
                      </span>
                    ) : null}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-3 text-sm">
                    Leave a comment
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="flex flex-col gap-5 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    Responses ({article?.comments?.length})
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 flex flex-col gap-3">
                  <div className="p-4 shadow-xl rounded-md flex flex-col gap-3 border-[0.5px] border-gray-100">
                    <div className="flex items-center gap-5">
                      <Avatar>
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>
                          <User2 />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user?.name}</span>
                    </div>
                    <div>
                      <Textarea
                        value={response}
                        placeholder="What are your thoughts?"
                        className="border-none ring-offset-0 focus-visible:ring-0"
                        onChange={(e) => setResponse(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        onClick={handleResponseSubmit}
                        disabled={!response || isPending}
                        className="bg-green-600 rounded-3xl hover:bg-green-700"
                      >
                        Respond
                      </Button>
                    </div>
                  </div>
                  <div>
                    {comments.map((comment: any) => (
                      <div
                        key={comment.id}
                        className="flex flex-col gap-3 border-b-[1px] p-4"
                      >
                        <div className="flex items-center gap-3 ">
                          <div>
                            <Avatar className="size-10">
                              <AvatarImage src={comment?.user?.image} />
                              <AvatarFallback>
                                <User2 className="text-white" />
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="font-medium text-sm">
                            {comment?.user?.name}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {moment(comment.createdAt).format("MMM D YYYY")}
                          </span>
                        </div>
                        <div className="text-sm">{comment.description}</div>
                        <div className="flex items-center justify-between">
                          <Button variant={"link"} size={"xs"} className="p-0">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              aria-label="clap"
                            >
                              <path d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"></path>
                            </svg>
                          </Button>
                          <Button variant={"link"}>Reply</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={isPending}
                    variant={"ghost"}
                    size={"xs"}
                    onClick={handleSaveArticle}
                  >
                    {isFavorite ? (
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="hidden sm:block">
                  <Button
                    variant={"ghost"}
                    size={"xs"}
                    onClick={handleCopyLink}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                    <span className="hover:cursor-pointer">Follow author</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <ArticleFooter article={article} />
    </>
  );
};

export default ArticleDetailsClient;
