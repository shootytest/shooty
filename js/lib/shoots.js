
/*
  ---------- PREFIXES ----------

  e -> enemy
  p -> player
  t -> tower

  ------------------------------
*/

export const shoots = {};

shoots.p_basic = { type: "basic", reload: 30, size: 10, speed: 5, spread: 0.04, damage: 3, time: 240, };
// multi path
shoots.p_triple = { type: "basic", reload: 40, size: 9, speed: 4.5, spread: 0.02, damage: 1.7, time: 210, };
shoots.p_penta = { type: "basic", reload: 45, size: 8, speed: 4.5, spread: 0.02, damage: 1.45, time: 180, };
shoots.p_oct = { type: "basic", reload: 28, size: 7.2, speed: 6.4, spread: 0.048, damage: 1.75, time: 240, };
shoots.p_jellyfish = { type: "basic", reload: 36, size: 8, speed: 3.5, spread: 0.035, damage: 1.8, time: 100, };
shoots.p_lobster = { type: "basic", reload: 22, size: 7, speed: 4, spread: 0.04, damage: 0.9, time: 150, };
// burst path
shoots.p_burst2 = { type: "basic", reload: 40, size: 10, speed: 6.5, spread: 0.035, damage: 2.3, time: 270, };
shoots.p_burst3 = { type: "basic", reload: 50, size: 10, speed: 7, spread: 0.03, damage: 1.7, time: 300, };
shoots.p_burst3_small = { type: "basic", reload: 100, size: 5, speed: 7, spread: 0.03, damage: 1, time: 300, };
shoots.p_burst10 = { type: "basic", reload: 120, size: 7, speed: 6, spread: 0.025, damage: 1.1, time: 350, };
shoots.p_burster = { type: "basic", reload: 100, duration: 100, duration_reload: 2, size: 6, speed: 5, spread: 0.035, damage: 0.45, time: 350, };
// scatter path
shoots.p_scatter1 = { type: "square", reload: 15, size: 8, speed: 5, spread: 0.06, spreadv: 0.02, damage: 1.9, time: 200, };
shoots.p_scatter2 = { type: "square", reload: 8, size: 6, speed: 6.5, spread: 0.08, spreadv: 0.02, damage: 1.25, time: 160, };
shoots.p_scatterspam = { type: "square", reload: 3, size: 4.5, speed: 5, spread: 0.09, spreadv: 0.04, damage: 0.55, time: 180 };
shoots.p_flamethrower = { type: "basic", reload: 1, size: 3, speed: 4, spread: 0.1, spreadv: 0.8, damage: 0.18, time: 120, }; // a lot of spreadv
shoots.p_squarer = { type: "square", reload: 20, size: 13, speed: 4, spread: 0.045, damage: 2, time: 160, };
shoots.p_square = { type: "square", reload: 15, size: 14, speed: 3.6, spread: 0.02, damage: 1.3, time: 200, };
// shotgun path
shoots.p_shotgun = { type: "basic", reload: 50, size: 7.5, speed: 5, spread: 0.11, spreadv: 0.2, damage: 1.3, time: 120, };
shoots.p_shootgun = { type: "square", reload: 60, size: 8, speed: 5.5, spread: 0.13, spreadv: 0.25, damage: 0.8, time: 111, };
// auto path
shoots.p_auto = { type: "basic", reload: 25, size: 8, speed: 4.2, spread: 0.05, damage: 2.5, time: 190, x: 0.4, auto: true, target_type: "enemy", };
shoots.p_autooo = { type: "basic", reload: 40, size: 9, speed: 4.4, spread: 0.045, damage: 1.4, time: 200, auto: true, target_type: "enemy", };
// sniper path
shoots.p_sniper = { type: "triangle", reload: 45, size: 9.5, speed: 10, spread: 0.025, damage: 4.75, time: 300, };
shoots.p_sniperscatter_sniper = { type: "triangle", reload: 50, size: 9.5, speed: 9, spread: 0.03, damage: 2.5, time: 300, };
shoots.p_sniperscatter_scatter = { type: "square", reload: 15, size: 8, speed: 5, spread: 0.06, spreadv: 0.02, damage: 0.9, time: 200, };
shoots.p_sniperauto_sniper = { type: "triangle", reload: 50, size: 9.5, speed: 9, spread: 0.025, damage: 4, time: 300, };
shoots.p_sniperauto_auto = { type: "basic", reload: 40, size: 7, speed: 4, spread: 0.05, damage: 1, time: 190, x: 0.6, auto: true, target_type: "enemy", };
// big path
shoots.p_big = { type: "basic", reload: 60, size: 14, speed: 3.75, spread: 0.05, damage: 7, time: 400, };
shoots.p_large = { type: "basic", reload: 75, size: 20, speed: 3.2, spread: 0.05, damage: 9.5, time: 700, };
shoots.p_toolarge = { type: "basic", reload: 100, size: 30, speed: 2.7, spread: 0.1, damage: 15, time: 1000, };
shoots.p_stacker1 = { type: "basic", reload: 75, size: 7.5, speed: 4.9, spread: 0.05, damage: 3, time: 260, };
shoots.p_stacker2 = { type: "basic", reload: 75, size: 15, speed: 3.75, spread: 0.05, damage: 5.5, time: 390, };
shoots.p_launcher = { type: "launcher", reload: 70, size: 16, speed: 3, spread: 0.04, damage: 4.5, time: 200, };
shoots.p_launcher_small = { type: "basic", reload: 30, size: 8, speed: 4, spread: 0.04, damage: 1.8, time: 250, };
shoots.p_bigauto_big = { type: "bigauto", reload: 75, size: 16, speed: 3, spread: 0.055, damage: 5, time: 240, };
shoots.p_bigauto_small = { type: "basic", reload: 30, size: 6, speed: 5, spread: 0.04, damage: 1, time: 400, };
// line path
shoots.p_liner = { type: "line1", reload: 40, size: 30, speed: 6, spread: 0.03, damage: 5, time: 360, };
shoots.p_liner2 = { type: "line2", reload: 25, size: 27, speed: 5.5, spread: 0.04, damage: 1.6, time: 360, };
shoots.p_planer = { type: "plane1", reload: 25, size: 30, speed: 5, spread: 0.035, damage: 2.5, time: 360, };
// placer path
shoots.p_placer = { type: "tower_placer", reload: 40, size: 10.5, speed: 0, x: 0.6, damage: 5.5, time: 120, };
shoots.p_placer_big = { type: "tower_placer", reload: 60, size: 15, speed: 0, x: 0.1, damage: 6, time: 240, };
shoots.p_placer_tower = { type: "basic", reload: 120, size: 10.5, speed: 4, spread: 0.02, damage: 3.2, time: 130, };
// ram path
shoots.p_rammer_ram = { type: "ram", reload: 90, duration: 180, move: true, speed: 60, size: 8, };
shoots.p_rammer_shoot = { type: "tower_rammer", reload: 90, duration: 180, duration_reload: 10, size: 8, speed: 0, x: -0.5, spread: 0, damage: 2, time: 50, };
shoots.p_rammer_tower = { type: "basic", reload: 50, size: 8, speed: 4, spread: 0, damage: 1.2, time: 130, };
// unused (not a path)
shoots.p_homing = { type: "homing", reload: 40, size: 12.5, speed: 6, spread: 0.05, damage: 2.5, time: 300, options: { speed_death: 4.5, }, };
shoots.p_tower = { type: "tower_basic", reload: 60, size: 10, speed: 5, damage: 3, };

