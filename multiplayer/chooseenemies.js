import { make, realmake } from "../js/lib/make.js";
import { get_account_username, get_multi_enemies, set_multi_enemies } from "../js/util/localstorage.js";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const path = window.location.pathname.split(/[\/\.]/);
const title = document.getElementById("title");
const div = document.getElementById("div");

const parameters = new URLSearchParams(document.location.search);

const selects = { };
for (const k of keys) {
  selects[k] = document.getElementById(k);
}
const button_ready = document.getElementById("ready");
const user = get_account_username();

const multi_enemies = get_multi_enemies();

function update(k) {

  const select = selects[k];
  multi_enemies[k] = select.value;
  set_multi_enemies(JSON.stringify(multi_enemies));

}

function main() {

  generate();

  for (const k of keys) {
    selects[k].addEventListener("change", function(event) {
      update(k);
    });
  }
  button_ready.addEventListener("click", (event) => {
    window.location.href = "index.html";
  })

}

function generate() {

  const enemy_type_names = [];

  for (const mk in make) { // mk: make_key
    const M = realmake(mk);
    if (!M.enemy) continue;
    if (mk.startsWith("enemy_") && !mk.includes("boss")) {
      enemy_type_names.push([mk.substring(6), M.name]); // TODO
    }
  }

  enemy_type_names.sort();

  let options = `<option value="">none</option>`;
  for (let i = 0; i < enemy_type_names.length; i++) {
    const pair = enemy_type_names[i];
    options += `<option value="${pair[0]}">${pair[1]}</option>`;
  }
  
  for (const k of keys) {
    const select = selects[k];
    select.innerHTML = options;
    select.value = multi_enemies[k];
  }

}

window.addEventListener("load", function(event) {
  main();
});