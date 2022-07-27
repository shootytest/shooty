import { config } from "../lib/config.js";
import { make } from "../lib/make.js";
import { maps } from "../lib/maps.js";
import { waves_info } from "../lib/waves.js";
import { random } from "../util/random.js";
import { Player, player } from "./player.js";
import { send, send_queue } from "./send.js";
import { Thing } from "./thing.js";

const Body = Matter.Body,
      Query = Matter.Query,
      Vector = Matter.Vector;

export class Enemy extends Thing {

  static get_spawn_zones() {
    let zones = maps[waves_info[send.wave_name].map].zones;
    if (zones == null) {
      const M = maps[waves_info[send.wave_name].map];
      zones = [{ x: -M.width, y: -M.height, w: M.width * 2, h: M.height * 2, }];
    }
    return zones;
  }

  static random_zone() {
    return random.randint(0, Enemy.get_spawn_zones().length - 1);
  }

  static random_location(s = 0) {
    const zone = Enemy.get_spawn_zones()[Enemy.random_zone()];
    return Vector.create(random.rand(zone.x + s, zone.x + zone.w - s), random.rand(zone.y + s, zone.y + zone.h - s));
  }

  static create(type, is_boss) {
    const e = new Enemy();
    e.make(make["enemy_" + type]);
    e.position = (is_boss) ? Vector.create() : Enemy.random_location(e.size);
    e.target.facing = player.position;
    e.target.rotation = Vector.angle(e.position, e.target.facing);
    e.create_list();
    //e.create();
  }

  static check() {
    return Thing.enemies.length > 0 || !send_queue.isEmpty();
  }

  static total_wave_health = 0;
  static wave_start_time = -1;
  static wave_finish_time = -1;
  static first_wave_start_time = -1;

  static ratio_cleared() {
    let total = 0;
    for (const e of Thing.enemies) {
      if (!e._total_wave_health_counted) {
        e._total_wave_health_counted = true;
        Enemy.total_wave_health += e.health.capacity;
      }
      total += e.health.health;
    }
    return (Enemy.total_wave_health === 0) ? 0 : total / Enemy.total_wave_health;
  }

  static start_wave(wave) {
    if (wave === 1) {
      Enemy.first_wave_start_time = Thing.time;
    }
    if (wave !== 0) {
      Enemy.wave_start_time = Thing.time;
      Enemy.wave_finish_time = -1;
    }
    send.wave_time = Thing.time;
    Enemy.total_wave_health = 0;
    player.wave_health_lost = 0;
  }

  static end_wave(wave) {
    Enemy.wave_finish_time = Thing.time;
  }

  static blocks_sight_wall_list() {
    const result = [];
    for (const w of Thing.walls) {
      if (!w.blocks_sight) continue;
      result.push(w.body);
    }
    return result;
  }

  static nearest(v) {
    let result;
    let distance2 = 0, best = 1000000;
    for (const e of Thing.enemies) {
      distance2 = Vector.magnitudeSquared(Vector.sub(v, e.position));
      if (best === 1000000 || distance2 < best) {
        best = distance2;
        result = e;
      }
    }
    return result;
  }

  enemy_ram = false;
  spawn_mark = null;
  spawn_mark_time = config.game.enemy_spawn_delay;

  constructor(position) {
    super(position); // ah yes, superposition
  }

  tick() {
    super.tick();
    if (this.spawn_mark_time > 0) {
      this.spawn_mark_time--;
      if (this.spawn_mark == null) {
        this.create_mark();
      }
      if (this.spawn_mark_time === 0) {
        this.remove_mark();
        this.create();
      }
    } else {
      this.tick_enemy();
    }
  }

  tick_enemy() {
    // if can see player
    const can_see_player = !player.player_dead && Query.ray(Enemy.blocks_sight_wall_list(), this.position, player.position).length == 0;
    if (true) {
      if (can_see_player && this.target_player) {
        this.target.facing = player.position;
      } else {
        // this.target.facing = Vector.add(this.position, Vector.createpolar(this.target.rotation, 1));
      }
      if (!this.never_shoot && (this.always_shoot || can_see_player)) {
        this.shoot();
      }
    }
  }

  draw(ctx, scale = camera.scale) {
    if (this.spawn_mark_time > 0) return;
    super.draw(ctx, scale);
  }

  shoot() {
    super.shoot();
  }

  create() {
    super.create();
  }

  create_mark() {
    const mark = new Thing(this.position);
    mark.make(make.enemy_spawn_symbol);
    mark.size = this.size;
    mark.create();
    this.spawn_mark = mark;
  }

  remove() {
    super.remove();
  }

  remove_mark() {
    this.spawn_mark.remove();
  }

}