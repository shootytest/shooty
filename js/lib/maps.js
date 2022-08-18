
export const maps = { };

maps.empty = {
  name: "Empty Map",
  width: 300,
  height: 300,
  shapes: [
  ],
  zones: [
    { x: -280, y: -280, w: 560, h: 560, },
  ],
}

maps.tutorial = {
  name: "Tutorial Map",
  width: 400,
  height: 400,
  spawn: [
    { x: 0, y: 0, },
  ],
  shapes: [
    { type: "circle", x: 0.1, y: 0.6, r: 50, },
    { type: "circle", x: -0.3, y: -0.1, r: 40, },
    { type: "circle", x: 0.8, y: -0.7, r: 30, },
  ],
  zones: [
    { x: -380, y: -380, w: 760, h: 760, },
  ],
}

maps.level0 = {
  name: "Level 0",
  width: 450,
  height: 450,
  spawn: [
    { x: -300, y: -300, },
    { x: -300, y: 300, },
    { x: 300, y: -300, },
    { x: 300, y: 300, },
  ],
  shapes: [
    { type: "circle", bouncy: false, x: 0, y: 0, r: 75, },
  ],
  zones: [
    { x: -430, y: -430, w: 860, h: 860, },
  ],
}

maps.level1 = {
  name: "Level 1",
  width: 500,
  height: 500,
  spawn: [
    { x: 0, y: 0, },
  ],
  shapes: [
    { type: "rectangle", bouncy: false, x: -0, y: -0.4, w: 75, h: 80, },
    { type: "rectangle", bouncy: false, x: -0.6, y: 0.4, w: 20, h: 120, },
    { type: "rectangle", bouncy: false, x: 0.7, y: 0.5, w: 40, h: 30, },
  ],
  zones: [
    { x: -430, y: -430, w: 860, h: 860, },
  ],
}

maps.bouncycircles = {
  name: "Bouncy Circles (4)",
  width: 500,
  height: 500,
  spawn: [
    { x: -300, y: -300, },
    { x: -300, y: 300, },
    { x: 300, y: -300, },
    { x: 300, y: 300, },
  ],
  shapes: [
    { type: "circle", bouncy: true, playerblock: true, x: 0.5, y: 0.5, r: 40, },
    { type: "circle", bouncy: true, x: 0.5, y: -0.5, r: 40, },
    { type: "circle", bouncy: true, x: -0.5, y: 0.5, r: 40, },
    { type: "circle", bouncy: true, x: -0.5, y: -0.5, r: 40, },
  ],
  zones: [
    { x: -480, y: -480, w: 960, h: 960, },
  ],
}

maps.multiplayer = {
  name: "Unnamed Map",
  width: 500,
  height: 500,
  spawn: [
    { x: -300, y: -300, },
    { x: -300, y: 300, },
    { x: 300, y: -300, },
    { x: 300, y: 300, },
  ],
  shapes: [
    { type: "circle", bouncy: false, x: 0.7, y: 0.7, r: 30, },
    { type: "circle", bouncy: false, x: 0.7, y: -0.7, r: 30, },
    { type: "circle", bouncy: false, x: -0.7, y: 0.7, r: 30, },
    { type: "circle", bouncy: false, x: -0.7, y: -0.7, r: 30, },
    { type: "rectangle", bouncy: false, x: -0.55, y: 0, w: 30, h: 150, },
    { type: "rectangle", bouncy: false, x: 0.55, y: 0, w: 30, h: 150, },
    { type: "rectangle", bouncy: false, x: 0, y: -0.55, w: 150, h: 30, },
    { type: "rectangle", bouncy: false, x: 0, y: 0.55, w: 150, h: 30, },
  ],
  zones: [
    { x: -480, y: -480, w: 960, h: 960, },
  ],
}

maps.squaredonut = {
  name: "Square Donut",
  width: 600,
  height: 600,
  spawn: [
    { x: -500, y: -500, },
    { x: -500, y: 500, },
    { x: 500, y: -500, },
    { x: 500, y: 500, },
  ],
  shapes: [
    { type: "square", bouncy: false, x: 0, y: 0, r: 400, },
  ],
  zones: [
    { x: -600, y: -600, w: 1200, h: 200, },
    { x: -600, y: -600, w: 200, h: 1200, },
    { x: -600, y: 400, w: 1200, h: 200, },
    { x: 400, y: -600, w: 200, h: 1200, },
  ],
}

maps.updown = {
  name: "Up Down",
  width: 600,
  height: 600,
  spawn: [
    { x: 0, y: 0, },
  ],
  shapes: [
    { type: "rectangle", playerblock: true, x: -0.1, y: 0, w: 30, h: 599, },
    { type: "rectangle", playerblock: true, x: 0.1, y: 0, w: 30, h: 599, },
  ],
  zones: [
    { x: -600, y: -600, w: 555, h: 1200, },
    { x: 45, y: -600, w: 555, h: 1200, },
  ],
}