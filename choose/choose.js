import { Camera, camera } from "../js/draw/camera.js";
import { canvas_resize, init_canvas } from "../js/draw/canvas.js";
import { draw } from "../js/draw/draw.js";
import { Enemy } from "../js/game/enemy.js";
import { Player, player } from "../js/game/player.js";
import { Thing } from "../js/game/thing.js";
import { C } from "../js/lib/color.js";
import { config } from "../js/lib/config.js";
import { make } from "../js/lib/make.js";
import { player_make } from "../js/lib/playermake.js";
import { upgrades } from "../js/lib/upgrades.js";
import { controls } from "../js/main/controls.js";
import { check_keys, init_key } from "../js/main/key.js";
import { firebase } from "../js/util/firebase.js";
import { get_account_username } from "../js/util/localstorage.js";
import { math_util } from "../js/util/math.js";
import { mobile } from "../js/util/mobile.js";

const parameters = new URLSearchParams(document.location.search);
const is_multiplayer = parameters.get("multiplayer") || false;
const level = parameters.get("level") || (is_multiplayer ? "multiplayer" : window.location.href = "/worlds/");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const Vector = Matter.Vector;

Vector.lerp = function(v1, v2, smoothness) {
  return Vector.add(Vector.mult(v1, 1 - smoothness), Vector.mult(v2, smoothness));
};

const user = {
  coins: 0,
  current_upgrade: "basic",
  unlocked_upgrades: [],
  reached_upgrades: [],
  play: function(selected) {
    let new_location = `/play/?level=${level}&new=true&use=${selected}`;
    if (is_multiplayer) {
      new_location += "&multiplayer=true";
    }
    window.location.href = new_location;
  },
  buy: function(upgrade, scam) {
    const U = upgrades[upgrade];
    if (scam) {
      user.play(upgrade);
    } else {
      if (user.coins > U.cost) {
        user.coins -= U.cost;
        firebase.set(`/users/${get_account_username()}/inventory/coin`, user.coins);
        firebase.set(`/users/${get_account_username()}/players/${user.unlocked_upgrades.length}`, upgrade);
      }
    }
  },
};

const ui = {
  time: 0,
  old_click: false,
  new_click: false,
  // upgrades
  upgrade_overlay: false,
  upgrade_divide: 0,
  upgrade_divide_target: 1,
  upgrade_camera_target: Vector.create(),
  upgrade_camera: Vector.create(),
  upgrade_camera_speed: 10,
  upgrade_camera_smoothness: 0.1,
  upgrade_tile_size: 80,
  upgrade_selected: "",
  upgrade_things: {},
};

const lerp = function(a, b, s) {
  return a * (1 - s) + b * s;
};

const bounce = function(time, period) {
  return Math.abs(period - time % (period * 2)) / period;
};

const check_click = function() {
  return check_keys(config.controls.click);
};

const tick_before = function() {
  if (check_click()) {
    ui.new_click = !ui.old_click;
    ui.old_click = true;
  } else {
    ui.new_click = false;
    ui.old_click = false;
  }
};

