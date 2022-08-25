import { Enemy } from "../game/enemy.js";
import { player, player_user } from "../game/player.js";
import { end_game, end_wave, next_wave, send } from "../game/send.js";
import { Thing } from "../game/thing.js";
import { C } from "../lib/color.js";
import { config } from "../lib/config.js";
import { make } from "../lib/make.js";
import { player_make } from "../lib/playermake.js";
import { upgrades } from "../lib/upgrades.js";
import { waves, waves_points, wave_ratings, wave_ratings_colors } from "../lib/waves.js";
import { controls } from "../main/controls.js";
import { check_keys } from "../main/key.js";
import { multiplayer } from "../main/multiplayer.js";
import { firebase } from "../util/firebase.js";
import { get_account_username } from "../util/localstorage.js";
import { math_util } from "../util/math.js";
import { mobile } from "../util/mobile.js";
import { PriorityQueue } from "../util/priorityqueue.js";
import { camera } from "./camera.js";
import { draw } from "./draw.js";
import { draw_svg } from "./svg.js";

const Vector = Matter.Vector;

export const ui = {
  time: 0,
  old_click: false,
  new_click: false,
  old_rclick: false,
  new_rclick: false,
  enemy_clear_ratio: 1,
  enemy_clear_smoothness: 0.1,
  health_ratio: 0,
  health_smoothness: 0.1,
  health_full_time: 0,
  points: 0,
  points_hard: 0,
  points_smoothness: 0.1,
  messages: new PriorityQueue((a, b) => a.time < b.time),
  message_threshold: 0.3,
  // paused?
  paused: false,
  pause_time: 0,
  // nothing
  nothing_overlay: false,
  // upgrade
  upgrade_overlay: false, // useless
  unlocked_upgrades: [],
  // shop
  shop_overlay: false,
  // inventory
  inventory_overlay: false,
  // end
  end_overlay: false,
  end_score: 0,
  end_score_target: 0,
  end_rounds: 0,
  end_rounds_target: 0,
  end_rating: wave_ratings.length - 1,
  end_rating_target: 0,
  end_stuff_smoothness: 0.05,
  // enemy
  enemy_selected: null,
  // popups
  popup: {
    show: false,
    text: "",
    size: 16,
    background: C.darkgrey,
    color: C.white,
  },
  // tick tock
  clocks: ["🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛","🕜","🕝","🕞","🕟","🕠","🕡","🕢","🕣","🕤","🕥","🕦","🕧"],
};

export const lerp = function(a, b, s) {
  return a * (1 - s) + b * s;
}

export const bounce = function(time, period) {
  return Math.abs(period - time % (period * 2)) / period;
}

const check_click = function() {
  return check_keys(config.controls.click);
}

export const init_ui = function() {
  // nothing for now!
  // never mind!
  init_ui_firebase();
  // debug stuff, TODO remove
  if (get_account_username() === "dev") {
    window.ui = ui;
  }
}

const init_ui_firebase = function() {
  firebase.listen(`/users/${get_account_username()}/players`, function(players) {
    ui.unlocked_upgrades = [];
    for (const type of players) {
      if (type == null || upgrades[type] == null) {
        continue;
      }
      if (!ui.unlocked_upgrades.includes(type)) ui.unlocked_upgrades.push(type);
    }
  });
}

export const game_is_paused = function() {
  return ui.paused || ui.shop_overlay || ui.nothing_overlay || ui.inventory_overlay || ui.end_overlay || ui.popup.show;
}

export const close_all_overlays = function() {
  ui.paused = false;
  ui.shop_overlay = false;
  ui.nothing_overlay = false;
  ui.inventory_overlay = false;
  if (!send.game_ended) ui.end_overlay = false;
  ui.popup.show = false;
}

const tick_ui_before = function() {
  if (check_click()) {
    ui.new_click = !ui.old_click;
    ui.old_click = true;
  } else {
    ui.new_click = false;
    ui.old_click = false;
  }
  if (check_keys(["MouseRight"])) {
    ui.new_rclick = !ui.old_rclick;
    ui.old_rclick = true;
  } else {
    ui.new_rclick = false;
    ui.old_rclick = false;
  }
}

