'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { getPhaserConfig } from './config';
import { PreloaderScene } from './scenes/PreloaderScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

/**
 * PhaserGame - React wrapper component for Phaser game
 */
export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent multiple game instances
    if (gameRef.current) return;

    // Initialize Phaser game
    const config = getPhaserConfig('game-container');
    config.scene = [PreloaderScene, GameScene, GameOverScene];

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="game-container"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}
