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

  // Near-miss combo system
  private lastNearMissTime: number = 0;
  private nearMissCheckedGiwas: Set<any> = new Set();

  // Combo effect text
  private comboText?: Phaser.GameObjects.Text;
  private comboTween?: Phaser.Tweens.Tween;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Initialize game state
    this.isGameOver = false;
    this.gameTime = 0;
    this.lastSpawnTime = 0;
    this.lastNearMissTime = 0;
    this.nearMissCheckedGiwas.clear();

    // Reset game state without changing status (user must click Start button)
    const state = useGameStore.getState();
    state.setScore(0);
    state.resetCombo();
    state.setShield(false);
    state.setSpeedBoost(false);
    state.setSlowMotion(false);

    // Create player
    this.player = new Player(
      this,
      this.scale.width / 2,
      this.scale.height - 50
    );

    // Create object pools
    this.giwaPool = new GiwaPool(this);
    this.itemPool = new ItemPool(this);

    // Create combo text (hidden by default)
    this.comboText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      '',
      {
        fontSize: '64px',
        color: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
      }
    );
    this.comboText.setOrigin(0.5);
    this.comboText.setAlpha(0);
    this.comboText.setDepth(1000);

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
    // Collisions are checked manually in update loop
    // No need to set up physics overlap here since we're using object pools
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
    const state = useGameStore.getState();

    // Don't update game logic if not playing
    if (state.status !== 'playing') return;

    if (this.isGameOver) return;

    // Update game time
    this.gameTime += delta / 1000;

    // Update score based on time (very slow passive gain)
    state.addScore(GAME_CONFIG.scorePerTick * delta / 1000);

    // Check for near-miss combos
    this.checkNearMiss(time);

    // Check combo timeout (2 seconds)
    if (state.combo > 0 && time - this.lastNearMissTime > GAME_CONFIG.nearMissComboWindow) {
      state.resetCombo();
    }

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

    // Manual collision detection
    this.checkCollisions();
  }

  private checkCollisions() {
    if (!this.player || this.isGameOver) return;

    const state = useGameStore.getState();

    // Check Giwa collisions
    if (this.giwaPool) {
      const activeGiwas = this.giwaPool.getActive();
      for (const giwa of activeGiwas) {
        if (this.physics.overlap(this.player, giwa)) {
          // Check if player has shield
          if (!state.hasShield) {
            this.hitGiwa();
            break;
          }
        }
      }
    }

    // Check Item collisions
    if (this.itemPool) {
      const activeItems = this.itemPool.getActive();
      for (const item of activeItems) {
        if (this.physics.overlap(this.player, item)) {
          this.collectItem(this.player, item);
          break; // Only collect one item per frame
        }
      }
    }
  }

  private checkNearMiss(currentTime: number) {
    if (!this.player || !this.giwaPool) return;

    const state = useGameStore.getState();
    const playerY = this.player.y;
    const playerX = this.player.x;

    // Get all active giwas (returns array directly)
    const activeGiwas = this.giwaPool.getActive();

    for (const giwa of activeGiwas) {
      // Skip if already checked this giwa
      if (this.nearMissCheckedGiwas.has(giwa)) continue;

      const giwaY = giwa.y;
      const giwaX = giwa.x;

      // Check if giwa is passing by the player (just above player's head)
      const verticalDistance = Math.abs(giwaY - playerY);
      const horizontalDistance = Math.abs(giwaX - playerX);

      // Near-miss: giwa is close vertically and horizontally aligned
      if (verticalDistance < GAME_CONFIG.nearMissDistance && horizontalDistance < 50) {
        // Mark this giwa as checked
        this.nearMissCheckedGiwas.add(giwa);

        // Check if within combo window
        if (currentTime - this.lastNearMissTime <= GAME_CONFIG.nearMissComboWindow) {
          // Increment combo
          state.incrementCombo();
        } else {
          // Reset combo and start fresh
          state.resetCombo();
          state.incrementCombo();
        }

        // Calculate score based on combo
        const comboMultiplier = Math.pow(GAME_CONFIG.nearMissComboMultiplier, state.combo - 1);
        const earnedScore = GAME_CONFIG.nearMissBaseScore * comboMultiplier;
        state.addScore(earnedScore);

        // Show combo effect
        this.showComboEffect(state.combo, earnedScore);

        // Update last near-miss time
        this.lastNearMissTime = currentTime;

        break; // Only one near-miss per frame
      }
    }

    // Clean up checked giwas that are no longer active
    const activeGiwaSet = new Set(activeGiwas);
    for (const checked of this.nearMissCheckedGiwas) {
      if (!activeGiwaSet.has(checked)) {
        this.nearMissCheckedGiwas.delete(checked);
      }
    }
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

  private showComboEffect(combo: number, score: number) {
    if (!this.comboText) return;

    // Stop any existing tween
    if (this.comboTween) {
      this.comboTween.stop();
    }

    // Determine text and color based on combo level
    let comboText = '';
    let color = '#ffff00'; // Yellow default
    let fontSize = '64px';

    if (combo === 1) {
      comboText = 'NICE!';
      color = '#00ff00'; // Green
    } else if (combo === 2) {
      comboText = 'GREAT!';
      color = '#00ffff'; // Cyan
      fontSize = '72px';
    } else if (combo === 3) {
      comboText = 'EXCELLENT!';
      color = '#ff00ff'; // Magenta
      fontSize = '80px';
    } else if (combo >= 4) {
      comboText = `${combo}X COMBO!`;
      color = '#ff0000'; // Red
      fontSize = '96px';
    }

    // Update text
    this.comboText.setText(`${comboText}\n+${Math.floor(score)}`);
    this.comboText.setFontSize(fontSize);
    this.comboText.setColor(color);
    this.comboText.setAlpha(1);
    this.comboText.setScale(0.5);
    this.comboText.setPosition(this.scale.width / 2, this.scale.height / 2 - 50);

    // Animate: scale up, fade out, move up
    this.comboTween = this.tweens.add({
      targets: this.comboText,
      scaleX: 1.2,
      scaleY: 1.2,
      y: this.scale.height / 2 - 100,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.comboText?.setAlpha(0);
      }
    });
  }

  private restartGame() {
    this.scene.stop('GameOverScene');
    this.scene.restart();
  }
}