export const draw_ui_before = function(ctx) {
  tick_ui_before();

  const _width = window.innerWidth, _height = window.innerHeight, _scale = camera.scale;
  let x, y, w, h;

  ui.time++;

  if ("wave number") {
    const number_text = (multiplayer.is_multiplayer) ? "|" : ("" + (send.wave + 0));
    const number_size = ((number_text.length > 2) ? 450 : 600) * _scale;
    const location = camera.object_position(Vector.create());
    const current_clear_ratio = (multiplayer.is_multiplayer) ? Enemy.ratio_cleared_realtime() : Enemy.ratio_cleared();
    const clear_ratio = lerp(ui.enemy_clear_ratio, current_clear_ratio, ui.enemy_clear_smoothness);
    ui.enemy_clear_ratio = clear_ratio;
    ctx.font = `bold ${number_size}px roboto mono`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const text_metrics = ctx.measureText(number_text);
    const text_offset = (text_metrics.actualBoundingBoxAscent - text_metrics.actualBoundingBoxDescent) / 2;
    const text_height = (text_metrics.actualBoundingBoxAscent + text_metrics.actualBoundingBoxDescent);
    y = location.y - text_height * (clear_ratio - 0.5);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y, _width, _height - y);
    ctx.clip();
    ctx.fillStyle = math_util.set_color_alpha(C.red, 0.15);
    draw.fill_text(ctx, number_text, location.x, location.y + text_offset);
    ctx.restore();
    if (!Enemy.check() && Enemy.total_wave_health > 0) {
      ctx.fillStyle = math_util.set_color_alpha(C.green_dark, 0.1);
      draw.fill_rect(ctx, 0, 0, _width, _height);
      end_wave();
    }
    ctx.fillStyle = math_util.set_color_alpha((clear_ratio < 0.001) ? C.green_bullet : C.white, 0.15);
    draw.fill_text(ctx, number_text, location.x, location.y + text_offset);
  }
}

export const draw_ui_middle = function(ctx) {

  const _width = window.innerWidth, _height = window.innerHeight, _scale = camera.scale;
  let x, y, w, h, r, c, size;

  if ("enemy selection") {
    // right click to select enemy
    const old_enemy_selected = ui.enemy_selected;
    if (ui.new_rclick) {
      ui.enemy_selected = null;
      for (const e of Thing.enemies) {
        if (!e.exists) continue;
        if (camera.mouse_in_thing(e)) {
          ui.enemy_selected = e;
        }
      }
    }
    // draw enemy selection
    if (old_enemy_selected != null) {
      const e = old_enemy_selected;
      if (!e.exists) {
        if (!ui.enemy_selected.exists) ui.enemy_selected = null;
      } else {
        let s = e.body_shape;
        ctx.globalAlpha = 0.5;
        e.draw_shape(ctx, _scale * 1.25, s);
        ctx.globalAlpha = 1;
        if (ui.new_rclick && ui.enemy_selected != null) {
          window.open(`/info/enemy/?enemy=${e.make_type.substring(6)}`, "_blank");
        }
      }
    }
  }
  
}

