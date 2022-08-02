import { Enemy } from "../game/enemy.js";
import { multiplayer } from "../game/multiplayer.js";
import { player, player_user } from "../game/player.js";
import { end_wave, next_wave, send } from "../game/send.js";
import { Thing } from "../game/thing.js";
import { C } from "../lib/color.js";
import { config } from "../lib/config.js";
import { make } from "../lib/make.js";
import { player_make } from "../lib/playermake.js";
import { upgrades } from "../lib/upgrades.js";
import { waves_points } from "../lib/waves.js";
import { controls } from "../main/controls.js";
import { check_keys } from "../main/key.js";
import { math_util } from "../util/math.js";
import { mobile } from "../util/mobile.js";
import { PriorityQueue } from "../util/priorityqueue.js";
import { camera } from "./camera.js";
import { draw } from "./draw.js";

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
  // shop
  shop_overlay: false,
  // upgrades
  upgrade_overlay: false,
  upgrade_divide: 0,
  upgrade_divide_target: 1,
  upgrade_camera_target: Vector.create(),
  upgrade_camera: Vector.create(),
  upgrade_camera_speed: 10,
  upgrade_camera_smoothness: 0.1,
  upgrade_selected: "",
  upgrade_things: {},
  // inventory
  inventory_overlay: false,
  // end
  end_overlay: false,
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
}
window.ui = ui;

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
}

export const game_is_paused = function() {
  return ui.paused || ui.shop_overlay || ui.upgrade_overlay || ui.inventory_overlay || ui.end_overlay || ui.popup.show;
}