// enemies!
// basic type
shoots.e_basic = { type: "basic", reload: 60 * 1.5, size: 10, speed: 5, damage: 1, time: 360, };
shoots.e_basic_double = { type: "basic", reload: 60 * 1.6, size: 9, speed: 5.5, damage: 0.9, time: 300, };
shoots.e_basic_triple = { type: "basic", reload: 60 * 1.75, size: 8.5, speed: 6, damage: 0.8, time: 275, };
shoots.e_basic_quintuple = { type: "basic", reload: 60 * 1.5, size: 11, speed: 4.75, damage: 0.45, time: 370, };
shoots.e_basic_hexagon = { type: "basic", reload: 60 * 1.2, size: 7.5, speed: 5.5, damage: 0.25, time: 330, };
shoots.e_double = { type: "basic", reload: 60 * 1.5, size: 9, speed: 5.25, damage: 0.9, time: 300, };
shoots.e_triple = { type: "basic", reload: 60 * 1.5, size: 8.5, speed: 5.5, damage: 0.8, time: 280, };
shoots.e_quadruple = { type: "basic", reload: 60 * 1.6, size: 8, speed: 5.6, damage: 0.6, time: 320, };
shoots.e_quintuple = { type: "basic", reload: 60 * 1.8, size: 11, speed: 4.5, damage: 0.7, time: 380, };
shoots.e_fast = { type: "square", reload: 60 * 0.6, size: 8, speed: 8, damage: 0.75, time: 240, };
shoots.e_slow = { type: "basic", reload: 60 * 1.5, size: 18, speed: 3.5, damage: 2, time: 480, };
shoots.e_strong = { type: "basic", reload: 60 * 1.6, size: 12, speed: 15, damage: 1.6, time: 180, };
shoots.e_small = { type: "basic", reload: 60 * 0.25, size: 5, speed: 9, damage: 0.5, time: 500, };
// ram type
shoots.e_ram = { type: "ram", reload: 60 * 2, move: true, speed: 60, duration: 60 * 2.5, };
shoots.e_ram_escape = { type: "ram", reload: 1, move: true, speed: 60, duration: 10000000, };
shoots.e_ramshoot_ram = { type: "ram", reload: 60 * 2, move: true, speed: 50, duration: 60 * 3, };
shoots.e_ramshoot_shoot = { type: "basic", reload: 60 * 0.7, size: 6, speed: 10, damage: 0.8, time: 360, };
// scatter type
shoots.e_oct = { type: "basic", reload: 60 * 0.5, size: 7, speed: 6, spread: 0.05, damage: 1, time: 320, };
// placer type
shoots.e_placer_tower = { type: "basic", reload: 60 * 2, size: 9, speed: 4, damage: 1, time: 250, };
// special type?
shoots.e_homing = { type: "homing", reload: 60 * 1.4, size: 10, speed: 8, damage: 1.1, options: { homing_amount: 0.06, speed_death: 5, } };
shoots.e_homing_4 = { type: "homing", reload: 60 * 2.5, size: 9, speed: 8, damage: 0.8, options: { homing_amount: 0.05, speed_death: 5, } };

