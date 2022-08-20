import { config } from "../js/lib/config.js";
import { firebase } from "../js/util/firebase.js";
import { hasher } from "../js/util/hasher.js";
import { check_if_logged_in, get_account_username, set_account_username, set_gamesave } from "../js/util/localstorage.js";

const path = window.location.pathname.split(/[\/\.]/);
const title = document.getElementById("title");
const div = document.getElementById("div");

// "back end"

function redirect_login() {
  if (!check_if_logged_in()) {
    window.location.href = "/account/login.html";
  }
}

function redirect_notlogin() {
  if (check_if_logged_in()) {
    window.location.href = "/account";
  }
}

function get_users(f) {
  return firebase.get("users", f);
}

function login(username) {
  set_account_username(username);
}

function logout() {
  set_account_username("");
  set_gamesave("");
}

function register(username, password) {
  const hashed = hasher.md5(password);
  get_users(function(users) {
    if (users.hasOwnProperty(username)) {
      console.error("wow why is this username taken");
      return;
    }
    firebase.set(`/users/${username}`, {
      username: username,
      password: hashed,
      desc: "",
      inventory: {
        coin: 100,
      },
      players: ["basic"],
    });
    firebase.get(`/users/LIST/`, function(LIST) {
      firebase.set(`/users/LIST/${LIST.length}`, username);
    });
  });
}

// "front end"

function init_login() {
  const p_output = document.getElementById("output");
  const p_output2 = document.getElementById("output2");
  const input_username = document.getElementById("username");
  const input_password = document.getElementById("password");
  const button_login = document.getElementById("go");
  let users;
  let ok_username;
  // load users
  get_users(function(u) {
    users = u;
  });
  // some functions
  function output(text = "...", color = "white", two = false) {
    const element = (two ? p_output2 : p_output);
    element.innerHTML = `<span style="color: ${color}">${text}</span>`;
  }
  function change_username() {
    const u = input_username.value.toLowerCase();
    let button_disabled = true;
    if (u.length < 1) {
      output("", "white");
    } else if (u === "username") {
      output("no", "coral");
    } else if ((users == null) || !users.hasOwnProperty(u)) {
      output(`you do not exist`/*, <a href="register1.html">register</a> instead?`*/, "coral");
    } else {
      output("username ok", "yellowgreen");
      ok_username = u;
      button_disabled = false;
      input_password.value = "";
    }
    input_password.disabled = button_disabled;
    button_login.disabled = button_disabled;
    return !button_disabled;
  }
  function change_password() {
    const u = input_username.value.toLowerCase();
    const p = input_password.value;
    const user = users[ok_username];
    if (p.length < 1) {
      output("", "white", true);
    } else if (p.toLowerCase() === u) {
      output("this is not a username box", "coral", true);
    } else if (p === "password") {
      output("don't guess", "coral", true);
    } else if (hasher.md5(p) !== user.password) {
      output("no", "coral", true);
    } else {
      output("password ok", "yellowgreen", true);
      return true;
    }
    return false;
  }
  function submit() {
    if (change_password()) {
      login(ok_username);
      window.location.href = "/account/";
    }
  }
  input_username.addEventListener("input", change_username);
  input_password.addEventListener("input", change_password);
  input_username.addEventListener("keydown", function(event) {
    if (event.repeat) return;
    if (event.key === "Enter") {
      button_login.click();
    }
  });
  input_password.addEventListener("keydown", function(event) {
    if (event.repeat) return;
    if (event.key === "Enter") {
      button_login.click();
    }
  });
  button_login.addEventListener("click", submit);
}

function init_logout() {
  logout();
  div.innerHTML = `<p style="color: yellowgreen;">Successfully logged out! Click <a href="login.html">here</a> to login again.</p>`;
}

