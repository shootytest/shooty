import { C } from "./color.js";
import { category, config } from "./config.js";
import { shoots, shoot_rotate, shoot_rotate_position } from "./shoots.js";

const SQRT_2 = Math.sqrt(2);
const SQRT_3 = Math.sqrt(3);
const SQRT_5 = Math.sqrt(5);

export const make = {};

make.default = {
  // nothing here for now, all defaults should be in the Thing class.
};

// #players

make.player = {
  player: true,
  team: 1,
  rotation_controller: "player",
  size: 30,
  speed: 50,
  density: 0.001,
  friction: 0.1,
  collision_filter: category.player,
  color: C.blue,
  layer: 10,
  health: {
    capacity: config.game.player_health,
    regen: config.game.player_regen / 60,
    regen_time: config.game.player_regen_delay * 60,
  },
};

// #walls

make.wall = {
  fixed: true,
  wall: true,
  blocks_sight: true,
  deleter: true,
  collision_filter: category.wall,
  color: C.white,
};

make.wall_bounce = {
  parent: ["wall"],
  deleter: false,
  restitution: 1,
  color: C.yellow,
};

make.wall_playerblock = {
  parent: ["wall"],
  collision_filter: category.player_blocker,
  blocks_sight: false,
  color: C.purple + "80",
};

make.wall_bulletblock = {
  parent: ["wall"],
  collision_filter: category.bullet_blocker,
  color: C.orange + "80",
  fill: C.orange + "80",
};

make.horizontalwall = {
  parent: ["wall"],
  shapes: [
    { type: "line", x: -1, x2: 1, y: 0, y2: 0, },
  ],
};

make.verticalwall = {
  parent: ["wall"],
  shapes: [
    { type: "line", x: 0, x2: 0, y: -1, y2: 1, },
  ],
};

// #projectiles

make.bullet = {
  friction: 0,
  density: 0.002,
  damage: 1,
  bullet: true,
  shapes: [
    { type: "circle" },
  ],
};

make.player_bullet = {
  player_bullet: true,
  density: 0.002,
  collision_filter: category.player_bullet,
  color: C.player_bullet,
};

make.enemy_bullet = {
  enemy_bullet: true,
  density: 0.003,
  collision_filter: category.enemy_bullet,
  color: C.enemy_bullet,
};

make.bullet_basic = {
  parent: ["bullet"],
};

make.bullet_basicdot = {
  parent: ["bullet"],
  shapes: [
    { type: "circle" },
    { type: "circle", r: "1", },
  ],
};

make.bullet_auto = {
  parent: ["bullet"],
  shooting: true,
  keep_children: true,
  rotation_controller: "autotarget",
};

make.bullet_square = {
  parent: ["bullet"],
  shapes: [
    { type: "rectangle", x: 0, y: 0, body: true, },
  ],
};

make.bullet_triangle = {
  parent: ["bullet"],
  shapes: [
    { type: "polygon", sides: 3, r: 1, body: true, },
  ],
};

make.bullet_triangledot = {
  parent: ["bullet"],
  shapes: [
    { type: "polygon", sides: 3, r: 1, body: true, },
    { type: "circle", r: "1", },
  ],
};

make.bullet_pentagon = {
  parent: ["bullet"],
  shapes: [
    { type: "polygon", sides: 5, r: 1, body: true, },
  ],
};

make.bullet_hexagon = {
  parent: ["bullet"],
  shapes: [
    { type: "polygon", sides: 6, r: 1, body: true, },
  ],
};

make.bullet_heptagon = {
  parent: ["bullet"],
  shapes: [
    { type: "polygon", sides: 7, r: 1, body: true, },
  ],
};

make.bullet_lineline = {
  parent: ["bullet"],
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 1, h: 0.25, body: true, },
  ],
};

make.bullet_line1 = {
  parent: ["bullet"],
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 1, h: 0.1, body: true, },
  ],
};

make.bullet_line2 = {
  parent: ["bullet"],
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 1, h: 0.09, body: true, },
  ],
};

make.bullet_planeplane = {
  parent: ["bullet"],
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.25, h: 1, body: true, },
  ],
};

make.bullet_plane1 = {
  parent: ["bullet"],
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.1, h: 1, body: true, },
  ],
};

make.bullet_grow = {
  parent: ["bullet"],
  movement_controller: "grow",
};

make.bullet_homing = {
  parent: ["bullet"],
  movement_controller: "homing",
  rotation_controller: "homing",
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line", x: 0, y: 0, x2: 1, y2: 0, },
  ],
};

make.bullet_tower = {
  parent: ["bullet"],
  fixed: false,
  density: config.balance.bullet_tower_density_mult,
  shooting: true,
  rotation_controller: "homing",
  time_death: 60 * 10,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", r: "shootsize*1" },
  ],
};

