import { C } from "./color.js";

export const waves_info = {};
export const waves = {};
export const waves_text = {};
export const waves_points = {};

export const wave_ratings = [
// there are 11 main ratings from 1 to 11
// ratings 0 and 12 are exactly 100% and 0% respectively (special ratings)
// 0     1    2     3     4    5     6     7    8     9    10   11    X
  "★", "S+", "S", "S-", "A+", "A", "A-", "B+", "B", "B-", "C", "D", "✖",
];
export const wave_ratings_colors = [
  // stars
  "#ffc987", "#ffda6b", "#ffd61f", "#c9cf0f", 
  // a
  "#7fc123", "#56b830", "#00b28e",
  // b
  "#00a0c9", "#0085cc", "#006bf7",
  // cdx
  "#6924ff", "#7900bf", "#e8005d",
];

// tutorial

if ("tutorial") {

  waves_info.tutorial = {
    name: "Tutorial",
    key: "tutorial",
    description: "Hopefully not too hard.",
    map: "tutorial",
    bosses: 1,
    rounds: 10,
  };

  waves.tutorial = [
    0,
    { type: "basic", number: 1, },
    { type: "basic", number: 2, interval: 300, },
    { type: "basic", number: 3, interval: 240, },
    { type: "basic", number: 3, interval: 10, },
    { type: "slow", number: 1, },
    { type: "ram", number: 1, },
    { type: "ram", number: 3, interval: 10, },
    [ // 8
      { type: "basic", number: 1, },
      { type: "slow", number: 1, },
      { type: "ram", number: 1, },
    ],
    { type: "basic", number: 6, interval: 30, },
    { type: "boss_tutorial", number: 1, boss: true, },
  ];

  waves_text.tutorial = {
    [0]: [
      { message: "Welcome to the tutorial!", delay: 0, color: C.message_text_tutorial, },
      { message: "Use the arrow keys to move and click to shoot.", delay: 10, color: C.message_text_tutorial, },
      { message: "When you are ready, press q to start the first round!", delay: 20, color: C.message_text_tutorial, },
    ],
    [1]: [
      { message: "This basic enemy is incapable of movement and shoots rather slowly.", delay: 0, },
      { message: "Your aim is to shoot at it while dodging its bullets.", delay: 10, },
      { message: "Good luck!", delay: 20, },
      { message: "Good work! You can start the next round now.", delay: 0, after: true, },
      { message: "Press q when you are ready!", delay: 10, after: true, },
    ],
    [2]: [
      { message: "Two enemies for round two!", delay: 0, },
      { message: "Only one of them will show up for now.", delay: 10, },
      { message: "The second enemy is coming soon...", delay: 200, },
    ],
    [3]: [
      { message: "Three enemies for round three!", delay: 0, },
      { message: "They will spawn faster now.", delay: 10, },
      { message: "And... the final enemy!", delay: 475, },
    ],
    [4]: [
      { message: "Three enemies, but all at once!", delay: 0, },
      { message: "Walls can be used as cover. Enemies won't shoot if they can't see you!", delay: 10, },
    ],
    [5]: [
      { message: "There are different types of enemies.", delay: 0, },
      { message: "This one in particular is very much like a basic enemy.", delay: 10, },
      { message: "It slowly shoots large, heavy bullets that hit hard!", delay: 20, },
    ],
    [6]: [
      { message: "This new enemy doesn't shoot, but tries to hit you using its body!", delay: 0, },
      { message: "When it is charging, its eyes will glow purple.", delay: 0, },
      { message: "No bullets to dodge this round!", delay: 10, },
    ],
    [7]: [
    ],
    [8]: [
      { message: "Three enemies of different types!", delay: 0, },
      { message: "If you get hit and lose health, you will only be able to regenerate it after a while.", delay: 10, },
    ],
    [9]: [
      { message: "Many weak enemies sent at once may pose a challenge too!", delay: 0, },
      { message: "There is a boss in the next round! Get ready!", delay: 0, after: true, },
    ],
    [10]: [
      { message: "The bullets that this boss shoots grow slowly and can't travel far.", delay: 0, },
      { message: "Ok why are you still fighting this boss you should be done after one minute...", delay: 3600, },
      { message: "Well done!", delay: 0, after: true, },
    ],
  };

  waves_points.tutorial = {
    points: [ 0, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5, ],
    // time: [ 0, 10, 20, 30, 25, 15, 10, 25, 40, 60, 20, ],
    time: [ 0, 5, 10, 15, 15, 10, 5, 13, 20, 30, 10, ],
    ratings: [ 1, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0 ],
  };

}

