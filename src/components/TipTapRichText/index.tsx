/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileImageOutlined } from "@ant-design/icons";
import { Link, RichTextEditor } from "@mantine/tiptap";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Input, Select, Upload, UploadProps } from "antd";
import { FC, useEffect } from "react";
import FontSize from "tiptap-extension-font-size";
import styles from "./index.module.scss";

const content =
  '<h2 style="text-align: center;">Rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul> <p>This is a basic example of implementing images. Drag to re-order.</p><img src="https://source.unsplash.com/8xznAGy4HcY/800x400" /><img src="https://source.unsplash.com/K9QHL52rE2k/800x400" />';

const TipTapRichText: FC = () => {
  const editor = useEditor({
    extensions: [
      FontSize,
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      FontFamily,
      Paragraph,
      TextStyle,
      Image.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          style: "width: 30vw;display: inline-block;vertical-align: middle;",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
  });
  const getBase64 = (file: File, callback: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      callback(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const uploadProps: UploadProps = {
    name: "image",
    accept: "image/*",
    showUploadList: false,
    beforeUpload: () => false,
    onChange(info) {
      // @ts-ignore
      getBase64(info.file, (imageUrl: any) => {
        // @ts-ignore
        editor.chain().focus().setImage({ src: imageUrl }).run();
      });
    },
  };

  useEffect(() => {}, []);

  if (!editor) return null;

  return (
    <>
      <button
        className="primaryBtn"
        style={{
          marginBottom: 30,
        }}
        onClick={() => {
          // create html file
          const element = document.createElement("a");
          const file = new Blob([editor.getHTML()], {
            type: "text/html",
          });
          element.href = URL.createObjectURL(file);
          element.download = "index.html";
          document.body.appendChild(element);
          element.click();
        }}
      >
        export html
      </button>
      <RichTextEditor editor={editor} className={styles.tiptap}>
        <RichTextEditor.Toolbar
          sticky
          stickyOffset={60}
          className={styles.toolbar}
        >
          <Input
            key={"fontsize"}
            name="fontsize"
            placeholder="Font size"
            style={{
              width: 120,
            }}
            onChange={(e) => {
              console.log(e.target.value);
              editor.chain().setFontSize(`${e.target.value}px`).run();
            }}
          ></Input>
          <Select
            style={{
              width: 120,
            }}
            placeholder="Font family"
            options={[
              { title: "Unset", value: "Unset" },
              { title: "Arial", value: "Arial" },
              {
                title: "Inter",
                value: "Inter",
              },
              {
                title: "Comic Sans",
                value: "Comic Sans",
              },
              {
                title: "serif",
                value: "serif",
              },
              {
                title: "monospace",
                value: "monospace",
              },
              {
                title: "cursive",
                value: "cursive",
              },
            ]}
            onChange={(value) => {
              if (value === "Unset") {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(value).run();
              }
            }}
          />
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />|
          <button
            onClick={() => {
              // @ts-ignore
              editor.chain().focus().setParagraph().run();
            }}
            style={{
              fontWeight: "400",
            }}
          >
            P
          </button>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
          <RichTextEditor.H5 />
          <RichTextEditor.H6 />
          |
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
          <div>
            <Upload {...uploadProps} rootClassName={styles.upload}>
              <button>
                <FileImageOutlined />
              </button>
            </Upload>
          </div>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content className={styles.content} />
      </RichTextEditor>
    </>
  );
};
export default TipTapRichText;