make.bullet_tower_basic = {
  parent: ["bullet_tower"],
  shoots: [
    { type: "basic", reload: 60, size: 10, speed: 5, spread: 0.05, spreadv: 0, damage: 3, },
  ],
};

make.bullet_tower_grow = {
  parent: ["bullet_tower"],
  shoots: [
    { type: "grow", reload: 80, size: 7, speed: 4, spread: 0.05, spreadv: 0, damage: 3, options: { grow_amount: 0.008, }, },
  ],
};

// ##player projectiles

make.bullet_tower_placer = {
  parent: ["bullet_tower"],
  keep_children: true,
  rotation_controller: "autotarget_player",
  shoots: [
    { parent: shoots.p_placer_tower, },
  ],
};

make.bullet_tower_rammer = {
  parent: ["bullet_tower"],
  keep_children: true,
  rotation_controller: "autotarget_player",
  shoots: [
    { parent: shoots.p_rammer_tower, },
  ],
};

make.bullet_launcher = {
  parent: ["bullet"],
  shooting: true,
  keep_children: true,
  shapes: [
    { type: "circle", body: true, },
    { type: "circle_fade", r: "shootsize*1", color: C.bright_blue, },
  ],
  shoots: [
    { parent: shoots.p_launcher_small, color: C.bright_blue, },
  ],
};

make.bullet_bigauto = {
  parent: ["bullet_auto"],
  shooting: true,
  keep_children: true,
  rotation_controller: "autotarget_player",
  shapes: [
    { type: "circle", body: true, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    { parent: shoots.p_bigauto_small, },
  ],
};

make.bullet_homing_player = {
  parent: ["bullet"],
  movement_controller: "homing",
  rotation_controller: "homing_player",
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line", x: 0, y: 0, x2: 1, y2: 0, },
  ],
};

// ##enemy projectiles

make.bullet_enemy_tower_placer = {
  parent: ["bullet_tower"],
  keep_children: true,
  rotation_controller: "autotarget_enemy",
  shoots: [
    { parent: shoots.e_placer_tower, },
  ],
};

make.bullet_boss_basic = {
  parent: ["bullet_tower"],
  keep_children: true,
  rotation_controller: "autotarget_enemy",
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", },
  ],
  shoots: [
    { parent: shoots.e_basic, },
  ],
};

make.bullet_amongus = {
  parent: ["bullet_tower"],
  keep_children: true,
  rotation_controller: "autotarget_enemy",  
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.6, h: 0.6, body: true, },
    { type: "rectangle", x: -0.8, y: -0.4, w: 0.2, h: 0.2, },
    { type: "rectangle", x: -0.8, y: 0.4, w: 0.2, h: 0.2, },
    { type: "rectangle", x: 0.2, y: 0.2, w: 0.2, h: 0.4, },
  ],
  shoots: [
    { parent: shoots.e_amongus_bullet, },
  ],
};

make.bullet_enemy_amongus = {
  parent: ["bullet_tower"],
  keep_children: true,
  always_shoot: true,
  rotation_controller: "autotarget_enemy",  
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.8, h: 0.6, body: true, color: C.transparent, },
    { type: "rectangle", x: 0.15, y: 0, w: 0.6, h: 0.6, },
    { type: "rectangle", x: -0.65, y: -0.4, w: 0.2, h: 0.2, },
    { type: "rectangle", x: -0.65, y: 0.4, w: 0.2, h: 0.2, },
    { type: "rectangle", x: 0.35, y: 0.2, w: 0.2, h: 0.4, },
  ],
  shoots: [
    { parent: shoots.e_amongus, rotation: 0, },
  ],
};

// #enemies

make.enemy = {
  collision_filter: category.enemy,
  fixed: false,
  density: 1000000,
  enemy: true,
  team: -1,
  friction: 0.1,
  color: C.red,
  rotation_controller: "target",
  homing_amount: 0.06,
  target_player: true,
};

// ##normal enemies

make.enemy_basic = {
  parent: ["enemy"],
  name: "Basic",
  size: 20,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_basic, },
  ],
  health: {
    capacity: 15,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 2, },
  ],
};

make.enemy_basic_double = {
  parent: ["enemy"],
  name: "Basic ×2",
  size: 23,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.3, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.3, y: 0, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_basic_double, x: 0.3, y: 0, delay: 0, },
    { parent: shoots.e_basic_double, x: -0.3, y: 0, delay: 25, },
  ],
  health: {
    capacity: 22,
    damage: 0.0047,
  },
  items: [
    { type: "normal", number: 3, },
  ],
};

