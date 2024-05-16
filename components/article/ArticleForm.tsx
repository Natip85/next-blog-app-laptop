"use client";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { INITIAL_DATA } from "@/lib/editorTools";
import { createArticle } from "@/actions/createArticle";
import { EditorTools } from "@/lib/editorTools";
import EditorJS from "@editorjs/editorjs";
import Link from "next/link";
import { toast } from "sonner";
import UserButton from "../auth/UserButton";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import PublishArticleForm from "./PublishArticleForm";
import { updateArticle } from "@/actions/updateArticle";
import { UploadButton } from "@/components/uploadthing";
import { UserImage } from "../auth/ProfileEditForm";
import Image from "next/image";

const ArticleEditor = dynamic(() => import("@/components/article/Editor"), {
  ssr: false,
});
export function convertToJSON(blocks: any[]) {
  return blocks.map((block) => ({
    id: block.id,
    type: block.type,
    data: JSON.stringify(block.data),
  }));
}
export function convertFromJSON(blocks: any[]) {
  return blocks?.map((block: any) => ({
    ...block,
    data: typeof block.data === "string" ? JSON.parse(block.data) : block.data,
  }));
}

interface ArticleFormProps {
  article: any;
}

const ArticleForm = ({ article }: ArticleFormProps) => {
  const router = useRouter();
  const ref = useRef<EditorJS | null>(null);
  const [draftEditorData, setDraftEditorData] = useState<any>(() => {
    const storedData = localStorage.getItem("document");
    return storedData ? JSON.parse(storedData) : INITIAL_DATA;
  });

  const [editEditorData, setEditEditorData] = useState<any>(() => {
    const storedData = localStorage.getItem("edit-document");
    return storedData
      ? JSON.parse(storedData)
      : {
          time: new Date().getTime(),
          blocks: convertFromJSON(article?.editorData.blocks),
        };
  });
  const [images, setImages] = useState<UserImage[]>([
    {
      key: "",
      name: "",
      url: article?.image || "",
      size: 0,
      serverData: { uploadedBy: "" },
    },
  ]);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (article) {
      if (!ref.current) {
        const editor = new EditorJS({
          holder: "edit-editor",
          tools: EditorTools,
          data: editEditorData,
          async onChange(api, event) {
            const data = await api.saver.save();
            let logDataString = JSON.stringify(data);
            localStorage.setItem("edit-document", logDataString);
            setEditEditorData(data);
          },
        });
        ref.current = editor;
      }
    }
  }, [article, editEditorData]);

  const handleSaveEditor = () => {
    if (!article) {
      //CREATE DRAFT
      startTransition(() => {
        const dataToCreate = {
          version: draftEditorData.version ?? null,
          time: draftEditorData.time ?? null,
          blocks: convertToJSON(draftEditorData.blocks),
        };
        const isImage = images[0].url ? images[0].url : undefined;
        createArticle(dataToCreate, false, "", undefined, isImage).then(
          (res) => {
            if (res.success) {
              localStorage.removeItem("document");
              toast.success("Article successfully created");
              router.push("/stories");
              router.refresh();
            }
          }
        );
      });
    } else {
      //UPDATE
      startTransition(() => {
        const dataToCreate = {
          version: editEditorData.version ?? null,
          time: editEditorData.time ?? null,
          blocks: convertToJSON(editEditorData.blocks),
        };
        const isImage = images[0].url ? images[0].url : null;

        updateArticle(article.id, dataToCreate, isImage).then((res) => {
          if (res.success) {
            localStorage.removeItem("edit-document");
            toast.success("Article successfully saved");
            router.push(`/stories`);
            router.refresh();
          }
        });
      });
    }
  };

  return (
    <div>
      <div className="container max-w-5xl p-3 flex items-center justify-between mb-10">
        <Link href={"/feed"}>
          <div>
            <Image src={"/sound-waves.png"} alt="logo" width={50} height={50} />
          </div>
        </Link>
        <div className="flex items-center gap-3">
          {article && article.isPublished ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={isImageLoading}
                  size={"xs"}
                  className="bg-green-600 rounded-3xl hover:bg-green-700"
                >
                  Publish
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl p-5 overflow-y-auto">
                <PublishArticleForm
                  draftEditorData={draftEditorData}
                  publishEditorData={editEditorData}
                  article={article}
                  image={images[0].url}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <Button
                size={"xs"}
                disabled={isPending || isImageLoading}
                onClick={handleSaveEditor}
                variant={"outline"}
                className="rounded-3xl"
              >
                Save as draft
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={isPending || isImageLoading}
                    size={"xs"}
                    className="bg-green-600 rounded-3xl hover:bg-green-700"
                  >
                    Publish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl p-5">
                  <PublishArticleForm
                    draftEditorData={draftEditorData}
                    publishEditorData={editEditorData}
                    article={article}
                    image={images[0].url}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}

          <UserButton />
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        {images[0].url ? (
          <div>
            <div className="relative max-h-[400px] max-w-3xl aspect-video mx-auto px-10">
              <Image
                src={images[0].url}
                alt={"article-pic"}
                fill
                className="w-full mx-auto"
              />
            </div>
            <div className="flex justify-center items-center pt-5">
              <Button
                variant={"ghost"}
                className="text-destructive"
                onClick={() =>
                  setImages(() => {
                    return [
                      {
                        key: "",
                        name: "",
                        url: "",
                        size: 0,
                        serverData: { uploadedBy: "" },
                      },
                    ];
                  })
                }
              >
                Remove image
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="relative flex items-center justify-center gap-2 border p-3">
              <Image
                src={"/sound-waves.png"}
                alt="logo"
                width={50}
                height={50}
              />
              <span className="hidden  sm:block sm:text-xl md:text-3xl font-semibold font-mono">
                Yarcone
              </span>
            </div>
            <div>
              <UploadButton
                className="ut-button:bg-transparent text-nowrap ut-button:text-green-600"
                endpoint="imageUploader"
                content={{
                  button({ ready }) {
                    if (ready) return "Upload your image";
                    return "Getting ready...";
                  },
                }}
                appearance={{
                  allowedContent: "hidden",
                }}
                onClientUploadComplete={(res) => {
                  setImages(res);
                  setIsImageLoading(false);
                  toast("Profile image upload complete");
                }}
                onUploadProgress={() => {
                  setIsImageLoading(true);
                }}
                onUploadError={(error: Error) => {
                  toast.error(error.message);
                }}
              />
            </div>
          </div>
        )}
      </div>
      {!article ? (
        <div className="p-4">
          <Suspense fallback={`Loading...`}>
            <ArticleEditor
              data={draftEditorData}
              onChange={setDraftEditorData}
              editorblock="editorjs-container"
            />
          </Suspense>
        </div>
      ) : (
        <div className="p-4">
          <div id="edit-editor" />
        </div>
      )}
    </div>
  );
};

export default ArticleForm;
