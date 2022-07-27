import { waves_info } from "../js/lib/waves.js";
import { worlds } from "../js/lib/worlds.js";

const root_var = document.querySelector(':root');
const parameters = new URLSearchParams(document.location.search);
const world = parameters.get("world");
const div_main = document.getElementById("main");
const W = worlds[world];

function init() {
  if (world == null || W == null) {
    div_main.innerHTML = `
      <h1 id="h1">World Not Found</h1>
      <p><a href="/worlds">Try again?</a></p>
    `;
    return;
  }
  div_main.innerHTML = `
    <h1 id="h1" style="font-size: 25px;">Levels - ${W.name}</h1>
    <h2><a href="/worlds/" class="a-left" style="color: yellow;">Back</a></h2>
    <table id="levels" style="font-size: 18px;">
      <thead>
        <tr><th>Name</th><th>Rounds</th><th>Description</th></tr>
      </thead>
      <tbody id="levels-tbody"></tbody>
    </table>
  `;
  root_var.style.setProperty("--background", W.background_);
  const table_levels = document.getElementById("levels");
  const tbody_levels = document.getElementById("levels-tbody");
  for (const level of W.levels) {
    const L = waves_info[level.key];
    if (L == null) continue;
    const tr = document.createElement("tr");
    tbody_levels.appendChild(tr);
    tr.style.cursor = "pointer";
    tr.addEventListener("click", function() {
      window.location.href = `/choose/?level=${level.key}`;
    });
    for (let i = 0; i < 3; i++) {
      const td = document.createElement("td");
      if (i === 0) {
        td.innerHTML = `<span>${L.name}</span>`;
      } else if (i === 1) {
        td.innerHTML = `<span>${L.rounds}</span>`;
      } else if (i === 2) {
        td.innerHTML = `<span>${L.description}</span>`;
        td.style.fontSize = "13px";
        td.style.maxWidth = "300px";
      }
      tr.appendChild(td);
    }
  }
}

function main() {
  init();
}

window.addEventListener("load", main);