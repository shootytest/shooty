import { upgrades } from "../js/lib/upgrades.js";
import { waves_info } from "../js/lib/waves.js";
import { firebase } from "../js/util/firebase.js";

const root_var = document.querySelector(':root');
const parameters = new URLSearchParams(document.location.search);
const level = parameters.get("level");
const div_main = document.getElementById("main");
const L = waves_info[level];

function index(leaderboard) {
  div_main.innerHTML = `
    <h1 id="h1" style="font-size: 25px;">Leaderboard List</h1>
    <h2><a href="/" class="a-left" style="color: yellow;">Back</a></h2>
    <table id="list" style="font-size: 18px;">
      <thead>
        <tr><th>Level</th><th>Players</th></tr>
      </thead>
      <tbody id="list-tbody"></tbody>
    </table>
  `
  root_var.style.setProperty("--hover-color", "#000000AA");
  const tbody_list = document.getElementById("list-tbody");
  for (const level_key of Object.keys(leaderboard).sort()) {
    const num = Object.keys(leaderboard[level_key]).length;
    const l = waves_info[level_key];
    if (leaderboard._hide.includes(level_key)) continue;
    const tr = document.createElement("tr");
    tbody_list.appendChild(tr);
    tr.style.cursor = "pointer";
    tr.addEventListener("click", function() {
      window.location.href = `/leaderboard/?level=${level_key}`;
    });
    for (let i = 0; i < 2; i++) {
      const td = document.createElement("td");
      if (i === 0) {
        td.innerHTML = `<span>${l.name}</span>`;
      } else if (i === 1) {
        td.innerHTML = `<span>${num}</span>`;
      }
      tr.appendChild(td);
    }
  }
}

function init(leaderboard) {
  if (L == null || leaderboard == null) {
    div_main.innerHTML = `
      <h1 id="h1">Leaderboard - Level Not Found</h1>
      <p><a href="/leaderboard/">go back to the leaderboard list</a></p>
    `;
    return;
  }
  root_var.style.setProperty("--hover-color", "#FFFFFF22");
  div_main.innerHTML = `
    <h1 id="h1" style="font-size: 25px;">Rankings - ${L.name}</h1>
    <h2><a href="/leaderboard" class="a-left" style="color: yellow;">Back</a></h2>
    <table id="board" style="font-size: 18px;">
      <thead>
        <tr><th>Rank</th><th>Username</th><th>Score</th><th title="number of rounds fully completed">Rounds</th><th title="player type used">Used</th></tr>
      </thead>
      <tbody id="board-tbody"></tbody>
    </table>
  `;
  const tbody_board = document.getElementById("board-tbody");
  const ranks = [ ];
  for (const user in leaderboard) {
    const entry = leaderboard[user];
    ranks.push({
      user: user,
      score: entry.score,
      rounds: entry.rounds,
      used: entry.used,
    });
  }
  // sort ranks by score
  ranks.sort( (a, b) => b.score - a.score );
  let rank = 1;
  for (const entry of ranks) {
    if (entry == null) continue;
    const tr = document.createElement("tr");
    tbody_board.appendChild(tr);
    for (let i = 0; i < 5; i++) {
      const td = document.createElement("td");
      if (i === 0) {
        td.innerHTML = `<span>${rank}</span>`;
      } else if (i === 1) {
        td.innerHTML = `<span>${entry.user}</span>`;
      } else if (i === 2) {
        td.innerHTML = `<span>${entry.score}</span>`;
      } else if (i === 3) {
        td.innerHTML = `<span>${(entry.rounds === L.rounds) ? "✔️" : entry.rounds}</span>`;
      } else if (i === 4) {
        td.innerHTML = `<span>${upgrades[entry.used].name}</span>`;
      }
      tr.appendChild(td);
    }
    rank++;
  }
}

function fire() {
  if (L == null) {
    init(null);
  } else {
    firebase.listen(`/leaderboard/${level}`, function(data) {
      init(data);
    });
  }
}

function fire_index() {
  firebase.listen(`/leaderboard/`, function(data) {
    index(data);
  });
}

function main() {
  if (level == null) {
    fire_index();
  } else {
    fire();
  }
}

window.addEventListener("load", main);