make.enemy_basic_triple = {
  parent: ["enemy"],
  name: "Basic ×3",
  size: 24,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.33, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 1, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: -0.33, y: 0, shoot_index: 2, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_basic_triple, x: 0.33, y: 0, delay: 0, },
    { parent: shoots.e_basic_triple, x: 0, y: 0, delay: 20, color: C.orangered_bullet, },
    { parent: shoots.e_basic_triple, x: -0.33, y: 0, delay: 40, },
  ],
  health: {
    capacity: 29,
    damage: 0.0044,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

make.enemy_basic_quintuple = {
  parent: ["enemy"],
  name: "Basic ×5",
  size: 25,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
  ],
  shoots: [
    { parent: shoots.e_basic_quintuple, x: 0, y: 0, delay: 0, color: C.orangered_bullet, },
    { parent: shoots.e_basic_quintuple, x: 0, y: 0, delay: 5, color: C.orangered_bullet, },
    { parent: shoots.e_basic_quintuple, x: 0, y: 0, delay: 10, color: C.orangered_bullet, },
    { parent: shoots.e_basic_quintuple, x: 0, y: 0, delay: 15, color: C.orangered_bullet, },
    { parent: shoots.e_basic_quintuple, x: 0, y: 0, delay: 20, color: C.orangered_bullet, },
  ],
  health: {
    capacity: 32,
    damage: 0.0055,
  },
  items: [
    { type: "normal", number: 5, },
  ],
};

make.enemy_basic_hexagon = {
  parent: ["enemy"],
  name: "Basic ×6",
  size: 22,
  shapes: [
    { type: "polygon", sides: 6, r: 1, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_basic_hexagon, },
    { parent: shoots.e_basic_hexagon, delay: 5, },
    { parent: shoots.e_basic_hexagon, delay: 10, },
    { parent: shoots.e_basic_hexagon, delay: 15, },
    { parent: shoots.e_basic_hexagon, delay: 20, },
    { parent: shoots.e_basic_hexagon, delay: 25, },
  ],
  health: {
    capacity: 26,
    damage: 0.004,
  },
  items: [
    { type: "normal", number: 5, },
  ],
};

make.enemy_double = {
  parent: ["enemy"],
  name: "Double",
  size: 22,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: -0.4, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0.4, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_double, x: 0, y: -0.4, rotation: -1, },
    { parent: shoots.e_double, x: 0, y: 0.4, rotation: 1, },
  ],
  health: {
    capacity: 18,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 2, },
  ],
};

make.enemy_triple = {
  parent: ["enemy"],
  name: "Triple",
  size: 23,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.5, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.25, y: SQRT_3 * 0.25, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.25, y: -SQRT_3 * 0.25, shoot_index: 2, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_triple, x: 0.5, y: 0, },
    { parent: shoots.e_triple, x: -0.25, y: SQRT_3 * 0.25, rotation: 20, },
    { parent: shoots.e_triple, x: -0.25, y: -SQRT_3 * 0.25, rotation: -20, },
  ],
  health: {
    capacity: 18,
    damage: 0.0045,
  },
  items: [
    { type: "normal", number: 3, },
  ],
};

make.enemy_quadruple = {
  parent: ["enemy"],
  name: "Quadruple",
  size: 26,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.25 * SQRT_2, y: 0.25 * SQRT_2, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0.25 * SQRT_2, y: -0.25 * SQRT_2, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.25 * SQRT_2, y: 0.25 * SQRT_2, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.25 * SQRT_2, y: -0.25 * SQRT_2, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_quadruple, x: 0.25 * SQRT_2, y: 0.25 * SQRT_2, rotation: 0, },
    { parent: shoots.e_quadruple, x: 0.25 * SQRT_2, y: -0.25 * SQRT_2, rotation: 0, },
    { parent: shoots.e_quadruple, x: -0.25 * SQRT_2, y: 0.25 * SQRT_2, rotation: 0, delay: 0, },
    { parent: shoots.e_quadruple, x: -0.25 * SQRT_2, y: -0.25 * SQRT_2, rotation: 0, delay: 0, },
  ],
  health: {
    capacity: 24,
    damage: 0.004,
  },
  items: [
    { type: "normal", number: 5, },
  ],
};

make.enemy_quintuple = {
  parent: ["enemy"],
  name: "Quintuple",
  size: 25,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.55, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0.17, y: -0.5231, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0.17, y: 0.5231, shoot_index: 2, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.445, y: -0.3233, shoot_index: 3, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.445, y: 0.3233, shoot_index: 4, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_quintuple, x: 0.5, y: 0, },
    { parent: shoots.e_quintuple, x: 0.17, y: -0.5231, rotation: -3, },
    { parent: shoots.e_quintuple, x: 0.17, y: 0.5231, rotation: 3, },
    { parent: shoots.e_quintuple, x: -0.445, y: -0.3233, rotation: -8, },
    { parent: shoots.e_quintuple, x: -0.445, y: 0.3233, rotation: 8, },
  ],
  health: {
    capacity: 25,
    damage: 0.0055,
  },
  items: [
    { type: "normal", number: 3, },
  ],
};

