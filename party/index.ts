import type * as Party from "partykit/server";

// Game state interface
interface Player {
  name: string;
  joinedAt: number;
  board: string[][];
  markedSquares: [number, number][];
}

interface GameState {
  sessionId: string;
  sessionName: string;
  status: "waiting" | "playing" | "finished";
  creatorId: string;
  winner: string | null;
  winningLine: [number, number][] | null;
  calledBuzzwords: string[];
  sharedPool: string[];
  players: Record<string, Player>;
  createdAt: number;
}

// Message types from client
type ClientMessage =
  | { type: "join"; playerId: string; playerName: string; board: string[][]; sessionName?: string; sharedPool?: string[] }
  | { type: "start_game" }
  | { type: "mark_buzzword"; playerId: string; buzzword: string }
  | { type: "play_again" }
  | { type: "leave"; playerId: string }
  | { type: "sync_request" };

// Message types to client
type ServerMessage =
  | { type: "game_state"; state: GameState }
  | { type: "player_joined"; playerId: string; player: Player }
  | { type: "player_left"; playerId: string }
  | { type: "game_started" }
  | { type: "buzzword_marked"; buzzword: string; byPlayerId: string }
  | { type: "winner"; winnerId: string; winnerName: string; winningLine: [number, number][] }
  | { type: "game_reset" }
  | { type: "error"; message: string };

