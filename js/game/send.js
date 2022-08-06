import { clear_messages, send_message, ui } from "../draw/ui.js";
import { C } from "../lib/color.js";
import { config } from "../lib/config.js";
import { waves, waves_info, waves_points, waves_text, wave_ratings } from "../lib/waves.js";
import { PriorityQueue } from "../util/priorityqueue.js";
import { Thing } from "./thing.js";
import { Enemy } from "./enemy.js";
import { player } from "./player.js";
import { gamesave } from "../main/gamesave.js";
import { make, realitems, realmake } from "../lib/make.js";
import { firebase } from "../util/firebase.js";
import { get_account_username } from "../util/localstorage.js";
import { math_util } from "../util/math.js";

export const send = {
  wave: -1,
  wave_name: "tutorial",
  wave_ended: true,
  wave_time: 0,
  game_ended: false,
}

// TODO: remove debugging feature
window.send = send;

export const send_queue = new PriorityQueue((a, b) => {
  return a.time < b.time;
});

export function set_wave_name(wave_name) {
  send.wave_name = wave_name;
}

export const init_send = function() {
  // do nothing?
}

export const tick_send = function() {
  while (!send_queue.isEmpty() && send_queue.peek().time < Thing.time) {
    const s = send_queue.peek();
    Enemy.create(s.type, s.boss);
    send_queue.pop();
  }
}

export const text_wave = function(wave) {
  const the_wave_text = waves_text[send.wave_name][wave];
  if (the_wave_text != null) {
    clear_messages();
    for (const text of the_wave_text) {
      if (text.after) continue;
      send_message(text.message, text.color, text.time, text.delay);
    }
  }
}

const ui_end_overlay_function = function() {
  ui.end_overlay = true;
  ui.end_score = 0;
  ui.end_score_target = math_util.round(player.points, 0);
  ui.end_rounds = 0;
  ui.end_rounds_target = send.wave;
  ui.end_rating = wave_ratings.length - 1;
  ui.end_rating_target = get_rating_number(send.wave_name, player.points);
}

export const end_game = function(finished = false) {
  send.game_ended = true;
  gamesave.save(true);
  ui_end_overlay_function();
  // update leaderboard
  firebase.get(`/leaderboard/`, function(boards) {
    if (boards[send.wave_name] == null) {
      console.log(`/leaderboard/${send.wave_name}`);
      firebase.set(`/leaderboard/${send.wave_name}/${get_account_username()}/score`, 0);
    }
    const entry = (boards[send.wave_name] || { })[get_account_username()] || { score: 0, };
    const waveinfo = waves_info[send.wave_name];
    const oldscore = entry.score;
    const newscore = Math.round(player.points);
    if (newscore >= oldscore) {
      console.log(newscore);
      firebase.set(`/leaderboard/${send.wave_name}/${get_account_username()}`, {
        score: newscore,
        rounds: ((finished) ? waveinfo.rounds : (send.wave - 1)),
        used: player.current_upgrade,
      });
    }
  });
}

export const next_wave = function() {
  if (Enemy.check()) {
    send_message("Clear all enemies before continuing!", C.message_text, 150);
    return;
  }
  const the_wave = waves[send.wave_name][send.wave + 1];
  if (the_wave == null) {
    // finished waves!
    end_game(true);
    return;
  } else if (Array.isArray(the_wave)) {
    for (const wave of the_wave) {
      send_wave(wave);
    }
  } else if (typeof the_wave === "number") {
    // do nothing, wave 0
  } else {
    send_wave(the_wave);
  }
  text_wave(send.wave + 1);
  Enemy.start_wave(send.wave + 1);
  send.wave_ended = false;
  send.wave++;
}

