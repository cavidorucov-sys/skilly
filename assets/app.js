// Shared header/nav and small helpers for every portal page.
const NAV = [
  ["index.html", "Bu həftə"],
  ["riyaziyyat.html", "Riyaziyyat"],
  ["olimpiada.html", "Riyaziyyat olimpiadası"],
  ["fizika.html", "Fizika"],
  ["sinaqlar.html", "Sınaqlar"],
  ["temrar.html", "Təkrar"],
  ["dusturlar.html", "Düsturlar"],
];

function el(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
  kids.flat().forEach(k => e.append(k));
  return e;
}

function header() {
  const here = location.pathname.split("/").pop() || "index.html";
  const nav = el("nav", { class: "nav", "aria-label": "Bölmələr" },
    NAV.map(([href, label]) => el("a", href === here ? { href, "aria-current": "page" } : { href }, label)));
  document.body.prepend(el("header", { class: "top" },
    el("div", { class: "in" }, el("a", { class: "brand", href: "index.html" }, "Fikrət · Hazırlıq"), nav)));
}

async function load(path) {
  const r = await fetch(path, { cache: "no-cache" });
  if (!r.ok) throw new Error(path + " " + r.status);
  return r.json();
}

const STATUS = { yox: ["Başlanmayıb", "s-yox"], isl: ["İşlənir", "s-isl"], bag: ["Bağlanıb", "s-bag"] };
function pill(s) { const [t, c] = STATUS[s] || STATUS.yox; return el("span", { class: "pill " + c }, t); }

document.addEventListener("DOMContentLoaded", header);
