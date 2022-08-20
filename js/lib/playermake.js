import { C } from "./color.js";
import { shoots, shoot_repeat, shoot_rotate } from "./shoots.js";

export const player_make = { };

player_make.basic = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_fade", x: "shootsize*1", y: 0, x2: 1, y2: 0, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_basic, },
  ],
};

player_make.triple = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: 0.8, color: C.neon_blue, },
    // { type: "line_fade", x: "shootsize*1", y: 0, x2: 1, y2: 0, },
    { type: "circle_fade", x: 0, y: 0.3, r: "shootsize*1", shoot_index: 0, color: C.player_bullet, },
    { type: "circle_fade", x: 0, y: 0, r: "shootsize*1", shoot_index: 1, color: C.player_bullet, },
    { type: "circle_fade", x: 0, y: -0.3, r: "shootsize*1", shoot_index: 2, color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_triple, rotation: 10, delay: 2, },
    { parent: shoots.p_triple, rotation: 0, },
    { parent: shoots.p_triple, rotation: -10, delay: 2, },
  ],
};

player_make.penta = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: 0.8, color: C.neon_blue },
    { type: "circle_fade", x: 0, y: 0.3, r: "shootsize*1", shoot_index: 0, color: C.player_bullet },
    { type: "circle_fade", x: 0, y: -0.3, r: "shootsize*1", shoot_index: 4, color: C.player_bullet },
    { type: "circle_fade", x: 0, y: 0.15, r: "shootsize*1", shoot_index: 1, color: C.player_bullet },
    { type: "circle_fade", x: 0, y: -0.15, r: "shootsize*1", shoot_index: 3, color: C.player_bullet },
    { type: "circle_fade", x: 0, y: 0, r: "shootsize*1", shoot_index: 2, color: C.player_bullet },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_penta, rotation: 18, color: C.player_bullet, delay: 10, },
    { parent: shoots.p_penta, rotation: 9, color: C.player_bullet, delay: 5, },
    { parent: shoots.p_penta, rotation: 0, color: C.player_bullet, },
    { parent: shoots.p_penta, rotation: -9, color: C.player_bullet, delay: 5, },
    { parent: shoots.p_penta, rotation: -18, color: C.player_bullet, delay: 10, },
  ],
};

player_make.oct = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: 0.8, color: C.neon_blue },
    { type: "circle_fade", x: 0, y: 0.3, r: "shootsize*1", shoot_index: 1, color: C.neon_blue },
    { type: "circle_fade", x: 0.3, y: 0, r: "shootsize*1", shoot_index: 1, color: C.neon_blue },
    { type: "circle_fade", x: 0, y: -0.3, r: "shootsize*1", shoot_index: 1, color: C.neon_blue },
    { type: "circle_fade", x: -0.3, y: 0, r: "shootsize*1", shoot_index: 1, color: C.neon_blue },
    { type: "circle_fade", x: 0, y: 0, r: "shootsize*1", shoot_index: 0, color: C.neon_blue },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_oct, color: C.neon_blue, delay: 2.5, },
    ...shoot_rotate({ parent: shoots.p_oct, color: C.neon_blue }, 4),
    ...shoot_rotate({ parent: shoots.p_oct, color: C.neon_blue, delay: 5, }, 4, 45),
  ],
};

player_make.lobster = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: 0.8, color: C.neon_blue },
    { type: "circle_fade", x: 0, y: 0.3, r: "shootsize*1", shoot_index: 0, color: C.bright_blue },
    { type: "circle_fade", x: 0, y: -0.3, r: "shootsize*1", shoot_index: 4, color: C.bright_blue },
    { type: "circle_fade", x: 0, y: 0.15, r: "shootsize*1", shoot_index: 1, color: C.bright_blue },
    { type: "circle_fade", x: 0, y: -0.15, r: "shootsize*1", shoot_index: 3, color: C.bright_blue },
    { type: "circle_fade", x: 0, y: 0, r: "shootsize*1", shoot_index: 2, color: C.bright_blue },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_lobster, rotation: 20, color: C.bright_blue, delay: 10, },
    { parent: shoots.p_lobster, rotation: 10, color: C.bright_blue, delay: 5, },
    { parent: shoots.p_lobster, rotation: 0, color: C.bright_blue, },
    { parent: shoots.p_lobster, rotation: -10, color: C.bright_blue, delay: 5, },
    { parent: shoots.p_lobster, rotation: -20, color: C.bright_blue, delay: 10, },
    { parent: shoots.p_lobster, rotation: 220, color: C.bright_blue, delay: 10, },
    { parent: shoots.p_lobster, rotation: 200, color: C.bright_blue, delay: 5, },
    { parent: shoots.p_lobster, rotation: 180, color: C.bright_blue, },
    { parent: shoots.p_lobster, rotation: 160, color: C.bright_blue, delay: 5, },
    { parent: shoots.p_lobster, rotation: 140, color: C.bright_blue, delay: 10, },
  ],
};