make.enemy_octring = {
  parent: ["enemy"],
  name: "Octring",
  size: 32,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    ...shape_rotate_position(
      { type: "circle_fade", shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
      8, 0.6,
    ),
  ],
  shoots: [
    ...shoot_rotate_position(shoots.e_octring, 8, 0.6),
  ],
  health: {
    capacity: 28,
    damage: 0.006,
  },
  items: [
    { type: "normal", number: 8, },
  ],
};

make.enemy_lineline = {
  parent: ["enemy"],
  name: "Line (Line)",
  size: 25,
  homing_amount: 0.08,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 1, h: 0.35, body: true, },
    { type: "rectangle_fade", x: 0, y: 0, shoot_index: 0, w: "shootsize*1", h: "shootsize*0.25", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_lineline, x: 0, y: 0, },
  ],
  health: {
    capacity: 17.5,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

make.enemy_line2 = {
  parent: ["enemy"],
  name: "Line (2)",
  size: 23,
  homing_amount: 0.08,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 1, h: 0.3, body: true, },
    { type: "circle_fade", x: -0.5, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0.5, y: 0, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_line2, x: -0.5, y: 0, },
    { parent: shoots.e_line2, x: 0.5, y: 0, },
  ],
  health: {
    capacity: 10,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 2, },
  ],
};

make.enemy_line4 = {
  parent: ["enemy"],
  name: "Line (4)",
  size: 24,
  homing_amount: 0.085,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 1, h: 0.3, body: true, },
    { type: "circle_fade", x: -0.6, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.2, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0.2, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0.6, y: 0, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_line4, x: -0.6, y: 0, },
    { parent: shoots.e_line4, x: -0.2, y: 0, },
    { parent: shoots.e_line4, x: 0.2, y: 0, },
    { parent: shoots.e_line4, x: 0.6, y: 0, },
  ],
  health: {
    capacity: 15,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 3, },
  ],
};

make.enemy_line_satellite = {
  parent: ["enemy"],
  name: "Line Satellite",
  size: 25,
  homing_amount: 0.07,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 1, h: 1, body: true, color: C.transparent, },
    { type: "rectangle", x: 0, y: 0.8, w: 1, h: 0.2, },
    { type: "rectangle", x: 0, y: -0.8, w: 1, h: 0.2, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: 0.5, y: 0.8, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.5, y: 0.8, shoot_index: 2, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0.5, y: -0.8, shoot_index: 3, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.5, y: -0.8, shoot_index: 4, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_line_satellite_middle, x: 0, y: 0, },
    { parent: shoots.e_line_satellite_side, x: 0.5, y: 0.8, },
    { parent: shoots.e_line_satellite_side, x: -0.5, y: 0.8, rotation: 1, },
    { parent: shoots.e_line_satellite_side, x: 0.5, y: -0.8, },
    { parent: shoots.e_line_satellite_side, x: -0.5, y: -0.8, rotation: -1, },
  ],
  health: {
    capacity: 20,
    damage: 0.006,
  },
  items: [
    { type: "normal", number: 2, },
    { type: "big", number: 1, },
  ],
};

make.enemy_planeplane = {
  parent: ["enemy"],
  name: "Plane (Plane)",
  size: 25,
  homing_amount: 0.08,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.35, h: 1, body: true, },
    { type: "rectangle_fade", x: 0, y: 0, shoot_index: 0, w: "shootsize*0.25", h: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_planeplane, x: 0, y: 0, },
  ],
  health: {
    capacity: 19,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

make.enemy_plane3 = {
  parent: ["enemy"],
  name: "Plane (3)",
  size: 23,
  homing_amount: 0.08,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.3, h: 1, body: true, },
    { type: "circle_fade", x: 0, y: -0.6, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0.6, shoot_index: 2, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_plane3, x: 0, y: -0.6, },
    { parent: shoots.e_plane3, x: 0, y: 0, },
    { parent: shoots.e_plane3, x: 0, y: 0.6, },
  ],
  health: {
    capacity: 11,
    damage: 0.006,
  },
  items: [
    { type: "normal", number: 2, },
  ],
};

