
export class Vector2 {

  static xy(x, y) {
    return new Vector2(x, y);
  }

  static create(v) {
    return new Vector2(v.x, v.y);
  }

  static clone(v) {
    return new Vector2(v.x, v.y);
  }

  x = 0;
  y = 0;

  constructor(x, y) {
    x = x || 0;
    y = y || 0;
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  multiply(s) {
    return new Vector2(this.x * s, this.y * s);
  }

  divide(s) {
    return new Vector2(this.x / s, this.y / s);
  }

  dot(v) {
    return new Vector2(this.x * v.x, this.y * v.y);
  }

  lerp(v, factor) {
    return this.multiply(1 - factor).add(v.multiply(factor));
  }

  rotate(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Vector2(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
  }

  negate() {
    return new Vector2(-this.x, -this.y);
  }

  magnitude() {
    return Math.sqrt(this.magnitude2());
  }

  magnitude2() {
    return this.x * this.x + this.y * this.y;
  }

  normalize(new_length) {
    const m = (new_length || 1) / this.magnitude();
    return new Vector2(this.x * m, this.y * m);
  }

  distance_to(v) {
    return this.subtract(v).magnitude();
  }

  distance2_to(v) {
    return this.subtract(v).magnitude2();
  }

  angle_to(v) {
    return v.subtract(this).rotation; // is it this.subtract(v)?
  }

  get length() {
    return this.magnitude();
  }

  get length2() {
    return this.magnitude2();
  }

  get rotation() {
    return Math.atan2(this.y, this.x);
  }

  // mutable functions! use sparingly

  add_this(v) {
    if (typeof v === "number") {
      this.x += v;
      this.y += v;
    } else {
      this.x += v.x;
      this.y += v.y;
    }
  }

  multiply_this(v) {
    if (typeof v === "number") {
      this.x *= v;
      this.y *= v;
    } else {
      this.x *= v.x;
      this.y *= v.y;
    }
  }

  negate_this() {
    this.x *= -1;
    this.x *= -1;
  }

  lerp_this(v, factor) {
    const result = this.multiply(1 - factor).add(v.multiply(factor));
    this.x = result.x;
    this.y = result.y;
  }

}