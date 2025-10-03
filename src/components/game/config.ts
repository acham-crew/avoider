import Phaser from 'phaser';

export const GAME_CONFIG = {
  // Canvas dimensions
  width: 800,
  height: 600,

  // Physics
  gravity: 0,

  // Sprite sizes (original sprite size from assets)
  spriteSize: {
    player: 32,      // Original player sprite is 32x32
    giwa: 50,        // Giwa tile width (height is auto from sprite)
    item: 30,        // Item sprite size
  },

  // Display sizes (how big sprites appear on screen)
  displaySize: {
    player: 40,      // Player display size (original = 32, use 40 for slight upscale)
    giwa: 50,        // Giwa display size
    item: 30,        // Item display size
  },

  // Hitbox size multipliers (percentage of display size)
  hitboxMultiplier: {
    player: 0.6,     // Player hitbox is 60% of display size (more forgiving)
    giwa: 0.7,       // Giwa hitbox is 70% of display size
    item: 0.8,       // Item hitbox is 80% of display size (easier to collect)
  },

  // Player
  playerSpeed: 300,
  playerSpeedBoosted: 450,
  playerAcceleration: 1200,
  playerDrag: 800,

  // Obstacles
  initialSpawnRate: 1.0, // objects per second
  initialFallSpeed: 150, // pixels per second
  spawnRateIncrease: 0.05, // per second
  fallSpeedIncrease: 3, // per second

  // Items
  itemSpawnChance: 0.2, // 20% chance of item instead of tile
  itemScores: {
    chest: 500,
  },

  // Power-up durations (milliseconds)
  shieldDuration: 2000,
  speedBoostDuration: 7000,
  slowMotionDuration: 3000,

  // Slow motion effect
  slowMotionFactor: 0.8, // 20% slower

  // Scoring
  scorePerTick: 10, // points per game tick (at 60Hz, this is ~600 points/sec)
  comboThreshold: 3,
  comboBonus: 200,

  // Patterns
  patternInterval: 20000, // Change pattern every 20 seconds
};

export const getPhaserConfig = (parent: string): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GAME_CONFIG.gravity },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // Scenes will be added when initializing the game
  scene: [],
});
