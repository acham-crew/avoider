import { create } from 'zustand';

export type GameStatus = 'menu' | 'playing' | 'gameover';

export type ItemType = 'chest' | 'shoes' | 'shield' | 'clock';

interface GameState {
  // Game status
  status: GameStatus;
  score: number;
  highScore: number;
  combo: number;

  // Active power-ups
  hasShield: boolean;
  hasSpeedBoost: boolean;
  hasSlowMotion: boolean;

  // Player state (for character preview sync)
  playerDirection: 'idle' | 'left' | 'right';
  playerAnimation: 'idle' | 'run' | 'hit' | 'death';
  isDead: boolean;

  // Web3 state
  isWalletConnected: boolean;
  walletAddress: string | null;
  claimablePoints: number;

  // Actions
  setStatus: (status: GameStatus) => void;
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  setShield: (active: boolean) => void;
  setSpeedBoost: (active: boolean) => void;
  setSlowMotion: (active: boolean) => void;
  resetGame: () => void;
  gameOver: (finalScore: number) => void;

  // Player state actions
  setPlayerDirection: (direction: 'idle' | 'left' | 'right') => void;
  setPlayerAnimation: (animation: 'idle' | 'run' | 'hit' | 'death') => void;
  setIsDead: (isDead: boolean) => void;

  // Web3 actions
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  claimPoints: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  status: 'menu',
  score: 0,
  highScore: 0,
  combo: 0,
  hasShield: false,
  hasSpeedBoost: false,
  hasSlowMotion: false,
  playerDirection: 'idle',
  playerAnimation: 'idle',
  isDead: false,
  isWalletConnected: false,
  walletAddress: null,
  claimablePoints: 0,

  // Actions
  setStatus: (status) => set({ status }),

  setScore: (score) => set({ score }),

  addScore: (points) => set((state) => ({
    score: state.score + points
  })),

  incrementCombo: () => set((state) => ({
    combo: state.combo + 1
  })),

  resetCombo: () => set({ combo: 0 }),

  setShield: (active) => set({ hasShield: active }),

  setSpeedBoost: (active) => set({ hasSpeedBoost: active }),

  setSlowMotion: (active) => set({ hasSlowMotion: active }),

  resetGame: () => set({
    status: 'playing',
    score: 0,
    combo: 0,
    hasShield: false,
    hasSpeedBoost: false,
    hasSlowMotion: false,
    playerDirection: 'idle',
    playerAnimation: 'idle',
    isDead: false,
  }),

  gameOver: (finalScore) => set((state) => ({
    status: 'gameover',
    score: finalScore,
    highScore: Math.max(state.highScore, finalScore),
    claimablePoints: state.isWalletConnected
      ? state.claimablePoints + Math.floor(finalScore)
      : state.claimablePoints,
    combo: 0,
    hasShield: false,
    hasSpeedBoost: false,
    hasSlowMotion: false,
    playerAnimation: 'death',
    isDead: true,
  })),

  // Player state actions
  setPlayerDirection: (direction) => set({ playerDirection: direction }),
  setPlayerAnimation: (animation) => set({ playerAnimation: animation }),
  setIsDead: (isDead) => set({ isDead }),

  // Web3 actions
  connectWallet: (address) => set({
    isWalletConnected: true,
    walletAddress: address,
  }),

  disconnectWallet: () => set({
    isWalletConnected: false,
    walletAddress: null,
  }),

  claimPoints: () => {
    const pointsToClaim = get().claimablePoints;
    console.log(`[Claim] ${pointsToClaim} 포인트를 클레임합니다.`);
    // TODO: 실제 클레임 로직 (e.g., 백엔드 API 호출)
    set({ claimablePoints: 0 });
  },
}));
