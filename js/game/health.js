import { player } from "./player.js";
import { Thing } from "./thing.js";

export class Health {

  thing = null;

  health = 0;
  capacity = 0;
  regen = 0;
  damage = 0; // body damage

  invincible = false;

  hit_time = -1000000;
  hit_clear = 0;
  hit_tick = 0;

  constructor(thing) {
    this.thing = thing;
  }

  get ratio() {
    return this.health / this.capacity;
  }

  get percentage() {
    return this.ratio * 100;
  }

  tick() {
    const time = Thing.time;
    if (this.hit_tick > 0.000001) {
      this.hit(this.hit_tick);
    }
    if (time - this.hit_time > this.hit_clear && this.regen !== 0 && this.health < this.capacity) {
      // can regenerate
      this.health += this.regen;
    }
    if (this.health > this.capacity) {
      this.health = this.capacity;
    }
  }

  hit(damage) {
    if (this.invincible) return;
    const old_health = this.health;
    this.health -= damage;
    this.hit_time = Thing.time;
    const real_damage = Math.min(damage, old_health);
    if (this.thing.player) {
      player.wave_health_lost += real_damage;
    }
    return real_damage;
  }

  hit_add(damage) {
    if (this.invincible) return;
    this.hit_tick += damage;
  }

  hit_remove(damage) {
    if (this.invincible) return;
    this.hit_tick -= damage;
  }

  restore() {
    this.health = this.capacity;
  }

  set_capacity(capacity) {
    this.capacity = capacity;
    this.health = capacity;
  }

  zero() {
    return this.capacity > 0 && this.health <= 0;
  }

}