function draw_stuff() {
  const _width = window.innerWidth, _height = window.innerHeight;
  let x, y, w, h, r, size, c;

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
  if (move_x + move_y !== 0) {
    const move_v = Vector.mult(Vector.normalise(Vector.create(move_x, move_y)), ui.upgrade_camera_speed);
    ui.upgrade_camera_target = Vector.add(ui.upgrade_camera_target, move_v);
  }
  // move the camera using mouse (without smooth)
  if (!ui.upgrade_selected) {
    ui.upgrade_camera_target = Vector.sub(ui.upgrade_camera_target, controls.mousedrag_change);
    ui.upgrade_camera = Vector.sub(ui.upgrade_camera, controls.mousedrag_change);
  }
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
  // draw grid
  if ("grid") {
    ctx.strokeStyle = chroma(C.white).alpha(0.1);
    ctx.lineWidth = 2.5;
    size = ui.upgrade_tile_size;
    x = (size / 2 + _width / 2 - ui.upgrade_camera.x) % size;
    y = (size / 2 + _height / 2 - ui.upgrade_camera.y) % size;
    for (; x < _width; x += size) {
      draw.line(ctx, x, 0, x, _height);
    }
    for (; y < _height; y += size) {
      draw.line(ctx, 0, y, _width, y);
    }
  }
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
    const display_v = Vector.add(camera.mouse, u_camera);
    // console.log(display_v.x, display_v.y);
  }
  // a big loop
  for (const upgrade_key in upgrades) {
    // variables to be used later
    const U = upgrades[upgrade_key];
    const current = user.current_upgrade === upgrade_key;
    const reached = user.reached_upgrades.includes(upgrade_key);
    x = U.x * ui.upgrade_tile_size - u_camera.x + _width / 2;
    y = U.y * ui.upgrade_tile_size - u_camera.y + _height / 2;
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
      if (user.unlocked_upgrades.includes(upgrade_key)) {
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
        let p = null;
        if (ui.upgrade_things[upgrade_key] == null) {
          p = new Thing();
          p.make(make.player);
          p.make(player_make[upgrade_key]);
          p.make({ dummy: true, });
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
      } else if (user.unlocked_upgrades.includes(upgrade_key)) {
        ctx.strokeStyle = C.green_dark;
        draw_upgrade_shape(U, x, y, size);
        ctx.stroke();
      } else if (reached && scam) {
        ctx.strokeStyle = chroma.mix(C.blue, C.yellow_bullet, bounce(ui.time, 10));
        draw_upgrade_shape(U, x, y, size);
        ctx.stroke();
      } else if (reached && (user.coins >= U.cost)) {
        ctx.strokeStyle = chroma.mix(C.blue, C.green_bullet, bounce(ui.time, 50));
        draw_upgrade_shape(U, x, y, size);
        ctx.stroke();
      }
      // draw connections
      for (const connect_key of U.connections) {
        if (connect_key === upgrade_key) continue;
        const U2 = upgrades[connect_key];
        const connect_reached = (user.reached_upgrades.includes(connect_key) && reached);
        c = (connect_reached) ? C.white : C.red_dark;
        const connect_alpha = ((U.connections_faded || []).includes(connect_key)) ? 0.4 : (connect_reached ? 1 : 0.4);
        ctx.strokeStyle = chroma(c).alpha(connect_alpha);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = 3;
        let v1 = Vector.create(x, y);
        let v2 = Vector.create(U2.x * ui.upgrade_tile_size - u_camera.x + _width / 2, U2.y * ui.upgrade_tile_size - u_camera.y + _height / 2);
        let mag = Vector.magnitude(Vector.sub(v1, v2));
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
      let targetx = U.x * ui.upgrade_tile_size - u_camera.x + _width / 2;
      let targety = U.y * ui.upgrade_tile_size - u_camera.y + _height / 2;
      if (math_util.in_rect(targetx, targety, 0, 0, divide_x, _height)) {
        is_everything_offscreen = false;
      }
    }
  }
  ctx.restore();
  ///// draw upgrade description
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
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
    y += h / 2;
    draw.fill_text(ctx, `Cost: ${U.cost}`, x, y);
    // button
    w = (_width - divide_x) * 0.6;
    y = _height - h * 2;
    let hover = camera.mouse_in_rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
    if (!user.unlocked_upgrades.includes(U.key)) {
      // buy button
      ctx.fillStyle = (scam) ? (hover ? C.purple_bullet : C.purple) : ((user.coins >= U.cost) ? (hover ? C.green_health : C.green_dark) : (hover ? C.red_health : C.red_dark));
      draw.fill_rectangle(ctx, x, y, w, h);
      ctx.strokeStyle = C.gold;
      ctx.lineWidth = 3;
      draw.circle(ctx, x - w / 2 + 25, y, 10);
      ctx.stroke();
      ctx.fillStyle = (scam) ? C.background : C.white;
      ctx.font = "20px roboto mono";
      draw.fill_text(ctx, "" + U.cost, x + 10, y);
      if (hover && ui.new_click) {
        user.buy(U.key, scam);
      }
    } else if (user.current_upgrade !== U.key) {
      // select button
      ctx.fillStyle = hover ? C.bright_blue : C.blue;
      draw.fill_rectangle(ctx, x, y, w, h);
      ctx.fillStyle = C.white;
      ctx.font = "20px roboto mono";
      draw.fill_text(ctx, `select`, x, y);
      if (hover && ui.new_click) {
        user.current_upgrade = U.key;
      }
    } else {
      // play!
      ctx.fillStyle = hover ? C.yellow : C.gold;
      draw.fill_rectangle(ctx, x, y, w, h);
      ctx.fillStyle = C.background;
      ctx.font = "20px roboto mono";
      draw.fill_text(ctx, "play!", x, y);
      if (hover && ui.new_click) {
        user.play(U.key);
      }
    }
    // click?
    if (ui.new_click) {
      if (ui.upgrade_selected === U.key && upgrade_selected_old === U.key && focused != null) {
        if (!user.unlocked_upgrades.includes(U.key)) {
          user.buy(U.key, scam);
        } else if (user.current_upgrade !== U.key) {
          user.current_upgrade = U.key;
        }
      }
    }
  }
  // close button
  if (Math.abs(ui.upgrade_divide_target - ui.upgrade_divide) < 0.01 && ui.upgrade_divide_target !== 1) {
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
      upgrade_selected_clear = true;
    }
  }
  // coins
  if ("coins") {
    x = 35;
    y = 20;
    const coin_text = "" + user.coins;
    ctx.font = "20px roboto mono";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 3;
    draw.circle(ctx, x, 30, 10);
    ctx.stroke();
    ctx.fillStyle = C.white;
    draw.fill_text(ctx, coin_text, x + 20, 30);
  }
  if (upgrade_selected_clear) {
    ui.upgrade_selected = false;
  }
  if (is_everything_offscreen && !(mobile.screen_mobile && ui.upgrade_selected)) {
    ui.upgrade_camera_target = Vector.mult(ui.upgrade_camera_target, 0.975);
  }
};

function choose_events() {
  if (!mobile.is_mobile) {
    window.addEventListener("mousemove", function(event) {
      camera.set_mouse(event.clientX, event.clientY);
    });
  }
}

function fire() {
  firebase.listen(`/users/${get_account_username()}/`, function(userdata) {
    user.coins = userdata.inventory.coin;
    const players = userdata.players;
    user.reached_upgrades = [];
    for (const type of players) {
      if (!user.unlocked_upgrades.includes(type)) user.unlocked_upgrades.push(type);
      if (type == null || upgrades[type] == null || upgrades[type].connections == null) {
        continue;
      }
      for (const reach of upgrades[type].connections) {
        if (!user.reached_upgrades.includes(reach)) user.reached_upgrades.push(reach);
      }
    }
  });
}

function main() {
  fire();
  init_canvas(canvas);
  init_key();
  choose_events();
  controls.init();
  mobile.init();
  setInterval(function() {
    ui.time++;
    tick_before();
    controls.tick();
    camera.tick();
    Thing.tick_things();
    Thing.draw_things();
    draw_stuff(ctx);
  }, 16);
};

window.addEventListener("load", main);
window.addEventListener("resize", function(event) {
  canvas_resize(canvas);
});
window.ui = ui;