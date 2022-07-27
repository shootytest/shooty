
export const math_util = { };

const Vector = Matter.Vector;

math_util.regpoly = function(sides, size, angle = 0, x = 0, y = 0) {
  const ans = [];
  let a = angle;
  size *= math_util.get_real_regpoly_size(sides);
  for (let i = 0; i < sides; ++i) {
    ans.push(Vector.create(x + size * Math.cos(a), y + size * Math.sin(a)));
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