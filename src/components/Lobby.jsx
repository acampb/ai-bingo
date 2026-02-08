import { useState } from 'react'

export default function Lobby({
  sessionId,
  sessionName,
  players,
  playerId,
  creatorId,
  isCreator,
  connected,
  onStartGame,
  onLeave,
  onCopyLink,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopyLink()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const playerList = Object.entries(players)
  const canStart = playerList.length >= 1 && isCreator

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Session Card */}
        <div className="card p-8 mb-6">
          {/* Session name */}
          <div className="text-center mb-8">
            <span className="inline-block font-mono text-xs uppercase tracking-wider text-ink-500 mb-2">
              Session
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-electric-400">
              {sessionName || 'Loading...'}
            </h1>
          </div>

          {/* Join code */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-ink-950 border-2 border-dashed border-ink-700">
              <span className="font-mono text-3xl sm:text-4xl font-bold tracking-[0.25em] text-ink-100">
                {sessionId}
              </span>
              <button
                onClick={handleCopy}
                className={`p-2.5 rounded-lg transition-all ${
                  copied
                    ? 'bg-electric-500/20 text-electric-400'
                    : 'bg-ink-800 hover:bg-ink-700 text-ink-400 hover:text-ink-200'
                }`}
                title="Copy join link"
              >
                {copied ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-center font-mono text-xs text-ink-600 mt-3">
              {copied ? 'Link copied!' : 'Share this code with your colleagues'}
            </p>
          </div>

          {/* Connection status */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-electric-400' : 'bg-coral-400 animate-pulse'}`} />
            <span className="font-mono text-xs text-ink-500">
              {connected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Players List */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink-200">Players</h2>
            <span className="font-mono text-xs text-ink-500 bg-ink-800 px-2 py-1 rounded">
              {playerList.length}
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {playerList.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-ink-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="font-mono text-sm text-ink-500">Waiting for players...</p>
              </div>
            ) : (
              playerList.map(([id, player], index) => (
                <div
                  key={id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    id === playerId
                      ? 'bg-coral-500/10 border border-coral-500/20'
                      : 'bg-ink-800/50 hover:bg-ink-800'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg ${
                      id === playerId
                        ? 'bg-gradient-to-br from-coral-500 to-coral-600 text-white'
                        : 'bg-ink-700 text-ink-300'
                    }`}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <span className="font-display font-medium text-ink-200 truncate block">
                      {player.name}
                    </span>
                    {id === playerId && (
                      <span className="font-mono text-xs text-coral-400">You</span>
                    )}
                  </div>

                  {/* Host badge */}
                  {id === creatorId && (
                    <span className="font-mono text-xs bg-electric-500/20 text-electric-400 px-2 py-1 rounded">
                      Host
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onLeave}
            className="flex-1 py-4 btn btn-secondary rounded-xl"
          >
            Leave
          </button>
          {isCreator && (
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className="flex-1 py-4 btn btn-primary rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Start Game
            </button>
          )}
        </div>

        {/* Waiting message */}
        {isCreator && playerList.length < 2 && (
          <p className="text-center font-mono text-xs text-ink-600 mt-4">
            Waiting for more players... or start solo for practice!
          </p>
        )}

        {!isCreator && (
          <p className="text-center font-mono text-xs text-ink-600 mt-4">
            Waiting for host to start the game...
          </p>
        )}
      </div>
    </div>
  )
}
