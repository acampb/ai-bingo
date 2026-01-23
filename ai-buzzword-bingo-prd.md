# AI Buzzword Bingo - Product Requirements Document

## Overview

A web-based multiplayer bingo game designed for people to play during meetings. Players compete to get bingo by marking AI industry buzzwords as they hear them. The twist: when a player marks a buzzword, it's automatically marked on ALL players' boards who share that word.

## Tech Stack

- **Frontend**: React (single `.jsx` artifact)
- **Styling**: Tailwind CSS
- **Multiplayer/Persistence**: Use the `window.storage` API with `shared: true` for real-time game state sync
- **No backend required** - all state managed through shared storage

---

## Game Flow

### 1. Landing Page
- Two options: "Create Game" or "Join Game"
- Join Game requires a session code input

### 2. Create Session
- Generate a unique session ID (6 character alphanumeric, case-insensitive)
- Generate a humorous AI buzzword-y session name (see Session Name Generator below)
- Prompt creator for their player name
- Creator is automatically joined to the session
- Display shareable link/code for others to join

### 3. Join Session
- Player enters session code (or arrives via direct link)
- Prompt for player name only
- Generate randomized bingo board for player
- If game is in progress, auto-mark any buzzwords that have already been called
- Player is added to the active players list

### 4. Game Lobby / Waiting State
- Show all connected players
- Session creator has "Start Game" button
- Display session name and join code prominently
- Players can see who else has joined

### 5. Active Game Play
- Each player sees their own bingo board prominently
- Below/beside their board, show smaller views of all other players' boards
- Players can only click squares on their OWN board
- When a square is clicked:
  - Animate the square (flip animation to reveal marked state)
  - Mark that buzzword on ALL players' boards who have it
  - Broadcast the update to all players via shared storage
- Real-time sync: poll shared storage every 500-1000ms for updates

### 6. Win Condition
- Check for win after every square is marked
- Win conditions:
  - Any complete row (5 horizontal)
  - Any complete column (5 vertical)
  - Either diagonal (5 squares)
  - Four corners
- When a player wins:
  - Announce winner to all players
  - Display the witty congratulations message (see below)
  - Show "Play Again" button (available to session creator)
  - Game is frozen - no more squares can be marked

### 7. Play Again
- Session creator clicks "Play Again"
- All players get NEW randomized boards
- All marked squares are reset
- Previously called buzzwords are cleared
- Game returns to active play state

---

## Bingo Board Specifications

### Layout
- 5x5 grid (25 squares total)
- Center square is FREE SPACE: displays 🤖 emoji
- Free space is always pre-marked for all players

### Board Generation
- Each player gets a randomized selection of 24 buzzwords from the master list
- Buzzwords are randomly placed on the board
- Different players WILL have overlapping buzzwords (this is intentional for the shared-marking mechanic)
- Aim for ~60-70% overlap between any two boards to make the game interesting

### Visual Design
- Unmarked squares: Light background, dark text
- Marked squares: Flip animation (CSS 3D transform), then show different color (suggest: bright accent color like purple or teal)
- Winning line: Highlight/glow effect when bingo is achieved
- Player's own board: Larger, interactive
- Other players' boards: Smaller thumbnails, view-only, show player name above each

---

## Session Name Generator

Generate names by combining random elements from these categories:

**Adjectives:**
Agentic, Multimodal, Generative, Autonomous, Emergent, Superintelligent, Open-Source, Frontier, Aligned, Fine-tuned, Distilled, Quantized, Uncensored, Based

**Nouns:**
LLM, Neural Net, Transformer, Foundation Model, Shoggoth, Context Window, Attention Head, Embedding, Benchmark, Weights, Parameters, AGI, Singularity

**Suffixes:**
Lab, Summit, Eval, Alignment Meeting, Training Run, Inference Session, Benchmark, Research Preview, Safety Review, Red Team

**Format:** `[Adjective] [Noun] [Suffix]`

**Examples:**
- "Emergent Shoggoth Summit"
- "Agentic LLM Alignment Meeting"
- "Frontier Transformer Eval"
- "Uncensored AGI Training Run"
- "Multimodal Neural Net Research Preview"

---

## Master Buzzword List

Include at least 60+ buzzwords to ensure variety. Organize by category:

