export default function WinModal({
  winnerName,
  message,
  isCreator,
  onPlayAgain,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-pop">
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-coral-500/20 via-electric-500/20 to-coral-500/20 rounded-3xl blur-xl" />

        <div className="relative card p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-float">
              {message.emoji}
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-coral-400 via-electric-400 to-coral-400">
              {message.title}
            </h2>
          </div>

          {/* Message body */}
          <div className="relative mb-8">
            {/* Decorative quote marks */}
            <div className="absolute -top-2 -left-2 text-4xl text-ink-800 font-serif">"</div>
            <div className="absolute -bottom-4 -right-2 text-4xl text-ink-800 font-serif">"</div>

            <div className="bg-ink-950/50 rounded-xl p-6 border border-ink-800">
              <p className="font-mono text-sm sm:text-base text-ink-300 whitespace-pre-line leading-relaxed">
                {message.body(winnerName)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 btn btn-secondary rounded-xl"
            >
              View Board
            </button>
            {isCreator && (
              <button
                onClick={onPlayAgain}
                className="flex-1 py-4 btn btn-primary rounded-xl"
              >
                Play Again
              </button>
            )}
          </div>

          {/* Non-creator message */}
          {!isCreator && (
            <p className="text-center font-mono text-xs text-ink-500 mt-4">
              Waiting for host to start a new round...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
