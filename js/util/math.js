
export const math_util = { };

export const SQRT_2 = Math.sqrt(2);
export const SQRT_3 = Math.sqrt(3);
export const SQRT_5 = Math.sqrt(5);

math_util.regpoly = function(sides, size, angle = 0, x = 0, y = 0) {
  const ans = [];
  let a = angle;
  size *= math_util.get_real_regpoly_size(sides);
  for (let i = 0; i < sides; ++i) {
    ans.push(math_util.vector_create(x + size * Math.cos(a), y + size * Math.sin(a)));
    a += Math.PI * 2 / sides;
  }
  return ans;
}

const regpolySizes = (() => {
  const o = [1, 1, 1]; 
  for (let sides = 3; sides < 16; sides++) {
    o.push(Math.sqrt((2 * Math.PI / sides) * (1 / Math.sin(2 * Math.PI / sides))));
  }
  return o;
})();

math_util.get_real_regpoly_size = function(sides) {
  return 1;
  if (sides >= regpolySizes.length) {
    return 1;
  } else if (Math.floor(sides) == sides) {
    return regpolySizes[sides];
  } else {
    return Math.sqrt((2 * Math.PI / sides) * (1 / Math.sin(2 * Math.PI / sides)));
  }
}

math_util.in_rect = function(x, y, rx, ry, rw, rh) {
  return (rx <= x && ry <= y && rx + rw >= x && ry + rh >= y);
}

math_util.in_rectangle = function(x, y, rx, ry, rw, rh) {
  return math_util.in_rect(x, y, rx - rw / 2, ry - rh / 2, rw, rh);
}

math_util.round = function(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

math_util.round_to = function(value, multiple) {
  return Number(Math.round(value / multiple) * multiple);
}

math_util.fix_precision = function(value) {
  return math_util.round(value, 10);
}

math_util.bound = function(n, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, n));
}

math_util.get_color_component = (number_from_0_to_1) => {
  let result = Math.floor(number_from_0_to_1 * 255).toString(16);
  result = result.length == 1 ? "0" + result : result;
  return result;
}

math_util.get_color_alpha = (hex) => {
  if (hex.length === 8) {
    return Integer.parseInt(hex.substring(6), 16) / 255;
  } else if (hex.length === 4) {
    return Integer.parseInt(hex.substring(3), 16) / 16;
  } else {
    return 0;
  }
}

math_util.set_color_alpha = (hex, alpha) => {
  return hex + math_util.get_color_component(alpha);
}

// ui stuff

math_util.lerp = (a, b, s) => {
  return a * (1 - s) + b * s;
}

math_util.bounce = (time, period) => {
  return Math.abs(period - time % (period * 2)) / period;
}

// matter vector stuff

math_util.vector_create = function(x, y) {
  return { x: x || 0, y: y || 0 };
};