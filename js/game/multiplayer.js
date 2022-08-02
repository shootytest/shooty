import { firebase } from "../util/firebase.js";
import { get_account_username } from "../util/localstorage.js";
import { Enemy } from "./enemy.js";

let oldmulti = null; // unused for now
let multi = null;
const user = get_account_username();

// part of init
const multiplayer_listeners = function() {
  firebase.listen(`/multi`, function(data) {
    oldmulti = multi;
    multi = data;
    multiplayer.onchange();
  });
}

export const multiplayer = {

  // properties
  is_multiplayer: false,
  suppress_gamesave: false,

  // functions

  init: function() {
    if (user == null) return;
    multiplayer_listeners();
  },

  send: function(o) {
    if (o.enemy) {
      if (o.type && typeof o.type === "string" && o.type.length) {
        const target_user = multi.players[user];
        firebase.increment(`/multi/sends/${target_user}/${o.type}`, o.number == null ? 1 : o.number);
      } else {
        console.error("invalid enemy type to send: " + o.type);
      }
    }
  },

  send_enemy: function(enemy_type) {
    multiplayer.send({
      enemy: true,
      type: enemy_type,
    });
  },

  receive_enemy: function(type, number = 1) {
    // basically a decrement
    firebase.increment(`/multi/sends/${user}/${type}`, -number);
  },

  // things to run even when game is paused
  tick: function() {
    // ?
  },

  // things to run whenever multi is changed
  onchange: function() {
    // focus on sends/user
    const received = multi.sends[user];
    for (const k in received) {
      if (!received.hasOwnProperty(k) || received[k] === 0) continue;
      // actually send the enemy
      Enemy.create(k);
      multiplayer.receive_enemy(k, received[k]);
    }
  },

};