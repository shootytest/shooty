import { make, realmake } from "../../js/lib/make.js";
import { math_util } from "../../js/util/math.js";
import { thing_gun_info } from "../guninfo.js";

const root_var = document.querySelector(':root');
const parameters = new URLSearchParams(document.location.search);
const enemy_key = "enemy_" + (parameters.get("enemy") || "_list");
const div_main = document.getElementById("main");
const Vector = Matter.Vector;

function list() {
  div_main.innerHTML = `
    <h1 id="h1" style="font-size: 25px;">Enemy List</h1>
    <h2><a href="/info/" class="a-left" style="color: yellow;">Back</a></h2>
    <table id="list" style="font-size: 18px; background-color: #FFFFFF11;">
      <thead>
        <tr><th>#</th><th>Enemy Name</th></tr>
      </thead>
      <tbody id="list-body"></tbody>
    </table>
  `
  root_var.style.setProperty("--hover-color", "#00000066");
  const body_list = document.getElementById("list-body");
  let num = 1;
  for (const make_key of Object.keys(make).sort()) {
    if (!make_key.startsWith("enemy_")) continue;
    const M = realmake(make_key);
    if (!M.enemy) continue;
    const tr = document.createElement("tr");
    body_list.appendChild(tr);
    tr.style.cursor = "pointer";
    tr.addEventListener("click", function() {
      window.location.href = `/info/enemy/?enemy=${make_key.substring(6)}`;
    });
    for (let i = 0; i < 2; i++) {
      const td = document.createElement("td");
      if (i === 0) {
        td.innerHTML = `<span>${num}</span>`;
      } else if (i === 1) {
        td.innerHTML = `<span>${M.name}</span>`;
      }
      tr.appendChild(td);
    }
    num++;
  }
}

function get_coins(items) {
  let c = 0;
  for (let i of items) {
    c += realmake("item_" + i.type).give_number * i.number;
  }
  return c;
}

function get_info() {
  const result = [];
  const E = realmake(enemy_key);
  console.log(E);
  result.push({
    name: "Name",
    title: "enemy name",
    value: E.name || "Unknown Enemy",
  }, {
    name: "Health",
    title: "total enemy health",
    value: math_util.fix_precision((E.health.capacity || 0) * 10),
  }, {
    name: "Body Damage",
    title: "damage dealt per second on contact",
    value: math_util.fix_precision((E.health.damage || 0) * 60, 10),
  }, {
    name: "Size",
    title: "enemy size",
    value: E.size || 0,
  }, {
    name: "Coins",
    title: "coins dropped when killed",
    value: get_coins(E.items),
  });
  return result;
}

function load() {
  if (enemy_key == null || make[enemy_key] == null) {
    div_main.innerHTML = `
      <h1 id="h1">Enemy Not Found</h1>
      <p><a href="/info/enemy/">Try again?</a></p>
    `;
    return;
  }
  const info = get_info();
  div_main.innerHTML = `
    <h1 id="h1" style="font-size: 25px;">Enemy - ${info[0].value}</h1>
    <h2><a href="/info/enemy/" class="a-left" style="color: yellow;">Back</a></h2>
    <table id="info" style="font-size: 16px; margin-bottom: 50px; background-color: #FFFFFF11;">
      <thead><tr><th colspan="2"><b style="font-size: 20px;">Enemy Info</b></th></tr></thead>
      <tbody id="infobody"></tbody>
    </table>
    <div id="guns">${thing_gun_info(enemy_key)}</div>
  `;
  const table_info = document.getElementById("info");
  const body_info = document.getElementById("infobody");
  for (const i of info) {
    const tr = document.createElement("tr");
    body_info.appendChild(tr);
    for (let k = 0; k < 2; k++) {
      const td = document.createElement("td");
      if (k === 0) {
        td.innerHTML = `<span title="${i.title || ""}">${i.name}</span>`;
      } else if (k === 1) {
        td.innerHTML = `<span>${i.value}</span>`;
      }
      tr.appendChild(td);
    }
  }
  const div_guns = document.getElementById("guns");

}

function main() {
  if (enemy_key === "enemy__list") {
    list();
  } else {
    load();
  }
}

window.addEventListener("load", main);