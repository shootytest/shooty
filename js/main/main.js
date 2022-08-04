import { init_canvas, canvas_resize } from "../draw/canvas.js";
import { add_key_listener, init_key } from "./key.js";
import { camera } from "../draw/camera.js";
import { init_events } from "./events.js";
import { Thing } from "../game/thing.js";
import { make } from "../lib/make.js";
import { config, category } from "../lib/config.js";
import { Player, player } from "../game/player.js";
import { init_collide } from "../game/collide.js";
import { init_send, next_wave, send, set_wave_name, tick_send } from "../game/send.js";
import { Enemy } from "../game/enemy.js";
import { clear_messages, close_all_overlays, game_is_paused, send_message, ui } from "../draw/ui.js";
import { firebase } from "../util/firebase.js";
import { download_screenshot, copy_screenshot } from "../util/screenshot.js";
import { video_button_pressed } from "../util/video.js";
import { waves, waves_info } from "../lib/waves.js";
import { controls } from "./controls.js";
import { mobile } from "../util/mobile.js";
import { gamesave } from "./gamesave.js";
import { gamecheck } from "./gamecheck.js";
import { check_if_logged_in, get_account_username, get_multi_enemies } from "../util/localstorage.js";
import { mapmaker } from "../game/mapmaker.js";
import { maps } from "../lib/maps.js";
import { multiplayer } from "../game/multiplayer.js";

const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Vector = Matter.Vector;

const parameters = new URLSearchParams(document.location.search);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// create the engine (and world)
export const engine = Engine.create({
  gravity: {
    x: config.physics.gravity_x,
    y: config.physics.gravity_y,
  },
});
export const world = engine.world;
const runner = Runner.create();

let game_is_loaded = false;

function init_game() {
  // Matter.Vector extensions
  Vector.createpolar = function(theta, r = 1) {
    return Vector.create(r * Math.cos(theta), r * Math.sin(theta));
  }
  Vector.lerp = function(v1, v2, smoothness) {
    return Vector.add(Vector.mult(v1, 1 - smoothness), Vector.mult(v2, smoothness));
  }
  Vector.lerp_angle = function(a1, a2, smoothness) {
    return Vector.angle(Vector.create(), Vector.add(Vector.createpolar(a1, 1 - smoothness), Vector.createpolar(a2, smoothness)));
  }
  Vector.deg_to_rad = function(degrees) {
    return degrees / 180 * Math.PI;
  }
  Vector.rad_to_deg = function(radians) {
    return radians * 180 / Math.PI;
  }
  // check if not logged in
  if (!check_if_logged_in()) {
    window.location.href = "/account/login.html";
  }
  // set level
  const new_game = parameters.get("new") === "true";
  const use = parameters.get("use") || "basic";
  multiplayer.is_multiplayer = (parameters.get("multiplayer")) ? true : false;
  player.current_upgrade = use;
  if (!new_game && gamecheck.level()) {
    gamesave.load();
    game_is_loaded = true;
  } else {
    if (!new_game) {
      window.location.href = "/worlds/";
      return;
    }
    const level = parameters.get("level") || "tutorial";
    if (waves[level] == null) {
      window.location.href = "/play/";
      return;
    }
    set_wave_name(level);
  }
  // if this is a new game
  if (new_game && send.wave < 0) {
    next_wave();
    player.position = Player.random_spawn_location();
    gamesave.save(true);
    window.location.href = "/play/";
  }
  firebase.get("visits/play", (num) => firebase.set("visits/play", (num || 0) + 1));
}

function tick() {
  controls.tick();
  camera.draw(ctx);
  if (!game_is_paused()) {
    Runner.tick(runner, engine);
    camera.tick();
    tick_send();
  }
  // run even when game is paused (ho)
  multiplayer.tick();
}

/* TESTING AREA (not really) */

function test() {

  if (game_is_loaded) {
    // not a new game
    camera.jump_to_player();
  }
  
  // create player
  player.create();

  // create map
  mapmaker.make(waves_info[send.wave_name].map);

  add_key_listener("|", function() {
    config.controls.right = ["d"]; // todo remove
  });
  add_key_listener("e", function() {
    player.player_autofire = !player.player_autofire;
  });
  if (!multiplayer.is_multiplayer) {
    // waves exist only when not multiplayer
    add_key_listener("q", function() {
      if (game_is_paused()) return;
      next_wave();
    });
  }
  add_key_listener("p", function() {
    if (game_is_paused()) {
      close_all_overlays();
    } else {
      ui.paused = true;
    }
  });
  add_key_listener("z", function() {
    return;
    if (send.game_ended) return;
    if (ui.shop_overlay) {
      close_all_overlays();
    } else {
      if (game_is_paused()) {
        close_all_overlays();
      }
      ui.shop_overlay = true;
    }
  });
  add_key_listener("x", function() {
    return;
    if (ui.upgrade_overlay) {
      close_all_overlays();
    } else {
      if (game_is_paused()) {
        close_all_overlays();
      }
      ui.upgrade_selected = "";
      ui.upgrade_camera_target = Vector.create(0, 0);
      ui.upgrade_overlay = true;
    }
  });
  add_key_listener("i", function() {
    return;
    if (ui.inventory_overlay) {
      close_all_overlays();
    } else {
      if (game_is_paused()) {
        close_all_overlays();
      }
      ui.inventory_overlay = true;
    }
  });
  add_key_listener("Escape", function() {
    if (!game_is_paused()) {
      ui.paused = true;
    } else {
      close_all_overlays();
    }
  });
  add_key_listener("c", function() {
    return;
    clear_messages();
  });
  add_key_listener(".", function() {
    download_screenshot();
    copy_screenshot();
  });
  add_key_listener(",", function() {
    copy_screenshot();
  });
  add_key_listener("v", function() {
    video_button_pressed();
  });

  // hacks (only multiplayer mode)
  if (multiplayer.is_multiplayer) {
    /*
    add_key_listener("m", function() {
      // TODO (just a test for now)
      Enemy.create_multiplayer("basic");
    });
    */
    const multi_enemies = get_multi_enemies();
    for (let c of "1234567890") {
      add_key_listener(c, function() {
        const t = multi_enemies[c];
        if (t == null || t === "") return;
        Enemy.create_multiplayer(t);
      });
    }
  }

  // hacks (only account "dev")
  if (get_account_username() === "dev" && !multiplayer.is_multiplayer) {
    add_key_listener("?", function() {
      return;
      player.item_collect("coin", Infinity);
    });
    add_key_listener("~", function() {
      return;
      player.upgrade_all();
    });
    for (let index = 0; index < config.dev.make_shortcuts.length; index++) {
      add_key_listener("1234567890"[index], function() {
        Enemy.create(config.dev.make_shortcuts[index]);
      });
    }
  }

}

/* TESTING AREA */

function init() {
  Thing.init_things(world);
  init_game();
  init_canvas(canvas);
  init_key();
  init_events();
  mobile.init();
  controls.init();
  multiplayer.init();
  init_collide();
  init_send();
  test();
}

function main() {
  init();
  setInterval(tick, 16);
  done();
}

function done() {
  document.getElementById("loading").remove();
}

main();