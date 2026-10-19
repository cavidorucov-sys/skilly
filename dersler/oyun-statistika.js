// Ölçü vahidləri və statistika — mastery game levels (unit conversions incl. area/volume, mean, median, mode,
// range, frequency tables, bar/line/pie charts) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const isNice = (x, dp = 2) => Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-6;
  const F = x => { const r = +(+x).toPrecision(12); return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };   // exact decimal with comma
  const exact = v => Math.max(1e-9, Math.abs(v) * 1e-6);                 // tolerance for exact answers
  const sum = a => a.reduce((s, x) => s + x, 0);
  const sorted = a => a.slice().sort((x, y) => x - y);
  const median = a => { const s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const freq = a => { const m = new Map(); a.forEach(x => m.set(x, (m.get(x) || 0) + 1)); return m; };
  const mode = a => { const m = freq(a); let best = null, c = 0, uniq = true; m.forEach((v, k) => { if (v > c) { c = v; best = k; uniq = true; } else if (v === c) uniq = false; }); return uniq && c > 1 ? best : null; };
  const list = a => a.map(F).join("; ");
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const COLORS = ["var(--accent)", "var(--vec)", "var(--adj)", "var(--hyp)", "var(--opp)"];

  // Bar or line chart with a labelled grid. Values are multiples of step, so every value sits on a grid line.
  function chart(labels, vals, step, kind, aria) {
    const W = 330, H = 215, L = 42, R = 10, T = 14, B = 30, pw = W - L - R, ph = H - T - B;
    const ymax = step * Math.ceil(Math.max(...vals) / step + 0.001);
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": aria });
    const Y = v => T + ph - v / ymax * ph;
    for (let v = 0; v <= ymax + 1e-9; v += step) {
      g.append(sv("line", { x1: L, y1: Y(v), x2: W - R, y2: Y(v), style: "stroke:var(--grid);stroke-width:1" }));
      g.append(sv("text", { x: L - 6, y: Y(v) + 4, "text-anchor": "end", class: "oy-lbl", style: "font-size:12px" }, F(v)));
    }
    g.append(sv("line", { x1: L, y1: T + ph, x2: W - R, y2: T + ph, style: "stroke:var(--ink);stroke-width:1.5" }));
    g.append(sv("line", { x1: L, y1: T, x2: L, y2: T + ph, style: "stroke:var(--ink);stroke-width:1.5" }));
    const slot = pw / vals.length, cx = i => L + slot * (i + .5);
    if (kind === "bar") vals.forEach((v, i) => g.append(sv("rect", { x: cx(i) - slot * .3, y: Y(v), width: slot * .6, height: T + ph - Y(v), style: "fill:var(--accent)" })));
    else {
      g.append(sv("polyline", { points: vals.map((v, i) => cx(i) + "," + Y(v)).join(" "), style: "fill:none;stroke:var(--vec);stroke-width:2.5" }));
      vals.forEach((v, i) => g.append(sv("circle", { cx: cx(i), cy: Y(v), r: 4, style: "fill:var(--vec)" })));
    }
    labels.forEach((t, i) => g.append(sv("text", { x: cx(i), y: H - 10, "text-anchor": "middle", class: "oy-lbl", style: "font-size:12px" }, t)));
    return g;
  }
  function pie(labels, parts, aria) {
    const g = sv("svg", { viewBox: "0 0 330 190", class: "oy-svg", role: "img", "aria-label": aria });
    const cx = 92, cy = 95, r = 80; let a0 = -Math.PI / 2;
    parts.forEach((p, i) => {
      const a1 = a0 + p / 100 * 2 * Math.PI;
      g.append(sv("path", { d: `M${cx} ${cy}L${(cx + r * Math.cos(a0)).toFixed(2)} ${(cy + r * Math.sin(a0)).toFixed(2)}A${r} ${r} 0 ${p > 50 ? 1 : 0} 1 ${(cx + r * Math.cos(a1)).toFixed(2)} ${(cy + r * Math.sin(a1)).toFixed(2)}Z`, style: `fill:${COLORS[i]};stroke:var(--sheet);stroke-width:2` }));
      const y = 95 - parts.length * 14 + i * 28;
      g.append(sv("rect", { x: 190, y, width: 14, height: 14, rx: 3, style: `fill:${COLORS[i]}` }));
      g.append(sv("text", { x: 211, y: y + 12, class: "oy-lbl" }, labels[i]));
      a0 = a1;
    });
    return g;
  }

  // unit tables: factor in the base unit
  const LEN = [["mm", 1], ["sm", 10], ["dm", 100], ["m", 1000], ["km", 1e6]];
  const MASS = [["q", 1], ["kq", 1000], ["sentner", 1e5], ["ton", 1e6]];
  const TIME = [["saniyə", 1], ["dəqiqə", 60], ["saat", 3600], ["sutka", 86400]];
  const AREA = [["mm²", 1e-6], ["sm²", 1e-4], ["dm²", 1e-2], ["m²", 1], ["ar", 100], ["ha", 1e4], ["km²", 1e6]];
  const VOL = [["mm³", 1e-9], ["sm³", 1e-6], ["dm³", 1e-3], ["m³", 1], ["l", 1e-3], ["ml", 1e-6]];
  const conv = (T, maxRatio, decimals) => {
    for (;;) {
      const i = rnd(0, T.length - 1), j = rnd(0, T.length - 1);
      if (i === j || T[i][1] === T[j][1]) continue;
      const ratio = T[i][1] / T[j][1];
      if (ratio > maxRatio || 1 / ratio > maxRatio) continue;
      const v = rnd(1, 999) / pick(decimals), r = +(v * ratio).toPrecision(12);
      if (r < 0.001 || r > 1e7 || !isNice(r, 4) || !isNice(v, 3)) continue;
      return { v, r, from: T[i][0], to: T[j][0], ratio };
    }
  };
  const how = (from, to, ratio) => ratio >= 1 ? `1 ${from} = ${F(ratio)} ${to}, ona görə ${F(ratio)} dəfə böyüdürük (vururuq)` : `1 ${to} = ${F(1 / ratio)} ${from}, ona görə ${F(1 / ratio)} dəfə kiçildirik (bölürük)`;
  // ordinal suffix: 1-ci, 3-cü, 6-cı, 9-cu, 10-cu, 40-cı ...
  const ord = n => { const d = n % 10, t = n % 100; const suf = d ? ["", "ci", "ci", "cü", "cü", "ci", "cı", "ci", "ci", "cu"][d] : t === 0 ? "cü" : { 10: "cu", 20: "ci", 30: "cu", 40: "cı", 50: "ci", 60: "cı", 70: "ci", 80: "ci", 90: "cı" }[t]; return n + "-" + suf; };
  const MONTHS = [["Yan", "yanvar"], ["Fev", "fevral"], ["Mar", "mart"], ["Apr", "aprel"], ["May", "may"], ["İyun", "iyun"]];
  const DAYS = [["B.e.", "bazar ertəsi"], ["Ç.a.", "çərşənbə axşamı"], ["Ç.", "çərşənbə"], ["C.a.", "cümə axşamı"], ["C.", "cümə"], ["Ş.", "şənbə"], ["B.", "bazar"]];

  const levels = [
    { id: "vahid", ad: "Uzunluq, kütlə, vaxt, sürət", izah: "Böyük vahiddən kiçiyə — vur, kiçikdən böyüyə — böl. 1 saat = 3600 san; 1 m/s = 3,6 km/saat.",
      gen() {
        const kind = pick(["len", "mass", "time", "mixed", "speed"]);
        if (kind === "speed") {
          const k = rnd(1, 12), kmh = 18 * k, ms = 5 * k, to = Math.random() < .5;
          return to ? { text: `${kmh} km/saat neçə m/s-dir?`, answer: ms, unit: "m/s", show: String(ms), tol: 0.01, solution: `1 km/saat = 1000 m / 3600 san = 1/3,6 m/s. ${kmh} : 3,6 = ${ms} m/s.` }
            : { text: `${ms} m/s neçə km/saatdır?`, answer: kmh, unit: "km/saat", show: String(kmh), tol: 0.01, solution: `1 m/s = 3,6 km/saat. ${ms} · 3,6 = ${kmh} km/saat.` };
        }
        if (kind === "mixed") {
          if (Math.random() < .5) { const hh = rnd(1, 9), mm = rnd(1, 59); return { text: `${hh} saat ${mm} dəqiqə neçə dəqiqədir?`, answer: hh * 60 + mm, unit: "dəq", show: String(hh * 60 + mm), tol: 0.01, solution: `${hh} · 60 + ${mm} = ${hh * 60 + mm} dəqiqə.` }; }
          const a = rnd(1, 20), b = rnd(1, 99); return { text: `${a} m ${b} sm neçə metrdir?`, answer: a + b / 100, unit: "m", show: F(a + b / 100), tol: exact(a + b / 100), solution: `${b} sm = ${F(b / 100)} m. ${a} + ${F(b / 100)} = ${F(a + b / 100)} m.` };
        }
        const T = kind === "len" ? LEN : kind === "mass" ? MASS : TIME;
        const c = kind === "time" ? (() => { for (;;) { const i = rnd(0, 3), j = rnd(0, 3); if (i === j) continue; const ratio = TIME[i][1] / TIME[j][1]; const v = ratio > 1 ? rnd(2, 12) / pick([1, 2]) : rnd(1, 20) * TIME[j][1] / TIME[i][1] / pick([1, 2, 4]); const r = v * ratio; if (isNice(v, 2) && isNice(r, 2) && r <= 1e6) return { v, r, from: TIME[i][0], to: TIME[j][0], ratio }; } })() : conv(T, 1e6, [1, 10, 100]);
        return { text: `${F(c.v)} ${c.from} = ? ${c.to}`, answer: c.r, unit: c.to, show: F(c.r), tol: exact(c.r),
          solution: `${how(c.from, c.to, c.ratio)}: ${F(c.v)} ${c.from} = ${F(c.r)} ${c.to}.` };
      } },
    { id: "sahe-hecm", ad: "Sahə və həcm vahidləri", izah: "Uzunluq 10 dəfə → sahə 100 dəfə, həcm 1000 dəfə. 1 ha = 10 000 m², 1 ar = 100 m², 1 l = 1 dm³.",
      gen() {
        const kind = pick(["area", "area", "vol", "vol", "box"]);
        if (kind === "box") {
          const a = rnd(2, 12) * 10, b = rnd(2, 8) * 10, c = rnd(2, 8) * 10, l = a * b * c / 1000;
          return { text: `Akvariumun ölçüləri ${a} sm, ${b} sm və ${c} sm-dir. Onun tutumu neçə litrdir?`, answer: l, unit: "l", show: F(l), tol: exact(l),
            solution: `Həcm: ${a} · ${b} · ${c} = ${a * b * c} sm³. 1 l = 1 dm³ = 1000 sm³: ${a * b * c} : 1000 = ${F(l)} l. (Və ya dm-lə: ${a / 10} · ${b / 10} · ${c / 10} = ${F(l)}.)` };
        }
        const c = kind === "area" ? conv(AREA, 1e6, [1, 10, 100]) : conv(VOL, 1e6, [1, 10, 100]);
        return { text: `${F(c.v)} ${c.from} = ? ${c.to}`, answer: c.r, unit: c.to, show: F(c.r), tol: exact(c.r),
          solution: `${how(c.from, c.to, c.ratio)}: ${F(c.v)} ${c.from} = ${F(c.r)} ${c.to}.` };
      } },
    { id: "orta", ad: "Ədədi orta", izah: "Orta = cəm ÷ say. Naməlum ədəd üçün: cəm = orta · say.",
      gen() {
        const kind = pick(["mean", "mean", "missing", "added", "groups"]);
        if (kind === "mean") {
          let a, m; do { a = Array.from({ length: rnd(4, 7) }, () => rnd(1, 40)); m = sum(a) / a.length; } while (!isNice(m, 1));
          return { text: `Ədədlərin ədədi ortasını tap: ${list(a)}.`, answer: m, show: F(m), tol: exact(m), solution: `Cəm ${sum(a)}, say ${a.length}. ${sum(a)} : ${a.length} = ${F(m)}.` };
        }
        if (kind === "missing") {
          let a, m, x; do { a = Array.from({ length: rnd(3, 6) }, () => rnd(1, 30)); m = rnd(5, 30); x = m * (a.length + 1) - sum(a); } while (x < 1 || x > 60);
          return { text: `${a.length + 1} ədədin ədədi ortası ${m}-dir. Onlardan ${a.length}-i: ${list(a)}. Sonuncu ədədi tap.`.replace(`${m}-dir`, `${m} ədədinə bərabərdir`).replace(`Onlardan ${a.length}-i:`, "Onlardan biri istisna olmaqla:"),
            answer: x, show: String(x), tol: 0.01, solution: `Bütün ədədlərin cəmi: ${m} · ${a.length + 1} = ${m * (a.length + 1)}. Məlumların cəmi ${sum(a)}. Sonuncu: ${m * (a.length + 1)} − ${sum(a)} = ${x}.` };
        }
        if (kind === "added") {
          let n, A, B, x; do { n = rnd(3, 9); A = rnd(5, 30); B = A + pick([-3, -2, -1, 1, 2, 3]); x = (n + 1) * B - n * A; } while (x < 1);
          return { text: `${n} ədədin ədədi ortası ${A} idi. Onlara bir ədəd əlavə edildi və ədədi orta ${B} oldu. Əlavə olunan ədədi tap.`, answer: x, show: String(x), tol: 0.01,
            solution: `Əvvəlki cəm: ${n} · ${A} = ${n * A}. Yeni cəm: ${n + 1} · ${B} = ${(n + 1) * B}. Əlavə olunan: ${(n + 1) * B} − ${n * A} = ${x}.` };
        }
        let n1, n2, m1, m2, m; do { n1 = rnd(5, 20); n2 = rnd(5, 20); m1 = rnd(140, 165); m2 = rnd(140, 170); m = (n1 * m1 + n2 * m2) / (n1 + n2); } while (m1 === m2 || !isNice(m, 1));
        return { text: `Sinifdə ${n1} oğlanın orta boyu ${m1} sm, ${n2} qızın orta boyu ${m2} sm-dir. Bütün sinfin orta boyu neçə sm-dir?`, answer: m, unit: "sm", show: F(m), tol: exact(m),
          solution: `Boyların cəmi: ${n1} · ${m1} + ${n2} · ${m2} = ${n1 * m1 + n2 * m2}. Şagird: ${n1 + n2}. ${n1 * m1 + n2 * m2} : ${n1 + n2} = ${F(m)} sm. (Ortaların ortası (${m1} + ${m2}) : 2 deyil!)` };
      } },
    { id: "median-moda", ad: "Median, moda, ən böyük fərq", izah: "Əvvəl sıraya düz! Median — ortadakı (cüt sayda — iki ortadakının ortası). Moda — ən çox təkrarlanan. Ən böyük fərq = max − min.",
      gen() {
        if (Math.random() < .35) {   // frequency table
          const [title, vals] = pick([["Qiymət (bal)", [2, 3, 4, 5]], ["Ayaqqabı ölçüsü", [36, 37, 38, 39, 40, 41]], ["Ailədə uşaq sayı", [0, 1, 2, 3, 4]]]);
          let cnt, data, ask, ans;
          do { cnt = vals.map(() => rnd(1, 9)); data = vals.flatMap((v, i) => Array(cnt[i]).fill(v)); ask = pick(["mean", "median", "mode"]);
            ans = ask === "mean" ? sum(data) / data.length : ask === "median" ? median(data) : mode(data); } while (ans === null || !isNice(ans, 2));
          const row = (lab, arr) => h("tr", {}, h("th", {}, lab), ...arr.map(v => h("td", {}, String(v))));
          const askT = { mean: "ədədi ortasını", median: "medianını", mode: "modasını" }[ask];
          const text = h("div", {}, h("p", {}, `Cədvəldə hər qiymətin neçə dəfə rast gəldiyi (tezlik) göstərilib. Məlumatların ${askT} tap.`),
            h("div", { class: "tbl" }, h("table", {}, row(title, vals), row("Tezlik", cnt))));
          const n = data.length;
          let run = 0; const cum = vals.map((v, i) => { const a0 = run + 1; run += cnt[i]; return `${v} → ${a0 === run ? ord(run) : ord(a0) + "…" + ord(run)} yer`; });
          const sol = ask === "mean" ? `Cəm: ${vals.map((v, i) => v + "·" + cnt[i]).join(" + ")} = ${sum(data)}. Say: ${n}. ${sum(data)} : ${n} = ${F(ans)}.`
            : ask === "median" ? `Cəmi ${n} qiymət. Ortadakı: ${n % 2 ? ord((n + 1) / 2) + " yer" : ord(n / 2) + " və " + ord(n / 2 + 1) + " yerlər"}. Sıra ilə yerlər: ${cum.join("; ")}. Median ${F(ans)}.`
              : `Ən böyük tezlik ${Math.max(...cnt)} — qiymət ${ans}. Moda ${ans}.`;
          return { text, answer: ans, show: F(ans), tol: exact(ans), solution: sol };
        }
        let a, ask, ans;
        do { a = Array.from({ length: rnd(5, 10) }, () => rnd(1, 30)); ask = pick(["median", "median", "mode", "range", "mm"]);
          const md = mode(a); ans = ask === "median" ? median(a) : ask === "mode" ? md : ask === "range" ? Math.max(...a) - Math.min(...a) : md === null ? null : median(a) - md; } while (ans === null);
        const s = sorted(a), n = a.length;
        const q = { median: "medianını", mode: "modasını", range: "ən böyük fərqini (max − min)", mm: "medianı ilə modasının fərqini (median − moda)" }[ask];
        const medT = `Sıra ilə: ${list(s)}. ${n} ədəd; ${n % 2 ? `ortadakı ${F(median(a))}` : `ortadakı iki: ${s[n / 2 - 1]} və ${s[n / 2]}, median (${s[n / 2 - 1]} + ${s[n / 2]}) : 2 = ${F(median(a))}`}.`;
        const sol = ask === "median" ? medT : ask === "mode" ? `Ən çox təkrarlanan ${ans} (${freq(a).get(ans)} dəfə). Moda ${ans}.` : ask === "range" ? `Ən böyük ${Math.max(...a)}, ən kiçik ${Math.min(...a)}: ${Math.max(...a)} − ${Math.min(...a)} = ${ans}.`
          : `${medT} Moda ${mode(a)}. Fərq: ${F(median(a))} − ${mode(a)} = ${F(ans)}.`;
        return { text: `Məlumatlar: ${list(a)}. Onların ${q} tap.`, answer: ans, show: F(ans), tol: exact(ans), solution: sol };
      } },
    { id: "diaqram", ad: "Diaqramları oxu", izah: "Sütunlu, xətti və dairəvi diaqram. Əvvəl ox üzrə bölgünün qiymətini tap, sonra hesabla.",
      gen() {
        const type = pick(["bar", "bar", "line", "line", "pie"]);
        if (type === "pie") {
          const names = ["Avtobus", "Metro", "Piyada", "Velosiped", "Maşın"], k = rnd(3, 5);
          const u = Array(k).fill(2); for (let i = 0; i < 20 - 2 * k; i++) u[rnd(0, k - 1)]++; const parts = u.map(x => x * 5);
          const N = rnd(2, 25) * 20, i = rnd(0, k - 1); let j; do { j = rnd(0, k - 1); } while (j === i);
          const svg = pie(names.slice(0, k).map((n, t) => `${n} — ${parts[t]}%`), parts, "Şagirdlərin məktəbə gəlmə üsulu");
          const sumIJ = (parts[i] + parts[j]) * N / 100;
          return { text: `Diaqramda ${N} şagirdin məktəbə necə gəldiyi göstərilib. "${names[i]}" və "${names[j]}" üsulları ilə birlikdə neçə şagird gəlir?`, svg, answer: sumIJ, show: String(sumIJ), tol: 0.01,
            solution: `${parts[i]}% + ${parts[j]}% = ${parts[i] + parts[j]}%. ${N} · ${parts[i] + parts[j]}/100 = ${sumIJ}.` };
        }
        let labels, names, step, vals, title, unit;
        if (type === "bar") {
          const C = pick(["months", "classes"]);
          if (C === "months") { const n = rnd(4, 6); labels = MONTHS.slice(0, n).map(m => m[0]); names = MONTHS.slice(0, n).map(m => m[1]); step = pick([5, 10, 20, 50]); title = "Kitabxanadan hər ay götürülən kitablar"; unit = "kitab"; }
          else { const n = rnd(4, 5); labels = ["9A", "9B", "9C", "9Ç", "9D"].slice(0, n); names = labels.slice(); step = pick([2, 4, 5]); title = "Siniflərdə əlaçı şagirdlərin sayı"; unit = "şagird"; }
        } else {
          const C = pick(["temp", "sales"]);
          if (C === "temp") { const n = rnd(5, 7); labels = DAYS.slice(0, n).map(d => d[0]); names = DAYS.slice(0, n).map(d => d[1]); step = 2; title = "Həftə ərzində günorta temperaturu, °C"; unit = "°C"; }
          else { const n = rnd(4, 6); labels = MONTHS.slice(0, n).map(m => m[0]); names = MONTHS.slice(0, n).map(m => m[1]); step = pick([5, 10]); title = "Mağazanın aylıq gəliri, min manat"; unit = "min manat"; }
        }
        const n = labels.length;
        vals = Array.from({ length: n }, () => step * rnd(1, 9));
        while (new Set(vals).size < 3) vals[rnd(0, n - 1)] = step * rnd(1, 9);
        const svg = chart(labels, vals, step, type, title);
        const asks = ["diff", "sum", "range", "above"]; if (isNice(sum(vals) / n, 2)) asks.push("mean", "mean"); if (type === "line") asks.push("jump", "jump");
        const ask = pick(asks), i = rnd(0, n - 1); let j; do { j = rnd(0, n - 1); } while (j === i);
        const head = `Diaqram: ${title.charAt(0).toLowerCase() + title.slice(1)}. `;
        const u = unit === "°C" ? "°C" : " " + unit;
        if (ask === "diff") return { text: head + `${names[i][0].toUpperCase() + names[i].slice(1)} və ${names[j]} üçün göstəricilərin fərqini tap (böyükdən kiçiyi çıx).`, svg,
          answer: Math.abs(vals[i] - vals[j]), show: String(Math.abs(vals[i] - vals[j])), tol: 0.01, solution: `${names[i][0].toUpperCase() + names[i].slice(1)}: ${vals[i]}, ${names[j]}: ${vals[j]}. Fərq: ${Math.abs(vals[i] - vals[j])}.` };
        if (ask === "sum") return { text: head + (unit === "°C" ? "Bütün günlərin temperaturlarının cəmini tap." : `Bütün dövrdə cəmi neçə${u}?`), svg, answer: sum(vals), show: String(sum(vals)), tol: 0.01,
          solution: `${vals.join(" + ")} = ${sum(vals)}.` };
        if (ask === "mean") return { text: head + `Orta ${unit === "°C" ? "temperatur neçə dərəcədir" : unit === "kitab" ? "hər aya neçə kitab düşür" : unit === "şagird" ? "bir sinifdə neçə əlaçı var" : "aylıq gəlir neçə min manatdır"}?`, svg,
          answer: sum(vals) / n, show: F(sum(vals) / n), tol: exact(sum(vals) / n), solution: `(${vals.join(" + ")}) : ${n} = ${sum(vals)} : ${n} = ${F(sum(vals) / n)}.` };
        if (ask === "range") return { text: head + "Ən böyük və ən kiçik qiymətlərin fərqini (ən böyük fərqi) tap.", svg, answer: Math.max(...vals) - Math.min(...vals), show: String(Math.max(...vals) - Math.min(...vals)), tol: 0.01,
          solution: `Ən böyük ${Math.max(...vals)}, ən kiçik ${Math.min(...vals)}: fərq ${Math.max(...vals) - Math.min(...vals)}.` };
        if (ask === "jump") {
          const d = vals.slice(1).map((v, t) => v - vals[t]), best = Math.max(...d);
          if (best <= 0) return { text: head + "Ən böyük və ən kiçik qiymətlərin fərqini (ən böyük fərqi) tap.", svg, answer: Math.max(...vals) - Math.min(...vals), show: String(Math.max(...vals) - Math.min(...vals)), tol: 0.01,
            solution: `Ən böyük ${Math.max(...vals)}, ən kiçik ${Math.min(...vals)}: fərq ${Math.max(...vals) - Math.min(...vals)}.` };
          return { text: head + "Ardıcıl iki nöqtə arasında ən böyük artım nə qədər olub?", svg, answer: best, show: String(best), tol: 0.01,
            solution: `Qonşu fərqlər: ${d.map(x => (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x)).join("; ")}. Ən böyük artım ${best}.` };
        }
        const X = step * rnd(2, 8), c = vals.filter(v => v > X).length;
        return { text: head + `Neçə ${unit === "°C" ? "gündə temperatur" : type === "bar" && unit === "şagird" ? "sinifdə əlaçıların sayı" : "ayda göstərici"} ${X}${unit === "°C" ? "°C" : ""}-dən çox olub?`.replace(`${X}°C-dən çox`, `${X}°C-ni keçib`).replace(`${X}-dən çox olub`, `${X} ədədini keçib`), svg,
          answer: c, show: String(c), tol: 0.01, solution: `${X}-dən böyük qiymətlər: ${vals.filter(v => v > X).join(", ") || "yoxdur"} — cəmi ${c}.`.replace(`${X}-dən böyük`, `${X} ədədindən böyük`) };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Otaq, akvarium, sahə, qiymətlər, sürət. Vahidləri əvvəlcə eyniləşdir.",
      gen() {
        const kind = pick(["grade", "grade", "floor", "field", "train"]);
        if (kind === "grade") {
          let g, need, T; do { g = Array.from({ length: rnd(4, 7) }, () => rnd(3, 5)); need = rnd(3, 5); T = (sum(g) + need) / (g.length + 1); } while (!isNice(T, 2));
          return { text: `Fikrətin riyaziyyatdan qiymətləri: ${list(g)}. Növbəti qiyməti neçə olmalıdır ki, ədədi orta ${F(T)} olsun?`, answer: need, show: String(need), tol: 0.01,
            solution: `${g.length + 1} qiymətin cəmi ${F(T)} · ${g.length + 1} = ${sum(g) + need} olmalıdır. İndiki cəm ${sum(g)}. Lazım olan: ${sum(g) + need} − ${sum(g)} = ${need}.` };
        }
        if (kind === "floor") {
          const [pw, pl] = pick([[20, 100], [25, 100], [50, 50], [40, 50], [30, 30]]), pa = pw * pl / 1e4;
          let a, b; do { a = rnd(6, 16) / 2; b = rnd(6, 16) / 2; } while (!isNice(a * b / pa, 0));
          return { text: `Otağın döşəməsi ${F(a)} m × ${F(b)} m düzbucaqlıdır. Ölçüsü ${pw} sm × ${pl} sm olan plitələrdən neçəsi lazımdır (artıq-əskik olmadan)?`, answer: a * b / pa, show: String(a * b / pa), tol: 0.01,
            solution: `Döşəmə: ${F(a)} · ${F(b)} = ${F(a * b)} m². Plitə: ${pw} · ${pl} = ${pw * pl} sm² = ${F(pa)} m². ${F(a * b)} : ${F(pa)} = ${a * b / pa}.` };
        }
        if (kind === "field") {
          let a, b; do { a = rnd(2, 40) * 10; b = rnd(2, 40) * 10; } while (!isNice(a * b / 1e4, 2));
          return { text: `Düzbucaqlı sahənin ölçüləri ${a} m və ${b} m-dir. Sahə neçə hektardır?`, answer: a * b / 1e4, unit: "ha", show: F(a * b / 1e4), tol: exact(a * b / 1e4),
            solution: `${a} · ${b} = ${a * b} m². 1 ha = 10 000 m²: ${a * b} : 10 000 = ${F(a * b / 1e4)} ha.` };
        }
        const k = rnd(2, 10), ms = 5 * k, t = pick([0.5, 1, 1.5, 2, 2.5, 3]), km = 18 * k * t;
        return { text: `Qatar ${ms} m/s sürətlə ${F(t)} saat hərəkət etdi. Neçə km yol getdi?`, answer: km, unit: "km", show: F(km), tol: exact(km),
          solution: `${ms} m/s = ${ms} · 3,6 = ${18 * k} km/saat. ${18 * k} · ${F(t)} = ${F(km)} km.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Medianın tapılması üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let a, s, n;
        do { n = pick([6, 8]); a = Array.from({ length: n }, () => rnd(1, 40)); s = sorted(a); } while (new Set(a).size < n || (a[n / 2 - 1] + a[n / 2]) === (s[n / 2 - 1] + s[n / 2]));
        const bad = rnd(0, 2), L = bad === 0 ? a : s, x = L[n / 2 - 1], y = L[n / 2];
        const steps = [
          bad === 0 ? `Ədədləri olduğu kimi götürürük: ${list(a)}.` : `Sıraya düzürük: ${list(s)}.`,
          bad === 1 ? `${n} ədəd var; median sıradakı ${ord(n / 2)} ədəddir: ${x}.` : `${n} ədəd var (cüt); ortada iki ədəd: ${x} və ${y}.`,
          bad === 2 ? pick([`Median = ${x} + ${y} = ${x + y}.`, `Median = (${x} + ${y}) : 2 = ${F((x + y) / 2 + pick([1, -1]))}.`]) : bad === 1 ? `Median = ${x}.` : `Median = (${x} + ${y}) : 2 = ${F((x + y) / 2)}.`,
        ];
        const right = median(a);
        const text = h("div", {}, h("p", {}, `Məlumatların medianını tap: ${list(a)}.`), h("ol", { class: "oy-steps" }, ...steps.map(t => h("li", {}, t))));
        const why = [`1-ci addım: median üçün əvvəl ədədləri sıraya düzmək lazımdır: ${list(s)}. Düz cavab ${F(right)}.`,
          `2-ci addım: ${n} cüt ədəddir — ortada bir yox, iki ədəd var (${s[n / 2 - 1]} və ${s[n / 2]}). Median ${F(right)}.`,
          `3-cü addım: median iki ortadakının ədədi ortasıdır: (${s[n / 2 - 1]} + ${s[n / 2]}) : 2 = ${F(right)}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "statistika", title: "Ölçü vahidləri və statistika", fenn: "riyaziyyat", link: "dersler/statistika.html",
      format: "Cavab ədəddir: tam 12, onluq 2,5 (və ya 2.5), çox kiçik ədəd 0,035. Vahidi yazma — o, xananın yanında göstərilib.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["vahid", "sahe-hecm", "sahe-hecm", "orta", "orta", "median-moda", "median-moda", "diaqram", "diaqram", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/statistika.html")) b.push("dersler/statistika.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
