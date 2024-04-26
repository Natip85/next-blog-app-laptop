"use client";
import * as z from "zod";
import { profile } from "@/actions/profile";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileSchema } from "@/validations";
import { useState, useTransition } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileEditForm from "@/components/auth/ProfileEditForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/logout";

const ProfilePage = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });
  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    startTransition(() => {
      profile(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            update();
            toast.success(data.success);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleOpenDialog = () => {
    setOpen(!open);
  };

  const handleDeleteAccount = async (id: string) => {
    await axios.delete(`/api/auth/delete/${id}`).then((res) => {
      if (res.status === 200) {
        setOpenDelete(!openDelete);
        logout();
      }
    });
  };
  return (
    <div className="container max-w-7xl flex justify-between gap-10">
      <div className="w-full sm:w-2/3 p-5">
        <h1 className="text-3xl sm:text-5xl font-semibold my-10">
          {user?.name}
        </h1>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="about">
              <TabsList className="bg-transparent">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <Separator className="-mt-1" />
              <TabsContent value="about">
                Make changes to your about here.
              </TabsContent>
              <TabsContent value="account">
                <div className="space-y-4 px-4 py-4">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">
                            Profile information
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Edit your photo, name, bio, etc.
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{user?.name}</span>
                          <span className="relative aspect-video">
                            <Avatar className="size-7">
                              <AvatarImage src={user?.image} />
                              <AvatarFallback className="bg-amber-500">
                                <User2 className="text-white" />
                              </AvatarFallback>
                            </Avatar>
                          </span>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-center">
                        Profile information
                      </DialogTitle>
                      <ProfileEditForm closeDialog={handleOpenDialog} />
                    </DialogContent>
                  </Dialog>
                  <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogTrigger asChild>
                      <Button
                        variant={"link"}
                        className="text-destructive p-0 flex flex-col items-start font-medium hover:no-underline"
                      >
                        Delete account
                        <span className="text-xs text-muted-foreground">
                          Permanently delete your account and all of your
                          content.
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center text-2xl">
                          Delete account
                        </DialogTitle>
                      </DialogHeader>
                      <div className="text-sm p-2">
                        We’re sorry to see you go. Once your account is deleted,
                        all of your content will be permanently gone, including
                        your profile, stories, publications, notes, and
                        responses. Deleting your Medium account will not delete
                        any Stripe account you have connected to your Medium
                        account. If you’re not sure about that, we suggest you
                        deactivate or submit a request at help.medium.com
                        instead.
                      </div>
                      <Separator />
                      <div className="flex justify-end gap-5">
                        <DialogClose className="text-sm text-destructive rounded-3xl border border-destructive hover:text-red-700 hover:border-red-700 hover:bg-transparent px-3">
                          Cancel
                        </DialogClose>
                        <Button
                          onClick={() => handleDeleteAccount(user?.id!)}
                          className="bg-destructive text-white hover:bg-red-700"
                        >
                          Delete account
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>
              <TabsContent value="security">
                {user?.isOAuth === false && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="update-user-email"
                              {...field}
                              placeholder="john.doe@example.com"
                              disabled={isPending}
                              type="email"
                              className="w-1/2 border-none focus-visible:ring-1 focus-visible:ring-offset-0 bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <FormLabel>Current password</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="update-user-password"
                              {...field}
                              placeholder="******"
                              disabled={isPending}
                              type="password"
                              className="w-1/2 border-none focus-visible:ring-1 focus-visible:ring-offset-0 bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <FormLabel>New password</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="update-user-new-password"
                              {...field}
                              placeholder="******"
                              disabled={isPending}
                              type="password"
                              className="w-1/2 border-none focus-visible:ring-1 focus-visible:ring-offset-0 bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-5 flex items-center justify-between">
                      <span>Two Factor Authentication</span>
                      <FormField
                        control={form.control}
                        name="isTwoFactorEnabled"
                        render={({ field }) => (
                          <FormItem className="flex w-1/2 min-w-[175px] items-center justify-between rounded-md border p-3 gap-3 shadow-sm">
                            <FormDescription className="text-xs">
                              Enable two factor authentication for your account
                            </FormDescription>

                            <FormControl>
                              <Switch
                                disabled={isPending}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                {user?.isOAuth === true && (
                  <div className="flex flex-row items-center justify-between my-4">
                    <p className="text-sm font-medium">Email</p>
                    <p className="truncate text-xs max-w-[180px] p-2 bg-slate-100 rounded-md">
                      {user?.email}
                    </p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Role</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-1/2 ring-offset-0 focus:outline-none focus:ring-0  focus:ring-offset-0">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.USER}>User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end my-5">
                  <Button
                    variant={"outline"}
                    disabled={isPending}
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
      <div className="hidden sm:flex flex-col h-screen flex-1 border-l p-5">
        <span>
          {user?.image ? (
            <Avatar className="size-32">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-amber-500">
                <User2 className="text-white" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="bg-amber-400 rounded-full size-24 flex justify-center items-center">
              <User2 className="rounded-full" size={75} />
            </div>
          )}
        </span>
        <h3 className="font-semibold my-5">{user?.name}</h3>
        <p className="text-sm text-muted-foreground">{user?.bio}</p>
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
      </div>
    </div>
  );
};

export default ProfilePage;
