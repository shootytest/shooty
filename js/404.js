
const path = window.location.pathname.split(/[\/\.]/);

function main() {
  if (path[1] === "play" && path.length >= 3) {
    window.location.href = "/play/?level=" + path[2];
  }
  if (path[1] === "multiplayer" && path.length >= 3) {
    window.location.href = "/multiplayer/?username=" + path[2];
  }
  console.log(path);
}

window.addEventListener("load", main);