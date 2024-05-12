"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EditorJS from "@editorjs/editorjs";
import { EditorTools } from "@/lib/editorTools";
import { convertFromJSON, convertToJSON } from "./ArticleForm";
import { createArticle } from "@/actions/createArticle";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { publishDraftArticle } from "../../actions/publishDraftArticle";
import { Textarea } from "../ui/textarea";
import { Terminal } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface PublishArticleFormProps {
  draftEditorData: any;
  publishEditorData: any;
  article: any;
  image: string | undefined;
}
const PublishArticleForm = ({
  draftEditorData,
  article,
  publishEditorData,
  image,
}: PublishArticleFormProps) => {
  const user = useCurrentUser();
  const router = useRouter();
  const ref = useRef<EditorJS | null>(null);

  const [isPending, startTransition] = useTransition();
  const [topic, setTopic] = useState<string | undefined>();
  const [prevSubtitle, setPrevSubtitle] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (topic && topic?.length < 2) {
      setError("Topic required (Min 2 characters)");
    } else {
      setError("");
    }
    if (article) {
      if (!ref.current) {
        const editor = new EditorJS({
          readOnly: true,
          minHeight: 100,
          holder: "publishing-editor",
          tools: EditorTools,
          data: publishEditorData,
        });
        ref.current = editor;
      }
    } else {
      if (!ref.current) {
        const editor = new EditorJS({
          readOnly: true,
          minHeight: 100,
          holder: "publishing-editor",
          tools: EditorTools,
          data: draftEditorData,
        });
        ref.current = editor;
      }
    }
  }, [topic, article, draftEditorData, publishEditorData]);

  function handlePublishArticle() {
    startTransition(() => {
      if (!topic || topic.length < 2) {
        setError("Topic required (Min 2 characters)");
        return;
      }
      if (article) {
        localStorage.removeItem("edit-document");
        const dataToCreate = {
          version: publishEditorData.version ?? null,
          time: publishEditorData.time ?? null,
          blocks: convertToJSON(publishEditorData?.blocks),
        };
        const topicId = article ? article.categoryId : undefined;
        publishDraftArticle(
          article.id,
          dataToCreate,
          topicId,
          topic,
          prevSubtitle,
          image
        ).then((res) => {
          toast.success("Article successfully published");
          router.push(`/article-details/${res.success?.id}`);
        });
      } else {
        localStorage.removeItem("document");
        const dataToCreate = {
          version: draftEditorData.version ?? null,
          time: draftEditorData.time ?? null,
          blocks: convertToJSON(draftEditorData?.blocks),
        };
        createArticle(dataToCreate, true, topic, prevSubtitle, image).then(
          (res) => {
            if (res.success) {
              toast.success("Article successfully created");
              router.push(`/article-details/${res.success?.id}`);
            }
          }
        );
      }
    });
  }
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-5 p-10 max-h-[75vh] sm:max-h-[75vh] overflow-y-auto">
        <div className="flex-1 flex flex-col justify-between gap-5">
          <div className="relative aspect-video h-[50px]">
            <h2 className="font-bold mb-5">Article preview</h2>
            {image ? (
              <div className="relative max-h-[200px] w-full aspect-video  px-10">
                <Image
                  src={image}
                  alt={"article-pic"}
                  fill
                  sizes="2"
                  className="w-full mx-auto"
                />
              </div>
            ) : (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  Include a high-quality image in your article to make it more
                  inviting to readers.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="pt-36">
            <div id="publishing-editor" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-10">
          <div>
            Publishing to: <span className="font-bold">{user?.name}</span>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="category" className="text-xs">
              Add a topics so readers know what your story is about
            </label>
            <Input
              placeholder="Add a topic..."
              className="rounded-none"
              onChange={(e) => setTopic(e.target.value)}
            />
            {error && <div className="text-xs text-destructive">{error}</div>}
          </div>
          <div className="flex flex-col gap-3">
            <Textarea
              id="preview-subtitle"
              placeholder="Write an article preview subtitle..."
              onChange={(e) => setPrevSubtitle(e.target.value)}
            />
            <label
              htmlFor="preview-subtitle"
              className="text-xs text-muted-foreground"
            >
              <span className="font-bold">Note:</span> Changes here will affect
              how your story appears in public places like the homepage and in
              subscribers’ inboxes — not the contents of the story itself.
            </label>
          </div>
        </div>
      </div>
      <div className="text-end">
        <Button
          onClick={handlePublishArticle}
          disabled={isPending}
          size={"sm"}
          className="bg-green-600 rounded-3xl hover:bg-green-700 w-full sm:w-fit"
        >
          Publish now
        </Button>
      </div>
    </>
  );
};

export default PublishArticleForm;
