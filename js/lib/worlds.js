import { math_util } from "../util/math.js";

export const worlds = { };

export const world_list = [
  "zero", "test",
];

worlds.zero = {
  name: "Zero",
  levels: {
    tutorial: {
      key: "tutorial",
      char: "T",
      x: 0,
      y: 0,
      lines: [
        { key: "level0", },
        { key: "tutorialplus", },
        { key: "tutorialstar", },
      ],
      conditions: [],
    },
    tutorialplus: {
      key: "tutorialplus",
      char: "T+",
      x: -150,
      y: -50,
      lines: [],
      conditions: [
        { type: "level", level: "tutorial", rating: 2, },
      ],
    },
    tutorialstar: {
      key: "tutorialstar",
      char: "T★",
      x: -300,
      y: 100,
      lines: [],
      conditions: [
        { type: "level", level: "tutorial", rating: 0, },
      ],
    },
    level0: {
      key: "level0",
      char: "0",
      x: 200,
      y: -50,
      lines: [
        { key: "level1", },
      ],
      conditions: [
        { type: "level", level: "tutorial", rating: 9, },
        { type: "level", level: "tutorial", rounds: 6, },
      ],
    },
    level1: {
      key: "level1",
      char: "1",
      x: 350,
      y: -50,
      lines: [],
      conditions: [
        { type: "level", level: "level0", rating: 7, },
        { type: "level", level: "level0", rounds: 8, },
      ],
    },
  },
  background: "#05000d",
  // sidebar: "#fca2a2",
  sidebar: "#3c009c",
  text: "#ffffff",
  shapes: [
    { // 0
      x: 0, y: 0,
      vx: 5, vy: 5,
      size: 50,
    },
  ],
};

worlds.test = {
  name: "Test",
  levels: {
    oneround: {
      key: "oneround",
      char: "1r",
      x: 0,
      y: 0,
      lines: [
        { key: "tutorialold", },
        { key: "tworounds", },
      ],
      conditions: [],
    },
    tworounds: {
      key: "tworounds",
      char: "2r",
      x: 150,
      y: 50,
      lines: [
        { key: "threerounds", },
        { key: "susrounds", },
      ],
      conditions: [
        { type: "level", level: "oneround", rating: 7, },
      ],
    },
    threerounds: {
      key: "threerounds",
      char: "3r",
      x: 300,
      y: -50,
      lines: [
        { key: "level0test", },
        { key: "fourrounds", },
      ],
      conditions: [
        { type: "level", level: "tworounds", rating: 9, },
      ],
    },
    fourrounds: {
      key: "fourrounds",
      char: "4r",
      x: 550,
      y: -30,
      conditions: [
        { type: "level", level: "threerounds", rating: 8, },
      ],
    },
    susrounds: {
      key: "susrounds",
      char: "ඞ",
      x: 250,
      y: 400,
      conditions: [
        { type: "level", level: "tworounds", rating: 5, },
      ],
    },
    level0test: {
      key: "level0test",
      char: "0t",
      x: 300,
      y: -300,
      lines: [],
      conditions: [
        { type: "level", level: "threerounds", rating: 6, },
      ],
    },
    tutorialold: {
      key: "tutorialold",
      char: "t",
      x: -300,
      y: 300,
      lines: [
        { key: "blank", },
      ],
      conditions: [
        { type: "level", level: "oneround", use: "basic", rating: 1, },
      ],
    },
    blank: {
      key: "blank",
      char: " ",
      x: -300,
      y: 400,
      conditions: [
        { type: "level", level: "tutorialold", rating: 7, },
        { type: "level", level: "tutorialold", rounds: 9, },
      ],
    },
  },
  background: "#1f1e33", // "#201924",
  sidebar: "#494587", // "#643d7a",
  text: "#ffffff",
  shapes: [
    ...shapes_lerp(
      {
        x: 0, y: 0,
        vx: 9, vy: -9, // moves to x: 300, y: -300
        size: 50, sides: 0,
        depth: 1.2,
      },
      { depth: 0.4, },
      9,
    ),
    ...shapes_lerp(
      { x: 0, y: 0,
        depth: 5, size: 1000, sides: 5,
        rotation: 0, rotvelocity: 0.4,
        fill: "#CCCCCC10",
      },
      { depth: 4, size: 300, rotvelocity: 1, },
      6,
    ),
  ],
};

function shapes_lerp(s1, s2, n) {
  const lerp_keys = [ ];
  for (let k in s2) {
    if (!s1.hasOwnProperty(k) || typeof s1[k] != "number" || typeof s2[k] != "number") continue;
    lerp_keys.push(k);
  }
  const result = [ ];
  for (let i = 0; i < n; i++) {
    const ratio = i / (n - 1);
    const s = { };
    for (const k in s1) {
      s[k] = s1[k];
    }
    for (const k of lerp_keys) {
      s[k] = math_util.lerp(s1[k], s2[k], ratio);
    }
    result.push(s);
  }
  return result;
}