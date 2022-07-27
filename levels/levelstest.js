import { camera } from "../js/draw/camera.js";
import { canvas_resize, init_canvas } from "../js/draw/canvas.js";
import { draw } from "../js/draw/draw.js";
import { C } from "../js/lib/color.js";
import { config } from "../js/lib/config.js";
import { waves_info } from "../js/lib/waves.js";
import { worlds } from "../js/lib/worlds.js";
import { controls } from "../js/main/controls.js";
import { check_keys, init_key, keys } from "../js/main/key.js";
import { math_util } from "../js/util/math.js";

const parameters = new URLSearchParams(document.location.search);
const world_key = parameters.get("world") || (window.location.href = "/worlds");
const W = worlds[world_key];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const Vector = Matter.Vector;

Vector.lerp = function(v1, v2, smoothness) {
  return Vector.add(Vector.mult(v1, 1 - smoothness), Vector.mult(v2, smoothness));
}

const lerp = function(a, b, s) {
  return a * (1 - s) + b * s;
};

const bounce = function(time, period) {
  return Math.abs(period - time % (period * 2)) / period;
};

const check_click = function() {
  return check_keys(config.controls.click);
};

const ui = {
  // main
  width: window.innerWidth,
  height: window.innerHeight,
  time: 0,
  old_click: false,
  new_click: false,
  mousedrag_change: Vector.create(0, 0),
  // camera
  camera: Vector.create(0, 0),
  camera_target: Vector.create(0, 0),
  camera_movement: 0,
  camera_movement_target: 0,
  camera_scale: 1,
  camera_scale_target: 1,
  world_to_screen: function(x, y) {
    return Vector.create(x + ui.width / 2 - ui.camera.x, y + ui.height / 2 - ui.camera.y);
  },
  screen_to_world: function(x, y) {
    return Vector.create(x - ui.width / 2 + ui.camera.x, y - ui.height / 2 + ui.camera.y);
  },
  camera_tick: function() {
    const smoothness = 0.1;
    const old_camera = ui.camera;
    ui.camera = Vector.lerp(ui.camera, ui.camera_target, smoothness);
    ui.camera_scale = lerp(ui.camera_scale, ui.camera_scale_target, smoothness);
    // move the camera using arrow keys
    const movespeed = 10;
    const move_x = (check_keys(config.controls.right) ? 1 : 0) - (check_keys(config.controls.left) ? 1 : 0);
    const move_y = (check_keys(config.controls.down) ? 1 : 0) - (check_keys(config.controls.up) ? 1 : 0);
    const move_v = Vector.mult(Vector.normalise(Vector.create(move_x, move_y)), movespeed);
    ui.camera_target = Vector.add(ui.camera_target, move_v);
    // move the camera using mouse (if not sidebar though)
    if (controls.mousedown_pos && controls.mousedown_pos.x < ui.width - ui.sidebar_when_mousedown) {
      ui.camera_target = Vector.sub(ui.camera_target, controls.mousedrag_change);
      ui.camera = Vector.sub(ui.camera, controls.mousedrag_change);
    }
    ui.camera_movement = lerp(ui.camera_movement, ui.camera_movement_target, smoothness);
    ui.camera_movement_target = Vector.magnitude(Vector.sub(ui.camera, old_camera));
  },
  click_tick: function() {
    if (check_click()) {
      ui.new_click = !ui.old_click;
      ui.old_click = true;
      if (ui.new_click) {
        ui.sidebar_when_mousedown = ui.sidebar;
      }
    } else {
      ui.new_click = false;
      ui.old_click = false;
    }
    ui.mousedrag_change = controls.mousedrag_change;
  },
  // levels
  selected: null,
  click_outside: false,
  // sidebar
  sidebar: 0,
  sidebar_target: 0,
  sidebar_level: null,
  sidebar_when_mousedown: 0,
  sidebar_tick: function() {
    const smoothness = 0.1;
    ui.sidebar = lerp(ui.sidebar, ui.sidebar_target, smoothness);
  }
};

const memo = {};

function get_background_color(x, y) {
  x = math_util.round_to(x, 10);
  y = math_util.round_to(y, 10);
  const key = `${x}.${y}`
  if (memo[key] != null) {
    return memo[key];
  }
  function dist2(v) {
    if (v.x == null || v.y == null) return 0;
    return Math.pow(v.x - x, 2) + Math.pow(v.y - y, 2);
  }
  const numbers = [];
  const colors = [];
  for (const C of W.colors) {
    const d = dist2(C);
    const num = ((d === 0) ? 100000000 : C.r / d);
    let color = C.c;
    /* // range (fade to black)
    if (d > C.r * C.r) {
      const range = (C.range == null) ? C.r * 2 : C.range;
      const ratio = (Math.sqrt(d) - C.r) / (range - C.r);
      color = chroma.mix(color, W.background, ratio);
    }
    */
    numbers.push(num);
    colors.push(color);
  }
  const result = chroma.average(colors, "lab", numbers);
  memo[key] = result;
  return result;
}

function draw_background() {
  const w = 150;
  const h = 150;
  canvas2.width = w;
  canvas2.height = h;
  canvas2.style.width = ui.width;
  canvas2.style.height = ui.height;
  const image_data = ctx2.createImageData(w, h);
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      const index = (j * w + i) * 4;
      const x = i / w * ui.width;
      const y = j / h * ui.height;
      const v = ui.screen_to_world(x, y);
      const c = get_background_color(v.x, v.y).rgb();
      image_data.data[index] = c[0];
      image_data.data[index + 1] = c[1];
      image_data.data[index + 2] = c[2];
      image_data.data[index + 3] = 255;
    }
  }
  ctx2.putImageData(image_data, 0, 0);
  draw.clear_transparent(ctx);
}

