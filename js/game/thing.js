import { camera } from "../draw/camera.js";
import { draw } from "../draw/draw.js";
import { bounce } from "../draw/ui.js";
import { C } from "../lib/color.js";
import { category, config } from "../lib/config.js";
import { make } from "../lib/make.js";
import { random } from "../util/random.js";
import { math_util } from "../util/math.js";
import { Enemy } from "./enemy.js";
import { Health } from "./health.js";
import { player, Player } from "./player.js";

const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Query = Matter.Query,
      Vector = Matter.Vector;

let world = null;

export class Thing {

  static things = [];
  static walls = [];
  static enemies = [];

  static time = 1;

  static init_things = function(w) {
    world = w;
  }

  static tick_things = function() {
    for (const thing of Thing.things) {
      thing.tick();
    }
    Thing.time++;
  }

  static draw_things = function() {
    // sorts things in ascending order of their layer property
    const sorted_things = Thing.things.sort(function(a, b) {
      return a.layer - b.layer;
    });
    for (const thing of sorted_things) {
      thing.draw(camera.ctx);
    }
  }

  // location variables
  body = null; // physics body
  size = 0;
  target = {
    position: Vector.create(),
    velocity: Vector.create(),
    facing: Vector.create(),
    rotation: 0,
  };
  movement_controller = "none";
  rotation_controller = "none";

  // property booleans
  exists = false;
  fixed = false;
  no_body = false;
  wall = false;
  deleter = false;
  deleted = false;
  invisible = false;
  player = false;
  enemy = false;
  bullet = false;
  item = false;
  symbol = false;
  dummy = false;
  blocks_sight = false;
  target_player = false;
  player_bullet = false;
  enemy_bullet = false;
  is_bullet = false;
  shooting = false;
  always_shoot = false;
  never_shoot = false;
  keep_children = false;

  // property scalars
  team = 0;
  health = new Health(this);
  damage = 0;
  speed = 0;
  speed_death = 0;
  size_death = 0;
  time_death = -1;
  homing_amount = 0.05;
  grow_amount = 0.01;
  spin_rate = 0;

  // properties
  killer = null;
  make_type = "";

  // physics
  friction = 0;
  restitution = 0;
  density = 0.001;
  collision_filter = category.all;

  // display variables
  color = "#FFFFFF";
  fill = C.transparent;
  layer = 0;
  shapes = []; // do not modify in code!!!
  shapes2 = []; // can modify (use for guns, etc.)
  
  // pew
  shoots = [];
  shoots_time = [];
  shoots_duration = [];
  shoots_duration_time = [];
  shoot_delay = []; // use pq?
  shoot_parent = this;
  shoot_children = [];

  // items
  items = [];
  give_type = "coin";
  give_number = 0;

  constructor(position) {
    if (position != null) {
      this.position = Vector.clone(position);
    }
    this.make(make.default);
  }

  make(o) {
        
    // inheritance first
    if (o.hasOwnProperty("parent")) {
      for (let make_thing of o.parent) {
        this.make(make[make_thing]);
      }
    }

    for (let k in o) {
      if (o[k] != null && o.hasOwnProperty(k)) {

        // array keys: push one by one
        if (["shapes2"].includes(k)) {
          for (const ok of o[k]) {
            this[k].push(ok);
          }
          continue;
        }

        // shoots
        if (k === "shoots") {
          if (o[k][0] === "delete") {
            this.shoots = [];
            this.shoots_time = [];
            this.shoots_duration = [];
            this.shoots_duration_time = [];
          }
          for (const S of o[k]) {
            if (typeof S === "string") continue;
            const to_push = {};
            function recursive_add(shoot_obj, parented = false) {
              if (shoot_obj.hasOwnProperty("parent") && !parented) {
                recursive_add(shoot_obj.parent);
                recursive_add(shoot_obj, true);
                return;
              }
              for (const key in shoot_obj) {
                if (!shoot_obj.hasOwnProperty(key) || key == "parent") continue;
                to_push[key] = shoot_obj[key];
              }
            }
            recursive_add(S);
            this.shoots.push(to_push);
          }
          for (const not_used of o[k]) {
            // init shoots_time and others
            this.shoots_time.push(0);
            this.shoots_duration.push(0);
            this.shoots_duration_time.push(0);
          }
          continue;
        }

        // items
        if (k === "items") {
          for (const I of o[k]) {
            const to_push = {};
            function recursive_add(item, parented = false) {
              if (item.hasOwnProperty("parent") && !parented) {
                recursive_add(item.parent);
                recursive_add(item, true);
                return;
              }
              for (const key in item) {
                if (!item.hasOwnProperty(key) || key == "parent") continue;
                to_push[key] = item[key];
              }
            }
            recursive_add(I);
            this.items.push(to_push);
          }
          continue;
        }

        // health stuff
        if (k === "health") {
          const h = o[k];
          if (h.capacity != null) {
            this.health.set_capacity(h.capacity);
          }
          if (h.regen != null) {
            this.health.regen = h.regen;
          }
          if (h.regen_time != null) {
            this.health.hit_clear = h.regen_time;
          }
          if (h.damage != null) {
            this.health.damage = h.damage;
          }
          continue;
        }

        // normal properties
        this[k] = o[k];

      }
    }
  }

