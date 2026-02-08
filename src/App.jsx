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

// Read session code from URL synchronously so it's available on first render
function getInitialSessionId() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('session')
  return code ? code.toUpperCase() : null
}

export default function App() {
  const [view, setView] = useState(VIEWS.LANDING)
  const [sessionId, setSessionId] = useState(getInitialSessionId)
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
  const [calledBuzzwords, setCalledBuzzwords] = useState([])
  const hasJoinedRef = useRef(false)

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
        // Only switch to game view if we have our board ready
        // (prevents black screen for players joining mid-game)
        if (state.status === 'playing' && board) {
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
        if (state.calledBuzzwords?.length > 0) {
          setCalledBuzzwords(state.calledBuzzwords)
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
        setCalledBuzzwords((prev) => prev.includes(buzzword) ? prev : [...prev, buzzword])
        if (byPlayerId === playerId) return

        if (board) {
          for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
              if (board[row][col] === buzzword) {
                setMarkedSquares((prev) => {
                  const alreadyMarked = prev.some(
                    ([r, c]) => r === row && c === col
                  )
                  if (alreadyMarked) return prev
                  return [...prev, [row, col]]
                })
                setNewlyMarked([row, col])
                setTimeout(() => setNewlyMarked(null), 600)
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
        setCalledBuzzwords([])
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
  }, [setHandlers, board, playerId, playerName, joinGame, sharedPool])

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

  // Timeout: if a joiner connects but never receives game state, the session doesn't exist
  useEffect(() => {
    if (!isCreator && view === VIEWS.LOBBY && connected && !sharedPool) {
      const timeout = setTimeout(() => {
        setJoinError('Session not found. Check your code and try again.')
        setSessionId(null)
        setBoard(null)
        setSharedPool(null)
        setView(VIEWS.LANDING)
        window.history.pushState({}, '', window.location.pathname)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [isCreator, view, connected, sharedPool])

  useEffect(() => {
    if (!isCreator && sharedPool && sharedPool.length > 0 && !board) {
      const newBoard = generateBoard(sharedPool)
      setBoard(newBoard)
    }
  }, [isCreator, sharedPool, board])

  // Handle mid-game join: switch to game view once board is ready
  useEffect(() => {
    if (view === VIEWS.LOBBY && gameState?.status === 'playing' && board) {
      setView(VIEWS.GAME)
    }
  }, [view, gameState?.status, board])

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
      setCalledBuzzwords((prev) => prev.includes(buzzword) ? prev : [...prev, buzzword])
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
    setCalledBuzzwords([])
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
            creatorId={gameState?.creatorId}
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
            calledBuzzwords={calledBuzzwords}
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
