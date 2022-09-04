

/*

upgrade rating:
upgrades.key = {
  key: key (internal, it has to be the same as the key used above)
  name: upgrade name, will show up in all menus
  desc: upgrade description (can be long)
  cost: the cost of the upgrade (in coins)
  connections: ["key1", "key2", "key3"], // keys of other upgrades it connects to
  x: the x position of the upgrade tile
  y: the y position of the upgrade tile
};

*/

export const upgrades = {};

upgrades.basic = {
  key: "basic",
  name: "Basic",
  desc: "No, you probably can't buy this.",
  cost: 0, // um
  connections: ["basic", "triple", "burst2", "scatter1", "placer", "sniper", "big", "auto"],
  x: 0,
  y: 0,
};

upgrades.triple = {
  key: "triple",
  name: "Triple",
  desc: "Leafy arboreal structures.",
  cost: 333,
  connections: ["penta", "oct"],
  x: 2,
  y: 0,
};

upgrades.penta = {
  key: "penta",
  name: "Penta",
  desc: "Shouldn't it be called quintuple?", // TODO: quintuple -> penta -> pentagon
  cost: 999,
  connections: ["lobster"],
  x: 5,
  y: 0,
};

upgrades.oct = {
  key: "oct",
  name: "Octopus",
  desc: "Bullets, not legs.",
  cost: 888,
  connections: ["jellyfish"],
  x: 4,
  y: 2,
};

upgrades.lobster = {
  key: "lobster",
  name: "Lobster",
  desc: "10 legs!",
  cost: 1555,
  connections: [],
  x: 7,
  y: 0,
};

upgrades.jellyfish = {
  key: "jellyfish",
  name: "Jellyfish",
  desc: "Legs, not bullets.",
  cost: 999,
  connections: [],
  x: 6,
  y: 2,
};

upgrades.burst2 = {
  key: "burst2",
  name: "Burst 2",
  desc: "--   --   --",
  cost: 300,
  connections: ["burst3", "burst10", "liner"],
  x: 0,
  y: -2,
};

upgrades.burst3 = {
  key: "burst3",
  name: "Burst 3",
  cost: 650,
  desc: "---    ---.   ---",
  connections: [],
  x: 1,
  y: -4,
};

upgrades.burst10 = {
  key: "burst10",
  name: "Burst 10",
  cost: 1000,
  desc: "From 2 2 10?",
  connections: ["spammer", "burster"],
  connections_faded: ["spammer"],
  x: -1,
  y: -4,
};

upgrades.burster = {
  key: "burster",
  name: "Burstttt",
  cost: 1500,
  desc: "½ of the time!",
  connections: [],
  x: -2,
  y: -6,
};

upgrades.scatter1 = {
  key: "scatter1",
  name: "Scatter",
  desc: "Squares are yummy! (why)",
  cost: 400,
  connections: ["scatterspam", "squarer", "shotgun", "sniperscatter"],
  x: -2,
  y: 0,
};

upgrades.scatter2 = {
  key: "scatter2",
  name: "Scatter+",
  desc: "More squares?",
  cost: 800,
  connections: [ ], // TODO: "scatterspam", "spammer"
  x: -4,
  y: 1,
};

upgrades.scatterspam = {
  key: "scatterspam",
  name: "Scatter (more)",
  desc: ".......",
  cost: 950,
  connections: ["spammer"],
  x: -4,
  y: -1,
};

upgrades.spammer = {
  key: "spammer",
  name: "Spammer",
  desc: "Not yet",
  cost: 1400,
  connections: [],
  x: -6,
  y: -2,
};

upgrades.flamethrower = {
  key: "flamethrower",
  name: "Flamethrower",
  desc: "Temporary thingy. Not yet.",
  cost: 1400,
  connections: [],
  x: -9,
  y: -3,
};

upgrades.squarer = {
  key: "squarer",
  name: "Squarer",
  desc: "□",
  cost: 1000,
  connections: ["square"],
  x: -6,
  y: 0,
};

upgrades.square = {
  key: "square",
  name: "Square",
  desc: "■",
  cost: 2000,
  connections: [],
  x: -8,
  y: 0,
};

