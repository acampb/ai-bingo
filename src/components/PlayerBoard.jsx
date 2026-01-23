import BingoSquare from './BingoSquare'

export default function PlayerBoard({
  board,
  markedSquares,
  winningLine,
  playerName,
  isCurrentPlayer,
  size = 'small',
}) {
  if (!board) return null

  const markedSet = new Set(markedSquares?.map(([r, c]) => `${r},${c}`) || [])
  const winningSet = new Set(winningLine?.map(([r, c]) => `${r},${c}`) || [])

  return (
    <div className="w-full">
      {/* Player name */}
      {playerName && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-ink-700 flex items-center justify-center font-display font-bold text-xs text-ink-300">
            {playerName.charAt(0).toUpperCase()}
          </div>
          <span className="font-mono text-xs text-ink-400 truncate">
            {playerName}
            {isCurrentPlayer && (
              <span className="text-coral-400 ml-1">(you)</span>
            )}
          </span>
        </div>
      )}

      {/* Mini board */}
      <div className="bg-ink-900 rounded-lg p-1.5 border border-ink-800">
        <div className="grid grid-cols-5 gap-px">
          {board.map((row, rowIndex) =>
            row.map((content, colIndex) => {
              const key = `${rowIndex},${colIndex}`
              return (
                <BingoSquare
                  key={key}
                  content={content}
                  isMarked={markedSet.has(key)}
                  isWinning={winningSet.has(key)}
                  disabled={true}
                  size={size}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
