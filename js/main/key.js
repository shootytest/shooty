
export const keys = {};
const key_listeners = {};

function update_mouse(buttons) {
  keys["Mouse"] = (buttons & 1) !== 0;
  keys["MouseLeft"] = (buttons & 1) !== 0;
  keys["MouseRight"] = (buttons & 2) !== 0;
  keys["MouseWheel"] = (buttons & 4) !== 0;
}

export const add_key_listener = function(key, f) {
  if (key_listeners[key] == null) key_listeners[key] = [];
  key_listeners[key].push(f);
}

export const remove_key_listeners = function(key) {
  key_listeners[key] = null;
}

export const init_key = function() {
  window.addEventListener("keydown", function(event) {
    if (["Tab"].includes(event.code)) {
      event.preventDefault();
    }
    const key = event.key;
    keys[key] = true;
    if (!event.repeat) {
      if (key_listeners[key] != null) {
        for (const f of key_listeners[key]) {
          f();
        }
      }
    }
  });
  
  window.addEventListener("keypress", function(event) {
    if (["Tab"].includes(event.code)) {
      event.preventDefault();
    }
    const key = event.key;
    keys[key] = true;
  });
  
  window.addEventListener("keyup", function(event) {
    const key = event.key;
    keys[key] = false;
  });
  
  window.addEventListener("focus", function(event) {
    for (const key in keys) {
      keys[key] = false;
    }
  });

  window.addEventListener("mousedown", function(event) {
    event.preventDefault();
    update_mouse(event.buttons);
  });

  window.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    update_mouse(event.buttons);
  });
  
  window.addEventListener("mouseup", function(event) {
    event.preventDefault();
    update_mouse(event.buttons);
  });

  // return;
  // mobile
  window.addEventListener("touchstart", function(event) {
    event.preventDefault();
    update_mouse(event.touches.length > 0 ? 1 : 0);
  });

  window.addEventListener("touchend", function(event) {
    event.preventDefault();
    update_mouse(event.touches.length > 0 ? 1 : 0);
  });
}

export const check_keys = function(key_array) {
  if (!Array.isArray(key_array)) {
    key_array = [key_array];
  }
  for (const key of key_array) {
    if (keys[key]) {
      return true;
    }
  }
  return false;
}