if ("tutorialplus") {

  waves_info.tutorialplus = {
    name: "Tutorial+",
    key: "tutorialplus",
    description: "Hopefully harder than the tutorial.",
    map: "tutorial",
    bosses: 1,
    rounds: 10,
  };

  waves.tutorialplus = [
    0,
    { type: "basic", number: 1, },
    { type: "basic", number: 3, interval: 60, },
    { type: "basic", number: 5, interval: 40, },
    { type: "basic", number: 6, interval: 30, },
    { type: "slow", number: 3, interval: 30, },
    { type: "ram", number: 3, interval: 50, },
    { type: "ramshoot", number: 5, interval: 60, },
    [ // 8
      { type: "basic", number: 2, },
      { type: "slow", number: 2, },
      { type: "ram", number: 2, },
    ],
    { type: "basic", number: 10, interval: 0, },
    { type: "boss_tutorial", number: 2, boss: true, },
  ];

  waves_text.tutorialplus = {
    [0]: [
      { message: "Welcome to the tutorial (again)!", delay: 0, color: C.message_text_tutorial, },
    ],
    [10]: [
      { message: "Well done (again)!", delay: 0, after: true, },
    ],
  };

  waves_points.tutorialplus = {
    points: [ 0, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5, ],
    time: [ 0, 5, 20, 30, 30, 30, 15, 36, 40, 60, 30, ],
    ratings: [ 1, 0.95, 0.9, 0.8, 0.65, 0.55, 0.45, 0.3, 0.2, 0.1, 0.05, 0 ],
  };

}

if ("tutorialstar") {

  waves_info.tutorialstar = {
    name: "Tutorial ★",
    key: "tutorialstar",
    description: "★★★",
    map: "tutorial",
    bosses: 1,
    rounds: 10,
    disallow_upgrades: ["auto", "autooo", "placer", "placerbig", "rammer", "bigauto"],
    moveshoot_flipped: true,
  };

  waves.tutorialstar = [
    0,
    { type: "basic", number: 1, },
    { type: "basic", number: 2, interval: 300, },
    { type: "basic", number: 3, interval: 240, },
    { type: "basic", number: 3, interval: 10, },
    { type: "slow", number: 1, },
    { type: "ram", number: 1, },
    { type: "ram", number: 3, interval: 10, },
    [ // 8
      { type: "basic", number: 1, },
      { type: "slow", number: 1, },
      { type: "ram", number: 1, },
    ],
    { type: "basic", number: 6, interval: 30, },
    { type: "boss_tutorial", number: 1, boss: true, },
  ];

  waves_text.tutorialstar = {
    [0]: [
      { message: "Welcome to the tutorial!", delay: 0, color: C.message_text_tutorial, },
      { message: "Use the arrow keys to shoot and click to move.", delay: 10, color: C.message_text_tutorial, },
      { message: "There's nothing suspicious with the above text!", delay: 20, color: C.message_text_tutorial, },
    ],
    [1]: [
      { message: "Why is this happening?", delay: 0, },
      { message: "Good luck!", delay: 20, },
    ],
    [10]: [
      { message: "The final round...", delay: 0, },
      { message: "Well done! ★★★", delay: 0, after: true, },
    ],
  };

  waves_points.tutorialstar = {
    points: [ 0, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5, ],
    time: [ 0, 5, 10, 15, 15, 10, 5, 13, 20, 30, 10, ],
    ratings: [ 1, 0.9, 0.8, 0.7, 0.5, 0.35, 0.25, 0.15, 0.1, 0.05, 0.025, 0 ],
  };

}