make.enemy_slow = {
  parent: ["enemy"],
  name: "Slow",
  size: 30,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_slow, },
  ],
  health: {
    capacity: 20,
    damage: 0.009,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

make.enemy_fast = {
  parent: ["enemy"],
  name: "Fast",
  size: 16,
  shapes: [
    { type: "rectangle", x: 0, y: 0, body: true, },
    { type: "rectangle_fade", x: 0, y: 0, shoot_index: 0, w: "shootsize*1", h: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_fast, },
  ],
  health: {
    capacity: 8,
    damage: 0.004,
  },
  items: [
    { type: "normal", number: 1, },
    { type: "big", number: 1, },
  ],
};

make.enemy_strong = {
  parent: ["enemy"],
  name: "Strong",
  size: 24,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_strong, },
  ],
  health: {
    capacity: 16,
    damage: 0.01,
  },
  items: [
    { type: "normal", number: 3, },
    { type: "big", number: 1, },
  ],
};

make.enemy_small = {
  parent: ["enemy"],
  name: "Small",
  size: 12,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_small, },
  ],
  health: {
    capacity: 5,
    damage: 0.006,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

make.enemy_small_healthy = {
  parent: ["enemy"],
  name: "Small (health+)",
  size: 12,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, color: C.orangered, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_small_healthy, },
  ],
  health: {
    capacity: 8,
    damage: 0.0055,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

// ##ram enemies

make.enemy_ram = {
  parent: ["enemy"],
  name: "Rammer",
  density: 0.001,
  friction: 0.1,
  size: 18,
  always_shoot: true,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0.5, y: 0.35, r: 0.15 },
    { type: "circle", x: 0.5, y: -0.35, r: 0.15 },
    { type: "circle_fade", x: 0.5, y: 0.35, r: 0.15, color: C.purple },
    { type: "circle_fade", x: 0.5, y: -0.35, r: 0.15, color: C.purple },
  ],
  shoots: [
    { parent: shoots.e_ram, },
  ],
  health: {
    capacity: 10,
    damage: 0.025,
  },
  items: [
    { type: "normal", number: 2, },
  ],
};

make.enemy_ramshoot = {
  parent: ["enemy"],
  name: "Rammer+",
  density: 0.001,
  friction: 0.1,
  size: 23,
  always_shoot: true,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0.5, y: 0.35, r: 0.15 },
    { type: "circle", x: 0.5, y: -0.35, r: 0.15 },
    { type: "circle_fade", x: 0.5, y: 0.35, r: 0.15, color: C.purple },
    { type: "circle_fade", x: 0.5, y: -0.35, r: 0.15, color: C.purple },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_ramshoot_shoot, },
    { parent: shoots.e_ramshoot_ram, },
  ],
  health: {
    capacity: 16,
    damage: 0.025,
  },
  items: [
    { type: "normal", number: 3, },
  ],
};

// ##scatter enemies

make.enemy_scatter_triple = {
  parent: ["enemy"],
  name: "Scatter Triple",
  always_shoot: true,
  spin_rate: 1.2,
  rotation_controller: "spin",
  size: 21,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.5, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.25, y: SQRT_3 * 0.25, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: -0.25, y: -SQRT_3 * 0.25, shoot_index: 2, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_scatter_triple, x: 0.5, y: 0, },
    { parent: shoots.e_scatter_triple, x: -0.25, y: SQRT_3 * 0.25, rotation: 120, delay: 10, },
    { parent: shoots.e_scatter_triple, x: -0.25, y: -SQRT_3 * 0.25, rotation: -120, delay: 20, },
  ],
  health: {
    capacity: 16,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 3, },
  ],
};

make.enemy_scatter_square = {
  parent: ["enemy"],
  name: "Scatter Square",
  always_shoot: true,
  spin_rate: 1.4,
  rotation_controller: "spin",
  size: 18,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 1, h: 1, body: true, },
    { type: "rectangle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_scatter_square, x: 0, y: 0, },
    { parent: shoots.e_scatter_square, x: 0, y: 0, rotation: 90, delay: 6, },
    { parent: shoots.e_scatter_square, x: 0, y: 0, rotation: 180, delay: 12, },
    { parent: shoots.e_scatter_square, x: 0, y: 0, rotation: 270, delay: 18, },
  ],
  health: {
    capacity: 12,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 3, },
  ],
};

