import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { useGameStore } from '@/stores/gameStore';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveLeft: boolean = false;
  private moveRight: boolean = false;
  private speedBoostActive: boolean = false;
  private currentAnimation: string = 'player-idle';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set sprite display size from config
    const displaySize = GAME_CONFIG.displaySize.player;
    this.setDisplaySize(displaySize, displaySize);

    // Set up physics body
    this.setCollideWorldBounds(true);
    this.setDrag(GAME_CONFIG.playerDrag, 0);
    this.setMaxVelocity(GAME_CONFIG.playerSpeed, 0);

    // Adjust physics body size using config hitbox multiplier
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      const hitboxSize = displaySize * GAME_CONFIG.hitboxMultiplier.player;
      body.setSize(hitboxSize, hitboxSize);
      body.setOffset((displaySize - hitboxSize) / 2, (displaySize - hitboxSize) / 2);
    }

    // Play initial animation (delay to ensure animations are loaded)
    scene.time.delayedCall(0, () => {
      if (this.anims && this.anims.exists('player-idle')) {
        this.play('player-idle');
      }
    });

    // Set up keyboard input
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
    }

    // Set up touch input
    scene.input.on('pointerdown', this.handlePointerDown, this);
    scene.input.on('pointerup', this.handlePointerUp, this);
    scene.input.on('pointermove', this.handlePointerMove, this);
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const screenWidth = this.scene.scale.width;
    if (pointer.x < screenWidth / 2) {
      this.moveLeft = true;
      this.moveRight = false;
    } else {
      this.moveRight = true;
      this.moveLeft = false;
    }
  }

  private handlePointerUp() {
    this.moveLeft = false;
    this.moveRight = false;
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (pointer.isDown) {
      const screenWidth = this.scene.scale.width;
      if (pointer.x < screenWidth / 2) {
        this.moveLeft = true;
        this.moveRight = false;
      } else {
        this.moveRight = true;
        this.moveLeft = false;
      }
    }
  }

  public setSpeedBoost(active: boolean) {
    this.speedBoostActive = active;
    const maxSpeed = active ? GAME_CONFIG.playerSpeedBoosted : GAME_CONFIG.playerSpeed;
    this.setMaxVelocity(maxSpeed, 0);
  }

  public update() {
    // Determine movement direction
    let isMovingLeft = false;
    let isMovingRight = false;

    // Handle keyboard input
    if (this.cursors) {
      if (this.cursors.left.isDown) {
        this.setAccelerationX(-GAME_CONFIG.playerAcceleration);
        isMovingLeft = true;
      } else if (this.cursors.right.isDown) {
        this.setAccelerationX(GAME_CONFIG.playerAcceleration);
        isMovingRight = true;
      } else if (!this.moveLeft && !this.moveRight) {
        this.setAccelerationX(0);
      }
    }

    // Handle touch input
    if (this.moveLeft) {
      this.setAccelerationX(-GAME_CONFIG.playerAcceleration);
      isMovingLeft = true;
    } else if (this.moveRight) {
      this.setAccelerationX(GAME_CONFIG.playerAcceleration);
      isMovingRight = true;
    } else if (this.cursors && !this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.setAccelerationX(0);
    }

    // Update animation based on movement
    this.updateAnimation(isMovingLeft, isMovingRight);
  }

  private updateAnimation(isMovingLeft: boolean, isMovingRight: boolean) {
    // Check if animations are available
    if (!this.anims) return;

    const state = useGameStore.getState();

    // Moving left
    if (isMovingLeft) {
      this.setFlipX(true); // Flip sprite horizontally
      if (this.currentAnimation !== 'player-run' && this.anims.exists('player-run')) {
        this.play('player-run', true);
        this.currentAnimation = 'player-run';
      }
      // Sync to store
      state.setPlayerDirection('left');
      state.setPlayerAnimation('run');
    }
    // Moving right
    else if (isMovingRight) {
      this.setFlipX(false); // Normal direction
      if (this.currentAnimation !== 'player-run' && this.anims.exists('player-run')) {
        this.play('player-run', true);
        this.currentAnimation = 'player-run';
      }
      // Sync to store
      state.setPlayerDirection('right');
      state.setPlayerAnimation('run');
    }
    // Idle (not moving)
    else {
      if (this.currentAnimation !== 'player-idle' && this.anims.exists('player-idle')) {
        this.play('player-idle', true);
        this.currentAnimation = 'player-idle';
      }
      // Sync to store
      state.setPlayerDirection('idle');
      state.setPlayerAnimation('idle');
    }
  }

  public destroy(fromScene?: boolean) {
    // Clean up event listeners if scene and input still exist
    if (this.scene && this.scene.input) {
      this.scene.input.off('pointerdown', this.handlePointerDown, this);
      this.scene.input.off('pointerup', this.handlePointerUp, this);
      this.scene.input.off('pointermove', this.handlePointerMove, this);
    }
    super.destroy(fromScene);
  }
}
