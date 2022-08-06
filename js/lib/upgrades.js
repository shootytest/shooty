

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
  cost: 555,
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
  cost: 1000,
  connections: [],
  x: 7,
  y: 0,
};

upgrades.jellyfish = {
  key: "jellyfish",
  name: "Jellyfish",
  desc: "Legs, not bullets.",
  cost: 1357,
  connections: [],
  x: 6,
  y: 2,
};

upgrades.burst2 = {
  key: "burst2",
  name: "Burst 2",
  desc: "The enemies burst?",
  cost: 300,
  connections: ["burst3", "burst10", "liner"],
  x: 0,
  y: -2,
};

upgrades.burst3 = {
  key: "burst3",
  name: "Burst 3",
  cost: 500,
  desc: "Wow, what an innovative name!",
  connections: [],
  x: 1,
  y: -4,
};

upgrades.burst10 = {
  key: "burst10",
  name: "Burst 10",
  cost: 500,
  desc: "From 2 2 10?",
  connections: ["flamethrower", "burster"],
  connections_faded: ["flamethrower"],
  x: -1,
  y: -4,
};

upgrades.burster = {
  key: "burster",
  name: "Burstttt",
  cost: 1000,
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
  connections: ["scatter2", "scatterspam", "squarer", "shotgun"],
  x: -2,
  y: 0,
};

upgrades.scatter2 = {
  key: "scatter2",
  name: "Scattererer",
  desc: "More squares?",
  cost: 650,
  connections: [ ], // TODO: "scatterspam", "flamethrower"
  x: -4,
  y: 1,
};

upgrades.scatterspam = {
  key: "scatterspam",
  name: "Spammer",
  desc: "Scatter scatter scatter scatter scatter scatter scatter.",
  cost: 800,
  connections: ["flamethrower"],
  x: -4,
  y: -1,
};

upgrades.flamethrower = {
  key: "flamethrower",
  name: "Flamethrower",
  desc: "Real flames this time.",
  cost: 1999,
  connections: [],
  x: -6,
  y: -2,
};

upgrades.squarer = {
  key: "squarer",
  name: "Squarer",
  desc: "□",
  cost: 500,
  connections: ["square"],
  x: -6,
  y: 0,
};

upgrades.square = {
  key: "square",
  name: "Square",
  desc: "■",
  cost: 1000,
  connections: [],
  x: -8,
  y: 0,
};

upgrades.shotgun = {
  key: "shotgun",
  name: "Shotgun",
  desc: "Pew pew.",
  cost: 850,
  connections: ["shootgun"],
  x: -4,
  y: 3,
};

upgrades.shootgun = {
  key: "shootgun",
  name: "Shootgun",
  desc: "Pew pew pew.",
  cost: 1350,
  connections: [],
  x: -6,
  y: 4,
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
  cost: 600,
  connections: [],
  x: -4,
  y: -4,
};

upgrades.sniper = {
  key: "sniper",
  name: "Sniper",
  desc: "Hello!",
  cost: 600,
  connections: ["sniperscatter", "sniperauto"],
  x: 0,
  y: 2,
};

upgrades.sniperauto = {
  key: "sniperauto",
  name: "Sniper + Auto",
  desc: "triangle + circle",
  cost: 500,
  connections: [],
  x: -2,
  y: 5,
};

upgrades.sniperscatter = {
  key: "sniperscatter",
  name: "Sniper + Scatter",
  desc: "triangle + square",
  cost: 700,
  connections: [],
  x: -4,
  y: 5,
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
  cost: 500,
  connections: ["toolarge"],
  x: 6,
  y: -3,
};

upgrades.toolarge = {
  key: "toolarge",
  name: "Too Large",
  desc: "why does this exist",
  cost: 725,
  connections: [],
  x: 8,
  y: -3,
};

upgrades.stacker = {
  key: "stacker",
  name: "Stacker",
  desc: "Stacks big and small bullets.",
  cost: 680,
  connections: [],
  x: 4,
  y: -5,
};

upgrades.launcher = {
  key: "launcher",
  name: "Launcher",
  desc: "Launches stuff.",
  cost: 750,
  connections: [],
  x: 5,
  y: -4,
};

/*
upgrades.bigauto = {
  key: "bigauto",
  name: "Big Auto",
  desc: "What?",
  cost: 1000,
  connections: [],
  x: 5,
  y: -4,
};
*/

upgrades.liner = {
  key: "liner",
  name: "Liner",
  desc: "Actually called a line segment.",
  cost: 1000,
  connections: ["planer", "liner2"],
  x: 0,
  y: -6,
};

upgrades.liner2 = {
  key: "liner2",
  name: "Liner 2",
  desc: "Why? Please replace this name.",
  cost: 800,
  connections: [],
  x: -2,
  y: -8,
};

upgrades.planer = {
  key: "planer",
  name: "Planer",
  desc: "Doesn't fly, unfortunately.",
  cost: 1000,
  connections: [],
  x: -0,
  y: -8,
};

upgrades.placer = {
  key: "placer",
  name: "Placer",
  desc: "Places auto-targeting bullets.",
  cost: 555,
  connections: ["rammer", "placerbig"],
  x: 2,
  y: 2,
};

upgrades.placerbig = {
  key: "placerbig",
  name: "Placer+",
  desc: "Places auto-targeting towers.",
  cost: 900,
  connections: [],
  x: 2,
  y: 5,
};

upgrades.rammer = {
  key: "rammer",
  name: "Rammer",
  desc: "Nothing to do with random-access memory.",
  cost: 500,
  connections: [],
  x: 4,
  y: 5,
};