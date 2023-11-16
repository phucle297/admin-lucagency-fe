/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileImageOutlined } from "@ant-design/icons";
import { getBase64 } from "@helpers/getBase64";
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
import { FC } from "react";
import FontSize from "tiptap-extension-font-size";
import styles from "./index.module.scss";

interface ITipTapRichTextProps {
  defaultContent: string;
  content: string;
  setContent: (htmlData: string) => void;
}

const TipTapRichText: FC<ITipTapRichTextProps> = ({
  content,
  setContent,
  defaultContent,
}) => {
  const editor = useEditor(
    {
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
      content: content,
      onTransaction: (tr) => {
        setContent(tr.editor.getHTML());
      },
    },
    [defaultContent]
  );

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

  if (!editor) return null;

  return (
    <>
      <h2
        style={{
          marginBottom: 20,
        }}
      >
        Detail Post
      </h2>
      <RichTextEditor editor={editor} className={styles.tiptap}>
        <RichTextEditor.Toolbar
          sticky
          stickyOffset={60}
          className={styles.toolbar}
        >
          <div className={styles.group}>
            <Input
              key={"fontsize"}
              name="fontsize"
              placeholder="Font size"
              style={{
                width: 120,
                minWidth: 120,
                height: 32,
              }}
              className={styles.item}
              onChange={(e) => {
                editor.chain().setFontSize(`${e.target.value}px`).run();
              }}
            ></Input>
            <Select
              style={{
                width: 120,
              }}
              className={styles.item}
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
            <p className={styles.line}>|</p>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <p className={styles.line}>|</p>
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
            <p className={styles.line}>|</p>
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
          </div>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content className={styles.content} />
      </RichTextEditor>
    </>
  );
};
export default TipTapRichText;
