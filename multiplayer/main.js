import { config } from "../js/lib/config.js";
import { firebase } from "../js/util/firebase.js";
import { hasher } from "../js/util/hasher.js";
import { check_if_logged_in, get_account_username } from "../js/util/localstorage.js";

const path = window.location.pathname.split(/[\/\.]/);
const title = document.getElementById("title");
const div = document.getElementById("div");

const parameters = new URLSearchParams(document.location.search);

const user = get_account_username();
const input_username = document.getElementById("username");
const button_go = document.getElementById("go");
const p_output = document.getElementById("output");
let target_user = parameters.get("username") || "";

let users = null;

function output(text = "...", color = "white") {
  p_output.innerHTML = `<span style="color: ${color}">${text}</span>`;
}

function update() {
  target_user = input_username.value;
  let ok = false;
  if (users[target_user] == null) {
    output(`oh no! user not found!`, "coral");
  } else if (target_user == user) {
    ok = true;
    output(`yourself???`, "violet");
  } else {
    ok = true;
    output(`OK`, "yellowgreen");
  }
  if (ok) {
    button_go.removeAttribute("disabled");
  } else {
    button_go.setAttribute("disabled", "true");
  }
}

function go() {
  firebase.set(`/multi/players/${user}`, target_user)
    .then(() => {
      window.location.href = "/choose/?multiplayer=true";
    }).catch((error) => { // error
      console.error("error:" + error); // error
    });
}

function main(event) {
  if (target_user !== "") {
    input_username.value = target_user;
    update();
  }
  main_firebase();
  // kick out if not logged in
  if (!check_if_logged_in()) {
    window.location.href = "/account/login.html";
  }
  button_go.addEventListener("click", function(event) {
    go();
  });
  input_username.addEventListener("input", function(event) {
    update();
  });
  input_username.addEventListener("keydown", function(event) {
    if (event.repeat) return;
    if (event.key === "Enter") {
      button_go.click();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    console.log(document.activeElement.tagName);
    if (document.activeElement.tagName.toLowerCase() === "input") return;
    if (event.key.toLowerCase() === "m") {
      window.location.href = "choose.html";
    }
  });
}

function main_firebase() {
  firebase.get("users", function(data) {
    users = data;
  });
}

window.addEventListener("load", main);