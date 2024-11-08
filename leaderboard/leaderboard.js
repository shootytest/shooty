import { upgrades } from "../js/lib/upgrades.js";
import { waves_info, wave_ratings } from "../js/lib/waves.js";
import { worlds, world_list } from "../js/lib/worlds.js";
import { firebase } from "../js/util/firebase.js";

const root_var = document.querySelector(':root');
const parameters = new URLSearchParams(document.location.search);
const level = parameters.get("level");
const use_type = parameters.get("use") || "best";
const div_main = document.getElementById("main");
const L = waves_info[level];

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
  for (const world_key of world_list) {
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
  // reject invalid level
  if (L == null || entries == null) {
    div_main.innerHTML = `
      <h1 id="h1">Leaderboard - Level Not Found</h1>
      <p><a href="/leaderboard/">go back to the leaderboard list</a></p>
    `;
    return;
  }
  // sort entries
  const ranked_entries = [ ];
  const use_types = ["best"];
  for (const username in entries) {
    if (username === "dev" || username === "test" || username === "shooty") continue;
    const entry = entries[username];
    ranked_entries.push({
      user: username,
      points: entry.points,
      rounds: entry.rounds,
      rating: entry.rating,
      use: entry.use,
    });
    if (!use_types.includes(entry.use)) {
      use_types.push(entry.use);
    }
  }
  // sort entries by score
  ranked_entries.sort( (a, b) => b.points - a.points );
  // CSS
  root_var.style.setProperty("--hover-color", "#FFFFFF22");
  // HTML
  let main_html = `
    <h1 id="h1" style="font-size: 25px;">Rankings - ${L.name}</h1>
    ${use_type === "best" ? "" : `<h3>Use: ${upgrades[use_type].name}</h3>`}
    <h2><a href="/leaderboard" class="a-left" style="color: yellow;">Back</a></h2>
  `;
  main_html += `
    <table id="board" style="font-size: 18px;">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Score</th>
          <th>Grade</th>
          <th title="number of rounds fully completed">Rounds</th>
          <th title="player type used">Used</th>
        </tr>
      </thead>
      <tbody id="board-tbody"></tbody>
    </table>
  `;
  // set HTML
  div_main.innerHTML = main_html;
  const tbody_board = document.getElementById("board-tbody");
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
        // listen = responsive leaderboard
        // get = unresponsive leaderboard
        firebase.listen(`/scores/${user}/${level}/${use_type}`, function(entry) {
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