upgrades.shotgun = {
  key: "shotgun",
  name: "Shotgun",
  desc: "Pew pew.",
  cost: 1250,
  connections: ["shootgun"],
  x: -4,
  y: 1,
};

upgrades.shootgun = {
  key: "shootgun",
  name: "Shootgun",
  desc: "Pew pew pew.",
  cost: 2250,
  connections: [],
  x: -6,
  y: 2,
};

upgrades.auto = {
  key: "auto",
  name: "Auto",
  desc: "Shoots automatically.",
  cost: 300,
  connections: ["autooo"],
  x: -2,
  y: -2,
};

upgrades.autooo = {
  key: "autooo",
  name: "Autooo",
  desc: "Shooots autooomatically.",
  cost: 750,
  connections: [],
  x: -4,
  y: -4,
};

upgrades.sniper = {
  key: "sniper",
  name: "Sniper",
  desc: "-     -     -",
  cost: 400,
  connections: ["sniperscatter", "sniperauto", "fastersniper", "strongersniper"],
  x: 0,
  y: 2,
};

upgrades.fastersniper = {
  key: "fastersniper",
  name: "Sniper (faster)",
  desc: "-   -   -   -",
  cost: 800,
  connections: [],
  x: 1,
  y: 5,
};

upgrades.strongersniper = {
  key: "strongersniper",
  name: "Sniper (stronger)",
  desc: "=     =     =",
  cost: 750,
  connections: [],
  x: -1,
  y: 5,
};

upgrades.sniperauto = {
  key: "sniperauto",
  name: "Sniper + Auto",
  desc: "triangle + circle",
  cost: 900,
  connections: [],
  x: -3,
  y: 5,
};

upgrades.sniperscatter = {
  key: "sniperscatter",
  name: "Sniper + Scatter",
  desc: "triangle + square",
  cost: 1000,
  connections: [],
  x: -3,
  y: 3,
};

upgrades.big = {
  key: "big",
  name: "Big",
  desc: "BIG",
  cost: 400,
  connections: ["launcher", "stacker", "large"],
  x: 2,
  y: -2,
};

upgrades.large = {
  key: "large",
  name: "Large",
  desc: "LARGE",
  cost: 600,
  connections: ["toolarge"],
  x: 6,
  y: -3,
};

upgrades.toolarge = {
  key: "toolarge",
  name: "Too Large",
  desc: "why does this exist",
  cost: 1200,
  connections: [],
  x: 8,
  y: -3,
};

upgrades.stacker = {
  key: "stacker",
  name: "Stacker",
  desc: "Stacks big and small bullets.",
  cost: 700,
  connections: [],
  x: 4,
  y: -5,
};

upgrades.launcher = {
  key: "launcher",
  name: "Launcher",
  desc: "Launches stuff.",
  cost: 800,
  connections: ["bigauto"],
  x: 5,
  y: -4,
};


upgrades.bigauto = {
  key: "bigauto",
  name: "Big Auto",
  desc: "Wow!",
  cost: 1350,
  connections: [],
  x: 7,
  y: -5,
};


upgrades.liner = {
  key: "liner",
  name: "Liner",
  desc: "Actually called a line segment.",
  cost: 1111,
  connections: ["planer", "liner2"],
  x: 0,
  y: -6,
};

upgrades.liner2 = {
  key: "liner2",
  name: "Liner 2",
  desc: "Why? Please replace this name.",
  cost: 1400,
  connections: [],
  x: -2,
  y: -8,
};

upgrades.planer = {
  key: "planer",
  name: "Planer",
  desc: "Doesn't fly, unfortunately.",
  cost: 1800,
  connections: [],
  x: -0,
  y: -8,
};

upgrades.placer = {
  key: "placer",
  name: "Placer",
  desc: "Places auto-targeting bullets.",
  cost: 500,
  connections: ["rammer", "placerbig"],
  x: 2,
  y: 2,
};

upgrades.placerbig = {
  key: "placerbig",
  name: "Placer+",
  desc: "Places auto-targeting towers.",
  cost: 1100,
  connections: [],
  x: 3,
  y: 5,
};

upgrades.rammer = {
  key: "rammer",
  name: "Rammer",
  desc: "Nothing to do with random-access memory.",
  cost: 750,
  connections: [],
  x: 5,
  y: 5,
};