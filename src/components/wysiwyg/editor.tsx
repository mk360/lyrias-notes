import React, { useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Placeholder from '@tiptap/extension-placeholder'
import {
  SlashCmd, Slash,
  enableKeyboardNavigation,
  SlashCmdProvider,
  createSuggestionsItems,
} from '@harshtalks/slash-tiptap'
import { MoveChipNode, setMoveResolver } from './nodes/move-chip-node'
import { InlineClipNode } from './nodes/inline-clip-node'
import { ComboBlockNode } from './nodes/combo-block-node'
import { WYSIWYGToolbar } from './toolbar'
import { getMoveById } from '@/lib/moves'
import { getCombosByCharacter } from '@/lib/db'

interface NotesEditorProps {
  content: object
  onChange: (doc: object) => void
  opponentCharId?: string
  playerCharId?: string
  playerId?: string
  matchupId?: string
  readOnly?: boolean
  compact?: boolean
}

export interface NotesEditorHandle {
  insertMoveChipAtCursor: (characterId: string, moveId: string) => void
}

// SlashCmd command suggestions
function buildSlashItems(playerCharId?: string, playerId?: string) {
  const comboItems = (playerCharId && playerId)
    ? getCombosByCharacter(playerId, playerCharId).map(combo => ({
        title: combo.title,
        searchTerms: ['combo', combo.title.toLowerCase(), ...combo.tags],
        command: ({ editor, range }: { editor: any; range: any }) => {
          editor.chain().focus().deleteRange(range).insertContent({
            type: 'comboBlock',
            attrs: { comboId: combo.id },
          }).run()
        },
      }))
    : []

  return createSuggestionsItems([
    {
      title: 'Heading 1',
      searchTerms: ['h1', 'heading'],
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run()
      },
    },
    {
      title: 'Heading 2',
      searchTerms: ['h2', 'section'],
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run()
      },
    },
    {
      title: 'Bullet List',
      searchTerms: ['ul', 'list', 'bullet'],
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run()
      },
    },
    ...comboItems,
  ])
}

export const NotesEditor = forwardRef<NotesEditorHandle, NotesEditorProps>(function NotesEditor({
  content,
  onChange,
  opponentCharId,
  playerCharId,
  playerId,
  matchupId,
  readOnly = false,
  compact = false,
}, ref) {
  // Register move resolver
  useEffect(() => {
    setMoveResolver((charId, moveId) => {
      const move = getMoveById(moveId)
      if (!move) return moveId
      return `${move.name} · ${move.startup}f`
    })
  }, [])

  const slashItems = buildSlashItems(playerCharId, playerId)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bulletList: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      ListItem,
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: 'Start writing your matchup notes…' }),
      MoveChipNode,
      InlineClipNode,
      ComboBlockNode,
      Slash.configure({
        suggestion: {
          items: () => slashItems,
        },
      }),
    ],
    content: Object.keys(content).length ? content : undefined,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v),
      },
      attributes: {
        class: 'outline-none min-h-full',
        style: `
          font-family: Fredoka, sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-ink);
          padding: 16px;
        `,
      },
    },
  }, [readOnly])

  // Sync external content changes
  useEffect(() => {
    if (!editor) return
    const currentJson = editor.getJSON()
    if (JSON.stringify(currentJson) !== JSON.stringify(content) && Object.keys(content).length > 0) {
      editor.commands.setContent(content)
    }
  }, [content])  // eslint-disable-line

  const insertMoveChipAtCursor = useCallback((characterId: string, moveId: string) => {
    if (!editor) return
    editor.chain().focus().insertContent({
      type: 'moveChip',
      attrs: { characterId, moveId },
    }).run()
  }, [editor])

  useImperativeHandle(ref, () => ({
    insertMoveChipAtCursor
  }), [insertMoveChipAtCursor])

  return (
    <SlashCmdProvider>
      <div className="flex flex-col h-full">
        {!readOnly && (
          <WYSIWYGToolbar
            editor={editor}
            opponentCharId={opponentCharId}
            matchupId={matchupId}
            compact={compact}
          />
        )}

        <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
          <EditorContent editor={editor} className="h-full" />
        </div>

        {/* SlashCmd command palette */}
        {!readOnly && editor && (
          <SlashCmd.Root editor={editor}>
            <SlashCmd.Cmd
              className="bg-paper border-2 border-ink shadow-stamp-lg overflow-hidden"
              style={{ borderRadius: 'var(--radius-md)', minWidth: 220, maxHeight: 240 } as React.CSSProperties}
            >
              <SlashCmd.Empty className="p-3 font-body-sm text-ink3">No commands</SlashCmd.Empty>
              <SlashCmd.List className="py-1">
                {slashItems.map(item => (
                  <SlashCmd.Item
                    key={item.title}
                    value={item.title}
                    onCommand={(val: any) => item.command(val)}
                    className="flex items-center gap-2 px-3 py-2 font-fredoka text-sm text-ink hover:bg-sky100 cursor-pointer data-[selected=true]:bg-sky100"
                  >
                    <span>{item.title}</span>
                  </SlashCmd.Item>
                ))}
              </SlashCmd.List>
            </SlashCmd.Cmd>
          </SlashCmd.Root>
        )}
      </div>
    </SlashCmdProvider>
  )
})
