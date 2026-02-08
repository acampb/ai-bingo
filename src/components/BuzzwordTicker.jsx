import { useEffect, useRef, useState } from 'react'

// Saturated neon colors for settled words
const SETTLED_COLORS = [
  '#ff4040', '#00e5ff', '#ff40e0', '#ffe040',
  '#4080ff', '#40ff80', '#ff8c00', '#c040ff',
]

export default function BuzzwordTicker({ buzzwords }) {
  const containerRef = useRef(null)
  // Track which buzzwords were present on first render (pre-existing, no entrance animation)
  const [initialWords] = useState(() => new Set(buzzwords))
  const prevCountRef = useRef(buzzwords.length)

  // Auto-scroll to show the newest word (leftmost) when list grows
  useEffect(() => {
    if (buzzwords.length > prevCountRef.current && containerRef.current) {
      containerRef.current.scrollLeft = 0
    }
    prevCountRef.current = buzzwords.length
  }, [buzzwords.length])

  if (buzzwords.length === 0) return null

  // Show newest first (reversed)
  const reversed = [...buzzwords].reverse()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Fade-out gradient edges */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-ink-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-ink-950 to-transparent z-10 pointer-events-none" />

        <div
          ref={containerRef}
          className="flex items-center gap-3 px-5 py-3.5 overflow-x-auto bg-ink-950/95 backdrop-blur-md border-t border-ink-800/60"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {reversed.map((word, i) => {
            const originalIndex = buzzwords.indexOf(word)
            const isNewest = i === 0 && !initialWords.has(word)
            const color = SETTLED_COLORS[originalIndex % SETTLED_COLORS.length]

            return (
              <span
                key={`${word}-${originalIndex}`}
                className={`
                  inline-flex items-center gap-2 shrink-0
                  px-4 py-2 rounded-full
                  font-mono text-sm font-extrabold uppercase tracking-wider
                  transition-transform duration-500 ease-out
                  ${isNewest
                    ? 'ticker-word-enter border-2 border-white/40 bg-white/10'
                    : 'ticker-word-settled border border-ink-700/50 bg-ink-900/80'}
                `}
                style={isNewest ? undefined : {
                  color,
                  textShadow: `0 0 8px ${color}88, 0 0 20px ${color}44`,
                  boxShadow: `0 0 6px ${color}33`,
                }}
              >
                {word}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
