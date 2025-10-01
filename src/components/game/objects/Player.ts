import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveLeft: boolean = false;
  private moveRight: boolean = false;
  private speedBoostActive: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set up physics
    this.setCollideWorldBounds(true);
    this.setDrag(GAME_CONFIG.playerDrag, 0);
    this.setMaxVelocity(GAME_CONFIG.playerSpeed, 0);

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
    // Handle keyboard input
    if (this.cursors) {
      if (this.cursors.left.isDown) {
        this.setAccelerationX(-GAME_CONFIG.playerAcceleration);
      } else if (this.cursors.right.isDown) {
        this.setAccelerationX(GAME_CONFIG.playerAcceleration);
      } else if (!this.moveLeft && !this.moveRight) {
        this.setAccelerationX(0);
      }
    }

    // Handle touch input
    if (this.moveLeft) {
      this.setAccelerationX(-GAME_CONFIG.playerAcceleration);
    } else if (this.moveRight) {
      this.setAccelerationX(GAME_CONFIG.playerAcceleration);
    } else if (this.cursors && !this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.setAccelerationX(0);
    }
  }

  public destroy(fromScene?: boolean) {
    // Clean up event listeners
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    super.destroy(fromScene);
  }
}