export const close_all_overlays = function() {
  ui.paused = false;
  ui.shop_overlay = false;
  ui.upgrade_overlay = false;
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
    ctx.fillStyle = chroma(C.red).alpha(0.15);
    draw.fill_text(ctx, number_text, location.x, location.y + text_offset);
    ctx.restore();
    if (!Enemy.check() && Enemy.total_wave_health > 0) {
      ctx.fillStyle = chroma(C.green_dark).alpha(0.1);
      draw.fill_rect(ctx, 0, 0, _width, _height);
      end_wave();
    }
    ctx.fillStyle = chroma((clear_ratio < 0.001) ? C.green_bullet : C.white).alpha(0.15);
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
        let s;
        if (e.shapes.length === 1) {
          s = e.shapes[0];
        } else {
          for (const shape of e.shapes) {
            if (shape.body) s = shape;
          }
        }
        ctx.globalAlpha = 0.5;
        e.draw_shape(ctx, _scale / 0.8, s);
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
    ctx.fillStyle = chroma(C.white).alpha(0.3);
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
      ctx.fillStyle = chroma(C.red_health).alpha(0.2 * hit_time_ratio);
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
    ctx.fillStyle = chroma(C.background).alpha(0.7);
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
    ctx.fillStyle = chroma(C.background).alpha(0.7);
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
    // measure text
    ctx.font = "20px roboto mono";
    w = ctx.measureText(timer_text).width;
    w += ctx.measureText(clock_emoji).width;
    // back rectangle
    ctx.fillStyle = chroma(C.background).alpha(0.7);
    draw.fill_rect(ctx, _width - 30 - w, _height - 95, w + 30, 30);
    ctx.fillStyle = C.white;
    w -= ctx.measureText(clock_emoji).width;
    draw.fill_text(ctx, clock_emoji, _width - 25 - w, _height - 80);
    ctx.font = "20px roboto mono";
    draw.fill_text(ctx, timer_text, _width - 20, _height - 80);
  }

  if ("items" && !game_is_paused()) {
    const items = player.items_collected;
    const item_text = "" + player.get_item_amount("coin");
    ctx.font = "20px roboto mono";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.fillStyle = chroma(C.background).alpha(0.7);
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
      }
    }
    ctx.fillStyle = chroma(c).alpha(0.6);
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
      }
    }
    ctx.fillStyle = chroma(c).alpha(0.6);
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
      ctx.fillStyle = chroma(m.color).alpha(0.3 * alpha);
      draw.fill_rect(ctx, 16, y, ctx.measureText(m.message).width + 26, 34);
      ctx.fillStyle = chroma(m.color).alpha(alpha);
      draw.fill_text(ctx, m.message, 30, 30 + 50 * i);
      i++;
    }
    c = C.red;
    if (camera.mouse_in_rect(16, y + 50, 36, 36)) {
      c = C.red_health;
      if (check_click()) {
        clear_messages();
      }
    }
    ctx.fillStyle = chroma(c).alpha(0.3);
    draw.fill_rect(ctx, 16, y + 50, 36, 36);
    ctx.strokeStyle = chroma(c).alpha(1);
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
        ctx.fillStyle = chroma(C.joystick_left).alpha(0.3);;
        draw.circle(ctx, j.left.x, j.left.y, circle_size);
        ctx.fill();
        if (j.left.v) {
          const v = Vector.mult(Vector.normalise(j.left.v), circle_size * (2 / 3));
          ctx.fillStyle = chroma(C.joystick_left).alpha(0.5);
          draw.circle(ctx, j.left.x + v.x, j.left.y + v.y, circle_size / 3);
          ctx.fill();
        }
      }
      if (j.right) {
        ctx.fillStyle = chroma(C.joystick_right).alpha(0.3);
        draw.circle(ctx, j.right.x, j.right.y, circle_size);
        ctx.fill();
        if (j.right.v) {
          const v = Vector.mult(Vector.normalise(j.right.v), circle_size * (2 / 3));
          ctx.fillStyle = chroma(C.joystick_right).alpha(0.5);
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
      ctx.fillStyle = chroma(C.background).alpha(0.7);
      draw.fill_rect(ctx, 0, 0, _width, _height);
      const time_text = "" + Math.max(0, 1 + Math.floor((player.player_dead_time - Thing.time) / 60));
      ctx.fillStyle = chroma(C.white);
      ctx.font = "bold 400px roboto mono";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      draw.fill_text(ctx, time_text, _width * 0.5, _height * 0.55);
    }
  }

  if ("paused" && ui.paused) {
    ctx.fillStyle = chroma(C.white).alpha(0.8);
    draw.fill_rect(ctx, 0, 0, _width, _height);
    const pause_text = "paused";
    ctx.fillStyle = chroma(C.background);
    ctx.font = "bold 200px roboto mono";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    draw.fill_text(ctx, pause_text, _width * 0.5, _height * 0.5);
  }

  if ("shop" && ui.shop_overlay) {
    ctx.fillStyle = chroma(C.green).alpha(0.85);
    draw.fill_rect(ctx, 0, 0, _width, _height);
  }

  if ("upgrade" && ui.upgrade_overlay && false) {
    ///// draw backgrounds
    ctx.fillStyle = chroma(C.background).alpha(0.8);
    draw.fill_rect(ctx, 0, 0, _width, _height);
    // calculate upgrade divide
    ui.upgrade_divide_target = (ui.upgrade_selected) ? (mobile.screen_mobile ? 0 : 0.7) : 1;
    const upgrade_divide = lerp(ui.upgrade_divide, ui.upgrade_divide_target, ui.upgrade_camera_smoothness);
    ui.upgrade_divide = upgrade_divide;
    // result of upgrade divide stored in divide_x
    const divide_x = _width * upgrade_divide;
    let upgrade_selected_old = ui.upgrade_selected;
    let upgrade_selected_clear = ui.new_click && camera.mouse_in_rect(0, 0, divide_x, _height);
    // draw divided background
    ctx.fillStyle = chroma(C.blue).alpha(0.5);
    draw.fill_rect(ctx, divide_x, 0, _width - divide_x, _height);
    // draw the divider line
    ctx.strokeStyle = chroma(C.white);
    draw.line(ctx, divide_x, 0, divide_x, _height);
    ///// move the camera using arrow keys
    const move_x = (check_keys(config.controls.right) ? 1 : 0) - (check_keys(config.controls.left) ? 1 : 0);
    const move_y = (check_keys(config.controls.down) ? 1 : 0) - (check_keys(config.controls.up) ? 1 : 0);
    const move_v = Vector.mult(Vector.normalise(Vector.create(move_x, move_y)), ui.upgrade_camera_speed);
    ui.upgrade_camera_target = Vector.add(ui.upgrade_camera_target, move_v);
    // move the camera using mouse
    ui.upgrade_camera_target = Vector.sub(ui.upgrade_camera_target, controls.mousedrag_change);
    ui.upgrade_camera = Vector.sub(ui.upgrade_camera, controls.mousedrag_change);
    // lerp camera
    const u_camera = ui.upgrade_camera;
    ui.upgrade_camera = Vector.lerp(u_camera, ui.upgrade_camera_target, ui.upgrade_camera_smoothness);
    ///// draw upgrades
    // function to draw shape of upgrade (always circle for now)
    function draw_upgrade_shape(U, x, y, size) {
      if (U.shape === "circle" || U.shape == null) {
        draw.circle(ctx, x, y, size);
      } else {
        console.log("Shape " + U.shape + " not supported yet!");
      }
    }
    // do ctx clipping
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, divide_x, _height);
    ctx.clip();
    // scam button (do not scam!)
    const scam = check_keys("`");
    // selected upgrade and focused upgrade
    let selected = (ui.upgrade_selected) ? upgrades[ui.upgrade_selected] : null; // selected upgrade
    let focused = null; // focused upgrade (to describe)
    // offscreen check
    let is_everything_offscreen = true;
    if (controls.mousedrag_change.x !== 0 || controls.mousedrag_change.y !== 0) {
      is_everything_offscreen = false;
    }
    // logging purposes (for me)
    if (check_click()) {
      const display_v = Vector.add(camera.mouse_position, u_camera);
      console.log(display_v.x, display_v.y);
    }
    // a big loop
    for (const upgrade_key in upgrades) {
      // variables to be used later
      const U = upgrades[upgrade_key];
      const current = player.current_upgrade === upgrade_key;
      const reached = player.reached_upgrades.includes(upgrade_key)
      x = U.x - u_camera.x + _width / 2;
      y = U.y - u_camera.y + _height / 2;
      size = U.size || 30;
      c = U.color || C.blue; // (current) ? chroma.mix(U.color || C.blue, C.white, bounce(ui.time, 50) * 0.2) : U.color;
      if (reached && camera.mouse_in_circle(x, y, size)) {
        focused = U;
        upgrade_selected_clear = false;
        if (ui.new_click) {
          ui.upgrade_selected = upgrade_key;
          selected = U;
        }
      }
      // draw stuff
      if ("draw stuff") {
        ctx.strokeStyle = c;
        ctx.fillStyle = chroma(c).alpha(chroma(c).alpha() * (focused === U ? 0.5 : 0.2));
        ctx.lineWidth = 3;
        if (player.unlocked_upgrades.includes(upgrade_key)) {
          ctx.shadowBlur = 30;
          ctx.shadowColor = C.white;
          for (let i = 0; i < 2; i++) {
            draw_upgrade_shape(U, x, y, size);
            ctx.stroke();
          }
          if (current) {
            ctx.shadowBlur = 75;
            ctx.shadowColor = C.pink;
            for (let i = 0; i < 5; i++) {
              draw_upgrade_shape(U, x, y, size);
              ctx.stroke();
            }
          }
        } else {
          draw_upgrade_shape(U, x, y, size);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.fill();
        // draw player thing
        if ("draw player thing" && reached) {
          let p;
          if (ui.upgrade_things[upgrade_key] == null) {
            p = new Thing();
            p.make(make.player);
            p.make(player_make[upgrade_key]);
            for (let i = 0; i < p.shoots_time.length; i++) {
              p.shoots_time[i] = 1000000;
            }
            ui.upgrade_things[upgrade_key] = p;
          } else {
            p = ui.upgrade_things[upgrade_key];
          }
          p.target.position = camera.camera_position(Vector.create(x, y));
          p.rotation = Math.PI * (ui.time % 200) / 100;
          p.tick();
          // draw with a scale of 1
          p.draw(ctx, 1);
        }
        if (upgrade_key === ui.upgrade_selected) {
          ctx.strokeStyle = C.red_health;
          draw_upgrade_shape(U, x, y, size);
          ctx.stroke();
        } else if (player.unlocked_upgrades.includes(upgrade_key)) {
          ctx.strokeStyle = C.green_dark;
          draw_upgrade_shape(U, x, y, size);
          ctx.stroke();
        } else if (reached && (player.get_item_amount("coin") >= U.cost || scam)) {
          ctx.strokeStyle = chroma.mix(C.blue, C.green_bullet, bounce(ui.time, 50));
          draw_upgrade_shape(U, x, y, size);
          ctx.stroke();
        }
        // draw connections
        for (const connect_key of U.connections) {
          if (connect_key === upgrade_key) continue;
          const U2 = upgrades[connect_key];
          ctx.strokeStyle = (player.reached_upgrades.includes(connect_key) && reached) ? C.white : C.darkgrey;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.lineWidth = 3;
          let v1 = Vector.create(x, y);
          let v2 = Vector.create(U2.x - u_camera.x + _width / 2, U2.y - u_camera.y + _height / 2);
          let mag = Vector.magnitude(Vector.sub(v1, v2))
          let v3 = Vector.lerp(v1, v2, ((U.size || 30) + 1) / mag);
          let v4 = Vector.lerp(v2, v1, ((U2.size || 30) + 1) / mag);
          let v5 = Vector.lerp(v3, v4, (ui.time % 50) / 50);
          draw.line(ctx, v3.x, v3.y, v4.x, v4.y);
          draw.circle(ctx, v5.x, v5.y, 4);
          ctx.fill();
        }
      } // end draw
      // check if not offscreen
      if ("check if not offscreen") {
        let targetx = U.x - u_camera.x + _width / 2;
        let targety = U.y - u_camera.y + _height / 2;
        if (math_util.in_rect(targetx, targety, 0, 0, divide_x, _height)) {
          is_everything_offscreen = false;
        }
      }
    }
    ctx.restore();
    ///// draw upgrade description
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    /*
    if (focused != null || selected != null) {
      const U = focused || selected;
    */
    if (ui.upgrade_selected) {
      const U = selected;
      // name
      ctx.fillStyle = C.white;
      x = (_width + divide_x) / 2;
      y = 50;
      w = (_width - divide_x) * 0.8;
      h = 50;
      ctx.font = "bold 30px roboto mono";
      draw.fill_text(ctx, U.name, x, y);
      // description
      ctx.font = "20px roboto mono";
      y += h;
      const texts = draw.split_text(ctx, U.desc, w);
      for (const text of texts) {
        draw.fill_text(ctx, text, x, y);
        y += h / 2;
      }
      // button
      w = (_width - divide_x) * 0.6;
      y = _height - h * 2;
      let hover = camera.mouse_in_rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
      if (!player.unlocked_upgrades.includes(U.key)) {
        // buy button
        ctx.fillStyle = (player.get_item_amount("coin") >= U.cost || scam) ? (hover ? C.green_health : C.green_dark) : (hover ? C.red_health : C.red_dark);
        draw.fill_rectangle(ctx, x, y, w, h);
        ctx.strokeStyle = C.gold;
        ctx.lineWidth = 3;
        draw.circle(ctx, x - w / 2 + 25, y, 10);
        ctx.stroke();
        ctx.fillStyle = C.white;
        ctx.font = "20px roboto mono";
        draw.fill_text(ctx, "" + U.cost, x + 10, y);
        if (hover && ui.new_click) {
          player.upgrade_to(U.key, scam);
        }
      } else if (player.current_upgrade !== U.key) {
        // switch button
        ctx.fillStyle = hover ? C.bright_blue : C.blue;
        draw.fill_rectangle(ctx, x, y, w, h);
        ctx.fillStyle = C.white;
        ctx.font = "20px roboto mono";
        draw.fill_text(ctx, "switch", x, y);
        if (hover && ui.new_click) {
          player.upgrade_to(U.key);
        }
      } else {
        // not a button
        ctx.fillStyle = hover ? C.gold : C.gold;
        draw.fill_rectangle(ctx, x, y, w, h);
        ctx.fillStyle = C.background;
        ctx.font = "20px roboto mono";
        draw.fill_text(ctx, "selected", x, y);
        if (hover && ui.new_click) {
          player.upgrade_to(U.key);
        }
      }
      // click?
      if (ui.new_click) {
        if (ui.upgrade_selected === U.key && upgrade_selected_old === U.key && focused != null) {
          player.upgrade_to(U.key, scam);
        }
      }
    }
    // close button
    if (Math.abs(ui.upgrade_divide_target - ui.upgrade_divide) < 0.01) {
      x = _width - 60;
      y = 20;
      w = 40;
      h = 40;
      const hover = camera.mouse_in_rect(x, y, w, h);
      ctx.fillStyle = chroma(C.red).alpha(hover ? 0.7 : 0.4);
      draw.fill_rect(ctx, x, y, w, h);
      ctx.strokeStyle = chroma(C.red);
      draw.x_cross(ctx, x, y, w, h, 0.7);
      if (hover && ui.new_click) {
        if (ui.upgrade_divide_target === 1) {
          close_all_overlays();
        } else {
          upgrade_selected_clear = true;
        }
      }
    }
    if (upgrade_selected_clear) {
      ui.upgrade_selected = false;
    }
    if (is_everything_offscreen) {
      ui.upgrade_camera_target = Vector.mult(ui.upgrade_camera_target, 0.975);
    }
  }

  if ("inventory" && ui.inventory_overlay) {
    ctx.fillStyle = chroma(C.gold).alpha(0.8);
    draw.fill_rect(ctx, 0, 0, _width, _height);
  }

  if ("end" && ui.end_overlay) {
    // background
    ctx.fillStyle = chroma(C.purple).alpha(0.95);
    draw.fill_rect(ctx, 0, 0, _width, _height);
    // texts
    x = _width / 2;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = C.white;
    ctx.font = "bold 20px roboto condensed";
    draw.fill_text(ctx, "TOTAL SCORE", x, 60);
    ctx.font = "bold 80px roboto mono";
    draw.fill_text(ctx, "" + math_util.round(player.points, 0), x, 120);
    ctx.font = "bold 20px roboto condensed";
    draw.fill_text(ctx, "ROUNDS", x, 200);
    ctx.font = "bold 80px roboto mono";
    draw.fill_text(ctx, "" + send.wave, x, 260);
    
  }

  if ("popup" && ui.popup.show) {
    
  }

  if ("cursor") {
    const mousepos = camera.mouse;
    size = 7 * _scale;
    x = mousepos.x;
    y = mousepos.y;
    ctx.strokeStyle = chroma(C.green).alpha(0.6);
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