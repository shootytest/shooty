import { canvas_resize, init_canvas } from "../js/draw/canvas.js";
import { draw } from "../js/draw/draw.js";
import { C } from "../js/lib/color.js";
import { worlds } from "../js/lib/worlds.js";

const parameters = new URLSearchParams(document.location.search);
const sort = parameters.get("sort") || "default";
const descending = parameters.get("desc") === "true";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ui = {
  time: 0,
}

// ordered!
const list_of_worlds = [
  "zero", "one",
];
let sorted_worlds = [ ];

function sort_worlds() {
  if (sort === "default") {
    sorted_worlds = list_of_worlds.slice();
  } else if (sort === "alphabetical") {
    sorted_worlds = list_of_worlds.slice().sort((a, b) => a > b);
  }
  if (descending) {
    sorted_worlds.reverse();
  }
}

function draw_ui() {
  draw.clear(ctx, C.background);
  ctx.fillStyle = "white";
  draw.circle(ctx, 0, 0, 100);
  ctx.fill();
}

function tick() {
  ui.time++;
  draw_ui();
}

function init() {

}

function main() {
  init();
  init_canvas(canvas);
  setInterval(tick, 16);
}

window.addEventListener("load", main);
window.addEventListener("resize", function(event) {
  canvas_resize(canvas);
});
window.ui = ui;