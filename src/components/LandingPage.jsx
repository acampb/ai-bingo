import { useState } from 'react'

export default function LandingPage({
  initialSessionCode,
  onCreateGame,
  onJoinGame,
  error,
}) {
  const [mode, setMode] = useState(initialSessionCode ? 'join' : null)
  const [playerName, setPlayerName] = useState('')
  const [sessionCode, setSessionCode] = useState(initialSessionCode || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!playerName.trim()) return

    if (mode === 'create') {
      onCreateGame(playerName.trim())
    } else if (mode === 'join') {
      if (!sessionCode.trim()) return
      onJoinGame(sessionCode.trim(), playerName.trim())
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16 animate-slide-up">
        {/* Decorative element */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-900/80 border border-ink-700 mb-6">
          <span className="w-2 h-2 rounded-full bg-electric-400 animate-pulse" />
          <span className="font-mono text-xs text-ink-400 uppercase tracking-wider">
            Multiplayer Meeting Survival
          </span>
        </div>

        <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 tracking-tight">
          <span className="text-ink-100">AI Buzzword</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 via-coral-500 to-electric-400">
            Bingo
          </span>
        </h1>

        <p className="font-mono text-ink-400 text-sm sm:text-base max-w-md mx-auto">
          Mark the buzzwords as you hear them.
          <br />
          First to get five in a row wins.
        </p>
      </div>

      {!mode ? (
        /* Main action buttons */
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setMode('create')}
            className="group relative px-8 py-4 btn btn-primary rounded-2xl text-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Game
            </span>
          </button>

          <button
            onClick={() => setMode('join')}
            className="group px-8 py-4 btn btn-secondary rounded-2xl text-lg"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Join Game
            </span>
          </button>
        </div>
      ) : (
        /* Form */
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md animate-pop"
        >
          <div className="card p-8">
            {/* Form header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-100">
                {mode === 'create' ? 'New Game' : 'Join Game'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setMode(null)
                  setPlayerName('')
                  setSessionCode('')
                }}
                className="p-2 rounded-lg btn-ghost"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Player name input */}
              <div>
                <label
                  htmlFor="playerName"
                  className="block font-mono text-xs uppercase tracking-wider text-ink-500 mb-2"
                >
                  Your Name
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="input font-display"
                  autoFocus
                  maxLength={20}
                />
              </div>

              {/* Session code input (join mode only) */}
              {mode === 'join' && (
                <div>
                  <label
                    htmlFor="sessionCode"
                    className="block font-mono text-xs uppercase tracking-wider text-ink-500 mb-2"
                  >
                    Session Code
                  </label>
                  <input
                    id="sessionCode"
                    type="text"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="input font-mono text-xl text-center tracking-[0.3em] uppercase"
                    maxLength={6}
                  />
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 text-coral-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={!playerName.trim() || (mode === 'join' && sessionCode.length !== 6)}
                className="w-full py-4 btn btn-primary rounded-xl text-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {mode === 'create' ? 'Create Game' : 'Join Game'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* How to play */}
      <div className="mt-20 max-w-3xl w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-mono text-xs uppercase tracking-wider text-ink-600 text-center mb-8">
          How to Play
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Create or Join',
              desc: 'Start a session and share the code with your colleagues',
            },
            {
              step: '02',
              title: 'Listen & Click',
              desc: 'When you hear a buzzword in your meeting, tap it on your board',
            },
            {
              step: '03',
              title: 'Race to Win',
              desc: 'Words mark on all boards! First to complete a line wins',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-ink-900/40 border border-ink-800/50 hover:border-ink-700 transition-colors"
            >
              <div className="font-mono text-4xl font-bold text-ink-800 group-hover:text-coral-500/50 transition-colors mb-3">
                {item.step}
              </div>
              <h4 className="font-display font-semibold text-ink-200 mb-2">{item.title}</h4>
              <p className="font-mono text-sm text-ink-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 font-mono text-xs text-ink-700">
        Built for surviving meetings since 2024
      </footer>
    </div>
  )
}
