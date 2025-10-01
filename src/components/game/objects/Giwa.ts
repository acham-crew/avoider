import Phaser from 'phaser';

/**
 * Giwa (Korean roof tile) - the main falling obstacle
 */
export class Giwa extends Phaser.Physics.Arcade.Sprite {
  private fallSpeed: number = 150;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'giwa');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
  }

  /**
   * Spawn the Giwa at a random X position at the top of the screen
   */
  public spawn(speed: number) {
    const x = Phaser.Math.Between(30, this.scene.scale.width - 30);
    const y = -20; // Start above the screen

    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.fallSpeed = speed;
    this.setVelocityY(this.fallSpeed);
  }

  /**
   * Update the Giwa's fall speed (for slow motion effect)
   */
  public setFallSpeed(speed: number) {
    this.fallSpeed = speed;
    this.setVelocityY(this.fallSpeed);
  }

  /**
   * Deactivate the Giwa (return to pool)
   */
  public deactivate() {
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0, 0);
  }

  public update() {
    // Deactivate if it goes off screen
    if (this.y > this.scene.scale.height + 50) {
      this.deactivate();
    }
  }
}
