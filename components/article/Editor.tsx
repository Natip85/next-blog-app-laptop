"use client";
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EditorTools } from "@/lib/editorTools";
interface EditorProps {
  data: OutputData;
  onChange: (value: OutputData) => void;
  editorblock: string;
}
const Editor = ({ data, onChange, editorblock }: EditorProps) => {
  const ref = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,

        tools: EditorTools,
        data: data,
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
          let logDataString = JSON.stringify(data);
          localStorage.setItem("document", logDataString);
        },
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return <div id={editorblock} />;
};

export default memo(Editor);