  get position() {
    return (this.body) ? Vector.clone(this.body.position) : Vector.clone(this.target.position);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
  
  get screenpos() {
    return camera.object_position(this.position);
  }
  
  get rotation() {
    return (this.body) ? this.body.angle : this.target.rotation;
  }

  get direction() {
    return this.target.rotation;
  }

  get rotation_vector() {
    const r = this.rotation;
    return Vector.create(Math.cos(r), Math.sin(r));
  }

  get velocity() {
    return (this.body) ? Vector.clone(this.body.velocity) : Vector.create();
  }

  get invincible() {
    return this.health.invincible;
  }

  get body_shape() {
    let result = null;
    if (this.shapes.length === 1) {
      result = this.shapes[0];
    } else {
      for (const shape of this.shapes) {
        if (shape.body) result = shape;
      }
    }
    return result;
  }

  set position(pos) {
    this.target.position = Vector.create(pos.x, pos.y);
  }

  set velocity(v) {
    this.target.velocity = Vector.create(v.x, v.y);
  }

  set rotation(rotation) {
    this.target.rotation = rotation;
  }

  set invincible(i) {
    this.health.invincible = i;
  }

  tick() {
    this.health.tick();
    this.tick_rotate();
    this.tick_move();
    if (this.dummy) return;
    this.tick_shoot();
    this.tick_body();
    this.tick_death();
    if (this.shooting) {
      this.shoot();
    }
  }

  tick_move() {
    if (this.body == null) return;
    switch (this.movement_controller) {
      case "grow":
        const grow_amount = 1 + this.grow_amount;
        Body.scale(this.body, grow_amount, grow_amount);
        this.size *= grow_amount;
        break;
      case "homing":
        Body.setVelocity(this.body, Vector.createpolar(this.rotation, Vector.magnitude(this.body.velocity)));
        break;
      case "none":
        break;
      default:
        console.log(this);
        console.error("Unknown movement controller: " + this.movement_controller);
        break;
    }
  }

  tick_rotate() {
    if (this.body == null) return;
    switch (this.rotation_controller) {
      case "target":
      case "homing": // slowly turn towards target
        const new_rotation = Vector.angle(this.position, this.shoot_parent.target.facing);
        this.target.rotation = Vector.lerp_angle(this.target.rotation, new_rotation, this.homing_amount);
        break;
      case "autotarget": // automatically target nearest enemies
        const nearest_enemy = Enemy.nearest(this.position);
        if (nearest_enemy != null) this.target.facing = nearest_enemy.position;
        this.target.rotation = Vector.angle(this.position, this.target.facing);
        break;
      case "escape": // automatically escape nearest player_bullets
        const pi = Math.PI;
        let nearest_bullet = Player.nearest_bullet(this.position);
        if (nearest_bullet == null) break;
        const cross_product = (Vector.cross(nearest_bullet.velocity, Vector.sub(this.position, nearest_bullet.position)));
        let dir = (cross_product < 0 ? 1 : 3) * pi / 2;
        if (nearest_bullet != null) this.target.facing = Vector.rotateAbout(nearest_bullet.position, dir, this.position);
        this.target.rotation = Vector.angle(this.position, this.target.facing);
        break;
      case "player":
      case "enemy":
        this.target.rotation = Vector.angle(this.position, this.target.facing);
        break;
      case "spin": // constantly spin
        this.target.rotation += Vector.deg_to_rad(this.spin_rate);
        break;
      case "none":
        break;
      default:
        console.log(this);
        console.error("Unknown rotation controller: " + this.rotation_controller);
        break;
    }
    Body.setAngle(this.body, this.target.rotation);
  }

  tick_shoot() {
    for (let i = 0; i < this.shoots.length; i++) {
      const reload = this.shoots[i].reload;
      const duration = this.shoots[i].duration;
      const duration_reload = this.shoots[i].duration_reload;
      let canshoot = this.shoots[i].auto;
      if (this.shoots_time[i] < reload && this.shoots_duration[i] <= 0) {
        this.shoots_time[i]++;
      }
      if (duration != null && duration > 0) {
        if ((this.shooting || this.shoots_duration[i] > 0) && this.shoots_time[i] >= reload && this.shoots_duration[i] < duration) {
          this.shoots_duration[i]++;
          canshoot = true;
        }
        if (duration_reload != null && duration_reload > 0 && this.shoots_duration_time[i] < duration_reload) {
          this.shoots_duration_time[i]++;
        }
      }
      if (!this.shooting && canshoot) {
        this.shoot_index(i);
      }
    }
    for (const delayed of this.shoot_delay) {
      if (Thing.time >= delayed.time) {
        this.shoot_bullet(delayed.s);
        const index = this.shoot_delay.indexOf(delayed);
        if (index != null && index > -1) {
          this.shoot_delay.splice(index, 1);
        }
      }
    }
  }

  tick_body() {
    if (this.body == null) return;
  }
  
  tick_death() {
    if (this.deleted) {
      this.remove();
    }
    if (this.time_death > -1) {
      if (this.time_death > 0) {
        this.time_death--;
      } else {
        this.remove();
      }
    }
    if (this.size_death != 0) {
      if (this.size > this.size_death) {
        this.remove();
      }
    }
    if (this.speed_death != 0) {
      if (Vector.magnitudeSquared(this.velocity) < this.speed_death * this.speed_death) {
        this.remove();
      }
    }
    if (this.health.zero()) {
      if (!this.player) {
        this.remove();
      }
    }
  }

  real_point_location(vector) {
    return Vector.add(this.position, Vector.rotate(Vector.create(this.get_shape_dimension(vector.x, 1, 0), this.get_shape_dimension(vector.y, 1, 0)), this.rotation));
  }

  draw_point_location(vector, scale) {
    return Vector.add(this.screenpos, Vector.mult(Vector.rotate(Vector.create(this.get_shape_dimension(vector.x, 1, 0), this.get_shape_dimension(vector.y, 1, 0)), this.rotation), scale));
  }

  get_shape_dimension(dimension, multiplier = 1, normal = 1) {
    let d = 1;
    if (multiplier == null) {
      multiplier = 1;
    }
    if (dimension == null) {
      d = normal;
    } else if (typeof dimension === "number") {
      d = dimension;
    } else if (typeof dimension === "string") {
      if (dimension.startsWith("shootsize") && this.shoots.length > 0) {
        return (this.shoots[0].size || 0) * multiplier * ((+dimension.substring(10)) || 0);
      }
      return multiplier * (+dimension);
    } else {
      console.error("Invalid dimension type: " + typeof dimension);
    }
    return this.size * multiplier * d;
  }

  get_shoot_ratio(shoot_index, is_duration) {
    if (this.shoots.length <= 0) return 0;
    if (this.dummy) return 1;
    if (is_duration) return this.get_shoot_duration_ratio(shoot_index);
    shoot_index = shoot_index || 0;
    const reload = this.shoots[shoot_index].reload || 0;
    const delay = this.shoots[shoot_index].delay || 0;
    const shoots_time = this.shoots_time[shoot_index];
    if (reload === 0 || shoots_time === 0) return 0;
    let result;
    if (delay === 0) {
      result = this.shoots_time[shoot_index] / reload;
    } else {
      result = ((this.shoots_time[shoot_index] - delay + reload * 1000) % reload) / reload;
    }
    if (result === 0) return 1;
    return math_util.bound(result, 0, 1);
  }

  get_shoot_duration_ratio(shoot_index) {
    if (this.shoots.length <= 0) return 0;
    shoot_index = shoot_index || 0;
    return Math.min(1, this.shoots_duration_time[shoot_index] / this.shoots[shoot_index].duration_reload);
  }

  draw(ctx, scale = camera.scale) {
    if (this.invisible) return;
    for (const shape of this.shapes) {
      this.draw_shape(ctx, scale, shape);
    }
    for (const shape of this.shapes2) {
      this.draw_shape(ctx, scale, shape);
    }
  }

  /*
   * Options:
   * color, fill
   */
  draw_shape(ctx, scale, shape, options = { }) {
    ctx.lineWidth = (shape.width || 3);
    const type = shape.type;
    const location = this.draw_point_location(Vector.create(shape.x, shape.y), scale);
    const x = location.x;
    const y = location.y;
    const rot = (shape.rotation || 0) + this.rotation;
    let r, w, h, location2, x2, y2, c, fill;
    c = options.color || shape.color || this.color;
    fill = options.fill || shape.fill || this.fill || C.transparent;
    const whiteness = ((this.invincible) ? 0.5 * (bounce(Thing.time, 10)) : 0);
    ctx.strokeStyle = (whiteness === 0) ? c : chroma.mix(c, C.white, whiteness);
    ctx.fillStyle = (whiteness === 0) ? fill : chroma.mix(fill, C.white, whiteness);
    if (type.includes("fade")) {
      const mix_fade = 1 - this.get_shoot_ratio(shape.shoot_index, shape.duration_reload);
      ctx.strokeStyle = chroma.mix(ctx.strokeStyle, shape.fade_color || C.transparent, mix_fade);
      ctx.fillStyle = chroma(ctx.fillStyle).alpha(chroma(ctx.fillStyle).alpha() * mix_fade);
    }
    switch (type) {
      case "circle":
      case "circle_fade":
        r = this.get_shape_dimension(shape.r, 1 * scale);
        draw.circle(ctx, x, y, r);
        ctx.fill();
        ctx.stroke();
        break;
      case "square":
      case "square_fade":
      case "rectangle":
      case "rectangle_fade":
        w = this.get_shape_dimension(shape.w, 2 * scale);
        h = this.get_shape_dimension(shape.h, 2 * scale);
        draw.fill_rectangle_angle(ctx, x, y, w, h, rot);
        draw.stroke_rectangle_angle(ctx, x, y, w, h, rot);
        break;
      case "line":
      case "line_fade":
        location2 = this.draw_point_location(Vector.create(shape.x2, shape.y2), scale);
        x2 = location2.x;
        y2 = location2.y;
        draw.line(ctx, x, y, x2, y2);
        break;
      case "polygon":
      case "polygon_fade":
        r = this.get_shape_dimension(shape.r, 1 * scale);
        draw.regular_polygon(ctx, shape.sides, r, x, y, rot);
        ctx.fill();
        ctx.stroke();
        break;
      case "line_extend":
        location2 = this.draw_point_location(Vector.create(shape.x2, shape.y2), scale);
        location2 = Vector.lerp(location, location2, this.get_shoot_ratio(shape.shoot_index, shape.duration_reload));
        x2 = location2.x;
        y2 = location2.y;
        draw.line(ctx, x, y, x2, y2);
        break;
      default:
        console.error("Invalid shape type: " + type);
        break;
    }
  }

  shoot() {
    for (let index = 0; index < this.shoots.length; index++) {
      this.shoot_index(index);
    }
  }

  shoot_index(index) {
    const s = this.shoots[index];
    let t = this.shoots_time[index];
    while (t >= s.reload) {
      if (s.duration != null && s.duration > 0 && s.duration_reload) {
        // duration_reload time
        while (this.shoots_duration_time[index] >= s.duration_reload) {
          this.shoot_do(s);
          this.shoots_duration_time[index] -= s.duration_reload;
        }
      } else {
        // shoot!
        this.shoot_do(s);
      }
      if (s.duration != null && s.duration > 0) {
        if (this.shoots_duration[index] >= s.duration) {
          t -= s.reload;
          this.shoots_duration[index] = 0;
        } else {
          break;
        }
      } else {
        t -= s.reload;
      }
    }
    this.shoots_time[index] = t;
  }

  shoot_do(s) {
    if (s.move) {
      this.shoot_move(s);
    } else {
      if (s.delay && s.delay > 0) {
        this.shoot_delay.push({ time: Thing.time + s.delay, s: s });
      } else {
        this.shoot_bullet(s);
      }
    }
  }

  shoot_bullet(S) {
    if (this.body == null) return;
    const location = this.real_point_location(Vector.create(S.x, S.y));
    const b = new Thing(location);
    // setup the bullet
    if (this.shoot_parent.player) {
      b.make(make.player_bullet);
    } else if (this.shoot_parent.enemy) {
      b.make(make.enemy_bullet);
    }
    b.make(make["bullet_" + S.type]);
    // bullet properties (optional, might have already been set up in the previous step)
    if (S.size != null) {
      let spreadsize = S.spreadsize || 0;
      let size = spreadsize === 0 ? S.size : random.gauss(S.size, spreadsize);
      b.size = size;
    }
    if (S.damage != null) {
      b.damage = S.damage;
    }
    if (S.color != null) {
      b.color = S.color;
    }
    if (S.time != null) {
      b.time_death = S.time;
    }
    if (S.options != null) {
      for (let k in S.options) {
        if (!S.options.hasOwnProperty(k)) continue;
        b[k] = S.options[k];
      }
    }
    b.team = this.team;
    b.shoot_parent = this.shoot_parent;
    // shoot the bullet with correct rotation and speed
    let rot = random.gauss(this.rotation + (Vector.deg_to_rad(S.rotation || 0)), S.spread || 0);
    let facing = this.target.facing;
    let spreadv = S.spreadv || 0;
    let spd = spreadv === 0 ? S.speed : random.gauss(S.speed, spreadv);
    const thing_velocity = Vector.rotate(this.velocity, -rot).x;
    if (spd !== 0) spd += thing_velocity * config.physics.velocity_shoot_boost;
    if (S.target_type != null) {
      if (S.target_type === "enemy") {
        const nearest_enemy = Enemy.nearest(location);
        if (nearest_enemy != null) facing = nearest_enemy.position;
        rot = Vector.angle(location, facing);
      }
    }
    const rotvector = Vector.create(Math.cos(rot), Math.sin(rot));
    b.velocity = Vector.mult(rotvector, spd);
    // target the correct location
    b.target.facing = facing;
    b.rotation = rot;
    // add to children
    this.shoot_children.push(b);
    // create bullet!
    b.create();

    // also do stuff to body of thing
    // do recoil
    if (S.recoil != false && this.body != null && spd && S.speed) {
      let recoil = (S.recoil == null) ? 1 : S.recoil;
      recoil *= spd * b.body.mass * config.physics.force_factor * config.physics.recoil_factor;
      this.push_to(Vector.add(this.position, rotvector), -recoil);
    }
  }

  shoot_move(S) {
    if (!S.move || this.body == null) return;
    this.push_to(this.target.facing, S.speed * this.body.mass * config.physics.force_factor);
  }

  create() {
    this.create_list();
    this.create_body();
    this.create_shoot();
    this.exists = true;
  }

  create_list() {
    if (!Thing.things.includes(this)) {
      Thing.things.push(this);
    }
    if (this.enemy && !Thing.enemies.includes(this)) {
      Thing.enemies.push(this);
    }
    if (this.wall && !Thing.walls.includes(this)) {
      Thing.walls.push(this);
    }
  }

  create_body() {
    if (this.no_body) return;
    if (this.body != null) {
      this.remove_body();
    }
    const shapes = this.shapes;
    const options = {
      isStatic: this.fixed,
      isBullet: this.is_bullet,
      collisionFilter: this.collision_filter,
      label: this.label,
      density: this.density * config.physics.density_factor,
      restitution: this.restitution,
      frictionAir: this.friction * config.physics.friction_factor,
      friction: 0,
      frictionStatic: 0,
    };
    let body = null;
    let shape = null;
    if (shapes.length <= 0) {
      return;
    } else if (shapes.length === 1) {
      shape = shapes[0];
    } else {
      for (const s of shapes) {
        if (s.body) shape = s;
      }
    }
    const type = shape.type;
    const location = this.real_point_location(Vector.create(shape.x, shape.y));
    const x = location.x;
    const y = location.y;
    if (type.includes("circle")) {
      const r = this.get_shape_dimension(shape.r);
      body = Bodies.circle(x, y, r, options);
    } else if (type.includes("rectangle") || type.includes("square")) {
      const w = this.get_shape_dimension(shape.w, 2);
      const h = this.get_shape_dimension(shape.h, 2);
      body = Bodies.rectangle(x, y, w, h, options);
    } else if (type.includes("polygon")) {
      const r = this.get_shape_dimension(shape.r);
      const vertices = math_util.regpoly(shape.sides, r, shape.rotation || 0, x, y);
      body = Bodies.fromVertices(x, y, [vertices], options); // Bodies.polygon(x, y, shape.sides, r, options);
    } else if (type.includes("line") && false) { // not yet ready
      const location2 = this.real_point_location(Vector.create(shape.x2, shape.y2));
      const middle = Vector.mult(Vector.add(location, location2), 0.5);
      const vertices = [Vector.sub(location, middle), Vector.sub(location2, middle)];
      console.log(vertices);
      body = Bodies.fromVertices(0, 0, vertices, options);
    } else {
      console.error("Invalid shape type for body: " + type);
    }
    body.thing = this;
    body.restitution = this.restitution;
    Body.setAngle(body, this.target.rotation);
    this.body = body;
    Composite.add(world, this.body);
    // set velocity
    Body.setVelocity(body, this.target.velocity);
  }

  create_shoot() {
    for (let i = 0; i < this.shoots.length; i++) {
      this.shoots_time[i] = 0;
      this.shoots_duration[i] = 0;
    }
  }

  remove() {
    if (this.items.length > 0) this.drop_items();
    this.remove_list();
    this.remove_body();
    this.remove_children();
    this.exists = false;
  }

  remove_list() {
    for (const array of [Thing.things, Thing.walls, Thing.enemies, this.shoot_parent.shoot_children]) {
      // remove this from array
      const index = array.indexOf(this);
      if (index != null && index > -1) {
        array.splice(index, 1);
      }
    }
  }

  remove_children() {
    if (this.keep_children) return;
    for (const c of this.shoot_children) {
      c.remove();
    }
  }

  remove_body() {
    if (this.body != null) {
      // remove from world
      Composite.remove(world, this.body);
      this.body = null;
      return true;
    } else {
      return false;
    }
  }

  query_point(x, y) {
    let v;
    if (y != null) v = Vector.create(x, y);
    else v = x;
    return Query.point([this.body], v);
  }

  move_force(v) {
    const move_v = Vector.mult(v, this.speed * this.body.mass * config.physics.force_factor);
    if (this.body != null) {
      Body.applyForce(this.body, this.position, move_v);
    }
  }

  move_to(position) {
    this.target.position = Vector.clone(position);
  }

  push_to(target, amount) {
    const push = Vector.mult(Vector.createpolar(Vector.angle(this.position, target), 1), amount);
    if (this.body != null && this.position != null && push.x != null && push.y != null) {
      Body.applyForce(this.body, this.position, push);
    }
  }

  make_invisible() {
    this.invisible = true;
    Composite.remove(world, this.body);
  }

  make_visible() {
    this.invisible = false;
    Composite.add(world, this.body);
  }

  drop_items() {
    const items = this.items;
    for (let I of items) {
      for (let index = 0; index < I.number; index++) {
        const location = Vector.add(this.position, Vector.createpolar(random.rand(Math.PI * 2), random.rand(this.size)));
        const i = new Thing(location);
        i.make(make["item_" + (I.type || "normal")]);
        i.create();
      }
    }
  }

}

window.Thing = Thing;