export default class BingoServer implements Party.Server {
  state: GameState | null = null;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    // Load persisted state if exists
    const stored = await this.room.storage.get<GameState>("state");
    if (stored) {
      // Check if session is stale (older than 24 hours)
      const isStale = Date.now() - stored.createdAt > 24 * 60 * 60 * 1000;
      if (!isStale) {
        this.state = stored;
      }
    }
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // Send current state to newly connected client
    if (this.state) {
      conn.send(JSON.stringify({ type: "game_state", state: this.state }));
    }
  }

  async onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message) as ClientMessage;

    switch (data.type) {
      case "join":
        await this.handleJoin(data, sender);
        break;
      case "start_game":
        await this.handleStartGame(sender);
        break;
      case "mark_buzzword":
        await this.handleMarkBuzzword(data, sender);
        break;
      case "play_again":
        await this.handlePlayAgain(sender);
        break;
      case "leave":
        await this.handleLeave(data, sender);
        break;
      case "sync_request":
        if (this.state) {
          sender.send(JSON.stringify({ type: "game_state", state: this.state }));
        }
        break;
    }
  }

  async handleJoin(
    data: { playerId: string; playerName: string; board: string[][]; sessionName?: string; sharedPool?: string[] },
    sender: Party.Connection
  ) {
    const isNewSession = !this.state;

    if (isNewSession) {
      // Initialize new game session
      this.state = {
        sessionId: this.room.id,
        sessionName: data.sessionName || "AI Buzzword Bingo",
        status: "waiting",
        creatorId: data.playerId,
        winner: null,
        winningLine: null,
        calledBuzzwords: [],
        sharedPool: data.sharedPool || [],
        players: {},
        createdAt: Date.now(),
      };
    }

    // Add player to game
    const player: Player = {
      name: data.playerName,
      joinedAt: Date.now(),
      board: data.board,
      markedSquares: [[2, 2]], // Center free space always marked
    };

    // If joining mid-game, auto-mark called buzzwords
    if (this.state!.status === "playing") {
      for (const buzzword of this.state!.calledBuzzwords) {
        this.markBuzzwordOnBoard(player, buzzword);
      }
    }

    this.state!.players[data.playerId] = player;

    await this.saveState();

    // Broadcast player joined to all clients
    this.room.broadcast(
      JSON.stringify({
        type: "player_joined",
        playerId: data.playerId,
        player,
      })
    );

    // Send full state to the joining player
    sender.send(JSON.stringify({ type: "game_state", state: this.state }));
  }

  async handleStartGame(sender: Party.Connection) {
    if (!this.state || this.state.status !== "waiting") {
      sender.send(
        JSON.stringify({ type: "error", message: "Cannot start game" })
      );
      return;
    }

    this.state.status = "playing";
    await this.saveState();

    this.room.broadcast(JSON.stringify({ type: "game_started" }));
  }

  async handleMarkBuzzword(
    data: { playerId: string; buzzword: string },
    sender: Party.Connection
  ) {
    if (!this.state || this.state.status !== "playing") {
      return;
    }

    // Check if buzzword already called
    if (this.state.calledBuzzwords.includes(data.buzzword)) {
      return;
    }

    // Add to called buzzwords
    this.state.calledBuzzwords.push(data.buzzword);

    // Mark buzzword on all players' boards
    for (const [playerId, player] of Object.entries(this.state.players)) {
      this.markBuzzwordOnBoard(player, data.buzzword);

      // Check for win
      const winResult = this.checkWin(player.markedSquares);
      if (winResult.won && !this.state.winner) {
        this.state.status = "finished";
        this.state.winner = playerId;
        this.state.winningLine = winResult.winningLine;

        await this.saveState();

        this.room.broadcast(
          JSON.stringify({
            type: "winner",
            winnerId: playerId,
            winnerName: player.name,
            winningLine: winResult.winningLine,
          })
        );
        return;
      }
    }

    await this.saveState();

    this.room.broadcast(
      JSON.stringify({
        type: "buzzword_marked",
        buzzword: data.buzzword,
        byPlayerId: data.playerId,
      })
    );
  }

  markBuzzwordOnBoard(player: Player, buzzword: string) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (player.board[row][col] === buzzword) {
          // Check if not already marked
          const alreadyMarked = player.markedSquares.some(
            ([r, c]) => r === row && c === col
          );
          if (!alreadyMarked) {
            player.markedSquares.push([row, col]);
          }
        }
      }
    }
  }

  checkWin(markedSquares: [number, number][]): {
    won: boolean;
    winningLine: [number, number][] | null;
  } {
    const markedSet = new Set(markedSquares.map(([r, c]) => `${r},${c}`));
    const isMarked = (r: number, c: number) => markedSet.has(`${r},${c}`);

    // Check rows
    for (let row = 0; row < 5; row++) {
      const line: [number, number][] = [];
      let complete = true;
      for (let col = 0; col < 5; col++) {
        if (isMarked(row, col)) {
          line.push([row, col]);
        } else {
          complete = false;
          break;
        }
      }
      if (complete) return { won: true, winningLine: line };
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      const line: [number, number][] = [];
      let complete = true;
      for (let row = 0; row < 5; row++) {
        if (isMarked(row, col)) {
          line.push([row, col]);
        } else {
          complete = false;
          break;
        }
      }
      if (complete) return { won: true, winningLine: line };
    }

    // Check diagonal (top-left to bottom-right)
    const diag1: [number, number][] = [];
    let complete1 = true;
    for (let i = 0; i < 5; i++) {
      if (isMarked(i, i)) {
        diag1.push([i, i]);
      } else {
        complete1 = false;
        break;
      }
    }
    if (complete1) return { won: true, winningLine: diag1 };

    // Check diagonal (top-right to bottom-left)
    const diag2: [number, number][] = [];
    let complete2 = true;
    for (let i = 0; i < 5; i++) {
      if (isMarked(i, 4 - i)) {
        diag2.push([i, 4 - i]);
      } else {
        complete2 = false;
        break;
      }
    }
    if (complete2) return { won: true, winningLine: diag2 };

    // Check four corners
    const corners: [number, number][] = [
      [0, 0],
      [0, 4],
      [4, 0],
      [4, 4],
    ];
    if (corners.every(([r, c]) => isMarked(r, c))) {
      return { won: true, winningLine: corners };
    }

    return { won: false, winningLine: null };
  }

  async handlePlayAgain(sender: Party.Connection) {
    if (!this.state) return;

    // Reset game state but keep players
    this.state.status = "waiting";
    this.state.winner = null;
    this.state.winningLine = null;
    this.state.calledBuzzwords = [];

    // Reset all players' marked squares to just the free space
    for (const player of Object.values(this.state.players)) {
      player.markedSquares = [[2, 2]];
    }

    await this.saveState();

    this.room.broadcast(JSON.stringify({ type: "game_reset" }));
    this.room.broadcast(JSON.stringify({ type: "game_state", state: this.state }));
  }

  async handleLeave(data: { playerId: string }, sender: Party.Connection) {
    if (!this.state) return;

    delete this.state.players[data.playerId];
    await this.saveState();

    this.room.broadcast(
      JSON.stringify({ type: "player_left", playerId: data.playerId })
    );
  }

  async saveState() {
    if (this.state) {
      await this.room.storage.put("state", this.state);
    }
  }

  async onClose(conn: Party.Connection) {
    // Connection closed - could implement player cleanup here
    // For now, players remain in the game until they explicitly leave
  }
}
