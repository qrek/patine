'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string          // HTML
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

const FONTS = [
  { label: 'Power Grotesk', value: 'Power Grotesk, DM Sans, system-ui, sans-serif' },
  { label: 'Cormorant (Serif)', value: 'Cormorant Garamond, Georgia, serif' },
  { label: 'Instrument Sans', value: 'Instrument Sans, system-ui, sans-serif' },
]

export default function RichTextEditor({ value, onChange, placeholder = 'Tapez votre texte…', minHeight = 120 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'outline-none',
        style: `min-height:${minHeight}px`,
      },
    },
  })

  // Sync external value changes (e.g. on load)
  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false)
    }
  }, [editor, value])

  if (!editor) return null

  const btn = (active: boolean, onClick: () => void, label: string) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
        active ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden tiptap-editor">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
        {btn(editor.isActive('bold'),      () => editor.chain().focus().toggleBold().run(),      'G')}
        {btn(editor.isActive('italic'),    () => editor.chain().focus().toggleItalic().run(),    'I')}
        {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'S')}

        <span className="w-px h-4 bg-gray-200 mx-1" />

        {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 'H1')}
        {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2')}
        {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3')}
        {btn(!editor.isActive('heading'), () => editor.chain().focus().setParagraph().run(), 'P')}

        <span className="w-px h-4 bg-gray-200 mx-1" />

        {/* Police */}
        <select
          className="text-[11px] text-gray-500 bg-transparent border-none outline-none cursor-pointer hover:text-gray-800 py-0.5"
          value={editor.getAttributes('textStyle').fontFamily || ''}
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run()
            } else {
              editor.chain().focus().unsetFontFamily().run()
            }
          }}
        >
          <option value="">Police par défaut</option>
          {FONTS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <span className="w-px h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHardBreak().run() }}
          className="px-2 py-1 rounded text-[11px] text-gray-400 hover:bg-gray-100"
          title="Saut de ligne (Shift+Entrée)"
        >
          ↵
        </button>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="px-3 py-2 text-[14px] leading-relaxed text-gray-800 font-instrument"
        style={{ minHeight }}
        placeholder={placeholder}
      />
    </div>
  )
}