export const end_wave = function() {
  if (send.wave_ended) return;
  send.wave_ended = true;
  const the_wave_text = waves_text[send.wave_name][send.wave];
  clear_messages();
  if (the_wave_text != null) {
    for (const text of the_wave_text) {
      if (!text.after) continue;
      send_message(text.message, text.color, text.time, text.delay);
    }
  }
  Enemy.end_wave(send.wave);
  // calculate points
  const wp = waves_points[send.wave_name];
  const time_taken = Thing.time - send.wave_time;
  const point_multiplier = wp.points[send.wave];
  if (point_multiplier == null || send.wave === 0) return;
  const points = Math.round(point_multiplier * (config.game.clear_wave_time_add + Math.max(0, config.game.clear_wave_normal_points / Math.max(1, time_taken / 60 / wp.time[send.wave])))); // don't give nothing!
  const p = player.add_points("clear", points);
  send_message(`You passed the round and gained ${p} points!`, /* (points === Math.round(wp.points[send.wave] * config.game.clear_wave_time_add)) ? C.message_text_green : */ C.message_text_aqua, -1, 45);
  if (player.wave_health_lost < 0.000001) {
    const bonus_points = Math.round(config.game.clear_wave_without_losing_health_points * point_multiplier);
    const bonus_coins = Math.round(config.game.clear_wave_without_losing_health_coins * point_multiplier);
    player.add_points("bonus", bonus_points);
    // drop 10 coins too
    for (let index = 0; index < bonus_coins; index++) {
      const i = new Thing(Enemy.random_location(1));
      i.make(make.item_normal);
      i.create();
    }
    send_message(`You did not lose any health for the round and gained ${bonus_points} points!`, C.message_text_gold, -1, 55);
  }
  // save the game
  gamesave.save();
}

export const send_wave = function(wave) {
  let time = Thing.time + (wave.delay || 0);
  for (let i = 0; i < (wave.number || 0); i++) {
    send_queue.push({
      time: time, type: wave.type, wave: wave, boss: wave.boss,
    });
    time += (wave.interval || 0);
  }
}

export const level_total_points = function(wave_name) {
  if (waves_info[wave_name] == null) return -1;
  if (waves_info[wave_name].total_points != null) return waves_info[wave_name].total_points;
  let total_points = 0;
  function calculate_enemy_points(wave) {
    const enemy_key = "enemy_" + wave.type;
    let enemy_points = 0;
    const E = realmake(enemy_key);
    if (E.health != null) {
      enemy_points += config.game.health_mult * config.game.damage_points_mult * (E.health.capacity || 0);
    }
    const I = realitems(enemy_key);
    enemy_points += config.game.item_points_mult * (I.coin || 0);
    total_points += enemy_points * wave.number;
  }
  // calculate enemy points loop
  for (const the_wave of waves[wave_name]) {
    if (Array.isArray(the_wave)) {
      for (const wave of the_wave) {
        calculate_enemy_points(wave);
      }
    } else if (typeof the_wave === "number") {
      // wave 0
    } else {
      calculate_enemy_points(the_wave);
    }    
  }
  // calculate end-of-wave points loop
  const point_constant_1 = config.game.clear_points_mult * (config.game.clear_wave_time_add + config.game.clear_wave_normal_points);
  const point_constant_2 = config.game.bonus_points_mult * config.game.clear_wave_without_losing_health_points;
  for (const wave_point_multiplier of waves_points[wave_name].points) {
    if (!wave_point_multiplier) continue;
    // account for rounding
    total_points += Math.round(point_constant_1 * wave_point_multiplier);
    total_points += Math.round(point_constant_2 * wave_point_multiplier);
    total_points += Math.round(config.game.item_points_mult * Math.round(config.game.clear_wave_without_losing_health_coins * wave_point_multiplier));
  }
  // memo and return
  waves_info[wave_name].total_points = total_points;
  return total_points;
}

export const get_rating_number = function(wave_name, points) {
  const total = level_total_points(wave_name);
  if (total === -1) return wave_ratings.length - 1;
  if (total === 0) return 0;
  if (points === 0) return 12;
  const ratio = (points || 0) / total;
  const ratings = waves_points[wave_name].ratings;
  for (let i = 0; i < ratings.length; i++) {
    if (ratings[i] == null) continue;
    if (ratio >= ratings[i]) {
      return i;
    }
  }
  return wave_ratings.length - 1;
}