make.enemy_oct = {
  parent: ["enemy"],
  name: "Octopus",
  always_shoot: true,
  spin_rate: 1,
  rotation_controller: "spin",
  size: 25,
  color: C.orangered,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: 0.4, y: 0, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: 0, y: 0.4, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: -0.4, y: 0, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: 0, y: -0.4, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
  ],
  shoots: shoot_rotate({ parent: shoots.e_oct, color: C.orangered_bullet, }, 8),
  health: {
    capacity: 18,
    damage: 0.011,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

// ##boss enemies

make.enemy_boss_oct = {
  parent: ["enemy"],
  name: "Boss: Octopus",
  always_shoot: true,
  spin_rate: 0.2,
  rotation_controller: "spin",
  size: 55,
  color: C.orangered,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: 0.5, y: 0, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: 0, y: 0.5, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: -0.5, y: 0, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
    { type: "circle_fade", x: 0, y: -0.5, shoot_index: 0, r: "shootsize*1", color: C.orangered_bullet, },
  ],
  shoots: shoot_rotate({ parent: shoots.e_boss_oct, color: C.orangered_bullet, }, 8),
  health: {
    capacity: 50,
    damage: 0.018,
  },
  items: [
    { type: "normal", number: 20, },
  ],
};

make.enemy_boss_tutorial = {
  parent: ["enemy"],
  name: "Boss: Bubble (easy)",
  size: 45,
  homing_amount: 0.05,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_boss_tutorial, },
  ],
  health: {
    capacity: 30,
    damage: 0.005,
  },
  items: [
    { type: "normal", number: 10, },
    { type: "large", number: 1, },
  ],
};

make.enemy_boss_tutorial_2 = {
  parent: ["enemy"],
  name: "Boss: Homing",
  size: 40,
  always_shoot: true,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_boss_tutorial_2, rotation: -30, },
    { parent: shoots.e_boss_tutorial_2, rotation: 30 },
  ],
  health: {
    capacity: 35,
    damage: 0.006,
  },
  items: [
    { type: "normal", number: 10, },
    { type: "large", number: 2, },
  ],
};

make.enemy_boss_basic = {
  parent: ["enemy"],
  name: "Boss: Basic (Easy)",
  size: 75,
  homing_amount: 0.07,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_boss_basic, },
    { parent: shoots.e_boss_basic_maker, shooting: true, },
  ],
  health: {
    capacity: 50,
    damage: 0.006,
  },
  items: [
    { type: "normal", number: 8, },
    { type: "large", number: 2, },
  ],
};

make.enemy_boss_decring = {
  parent: ["enemy"],
  name: "Boss: Decring",
  size: 50,
  homing_amount: 0.07,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    ...shape_rotate_position(
      { type: "circle_fade", shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
      10, 0.6,
    ),
    { type: "circle_fade", x: 0, y: 0, shoot_index: 10, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 11, r: "shootsize*1", color: C.enemy_bullet, activate_below: 0.6, },
  ],
  shoots: [
    ...shoot_rotate_position(shoots.e_boss_decring, 10, 0.6),
    { parent: shoots.e_boss_decring_middle, x: 0, y: 0, },
    { parent: shoots.e_boss_decring_trap, x: 0, y: 0, activate_below: 0.6, }, // only activates below 36 health
  ],
  health: {
    capacity: 50,
    damage: 0.010,
  },
  items: [
    { type: "normal", number: 10, },
    { type: "big", number: 2, },
    { type: "large", number: 1, },
  ],
};

make.enemy_boss_gwoc = {
  parent: ["enemy"],
  name: "Boss: Wall of China",
  size: 100,
  homing_amount: 0.08,
  rotation_controller: "fixed",
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.1, h: 1, body: true, },
    { type: "circle_fade", x: 0, y: -0.8, shoot_index: 0, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: -0.6, shoot_index: 1, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: -0.4, shoot_index: 2, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: -0.2, shoot_index: 3, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 4, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0.2, shoot_index: 5, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0.4, shoot_index: 6, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0.6, shoot_index: 7, r: "shootsize*1", color: C.enemy_bullet, },
    { type: "circle_fade", x: 0, y: 0.8, shoot_index: 8, r: "shootsize*1", color: C.enemy_bullet, },
  ],
  shoots: [
    { parent: shoots.e_homing, x: 0, y: -0.8, },
    { parent: shoots.e_boss_decring_trap, x: 0, y: -0.6, },
    { parent: shoots.e_boss_tutorial, x: 0, y: -0.4, },
    { parent: shoots.e_basic, x: 0, y: -0.2, },
    { parent: shoots.e_homing, x: 0, y: 0, },
    { parent: shoots.e_boss_decring_trap, x: 0, y: 0.2, },
    { parent: shoots.e_boss_tutorial, x: 0, y: 0.4, },
    { parent: shoots.e_basic, x: 0, y: 0.6, },
    { parent: shoots.e_homing, x: 0, y: 0.8, },
  ],
  health: {
    capacity: 70,
    damage: 0.006,
  },
  items: [
    { type: "normal", number: 6, },
    { type: "big", number: 3, },
    { type: "large", number: 2, },
  ],
};

// ##special enemies

