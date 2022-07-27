import { inv_things } from "../js/lib/inv_things.js";
import { firebase } from "../js/util/firebase.js";
import { check_if_logged_in, get_account_username } from "../js/util/localstorage.js";


const parameters = new URLSearchParams(document.location.search);
const username = get_account_username();
const div_main = document.getElementById("main");

function init(inv) {
  if (inv == null) {
    div_main.innerHTML = `
      <h1 id="h1">Inventory Not Found!?</h1>
      <p><a href="/">Back to Main Menu</a></p>
    `;
    return;
  }
  div_main.innerHTML = `
    <h1 id="h1" style="font-size: 25px;">Inventory</h1>
    <h2><a href="javascript:history.back()" class="a-left" style="color: yellow;">Back</a></h2>
    <table id="inventory" style="font-size: 18px;">
      <thead>
        <tr><th>Object</th><th>#</th><th>Description</th></tr>
      </thead>
      <tbody id="inventory-tbody"></tbody>
    </table>
  `;
  const table_levels = document.getElementById("inventory");
  const tbody_inventory = document.getElementById("inventory-tbody");
  for (const thing_key in inv) {
    const num = inv[thing_key];
    const thing = inv_things[thing_key];
    if (num == null || thing == null) continue;
    const tr = document.createElement("tr");
    tbody_inventory.appendChild(tr);
    for (let i = 0; i < 3; i++) {
      const td = document.createElement("td");
      if (i === 0) {
        td.innerHTML = `<span>${thing.name}</span>`;
      } else if (i === 1) {
        td.innerHTML = `<span>${num}</span>`;
        td.style.fontSize = "25px";
        td.style.minWidth = "100px";
      } else if (i === 2) {
        td.innerHTML = `<span>${thing.description}</span>`;
        td.style.fontSize = "13px";
        td.style.maxWidth = "300px";
      }
      tr.appendChild(td);
    }
  }
}

function fire() {
  if (!check_if_logged_in()) window.location.href = "/account/login.html"
  firebase.listen(`/users/${username}/inventory`, function(inv) {
    init(inv);
  })
}

function main() {
  fire();
}

window.addEventListener("load", main);