function init_register1() {
  const p_output = document.getElementById("output");
  const input_username = document.getElementById("username");
  const button_next = document.getElementById("next");
  const div_password = document.getElementById("password-div");
  const input_password = document.getElementById("password");
  const p_password2 = document.getElementById("password2-p");
  const input_password2 = document.getElementById("password2");
  const button_go = document.getElementById("go");
  let users;
  let ok_username;
  let ok_password;
  let clicked_next = false;
  // load users
  get_users(function(u) {
    users = u;
  });
  // some functions
  function output(text = "...", color = "white") {
    p_output.innerHTML = `<span style="color: ${color}">${text}</span>`;
  }
  function change_username() {
    const u = input_username.value.toLowerCase();
    let button_disabled = true;
    if (u.length < 1) {
      output("type something", "white");
    } else if (u.length < 3) {
      output("username must be at least 3 characters", "coral");
    } else if (u.length > 200) {
      output("!!!! !!!!!!!! ".repeat(1000), "coral");
    } else if (u.length > 100) {
      output("STOP SPAMMING ".repeat(100), "coral");
    } else if (u.length > 50) {
      output("STOP SPAMMING", "coral");
    } else if (u.length > 20) {
      output("username must be at most 20 characters", "coral");
    } else if (u === "username") {
      output("username cannot be username", "coral");
    } else if (u === "123") {
      output("testing one two three", "coral");
    } else if (u.includes(" ") || u.includes("\t")) {
      output("username cannot contain spaces", "coral");
    } else if (!u.match(/^[a-z0-9_]*$/)) {
      output("username must be alphanumeric", "coral");
    } else if (u.toUpperCase() === u.toLowerCase()) {
      output("i know you like numbers, but username must contain at least one letter", "coral");
    } else if ((users == null) || users.hasOwnProperty(u)) {
      output("Username already taken!", "coral");
    } else {
      output("ok", "yellowgreen");
      ok_username = u;
      button_disabled = false;
      if (clicked_next) {
        div_password.style.display = "block";
      }
      input_password.value = "";
    }
    button_next.disabled = button_disabled;
    if (button_disabled) {
      div_password.style.display = "none";
    }
    return !button_disabled;
  }
  function submit_username() {
    if (!ok_username) {
      output("Don't try.", "coral");
    } else {
      clicked_next = true;
      div_password.style.display = "block";
      input_password.focus();
    }
  }
  function change_password() {
    const u = input_username.value.toLowerCase();
    const p = input_password.value;
    let valid = false;
    if (p.length < 1) {
      output("type something", "white");
    } else if (p.toLowerCase() === u) {
      output("this is not a username box", "coral");
    } else if (p === "hello" || p === "hi") {
      output("hi.", "coral");
    } else if (p === "test") {
      output("no, this isn't a test.", "coral");
    } else if (p === "shooty") {
      output("WARNING: INSECURE PASSWORD", "coral");
    } else if (p === "password") {
      output("password! password! give me a password!", "coral");
    } else if (p === "register") {
      output("stop typing in things you see", "coral");
    } else if (p.length < 4) {
      output("password must be at least 4 characters", "coral");
    } else {
      output("ok", "yellowgreen");
      valid = true;
    }
    p_password2.style.display = valid ? "block" : "none";
    input_password2.value = "";
    return valid;
  }
  function change_password2() {
    const p = input_password.value;
    const p2 = input_password2.value;
    let valid = false;
    if (p2 !== p) {
      output("why are they different", "coral");
    } else if (p2 === "shooty") {
      output("wait a minute how", "coral");
    } else if (p2 === "confirm password" || p2 === "confirmpassword") {
      output("you actually set your password to " + p2 + "... how", "coral");
    } else {
      output("ok", "yellowgreen");
      ok_password = p;
      valid = true;
    }
    button_go.disabled = !valid;
  }
  input_username.addEventListener("input", function() {
    if (change_username()) {
      if (change_password()) {
        change_password2();
      }
    }
  });
  input_username.addEventListener("keydown", function(event) {
    if (event.repeat) return;
    if (event.key === "Enter") {
      button_next.click();
    }
  });
  input_password.addEventListener("input", function() {
    if (change_password()) {
      change_password2();
    }
  });
  input_password.addEventListener("keydown", function(event) {
    if (event.repeat) return;
    if (event.key === "Enter") {
      button_go.click();
    }
  });
  input_password2.addEventListener("keydown", function(event) {
    if (event.repeat) return;
    if (event.key === "Enter") {
      button_go.click();
    }
  });
  function submit_all() {
    register(ok_username, ok_password);
    input_username.disabled = true;
    input_password.disabled = true;
    input_password2.disabled = true;
    button_next.disabled = true;
    button_go.disabled = true;
    output(`Account created, now try <a href="login.html">logging in</a>!`);
  }
  input_password2.addEventListener("input", change_password2);
  button_next.addEventListener("click", submit_username);
  button_go.addEventListener("click", submit_all);
}

function init_index() {
  const u = get_account_username();
  div.innerHTML = `<h1>Account - <span style="color: skyblue;">${u}</span></h1>`;
  console.log(get_account_username());
}

function main() {
  let pagename = "index";
  let capslock_check = false;
  if (path[1] === "account" && path.length >= 3 && path[2] !== "") {
    pagename = path[2];
  }
  console.log(pagename);
  if (pagename === "index") {
    redirect_login();
    init_index();
  } else if (pagename === "login") {
    redirect_notlogin();
    init_login();
    capslock_check = true;
  } else if (pagename === "register1") {
    redirect_notlogin();
    init_register1();
    capslock_check = true;
  } else if (pagename === "logout") {
    redirect_login();
    init_logout();
  }
  window.addEventListener("keyup", function(event) {
    if (capslock_check) {
      if (event.getModifierState("CapsLock")) {
        document.getElementById("capslock-warning").style.display = "block";
      } else {
        document.getElementById("capslock-warning").style.display = "none";
      }
    }
  });
}

window.addEventListener("load", main);