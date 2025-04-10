// pages/editor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  Paperclip,
} from "lucide-react";

export default function     EditorPage() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p> </p>",
  });

  return (
    <div className="w-full">
      <div className="w-full  bg-white rounded-2xl  ">
        {/* Heading */}
        <div className="mb-4">
          <h2 className="text-[16px] font-semibold text-gray-800">
            Terms & Conditions
          </h2>
          <p className="text-[16px] text-gray-500">Edit monthly plan here</p>
        </div>

        {/* Editor Toolbar */}
        <div className="border rounded-t-2xl px-4 py-2 flex items-center gap-3 bg-white">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="text-gray-600 hover:text-black"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="text-gray-600 hover:text-black"
          >
            <Italic size={18} />
          </button>
          <button className="text-gray-400 cursor-not-allowed" disabled>
            <Paperclip size={18} />
          </button>
          <button className="text-gray-400 cursor-not-allowed" disabled>
            <Link size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className="text-gray-600 hover:text-black"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className="text-gray-600 hover:text-black"
          >
            <ListOrdered size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            className="text-gray-600 hover:text-black"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            className="text-gray-600 hover:text-black"
          >
            <AlignCenter size={18} />
          </button>

          {/* Font Size */}
          <input
            type="number"
            min="12"
            max="72"
            className="ml-auto w-16 p-1 border rounded-md text-center text-sm"
            value={24}
            disabled
          />
        </div>

        {/* Editor Content */}
        <div className="border-t border rounded-b-2xl overflow-hidden">
          <EditorContent
            editor={editor}
            className="min-h-[300px] p-4 focus:outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
