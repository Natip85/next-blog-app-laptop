// @ts-ignore
import Header from "editorjs-header-with-alignment";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import Table from "@editorjs/table";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import LinkTool from "@editorjs/link";
// @ts-ignore
import ImageTool from "@editorjs/image";
// @ts-ignore
import Quote from "@editorjs/quote";
// @ts-ignore
import Marker from "@editorjs/marker";
// @ts-ignore
import SimpleImage from "@editorjs/simple-image";
// @ts-ignore
import AttachesTool from "@editorjs/attaches";
// @ts-ignore
import Paragraph from "editorjs-paragraph-with-alignment";

// import AlignmentTuneTool from "editorjs-text-alignment-blocktune";

// @ts-ignore
import FontSize from "editorjs-inline-font-size-tool";
// @ts-ignore
import Underline from "@editorjs/underline";

export const EditorTools = {
  underline: Underline,
  fontSize: FontSize,
  // anyTuneName: {
  //   class: AlignmentTuneTool,
  //   config: {
  //     default: "right",
  //     blocks: {
  //       header: "center",
  //       list: "right",
  //     },
  //   },
  // },
  header: {
    class: Header,
    config: {
      // placeholder: "Let`s write an awesome story! ✨",
      defaultAlignment: "left",
      levels: [1, 2, 3, 4, 5],
      defaultLevel: 1,
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      inlineToolbar: true,

      defaultStyle: "unordered",
    },
  },
  checklist: {
    class: CheckList,
    inlineToolbar: true,
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  attaches: {
    class: AttachesTool,
    config: {
      endpoint: "http://localhost:8008/uploadFile",
    },
  },
  linkTool: {
    class: LinkTool,
    config: {
      inlineToolbar: true,

      endpoint: "http://localhost:8008/fetchUrl",
    },
  },
  image: {
    class: ImageTool,
    config: {
      /**
       * Custom uploader
       */
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile: async (file: File) => {
          // Log message
          console.log("Uploading file:", file);

          //Return a resolved promise
          return Promise.resolve({
            success: 1,
            file: {
              url: "https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg",
            },
            caption: "myy img",
            withBorder: false,
            withBackground: false,
            stretched: true,
          }).then((res) => {
            console.log(res);
          });
        },

        /**
         * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
         * @param {string} url - pasted image URL
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByUrl(url: any) {
          // Log message
          console.log("Uploading URL:", url);
          // Return a resolved promise
          return Promise.resolve({
            success: 1,
            file: {
              url: "https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg",
            },
          });
        },
      },
    },
  },

  quote: {
    class: Quote,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+O",
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },
  Marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  simpleImage: SimpleImage,
};

export const i18n = {
  messages: {},
};
export const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "Let's write something AWESOME 🌟",
        level: 1,
      },
    },
  ],
};
