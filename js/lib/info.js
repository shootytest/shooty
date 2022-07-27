import { make } from "./make";

export const info = {};

// categories
info.enemy = {};
info.weapons = {};

info.enemy["basic"] = {
  o: make.enemy_basic,
  name: "Basic",
  key: "basic",
  desc: "The very first enemy you will encounter. Shoots basic bullets, basically.",
};
info.enemy["ram"] = {
  
}