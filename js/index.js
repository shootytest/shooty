import { gamecheck } from "./main/gamecheck.js";
import { check_if_logged_in } from "./util/localstorage.js";

const canvas = document.getElementById("canvas");

const a_continue = document.getElementById("1").children[0];

function tick() {
  
}

function getlink(num) {
  return document.getElementById("" + num).children[0];
}

function disable(num, text = null) {
  const to_disable = getlink(num);
  if (text && text.length > 0) to_disable.innerHTML = `${text}`;
  to_disable.style.color = "grey";
  to_disable.classList.add("nohover");
  to_disable.removeAttribute("href");
}

function main() {
  if (check_if_logged_in()) {
    const continue_level_name = gamecheck.level();
    const a = getlink(1);
    if (continue_level_name && continue_level_name.length > 0) {
      a.innerHTML = `continue <span style="color: lightgrey; font-size: 15px;">${continue_level_name}</span>`;
    } else {
      disable(1, "start");
    }
  } else {
    disable(1, "start");
    disable(2);
    disable(3);
    disable(4);
    disable(6);
    const a = getlink(7);
    a.innerHTML = `login`;
    a.setAttribute("href", "/account/login.html");
    disable(8);
  }
}

main();