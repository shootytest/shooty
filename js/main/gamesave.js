import { Enemy } from "../game/enemy.js";
import { player } from "../game/player.js";
import { send, set_wave_name, text_wave } from "../game/send.js";
import { Thing } from "../game/thing.js";
import { multiplayer } from "../main/multiplayer.js";
import { make } from "../lib/make.js";
import { player_make } from "../lib/playermake.js";
import { get_gamesave, set_gamesave } from "../util/localstorage.js";

// hopefully the only place I will use JSON.stringify/parse

export const gamesave = {};

const player_keys = [
  "position",
  // settings
  "player_autofire",
  // dead
  "player_dead", "player_dead_time", "player_invincibility_time", "old_player_position",
  // wave
  "wave_health_lost",
  // upgrades
  "current_upgrade", "reached_upgrades", "unlocked_upgrades",
  // counters
  "points", "lives", "items_collected", "items_collected_display",
  // account
  "username",
];

const send_keys = [
  // wave
  "wave", "wave_name", "wave_ended", "wave_time",
  // game
  "game_ended",
];

gamesave.save = function(force = false) {
  if (!force && !send.game_ended && !send.wave_ended && !multiplayer.is_multiplayer) return;
  const o = {
    send: { },
    player: { },
    time: Thing.time,
  };
  player.update_inventory();
  for (const k of player_keys) {
    o.player[k] = player[k];
  }
  for (const k of send_keys) {
    o.send[k] = send[k];
  }
  if (multiplayer.is_multiplayer) {
    // multiplayer case
    o.enemies = Enemy.enemy_type_list();
    o.multiplayer = true;
  }
  set_gamesave(JSON.stringify(o));
  console.log("game saved!");
}

gamesave.savelives = function() {
  const o = JSON.parse(get_gamesave());
  if (o.player != null && player != null) {
    o.player.lives = player.lives;
  }
  set_gamesave(JSON.stringify(o));
}

gamesave.load = function() {
  const o = JSON.parse(get_gamesave());
  for (const k of player_keys) {
    player[k] = o.player[k];
  }
  for (const k of send_keys) {
    send[k] = o.send[k];
  }
  Thing.time = o.time || 0;
  if (o.multiplayer) {
    // multiplayer case
    multiplayer.is_multiplayer = true;
    multiplayer.suppress_gamesave = true;
    for (const enemy_type of o.enemies) {
      Enemy.create(enemy_type);
    }
    multiplayer.suppress_gamesave = false;
  } else {
    text_wave(o.send.wave || 0);
  }
  player.make(make.player);
  player.make(player_make[player.current_upgrade]);
}