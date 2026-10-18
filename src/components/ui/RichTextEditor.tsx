"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import java from "highlight.js/lib/languages/java";
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  CodeOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";

const lowlight = createLowlight(common);
lowlight.register("java", java);

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Tulis materi di sini...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.isEmpty ? "" : ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-content",
      },
    },
  });

  // Sinkronkan nilai eksternal (mis. saat modal edit diisi).
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt("URL tautan", "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const setImage = () => {
    const url = window.prompt("URL gambar", "https://");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="rte-wrapper">
      <div className="rte-toolbar">
        <Space size={2} wrap>
          <Tooltip title="Undo">
            <Button
              size="small"
              type="text"
              icon={<UndoOutlined />}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            />
          </Tooltip>
          <Tooltip title="Redo">
            <Button
              size="small"
              type="text"
              icon={<RedoOutlined />}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            />
          </Tooltip>
          <Button
            size="small"
            type={editor.isActive("heading", { level: 1 }) ? "primary" : "text"}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </Button>
          <Button
            size="small"
            type={editor.isActive("heading", { level: 2 }) ? "primary" : "text"}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </Button>
          <Tooltip title="Bold">
            <Button
              size="small"
              type={editor.isActive("bold") ? "primary" : "text"}
              icon={<BoldOutlined />}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
          </Tooltip>
          <Tooltip title="Italic">
            <Button
              size="small"
              type={editor.isActive("italic") ? "primary" : "text"}
              icon={<ItalicOutlined />}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
          </Tooltip>
          <Tooltip title="Underline">
            <Button
              size="small"
              type={editor.isActive("underline") ? "primary" : "text"}
              icon={<UnderlineOutlined />}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
          </Tooltip>
          <Tooltip title="Strikethrough">
            <Button
              size="small"
              type={editor.isActive("strike") ? "primary" : "text"}
              icon={<StrikethroughOutlined />}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            />
          </Tooltip>
          <Tooltip title="Bullet list">
            <Button
              size="small"
              type={editor.isActive("bulletList") ? "primary" : "text"}
              icon={<UnorderedListOutlined />}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
          </Tooltip>
          <Tooltip title="Numbered list">
            <Button
              size="small"
              type={editor.isActive("orderedList") ? "primary" : "text"}
              icon={<OrderedListOutlined />}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
          </Tooltip>
          <Tooltip title="Kode Java">
            <Button
              size="small"
              type={editor.isActive("codeBlock") ? "primary" : "text"}
              icon={<CodeOutlined />}
              onClick={() =>
                editor.chain().focus().toggleCodeBlock({ language: "java" }).run()
              }
            />
          </Tooltip>
          <Tooltip title="Tautan">
            <Button
              size="small"
              type={editor.isActive("link") ? "primary" : "text"}
              icon={<LinkOutlined />}
              onClick={setLink}
            />
          </Tooltip>
          <Tooltip title="Gambar (URL)">
            <Button
              size="small"
              type="text"
              icon={<PictureOutlined />}
              onClick={setImage}
            />
          </Tooltip>
          <Tooltip title="Rata kiri">
            <Button
              size="small"
              type={
                editor.isActive({ textAlign: "left" }) ? "primary" : "text"
              }
              icon={<AlignLeftOutlined />}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            />
          </Tooltip>
          <Tooltip title="Rata tengah">
            <Button
              size="small"
              type={
                editor.isActive({ textAlign: "center" }) ? "primary" : "text"
              }
              icon={<AlignCenterOutlined />}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            />
          </Tooltip>
          <Tooltip title="Rata kanan">
            <Button
              size="small"
              type={
                editor.isActive({ textAlign: "right" }) ? "primary" : "text"
              }
              icon={<AlignRightOutlined />}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            />
          </Tooltip>
        </Space>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;