if ("level0") {

  waves_info.level0 = {
    name: "Level 0",
    key: "level0",
    description: "NOT Level 1",
    map: "level0",
    bosses: 1,
    rounds: 10,
  };

  waves.level0 = [
    0,
    { type: "basic", number: 2, interval: 150, },
    { type: "basic_double", number: 2, interval: 200, },
    [ // 3
      { type: "basic", number: 2, interval: 120, },
      { type: "basic_triple", number: 1, interval: 0, },
    ],
    [ // 4
      { type: "ram", number: 2, interval: 120, },
      { type: "basic_double", number: 1, delay: 60, },
    ],
    { type: "basic_quintuple", number: 1, interval: 120, },
    [ // 6
      { type: "basic", number: 1, },
      { type: "basic_hexagon", number: 1, delay: 120, },
    ],
    { type: "basic_double", number: 4, interval: 150, },
    { type: "basic_triple", number: 3, interval: 180, },
    { type: "basic_hexagon", number: 3, interval: 200, },
    { type: "boss_basic", number: 1, boss: true, mapshape: 0, },
  ];

  waves_text.level0 = {
    [0]: [
      { message: "This is Level 0!", delay: 0, },
      { message: "Level numbers are 0-indexed, because...", delay: 60, },
      { message: "um...", delay: 100, },
      { message: "Never mind.", delay: 140, },
    ],
    [1]: [
      { message: "Just some tutorial-like stuff.", delay: 0, },
    ],
    [2]: [
      { message: "A new enemy, already?", delay: 0, },
    ],
    [10]: [
      { message: "The wall...", delay: 0, },
      { message: "!", delay: 15, },
    ],
  };

  waves_points.level0 = {
    points: [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, ],
    time: [ 0, 12, 19, 25, 16, 13, 19, 27, 31, 33, 28, ],
    ratings: [ 1, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.35, 0.2, 0.1, 0.05, 0 ],
  };
}

if ("level1") {

  waves_info.level1 = {
    name: "Level 1",
    key: "level1",
    description: "NOT Level 0",
    map: "level1",
    bosses: 1,
    rounds: 10,
  };

  waves.level1 = [
    0,
    { type: "double", number: 2, interval: 60, },
    { type: "triple", number: 2, interval: 80, },
    [ // 3
      { type: "basic", number: 2, interval: 40, },
      { type: "double", number: 2, delay: 20, interval: 40, },
    ],
    { type: "quadruple", number: 2, interval: 80, },
    [ // 5
      { type: "double", number: 2, interval: 0, },
      { type: "triple", number: 1, interval: 0, },
    ],
    { type: "quintuple", number: 2, interval: 100, },
    [ // 7
      { type: "double", number: 1, delay: 30 },
      { type: "triple", number: 1, delay: 60, },
      { type: "quadruple", number: 2, interval: 90, },
    ],
    { type: "octring", number: 2, interval: 120, },
    [ // 9
      { type: "basic", number: 1, },
      { type: "double", number: 1, },
      { type: "triple", number: 1, },
      { type: "quadruple", number: 1, },
      { type: "quintuple", number: 1, },
    ],
    { type: "boss_decring", number: 1, boss: true, },
    /*
    { type: "plane3", number: 3, },
    { type: "line2", number: 3, },
    [ // 13
      { type: "plane3", number: 3, delay: 60, interval: 120, },
      { type: "basic_triple", number: 1, delay: 120, },
      { type: "triple", number: 1, },
    ],
    { type: "line_satellite", number: 2, },
    { type: "boss_line", number: 1, boss: true, },
    */
  ];

  waves_text.level1 = {
    [0]: [
      { message: "This is Level 1!", delay: 0, },
      { message: "Level numbers are 1-indexed!", delay: 20, },
      { message: "No they aren't.", delay: 50, },
    ],
    [6]: [
      { message: "Flowers?", delay: 0, },
    ],
    [8]: [
      { message: "........", delay: 0, },
    ],
    [9]: [
      { message: "12345!", delay: 0, },
    ],
  };

  waves_points.level1 = {
    points: [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5, ],
    time: [ 0, 10, 11, 20, 12, 20, 15, 22, 18, 35, 45, ],
    ratings: [ 1, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.35, 0.2, 0.1, 0.05, 0 ],
  };
}

// old/unused/useless/ridiculous/testing stuff (put these in the "Test" world)

