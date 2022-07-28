import { C } from "./color.js";

export const waves_info = {};
export const waves = {};
export const waves_text = {};
export const waves_points = {};

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
    time: [ 0, 10, 20, 30, 25, 15, 10, 25, 40, 60, 20, ],
  };

}

if ("level0") {
  waves_info.level0 = {
    name: "Unnamed Level",
    key: "level0",
    description: "Well... it has a name, doesn't it?",
    map: "level0",
    bosses: 2,
    rounds: 20,
  };

  waves.level0 = [
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
  ];

  waves_text.level0 = {
    [0]: [
      { message: "Welcome to the first real level, I don't have a name for it yet...", delay: 0, },
      { message: "Don't expect to pass the last 10 rounds of the level.", delay: 10, },
      { message: "Press q to start the first round.", delay: 20, },
      { message: "Good luck! I won't be talking any more.", delay: 30, },
    ],
  };

  waves_points.level0 = {
    points: [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5 ],
    time: [ 0, 7, 20, 8, 15, 7, 10, 20, 30, 60, 15, 45, 50, 35, 50, 25, ],
  };
}

// old/unused/useless/ridiculous stuff

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
      { message: "When your health reaches zero, a life is consumed.", delay: 0, },
    ],
    [13]: [
      { message: "New enemy!", delay: 0, },
    ],
    [14]: [
      { message: "Another new enemy!", delay: 0, },
      { message: "Get ready for the final round!", delay: 0, after: true, },
    ],
    [15]: [
      { message: "The final round of the tutorial!", delay: 0, },
      { message: "This boss has large homing bullets... but if it can't see you, the bullets get quite confused.", delay: 10, },
      { message: "Well done! You have completed the tutorial!", delay: 0, after: true, },
    ],
  };

  waves_points.tutorialold = {
    points: [ 0, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1.5 ],
    time: [ 0, 7, 20, 8, 15, 7, 10, 20, 30, 60, 15, 45, 50, 35, 50, 25, ],
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
    time: [ 0, 250, ],
  };

}

if ("blank") {

  waves_info.blank = {
    name: "Blank",
    key: "blank",
    description: "This level is totally blank!",
    map: "empty",
    bosses: 1,
    rounds: 1,
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