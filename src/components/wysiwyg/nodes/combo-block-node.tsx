import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React from 'react'
import { getComboById } from '@/lib/db'
import { getMoveById } from '@/lib/moves'
import { COMBO_CHAIN_OPTIONS } from '@/components/connector-picker'
import { ConnectorType } from '@/lib/types'

interface ComboBlockNodeViewProps {
  node: { attrs: { comboId: string } }
  deleteNode: () => void
}

function ComboBlockNodeView({ node, deleteNode }: ComboBlockNodeViewProps) {
  const combo = getComboById(node.attrs.comboId)
  if (!combo) {
    return (
      <NodeViewWrapper as="div" contentEditable={false} className="my-2">
        <div className="flex gap-2 items-center p-2 bg-paper2 border-2 border-rule" style={{ borderRadius: 'var(--radius-sm)' }}>
          <span className="font-body-sm text-ink3">Combo not found</span>
          <button onClick={deleteNode} className="text-red font-body-sm">✕</button>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper as="div" contentEditable={false} className="my-2">
      <div
        className="p-3 bg-paper2 border-2 border-ink shadow-stamp"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-caveat font-bold text-xl">{combo.title}</span>
          <button onClick={deleteNode} className="text-ink3 hover:text-red font-body-sm">✕</button>
        </div>
        {/* Notation chain */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-paper border border-rule" style={{ borderRadius: 'var(--radius-sm)', borderStyle: 'dashed' }}>
          {combo.notation.map((n, i) => {
            const move = getMoveById(n.moveId)
            const connector = COMBO_CHAIN_OPTIONS[n.connector as ConnectorType];
            return (
              <React.Fragment key={i}>
                <span
                  className="font-elite text-xs bg-paper2 border-2 border-ink px-2 py-px"
                  style={{ borderRadius: 'var(--radius-sm)', boxShadow: '1px 1px 0 var(--color-ink)' }}
                >
                  {move?.input ?? n.moveId}
                </span>
                {i < combo.notation.length && !!connector && <span className="font-caveat font-bold text-ink2 text-sm">{connector.display}</span>}
              </React.Fragment>
            )
          })}
        </div>
        <div className="flex gap-3 mt-2 font-elite text-xs text-ink2">
          <span className="text-red font-bold text-sm" style={{ fontFamily: 'Caveat, cursive', fontSize: 16 }}>{combo.damage.toLocaleString()}</span>
          <span>DMG</span>
          <span>·</span>
          <span>{combo.hits} hits</span>
          <span>·</span>
          <span>{combo.situation}</span>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export const ComboBlockNode = Node.create({
  name: 'comboBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      comboId: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="combo-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'combo-block' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ComboBlockNodeView as any)
  },
})
