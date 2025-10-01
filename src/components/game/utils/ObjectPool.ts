import Phaser from 'phaser';
import { Giwa } from '../objects/Giwa';
import { Item } from '../objects/Item';

/**
 * Object pool for Giwa tiles to prevent GC pauses
 */
export class GiwaPool {
  private pool: Giwa[] = [];
  private scene: Phaser.Scene;
  private poolSize: number;

  constructor(scene: Phaser.Scene, size: number = 50) {
    this.scene = scene;
    this.poolSize = size;
    this.initialize();
  }

  private initialize() {
    for (let i = 0; i < this.poolSize; i++) {
      const giwa = new Giwa(this.scene, 0, 0);
      this.pool.push(giwa);
    }
  }

  /**
   * Get an inactive Giwa from the pool, or create a new one if none available
   */
  public spawn(speed: number): Giwa | null {
    const giwa = this.pool.find(g => !g.active);

    if (giwa) {
      giwa.spawn(speed);
      return giwa;
    }

    // Pool exhausted, create a new one
    const newGiwa = new Giwa(this.scene, 0, 0);
    this.pool.push(newGiwa);
    newGiwa.spawn(speed);
    return newGiwa;
  }

  /**
   * Get all active Giwas
   */
  public getActive(): Giwa[] {
    return this.pool.filter(g => g.active);
  }

  /**
   * Deactivate all Giwas
   */
  public clear() {
    this.pool.forEach(g => g.deactivate());
  }

  /**
   * Update all active Giwas
   */
  public update() {
    this.pool.forEach(g => {
      if (g.active) {
        g.update();
      }
    });
  }
}

/**
 * Object pool for Items to prevent GC pauses
 */
export class ItemPool {
  private pool: Item[] = [];
  private scene: Phaser.Scene;
  private poolSize: number;

  constructor(scene: Phaser.Scene, size: number = 20) {
    this.scene = scene;
    this.poolSize = size;
    this.initialize();
  }

  private initialize() {
    for (let i = 0; i < this.poolSize; i++) {
      const item = new Item(this.scene, 0, 0);
      this.pool.push(item);
    }
  }

  /**
   * Get an inactive Item from the pool, or create a new one if none available
   */
  public spawn(speed: number, type: 'chest' | 'shoes' | 'shield' | 'clock'): Item | null {
    const item = this.pool.find(i => !i.active);

    if (item) {
      item.spawn(speed, type);
      return item;
    }

    // Pool exhausted, create a new one
    const newItem = new Item(this.scene, 0, 0);
    this.pool.push(newItem);
    newItem.spawn(speed, type);
    return newItem;
  }

  /**
   * Get all active Items
   */
  public getActive(): Item[] {
    return this.pool.filter(i => i.active);
  }

  /**
   * Deactivate all Items
   */
  public clear() {
    this.pool.forEach(i => i.deactivate());
  }

  /**
   * Update all active Items
   */
  public update() {
    this.pool.forEach(i => {
      if (i.active) {
        i.update();
      }
    });
  }
}