### AI/ML Technical Terms
- LLM
- RAG
- Fine-tuning
- Embeddings
- Vector Database
- Hallucination
- Prompt Engineering
- Chain-of-Thought
- Few-shot Learning
- Zero-shot
- Transformer
- Attention Mechanism
- Inference
- Training Data
- Model Collapse
- Tokenization
- Context Window
- Guardrails
- RLHF
- Weights
- Parameters
- Benchmark
- Eval
- System Prompt
- Temperature
- Top-p
- Latency
- Throughput
- Distillation
- Quantization
- LoRA
- Synthetic Data

### AI Hype Terms
- AGI
- Superintelligence
- Emergent Capabilities
- Reasoning
- Agentic
- Multimodal
- Foundation Model
- Frontier Model
- Alignment
- AI Safety
- Responsible AI
- Explainable AI
- Sentient
- Autonomous
- Self-improving
- Human-in-the-loop
- Scaling Laws
- Bitter Lesson
- Moat
- Wrapper
- AI Doomer
- AI Accelerationist
- e/acc
- Effective Altruism
- P(doom)
- Shoggoth
- Stochastic Parrot
- Vibe Coding

### AI Companies & Labs
- OpenAI
- Anthropic
- Google DeepMind
- Microsoft
- Meta AI
- xAI
- Mistral
- Cohere
- Stability AI
- Midjourney
- Runway
- Hugging Face
- Perplexity
- Inflection
- Character AI
- Replika
- Scale AI
- Databricks
- Snowflake
- NVIDIA

### Model Names & Products
- GPT
- Claude
- Gemini
- Llama
- Copilot
- ChatGPT
- Grok
- Mixtral
- DALL-E
- Stable Diffusion
- Midjourney
- Sora
- Whisper
- CLIP

### Product/Marketing Terms
- AI-powered
- Intelligent
- Smart
- Assistant
- Automation
- Next-generation
- Cutting-edge
- State-of-the-art
- Democratizing AI
- AI-native
- GenAI
- Cognitive
- Predictive
- Personalized
- Open Source
- Open Weights
- Closed Source
- API Access
- Rate Limits
- Tokens per Second

### Technical Infrastructure
- Cloud-native
- API-first
- MLOps
- Model Serving
- GPU Cluster
- H100
- TPU
- CUDA
- Distributed Training
- Edge AI
- On-device
- Real-time
- Low-latency
- Inference Endpoint
- Model Garden
- Bedrock
- Azure OpenAI
- Vertex AI

---

## Win Celebration Message

When a player wins, display an over-the-top congratulatory message filled with AI buzzwords and hype. Generate dynamically or pick from a list.

**Template:**
```
🎉 BINGO ACHIEVED! 🎉

Congratulations, [PLAYER_NAME]!

Your neural pathways have demonstrated emergent capabilities that would make GPT-5 jealous!

Through agentic pattern recognition and frontier-level attention mechanisms, you've achieved what many thought was impossible: surviving this meeting.

Truly a foundation model of bingo excellence. Sam Altman is reportedly "shook." 🏆

Ready for another training run?
```

**Alternative messages (randomly selected):**

Message 2:
```
🚀 AGI UNLOCKED! 🚀

[PLAYER_NAME] has achieved BINGO!

Your multimodal listening abilities have passed the Turing Test of meeting survival!

With zero-shot learning and chain-of-thought reasoning, you've outperformed every model on the BINGO-Bench leaderboard.

OpenAI wants to acquire you. Anthropic is concerned about your alignment. NVIDIA stock just went up 3%.

The singularity is here, and it's YOU. 🌟
```

Message 3:
```
⚡ SUPERINTELLIGENCE DETECTED! ⚡

[PLAYER_NAME] wins!

Your biological transformer architecture has achieved state-of-the-art results on this benchmark!

With an unprecedented context window and near-perfect attention scores, you've demonstrated capabilities that would require 10 trillion parameters to replicate.

This is what AGI looks like. Google DeepMind is in shambles. Your P(doom) is now 0%.

Ready to fine-tune on another round? 🎯
```

---

## Data Model (Shared Storage)

