'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-8">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 ${editor.isActive('bold') ? 'bg-white dark:bg-slate-800' : ''}`}
        >
          <span className="material-symbols-outlined text-[20px]">format_bold</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 ${editor.isActive('italic') ? 'bg-white dark:bg-slate-800' : ''}`}
        >
          <span className="material-symbols-outlined text-[20px]">format_italic</span>
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 ${editor.isActive('bulletList') ? 'bg-white dark:bg-slate-800' : ''}`}
        >
          <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 ${editor.isActive('orderedList') ? 'bg-white dark:bg-slate-800' : ''}`}
        >
          <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
        <button type="button" onClick={addLink} className={`p-2 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 ${editor.isActive('link') ? 'bg-white dark:bg-slate-800' : ''}`}>
          <span className="material-symbols-outlined text-[20px]">link</span>
        </button>
        <button type="button" onClick={addImage} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-[20px]">image</span>
        </button>
        <button type="button" className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 ml-auto">
          <span className="material-symbols-outlined text-[20px]">code</span>
        </button>
      </div>
      <EditorContent editor={editor} className="p-6 min-h-[500px] prose dark:prose-invert max-w-none focus:outline-none" />
    </div>
  );
}
