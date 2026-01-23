// Master list of AI buzzwords organized by category
export const BUZZWORDS = {
  technical: [
    'LLM', 'RAG', 'Fine-tuning', 'Embeddings', 'Vector Database',
    'Hallucination', 'Prompt Engineering', 'Chain-of-Thought', 'Few-shot Learning',
    'Zero-shot', 'Transformer', 'Attention Mechanism', 'Inference', 'Training Data',
    'Model Collapse', 'Tokenization', 'Context Window', 'Guardrails', 'RLHF',
    'Weights', 'Parameters', 'Benchmark', 'Eval', 'System Prompt', 'Temperature',
    'Top-p', 'Latency', 'Throughput', 'Distillation', 'Quantization', 'LoRA',
    'Synthetic Data'
  ],
  hype: [
    'AGI', 'Superintelligence', 'Emergent Capabilities', 'Reasoning', 'Agentic',
    'Multimodal', 'Foundation Model', 'Frontier Model', 'Alignment', 'AI Safety',
    'Responsible AI', 'Explainable AI', 'Sentient', 'Autonomous', 'Self-improving',
    'Human-in-the-loop', 'Scaling Laws', 'Bitter Lesson', 'Moat', 'Wrapper',
    'AI Doomer', 'AI Accelerationist', 'e/acc', 'Effective Altruism', 'P(doom)',
    'Shoggoth', 'Stochastic Parrot', 'Vibe Coding'
  ],
  companies: [
    'OpenAI', 'Anthropic', 'Google DeepMind', 'Microsoft', 'Meta AI', 'xAI',
    'Mistral', 'Cohere', 'Stability AI', 'Midjourney', 'Runway', 'Hugging Face',
    'Perplexity', 'Inflection', 'Character AI', 'Replika', 'Scale AI',
    'Databricks', 'Snowflake', 'NVIDIA'
  ],
  models: [
    'GPT', 'Claude', 'Gemini', 'Llama', 'Copilot', 'ChatGPT', 'Grok', 'Mixtral',
    'DALL-E', 'Stable Diffusion', 'Sora', 'Whisper', 'CLIP'
  ],
  marketing: [
    'AI-powered', 'Intelligent', 'Smart', 'Assistant', 'Automation',
    'Next-generation', 'Cutting-edge', 'State-of-the-art', 'Democratizing AI',
    'AI-native', 'GenAI', 'Cognitive', 'Predictive', 'Personalized', 'Open Source',
    'Open Weights', 'Closed Source', 'API Access', 'Rate Limits', 'Tokens per Second'
  ],
  infrastructure: [
    'Cloud-native', 'API-first', 'MLOps', 'Model Serving', 'GPU Cluster', 'H100',
    'TPU', 'CUDA', 'Distributed Training', 'Edge AI', 'On-device', 'Real-time',
    'Low-latency', 'Inference Endpoint', 'Model Garden', 'Bedrock', 'Azure OpenAI',
    'Vertex AI'
  ]
}

// Flatten all buzzwords into a single array
export const ALL_BUZZWORDS = Object.values(BUZZWORDS).flat()

// Session name generator components
const ADJECTIVES = [
  'Agentic', 'Multimodal', 'Generative', 'Autonomous', 'Emergent',
  'Superintelligent', 'Open-Source', 'Frontier', 'Aligned', 'Fine-tuned',
  'Distilled', 'Quantized', 'Uncensored', 'Based'
]

const NOUNS = [
  'LLM', 'Neural Net', 'Transformer', 'Foundation Model', 'Shoggoth',
  'Context Window', 'Attention Head', 'Embedding', 'Benchmark', 'Weights',
  'Parameters', 'AGI', 'Singularity'
]

const SUFFIXES = [
  'Lab', 'Summit', 'Eval', 'Alignment Meeting', 'Training Run',
  'Inference Session', 'Benchmark', 'Research Preview', 'Safety Review', 'Red Team'
]

export function generateSessionName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]
  return `${adj} ${noun} ${suffix}`
}

// Win celebration messages
export const WIN_MESSAGES = [
  {
    title: 'BINGO ACHIEVED!',
    emoji: '🎉',
    body: (name) => `Congratulations, ${name}!

Your neural pathways have demonstrated emergent capabilities that would make GPT-5 jealous!

Through agentic pattern recognition and frontier-level attention mechanisms, you've achieved what many thought was impossible: surviving this meeting.

Truly a foundation model of bingo excellence. Sam Altman is reportedly "shook." 🏆`
  },
  {
    title: 'AGI UNLOCKED!',
    emoji: '🚀',
    body: (name) => `${name} has achieved BINGO!

Your multimodal listening abilities have passed the Turing Test of meeting survival!

With zero-shot learning and chain-of-thought reasoning, you've outperformed every model on the BINGO-Bench leaderboard.

OpenAI wants to acquire you. Anthropic is concerned about your alignment. NVIDIA stock just went up 3%.

The singularity is here, and it's YOU. 🌟`
  },
  {
    title: 'SUPERINTELLIGENCE DETECTED!',
    emoji: '⚡',
    body: (name) => `${name} wins!

Your biological transformer architecture has achieved state-of-the-art results on this benchmark!

With an unprecedented context window and near-perfect attention scores, you've demonstrated capabilities that would require 10 trillion parameters to replicate.

This is what AGI looks like. Google DeepMind is in shambles. Your P(doom) is now 0%.

Ready to fine-tune on another round? 🎯`
  }
]

export function getRandomWinMessage() {
  return WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
}
