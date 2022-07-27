import { camera } from "../js/draw/camera.js";
import { canvas_resize, init_canvas } from "../js/draw/canvas.js";
import { draw } from "../js/draw/draw.js";
import { C } from "../js/lib/color.js";
import { config } from "../js/lib/config.js";
import { waves_info } from "../js/lib/waves.js";
import { worlds } from "../js/lib/worlds.js";
import { research } from "../js/lib/research.js";
import { controls } from "../js/main/controls.js";
import { check_keys, init_key, keys } from "../js/main/key.js";
import { math_util } from "../js/util/math.js";

const parameters = new URLSearchParams(document.location.search);

const Vector = Matter.Vector;

// research/upgrades
// what should I call it

// TODO