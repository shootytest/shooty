import { engine } from "../main/main.js";
import { player } from "./player.js";


const Engine = Matter.Engine,
      Events = Matter.Events,
      Vector = Matter.Vector;

function collide(a, b, pair) {
  const t = a.thing;
  const u = b.thing;
  if (t.deleter && u.bullet) {
    u.deleted = true;
  }
  if (t.player && u.enemy_bullet) {
    const d = t.health.hit(u.damage);
    t.killer = u.shoot_parent;
    u.deleted = true;
  }
  if (t.enemy && u.player_bullet) {
    const d = t.health.hit(u.damage);
    player.add_points("damage", d);
    t.killer = u.shoot_parent;
    u.deleted = true;
  }
  if (t.item && u.player) {
    player.item_collect(u.give_type, u.give_number);
    t.deleted = true;
  }
  if (t.item && u.player_bullet) {
    const d = t.health.hit(u.damage);
    u.deleted = true;
  }
  if (t.health.damage > 0 && u.health.capacity > 0 && t.team !== u.team) {
    u.health.hit_add(t.health.damage);
    u.killer = t.shoot_parent;
  }
}

function collide_end(a, b, pair) {
  const t = a.thing;
  const u = b.thing;
  if (t.health.damage > 0 && u.health.capacity > 0) {
    u.health.hit_remove(t.health.damage);
  }
}

export const init_collide = function() {
  Events.on(engine, "collisionStart", function(event) {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      collide(a, b, pair);
      collide(b, a, pair);
    }
  });
  Events.on(engine, "collisionEnd", function(event) {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      collide_end(a, b, pair);
      collide_end(b, a, pair);
    }
  });
}