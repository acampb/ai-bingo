import { ALL_BUZZWORDS } from './buzzwords'

/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array without modifying the original
 */
function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generates a 5x5 bingo board with random buzzwords
 * Center square (2,2) is always the free space with 🤖
 *
 * To ensure ~60-70% overlap between boards, we use a shared pool
 * of buzzwords that's smaller than the total available
 */
export function generateBoard(sharedPool = null) {
  // If no shared pool provided, create one from all buzzwords
  // Using ~40 buzzwords ensures high overlap between players
  const pool = sharedPool || shuffle(ALL_BUZZWORDS).slice(0, 40)

  // Shuffle the pool and take 24 buzzwords (25 - 1 free space)
  const selectedBuzzwords = shuffle(pool).slice(0, 24)

  // Create 5x5 board
  const board = []
  let buzzwordIndex = 0

  for (let row = 0; row < 5; row++) {
    const boardRow = []
    for (let col = 0; col < 5; col++) {
      if (row === 2 && col === 2) {
        // Center is free space
        boardRow.push('🤖')
      } else {
        boardRow.push(selectedBuzzwords[buzzwordIndex])
        buzzwordIndex++
      }
    }
    board.push(boardRow)
  }

  return board
}

/**
 * Generates a shared pool of buzzwords for a game session
 * This ensures sufficient overlap between player boards
 */
export function generateSharedPool() {
  return shuffle(ALL_BUZZWORDS).slice(0, 40)
}

/**
 * Find all positions of a buzzword on a board
 * Returns array of [row, col] coordinates
 */
export function findBuzzwordPositions(board, buzzword) {
  const positions = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (board[row][col] === buzzword) {
        positions.push([row, col])
      }
    }
  }
  return positions
}

/**
 * Generate a unique 6-character alphanumeric session code
 */
export function generateSessionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars (0,O,1,I)
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

/**
 * Generate a unique player ID
 */
export function generatePlayerId() {
  return `player_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}