export const draw_ui = function(ctx) {

  const _width = window.innerWidth, _height = window.innerHeight, _scale = camera.scale;
  let x, y, w, h, r, c, size;

  if ("ui overlay" && false) {
    const content_height = 100;
    const transition = 50;
    const transition_n = 30;
    ctx.fillStyle = "#FFFFFF88";
    for (let i = 0; i < 10; i++) {
      draw.fill_rect(ctx, 0, 0, _width, content_height);
      draw.fill_rect(ctx, 0, _height - content_height, _width, content_height);
    }
    ctx.fillStyle = "#FFFFFF11";
    for (let i = 0; i < transition_n; i++) {
      h = transition * (i / transition_n);
      draw.fill_rect(ctx, 0, content_height, _width, h);
      draw.fill_rect(ctx, 0, _height - content_height - h, _width, h);
    }
  }

  if ("player health" && !game_is_paused()) {
    const health = player.health;
    const health_ratio = lerp(ui.health_ratio, (player.player_dead) ? 1 : (health.ratio || 0), ui.health_smoothness);
    ui.health_ratio = health_ratio;
    w = _width / 2;
    h = 20;
    ctx.fillStyle = math_util.set_color_alpha(C.white, 0.3);
    draw.fill_rectangle(ctx, _width / 2, _height - 50, w + 13, h + 13);
    ctx.strokeStyle = C.white;
    ctx.lineWidth = 3;
    draw.stroke_rectangle(ctx, _width / 2, _height - 50, w + 2, h + 2);
    if (health_ratio >= 0.999) {
      ui.health_full_time++;
      ctx.fillStyle = chroma.mix(C.green, C.green_health, bounce(ui.health_full_time, 50), "lab");
    } else {
      ui.health_full_time = 0;
      ctx.fillStyle = chroma.mix(C.red_health, C.green_health, health_ratio, "lab");
    }
    draw.fill_rectangle(ctx, _width / 2 - (1 - health_ratio) * w / 2, _height - 50, health_ratio * w, h);
    // red flash
    if (Thing.time - player.health.hit_time < player.health.hit_clear) {
      const hit_time_ratio = 1 - (Thing.time - player.health.hit_time) / player.health.hit_clear
      ctx.fillStyle = math_util.set_color_alpha(C.red_health, 0.2 * hit_time_ratio);
      draw.fill_rect(ctx, 0, 0, _width, _height);
    }
  }

  if ("points" && !game_is_paused()) {
    ui.points_hard = player.points;
    const points = lerp(ui.points, ui.points_hard, ui.points_smoothness);
    ui.points = points;
    const points_text = "" + Math.round(points);
    ctx.font = "20px roboto mono";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = math_util.set_color_alpha(C.background, 0.7);
    draw.fill_rectangle(ctx, _width / 2, 30, ctx.measureText(points_text).width + 30, 30);
    ctx.fillStyle = C.white;
    draw.fill_text(ctx, points_text, _width / 2, 30);
  }

  if ("timers" && !game_is_paused()) {
    ///// wave timer
    let timer = Enemy.wave_start_time === -1 ? "0.00" : (Math.floor((((Enemy.wave_finish_time === -1) ? Thing.time : Enemy.wave_finish_time) - Enemy.wave_start_time) / 60 * 100) / 100).toFixed(2);
    const timer_target = ((waves_points[send.wave_name].time[send.wave] || 0)).toFixed(2);
    let timer_text = "⭕" + timer + "/" + timer_target;
    ctx.font = "20px roboto mono";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.fillStyle = math_util.set_color_alpha(C.background, 0.7);
    w = ctx.measureText(timer_text).width;
    draw.fill_rect(ctx, _width - 35 - w, _height - 45, w + 30, 30);
    ctx.fillStyle = C.white;
    draw.fill_text(ctx, timer_text, _width - 20, _height - 30);
    ///// main timer
    timer = Enemy.first_wave_start_time === -1 ? "0.00" : (Math.floor((Thing.time - Enemy.first_wave_start_time) / 60 * 100) / 100).toFixed(2);
    const clock_emoji = ui.clocks[Math.floor(Thing.time % 24)];
    timer_text = "" + timer;
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    // measure text width
    w = ctx.measureText(timer_text).width;
    w += ctx.measureText(clock_emoji).width;
    // draw back rectangle
    ctx.fillStyle = math_util.set_color_alpha(C.background, 0.7);
    draw.fill_rect(ctx, _width - 35 - w, _height - 95, w + 30, 30);
    ctx.fillStyle = C.white;
    w -= ctx.measureText(clock_emoji).width;
    draw.fill_text(ctx, clock_emoji, _width - 25 - w, _height - 80);
    draw.fill_text(ctx, timer_text, _width - 20, _height - 80);
    ///// test mode
    if (!ui.unlocked_upgrades.includes(player.current_upgrade) && ui.unlocked_upgrades.length > 0) {
      // test mode is on
      let test_mode_text = "🧪 TEST MODE";
      // draw back rectangle
      w = ctx.measureText(test_mode_text).width;
      ctx.fillStyle = math_util.set_color_alpha(C.background, 0.7);
      draw.fill_rect(ctx, _width - 35 - w, _height - 145, w + 30, 30);
      ctx.fillStyle = C.white;
      // then draw text
      draw.fill_text(ctx, test_mode_text, _width - 20, _height - 130);
    }
  }

  if ("items" && !game_is_paused()) {
    const items = player.items_collected;
    const item_text = "" + player.get_item_amount("coin");
    ctx.font = "20px roboto mono";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.fillStyle = math_util.set_color_alpha(C.background, 0.7);
    w = ctx.measureText(item_text).width;
    draw.fill_rect(ctx, _width - 50 - w - 30, 15, w + 70, 30);
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 3;
    draw.circle(ctx, _width - 30, 30, 10);
    ctx.stroke();
    ctx.fillStyle = C.white;
    draw.fill_text(ctx, item_text, _width - 50, 30);
  }

  if ("lives" && !game_is_paused()) {
    const lives = player.lives;
    x = _width - 20;
    ctx.fillStyle = C.red_health;
    for (let i = 0; i < lives; i++) {
      draw.heart(ctx, x, 70, 20, 20);
      ctx.fill();
      x -= 30;
    }
  }

  if ("wave button" && !game_is_paused() && !multiplayer.is_multiplayer) {
    x = 30;
    y = _height - 80;
    w = 50;
    h = 50;
    c = C.green_dark;
    if (camera.mouse_in_rect(x, y, w, h)) {
      c = C.green_health;
      if (ui.new_click) {
        next_wave();
        ui.new_click = false;
      }
    }
    ctx.fillStyle = math_util.set_color_alpha(c, 0.6);
    draw.fill_rect(ctx, x, y, w, h);
    // wave symbol?
  }

  if ("upgrade button" && !game_is_paused() && false) {
    x = 100;
    y = _height - 80;
    w = 50;
    h = 50;
    c = C.blue;
    if (camera.mouse_in_rect(x, y, w, h)) {
      c = C.bright_blue;
      if (ui.new_click) {
        ui.upgrade_overlay = true;
        ui.new_click = false;
      }
    }
    ctx.fillStyle = math_util.set_color_alpha(c, 0.6);
    draw.fill_rect(ctx, x, y, w, h);
    // upgrade symbol?
  }

  if ("messages" && !mobile.screen_mobile && !game_is_paused()) {
    const M = ui.messages;
    while (!M.isEmpty() && M.peek().time < Thing.time) {
      const m = ui.messages.peek();
      M.pop();
    }
    ctx.font = "20px roboto condensed";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    let i = 0;
    const sorted_messages = M._heap.sort((a, b) => a.send_time - b.send_time);
    for (const m of sorted_messages) {
      if (m.send_time > Thing.time || m.time < Thing.time) continue;
      const ratio = (Thing.time - m.send_time) / (m.time - m.send_time);
      const alpha = (1 - ratio > ui.message_threshold) ? 1 : (1 - ratio) / ui.message_threshold;
      y = 12 + 50 * i;
      ctx.fillStyle = math_util.set_color_alpha(m.color, 0.3 * alpha);
      draw.fill_rect(ctx, 16, y, ctx.measureText(m.message).width + 26, 34);
      ctx.fillStyle = math_util.set_color_alpha(m.color, alpha);
      draw.fill_text(ctx, m.message, 30, 30 + 50 * i);
      i++;
    }
    c = C.red;
    if (camera.mouse_in_rect(16, y + 50, 36, 36)) {
      c = C.red_health;
      if (check_click()) {
        clear_messages();
        ui.new_click = false;
      }
    }
    ctx.fillStyle = math_util.set_color_alpha(c, 0.3);
    draw.fill_rect(ctx, 16, y + 50, 36, 36);
    ctx.strokeStyle = math_util.set_color_alpha(c, 1);
    ctx.lineWidth = 3;
    draw.x_cross(ctx, 16, y + 50, 36, 36, 0.7);
  }

  // draw joystick (if mobile)
  if ("joystick" && mobile.is_mobile) {
    ctx.lineWidth = 0;
    const circle_size = 25;
    if (config.joystick.dynamic || true) {
      const j = controls.joystick;
      if (j.left) {
        ctx.fillStyle = math_util.set_color_alpha(C.joystick_left, 0.3);;
        draw.circle(ctx, j.left.x, j.left.y, circle_size);
        ctx.fill();
        if (j.left.v) {
          const v = Vector.mult(Vector.normalise(j.left.v), circle_size * (2 / 3));
          ctx.fillStyle = math_util.set_color_alpha(C.joystick_left, 0.5);
          draw.circle(ctx, j.left.x + v.x, j.left.y + v.y, circle_size / 3);
          ctx.fill();
        }
      }
      if (j.right) {
        ctx.fillStyle = math_util.set_color_alpha(C.joystick_right, 0.3);
        draw.circle(ctx, j.right.x, j.right.y, circle_size);
        ctx.fill();
        if (j.right.v) {
          const v = Vector.mult(Vector.normalise(j.right.v), circle_size * (2 / 3));
          ctx.fillStyle = math_util.set_color_alpha(C.joystick_right, 0.5);
          draw.circle(ctx, j.right.x + v.x, j.right.y + v.y, circle_size / 3);
          ctx.fill();
        }
      }
    } else {
      ctx.fillStyle = C.joystick_left;
      draw.circle(ctx, config.joystick.left.x, config.joystick.left.y, circle_size);
      ctx.fillStyle = C.joystick_right;
      draw.circle(ctx, config.joystick.right.x, config.joystick.right.y, circle_size);
    }

  }

  if ("dead overlay" && !ui.end_overlay) {
    if (player.player_dead) {
      ctx.fillStyle = math_util.set_color_alpha(C.background, 0.7);
      draw.fill_rect(ctx, 0, 0, _width, _height);
      const time_text = "" + Math.max(0, 1 + Math.floor((player.player_dead_time - Thing.time) / 60));
      ctx.fillStyle = C.white;
      ctx.font = "bold 400px roboto mono";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      draw.fill_text(ctx, time_text, _width * 0.5, _height * 0.55);
    }
  }

  if ("paused" && ui.paused) {
    const pause_time = ui.time - ui.pause_time;
    const pause_animation_progress = math_util.bound((pause_time - 60) / 20, 0, 1);
    ctx.fillStyle = math_util.set_color_alpha(C.white, 0.8);
    draw.fill_rect(ctx, 0, 0, _width, _height);
    const pause_text = "paused";
    ctx.fillStyle = C.background;
    ctx.font = `bold ${200 - Math.round(pause_animation_progress * 100)}px roboto mono`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    draw.fill_text(ctx, pause_text, _width * 0.5, _height * (0.5 - pause_animation_progress * 0.35));
    if (pause_animation_progress >= 0.5) {
      // draw buttons (from end_overlay)
      size = _height * 0.025;
      y = _height * (0.75 - (pause_animation_progress * 2 - 1) * 0.15);
      r = Math.min(100, Math.min(_width * 0.125, _height * 0.125)) * (pause_animation_progress * 2 - 1);
      let hover, click;
      let gap = (_width - r * 6) / 4;
      let button_words = ["resume", "restart", "end game"];
      for (let i = 0; i < 3; i++) {
        x = gap + (gap + 2 * r) * i + r;
        hover = camera.mouse_in_circle(x, y, r);
        click = (hover && ui.new_click);
        // actually draw the button
        ctx.fillStyle = chroma.mix(C.green, C.red, (i * 2) / 4).hex();
        ctx.strokeStyle = C.white;
        if (hover) {
          ctx.fillStyle = chroma(ctx.fillStyle).brighten(0.5);
        }
        ctx.lineWidth = 4;
        draw.circle(ctx, x, y, r);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = C.white;
        ctx.strokeStyle = C.white;
        draw_svg(ctx, button_words[i], x, y, r, (i === 2) ? 45 : undefined);
        if (hover) {
          // draw word
          ctx.font = `bold ${size * 1.2}px roboto mono`;
          draw.fill_text(ctx, button_words[i], x, y + r + size * 2);
        }
        if (click) {
          if (i === 0) {
            close_all_overlays();
          } else if (i === 1) {
            if (multiplayer.is_multiplayer) {
              window.location.href = "/multiplayer/";
            } else {
              window.location.href = "/choose/?level=" + send.wave_name;
            }
          } else if (i === 2) {
            close_all_overlays();
            end_game(waves[send.wave_name][send.wave + 1] == null);
          }
          ui.new_click = false;
        }
      }
    }
  }

  if ("shop" && ui.shop_overlay) {
    ctx.fillStyle = math_util.set_color_alpha(C.green, 0.85);
    draw.fill_rect(ctx, 0, 0, _width, _height);
  }

  if ("upgrade" && ui.upgrade_overlay && false) {
    // haha, see /choose/choose.js
  }

  if ("inventory" && ui.inventory_overlay) {
    ctx.fillStyle = math_util.set_color_alpha(C.gold, 0.8);
    draw.fill_rect(ctx, 0, 0, _width, _height);
  }

  if ("end" && ui.end_overlay) {

    // background
    ctx.fillStyle = math_util.set_color_alpha(C.background, 0.75);
    draw.fill_rect(ctx, 0, 0, _width, _height);
    // texts
    size = _height * 0.025;
    ctx.textBaseline = "middle";
    ctx.fillStyle = C.white;
    ctx.strokeStyle = C.white;
    ctx.lineWidth = 5;
    ctx.textAlign = "right";
    ctx.font = `bold ${size}px roboto condensed`;
    let line_x = Math.max(150, _width * 0.2);
    let line_y = size * 20;
    draw.line(ctx, line_x, 0, line_x, size * 20);
    draw.line(ctx, 0, line_y, _width, line_y);
    draw.fill_text(ctx, "POINTS", line_x * 0.75, size * 4);
    draw.fill_text(ctx, "ROUNDS", line_x * 0.75, size * 10);
    draw.fill_text(ctx, "GRADE", line_x * 0.75, size * 16);
    ctx.textAlign = "center";
    ctx.font = `bold ${size * 4}px roboto mono`;
    ctx.lineWidth = 1;
    x = (_width - line_x) / 2 + line_x;
    draw.stroke_text(ctx, "" + Math.round(ui.end_score), x, size * 4);
    draw.stroke_text(ctx, "" + Math.round(ui.end_rounds + 0.3), x, size * 10);
    const end_rating = Math.round(ui.end_rating);
    ctx.strokeStyle = wave_ratings_colors[end_rating];
    draw.stroke_text(ctx, wave_ratings[end_rating], x, size * 16);
    if (end_rating == ui.end_rating_target) {
      ctx.fillStyle = chroma.mix(C.white, ctx.strokeStyle, bounce(ui.time, 50)).hex();
      draw.fill_text(ctx, wave_ratings[end_rating], x, size * 16);
      draw.stroke_text(ctx, wave_ratings[end_rating], x, size * 16);
      ctx.fillStyle = C.white;
    }
    ctx.strokeStyle = C.white;
    // lerp scores
    ui.end_score = lerp(ui.end_score, ui.end_score_target, ui.end_stuff_smoothness);
    ui.end_rounds = lerp(ui.end_rounds, ui.end_rounds_target, ui.end_stuff_smoothness);
    ui.end_rating = lerp(ui.end_rating, ui.end_rating_target, ui.end_stuff_smoothness * 0.4);
    // draw buttons
    y = _height * 0.75;
    r = Math.min(100, Math.min(_width * 0.125, _height * 0.125));
    let hover, click;
    let gap = (_width - r * 6) / 4;
    let button_words = ["back", "restart", "home"];
    for (let i = 0; i < 3; i++) {
      x = gap + (gap + 2 * r) * i + r;
      hover = camera.mouse_in_circle(x, y, r);
      click = (hover && ui.new_click);
      // actually draw the button
      ctx.fillStyle = chroma.mix(C.green, C.red, (i + 1) / 4).hex();
      ctx.strokeStyle = C.white;
      if (hover) {
        ctx.fillStyle = chroma(ctx.fillStyle).brighten(0.5);
      }
      ctx.lineWidth = 4;
      draw.circle(ctx, x, y, r);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = C.white;
      ctx.strokeStyle = C.white;
      draw_svg(ctx, button_words[i], x, y, r);
      if (hover) {
        // draw word
        ctx.font = `bold ${size}px roboto mono`;
        draw.fill_text(ctx, button_words[i], x, y + r + size);
      }
      if (click) {
        if (i === 0) {
          window.location.href = "/worlds/";
        } else if (i === 1) {
          if (multiplayer.is_multiplayer) {
            window.location.href = "/multiplayer/";
          } else {
            window.location.href = "/choose/?level=" + send.wave_name;
          }
        } else if (i === 2) {
          window.location.href = "/";
        }
        ui.new_click = false;
      }
    }
  }

  if ("popup" && ui.popup.show) {
    
  }

  if ("cursor") {
    const mousepos = camera.mouse;
    size = 7 * _scale;
    x = mousepos.x;
    y = mousepos.y;
    ctx.strokeStyle = math_util.set_color_alpha(C.green, 0.6);
    ctx.shadowBlur = 10;
    ctx.shadowColor = C.green;
    draw.circle(ctx, x, y, size);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

}

export const send_message = function(message, color = C.player_bullet, time = 1000000000, delay = 0) {
  if (time < 0) {
    time = 1000000000;
  }
  ui.messages.push({
    message: message,
    color: color,
    time: Thing.time + time + delay,
    send_time: Thing.time + delay,
  });
}

export const clear_messages = function() {
  while (!ui.messages.isEmpty()) ui.messages.pop();
}