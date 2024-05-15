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
    <div className="container max-w-7xl flex justify-between gap-10">
      <div className="w-full sm:w-2/3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl sm:text-5xl font-semibold my-10">
            {dbUser ? dbUser.foundUser.name : user?.name}
          </h1>
          {user?.id != dbUser.foundUser.id && (
            <div className="sm:hidden flex items-center gap-3">
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
          )}
        </div>
        <Tabs defaultValue="home">
          <TabsList className="bg-transparent">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <Separator className="-mt-1" />
          <TabsContent value="home">
            Make changes to your home here.
          </TabsContent>
          <TabsContent value="about">
            Make changes to your about here.
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden sm:flex flex-col h-screen flex-1 border-l p-5">
        <span>
          {user?.id === dbUser.foundUser.id ? (
            <Avatar className="size-32">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-amber-500">
                <User2 className="text-white" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="size-32">
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
                  "rounded-3xl",
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
              <div className="text-base font-semibold">Following</div>
            )}
            {dbUser.followingUsers.map((follower: any) => (
              <div
                key={follower.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/profile/${follower.id}`}>
                    <Avatar>
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
                    Place content for the popover here.
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
