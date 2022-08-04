import { make, realmake, realshoots } from "../js/lib/make.js";
import { math_util } from "../js/util/math.js";

const table_width_cells = 10;

const get_info = function(o) {
  const result = [];
  result.push({
    name: "Rotation",
    title: "gun rotation",
    value: (o.rotation || 0) + "°",
  }, {
    name: "Bullet Type",
    title: "bullet type",
    value: `<a href="/info/thing/?thing=${o.type}">${o.type}</a>`,
  }, {
    name: "Reload",
    title: "gun reload",
    value: `${math_util.round(60 / (o.reload), 3)}/s`,
  }, {
    name: "Damage",
    title: "bullet damage",
    value: math_util.fix_precision((o.damage || 0) * 10),
  }, {
    name: "Size",
    title: "bullet size",
    value: o.size || 0,
  }, {
    name: "Speed",
    title: "bullet speed",
    value: o.speed || 0,
  }, {
    name: "Spread",
    title: "bullet launch angle variance",
    value: o.spread || 0,
  }, {
    name: "Time",
    title: "maximum bullet time",
    value: ((o.time == null) ? Infinity : (o.time || 0)),
  }, {
    name: "Delay",
    title: "shoot delay",
    value: o.delay || 0,
  });
  return result;
};

const gun_info = function(gun, body, index, last = false) {
  if (gun == null) {
    return `
      <p>invalid gun</p>
    `;
  }
  const info = get_info(gun);
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");
  let td,
      _td = () => { td = document.createElement("td"); },
      borderdown = () => { if (!last) td.style.borderBottom = "2px solid white"; }
  _td();
  td.setAttribute("rowspan", 2);
  td.innerHTML = `${((+index) + 1)}`;
  borderdown();
  tr1.appendChild(td);
  let j = 0;
  for (const i of info) {
    _td();
    td.innerHTML = `<span title="${i.title || ""}">${i.name}</span>`;
    if (j !== 0) td.style.borderLeft = "2px solid dimgrey";
    tr1.appendChild(td);
    _td();
    td.innerHTML = `<span>${i.value}</span>`;
    if (j !== 0) td.style.borderLeft = "2px solid dimgrey";
    else td.style.border = "none";
    borderdown();
    td.style.textAlign = "center";
    tr2.appendChild(td);
    j++;
  }
  body.appendChild(tr1);
  body.appendChild(tr2);
}

export const thing_gun_info = function(thing_key) {
  if (thing_key == null || make[thing_key] == null) {
    return `
      <p>invalid thing</p>
    `;
  }
  const shoot = realshoots(thing_key);
  const d = document.createElement("div");
  d.innerHTML = `
    <table id="guninfo" style="font-size: 14px; background-color: #00000022;">
      <thead><tr><th colspan="${table_width_cells}"><b style="font-size: 18px;">Guns</b></th></tr></thead>
      <tbody id="guninfobody"></tbody>
    </table>
  `;
  const table_info = d.children[0];
  const body_info = table_info.children[1];
  for (let i = 0; i < shoot.length; i++) {
    gun_info(shoot[i], body_info, i, i === shoot.length - 1);
  }
  return table_info.outerHTML;
}