if ("level0test") {
  waves_info.level0test = {
    name: "Unnamed Level",
    key: "level0test",
    description: "Well... it has a name, doesn't it?",
    map: "multiplayer",
    bosses: 2,
    rounds: 20,
  };

  waves.level0test = [
    0,
    { type: "basic", number: 2, interval: 180, },
    { type: "basic", number: 5, interval: 200, },
    { type: "slow", number: 2, interval: 180, },
    { type: "ram", number: 3, interval: 100, },
    [ // 5
      { type: "ram", number: 3, interval: 100, },
      { type: "basic", number: 1, },
    ],
    [ // 6
      { type: "basic", number: 2, interval: 200, },
      { type: "slow", number: 2, delay: 100, interval: 200, },
    ],
    { type: "strong", number: 2, },
    [ // 8
      { type: "basic", number: 4, interval: 150, },
      { type: "ram", number: 4, delay: 75, interval: 150, },
    ],
    { type: "fast", number: 3, interval: 160, },
    { type: "boss_tutorial_2", number: 1, boss: true, },
    { type: "basic", number: 10, interval: 60, },
    [ // 12
      { type: "basic", number: 3, interval: 500, },
      { type: "ram", number: 3, delay: 125, interval: 500, },
      { type: "slow", number: 3, delay: 250, interval: 500, },
      { type: "fast", number: 3, delay: 375, interval: 500, },
    ],
    [ // 13
      { type: "homing", number: 5, interval: 600, },
      { type: "basic", number: 5, delay: 300, interval: 600, },
    ],
    [ // 14
      { type: "ramshoot", number: 5, interval: 350, },
      { type: "ram", number: 5, delay: 175, interval: 350, },
    ],
    [ // 15
      { type: "strong", number: 6, interval: 250, },
      { type: "fast", number: 6, delay: 125, interval: 250, },
    ],
    [ // 16
      { type: "homing", number: 5, interval: 50, },
      { type: "slow", number: 2, delay: 300, interval: 200, },
    ],
    { type: "boss_tutorial", number: 3, interval: 400, },
    [ // 18
      { type: "oct", number: 4, interval: 250, },
      { type: "ramshoot", number: 2, delay: 125, interval: 500, },
    ],
    [ // 19
      { type: "basic", number: 11, interval: 50, },
      { type: "ram", number: 5, delay: 75, interval: 100, },
    ],
    { type: "boss_oct", number: 1, boss: true, },
  ];

  waves_text.level0test = {
    [0]: [
      { message: "Welcome to the first real level, I don't have a name for it yet...", delay: 0, },
      { message: "Don't expect to pass the last 10 rounds of the level.", delay: 10, },
      { message: "Press q to start the first round.", delay: 20, },
      { message: "Good luck! I won't be talking any more.", delay: 30, },
    ],
    [20]: [
      { message: "Very nice!", delay: 0, },
      { message: "Good job!", delay: 10, },
      { message: "Yay!", delay: 20, },
    ],
  };

  waves_points.level0test = {
    points: [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5 ],
    time: [ 0, 7, 25, 11, 9, 15, 20, 10, 25, 8, 8, 50, 60, 50, 35, 60, 50, 25, 40, /**/ 70, 10],
    // equally spaced out ratings?
    // ratings: [ 1, 0.90909, 0.81818, 0.72727, 0.63636, 0.54545, 0.45454, 0.36363, 0.27272, 0.18181, 0.09091, 0 ],
    ratings: [ 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0 ],
  };
}

