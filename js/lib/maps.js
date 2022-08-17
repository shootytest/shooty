
export const maps = { };

maps.empty = {
  name: "Empty Map",
  width: 300,
  height: 300,
  shapes: [
  ],
  zones: [
    { x: -300, y: -300, w: 600, h: 600, },
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
    { x: -400, y: -400, w: 800, h: 800, },
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
    { x: -450, y: -450, w: 900, h: 900, },
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
    { x: -500, y: -500, w: 1000, h: 1000, },
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
    { x: -500, y: -500, w: 1000, h: 1000, },
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