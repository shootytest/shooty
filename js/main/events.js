import { camera } from "../draw/camera.js";
import { canvas_resize } from "../draw/canvas.js";
import { config } from "../lib/config.js";

function mouse_events() {
}

function main_events() {
  window.addEventListener("resize", function(event) {
    canvas_resize(canvas);
  });
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      let width = 0;
      if (entry.contentBoxSize) {
        // Firefox implements `contentBoxSize` as a single content rect, rather than an array
        const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
        width = contentBoxSize.inlineSize;
      } else {
        width = entry.contentRect.width;
      }
      let height = width / window.innerWidth * window.innerHeight;
      camera.scale = Math.sqrt(width * height) * config.ui.camera_scale;
    }
  });
  resizeObserver.observe(document.getElementById("canvas"));
}

export const init_events = function() {
  main_events();
  mouse_events();
}