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

  const sizeClasses = size === 'large'
    ? 'text-[10px] sm:text-xs md:text-sm'
    : 'text-[5px] sm:text-[6px]'

  return (
    <div className={`perspective aspect-square ${size === 'large' ? 'p-0.5' : 'p-px'}`}>
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
            font-mono font-medium text-center leading-tight p-1
            ${size === 'large' ? 'rounded-lg' : 'rounded-sm'}
            ${isFreeSpace
              ? 'bg-gradient-to-br from-electric-500 to-electric-600 text-white text-2xl sm:text-3xl'
              : `paper-texture text-ink-800 border-2 border-ink-200
                ${isClickable
                  ? 'hover:border-coral-400 hover:shadow-lg hover:shadow-coral-500/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                  : ''
                }`
            }
            transition-all duration-200
            ${sizeClasses}
          `}
        >
          <span className="break-words hyphens-auto">
            {content}
          </span>
        </div>

        {/* Back face - marked */}
        <div
          className={`
            absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center
            font-mono font-bold text-center leading-tight p-1
            ${size === 'large' ? 'rounded-lg' : 'rounded-sm'}
            ${isWinning
              ? 'winning-square bg-gradient-to-br from-coral-400 via-coral-500 to-electric-500 text-white'
              : isFreeSpace
                ? 'bg-gradient-to-br from-electric-600 to-electric-700 text-white text-2xl sm:text-3xl'
                : 'bg-coral-500 text-white'
            }
            ${sizeClasses}
          `}
        >
          <span className="break-words hyphens-auto">
            {content}
          </span>
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
