import { worlds } from "../js/lib/worlds.js";

const parameters = new URLSearchParams(document.location.search);
const sort = parameters.get("sort") || "default";
const descending = parameters.get("desc") === "true";
const div_main = document.getElementById("main");

const list_of_worlds = [
  "zero", "test",
];
let sorted_worlds = [ ];

function sort_worlds() {
  if (sort === "default") {
    sorted_worlds = list_of_worlds.slice();
  } else if (sort === "alphabetical") {
    sorted_worlds = list_of_worlds.slice().sort((a, b) => a > b);
  }
  if (descending) {
    sorted_worlds.reverse();
  }
}

function init() {
  sort_worlds();
  div_main.innerHTML = `
    <h1>Worlds</h1>
    <h2><a href="/" class="a-left" style="color: yellow;">Back</a></h2>
    <p>A list of worlds!</p>
    <p>Maybe I can make this page look nicer?</p>
    <br><br>
    <table id="worlds" style="font-size: 20px;">
      <thead>
        <tr><th>Worlds</th><th># levels</th></tr>
      </thead>
      <tbody id="worlds-tbody"></tbody>
    </table>
  `;
  const table_worlds = document.getElementById("worlds");
  const tbody_worlds = document.getElementById("worlds-tbody");
  for (const world_key of sorted_worlds) {
    const W = worlds[world_key];
    const tr = document.createElement("tr");
    tbody_worlds.appendChild(tr);
    tr.style.cursor = "pointer";
    tr.classList.add("noselect");
    tr.addEventListener("click", function() {
      window.location.href = "/levels/?world=" + world_key;
    });
    for (let i = 0; i < 2; i++) {
      const td = document.createElement("td");
      if (i === 0) {
        td.innerHTML = W.name;
      } else if (i === 1) {
        td.innerHTML = Object.keys(W.levels).length;
      }
      tr.appendChild(td);
    }
  }
}

function main() {
  init();
}

window.addEventListener("load", main);