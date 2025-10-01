import Phaser from 'phaser';
import { useGameStore } from '@/stores/gameStore';

/**
 * GameOverScene - Displays game over screen
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const state = useGameStore.getState();

    // Semi-transparent background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRect(0, 0, width, height);

    // Game Over text
    const gameOverText = this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
      font: 'bold 48px monospace',
      color: '#ff0000'
    });
    gameOverText.setOrigin(0.5);

    // Final score
    const scoreText = this.add.text(
      width / 2,
      height / 2 - 20,
      `Score: ${Math.floor(state.score)}`,
      {
        font: '32px monospace',
        color: '#ffffff'
      }
    );
    scoreText.setOrigin(0.5);

    // High score
    const highScoreText = this.add.text(
      width / 2,
      height / 2 + 30,
      `High Score: ${Math.floor(state.highScore)}`,
      {
        font: '24px monospace',
        color: '#ffff00'
      }
    );
    highScoreText.setOrigin(0.5);

    // Retry button
    const retryButton = this.add.text(width / 2, height / 2 + 100, 'RETRY (R)', {
      font: 'bold 28px monospace',
      color: '#00ff00',
      backgroundColor: '#222222',
      padding: { x: 20, y: 10 }
    });
    retryButton.setOrigin(0.5);
    retryButton.setInteractive({ useHandCursor: true });

    // Button hover effect
    retryButton.on('pointerover', () => {
      retryButton.setStyle({ color: '#ffffff' });
    });

    retryButton.on('pointerout', () => {
      retryButton.setStyle({ color: '#00ff00' });
    });

    // Retry on click or R key
    retryButton.on('pointerdown', () => {
      this.restartGame();
    });

    this.input.keyboard?.on('keydown-R', () => {
      this.restartGame();
    });
  }

  private restartGame() {
    this.scene.stop();
    this.scene.get('GameScene').scene.restart();
  }
}