function select_level(L) {
  ui.selected = L;
  ui.camera_target = Vector.create(L.x, L.y);
  ui.click_outside = false;
}

function unselect_level() {
  ui.selected = null;
}

function open_sidebar(L) {
  ui.sidebar_target = ui.width * 0.3;
  ui.sidebar_level = L;
}

function close_sidebar() {
  ui.sidebar_target = 0;
}

function camera_in_circle(x, y, r) {
  const mx = ui.camera.x, my = ui.camera.y;
  return (mx - x) * (mx - x) + (my - y) * (my - y) <= r * r;
}

function draw_levels() {
  ui.click_outside = ui.new_click;
  close_sidebar();
  for (const level_key in W.levels) {
    draw_level(W.levels[level_key]);
  }
  if (ui.click_outside) {
    unselect_level()
  }
}

function draw_level(L) {
  if (L.x == null || L.y == null) return;
  const is_selected = (L === ui.selected);
  const v = ui.world_to_screen(L.x, L.y);
  const size = ((L.size == null) ? 40 : L.size);
  if (ui.new_click && camera.mouse_in_circle(v.x, v.y, size)) {
    select_level(L);
  }
  if (camera_in_circle(L.x, L.y, size + 15)) {
    open_sidebar(L);
  }
  ctx.fillStyle = L.fill || "gold";
  ctx.strokeStyle = is_selected ? "red" : (L.stroke || "black");
  ctx.lineWidth = 2;
  draw.circle(ctx, v.x, v.y, size);
  ctx.fill();
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.font = "35px roboto mono";
  draw.fill_text(ctx, L.char, v.x, v.y + 2);
  // ok
  if (L.lines != null) {
    for (const line of L.lines) {
      const L2 = W.levels[line.key];
      const size2 = ((L2.size == null) ? 40 : L2.size);
      let v1 = Vector.create(L.x, L.y);
      let v2 = Vector.create(L2.x, L2.y);
      let mag = Vector.magnitude(Vector.sub(v1, v2));
      let v3 = Vector.lerp(v1, v2, (size + 1) / mag);
      let v4 = Vector.lerp(v2, v1, (size2 + 1) / mag);
      let va = ui.world_to_screen(v3.x, v3.y);
      let vb = ui.world_to_screen(v4.x, v4.y);
      let vc = Vector.lerp(va, vb, 0.5);
      ctx.strokeStyle = "black";
      draw.line(ctx, va.x, va.y, vb.x, vb.y);
    }
  }
}

function draw_ui(delta_time) {

  const _w = ui.width, _h = ui.height;
  let x, y, w, h, r, s, c, hovering, clicking;

  // >2 frames of lag!
  if (delta_time > 100) {
    ctx.fillStyle = "white";
    draw.fill_rectangle(ctx, _w / 2, _h / 2, 600, 100);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.font = "40px roboto mono";
    draw.fill_text(ctx, "loading colours...", _w / 2, _h / 2);
  }

  if ("crosshair") {
    x = _w / 2;
    y = _h / 2;
    r = 5 + ui.camera_movement;
    s = 15;
    const move_ratio = Math.min(1, ui.camera_movement / 10);
    c = chroma.mix("purple", "red", move_ratio, "lab").alpha(0.5);
    ctx.strokeStyle = c;
    draw.line(ctx, x - r, y, x - r - s, y);
    draw.line(ctx, x + r, y, x + r + s, y);
    draw.line(ctx, x, y - r, x, y - r - s);
    draw.line(ctx, x, y + r, x, y + r + s);
  }

  if ("sidebar") {
    const L = ui.sidebar_level;
    const info = waves_info[L.key];
    // draw sidebar
    ctx.fillStyle = W.sidebar;
    draw.fill_rect(ctx, _w - ui.sidebar, 0, ui.sidebar, _h);
    ctx.strokeStyle = "black";
    draw.line(ctx, _w - ui.sidebar, 0, _w - ui.sidebar, _h);
    // stuff inside the sidebar
    if (ui.sidebar_target > 0) {
      // level name
      x = _w - ui.sidebar / 2;
      y = 30;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.font = "30px roboto mono";
      draw.fill_text(ctx, info.name, x, y);
      // play button
      y = _h - 100;
      r = 50;
      hovering = camera.mouse_in_circle(x, y, r);
      clicking = (hovering && ui.new_click) || check_keys(config.controls.uienter);
      ctx.fillStyle = hovering ? C.green_bullet : C.green;
      ctx.strokeStyle = chroma(W.sidebar).darken();
      ctx.lineWidth = 2;
      draw.circle(ctx, x, y, r);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = C.background;
      ctx.lineWidth = 0;
      draw.regular_polygon(ctx, 3, r * 0.45, x, y, 0);
      ctx.fill();
      if (clicking) {
        window.location.href = "/choose/?level=" + L.key;
      }
    }
  }

}

function draw_main(delta_time) {

  draw_background();
  draw_levels();
  draw_ui(delta_time);

}

function tick(time) {
  const delta = time - ui.time;
  ui.time = time;
  ui.camera_tick();
  ui.sidebar_tick();
  ui.click_tick();
  controls.tick();
  draw_main(delta);
  requestAnimationFrame(tick);
}

function init() {
  init_canvas(canvas);
  init_canvas(canvas2);
  init_key();
  controls.init();
}

function main() {
  init();
  requestAnimationFrame(tick);
}

window.addEventListener("load", main);
window.addEventListener("resize", function(event) {
  canvas_resize(canvas);
  ui.width = window.innerWidth;
  ui.height = window.innerHeight;
});
window.ui = ui;