player_make.jellyfish = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: 0.8, color: C.neon_blue },
    { type: "circle_fade", x: 0, y: 0, r: 0.6, color: C.neon_blue },
    { type: "circle_fade", x: 0, y: 0, r: 0.4, color: C.neon_blue },
    { type: "circle_fade", x: 0, y: 0, r: 0.2, color: C.neon_blue },
  ],
  shoots: [
    "delete",
    ...shoot_rotate({ parent: shoots.p_jellyfish, color: C.neon_blue }, 16),
  ],
};

player_make.burst2 = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_fade", x: "shootsize*1", y: 0.15, x2: 1, y2: 0.15, },
    { type: "line_fade", x: "shootsize*1", y: -0.15, x2: 1, y2: -0.15, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_burst2, },
    { parent: shoots.p_burst2, delay: 8, },
  ],
};

player_make.burst3 = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_fade", x: "shootsize*1", y: 0.25, x2: 1, y2: 0.25, },
    { type: "line_fade", x: "shootsize*1", y: 0, x2: 1, y2: 0, },
    { type: "line_fade", x: "shootsize*1", y: -0.25, x2: 1, y2: -0.25, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet },
    { type: "circle_fade", r: "shootsize*0.5", color: C.player_bullet },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_burst3, },
    { parent: shoots.p_burst3, delay: 5, },
    { parent: shoots.p_burst3, delay: 10, },
    { parent: shoots.p_burst3_small, delay: 15, },
  ],
};

player_make.burst10 = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_fade", x: "shootsize*1", y: 0, x2: 1, y2: 0, width: 10, color: C.bright_blue, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_burst10, },
    { parent: shoots.p_burst10, delay: 5, },
    { parent: shoots.p_burst10, delay: 10, },
    { parent: shoots.p_burst10, delay: 15, },
    { parent: shoots.p_burst10, delay: 20, },
    { parent: shoots.p_burst10, delay: 25, },
    { parent: shoots.p_burst10, delay: 30, },
    { parent: shoots.p_burst10, delay: 35, },
    { parent: shoots.p_burst10, delay: 40, },
    { parent: shoots.p_burst10, delay: 45, },
  ],
};

player_make.burster = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_fade", x: "shootsize*1", y: 0, x2: 1, y2: 0, width: 10, color: C.sky_blue, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_burster, },
  ],
};

player_make.scatter1 = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "square_fade", w: "shootsize*1", h: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_scatter1, },
  ],
};

player_make.scatter2 = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "square_fade", w: "shootsize*1", h: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_scatter2, },
  ],
};

player_make.scatterspam = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "square_fade", w: "shootsize*1", h: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_scatterspam, },
  ],
};

player_make.flamethrower = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_flamethrower, },
  ],
};

player_make.squarer = {
  shapes: [
    { type: "rectangle", x: 0, y: 0, w: 0.8, h: 0.8, body: true, },
    { type: "square_fade", w: "shootsize*1", h: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_squarer, color: C.player_bullet + "C0", },
  ],
};

player_make.square = {
  size: 14,
  shapes: [
    { type: "rectangle", x: 0, y: 0, body: true, },
    { type: "square_fade", w: "shootsize*1", h: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_square, color: C.player_bullet + "A0", },
  ],
};

player_make.shotgun = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: 0.8, color: C.pink, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    ...shoot_repeat({ parent: shoots.p_shotgun, }, 10),
  ],
};

