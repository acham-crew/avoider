import Phaser from 'phaser';

/**
 * PreloaderScene - Loads all game assets
 */
export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px monospace',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px monospace',
      color: '#ffffff'
    });
    percentText.setOrigin(0.5, 0.5);

    // Update progress bar
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
      percentText.setText(Math.floor(value * 100) + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Create simple graphics for game objects since we don't have image assets
    this.createPlaceholderGraphics();
  }

  /**
   * Create simple placeholder graphics for the game objects
   */
  private createPlaceholderGraphics() {
    // Player - blue square
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x00bfff, 1);
    playerGraphics.fillRect(0, 0, 40, 40);
    playerGraphics.generateTexture('player', 40, 40);
    playerGraphics.destroy();

    // Giwa - red tile with "瓦" character
    const giwaGraphics = this.add.graphics();
    giwaGraphics.fillStyle(0xff4444, 1);
    giwaGraphics.fillRoundedRect(0, 0, 50, 30, 4);
    giwaGraphics.generateTexture('giwa', 50, 30);
    giwaGraphics.destroy();

    // Add "瓦" text to Giwa texture (optional enhancement)
    const giwaText = this.add.text(25, 15, '瓦', {
      font: '20px serif',
      color: '#ffffff'
    });
    giwaText.setOrigin(0.5, 0.5);

    // Item - Chest (yellow)
    const chestGraphics = this.add.graphics();
    chestGraphics.fillStyle(0xffd700, 1);
    chestGraphics.fillRect(0, 0, 30, 30);
    chestGraphics.lineStyle(2, 0x000000);
    chestGraphics.strokeRect(0, 0, 30, 30);
    chestGraphics.generateTexture('item-chest', 30, 30);
    chestGraphics.destroy();

    // Item - Shoes (green)
    const shoesGraphics = this.add.graphics();
    shoesGraphics.fillStyle(0x00ff00, 1);
    shoesGraphics.fillEllipse(15, 15, 28, 28);
    shoesGraphics.generateTexture('item-shoes', 30, 30);
    shoesGraphics.destroy();

    // Item - Shield (cyan)
    const shieldGraphics = this.add.graphics();
    shieldGraphics.fillStyle(0x00ffff, 1);
    shieldGraphics.fillCircle(15, 15, 15);
    shieldGraphics.generateTexture('item-shield', 30, 30);
    shieldGraphics.destroy();

    // Item - Clock (purple)
    const clockGraphics = this.add.graphics();
    clockGraphics.fillStyle(0xff00ff, 1);
    clockGraphics.fillCircle(15, 15, 15);
    clockGraphics.lineStyle(2, 0xffffff);
    clockGraphics.strokeCircle(15, 15, 15);
    clockGraphics.generateTexture('item-clock', 30, 30);
    clockGraphics.destroy();
  }

  create() {
    // Start the main game scene
    this.scene.start('GameScene');
  }
}
