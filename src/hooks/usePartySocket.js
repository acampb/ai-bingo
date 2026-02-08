import { useEffect, useState, useCallback, useRef } from 'react'
import PartySocket from 'partysocket'

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST || 'localhost:1999'

export function usePartySocket(sessionId, enabled = true) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [gameState, setGameState] = useState(null)
  const [error, setError] = useState(null)
  const handlersRef = useRef({})

  // Connect to PartyKit room
  useEffect(() => {
    if (!enabled || !sessionId) return

    const ws = new PartySocket({
      host: PARTYKIT_HOST,
      room: sessionId.toUpperCase(),
    })

    ws.addEventListener('open', () => {
      setConnected(true)
      setError(null)
    })

    ws.addEventListener('close', () => {
      setConnected(false)
    })

    ws.addEventListener('error', (e) => {
      setError('Connection error')
      console.error('WebSocket error:', e)
    })

    ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleMessage(data)
      } catch (e) {
        console.error('Failed to parse message:', e)
      }
    })

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [sessionId, enabled])

  // Handle incoming messages
  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'game_state':
        setGameState(data.state)
        handlersRef.current.onGameState?.(data.state)
        break
      case 'player_joined':
        setGameState((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            players: { ...prev.players, [data.playerId]: data.player },
          }
        })
        handlersRef.current.onPlayerJoined?.(data.playerId, data.player)
        break
      case 'player_left':
        setGameState((prev) => {
          if (!prev) return prev
          const { [data.playerId]: removed, ...rest } = prev.players
          return { ...prev, players: rest }
        })
        handlersRef.current.onPlayerLeft?.(data.playerId)
        break
      case 'game_started':
        setGameState((prev) => prev ? { ...prev, status: 'playing' } : prev)
        handlersRef.current.onGameStarted?.()
        break
      case 'buzzword_marked':
        // Update markedSquares for all players in gameState so the scoreboard stays current
        setGameState((prev) => {
          if (!prev) return prev
          const updatedPlayers = { ...prev.players }
          for (const [id, player] of Object.entries(updatedPlayers)) {
            for (let row = 0; row < 5; row++) {
              for (let col = 0; col < 5; col++) {
                if (player.board[row][col] === data.buzzword) {
                  const alreadyMarked = player.markedSquares.some(
                    ([r, c]) => r === row && c === col
                  )
                  if (!alreadyMarked) {
                    updatedPlayers[id] = {
                      ...player,
                      markedSquares: [...player.markedSquares, [row, col]],
                    }
                  }
                }
              }
            }
          }
          return { ...prev, players: updatedPlayers }
        })
        handlersRef.current.onBuzzwordMarked?.(data.buzzword, data.byPlayerId)
        break
      case 'winner':
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                status: 'finished',
                winner: data.winnerId,
                winningLine: data.winningLine,
              }
            : prev
        )
        handlersRef.current.onWinner?.(data.winnerId, data.winnerName, data.winningLine)
        break
      case 'game_reset':
        handlersRef.current.onGameReset?.()
        break
      case 'error':
        setError(data.message)
        handlersRef.current.onError?.(data.message)
        break
    }
  }, [])

  // Send message helper
  const send = useCallback(
    (message) => {
      if (socket && connected) {
        socket.send(JSON.stringify(message))
      }
    },
    [socket, connected]
  )

  // Game actions
  const joinGame = useCallback(
    (playerId, playerName, board, sessionName = null, sharedPool = null) => {
      send({ type: 'join', playerId, playerName, board, sessionName, sharedPool })
    },
    [send]
  )

  const startGame = useCallback(() => {
    send({ type: 'start_game' })
  }, [send])

  const markBuzzword = useCallback(
    (playerId, buzzword) => {
      send({ type: 'mark_buzzword', playerId, buzzword })
    },
    [send]
  )

  const playAgain = useCallback(() => {
    send({ type: 'play_again' })
  }, [send])

  const leaveGame = useCallback(
    (playerId) => {
      send({ type: 'leave', playerId })
    },
    [send]
  )

  const requestSync = useCallback(() => {
    send({ type: 'sync_request' })
  }, [send])

  // Set event handlers
  const setHandlers = useCallback((handlers) => {
    handlersRef.current = handlers
  }, [])

  return {
    connected,
    gameState,
    error,
    joinGame,
    startGame,
    markBuzzword,
    playAgain,
    leaveGame,
    requestSync,
    setHandlers,
  }
}
