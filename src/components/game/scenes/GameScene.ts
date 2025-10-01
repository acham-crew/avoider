import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { GiwaPool, ItemPool } from '../utils/ObjectPool';
import { GAME_CONFIG } from '../config';
import { useGameStore } from '@/stores/gameStore';
import { ItemType } from '../objects/Item';

/**
 * GameScene - Main gameplay scene
 */
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private giwaPool?: GiwaPool;
  private itemPool?: ItemPool;

  private gameTime: number = 0; // Time in seconds
  private lastSpawnTime: number = 0;
  private currentSpawnRate: number = GAME_CONFIG.initialSpawnRate;
  private currentFallSpeed: number = GAME_CONFIG.initialFallSpeed;

  private isGameOver: boolean = false;
  private slowMotionActive: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Initialize game state
    this.isGameOver = false;
    this.gameTime = 0;
    this.lastSpawnTime = 0;

    useGameStore.getState().resetGame();

    // Create player
    this.player = new Player(
      this,
      this.scale.width / 2,
      this.scale.height - 50
    );

    // Create object pools
    this.giwaPool = new GiwaPool(this);
    this.itemPool = new ItemPool(this);

    // Set up collisions
    this.setupCollisions();

    // Set up retry key
    this.input.keyboard?.on('keydown-R', () => {
      if (this.isGameOver) {
        this.restartGame();
      }
    });
  }

  private setupCollisions() {
    if (!this.player || !this.giwaPool || !this.itemPool) return;

    // Collision with Giwa tiles
    this.physics.add.overlap(
      this.player,
      this.giwaPool.getActive(),
      this.hitGiwa,
      undefined,
      this
    );

    // Collision with Items
    this.physics.add.overlap(
      this.player,
      this.itemPool.getActive(),
      this.collectItem,
      undefined,
      this
    );
  }

  private hitGiwa() {
    if (this.isGameOver) return;

    const state = useGameStore.getState();

    // Check if player has shield
    if (state.hasShield) {
      return; // Invincible, ignore collision
    }

    // Game over
    this.isGameOver = true;
    state.gameOver(state.score);

    // Pause player
    this.player?.setVelocity(0, 0);
    this.player?.setAcceleration(0, 0);

    // Show game over scene
    this.scene.pause();
    this.scene.launch('GameOverScene');
  }

  private collectItem(player: any, item: any) {
    if (this.isGameOver) return;

    const itemType = item.getType() as ItemType;
    const state = useGameStore.getState();

    // Deactivate the item
    item.deactivate();

    // Increment combo
    state.incrementCombo();

    // Check for combo bonus
    if (state.combo > 0 && state.combo % GAME_CONFIG.comboThreshold === 0) {
      state.addScore(GAME_CONFIG.comboBonus);
    }

    // Apply item effect
    switch (itemType) {
      case 'chest':
        state.addScore(GAME_CONFIG.itemScores.chest);
        break;

      case 'shoes':
        state.setSpeedBoost(true);
        this.player?.setSpeedBoost(true);
        this.time.delayedCall(GAME_CONFIG.speedBoostDuration, () => {
          state.setSpeedBoost(false);
          this.player?.setSpeedBoost(false);
        });
        break;

      case 'shield':
        state.setShield(true);
        this.time.delayedCall(GAME_CONFIG.shieldDuration, () => {
          state.setShield(false);
        });
        break;

      case 'clock':
        this.slowMotionActive = true;
        state.setSlowMotion(true);
        this.time.delayedCall(GAME_CONFIG.slowMotionDuration, () => {
          this.slowMotionActive = false;
          state.setSlowMotion(false);
        });
        break;
    }
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    // Update game time
    this.gameTime += delta / 1000;

    // Update score based on time
    const state = useGameStore.getState();
    state.addScore(GAME_CONFIG.scorePerTick * delta / 1000);

    // Update difficulty
    this.currentSpawnRate = GAME_CONFIG.initialSpawnRate + GAME_CONFIG.spawnRateIncrease * this.gameTime;
    this.currentFallSpeed = GAME_CONFIG.initialFallSpeed + GAME_CONFIG.fallSpeedIncrease * this.gameTime;

    // Apply slow motion if active
    const effectiveFallSpeed = this.slowMotionActive
      ? this.currentFallSpeed * GAME_CONFIG.slowMotionFactor
      : this.currentFallSpeed;

    // Spawn objects
    const spawnInterval = 1000 / this.currentSpawnRate; // milliseconds
    if (time - this.lastSpawnTime > spawnInterval) {
      this.spawnObject(effectiveFallSpeed);
      this.lastSpawnTime = time;
    }

    // Update player
    this.player?.update();

    // Update pools
    this.giwaPool?.update();
    this.itemPool?.update();

    // Re-setup collisions every frame (required for Phaser arcade physics with groups)
    this.setupCollisions();
  }

  private spawnObject(fallSpeed: number) {
    // Random chance to spawn item instead of giwa
    const spawnItem = Math.random() < GAME_CONFIG.itemSpawnChance;

    if (spawnItem) {
      // Random item type
      const itemTypes: ItemType[] = ['chest', 'shoes', 'shield', 'clock'];
      const randomType = Phaser.Math.RND.pick(itemTypes);
      this.itemPool?.spawn(fallSpeed, randomType);
    } else {
      this.giwaPool?.spawn(fallSpeed);
    }
  }

  private restartGame() {
    this.scene.stop('GameOverScene');
    this.scene.restart();
  }
}