if ("tutorialold") {

  waves_info.tutorialold = {
    name: "Tutorial Old",
    key: "tutorialold",
    description: "The old, harder tutorial.",
    map: "updown",
    bosses: 2,
    rounds: 15,
  };

  waves.tutorialold = [
    0,
    { type: "basic", number: 1, },
    { type: "basic", number: 3, interval: 60, },
    { type: "ram", number: 2, interval: 100, },
    { type: "slow", number: 2, interval: 60, },
    { type: "strong", number: 1, boss: true, },
    { type: "fast", number: 2, interval: 60, },
    [ // 7
      { type: "basic", number: 1, },
      { type: "slow", number: 1, },
      { type: "fast", number: 1, },
      { type: "ram", number: 1, delay: 120, },
    ],
    [ // 8
      { type: "basic", number: 2, interval: 60, },
      { type: "oct", number: 1, delay: 120, },
      { type: "ram", number: 2, interval: 60, },
    ],
    [ // 9
      { type: "basic", number: 8, interval: 20, },
      { type: "ram", number: 2, interval: 180, delay: 10, },
    ],
    { type: "boss_tutorial", number: 1, boss: true, },
    [ // 11
      { type: "slow", number: 3, interval: 180, },
      { type: "fast", number: 3, interval: 180, },
      { type: "ram", number: 3, interval: 180, },
    ],
    [ // 12
      { type: "oct", number: 1, boss: true, },
      { type: "oct", number: 3, delay: 30, interval: 30, },
    ],
    [ // 13
      { type: "strong", number: 1, boss: true, },
      { type: "ramshoot", number: 5, delay: 60, interval: 10, },
    ],
    [ // 14
      { type: "small", number: 5, },
      { type: "fast", number: 2, },
    ],
    { type: "boss_tutorial_2", number: 1, boss: true, },
  ];

  waves_text.tutorialold = {
    [0]: [
      { message: "Welcome to the tutorial!", delay: 0, color: C.message_text_tutorial, },
      { message: "Use the arrow keys to move and click to shoot.", delay: 10, color: C.message_text_tutorial, },
      { message: "When you are ready, press q to start the first round!", delay: 20, color: C.message_text_tutorial, },
    ],
    [1]: [
      { message: "This basic enemy is incapable of movement and shoots rather slowly.", delay: 0, },
      { message: "Your aim is to shoot at it while dodging its bullets.", delay: 10, },
      { message: "Good luck!", delay: 20, },
      { message: "Good work! You can start the next round now.", delay: 0, after: true, },
      { message: "Press q when you are ready!", delay: 10, after: true, },
    ],
    [2]: [
      { message: "More enemies this time!", delay: 0, },
      { message: "Walls can be used as cover. Enemies won't shoot if they can't see you!", delay: 10, },
    ],
    [3]: [
      { message: "This new enemy doesn't shoot, but tries to hit you using its body!", delay: 0, },
      { message: "When it is charging, its eyes will glow purple.", delay: 0, },
      { message: "No bullets to dodge this round!", delay: 10, },
    ],
    [4]: [
      { message: "There are different types of enemies.", delay: 0, },
      { message: "These slowly shoot large, heavy bullets that hit hard!", delay: 10, },
    ],
    [5]: [
      { message: "Every 5 or 10 rounds, there will be a miniboss! Good luck!", delay: 0, },
    ],
    [6]: [
      { message: "These enemies shoot faster! Beware of their fast moving bullets.", delay: 0, },
    ],
    [7]: [
      { message: "Four enemies, all of different types!", delay: 0, },
      { message: "If you get hit and lose health, you will only be able to regenerate health after a while.", delay: 10, },
    ],
    [8]: [
      { message: "New types of enemies will be introduced in later levels.", delay: 0, },
      { message: "This new enemy shoots bullets everywhere constantly.", delay: 0, },
    ],
    [9]: [
      { message: "Many weak enemies may pose a challenge too!", delay: 0, },
      { message: "There is a boss in the next round! Get ready!", delay: 0, after: true, },
    ],
    [10]: [
      { message: "The bullets that this boss shoots grow slowly and can't travel far.", delay: 0, },
      { message: "ok why are you still fighting this boss you should be done after one minute...", delay: 3600, },
      { message: "Well done!", delay: 0, after: true, },
    ],
    [11]: [
      { message: "There are 15 rounds in total in the tutorial.", delay: 0, },
      { message: "Can you survive this round?", delay: 0, },
    ],
    [12]: [
      { message: "When your health reaches zero, a life is consumed.", delay: 0, }, // if you haven't noticed by now...
    ],
    [13]: [
      { message: "A new enemy!", delay: 0, },
    ],
    [14]: [
      { message: "Another new enemy!", delay: 0, },
      { message: "Get ready for the final round!", delay: 0, after: true, },
    ],
    [15]: [
      // { message: "Yet another new enemy!", delay: 0, },
      { message: "The final round of the tutorial!", delay: 0, },
      { message: "This boss has large homing bullets... but if it can't see you, the bullets get quite confused.", delay: 10, },
      { message: "Well done! You have completed the tutorial!", delay: 0, after: true, },
    ],
  };

  waves_points.tutorialold = {
    points: [ 0, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5 ],
    time: [ 0, 7, 20, 8, 15, 7, 10, 20, 30, 60, 15, 45, 50, 35, 50, 25, ],
    ratings: [ 1, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05, 0 ],
  };

}

if ("oneround") {

  waves_info.oneround = {
    name: "One Round",
    key: "oneround",
    description: "This level has only one round!",
    map: "empty",
    bosses: 1,
    rounds: 1,
  };

  waves.oneround = [
    0,
    { type: "boss_oct", number: 1, boss: true, },
  ];

  waves_text.oneround = {
    [0]: [
      { message: "Wow, only one round?", delay: 0, },
    ],
  };

  waves_points.oneround = {
    points: [ 0, 1, ],
    time: [ 0, 20, ], // ho ho ho, only 20 seconds!
    ratings: [ 1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.5, 0.3, 0.1, 0.05, 0 ],
  };

}

