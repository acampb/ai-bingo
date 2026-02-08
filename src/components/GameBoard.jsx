import BingoSquare from './BingoSquare'
import BuzzwordTicker from './BuzzwordTicker'

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
  calledBuzzwords,
}) {
  if (!board) return null

  const markedSet = new Set(markedSquares.map(([r, c]) => `${r},${c}`))
  const winningSet = new Set(winningLine?.map(([r, c]) => `${r},${c}`) || [])
  const newlyMarkedKey = newlyMarked ? `${newlyMarked[0]},${newlyMarked[1]}` : null

  // Sort all players by score (marked squares count) descending
  const sortedPlayers = Object.entries(players).sort(
    ([, a], [, b]) => (b.markedSquares?.length || 0) - (a.markedSquares?.length || 0)
  )

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-16">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="font-display font-bold text-xl sm:text-2xl text-ink-100">
          {sessionName}
        </h1>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main board */}
        <div className="flex-1 max-w-xl mx-auto lg:mx-0 w-full">
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

        {/* Scoreboard */}
        <div className="lg:w-80">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-800">
                  <th className="font-display text-sm font-extrabold text-coral-500 text-left px-3 py-2 w-10">#</th>
                  <th className="font-display text-sm font-extrabold text-coral-500 text-left px-3 py-2">Player</th>
                  <th className="font-display text-sm font-extrabold text-coral-500 text-right px-3 py-2 w-16">Squares</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map(([id, player], index) => {
                  const count = (player.markedSquares?.length || 1) - 1
                  const isCurrentPlayer = id === playerId
                  return (
                    <tr
                      key={id}
                      className={isCurrentPlayer ? 'bg-coral-500/10' : 'even:bg-ink-800/30'}
                    >
                      <td className={`px-3 py-2 font-mono font-bold ${
                        index === 0 ? 'text-coral-400' : 'text-ink-500'
                      }`}>
                        {index + 1}
                      </td>
                      <td className={`px-3 py-2 truncate max-w-0 ${
                        isCurrentPlayer
                          ? 'font-display font-bold text-coral-300'
                          : 'font-display font-medium text-ink-200'
                      }`}>
                        {player.name}{isCurrentPlayer ? ' (you)' : ''}
                      </td>
                      <td className={`px-3 py-2 text-right font-mono font-bold ${
                        index === 0 ? 'text-coral-400' : 'text-ink-400'
                      }`}>
                        {count}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BuzzwordTicker buzzwords={calledBuzzwords} />
    </div>
  )
}
