import { getBlobUrl, getClipById } from '@/lib/db'
import { Clip } from '@/lib/types'
import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { useEffect, useState } from 'react'

interface InlineClipNodeViewProps {
  node: {
    attrs: { clipId: string }
  }
  deleteNode: () => void
}

function InlineClipNodeView({ node, deleteNode }: InlineClipNodeViewProps) {
  const { clipId } = node.attrs
  const [showModal, setShowModal] = useState(false)
  const [clip, setClip] = useState<Clip | null>(null)
  const [loading, setLoading] = useState(true)
  const [resolvedUrl, setResolvedUrl] = useState<string>('')
  console.log(clip)
  useEffect(() => {
    let objectUrl: string | null = null

    getClipById(clipId).then(async meta => {
      setClip(meta)
      if (!meta) { setLoading(false); return }

      if (meta.url) {
        setResolvedUrl(meta.url)
      } else {
        const url = await getBlobUrl(clipId)
        console.log(url)
        if (url) { setResolvedUrl(url) }
      }
      setLoading(false)
    })

    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [clipId])

  if (loading) return (
    <NodeViewWrapper as="div" className="my-2" contentEditable={false}>
      <div className="p-2 font-body-sm text-ink3">Loading clip…</div>
    </NodeViewWrapper>
  )

  if (!clip) return (
    <NodeViewWrapper as="div" className="my-2">
      <div className="inline-flex items-center gap-2 p-2 bg-paper2 border-2 border-rule" style={{ borderRadius: 'var(--radius-sm)' }}>
        <span className="font-body-sm text-ink3">Clip not found</span>
        <button onClick={deleteNode} className="text-red font-body-sm">✕ remove</button>
      </div>
    </NodeViewWrapper>
  )

  return (
    <NodeViewWrapper as="div" className="my-2" contentEditable={false}>
      <div
        className="flex gap-3 p-3 bg-paper2 border-2 border-ink shadow-stamp"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        {/* Thumbnail */}
        <div
          className="relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ width: 144, height: 88, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1.5px solid var(--color-ink)' }}
          onClick={() => setShowModal(true)}
        >
          {clip.thumbnailUrl ? (
            <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sky200">
              <span className="text-3xl text-sky700">▶</span>
            </div>
          )}
          <span className="absolute bottom-1 right-1 font-elite text-xs bg-ink text-paper px-1" style={{ borderRadius: '2px' }}>
            {clip.duration}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="font-caveat font-bold text-xl text-ink leading-tight">{clip.title}</div>
            {clip.caption && <div className="font-body-sm text-ink2 mt-1">{clip.caption}</div>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="font-body-sm text-sky700 border-2 border-rule px-2 py-1 hover:bg-paper"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >↗ open</button>
            <button
              onClick={deleteNode}
              className="font-body-sm text-red border-2 border-rule px-2 py-1 hover:border-red"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >✕</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(31,45,62,0.6)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-paper border-2 border-ink shadow-float p-4 max-w-2xl w-full mx-4"
            style={{ borderRadius: 'var(--radius-lg)' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-caveat font-bold border-2 border-ink shadow-stamp-sm bg-paper"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >✕</button>
            <h3 className="font-display-md mb-2">{clip.title}</h3>
            <video src={resolvedUrl} controls className="w-full" style={{ borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}

export const InlineClipNode = Node.create({
  name: 'inlineClip',

  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      clipId: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="inline-clip"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'inline-clip' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineClipNodeView as any)
  },
})