if ("tworounds") {

  waves_info.tworounds = {
    name: "Two Rounds",
    key: "tworounds",
    description: "This level has only two rounds!",
    map: "empty",
    bosses: 0,
    rounds: 2,
  };

  waves.tworounds = [
    0,
    { type: "homing", number: 5, interval: 12, },
    { type: "homing_4", number: 5, interval: 12, },
  ];

  waves_text.tworounds = {
    [0]: [
      { message: "Wow, only two rounds?", delay: 0, },
    ],
    [1]: [
      { message: "Wow, homing bullets?", delay: 0, },
    ],
    [2]: [
      { message: "Wow, it's done?", delay: 0, after: true, },
    ],
  };

  waves_points.tworounds = {
    points: [ 0, 1, 1.5, ],
    time: [ 0, 20, 30, ],
    ratings: [ 1, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.3, 0.1, 0.05, 0 ],
  };

}

if ("threerounds") {

  waves_info.threerounds = {
    name: "Three Rounds",
    key: "threerounds",
    description: "This level has only three rounds!",
    map: "empty",
    bosses: 0,
    rounds: 3,
  };

  waves.threerounds = [
    0,
    { type: "scatter_triple", number: 3, interval: 60, },
    [ // 2
      { type: "basic_triple", number: 1, },
      { type: "triple", number: 1, },
      { type: "scatter_triple", number: 1, },
    ],
    { type: "homing_3", number: 3, interval: 60, },
  ];

  waves_text.threerounds = {
    [0]: [
      { message: "3", delay: 0, },
    ],
    [1]: [
      { message: "33", delay: 0, },
    ],
    [2]: [
      { message: "333", delay: 0, },
      { message: "3333333333333333333333333333333333333333333333", delay: 0, after: true, },
    ],
  };

  waves_points.threerounds = {
    points: [ 0, 1, 1.25, 1.5, ],
    time: [ 0, 15, 21, 25, ],
    ratings: [ 1, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.3, 0.1, 0.05, 0 ],
  };

}

if ("fourrounds") {

  waves_info.fourrounds = {
    name: "Four Rounds",
    key: "fourrounds",
    description: "This level has only four rounds!",
    map: "empty",
    bosses: 0,
    rounds: 4,
  };

  waves.fourrounds = [
    0,
    { type: "small", number: 4, interval: 60, },
    [ // 2
      { type: "line4", number: 4, },
    ],
    { type: "small_healthy", number: 4, interval: 60, },
    [ // 4
      { type: "homing_4", number: 1, },
      { type: "line4", number: 1, },
      { type: "quadruple", number: 1, },
      { type: "scatter_square", number: 1, },
    ],
  ];

  waves_text.fourrounds = {
    [0]: [
      { message: "4", delay: 0, },
    ],
    [1]: [
      { message: "for", delay: 0, },
    ],
    [2]: [
      { message: "for i in range(4):", delay: 0, },
    ],
    [3]: [
      { message: "for i in range(444):", delay: 0, },
      { message: "    print(444)", delay: 0, },
    ],
    [4]: [
      { message: "def four():", delay: 0, },
      { message: "    print(4)", delay: 0, },
      { message: "    four()", delay: 0, },
    ],
  };

  waves_points.fourrounds = {
    points: [ 0, 1, 1, 1, 1.5, ],
    time: [ 0, 15, 20, 15, 25, ],
    ratings: [ 1, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.3, 0.1, 0.05, 0 ],
  };

}

if ("multiplayer") {

  waves_info.multiplayer = {
    name: "Multiplayer",
    key: "multiplayer",
    description: "The level used for multiplayer games.",
    map: "multiplayer",
    bosses: 0,
    rounds: 0,
  };

  waves.multiplayer = [
    0,
  ];

  waves_text.multiplayer = {
    [0]: [],
  };

  waves_points.multiplayer = {
    points: [ 0, ],
    time: [ 0, ],
  };

}

if ("blank") {

  waves_info.blank = {
    name: "Blank",
    key: "blank",
    description: "This level is totally blank!",
    map: "empty",
    bosses: 0,
    rounds: 0,
  };

  waves.blank = [
    0,
  ];

  waves_text.blank = {
    [0]: [
      { message: " ", delay: 0, },
      { message: " ", delay: 1000, },
    ],
  };

  waves_points.blank = {
    points: [ 0, ],
    time: [ 0, ],
  };

}