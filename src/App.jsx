import { useState, useEffect, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import { usePartySocket } from './hooks/usePartySocket'
import { generateBoard, generateSessionCode, generatePlayerId, generateSharedPool } from './lib/boardGenerator'
import { generateSessionName, getRandomWinMessage } from './lib/buzzwords'
import LandingPage from './components/LandingPage'
import Lobby from './components/Lobby'
import GameBoard from './components/GameBoard'
import WinModal from './components/WinModal'

// View states
const VIEWS = {
  LANDING: 'landing',
  LOBBY: 'lobby',
  GAME: 'game',
}

// Get or create player ID from localStorage
function getPlayerId() {
  let id = localStorage.getItem('bingo_player_id')
  if (!id) {
    id = generatePlayerId()
    localStorage.setItem('bingo_player_id', id)
  }
  return id
}

export default function App() {
  const [view, setView] = useState(VIEWS.LANDING)
  const [sessionId, setSessionId] = useState(null)
  const [sessionName, setSessionName] = useState('')
  const [playerId] = useState(getPlayerId)
  const [playerName, setPlayerName] = useState('')
  const [board, setBoard] = useState(null)
  const [sharedPool, setSharedPool] = useState(null)
  const [markedSquares, setMarkedSquares] = useState([[2, 2]])
  const [newlyMarked, setNewlyMarked] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [winner, setWinner] = useState(null)
  const [winMessage, setWinMessage] = useState(null)
  const [showWinModal, setShowWinModal] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [joinError, setJoinError] = useState(null)
  const hasJoinedRef = useRef(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('session')
    if (code) {
      setSessionId(code.toUpperCase())
    }
  }, [])

  const {
    connected,
    gameState,
    error,
    joinGame,
    startGame,
    markBuzzword,
    playAgain,
    leaveGame,
    setHandlers,
  } = usePartySocket(sessionId, sessionId !== null)

  useEffect(() => {
    setHandlers({
      onGameState: (state) => {
        if (state.status === 'playing') {
          setView(VIEWS.GAME)
        }
        if (state.players[playerId]) {
          setMarkedSquares(state.players[playerId].markedSquares)
        }
        setSessionName(state.sessionName)
        setIsCreator(state.creatorId === playerId)
        if (state.sharedPool?.length > 0) {
          setSharedPool(state.sharedPool)
        }

        if (state.winner) {
          const winnerPlayer = state.players[state.winner]
          setWinner(state.winner)
          setWinningLine(state.winningLine)
          if (winnerPlayer) {
            setWinMessage(getRandomWinMessage())
            setShowWinModal(true)
            fireConfetti()
          }
        }
      },
      onPlayerJoined: () => {},
      onGameStarted: () => {
        setView(VIEWS.GAME)
      },
      onBuzzwordMarked: (buzzword, byPlayerId) => {
        if (byPlayerId === playerId) return

        if (board) {
          for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
              if (board[row][col] === buzzword) {
                const alreadyMarked = markedSquares.some(
                  ([r, c]) => r === row && c === col
                )
                if (!alreadyMarked) {
                  setNewlyMarked([row, col])
                  setMarkedSquares((prev) => [...prev, [row, col]])
                  setTimeout(() => setNewlyMarked(null), 600)
                }
              }
            }
          }
        }
      },
      onWinner: (winnerId, _winnerName, line) => {
        setWinner(winnerId)
        setWinningLine(line)
        setWinMessage(getRandomWinMessage())
        setShowWinModal(true)
        fireConfetti()
      },
      onGameReset: () => {
        const newBoard = generateBoard(sharedPool)
        setBoard(newBoard)
        setMarkedSquares([[2, 2]])
        setWinningLine(null)
        setWinner(null)
        setShowWinModal(false)
        setView(VIEWS.LOBBY)
        joinGame(playerId, playerName, newBoard)
      },
      onError: (msg) => {
        setJoinError(msg)
      },
    })
  }, [setHandlers, board, markedSquares, playerId, playerName, joinGame, sharedPool])

  const fireConfetti = () => {
    const duration = 4000
    const end = Date.now() + duration

    const colors = ['#ff6b47', '#00c9cc', '#ffd9cf', '#3af8f3']

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const handleCreateGame = useCallback(
    (name) => {
      const code = generateSessionCode()
      const newSessionName = generateSessionName()
      const newPool = generateSharedPool()
      const newBoard = generateBoard(newPool)

      setPlayerName(name)
      setSessionId(code)
      setSessionName(newSessionName)
      setSharedPool(newPool)
      setBoard(newBoard)
      setIsCreator(true)
      setView(VIEWS.LOBBY)

      window.history.pushState({}, '', `?session=${code}`)
    },
    []
  )

  const handleJoinGame = useCallback(
    (code, name) => {
      setPlayerName(name)
      setSessionId(code.toUpperCase())
      setIsCreator(false)
      setView(VIEWS.LOBBY)

      window.history.pushState({}, '', `?session=${code.toUpperCase()}`)
    },
    []
  )

  useEffect(() => {
    if (!isCreator && sharedPool && sharedPool.length > 0 && !board) {
      const newBoard = generateBoard(sharedPool)
      setBoard(newBoard)
    }
  }, [isCreator, sharedPool, board])

  useEffect(() => {
    if (connected && sessionId && playerName && board && view === VIEWS.LOBBY && !hasJoinedRef.current) {
      hasJoinedRef.current = true
      joinGame(
        playerId,
        playerName,
        board,
        isCreator ? sessionName : null,
        isCreator ? sharedPool : null
      )
    }
  }, [connected, sessionId, playerName, board, playerId, joinGame, view, isCreator, sessionName, sharedPool])

  useEffect(() => {
    if (view === VIEWS.LANDING) {
      hasJoinedRef.current = false
    }
  }, [view])

  const handleSquareClick = useCallback(
    (row, col) => {
      if (!board || gameState?.status !== 'playing') return
      if (winner) return

      const buzzword = board[row][col]
      if (buzzword === '🤖') return

      const alreadyMarked = markedSquares.some(([r, c]) => r === row && c === col)
      if (alreadyMarked) return

      setNewlyMarked([row, col])
      setMarkedSquares((prev) => [...prev, [row, col]])
      setTimeout(() => setNewlyMarked(null), 600)

      markBuzzword(playerId, buzzword)
    },
    [board, gameState, winner, markedSquares, markBuzzword, playerId]
  )

  const handleStartGame = useCallback(() => {
    startGame()
  }, [startGame])

  const handlePlayAgain = useCallback(() => {
    playAgain()
  }, [playAgain])

  const handleLeave = useCallback(() => {
    leaveGame(playerId)
    setSessionId(null)
    setBoard(null)
    setMarkedSquares([[2, 2]])
    setWinningLine(null)
    setWinner(null)
    setShowWinModal(false)
    setView(VIEWS.LANDING)
    window.history.pushState({}, '', window.location.pathname)
  }, [leaveGame, playerId])

  const copyJoinLink = useCallback(() => {
    const link = `${window.location.origin}${window.location.pathname}?session=${sessionId}`
    navigator.clipboard.writeText(link)
  }, [sessionId])

  return (
    <div className="min-h-screen bg-ink-950 noise-overlay">
      {/* Ambient background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-coral-900/10 via-ink-950 to-electric-900/10 pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-50" />

      {/* Content */}
      <div className="relative z-10">
        {view === VIEWS.LANDING && (
          <LandingPage
            initialSessionCode={sessionId}
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
            error={joinError}
          />
        )}

        {view === VIEWS.LOBBY && (
          <Lobby
            sessionId={sessionId}
            sessionName={sessionName}
            players={gameState?.players || {}}
            playerId={playerId}
            isCreator={isCreator}
            connected={connected}
            onStartGame={handleStartGame}
            onLeave={handleLeave}
            onCopyLink={copyJoinLink}
          />
        )}

        {view === VIEWS.GAME && (
          <GameBoard
            board={board}
            markedSquares={markedSquares}
            newlyMarked={newlyMarked}
            winningLine={winningLine}
            players={gameState?.players || {}}
            playerId={playerId}
            sessionName={sessionName}
            onSquareClick={handleSquareClick}
            isGameOver={!!winner}
          />
        )}

        {showWinModal && winMessage && (
          <WinModal
            winnerName={gameState?.players?.[winner]?.name || 'Unknown'}
            message={winMessage}
            isCreator={isCreator}
            onPlayAgain={handlePlayAgain}
            onClose={() => setShowWinModal(false)}
          />
        )}

        {error && (
          <div className="fixed bottom-4 right-4 bg-coral-600 text-white px-4 py-3 rounded-xl shadow-lg font-mono text-sm animate-slide-up">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