// bosses!
shoots.e_boss_basic = { type: "basic", reload: 60 * 0.75, size: 36, speed: 5, damage: 1.5, time: 400, };
shoots.e_boss_basic_maker = { type: "boss_basic", reload: 60 * 2, size: 20, speed: 10, spreadv: 1, friction: 0.05, spread: 1, damage: 2.3, time: 60 * 7, };
shoots.e_boss_tutorial = { type: "grow", reload: 60 * 0.2, size: 10, speed: 5, spread: 0.05, damage: 1, time: 120, options: { grow_amount: 0.012, }, };
shoots.e_boss_tutorial_2 = { type: "homing", reload: 60 * 0.5, size: 15, speed: 10, spread: 0.2, damage: 1, time: 300, options: { homing_amount: 0.05, }, };
shoots.e_boss_oct = { type: "basic", reload: 60 * 0.5, size: 18, speed: 10, spread: 0, damage: 1.5, time: 320, };

// test
shoots.t_basic = {};

export const shoot_rotate = function(parent, number, offset = 0, total_angle = 360) {
  const result = [];
  for (let i = 0; i < number; i++) {
    result.push({ parent: parent, rotation: total_angle / number * i + offset });
  }
  return result;
}

export const shoot_repeat = function(parent, number) {
  return shoot_rotate(parent, number, 0, 0);
}