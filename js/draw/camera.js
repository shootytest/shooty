import { player } from "../game/player.js";
import { Thing } from "../game/thing.js";
import { config } from "../lib/config.js";
import { draw } from "./draw.js";
import { draw_ui, draw_ui_before, draw_ui_middle } from "./ui.js";

const Vector = Matter.Vector;

export class Camera {
  
  position = Vector.create();
  ctx = null;
  width = window.innerWidth;
  height = window.innerHeight;
  mouse = Vector.create();
  scale = 1;

  constructor() {

  }

  get location() {
    return Vector.sub(this.position, this.halfscreen);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get halfscreen() {
    return Vector.create(this.width / 2, this.height / 2);
  }

  get mouse_position() {
    return this.camera_position(this.mouse);
  }

  object_position(v) { // object to screen
    return Vector.sub(Vector.mult(v, this.scale), this.location);
  }

  camera_position(v) { // screen to object
    return Vector.mult(Vector.add(v, this.location), 1 / this.scale);
  }

  tick() {
    this.move_to_player();
    Thing.tick_things();
  }

  draw(ctx) {
    this.ctx = ctx;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    draw.clear(ctx, "#000000");
    draw_ui_before(ctx);
    Thing.draw_things();
    draw_ui_middle(ctx);
    draw_ui(ctx);
  }

  move_to_player() {
    const smooth = config.ui.camera_smoothness;
    this.position = Vector.add(Vector.mult(this.position, 1 - smooth), Vector.mult(player.position, smooth * this.scale));
  }

  jump_to_player() {
    this.position = Vector.mult(player.position, this.scale);
  }

  set_mouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  mouse_in_circle(x, y, r) {
    const mx = this.mouse.x, my = this.mouse.y;
    return (mx - x) * (mx - x) + (my - y) * (my - y) <= r * r;
  }

  mouse_in_rect(x, y, w, h) {
    const mx = this.mouse.x, my = this.mouse.y;
    return (mx >= x && my >= y && mx <= x + w && my <= y + h);
  }

  mouse_in_thing(t) {
    const mx = this.mouse_position.x, my = this.mouse_position.y;
    return t.query_point(mx, my).length > 0;
  }

}

export const camera = new Camera();
window.camera = camera;