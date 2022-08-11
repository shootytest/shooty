import { upgrades } from "../js/lib/upgrades.js";
import { waves_info, wave_ratings } from "../js/lib/waves.js";
import { worlds } from "../js/lib/worlds.js";
import { firebase } from "../js/util/firebase.js";

const root_var = document.querySelector(':root');
const parameters = new URLSearchParams(document.location.search);
const level = parameters.get("level");
const div_main = document.getElementById("main");
const L = waves_info[level];

const list_of_worlds = [
  "zero", "test",
];

/* // unused...
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
*/

function index(HIDE) {
  div_main.innerHTML = `
    <h1 id="h1" style="font-size: 25px;">Leaderboard List</h1>
    <h2><a href="/" class="a-left" style="color: yellow;">Back</a></h2>
    <table id="list" style="font-size: 18px;">
      <thead>
        <tr>
          <th>World</th>
          <th>Level</th>
          <th>Rounds</th>
        </tr>
      </thead>
      <tbody id="list-tbody"></tbody>
    </table>
  `
  root_var.style.setProperty("--hover-color", "#000000AA");
  const tbody_list = document.getElementById("list-tbody");
  for (const world_key of list_of_worlds) {
    const W = worlds[world_key];
    for (const level_key in W.levels) {
      const l = waves_info[level_key];
      if (HIDE.includes(level_key)) continue;
      const tr = document.createElement("tr");
      tbody_list.appendChild(tr);
      tr.style.cursor = "pointer";
      tr.addEventListener("click", function() {
        window.location.href = `/leaderboard/?level=${level_key}`;
      });
      for (let i = 0; i < 3; i++) {
        const td = document.createElement("td");
        if (i === 0) {
          td.innerHTML = `<span>${W.name}</span>`;
        } else if (i === 1) {
          td.innerHTML = `<span>${l.name}</span>`;
        } else if (i === 2) {
          td.innerHTML = `<span>${l.rounds}</span>`;
        }
        tr.appendChild(td);
      }
    }
  }
}

function init(entries) {
  if (L == null || entries == null) {
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
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Score</th>
          <th>Rating</th>
          <th title="number of rounds fully completed">Rounds</th>
          <th title="player type used">Used</th>
        </tr>
      </thead>
      <tbody id="board-tbody"></tbody>
    </table>
  `;
  const tbody_board = document.getElementById("board-tbody");
  const ranked_entries = [ ];
  for (const username in entries) {
    const entry = entries[username];
    ranked_entries.push({
      user: username,
      points: entry.points,
      rounds: entry.rounds,
      rating: entry.rating,
      use: entry.use,
    });
  }
  // sort ranks by score
  ranked_entries.sort( (a, b) => b.points - a.points );
  let rank = 1;
  for (const entry of ranked_entries) {
    if (entry == null) continue;
    const tr = document.createElement("tr");
    tbody_board.appendChild(tr);
    for (let i = 0; i < 6; i++) {
      const td = document.createElement("td");
      if (i === 0) {
        td.innerHTML = `<span>${rank}</span>`;
      } else if (i === 1) {
        td.innerHTML = `<span>${entry.user}</span>`;
      } else if (i === 2) {
        td.innerHTML = `<span>${entry.points}</span>`;
      } else if (i === 3) {
        td.innerHTML = `<span>${wave_ratings[entry.rating]}</span>`;
      } else if (i === 4) {
        td.innerHTML = `<span>${(entry.rounds === L.rounds) ? "✔️" : entry.rounds}</span>`;
      } else if (i === 5) {
        td.innerHTML = `<span>${upgrades[entry.use].name}</span>`;
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
    let entries = {};
    function update() {
      init(entries);
    }
    update();
    firebase.get(`/users/LIST/`, function(list) {
      const LIST = list;
      for (const user of LIST) {
        // listen -> responsive leaderboard!
        firebase.listen(`/scores/${user}/${level}/best`, function(entry) {
          if (entry == null) return;
          entries[user] = entry;
          update();
        });
      }
    });
  }
}

function fire_index() {
  firebase.listen(`/scores/HIDE/`, function(HIDE) {
    index(HIDE || []);
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