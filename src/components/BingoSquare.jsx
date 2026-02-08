import { memo } from 'react'

const BingoSquare = memo(function BingoSquare({
  content,
  isMarked,
  isWinning,
  isNewlyMarked,
  onClick,
  disabled,
  size = 'large',
}) {
  const isFreeSpace = content === '🤖'
  const isClickable = !disabled && !isFreeSpace && !isMarked

  // Dynamic text sizing based on content length for large squares
  const getTextSize = () => {
    if (isFreeSpace) return ''
    const len = content.length
    if (len > 16) return 'text-[9px] sm:text-[10px] md:text-[11px]'
    if (len > 12) return 'text-[10px] sm:text-[11px] md:text-xs'
    return 'text-[11px] sm:text-xs md:text-sm'
  }

  const sizeClasses = size === 'large'
    ? getTextSize()
    : 'text-[5px] sm:text-[6px]'

  return (
    <div className={`perspective ${size === 'large' ? 'aspect-[5/6] p-0.5' : 'aspect-square p-px'}`}>
      <div
        onClick={isClickable ? onClick : undefined}
        className={`
          relative w-full h-full preserve-3d transition-transform duration-500 ease-out
          ${isMarked || isNewlyMarked ? 'rotate-y-180' : ''}
          ${isClickable ? 'cursor-pointer' : ''}
        `}
      >
        {/* Front face - unmarked */}
        <div
          className={`
            absolute inset-0 backface-hidden flex items-center justify-center
            font-display font-semibold text-center leading-snug p-1.5
            ${size === 'large' ? 'rounded-lg' : 'rounded-sm'}
            ${isFreeSpace
              ? 'bg-gradient-to-br from-electric-500/15 to-electric-600/15 border border-electric-500/30'
              : `bg-ink-800/50 border border-ink-700/50 text-ink-300
                ${isClickable
                  ? 'hover:border-coral-400/50 hover:bg-ink-700/60 hover:text-ink-100 hover:shadow-lg hover:shadow-coral-500/10 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                  : ''
                }`
            }
            transition-all duration-200
            ${sizeClasses}
          `}
        >
          {isFreeSpace ? (
            <span className="font-display font-extrabold text-sm sm:text-base md:text-lg bg-gradient-to-br from-electric-300 to-electric-500 bg-clip-text text-transparent select-none">
              FREE
            </span>
          ) : (
            <span className="break-words hyphens-auto">
              {content}
            </span>
          )}
        </div>

        {/* Back face - marked */}
        <div
          className={`
            absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center
            font-display font-bold text-center leading-snug p-1.5
            ${size === 'large' ? 'rounded-lg' : 'rounded-sm'}
            ${isWinning
              ? 'winning-square bg-gradient-to-br from-coral-400 via-coral-500 to-electric-500 text-white'
              : isFreeSpace
                ? 'bg-gradient-to-br from-electric-500 to-electric-600 text-white'
                : 'bg-coral-500 text-white'
            }
            ${sizeClasses}
          `}
        >
          {isFreeSpace ? (
            <span className="font-display font-extrabold text-sm sm:text-base md:text-lg select-none">
              FREE
            </span>
          ) : (
            <span className="break-words hyphens-auto">
              {content}
            </span>
          )}
          {/* Stamp checkmark for large size */}
          {size === 'large' && !isFreeSpace && (
            <span className="absolute inset-0 flex items-center justify-center text-white/30 text-4xl font-black rotate-[-12deg] select-none">
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

export default BingoSquare
