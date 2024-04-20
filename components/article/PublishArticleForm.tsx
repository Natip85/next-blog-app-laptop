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

interface PublishArticleFormProps {
  article: any;
}
const PublishArticleForm = ({ article }: PublishArticleFormProps) => {
  const user = useCurrentUser();
  const router = useRouter();
  const ref = useRef<EditorJS | null>(null);
  const [editEditorData, setEditEditorData] = useState<any>(() => {
    const storedData = localStorage.getItem("document");
    return storedData
      ? JSON.parse(storedData)
      : {
          time: new Date().getTime(),
          blocks: convertFromJSON(article?.editorData?.blocks),
        };
  });
  const [isPending, startTransition] = useTransition();
  const [topic, setTopic] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  console.log("this art", article);

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
          data: { ...editEditorData } || {
            time: new Date().getTime(),
            blocks: convertFromJSON(editEditorData),
          },
        });
        ref.current = editor;
      }
    }
  }, [article, editEditorData, topic]);

  function handlePublishArticle() {
    startTransition(() => {
      if (!topic || topic.length < 2) {
        setError("Topic required (Min 2 characters)");
        return;
      }

      localStorage.removeItem("document");
      const dataToCreate = {
        version: article.version ?? null,
        time: article.time ?? null,
        blocks: convertToJSON(article?.blocks),
      };
      createArticle(dataToCreate, true, topic).then((res) => {
        if (res.success) {
          toast.success("Article successfully created");
          router.push("/stories");
        }
      });
    });
  }
  function publishDraft() {}
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-5 p-10">
      <div className="flex-1 flex flex-col gap-5">
        <div className="font-bold">Article preview</div>
        <div className="max-h-[500px] overflow-y-auto">
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
        <div>
          <Button
            onClick={handlePublishArticle}
            disabled={isPending}
            size={"sm"}
            className="bg-green-600 rounded-3xl hover:bg-green-700"
          >
            Publish now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishArticleForm;