make.enemy_homing = {
  parent: ["enemy"],
  name: "Homing",
  always_shoot: true,
  size: 18,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_extend", x2: 1, y2: 0, },
  ],
  shoots: [
    { parent: shoots.e_homing, rotation: 0 },
  ],
  health: {
    capacity: 17,
    damage: 0.008,
  },
  items: [
    { type: "normal", number: 1, },
    { type: "big", number: 1, },
  ],
};

make.enemy_homing_3 = {
  parent: ["enemy"],
  name: "Homing (x3)",
  always_shoot: true,
  size: 21,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_extend", x2: 1, y2: 0, },
    { type: "line_extend", x2: -0.5, y2: SQRT_3 * 0.5, },
    { type: "line_extend", x2: -0.5, y2: -SQRT_3 * 0.5 },
  ],
  shoots: [
    { parent: shoots.e_homing_3, rotation: 0 },
    { parent: shoots.e_homing_3, rotation: 120 },
    { parent: shoots.e_homing_3, rotation: -120 },
  ],
  health: {
    capacity: 19,
    damage: 0.008,
  },
  items: [
    { type: "normal", number: 2, },
    { type: "big", number: 1, },
  ],
};

make.enemy_homing_4 = {
  parent: ["enemy"],
  name: "Homing (x4)",
  always_shoot: true,
  size: 23,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_extend", x2: 1, y2: 0, },
    { type: "line_extend", x2: -1, y2: 0, },
    { type: "line_extend", x2: 0, y2: 1, },
    { type: "line_extend", x2: 0, y2: -1, },
  ],
  shoots: [
    { parent: shoots.e_homing_4, rotation: 0 },
    { parent: shoots.e_homing_4, rotation: 90 },
    { parent: shoots.e_homing_4, rotation: 180 },
    { parent: shoots.e_homing_4, rotation: 270 },
  ],
  health: {
    capacity: 21,
    damage: 0.008,
  },
  items: [
    { type: "normal", number: 3, },
    { type: "big", number: 1, },
  ],
};

// ##very special enemies (???)

make.enemy_escape = {
  parent: ["enemy"],
  name: "Escaper",
  density: 0.001,
  size: 18,
  always_shoot: true,
  target_player: true,
  rotation_controller: "escape",
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0.5, y: 0.35, r: 0.15 },
    { type: "circle", x: 0.5, y: -0.35, r: 0.15 },
    { type: "circle_fade", x: 0.5, y: 0.35, r: 0.15, color: C.pink },
    { type: "circle_fade", x: 0.5, y: -0.35, r: 0.15, color: C.pink },
  ],
  shoots: [
    { parent: shoots.e_ram_escape, },
  ],
  health: {
    capacity: 10,
    damage: 0.018,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

make.enemy_invisible = {
  parent: ["enemy"],
  name: "Invisible",
  size: 16,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, color: C.camo, },
    { type: "circle_fade", x: 0, y: 0, shoot_index: 0, r: "shootsize*1", color: C.camo, },
  ],
  shoots: [
    { parent: shoots.e_basic, color: C.camo },
  ],
  health: {
    capacity: 7,
    damage: 0.012,
  },
  items: [
    { type: "normal", number: 4, },
  ],
};

// ##funny enemies (!!!!!!!!!!)

make.enemy_z_amongus = {
  parent: ["enemy"],
  name: "Among Us",
  size: 30,
  always_shoot: true,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.8, h: 0.6, body: true, color: C.transparent, },
    { type: "rectangle", x: 0.15, y: 0, w: 0.6, h: 0.6, },
    { type: "rectangle", x: -0.65, y: -0.4, w: 0.2, h: 0.2, },
    { type: "rectangle", x: -0.65, y: 0.4, w: 0.2, h: 0.2, },
    { type: "rectangle", x: 0.35, y: 0.2, w: 0.2, h: 0.4, },
  ],
  shoots: [
    { parent: shoots.e_amongus, rotation: 0, },
  ],
  health: {
    capacity: 18,
    damage: 0.008,
  },
  items: [
    { type: "normal", number: 4, },
    { type: "big", number: 1, },
  ],
};

make.enemy_boss_z_amongus = {
  parent: ["enemy"],
  name: "Boss: Among Us",
  size: 50,
  always_shoot: true,
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.8, h: 0.6, body: true, color: C.transparent, },
    { type: "rectangle", x: 0.15, y: 0, w: 0.6, h: 0.6, },
    { type: "rectangle", x: -0.65, y: -0.4, w: 0.2, h: 0.2, },
    { type: "rectangle", x: -0.65, y: 0.4, w: 0.2, h: 0.2, },
    { type: "rectangle", x: 0.35, y: 0.2, w: 0.2, h: 0.4, },
  ],
  shoots: [
    { parent: shoots.e_amongus_boss, rotation: 0, },
  ],
  health: {
    capacity: 30,
    damage: 0.008,
  },
  items: [
    { type: "normal", number: 9, },
    { type: "big", number: 2, },
    { type: "large", number: 1, },
  ],
};

