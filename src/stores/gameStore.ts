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
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  status: 'menu',
  score: 0,
  highScore: 0,
  combo: 0,
  hasShield: false,
  hasSpeedBoost: false,
  hasSlowMotion: false,

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
  }),

  gameOver: (finalScore) => set((state) => ({
    status: 'gameover',
    score: finalScore,
    highScore: Math.max(state.highScore, finalScore),
    combo: 0,
    hasShield: false,
    hasSpeedBoost: false,
    hasSlowMotion: false,
  })),
}));
