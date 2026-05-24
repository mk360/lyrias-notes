import type { Clip } from '@/lib/types'
import { useState } from 'react'

interface InlineClipProps {
  clip: Clip
  onOpen?: () => void
  onReplace?: () => void
  onRemove?: () => void
}

interface ClipModalProps {
  clip: Clip
  onClose: () => void
}

function ClipModal({ clip, onClose }: ClipModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(31,45,62,0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-paper border-2 border-ink shadow-float p-4 max-w-2xl w-full mx-4"
        style={{ borderRadius: 'var(--radius-lg)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-caveat font-bold text-ink hover:text-red border-2 border-ink shadow-stamp-sm bg-paper"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          ✕
        </button>
        <h3 className="font-display-md font-caveat mb-2">{clip.title}</h3>
        {clip.caption && <p className="font-body-sm text-ink2 mb-3">{clip.caption}</p>}
        <div
          className="w-full bg-sky200 flex items-center justify-center"
          style={{ height: 360, borderRadius: 'var(--radius-md)', border: '2px solid var(--color-ink)' }}
        >
          <video
            src={clip.url}
            controls
            className="w-full h-full object-contain"
            style={{ borderRadius: 'var(--radius-md)' }}
          />
        </div>
      </div>
    </div>
  )
}

export function InlineClip({ clip, onOpen, onReplace, onRemove }: InlineClipProps) {
  const [showModal, setShowModal] = useState(false)

  const handleOpen = () => {
    setShowModal(true)
    onOpen?.()
  }

  return (
    <>
      <div
        className="flex gap-3 p-3 bg-paper2 border-2 border-ink shadow-stamp my-2"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        {/* Thumbnail */}
        <div
          className="relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ width: 144, height: 88, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1.5px solid var(--color-ink)' }}
          onClick={handleOpen}
        >
          {clip.thumbnailUrl ? (
            <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-sky200), var(--color-sky300))' }}
            >
              <span className="text-3xl text-sky700">▶</span>
            </div>
          )}
          {/* Duration badge */}
          <span
            className="absolute bottom-1 right-1 font-elite text-xs bg-ink text-paper px-1"
            style={{ borderRadius: '2px' }}
          >
            {clip.duration}
          </span>
        </div>

        {/* Info + actions */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="font-caveat font-bold text-xl text-ink leading-tight truncate">{clip.title}</div>
            {clip.caption && (
              <div className="font-body-sm text-ink2 mt-1 line-clamp-2">{clip.caption}</div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleOpen}
              className="font-body-sm text-sky700 border-2 border-rule px-2 py-1 hover:border-ink hover:bg-paper transition-colors"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              ↗ open
            </button>
            {onReplace && (
              <button
                onClick={onReplace}
                className="font-body-sm text-ink2 border-2 border-rule px-2 py-1 hover:border-ink hover:bg-paper transition-colors"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                📎 replace
              </button>
            )}
            {onRemove && (
              <button
                onClick={onRemove}
                className="font-body-sm text-red border-2 border-rule px-2 py-1 hover:border-red transition-colors"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && <ClipModal clip={clip} onClose={() => setShowModal(false)} />}
    </>
  )
}
