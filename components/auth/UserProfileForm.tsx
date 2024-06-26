"use client";
import { useEffect, useState, useTransition } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MailPlus, MoreHorizontal, User2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileEditForm from "@/components/auth/ProfileEditForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toggleFollowAuthor } from "@/actions/toggleFollowAuthor";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import moment from "moment";
interface UserProfileFormProps {
  dbUser: any;
}
const UserProfileForm = ({ dbUser }: UserProfileFormProps) => {
  console.log({ dbUser });

  const user = useCurrentUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const followerIds = dbUser.foundUser.followers.map(
      (follower: any) => follower.followerId
    );

    setIsFollowing(followerIds.includes(user?.id));
  }, []);
  const handleOpenDialog = () => {
    setOpen(!open);
  };
  function handleFollowAuthor() {
    setIsFollowing(!isFollowing);
    startTransition(() => {
      if (!user?.id) return;
      toggleFollowAuthor(dbUser.foundUser.id, user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        }
        if (res.success) {
          toast.success(isFollowing ? "Unfollowed author" : "Following author");
        }
      });
    });
  }
  return (
    <div className="container max-w-7xl flex flex-col-reverse sm:flex-row justify-between gap-5 sm:gap-10">
      <div className="w-full sm:w-2/3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="hidden sm:block text-3xl sm:text-5xl font-semibold my-10">
            {dbUser ? dbUser.foundUser.name : user?.name}
          </h1>
          {/* {user?.id != dbUser.foundUser.id && (
            <div className="hidden sm:flex items-center gap-3">
              <Button
                size={"sm"}
                onClick={handleFollowAuthor}
                variant={isFollowing ? "outline" : "default"}
                className={cn(
                  "rounded-3xl",
                  isFollowing &&
                    "border border-green-600 text-green-600 hover:text-green-700"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>

              <Button size={"sm"} className="rounded-full p-3">
                <MailPlus className="size-5" />
              </Button>
            </div>
          )} */}
        </div>
        <Tabs defaultValue="home">
          <TabsList className="bg-transparent">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <Separator className="-mt-1" />
          <TabsContent value="home">
            <div className="flex flex-col gap-3">
              {dbUser.foundUser.articles.map((article: any) => (
                <Card
                  key={article.id}
                  className="shadow-none border-0 border-b-[1px] rounded-none"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div>
                        <Avatar className="size-6">
                          <AvatarImage src={dbUser.foundUser.image} />
                          <AvatarFallback className="bg-green-600">
                            <User2 />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <Link href={`/profile/${article.id}`}>
                        <div className="font-medium">{article?.user?.name}</div>
                      </Link>
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
                            <svg viewBox="0 0 3940 610" className="p-2">
                              <path d="M594.79 308.2c0 163.76-131.85 296.52-294.5 296.52S5.8 472 5.8 308.2 137.65 11.69 300.29 11.69s294.5 132.75 294.5 296.51M917.86 308.2c0 154.16-65.93 279.12-147.25 279.12s-147.25-125-147.25-279.12S689.29 29.08 770.61 29.08s147.25 125 147.25 279.12M1050 308.2c0 138.12-23.19 250.08-51.79 250.08s-51.79-112-51.79-250.08 23.19-250.08 51.8-250.08S1050 170.09 1050 308.2M1862.77 37.4l.82-.18v-6.35h-167.48l-155.51 365.5-155.51-365.5h-180.48v6.35l.81.18c30.57 6.9 46.09 17.19 46.09 54.3v434.45c0 37.11-15.58 47.4-46.15 54.3l-.81.18V587H1327v-6.35l-.81-.18c-30.57-6.9-46.09-17.19-46.09-54.3V116.9L1479.87 587h11.33l205.59-483.21V536.9c-2.62 29.31-18 38.36-45.68 44.61l-.82.19v6.3h213.3v-6.3l-.82-.19c-27.71-6.25-43.46-15.3-46.08-44.61l-.14-445.2h.14c0-37.11 15.52-47.4 46.08-54.3m97.43 287.8c3.49-78.06 31.52-134.4 78.56-135.37 14.51.24 26.68 5 36.14 14.16 20.1 19.51 29.55 60.28 28.09 121.21zm-2.11 22h250v-1.05c-.71-59.69-18-106.12-51.34-138-28.82-27.55-71.49-42.71-116.31-42.71h-1c-23.26 0-51.79 5.64-72.09 15.86-23.11 10.7-43.49 26.7-60.45 47.7-27.3 33.83-43.84 79.55-47.86 130.93-.13 1.54-.24 3.08-.35 4.62s-.18 2.92-.25 4.39a332.64 332.64 0 0 0-.36 21.69C1860.79 507 1923.65 600 2035.3 600c98 0 155.07-71.64 169.3-167.8l-7.19-2.53c-25 51.68-69.9 83-121 79.18-69.76-5.22-123.2-75.95-118.35-161.63m532.69 157.68c-8.2 19.45-25.31 30.15-48.24 30.15s-43.89-15.74-58.78-44.34c-16-30.7-24.42-74.1-24.42-125.51 0-107 33.28-176.21 84.79-176.21 21.57 0 38.55 10.7 46.65 29.37zm165.84 76.28c-30.57-7.23-46.09-18-46.09-57V5.28L2424.77 60v6.7l1.14-.09c25.62-2.07 43 1.47 53.09 10.79 7.9 7.3 11.75 18.5 11.75 34.26v71.14c-18.31-11.69-40.09-17.38-66.52-17.38-53.6 0-102.59 22.57-137.92 63.56-36.83 42.72-56.3 101.1-56.3 168.81C2230 518.72 2289.53 600 2378.13 600c51.83 0 93.53-28.4 112.62-76.3V588h166.65v-6.66zm159.29-505.33c0-37.76-28.47-66.24-66.24-66.24-37.59 0-67 29.1-67 66.24s29.44 66.24 67 66.24c37.77 0 66.24-28.48 66.24-66.24m43.84 505.33c-30.57-7.23-46.09-18-46.09-57h-.13V166.65l-166.66 47.85v6.5l1 .09c36.06 3.21 45.93 15.63 45.93 57.77V588h166.8v-6.66zm427.05 0c-30.57-7.23-46.09-18-46.09-57V166.65L3082 212.92v6.52l.94.1c29.48 3.1 38 16.23 38 58.56v226c-9.83 19.45-28.27 31-50.61 31.78-36.23 0-56.18-24.47-56.18-68.9V166.66l-166.66 47.85V221l1 .09c36.06 3.2 45.94 15.62 45.94 57.77v191.27a214.48 214.48 0 0 0 3.47 39.82l3 13.05c14.11 50.56 51.08 77 109 77 49.06 0 92.06-30.37 111-77.89v66h166.66v-6.66zM3934.2 588v-6.67l-.81-.19c-33.17-7.65-46.09-22.07-46.09-51.43v-243.2c0-75.83-42.59-121.09-113.93-121.09-52 0-95.85 30.05-112.73 76.86-13.41-49.6-52-76.86-109.06-76.86-50.12 0-89.4 26.45-106.25 71.13v-69.87l-166.66 45.89v6.54l1 .09c35.63 3.16 45.93 15.94 45.93 57V588h155.5v-6.66l-.82-.2c-26.46-6.22-35-17.56-35-46.66V255.72c7-16.35 21.11-35.72 49-35.72 34.64 0 52.2 24 52.2 71.28V588h155.54v-6.66l-.82-.2c-26.46-6.22-35-17.56-35-46.66v-248a160.45 160.45 0 0 0-2.2-27.68c7.42-17.77 22.34-38.8 51.37-38.8 35.13 0 52.2 23.31 52.2 71.28V588z"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>{" "}
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="about">
            Make changes to your about here.
          </TabsContent>
        </Tabs>
      </div>
      <div className="sm:flex flex-col h-screen flex-1 sm:border-l p-5 sm:sticky sm:top-0">
        <span>
          {user?.id === dbUser.foundUser.id ? (
            <Avatar className="size-10 sm:size-32">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-amber-500">
                <User2 className="text-white" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="size-10 sm:size-32">
              <AvatarImage src={dbUser.foundUser.image || ""} />
              <AvatarFallback className="bg-amber-500">
                <User2 className="text-white" />
              </AvatarFallback>
            </Avatar>
          )}
        </span>
        <h3 className="font-semibold mt-5 mb-2">
          {dbUser ? dbUser.foundUser.name : user?.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {dbUser.foundUser.followers.length} Followers
        </p>
        <p className="text-sm text-muted-foreground my-5">
          {dbUser ? dbUser.foundUser.bio : user?.bio}
        </p>
        {user?.id === dbUser.foundUser.id ? (
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                className="w-fit p-0 hover:bg-transparent text-green-600 hover:text-gray-900"
                asChild
              >
                <Button variant={"ghost"}>Edit profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="text-center">
                  Profile information
                </DialogTitle>
                <ProfileEditForm closeDialog={handleOpenDialog} />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleFollowAuthor}
                variant={isFollowing ? "outline" : "default"}
                className={cn(
                  "rounded-3xl w-full sm:w-fit",
                  isFollowing &&
                    "border border-green-600 text-green-600 hover:text-green-700"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>

              <Button className="rounded-full p-3">
                <MailPlus className="size-5" />
              </Button>
            </div>
            {dbUser.followingUsers.length > 0 && (
              <div className="hidden sm:block text-base font-semibold">
                Following
              </div>
            )}
            {dbUser.followingUsers.map((follower: any) => (
              <div
                key={follower.id}
                className="hidden sm:flex items-center justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/profile/${follower.id}`}>
                    <Avatar className="size-5">
                      <AvatarImage src={follower.image} />
                      <AvatarFallback className="bg-green-600">
                        <User2 />
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <span className="text-xs">
                    <Link href={`/profile/${follower.id}`}>
                      {follower.name}
                    </Link>
                  </span>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex items-center gap-2">
                      <Link href={`/profile/${follower.id}`}>
                        <Avatar className="size-10">
                          <AvatarImage src={follower.image} />
                          <AvatarFallback className="bg-green-600">
                            <User2 />
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <span className="font-semibold text-xl">
                        <Link href={`/profile/${follower.id}`}>
                          {follower.name}
                        </Link>
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground my-2">
                      {follower.bio}
                    </div>
                    <Separator />
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">
                        {follower.followers.length} Followers
                      </span>
                      <Button
                        size={"xs"}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm rounded-3xl"
                      >
                        Follow
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
            {dbUser.followedUsers > 0 && (
              <div>
                <Button
                  asChild
                  variant={"link"}
                  size={"xs"}
                  className="p-0 text-green-600 hover:text-black hover:no-underline"
                >
                  <Link href={"#"} className="text-xs">
                    See all ({dbUser.following.length})
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileForm;
