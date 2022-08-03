const USERNAME_KEY = "user";
const PASSWORD_KEY = "pass";
const GAMESAVE_KEY = "gamesave";
const MULTIENEMIES_KEY = "multienemies";

export const get_account_username = function() {
  return localStorage.getItem(USERNAME_KEY);
}

export const get_account_password = function() {
  return localStorage.getItem(PASSWORD_KEY);
}

export const set_account_username = function(username) {
  return localStorage.setItem(USERNAME_KEY, username);
}

export const set_account_password = function(password) {
  return localStorage.setItem(PASSWORD_KEY, password);
}

const default_multi_enemies = {
  ["1"]: "basic", ["2"]: "basic", ["3"]: "basic", ["4"]: "basic", ["5"]: "basic",
  ["6"]: "basic", ["7"]: "basic", ["8"]: "basic", ["9"]: "basic", ["0"]: "basic",
};

export const get_multi_enemies = function() {
  const raw_multi_enemies = localStorage.getItem(MULTIENEMIES_KEY);
  const multi_enemies = raw_multi_enemies ? JSON.parse(raw_multi_enemies) : default_multi_enemies;
  return multi_enemies;
}

export const set_multi_enemies = function(savestring) {
  return localStorage.setItem(MULTIENEMIES_KEY, savestring);
}

export const get_gamesave = function() {
  return localStorage.getItem(GAMESAVE_KEY);
}

export const set_gamesave = function(savestring) {
  return localStorage.setItem(GAMESAVE_KEY, savestring);
}

export const check_if_logged_in = function() {
  const username = get_account_username();
  if (username == null || username === "" || username === "guest") {
    return false;
  } else {
    return true;
  }
}