
export const worlds = { };

worlds.zero = {
  name: "World Zero",
  // background_: "#007c8a",
  levels: {
    tutorial: {
      key: "tutorial",
      char: "T",
      x: 0,
      y: 0,
      lines: [
        { key: "level0", },
      ],
    },
    level0: {
      key: "level0",
      char: "0",
      x: 200,
      y: -50,
    },
  },
  background: "#000000",
  sidebar: "#fca2a2",
  colors: [
    { x: 0, y: 0, c: "#a2ddfc", r: 500, },
    { x: -750, y: 750, c: "#a2f3fc", r: 500, },
    { x: -1750, y: -1750, c: "#a2fce6", r: 500, },
  ],
};

worlds.test = {
  name: "Test",
  // background_: "#00338a",
  levels: {
    oneround: {
      key: "oneround",
      char: "1r",
      x: 0,
      y: 0,
      lines: [
        { key: "tutorialold", },
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
    },
    blank: {
      key: "blank",
      char: " ",
      x: -300,
      y: 400,
    },
  },
  background: "#000000",
  sidebar: "#fca2a2",
  colors: [
    { x: 0, y: 0, c: "#a2ddfc", r: 500, },
    { x: -300, y: 350, c: "#cc12aa", r: 100, },
    { x: -750, y: 750, c: "#a2f3fc", r: 500, },
    { x: -1750, y: -1750, c: "#a2fce6", r: 500, },
  ],
};