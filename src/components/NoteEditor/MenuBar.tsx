import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Config } from '../../types';
import InputNotationPicker from './InputNotationPicker';

interface MenuBarProps {
  editor: Editor;
  config: Config;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, config, onImageUpload }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showInputPicker, setShowInputPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImageFromUrl = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertInput = (notation: string) => {
    editor.chain().focus().insertContent(notation + ' ').run();
    setShowInputPicker(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2">
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('bold') ? 'bg-gray-300' : ''
        }`}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('italic') ? 'bg-gray-300' : ''
        }`}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Headings */}
      <select
        onChange={(e) => {
          const level = parseInt(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: level as any }).run();
          }
        }}
        className="p-2 rounded border border-gray-300 text-sm"
        value={
          editor.isActive('heading', { level: 1 })
            ? 1
            : editor.isActive('heading', { level: 2 })
            ? 2
            : editor.isActive('heading', { level: 3 })
            ? 3
            : 0
        }
      >
        <option value="0">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>

      {/* Font Size */}
      <select
        onChange={(e) => {
          const size = e.target.value;
          if (size === 'unset') {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(size).run();
          }
        }}
        className="p-2 rounded border border-gray-300 text-sm"
      >
        <option value="unset">Size</option>
        <option value="10px">10px</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="24px">24px</option>
        <option value="32px">32px</option>
        <option value="48px">48px</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Game-specific Colors */}
      <button
        onClick={() => editor.chain().focus().setColor(config.colors.light).run()}
        className="px-3 py-2 rounded text-sm font-medium hover:bg-gray-200"
        style={{ color: config.colors.light }}
        title="Light"
      >
        L
      </button>

      <button
        onClick={() => editor.chain().focus().setColor(config.colors.medium).run()}
        className="px-3 py-2 rounded text-sm font-medium hover:bg-gray-200"
        style={{ color: config.colors.medium }}
        title="Medium"
      >
        M
      </button>

      <button
        onClick={() => editor.chain().focus().setColor(config.colors.heavy).run()}
        className="px-3 py-2 rounded text-sm font-medium hover:bg-gray-200"
        style={{ color: config.colors.heavy }}
        title="Heavy"
      >
        H
      </button>

      <button
        onClick={() => editor.chain().focus().setColor(config.colors.ultimate).run()}
        className="px-3 py-2 rounded text-sm font-medium hover:bg-gray-200"
        style={{ color: config.colors.ultimate }}
        title="Ultimate"
      >
        U
      </button>

      <button
        onClick={() => editor.chain().focus().setColor(config.colors.skill).run()}
        className="px-3 py-2 rounded text-sm font-medium hover:bg-gray-200"
        style={{ color: config.colors.skill }}
        title="Skill"
      >
        S
      </button>

      {/* Custom Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded hover:bg-gray-200 flex items-center gap-1"
          title="Custom color"
        >
          <div
            className="w-4 h-4 border border-gray-400 rounded"
            style={{ backgroundColor: customColor }}
          />
          ▼
        </button>
        {showColorPicker && (
          <div className="absolute top-full mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-20">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                editor.chain().focus().setColor(e.target.value).run();
              }}
              className="w-32 h-8"
            />
            <button
              onClick={() => setShowColorPicker(false)}
              className="mt-2 w-full px-2 py-1 bg-gray-200 rounded text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('bulletList') ? 'bg-gray-300' : ''
        }`}
        title="Bullet list"
      >
        • List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('orderedList') ? 'bg-gray-300' : ''
        }`}
        title="Numbered list"
      >
        1. List
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Links */}
      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('link') ? 'bg-gray-300' : ''
        }`}
        title="Add link"
      >
        🔗 Link
      </button>

      {/* Images */}
      <label className="p-2 rounded hover:bg-gray-200 cursor-pointer" title="Upload image">
        📷 Upload
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </label>

      <button onClick={addImageFromUrl} className="p-2 rounded hover:bg-gray-200" title="Image from URL">
        🖼️ URL
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Input Notation Picker */}
      <div className="relative">
        <button
          onClick={() => setShowInputPicker(!showInputPicker)}
          className="px-3 py-2 rounded bg-blue-100 hover:bg-blue-200 text-sm font-medium"
          title="Add move input"
        >
          ⌨️ Add Input
        </button>
        {showInputPicker && (
          <div className="absolute top-full mt-1 z-20">
            <InputNotationPicker
              config={config}
              onInsert={insertInput}
              onClose={() => setShowInputPicker(false)}
            />
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Clear Formatting */}
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="p-2 rounded hover:bg-gray-200 text-sm"
        title="Clear formatting"
      >
        Clear Format
      </button>
    </div>
  );
};

export default MenuBar;
