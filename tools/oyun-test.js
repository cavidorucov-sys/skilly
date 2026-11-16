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
    if (!q.solution || !String(text(q.solution) || q.solution).trim()) fails.push("empty solution: " + t);
    if (q.show == null || !String(q.show).trim()) fails.push("empty show: " + t);
    if (q.choices) { if (!(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.choices.length)) fails.push("bad correct index: " + t); }
    else {
      if (!isFinite(q.answer)) fails.push("answer not finite: " + t);
      const shown = String(q.show).replace(/\s*(m|sm|km|kq|q|s|san|dəq|°|%|m\/s²|m\/s|N|J|W|Pa|V|A|Ω|sm²|m²|sm³|m³|dm³|l)$/i, "").replace(/,/g, ".");
      const v = parse(shown);
      if (!close(v, q.answer, q.tol)) fails.push(`shown answer "${q.show}" not accepted (answer ${q.answer}): ${t}`);
      if (!ctx.window.Oyun.okForm(shown)) fails.push(`shown answer "${q.show}" is not in finished-number form (the game would reject it): ${t}`);
    }
  }
  fails = [...new Set(fails)];
  const variety = seen.size;
  const need = l.minVariety ?? Math.min(20, N / 5); // levels about a fixed table (e.g. special angles) set a lower minVariety
  const ok = !fails.length && variety >= need;
  if (!ok) bad++;
  console.log((ok ? "ok  " : "FAIL") + "  " + l.id.padEnd(14) + " variety " + String(variety).padStart(4) + (fails.length ? "\n      " + fails.slice(0, 5).join("\n      ") : "") + (variety < need ? "\n      too few different problems (need " + need + ")" : ""));
}
// exam-format part (15 Nov 2026): window.__imtahan = { fenn, vaxt, suallar: [{ tip, gen, ad? }] }
// math: 6 qapali + 3 kod + 1 yazili; physics: 10 qapali. A–E: exactly five different options "A) …" … "E) …".
const IMT = ctx.window.__imtahan;
if (!levels.some(l => l.imt)) { console.log("FAIL  no exam level (Oyun.imtLevel) in levels"); bad++; }
else if (levels[levels.length - 1].imt !== true) { console.log("FAIL  the exam level must be the last level (just before the Boss)"); bad++; }
if (!IMT) { console.log("FAIL  window.__imtahan missing"); bad++; }
else {
  const c = t => IMT.suallar.filter(x => x.tip === t).length;
  const want = IMT.fenn === "fizika" ? { qapali: 10, kod: 0, yazili: 0 } : { qapali: 6, kod: 3, yazili: 1 };
  const got = { qapali: c("qapali"), kod: c("kod"), yazili: c("yazili") };
  if (JSON.stringify(got) !== JSON.stringify(want) || IMT.suallar.length !== 10) { console.log("FAIL  imtahan shape " + JSON.stringify(got) + ", need " + JSON.stringify(want)); bad++; }
  if (IMT.fenn === "fizika" && IMT.suallar.filter(x => x.birlesik).length < 2) { console.log("FAIL  physics: at least 2 questions must join two topics (birlesik: \"<other topic>\")"); bad++; }
  const SAMPLE = process.argv.includes("--sample");
  IMT.suallar.forEach((sq, k) => {
    let fails = []; const seen = new Set();
    for (let i = 0; i < N; i++) {
      let q; try { q = sq.gen(); } catch (e) { fails.push("throws: " + e.message); break; }
      const t = text(q.text); seen.add(t + "|" + q.show + "|" + (q.choices || []).join("|"));
      if (!t.trim()) fails.push("empty text");
      if (!q.solution || !String(text(q.solution)).trim()) fails.push("empty solution");
      if (sq.tip === "qapali") {
        if (!q.choices || q.choices.length !== 5) fails.push("needs 5 choices");
        else {
          if (!q.choices.every((x, j) => String(x).startsWith("ABCDE"[j] + ") "))) fails.push("choices must start with A) … E)");
          if (new Set(q.choices.map(x => String(x).slice(3).replace(/\s+/g, ""))).size !== 5) fails.push("two choices are the same: " + q.choices.join(" | "));
          if (!(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 5)) fails.push("bad correct index");
          if (q.show !== q.choices[q.correct]) fails.push("show must be the right choice text: " + q.show);
        }
      } else {
        if (q.choices) fails.push(sq.tip + " must be a typed number, not choices");
        if (!isFinite(q.answer)) fails.push("answer not finite: " + t);
        const shown = String(q.show).replace(/\s*(m|sm|km|kq|q|s|san|dəq|°|%|m\/s²|m\/s|N|J|W|Pa|V|A|Ω|sm²|m²|sm³|m³|dm³|l|manat|AZN)$/i, "").replace(/,/g, ".");
        if (!close(parse(shown), q.answer, q.tol)) fails.push(`shown "${q.show}" not accepted (answer ${q.answer})`);
        if (!ctx.window.Oyun.okForm(shown)) fails.push(`shown "${q.show}" not in finished-number form`);
      }
    }
    fails = [...new Set(fails)];
    const need = sq.minVariety ?? Math.min(20, N / 5), ok = !fails.length && seen.size >= need;
    if (!ok) bad++;
    console.log((ok ? "ok  " : "FAIL") + "  imt#" + String(k + 1).padEnd(2) + " " + sq.tip.padEnd(7) + " variety " + String(seen.size).padStart(4) + (fails.length ? "\n      " + fails.slice(0, 5).join("\n      ") : "") + (seen.size < need ? "\n      too few different problems (need " + need + ")" : ""));
    if (SAMPLE) for (let i = 0; i < 2; i++) { const q = sq.gen(); console.log("   · " + text(q.text) + (q.choices ? "\n     " + q.choices.join("   ") : "") + "\n     → " + q.show + "\n     həll: " + text(q.solution)); }
  });
}
process.exit(bad ? 1 : 0);
