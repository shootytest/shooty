import { camera } from "../draw/camera.js";
import { game_is_paused } from "../draw/ui.js";
import { player } from "../game/player.js";
import { config } from "../lib/config.js";
import { mobile } from "../util/mobile.js";
import { keys } from "./key.js";

export const controls = { };

const Vector = Matter.Vector;

controls.joystick = {
  left: { },
  right: { },
}

controls.mousedown_pos = false;
controls.mousedrag = false;
controls.mousedrag_old = false;
controls.mousedrag_change = Vector.create(0, 0);

controls.tick = function() {
  if (controls.mousedrag && controls.mousedrag_old) controls.mousedrag_change = Vector.sub(controls.mousedrag, controls.mousedrag_old);
  else controls.mousedrag_change = Vector.create(0, 0);
  controls.mousedrag_old = controls.mousedrag;
}

controls.init = function() {

  let mousedown = false;

  const get_touches = function(touches) {
    const j = controls.joystick;
    let left = null,
        right = null;
    for (let touch of touches) {
      if (touch.identifier === j.left.id) {
        left = touch;
      } else if (touch.identifier === j.right.id) {
        right = touch;
      }
    }
    return { left: left, right: right };
  }

  const mousemove_f = function(event) {
    if (player == null) {
      return;
    }
    if (mobile.is_mobile && event.touches) {
      const j = controls.joystick;
      let { left, right } = get_touches(event.touches);
      let v = false;
      if (left != null && j.left.id != null) {
        v = Vector.create(left.clientX - j.left.x, left.clientY - j.left.y)
        j.left.v = v;
        if (Vector.magnitudeSquared(v) > Math.pow(config.joystick.size, 2)) {
          if (!game_is_paused()) player.move_player(v);
        } else {
          //c.movedir = Vector.create(0, 0);
        }
        camera.set_mouse(left.clientX, left.clientY);
      }
      if (right != null && j.right.id != null) {
        v = Vector.create(right.clientX - j.right.x, right.clientY - j.right.y);
        j.right.v = v;
        if (Vector.magnitudeSquared(v) > Math.pow(config.joystick.size, 2)) {
          player.shooting = true;
          if (config.joystick.pointer) {
            player.target.facing = Vector.add(player.position, Vector.create(right.clientX, right.clientY));
          } else {
            const temp_v = Vector.add(v, player.position);
            player.target.facing = Vector.clone(temp_v);
          }
        }
        camera.set_mouse(right.clientX, right.clientY);
      }
      if (game_is_paused()) {
        controls.mousedrag = v;
      }
    } else {
      // non-mobile
      function register_controls(x, y) {
        camera.set_mouse(x, y);
        player.target.facing = camera.mouse_position;
        if (mousedown && controls.mousedown_pos) {
          const new_mousedrag = Vector.sub(Vector.create(x, y), controls.mousedown_pos);
          controls.mousedrag = new_mousedrag;
        }
      }
      if (event.touches) {
        for (let touch of event.touches) register_controls(touch.clientX, touch.clientY);
      } else {
        register_controls(event.clientX, event.clientY);
      }
    }
  }

  const mousedown_f = function(event) {
    if (player == null) {
      return;
    }
    if (mobile.is_mobile && event.touches) {
      event.preventDefault();
      const j = controls.joystick;
      for (let touch of event.touches) {
        if (touch.identifier === j.left.id || touch.identifier === j.right.id) {
          continue;
        }
        camera.set_mouse(touch.clientX, touch.clientY);
        keys["Mouse"] = true;
        if (touch.clientX <= window.innerWidth / 2 && j.left.id == null) {
          j.left.x = touch.clientX;
          j.left.y = touch.clientY;
          j.left.id = touch.identifier;
          j.left.v = Vector.create(0, 0);
        } else if (touch.clientX >= window.innerWidth / 2 && j.right.id == null) {
          j.right.x = touch.clientX;
          j.right.y = touch.clientY;
          j.right.id = touch.identifier;
          j.right.v = Vector.create(0, 0);
        }
        keys["Mouse"] = true;
        mousedown = true;
        controls.mousedown_pos = Vector.create(touch.clientX, touch.clientY);
      }
    } else {
      // non-mobile
      function register_controls(x, y) {
        mousedown = true;
        controls.mousedown_pos = Vector.create(x, y);
      }
      if (event.touches) {
        for (let touch of event.touches) register_controls(touch.clientX, touch.clientY);
      } else {
        register_controls(event.clientX, event.clientY);
      }
    }
  }

  const mouseup_f = function(event) {
    if (player == null) {
      return;
    }
    if (mobile.is_mobile && event.touches) {
      for (let touch of event.touches) {
        camera.set_mouse(touch.clientX, touch.clientY);
        keys["Mouse"] = false;
      }
      const j = controls.joystick;
      let { left, right } = get_touches(event.touches);
      if (left == null) {
        j.left = { };
        //c.movedir = Vector.create(0, 0);
      }
      if (right == null) {
        j.right = { };
        player.shooting = false;
      }
      keys["Mouse"] = false;
      mousedown = false;
      controls.mousedown_pos = false;
      controls.mousedrag = false;
    } else {
      // non-mobile
      player.shooting = false;
      mousedown = false;
      controls.mousedown_pos = false;
      controls.mousedrag = false;
    }
  }

  window.addEventListener("mousemove", mousemove_f);

  window.addEventListener("touchmove", mousemove_f);

  window.addEventListener("mousedown", mousedown_f);

  window.addEventListener("touchstart", mousedown_f);

  window.addEventListener("mouseup", mouseup_f);

  window.addEventListener("touchend", mouseup_f);
  
}

window.controls = controls;