player_make.shootgun = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: 0.8, color: C.pink, },
    { type: "square_fade", w: "shootsize*1", h: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    ...shoot_repeat({ parent: shoots.p_shootgun, }, 20),
  ],
};

player_make.auto = {
  homing_amount: 0.055,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.4, y: 0, r: "shootsize*1", color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_auto, color: C.bright_blue, },
  ],
};

player_make.autooo = {
  homing_amount: 0.05,
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0, y: 0, r: "shootsize*1", color: C.bright_blue, },
    { type: "circle", x: 0, y: 0, r: "1", color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_autooo, color: C.bright_blue, delay: 0, },
    { parent: shoots.p_autooo, color: C.player_bullet, delay: 10, },
    { parent: shoots.p_autooo, color: C.bright_blue, delay: 20, },
  ],
};

player_make.sniper = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "polygon_fade", sides: 3, r: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_sniper, },
  ],
};

player_make.sniperauto = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "polygon_fade", sides: 3, r: "shootsize*1", shoot_index: 0, color: C.player_bullet, },
    { type: "circle_fade", x: 0.6, y: 0, r: "7", shoot_index: 1, color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_sniperauto_sniper, },
    { parent: shoots.p_sniperauto_auto, color: C.bright_blue, },
  ],
};

player_make.sniperscatter = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "square_fade", w: "shootsize*1", h: "shootsize*1", shoot_index: 0, color: C.player_bullet, },
    { type: "polygon_fade", sides: 3, r: "shootsize*1", shoot_index: 1, color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_sniperscatter_scatter, },
    { parent: shoots.p_sniperscatter_sniper, color: C.bright_blue, },
  ],
};

player_make.big = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_big, },
  ],
};

player_make.large = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", r: "shootsize*1", color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_large, color: C.bright_blue, },
  ],
};

player_make.toolarge = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_toolarge, },
  ],
};

player_make.stacker = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet, },
    { type: "circle_fade", r: "shootsize*2", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_stacker1, },
    { parent: shoots.p_stacker2, },
  ],
};

player_make.launcher = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: "6", color: C.bright_blue, },
    { type: "circle_fade", r: "shootsize*1", color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_launcher, },
  ],
};

player_make.bigauto = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle", x: 0, y: 0, r: "6", color: C.player_bullet, },
    { type: "circle_fade", r: "shootsize*1", color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_bigauto_big, color: C.bright_blue },
  ],
};

player_make.liner = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_extend", x2: -1, y2: 0, color: C.player_bullet, },
    { type: "line_extend", x2: 1, y2: 0, color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_liner, },
  ],
};

player_make.liner2 = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_extend", x2: -1, y2: 0.2, y: 0.2, shoot_index: 0, color: C.player_bullet, },
    { type: "line_extend", x2: 1, y2: 0.2, y: 0.2, shoot_index: 0, color: C.player_bullet, },
    { type: "line_extend", x2: -1, y2: -0.2, y: -0.2, shoot_index: 1, color: C.player_bullet, },
    { type: "line_extend", x2: 1, y2: -0.2, y: -0.2, shoot_index: 1, color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_liner2, y: 0.2, },
    { parent: shoots.p_liner2, y: -0.2, delay: 12, },
  ],
};

player_make.planer = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_extend", x: 0, y: -1, color: C.bright_blue, },
    { type: "line_extend", x: 0, y: 1, color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_planer, color: C.bright_blue },
  ],
};

player_make.placer = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.6, y: 0, r: "shootsize*1", color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_placer, color: C.bright_blue, },
  ],
};

player_make.placerbig = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "circle_fade", x: 0.1, y: 0, r: "shootsize*1", color: C.bright_blue, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_placer_big, color: C.bright_blue, },
  ],
};

player_make.rammer = {
  shapes: [
    { type: "circle", x: 0, y: 0, body: true, },
    { type: "line_extend", x: 0, y: 0, x2: 1, y2: 0, color: C.red_health, },
    { type: "circle_fade", x: -0.5, y: 0, r: "shootsize*1", duration_reload: true, shoot_index: 1, color: C.player_bullet, },
  ],
  shoots: [
    "delete",
    { parent: shoots.p_rammer_ram },
    { parent: shoots.p_rammer_shoot },
  ],
};