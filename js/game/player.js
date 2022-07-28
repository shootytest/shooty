import { camera } from "../draw/camera.js";
import { ui } from "../draw/ui.js";
import { config } from "../lib/config.js";
import { make } from "../lib/make.js";
import { maps } from "../lib/maps.js";
import { player_make } from "../lib/playermake.js";
import { upgrades } from "../lib/upgrades.js";
import { waves_info } from "../lib/waves.js";
import { gamesave } from "../main/gamesave.js";
import { add_key_listener, check_keys, keys } from "../main/key.js";
import { firebase } from "../util/firebase.js";
import { get_account_username } from "../util/localstorage.js";
import { random } from "../util/random.js";
import { Enemy } from "./enemy.js"; // somehow, removing this line breaks things (import system!!!)
import { end_game, send } from "./send.js";
import { Thing } from "./thing.js";

const Body = Matter.Body,
      Vector = Matter.Vector;

export class Player extends Thing {

  static random_spawn_location() {
    const spawn = maps[waves_info[send.wave_name].map].spawn;
    if (spawn == null) return Enemy.random_location(0);
    const loc = spawn[random.randint(0, spawn.length - 1)];
    return Vector.clone(loc);
  }

  static nearest_bullet(position_vector) {
    let result;
    let distance2 = 0, best = 1234567;
    for (const t of Thing.things) {
      if (!t.player_bullet || !t.exists) continue;
      distance2 = Vector.magnitudeSquared(Vector.sub(position_vector, t.position));
      if (best === 1234567 || distance2 < best) {
        best = distance2;
        result = t;
      }
    }
    return result;
  }

  player_autofire = false;
  player_dead = false;
  player_dead_time = 0;
  player_invincibility_time = 0;
  old_player_position = Vector.create();
  wave_health_lost = 0;

  // upgrades
  unlocked_upgrades = ["basic"];
  reached_upgrades = [];
  current_upgrade = "basic";

  // counters
  points = 0;
  lives = 3;
  items_collected = { };
  items_collected_display = { };

  // account
  username = "guest???";

  constructor() {
    super(Vector.create(0, 0));
    this.username = get_account_username();
    this.make(make.player);
    this.make(player_make[this.current_upgrade]);
    for (const a of upgrades[this.current_upgrade].connections) {
      this.reached_upgrades.push(a);
    }
  }

  tick() {
    super.tick();
    this.tick_player();
    this.tick_player_test();
  }

  tick_player() {
    // if not dead
    if (!this.player_dead) {
      // rotate player
      this.target.facing = camera.mouse_position;
      // move player
      const move_x = (check_keys(config.controls.right) ? 1 : 0) - (check_keys(config.controls.left) ? 1 : 0);
      const move_y = (check_keys(config.controls.down) ? 1 : 0) - (check_keys(config.controls.up) ? 1 : 0);
      this.move_player(Vector.create(move_x, move_y));
      // shoot player
      this.shooting = this.player_autofire || check_keys(config.controls.shoot);
    }
  }

  tick_player_test() {
    // nothing for now
    add_key_listener("t", () => {
      Body.setPosition(this.body, camera.mouse_position);
    });
  }

  tick_death() {
    super.tick_death();
    if (this.health.zero()) {
      // you are dead
      if (!this.player_dead) {
        this.lives -= 1;
        this.player_dead = true;
        this.player_dead_time = Thing.time + config.game.respawn_time;
        Body.setVelocity(this.body, Vector.create());
        this.make_invisible();
        this.old_player_position = this.position;
        if (this.lives <= 0) {
          end_game();
        } else {
          gamesave.savelives();
        }
      }
      if (this.killer != null) {
        Body.setPosition(this.body, this.killer.position);
      }
    }
    if (this.player_dead_time != 0 && this.player_dead_time < Thing.time) {
      this.player_dead = false;
      this.player_dead_time = 0;
      this.health.restore();
      this.make_visible();
      this.position = this.old_player_position;
      Body.setPosition(this.body, this.old_player_position);
      this.health.invincible = true;
      this.player_invincibility_time = Thing.time + config.game.respawn_invincibility;
    }
    if (this.player_invincibility_time != 0 && this.player_invincibility_time < Thing.time) {
      this.player_invincibility_time = 0;
      this.health.invincible = false;
    }
  }

  draw(ctx) {
    super.draw(ctx);
    this.draw_player(ctx);
  }

  draw_player(ctx) {
    // draw gun(s)...
  }

  move_player(v) {
    this.move_force(Vector.normalise(v));
  }

  shoot() {
    if (this.player_dead) return;
    super.shoot();
  }

  item_collect(type, number) {
    if (this.items_collected[type] == null) this.items_collected[type] = 0;
    this.items_collected[type] += number;
    this.add_points("item", number, { item_type: type });
  }

  get_item_amount(type) {
    return ((player_user ? (player_user.inventory[type] || 0) : 0) + (player.items_collected[type] || 0));
  }

  spend_items(type, number) {
    const path = `/users/${get_account_username()}/inventory/${type}`;
    const current = this.get_item_amount(type);
    firebase.set(path, current - number);
  }

  add_points(type, number, options) {
    let p = 0;
    if (number === 0 || number == null) return;
    if (type === "damage") {
      p = number * config.game.health_mult * config.game.damage_points_mult;
    } else if (type === "kill") {
      p = number * config.game.kill_points_mult;
    } else if (type === "item") {
      p = number * config.game.item_points_mult;
    } else if (type === "clear") {
      p = number * config.game.clear_points_mult;
    } else if (type === "bonus") {
      p = number * config.game.bonus_points_mult;
    } else {
      console.error("Invalid points type: " + type);
    }
    this.points += p;
    // save game
    gamesave.save();
    return p;
  }

  upgrade_to(type, free_upgrade) {
    const U = upgrades[type];
    if (!this.unlocked_upgrades.includes(U.key)) {
      if (!free_upgrade) {
        if ((this.get_item_amount("coin") || 0) < (U.cost || 0)) {
          return;
        } else {
          this.spend_items("coin", U.cost);
        }
      }
      this.unlocked_upgrades.push(U.key);
      for (const t of U.connections) {
        if (!this.reached_upgrades.includes(t)) {
          this.reached_upgrades.push(t);
        }
      }
    }
    this.current_upgrade = U.key;
    this.make(player_make[U.key]);
  }

  upgrade_all() {
    for (const k in upgrades) {
      const U = upgrades[k];
      if (!this.unlocked_upgrades.includes(U.key)) {
        this.unlocked_upgrades.push(U.key);
        if (!this.reached_upgrades.includes(U.key)) {
          this.reached_upgrades.push(U.key);
        }
      }
    }
  }

  update_inventory() {
    const path = `/users/${get_account_username()}/inventory/`;
    const collect = this.items_collected;
    for (const thing_key in collect) {
      this.items_collected_display[thing_key] = (this.items_collected_display[thing_key] || 0) + collect[thing_key];
    }
    firebase.get(path, (inv) => {
      for (const thing_key in collect) {
        inv[thing_key] = (inv[thing_key] || 0) + collect[thing_key];
      }
      firebase.set(path, inv);
      this.items_collected = { };
    });
  }

}

export const player = new Player();
window.player = player;

// tie firebase
export let player_user = null;
firebase.listen(`/users/${get_account_username()}`, function(user) {
  player_user = user;
});