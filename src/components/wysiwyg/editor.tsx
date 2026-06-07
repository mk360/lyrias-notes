import { getMoveById } from '@/lib/moves'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react'
import { ComboBlockNode } from './nodes/combo-block-node'
import { InlineClipNode } from './nodes/inline-clip-node'
import { MoveChipNode, setMoveResolver } from './nodes/move-chip-node'
import { WYSIWYGToolbar } from './toolbar'
import { useApp } from '@/context/AppContext'

interface NotesEditorProps {
  content: object
  onChange: (doc: object) => void
  opponentCharId?: string
  playerCharId: string
  playerId?: string
  matchupId?: string
  readOnly?: boolean
  compact?: boolean
}

export interface NotesEditorHandle {
  insertMoveChipAtCursor: (characterId: string, moveId: string) => void
}


export const NotesEditor = forwardRef<NotesEditorHandle, NotesEditorProps>(function NotesEditor({
  content,
  onChange,
  opponentCharId,
  playerCharId,
  matchupId,
  readOnly = false,
  compact = false,
}, ref) {
  const { updateMatchupRating, updateMatchupNotes } = useApp();
  // Register move resolver
  useEffect(() => {
    setMoveResolver((charId, moveId) => {
      const move = getMoveById(moveId)
      if (!move) return moveId
      return move.input
    })
  }, [])


  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: {
        levels: [1, 2, 3]
      }, bulletList: {} }),
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: 'Start writing your notes…' }),
      MoveChipNode,
      InlineClipNode,
      ComboBlockNode
    ],
    content: Object.keys(content).length ? content : undefined,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
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
    editor.chain().focus().insertContent(" ").insertContent({
      type: 'moveChip',
      attrs: { characterId, moveId },
    }).insertContent(" ").run()
  }, [editor])

  useImperativeHandle(ref, () => ({
    insertMoveChipAtCursor
  }), [insertMoveChipAtCursor])
  return (
    <>
      <div className="flex flex-col h-full">
        {!readOnly && (
          <WYSIWYGToolbar
            editor={editor}
            playerCharacterId={playerCharId}
            opponentCharId={opponentCharId}
            matchupId={matchupId}
            onImport={(importedNotes, importedRating) => {
              updateMatchupNotes(playerCharId, opponentCharId!, importedNotes)
              editor?.chain().setContent(importedNotes, true).run();
              if (importedRating !== null) updateMatchupRating(playerCharId, opponentCharId!, importedRating)
            }}
            compact={compact}
          />
        )}

        <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </>
  )
})
