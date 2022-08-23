import { config } from "../lib/config.js";
import { make } from "../lib/make.js";
import { maps } from "../lib/maps.js";
import { Thing } from "./thing.js";

const Vector = Matter.Vector;

export const mapmaker = { };

mapmaker.width = 0;
mapmaker.height = 0;
mapmaker.shapes = [];

const border_wall_thickness = config.game.map_border_wall_thickness;

function makeborder(x, y, w, h, rot = 0) {
  const wall = new Thing(Vector.create(x, y));
  wall.make(make.wall);
  wall.size = 1;
  wall.shapes.push({ type: "rectangle", w: w, h: h, fill: "#FFFFFF22", });
  wall.rotation = rot;
  wall.create();
  return wall;
}

mapmaker.make = function(map_key) {
  const M = maps[map_key];
  const thick = border_wall_thickness;

  mapmaker.width = M.width;
  mapmaker.height = M.height;

  makeborder(0, M.height + thick, M.width + thick * 2, thick);
  makeborder(0, -M.height - thick, M.width + thick * 2, thick);
  makeborder(M.width + thick, 0, thick, M.height + thick * 2);
  makeborder(-M.width - thick, 0, thick, M.height + thick * 2);

  for (const S of M.shapes) {
    const wall = new Thing(Vector.create((S.x || 0) * M.width, (S.y || 0) * M.height));
    wall.make(make.wall);
    if (S.bouncy) {
      wall.make(make.wall_bounce);
    }
    if (S.bulletblock) {
      wall.make(make.wall_bulletblock);
    } else if (S.playerblock) {
      wall.make(make.wall_playerblock);
    }
    wall.size = 1;

    // shape
    if (S.type === "circle") {
      wall.shapes.push({ type: "circle", r: (S.r || 0), });
    } else if (S.type === "rectangle") {
      wall.shapes.push({ type: "rectangle", w: (S.w || 0), h: (S.h || 0) });
    } else if (S.type === "square") {
      wall.shapes.push({ type: "rectangle", w: (S.r || 0), h: (S.r || 0), });
    }

    wall.rotation = S.rot || 0;
    wall.deleter = !S.bouncy;
    wall.create();

    mapmaker.shapes.push(wall);
  }
}

mapmaker.remove = function(shape_index) {
  mapmaker.shapes[shape_index].remove();
  // remove from the shapes list too
  const index = mapmaker.shapes.indexOf(this);
  if (index != null && index > -1) {
    mapmaker.shapes.splice(index, 1);
  }
}

mapmaker.check_outside_map = function(position) {
  const w = mapmaker.width, h = mapmaker.height;
  const b = border_wall_thickness;
  const x = position.x, y = position.y;
  return x > w - b || x < b - w || y > h - b || y < b - h;
}