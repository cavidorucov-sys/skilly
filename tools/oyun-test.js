// Self-test for a topic's game levels, without a browser:  node tools/oyun-test.js dersler/oyun-<slug>.js
// Generates N problems per level and checks: text and solution present; numeric answers finite and the shown
// correct answer is accepted by the same checker the game uses; choice problems have a valid correct index.
const fs = require("fs"), path = require("path"), vm = require("vm");
const file = process.argv[2], N = +process.argv[3] || 300;
if (!file) { console.error("usage: node tools/oyun-test.js dersler/oyun-<slug>.js [N]"); process.exit(2); }

// minimal DOM: enough for generators that build text nodes / SVG
function node(tag) {
  return { tagName: tag, attrs: {}, children: [], textContent: "", style: {},
    setAttribute(k, v) { this.attrs[k] = String(v); }, getAttribute(k) { return this.attrs[k]; },
    append(...k) { k.forEach(x => { this.children.push(x); if (typeof x === "string") this.textContent += x; else if (x && x.textContent) this.textContent += x.textContent; }); },
    addEventListener() {}, querySelector() { return null }, querySelectorAll() { return [] }, classList: { add() {}, toggle() {}, remove() {} } };
}
const document = { readyState: "complete", createElement: node, createElementNS: (ns, t) => node(t), getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, documentElement: node("html") };
const window = { document, localStorage: { getItem: () => null, setItem() {} } };
const ctx = vm.createContext({ window, document, localStorage: window.localStorage, console, Math, JSON, Date, setTimeout, clearTimeout, Promise });
ctx.globalThis = ctx; window.window = window;
const root = path.join(__dirname, "..");
vm.runInContext(fs.readFileSync(path.join(root, "assets/oyun.js"), "utf8"), ctx);
ctx.Oyun = ctx.window.Oyun;
vm.runInContext(fs.readFileSync(path.resolve(root, file), "utf8"), ctx);
const levels = ctx.window.__levels;
if (!Array.isArray(levels) || !levels.length) { console.error("FAIL: topic file must set window.__levels = levels"); process.exit(1); }
const { parse } = ctx.window.Oyun;
const close = (x, v, tol) => Math.abs(x - v) <= (tol ?? Math.max(0.005, Math.abs(v) * 0.005));
const text = t => typeof t === "string" ? t : (t && t.textContent) || "";
let bad = 0;
for (const l of levels) {
  if (!l.id || !l.ad || typeof l.gen !== "function") { console.log("FAIL level shape", l.id); bad++; continue; }
  const seen = new Set(); let fails = [];
  for (let i = 0; i < N; i++) {
    let q; try { q = l.gen(); } catch (e) { fails.push("throws: " + e.message); break; }
    const t = text(q.text); seen.add(t + "|" + q.show);
    if (!t.trim()) fails.push("empty text");
    if (!q.solution || !String(q.solution).trim()) fails.push("empty solution: " + t);
    if (q.show == null || !String(q.show).trim()) fails.push("empty show: " + t);
    if (q.choices) { if (!(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.choices.length)) fails.push("bad correct index: " + t); }
    else {
      if (!isFinite(q.answer)) fails.push("answer not finite: " + t);
      const shown = String(q.show).replace(/\s*(m|sm|km|kq|q|s|san|dəq|°|%|m\/s²|m\/s|N|J|W|Pa|V|A|Ω|sm²|m²|sm³|m³|dm³|l)$/i, "").replace(/,/g, ".");
      const v = parse(shown);
      if (!close(v, q.answer, q.tol)) fails.push(`shown answer "${q.show}" not accepted (answer ${q.answer}): ${t}`);
    }
  }
  fails = [...new Set(fails)];
  const variety = seen.size;
  const need = l.minVariety ?? Math.min(20, N / 5); // levels about a fixed table (e.g. special angles) set a lower minVariety
  const ok = !fails.length && variety >= need;
  if (!ok) bad++;
  console.log((ok ? "ok  " : "FAIL") + "  " + l.id.padEnd(14) + " variety " + String(variety).padStart(4) + (fails.length ? "\n      " + fails.slice(0, 5).join("\n      ") : "") + (variety < need ? "\n      too few different problems (need " + need + ")" : ""));
}
process.exit(bad ? 1 : 0);