### Session State
```javascript
{
  sessionId: "ABC123",
  sessionName: "Quantum Synergy Summit",
  status: "waiting" | "playing" | "finished",
  creatorId: "player_uuid",
  winner: null | "player_uuid",
  calledBuzzwords: ["LLM", "Synergy", ...], // all buzzwords that have been marked
  players: {
    "player_uuid": {
      name: "Alice",
      oderedAt: 1234567890,
      board: [
        ["LLM", "Synergy", "AGI", "Scalable", "RAG"],
        ["Agentic", "ROI", "Fine-tuning", "Cloud-native", "Emergent"],
        ["Copilot", "Paradigm", "🤖", "Vector DB", "Guardrails"], // center is free
        ["GenAI", "Leverage", "RLHF", "Multimodal", "Deep Dive"],
        ["Alignment", "API-first", "Inference", "Value-add", "Ecosystem"]
      ],
      markedSquares: [[0,0], [2,2], ...] // coordinates of marked squares
    }
  },
  createdAt: 1234567890
}
```

### Storage Keys
- `bingo:session:{sessionId}` - Main session state (shared: true)

---

## UI Components

### 1. Landing Page
- App title: "AI Buzzword Bingo" with fun subtitle like "Survive your next meeting!"
- Large "Create Game" button
- "Join Game" section with code input field and join button
- Brief instructions/how-to-play section

### 2. Lobby View
- Session name displayed prominently
- Join code with copy button
- List of joined players with visual indicator for session creator
- "Start Game" button (creator only)
- "Leave Game" option

### 3. Game Board View
- Header: Session name, player count
- Main area: Player's own board (large, clickable)
- Sidebar/Below: Other players' boards (small, view-only) with names
- Visual indicator of called buzzwords count

### 4. Bingo Square Component
- Default state: White/light gray background, black text
- Hover state (own board only): Slight highlight
- Marked state: Flip animation (rotate Y 180deg), then colored background (purple/teal)
- The flip should reveal the same text but with the new background color
- Winning squares: Additional glow/pulse effect

### 5. Win Modal
- Overlay the entire screen
- Large trophy emoji or celebration animation
- Winner's name prominently displayed
- Randomly selected congratulations message
- "Play Again" button (creator only)
- Confetti animation would be a nice touch (optional)

---

## Animation Specifications

### Square Flip Animation
```css
/* Flip effect when marking a square */
.square {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.square.marked {
  transform: rotateY(180deg);
}

/* Front and back faces */
.square-front, .square-back {
  backface-visibility: hidden;
}

.square-back {
  transform: rotateY(180deg);
  background-color: #8B5CF6; /* Purple accent */
}
```

### Win Celebration
- Winning line squares should have a pulsing glow
- Optional: CSS confetti animation or use a lightweight confetti library

---

## Polling & Sync Strategy

Since we're using shared storage without websockets:

1. Poll shared storage every 750ms during active game
2. On each poll:
   - Check for new called buzzwords → mark on local board with animation
   - Check for new players → add to player list
   - Check for winner → show win modal
   - Check for game reset → refresh boards
3. Use optimistic updates for better UX:
   - When player clicks square, immediately animate locally
   - Then update shared storage
   - Other players will see on next poll

---

## Edge Cases to Handle

1. **Player joins mid-game**: Auto-mark any buzzwords already called
2. **Session creator leaves**: Game can continue, but no one can start new round (or transfer host)
3. **Duplicate player names**: Allow them, differentiate by player ID internally
4. **Session not found**: Show friendly error, option to create new game
5. **Storage errors**: Show retry option, don't lose local state
6. **Simultaneous wins**: First one detected wins (race condition acceptable for casual game)
7. **Browser refresh**: Player should rejoin same session if they have the code/URL

---

## Session Cleanup

- Sessions older than 24 hours can be considered stale
- On creating/joining, check session timestamp
- If stale, show "Session expired" and prompt to create new one

---

## Nice-to-Have Features (Future)

- Sound effects for marking squares and winning
- Dark mode
- Custom buzzword lists
- Spectator mode
- Game history/stats
- Share win screen to social media

---

## Success Criteria

1. Multiple players can join the same session from different devices/browsers
2. Marking a buzzword updates all boards in near-real-time (<2 seconds)
3. Win detection works correctly for all win conditions
4. Game can be replayed without refreshing the page
5. The experience is fun and the humor lands!
