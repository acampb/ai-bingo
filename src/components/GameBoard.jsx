import BingoSquare from './BingoSquare'
import PlayerBoard from './PlayerBoard'

export default function GameBoard({
  board,
  markedSquares,
  newlyMarked,
  winningLine,
  players,
  playerId,
  sessionName,
  onSquareClick,
  isGameOver,
}) {
  if (!board) return null

  const markedSet = new Set(markedSquares.map(([r, c]) => `${r},${c}`))
  const winningSet = new Set(winningLine?.map(([r, c]) => `${r},${c}`) || [])
  const newlyMarkedKey = newlyMarked ? `${newlyMarked[0]},${newlyMarked[1]}` : null

  const otherPlayers = Object.entries(players).filter(([id]) => id !== playerId)
  const calledCount = markedSquares.length - 1 // Exclude free space

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-ink-100 mb-1">
              {sessionName}
            </h1>
            <div className="flex items-center gap-4 font-mono text-xs text-ink-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-400" />
                {Object.keys(players).length} player{Object.keys(players).length !== 1 ? 's' : ''}
              </span>
              <span>
                {calledCount} buzzword{calledCount !== 1 ? 's' : ''} called
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="px-3 py-2 rounded-lg bg-ink-900 border border-ink-800">
              <span className="font-mono text-xs text-ink-500">Progress</span>
              <div className="font-display font-bold text-coral-400">
                {markedSquares.length}/25
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main board */}
        <div className="flex-1 max-w-xl mx-auto lg:mx-0 w-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-xs uppercase tracking-wider text-ink-500">
              Your Board
            </h2>
            {!isGameOver && (
              <span className="font-mono text-xs text-ink-600">
                Tap a word when you hear it
              </span>
            )}
          </div>

          {/* Bingo card container with paper-like appearance */}
          <div className="relative">
            {/* Card shadow/depth */}
            <div className="absolute inset-0 translate-y-2 bg-ink-900 rounded-2xl" />

            {/* Main card */}
            <div className="relative bg-ink-900 rounded-2xl p-3 sm:p-4 border border-ink-800">
              {/* BINGO header */}
              <div className="grid grid-cols-5 gap-1 mb-2">
                {['B', 'I', 'N', 'G', 'O'].map((letter) => (
                  <div
                    key={letter}
                    className="text-center font-display font-extrabold text-2xl sm:text-3xl text-coral-500"
                  >
                    {letter}
                  </div>
                ))}
              </div>

              {/* Board grid */}
              <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                {board.map((row, rowIndex) =>
                  row.map((content, colIndex) => {
                    const key = `${rowIndex},${colIndex}`
                    return (
                      <BingoSquare
                        key={key}
                        content={content}
                        isMarked={markedSet.has(key)}
                        isWinning={winningSet.has(key)}
                        isNewlyMarked={newlyMarkedKey === key}
                        onClick={() => onSquareClick(rowIndex, colIndex)}
                        disabled={isGameOver}
                        size="large"
                      />
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Other players sidebar */}
        {otherPlayers.length > 0 && (
          <div className="lg:w-80">
            <h2 className="font-mono text-xs uppercase tracking-wider text-ink-500 mb-4 lg:mb-3">
              Other Players ({otherPlayers.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
              {otherPlayers.map(([id, player]) => (
                <PlayerBoard
                  key={id}
                  board={player.board}
                  markedSquares={player.markedSquares}
                  winningLine={winningLine}
                  playerName={player.name}
                  isCurrentPlayer={false}
                  size="small"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
