import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProfileSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { UploadButton } from "@/components/uploadthing";
import { toast } from "sonner";
import { profile } from "@/actions/profile";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type UserImage = {
  key: string;
  name: string;
  url: string;
  size: number;
  serverData: ServerData;
};

type ServerData = {
  uploadedBy: string;
};
interface ProfileEditFormProps {
  closeDialog: () => void;
}
const ProfileEditForm = ({ closeDialog }: ProfileEditFormProps) => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<UserImage[]>([
    {
      key: "",
      name: "",
      url: user?.image || "",
      size: 0,
      serverData: { uploadedBy: "" },
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      bio: user?.bio || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    const finalData = {
      ...values,
      image: images ? images[0]?.url : undefined,
    };
    startTransition(() => {
      profile(finalData)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            update();
            toast.success(data.success);
            closeDialog();
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };
  return (
    <>
      <div>
        <span className="text-sm text-muted-foreground">Photo</span>
        <div className="flex items-center gap-5 mt-2">
          <div>
            <span className="relative aspect-video">
              {images ? (
                <Avatar className="size-28">
                  <AvatarImage src={images[0].url || ""} />
                  <AvatarFallback className="bg-amber-500">
                    <User2 className="text-white" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="size-28">
                  <AvatarFallback className="bg-amber-500">
                    <User2 className="text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-3 p-1">
            <div className="flex items-center gap-3">
              <span className="text-sm">
                <UploadButton
                  className="ut-button:bg-transparent ut-button:h-[30px] ut-button:w-[75px] ut-button:text-green-600"
                  endpoint="imageUploader"
                  content={{
                    button({ ready }) {
                      if (ready) return "Update";
                      return "Getting ready...";
                    },
                  }}
                  appearance={{
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    setImages(res);
                    setIsLoading(false);
                    toast("Profile image upload complete");
                  }}
                  onUploadProgress={() => {
                    setIsLoading(true);
                  }}
                  onUploadError={(error: Error) => {
                    closeDialog();
                    toast.error(error.message);
                  }}
                />
              </span>
              <span
                onClick={() =>
                  setImages([
                    {
                      key: "",
                      name: "",
                      url: "",
                      size: 0,
                      serverData: { uploadedBy: "" },
                    },
                  ])
                }
                className="text-sm text-destructive hover:cursor-pointer"
              >
                Remove
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
              side.
            </div>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 px-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      disabled={isPending}
                      className="w-full rounded-none bg-transparent border-t-0 border-r-0 border-l-0 border-b-[1.5px] border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Appears on your Profile page, as your byline, and in your
                    comments.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      className="w-full rounded-none bg-transparent border-t-0 border-r-0 border-l-0 border-b-[1.5px] border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Appears on your Profile and next to your stories.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={closeDialog}
              type="button"
              variant={"outline"}
              className="rounded-3xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending || isLoading}
              className="rounded-3xl"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProfileEditForm;
