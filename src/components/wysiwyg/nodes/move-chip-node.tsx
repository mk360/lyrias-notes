import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

// Storage for move lookup — injected at editor init
let moveResolver: ((characterId: string, moveId: string) => string) | null = null

export function setMoveResolver(fn: (characterId: string, moveId: string) => string) {
  moveResolver = fn
}

interface MoveChipNodeViewProps {
  node: {
    attrs: {
      characterId: string
      moveId: string
    }
  }
  deleteNode: () => void
  selected: boolean
}

function MoveChipNodeView({ node, deleteNode, selected }: MoveChipNodeViewProps) {
  const { characterId, moveId } = node.attrs
  const label = moveResolver?.(characterId, moveId) ?? moveId

  return (
    <NodeViewWrapper
      as="span"
      className="inline"
      style={{ display: 'inline-flex', verticalAlign: 'middle' }}
    >
      <span
        className={`
          inline-flex items-center gap-1
          font-elite text-xs
          bg-paper2 border-2 border-ink
          px-2 py-px
          cursor-pointer
          transition-colors
          select-none
          ${selected ? 'bg-sky100' : 'hover:bg-paper3'}
        `}
        style={{
          borderRadius: 'var(--radius-sm)',
          boxShadow: '1.5px 1.5px 0 rgba(31,45,62,0.33)',
          lineHeight: 1.4,
        }}
        title="Click ✕ to remove"
      >
        {label}
        <button
          type="button"
          onClick={deleteNode}
          className="ml-px text-ink3 hover:text-red leading-none"
          aria-label="Remove chip"
          style={{ fontSize: 10 }}
        >
          ✕
        </button>
      </span>
    </NodeViewWrapper>
  )
}

export const MoveChipNode = Node.create({
  name: 'moveChip',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      characterId: { default: '' },
      moveId:      { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="move-chip"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'move-chip' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MoveChipNodeView as any)
  },
})
