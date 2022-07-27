
export const random = {};

random.rand = function(a, b) {
  if (b != null) {
    return a + Math.random() * (b - a);
  } else {
    return Math.random() * a;
  }
}

random.randint = function(a, b) {
  return Math.floor(random.rand(a, b + 1));
}

random.randbool = function() {
  return Math.random() > 0.5;
}

random.gauss = function(mean, deviation) {
  let x1, x2, w;
  do {
    x1 = 2 * Math.random() - 1;
    x2 = 2 * Math.random() - 1;
    w = x1 * x1 + x2 * x2;
  } while (0 == w || w >= 1);

  w = Math.sqrt(-2 * Math.log(w) / w);
  return mean + deviation * x1 * w;
}