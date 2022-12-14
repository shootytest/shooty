import { clear_messages, send_message, ui } from "../draw/ui.js";
import { C } from "../lib/color.js";
import { config } from "../lib/config.js";
import { waves, waves_info, waves_points, waves_text, wave_ratings } from "../lib/waves.js";
import { PriorityQueue } from "../util/priorityqueue.js";
import { Thing } from "./thing.js";
import { Enemy } from "./enemy.js";
import { mapmaker } from "./mapmaker.js";
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

export const send_queue = new PriorityQueue((a, b) => {
  return a.time < b.time;
});

export function set_wave_name(wave_name) {
  send.wave_name = wave_name;
}

export const init_send = function() {
  // do nothing?
  if (get_account_username() === "dev") {
    // debug stuff, TODO remove
    window.send = send;
    window.level_total_points = level_total_points;
    window.get_rating_number = get_rating_number;
  }
}

export const tick_send = function() {
  while (!send_queue.isEmpty() && send_queue.peek().time < Thing.time) {
    const s = send_queue.peek().wave;
    if (s.mapshape != null) {
      mapmaker.remove(s.mapshape);
    }
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
  const wavename = send.wave_name;
  const rating = get_rating_number(wavename, player.points);
  const username = get_account_username();
  // update leaderboard
  /*
  firebase.get(`/leaderboard/${wavename}`, function(board) {
    if (board == null) {
      // console.log(`/leaderboard/${wavename}`);
      firebase.set(`/leaderboard/${wavename}/${username}/score`, 0);
    }
    const entry = (board || { })[username] || { score: 0, };
    const waveinfo = waves_info[wavename];
    const oldpoints = entry.score;
    const newpoints = Math.round(player.points);
    if (newpoints >= oldpoints) {
      // console.log(newpoints);
      firebase.set(`/leaderboard/${wavename}/${username}`, {
        score: newpoints,
        rating: rating,
        rounds: ((finished) ? waveinfo.rounds : (send.wave - 1)),
        used: player.current_upgrade,
      });
    }
  });
  */
  const waveinfo = waves_info[wavename];
  const newpoints = Math.round(player.points);
  // update score
  const playertype = player.current_upgrade;
  firebase.get(`/scores/${username}/${wavename}/${playertype}/`, function(entry) {
    if (entry == null || entry.points == null) {
      entry = { points: 0, };
    }
    const oldpoints = entry.points;
    if (newpoints >= oldpoints) {
      firebase.set(`/scores/${username}/${wavename}/${playertype}/`, {
        points: newpoints,
        rating: rating,
        rounds: ((finished) ? waveinfo.rounds : (send.wave - 1)),
      }); 
    }
  });
  // disallow some upgrades
  if (waveinfo.disallow_upgrades != null && waveinfo.disallow_upgrades.includes(playertype)) return;
  // else update best score (allowed)
  firebase.get(`/scores/${username}/${wavename}/best/`, function(entry) {
    if (entry == null || entry.points == null) {
      entry = { points: 0, };
    }
    const oldpoints = entry.points;
    if (newpoints >= oldpoints) {
      // check if player exists or not
      firebase.get(`/users/${username}/players`, function(players) {
        if (players.includes(playertype)) {
          // set the score
          firebase.set(`/scores/${username}/${wavename}/best/`, {
            points: newpoints,
            rating: rating,
            rounds: ((finished) ? waveinfo.rounds : (send.wave - 1)),
            use: playertype,
          });
        }
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
    // do nothing, it's wave 0
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
  // calculate wave points
  const points = Math.round(point_multiplier * 
    (config.game.clear_wave_time_add + // don't give nothing!
      Math.max(0, config.game.clear_wave_normal_points / 
      Math.max(1, time_taken / 60 / wp.time[send.wave]))
    )
  );
  const p = player.add_points("clear", points);
  send_message(`You passed the round and gained ${p} points!`, C.message_text_aqua, -1, 45);
  // calculate bonus health points
  if (player.wave_health_lost < config.game.player_health * 1000000) {
    const bonus_ratio = 1 / Math.pow(1 + player.wave_health_lost / config.game.player_health, 0.75);
    const bonus_points = Math.round(point_multiplier * bonus_ratio *
      config.game.clear_wave_without_losing_health_points);
    const bonus_coins = Math.round(point_multiplier * bonus_ratio *
      config.game.clear_wave_without_losing_health_coins);
    player.add_points("bonus", bonus_points);
    // drop some bonus coins too
    for (let index = 0; index < bonus_coins; index++) {
      const i = new Thing(Enemy.random_location(1));
      i.make(make.item_normal);
      i.create();
    }
    const lost_health = (player.wave_health_lost * config.game.health_mult);
    const nice_round_number = Math.abs(Math.round(lost_health) - lost_health) <= Number.MIN_VALUE;
    send_message(`You lost ${nice_round_number ? lost_health.toFixed(2) : Math.round(lost_health)} health for the round and gained ${bonus_points} points!`, C.message_text_gold, -1, 55);
  }
  // save the game
  gamesave.save();
}

export const send_wave = function(wave) {
  let time = Thing.time + (wave.delay || 0);
  for (let i = 0; i < (wave.number || 0); i++) {
    send_queue.push({
      time: time, wave: wave,
    });
    time += (wave.interval || 0);
  }
}

export const level_total_points = function(wave_name) {
  // the level doesn't exist!
  if (waves_info[wave_name] == null) return -1;
  // if already calculated before, just return the value (it wouldn't change)
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
  // memoize, return
  waves_info[wave_name].total_points = total_points;
  return total_points;
}

export const get_rating_number = function(wave_name, points) {
  const total = level_total_points(wave_name);
  if (total === -1) return wave_ratings.length - 1;
  if (total === 0) return 0;
  points = points || 0;
  if (points === 0) return 12;
  const ratings = waves_points[wave_name].ratings;
  for (let i = 0; i < ratings.length; i++) {
    if (ratings[i] == null) continue;
    if (points - ratings[i] * total >= -Number.MIN_VALUE) {
      return i;
    }
  }
  return wave_ratings.length - 1;
}