import Phaser from 'phaser';

export type ItemType = 'chest' | 'shoes' | 'shield' | 'clock';

/**
 * Item - collectible power-ups and bonuses
 */
export class Item extends Phaser.Physics.Arcade.Sprite {
  private fallSpeed: number = 150;
  private itemType: ItemType = 'chest';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'item-chest');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
  }

  /**
   * Spawn an item at a random position
   */
  public spawn(speed: number, type: ItemType) {
    const x = Phaser.Math.Between(30, this.scene.scale.width - 30);
    const y = -20; // Start above the screen

    this.itemType = type;
    this.setTexture(`item-${type}`);
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.fallSpeed = speed;
    this.setVelocityY(this.fallSpeed);
  }

  /**
   * Update the item's fall speed (for slow motion effect)
   */
  public setFallSpeed(speed: number) {
    this.fallSpeed = speed;
    this.setVelocityY(this.fallSpeed);
  }

  /**
   * Get the type of this item
   */
  public getType(): ItemType {
    return this.itemType;
  }

  /**
   * Deactivate the item (return to pool)
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