// #items (coins)

make.item = {
  collision_filter: category.item,
  fixed: false,
  item: true,
  density: 0.1,
  friction: 0.05,
  team: 1,
  color: C.gold,
};

make.item_small = {
  parent: ["item"],
  name: "Coin x1",
  size: 3.5,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
  ],
  health: {
    capacity: 1,
    damage: 0,
  },
  give_type: "coin",
  give_number: 1,
};

make.item_normal = {
  parent: ["item"],
  name: "Coin x2",
  size: 5,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
  ],
  health: {
    capacity: 2,
    damage: 0,
  },
  give_type: "coin",
  give_number: 2,
};

make.item_big = {
  parent: ["item"],
  name: "Coin x6",
  size: 7.5,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
  ],
  health: {
    capacity: 6,
    damage: 0,
  },
  give_type: "coin",
  give_number: 6,
};

make.item_large = {
  parent: ["item"],
  name: "Coin x10",
  size: 10,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
  ],
  health: {
    capacity: 10,
    damage: 0,
  },
  give_type: "coin",
  give_number: 10,
};

make.item_huge = {
  parent: ["item"],
  name: "Coin x20",
  size: 15,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
  ],
  health: {
    capacity: 20,
    damage: 0,
  },
  give_type: "coin",
  give_number: 20,
};

make.item_gigantic = {
  parent: ["item"],
  name: "Coin x50",
  size: 20,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
  ],
  health: {
    capacity: 50,
    damage: 0,
  },
  give_type: "coin",
  give_number: 50,
};

// #symbols

make.symbol = {
  collision_filter: category.none,
  fixed: false,
  symbol: true,
  no_body: true,
  team: 1,
};

make.enemy_spawn_symbol = {
  parent: ["symbol"],
  time_death: config.game.enemy_spawn_delay,
  size: 0,
  color: C.red_dark,
  shapes: [
    { type: "line", x: 0.2, y: 0, x2: 1, y2: 0, },
    { type: "line", x: -0.2, y: 0, x2: -1, y2: 0, },
    { type: "line", x: 0, y: 0.2, x2: 0, y2: 1, },
    { type: "line", x: 0, y: -0.2, x2: 0, y2: -1, },
  ],
};

// #tests

make.test = {
  fixed: true,
  wall: true,
  deleter: true,
  color: "#FFFFFF",
  size: 30,
  shapes: [
    { type: "circle" },
  ],
};

function shape_rotate_position(shape, number, radius = 0.5, offset = 0, total_angle = 360) {
  const result = [];
  const total_angle_radians = total_angle / 180 * Math.PI;
  for (let i = 0; i < number; i++) {
    let angel = total_angle_radians / number * i + offset; // angel
    const sh = { };
    for (let k in shape) {
      sh[k] = shape[k];
    }
    sh.x = radius * Math.cos(angel);
    sh.y = radius * Math.sin(angel);
    result.push(sh);
  }
  return result;
}

for (const make_key in make) {
  if (!make.hasOwnProperty(make_key)) continue;
  make[make_key].make_type = make_key;
}

export const realmake = function(k) {
  const final = {};
  function recurse(a) {
    if (a.hasOwnProperty("parent")) {
      for (let p of a.parent) {
        recurse(make[p]);
      }
    }
    for (const key in a) {
      if (key === "parent") continue;
      final[key] = a[key];
    }
  }
  recurse(make[k]);
  return final;
}

export const realshoots = function(k) {
  const final = [];
  function recurse(a, i) {
    if (a.hasOwnProperty("parent")) {
      let parent = a.parent;
      if (!Array.isArray(parent)) parent = [parent];
      for (let p of parent) {
        recurse(p, i);
      }
    }
    for (const key in a) {
      if (key === "parent") continue;
      final[i][key] = a[key];
    }
  }
  let i = 0;
  for (const S of make[k].shoots) {
    final.push({});
    recurse(S, i++);
  }
  return final;
}

export const realitems = function(k) {
  let object_items = [];
  const result_items = {};
  function recurse(a) {
    if (a.hasOwnProperty("parent")) {
      for (let p of a.parent) {
        recurse(make[p]);
      }
    }
    object_items = a.items;
  }
  recurse(make[k]);
  for (const item of object_items) {
    const I = make["item_" + item.type];
    result_items[I.give_type] = (result_items[I.give_type] || 0) + I.give_number * item.number;
  }
  return result_items;
}