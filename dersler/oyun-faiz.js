// Faiz — mastery game levels (percent of a number, number by its percent, percent change, successive changes,
// mixtures, pie charts, bank interest) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const D = x => { const r = Math.round(x * 1e4) / 1e4; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const frac = (p, q) => { const g = gcd(p, q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const isNice = (x, dp = 2) => Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-7;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const COLORS = ["var(--accent)", "var(--vec)", "var(--adj)", "var(--hyp)", "var(--opp)"];

  // Pie chart with a legend; items: [{name, label}], parts in percent (sum 100).
  function pie(items, parts, aria) {
    const g = sv("svg", { viewBox: "0 0 330 190", class: "oy-svg", role: "img", "aria-label": aria });
    const cx = 92, cy = 95, r = 80; let a0 = -Math.PI / 2;
    parts.forEach((p, i) => {
      const a1 = a0 + p / 100 * 2 * Math.PI;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      g.append(sv("path", { d: `M${cx} ${cy}L${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${p > 50 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`, style: `fill:${COLORS[i]};stroke:var(--sheet);stroke-width:2` }));
      const y = 95 - parts.length * 14 + i * 28;
      g.append(sv("rect", { x: 190, y: y, width: 14, height: 14, rx: 3, style: `fill:${COLORS[i]}` }));
      g.append(sv("text", { x: 211, y: y + 12, class: "oy-lbl" }, items[i].label));
      a0 = a1;
    });
    return g;
  }
  // random split of 100% into k parts, multiples of 5, each ≥ 10%
  const split = k => { const u = Array(k).fill(2); for (let i = 0; i < 20 - 2 * k; i++) u[rnd(0, k - 1)]++; return u.map(x => x * 5); };
  const TOPICS = [
    ["Şagirdlərin sevdiyi idman növləri", "şagird", ["Futbol", "Basketbol", "Voleybol", "Şahmat", "Üzgüçülük"]],
    ["Ailənin aylıq xərcləri", "manat", ["Ərzaq", "Kommunal", "Nəqliyyat", "Geyim", "Digər"]],
    ["Kitabxanadakı kitablar", "kitab", ["Bədii", "Elmi", "Tarix", "Uşaq", "Lüğət"]],
    ["Bağdakı ağaclar", "ağac", ["Alma", "Armud", "Gilas", "Ərik", "Heyva"]],
  ];

  const levels = [
    { id: "faizi", ad: "Ədədin faizi və faizinə görə ədəd", izah: "1% — yüzdə bir hissə. p% = p/100. Ədədin faizi: vur; faizinə görə ədəd: böl.",
      gen() {
        const kind = pick(["conv", "conv", "of", "of", "whole", "whole"]);
        if (kind === "conv") {
          const t = pick(["f2p", "d2p", "p2f"]);
          if (t === "f2p") { const q = pick([2, 4, 5, 8, 10, 20, 25, 40, 50]); let p; do { p = rnd(1, q - 1); } while (gcd(p, q) !== 1); const v = 100 * p / q;
            return { text: `${p}/${q} kəsrini faizlə ifadə et.`, answer: v, unit: "%", show: D(v), tol: 0.001, solution: `${p}/${q} · 100% = ${D(100 * p)} : ${q} = ${D(v)}%.` }; }
          if (t === "d2p") { const v = pick([rnd(1, 99) / 1000, rnd(1, 99) / 100, rnd(101, 250) / 100]); const pv = Math.round(v * 1e5) / 1e3;
            return { text: `${D(v)} onluq kəsrini faizlə ifadə et.`, answer: pv, unit: "%", show: D(pv), tol: 0.001, solution: `Faizə keçmək üçün 100-ə vururuq (vergül 2 rəqəm sağa): ${D(v)} · 100 = ${D(pv)}%.` }; }
          let p; do { p = rnd(2, 98); } while (gcd(p, 100) === 1);
          return { text: `${p}%-i ixtisar olunmuş adi kəsr kimi yaz.`, answer: p / 100, show: frac(p, 100), placeholder: "məs. 3/20", solution: `${p}% = ${p}/100 = ${frac(p, 100)}.` };
        }
        if (kind === "of") {
          const p = pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 120, 150, 2.5, 12.5]); let N; do { N = rnd(2, 60) * pick([4, 5, 10]); } while (!isNice(p * N / 100, 0));
          const v = p * N / 100;
          return { text: `${N} ədədinin ${D(p)}%-ni tap.`, answer: v, show: String(v), tol: 0.01, solution: `${D(p)}% = ${D(p / 100)}. ${N} · ${D(p / 100)} = ${v}.` };
        }
        const p = pick([4, 5, 8, 12, 15, 20, 25, 30, 40, 60, 75, 80, 125, 2.5]); let X; do { X = rnd(2, 80) * pick([4, 5, 10]); } while (!isNice(p * X / 100, 0));
        const A = p * X / 100;
        return { text: `Ədədin ${D(p)}%-i ${A} ədədinə bərabərdir. Ədədi tap.`, answer: X, show: String(X), tol: 0.01, solution: `${D(p)}% → ${A}, onda 1% → ${A} : ${D(p)}; 100% → ${A} : ${D(p)} · 100 = ${X}.` };
      } },
    { id: "nisbet-faiz", ad: "Neçə faizdir? Neçə faiz dəyişdi?", izah: "a ədədi b-nin neçə faizidir: a/b · 100%. Dəyişmə: (yeni − köhnə)/köhnə · 100%. Baza həmişə müqayisə olunan ədəddir.",
      gen() {
        const kind = pick(["part", "change", "change", "more"]);
        const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 12.5, 2.5, 35, 45, 80]);
        let b; do { b = rnd(2, 60) * pick([2, 4, 5, 8]); } while (!isNice(p * b / 100, 0));
        const a = p * b / 100;
        if (kind === "part") return { text: `${a} ədədi ${b} ədədinin neçə faizidir?`, answer: p, unit: "%", show: D(p), tol: 0.001, solution: `${a}/${b} · 100% = ${D(p)}%.` };
        if (kind === "change") {
          const up = Math.random() < .5 || p >= 100, nw = up ? b + a : b - a;
          const C = pick([["Məhsulun qiyməti", "manat"], ["Şəhərin əhalisi", "min nəfər"], ["Fermanın məhsulu", "ton"]]);
          return { text: `${C[0]} ${b} ${C[1]}-dən ${nw} ${C[1]}-ə ${up ? "qalxdı" : "düşdü"}. Neçə faiz ${up ? "artdı" : "azaldı"}?`.replace(/manat-dən/g, "manatdan").replace(/manat-ə/g, "manata").replace(/nəfər-dən/g, "nəfərdən").replace(/nəfər-ə/g, "nəfərə").replace(/ton-dən/g, "tondan").replace(/ton-ə/g, "tona"),
            answer: p, unit: "%", show: D(p), tol: 0.001, solution: `Dəyişmə ${a}; baza — köhnə qiymət ${b}. ${a}/${b} · 100% = ${D(p)}%.` };
        }
        const more = Math.random() < .5 && p < 100, A = more ? b + a : b - a;
        return { text: `${A} ədədi ${b} ədədindən neçə faiz ${more ? "çoxdur" : "azdır"}?`, answer: p, unit: "%", show: D(p), tol: 0.001,
          solution: `Müqayisə ${b} ilə aparılır — baza ${b}. Fərq ${a}; ${a}/${b} · 100% = ${D(p)}%.` };
      } },
    { id: "ardicil", ad: "Ardıcıl faiz dəyişmələri", izah: "Hər faiz yeni (dəyişmiş) qiymətdən hesablanır. Vurğu: +p% → ·(1 + p/100), −q% → ·(1 − q/100).",
      gen() {
        const kind = pick(["net", "net", "final", "back", "ofof", "undo"]);
        const M = (p, up) => 1 + (up ? p : -p) / 100;
        if (kind === "net" || kind === "final") {
          let p, q, u1, u2, net;
          do { p = rnd(1, 10) * 5; q = rnd(1, 10) * 5; u1 = Math.random() < .6; u2 = Math.random() < .5; net = Math.round((M(p, u1) * M(q, u2) - 1) * 1e6) / 1e4; } while (!net || !isNice(net, 2) || (!u2 && q >= 100));
          const w = (up, x) => up ? `${x}% artırıldı` : `${x}% endirildi`;
          if (kind === "net") return { text: `Malın qiyməti əvvəl ${w(u1, p)}, sonra yeni qiymət ${w(u2, q)}. Qiymət ilkinə nisbətən neçə faiz dəyişdi? (Artımı müsbət, azalmanı mənfi yaz.)`,
            answer: net, unit: "%", show: D(net), tol: 0.001,
            solution: `${D(M(p, u1))} · ${D(M(q, u2))} = ${D(M(p, u1) * M(q, u2))}. Deməli, qiymət ${net > 0 ? D(net) + "% artdı" : D(-net) + "% azaldı"}. Faizləri sadəcə toplamaq olmaz: ${u1 ? "+" : "−"}${p} ${u2 ? "+" : "−"} ${q} ≠ ${D(net)}.` };
          let P; do { P = rnd(1, 20) * 50; } while (!isNice(P * M(p, u1) * M(q, u2), 2));
          const mid = P * M(p, u1), fin = P * M(p, u1) * M(q, u2);
          return { text: `Malın qiyməti ${P} manat idi. Əvvəl ${w(u1, p)}, sonra yeni qiymət ${w(u2, q)}. Son qiymət neçə manatdır?`, answer: fin, unit: "manat", show: D(fin), tol: 0.001,
            solution: `${P} · ${D(M(p, u1))} = ${D(mid)}; ${D(mid)} · ${D(M(q, u2))} = ${D(fin)} manat.` };
        }
        if (kind === "back") {
          const p = pick([10, 20, 25, 30, 40, 50, 60, 15, 5]), up = Math.random() < .6; let X; do { X = rnd(2, 40) * 20; } while (!isNice(X * M(p, up), 0));
          const Y = X * M(p, up);
          return { text: `Qiymət ${p}% ${up ? "artdıqdan" : "endirildikdən"} sonra ${Y} manat oldu. İlkin qiymət neçə manat idi?`, answer: X, unit: "manat", show: String(X), tol: 0.01,
            solution: `Yeni qiymət ilkin qiymətin ${up ? 100 + p : 100 - p}%-dir: ${Y} : ${D(M(p, up))} = ${X}. (${Y}-nin ${p}%-ni ${up ? "çıxmaq" : "əlavə etmək"} səhvdir — faiz ilkin qiymətdən götürülüb.)`.replace(`${Y}-nin`, `Yeni qiymətin`) };
        }
        if (kind === "ofof") {
          const p = pick([20, 25, 40, 50, 60, 75, 80]), q = pick([10, 20, 25, 40, 50, 75]); let N; do { N = rnd(1, 40) * 20; } while (!isNice(N * p * q / 1e4, 0));
          const C = pick([["Məktəbdə", "şagird var", "qızdır", "qızların", "şahmat oynayır", "Neçə qız şahmat oynayır?"], ["Bağda", "ağac var", "meyvə ağacıdır", "meyvə ağaclarının", "almadır", "Bağda neçə alma ağacı var?"], ["Zavodda", "işçi çalışır", "qadındır", "qadınların", "mühəndisdir", "Neçə qadın mühəndis var?"]]);
          const v = N * p * q / 1e4;
          return { text: `${C[0]} ${N} ${C[1]}. Onların ${p}%-i ${C[2]}, ${C[3]} da ${q}%-i ${C[4]}. ${C[5]}`,
            answer: v, show: String(v), tol: 0.01, solution: `Faizin faizi: ${N} · ${D(p / 100)} = ${N * p / 100}; ${N * p / 100} · ${D(q / 100)} = ${v}. Və ya: ${p}%-in ${q}%-i = ${D(p * q / 100)}%, ${N} · ${D(p * q / 100)}/100 = ${v}.` };
        }
        const [p, ans] = pick([[25, 20], [100, 50], [150, 60], [300, 75], [400, 80], [60, 37.5], [20, 50 / 3], [50, 100 / 3]]);
        const nice = isNice(ans, 2);
        return { text: `Qiymət ${p}% artırıldı. Yeni qiyməti neçə faiz endirmək lazımdır ki, ilkin qiymət alınsın?${nice ? "" : " (Kəsr kimi yaz.)"}`, answer: ans, unit: "%", show: nice ? D(ans) : frac(Math.round(ans * 3), 3),
          solution: `İlkin qiymət 100 olsun → yeni qiymət ${100 + p}. Endirim ${p} vahid olmalıdır, baza isə yeni qiymət (${100 + p}): ${p}/${100 + p} · 100% = ${nice ? D(ans) : frac(Math.round(ans * 3), 3)}%, ${p}% yox.` };
      } },
    { id: "qarisiq", ad: "Qarışıqlar və qatılıq", izah: "Qatılıq = maddə ÷ bütün məhlul · 100%. Su əlavə olunanda (və ya buxarlananda) maddənin özü dəyişmir.",
      gen() {
        const kind = pick(["water", "mix", "add", "dry"]);
        if (kind === "water") {
          let m, c, w, s, nc; do { m = rnd(2, 20) * 50; c = pick([5, 10, 12, 15, 20, 25, 30, 40]); w = rnd(1, 10) * 50; s = m * c / 100; nc = s / (m + w) * 100; } while (!isNice(s, 0) || !isNice(nc, 1));
          return { text: `${m} q ${c}%-li duz məhluluna ${w} q su əlavə edildi. Yeni məhlulun qatılığı neçə faizdir?`, answer: nc, unit: "%", show: D(nc), tol: 0.001,
            solution: `Duz: ${m} · ${D(c / 100)} = ${s} q (dəyişmir). Yeni kütlə ${m + w} q. ${s}/${m + w} · 100% = ${D(nc)}%.` };
        }
        if (kind === "mix") {
          let m1, m2, c1, c2, r; do { m1 = rnd(1, 10) * 50; m2 = rnd(1, 10) * 50; c1 = rnd(1, 12) * 5; c2 = rnd(1, 12) * 5; r = (m1 * c1 + m2 * c2) / (m1 + m2); } while (c1 === c2 || !isNice(r, 1));
          return { text: `${m1} q ${c1}%-li və ${m2} q ${c2}%-li şəkər məhlulu qarışdırıldı. Qarışığın qatılığı neçə faizdir?`, answer: r, unit: "%", show: D(r), tol: 0.001,
            solution: `Şəkər: ${D(m1 * c1 / 100)} + ${D(m2 * c2 / 100)} = ${D((m1 * c1 + m2 * c2) / 100)} q. Kütlə: ${m1 + m2} q. ${D((m1 * c1 + m2 * c2) / 100)}/${m1 + m2} · 100% = ${D(r)}%.` };
        }
        if (kind === "add") {
          let m, c1, c2, s, tot; do { m = rnd(1, 20) * 50; c1 = rnd(2, 12) * 5; c2 = rnd(1, 10) * 2; s = m * c1 / 100; tot = s * 100 / c2; } while (c2 >= c1 || !isNice(s, 0) || !isNice(tot, 0));
          return { text: `${m} q ${c1}%-li duz məhlulu var. Qatılığın ${c2}% olması üçün ona neçə qram su əlavə etmək lazımdır?`, answer: tot - m, unit: "q", show: String(tot - m), tol: 0.01,
            solution: `Duz: ${m} · ${D(c1 / 100)} = ${s} q. Bu ${c2}% olmalıdır: bütün məhlul = ${s} : ${D(c2 / 100)} = ${tot} q. Su: ${tot} − ${m} = ${tot - m} q.` };
        }
        let a, b, M, F; do { a = pick([70, 75, 80, 85, 90, 95]); b = pick([10, 15, 20, 25, 30, 40]); M = rnd(1, 20) * 5; F = M * (100 - b) / (100 - a); } while (!isNice(F, 1));
        const C = pick([["Təzə üzüm", "kişmiş", "üzüm"], ["Təzə göbələk", "qurudulmuş göbələk", "təzə göbələk"], ["Təzə ərik", "quru ərik (qaysı)", "təzə ərik"]]);
        return { text: `${C[0]} kütləcə ${a}% sudan ibarətdir, ${C[1]} isə ${b}% sudan. ${M} kq ${C[1]} almaq üçün neçə kq ${C[2]} lazımdır?`, answer: F, unit: "kq", show: D(F), tol: 0.001,
          solution: `Quru maddə dəyişmir. ${M} kq ${C[1]}: quru maddə ${100 - b}%, yəni ${M} · ${D((100 - b) / 100)} = ${D(M * (100 - b) / 100)} kq. Təzədə bu ${100 - a}%-dir: ${D(M * (100 - b) / 100)} : ${D((100 - a) / 100)} = ${D(F)} kq.` };
      } },
    { id: "diaqram", ad: "Dairəvi diaqram", izah: "Bütün dairə = 100% = 360°. 1% = 3,6°. Sektorun payını cəmə vur.",
      gen() {
        const [title, unit, names] = pick(TOPICS), k = rnd(3, 5), parts = split(k), cats = names.slice(0, k);
        const kind = pick(["count", "count", "angle", "fromOne", "diff", "fromAngle"]);
        const i = rnd(0, k - 1); let j; do { j = rnd(0, k - 1); } while (j === i);
        if (kind === "fromAngle") {
          const svg = pie(cats.map((n, t) => ({ label: `${n} — ${parts[t] * 3.6}°` })), parts, title);
          return { text: `Diaqram: ${title.toLowerCase()} (sektorların bucaqları göstərilib). "${cats[i]}" neçə faizdir?`, svg, answer: parts[i], unit: "%", show: String(parts[i]), tol: 0.01,
            solution: `360° — 100%, 1% = 3,6°. ${parts[i] * 3.6} : 3,6 = ${parts[i]}%.` };
        }
        const svg = pie(cats.map((n, t) => ({ label: `${n} — ${parts[t]}%` })), parts, title);
        const N = rnd(2, 25) * 20, cnt = t => N * parts[t] / 100;
        const u = unit === "manat" ? " manat" : "";
        const head = unit === "manat" ? `Diaqram: ailənin aylıq xərcləri (cəmi ${N} manat).` : `Diaqram: ${title.toLowerCase()} (cəmi ${N} ${unit}).`;
        if (kind === "count") return { text: `${head} "${cats[i]}" ${unit === "manat" ? "üçün neçə manat xərclənib" : `payına neçə ${unit} düşür`}?`, svg, answer: cnt(i), show: String(cnt(i)), tol: 0.01,
          solution: `${N} · ${parts[i]}/100 = ${cnt(i)}${u}.` };
        if (kind === "angle") return { text: `Diaqram: ${title.toLowerCase()}. "${cats[i]}" sektorunun mərkəzi bucağı neçə dərəcədir?`, svg, answer: parts[i] * 3.6, unit: "°", show: D(parts[i] * 3.6), tol: 0.01,
          solution: `100% = 360°, 1% = 3,6°. ${parts[i]} · 3,6 = ${D(parts[i] * 3.6)}°.` };
        if (kind === "diff") return { text: `${head} "${cats[i]}" payı "${cats[j]}" payından neçə ${unit} ${parts[i] >= parts[j] ? "çoxdur" : "azdır"}?`, svg,
          answer: Math.abs(cnt(i) - cnt(j)), show: String(Math.abs(cnt(i) - cnt(j))), tol: 0.01,
          solution: `Fərq ${Math.abs(parts[i] - parts[j])}%: ${N} · ${Math.abs(parts[i] - parts[j])}/100 = ${Math.abs(cnt(i) - cnt(j))}${u}.` };
        return { text: `Diaqram: ${title.toLowerCase()}. "${cats[i]}" payına ${cnt(i)}${unit === "manat" ? " manat" : " " + unit} düşür. "${cats[j]}" payına neçə${unit === "manat" ? " manat" : " " + unit} düşür?`, svg,
          answer: cnt(j), show: String(cnt(j)), tol: 0.01,
          solution: `${parts[i]}% → ${cnt(i)}, onda 1% → ${D(cnt(i) / parts[i])}, cəmi ${N}. "${cats[j]}": ${N} · ${parts[j]}/100 = ${cnt(j)}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Bank faizi, endirim, vergi, imtahan. Sadə faiz: faiz hər il ilkin məbləğdən. Mürəkkəb: hər il yeni məbləğdən.",
      gen() {
        const kind = pick(["simple", "simple", "compound", "discount", "tax", "exam"]);
        if (kind === "simple") {
          const P = rnd(1, 50) * 100, p = pick([4, 5, 6, 8, 10, 12, 15]), n = rnd(2, 5), I = P * p * n / 100, full = Math.random() < .6;
          return { text: `Bank illik ${p}% sadə faizlə əmanət qəbul edir. ${P} manat ${n} il qoyulsa, ${full ? "müddətin sonunda hesabda neçə manat olar" : "cəmi neçə manat faiz gəliri alınar"}?`,
            answer: full ? P + I : I, unit: "manat", show: String(full ? P + I : I), tol: 0.01,
            solution: `Sadə faiz: hər il ${P} · ${p}/100 = ${P * p / 100} manat. ${n} ildə ${I} manat.` + (full ? ` Hesabda ${P} + ${I} = ${P + I} manat.` : "") };
        }
        if (kind === "compound") {
          const P = rnd(1, 30) * 100, p = pick([5, 10, 20]), F = Math.round(P * (1 + p / 100) ** 2 * 100) / 100;
          return { text: `Bank illik ${p}% verir, faiz hər ilin sonunda hesaba əlavə olunur (mürəkkəb faiz). ${P} manat 2 ildən sonra neçə manat olar?`, answer: F, unit: "manat", show: D(F), tol: 0.001,
            solution: `1-ci il: ${P} · ${D(1 + p / 100)} = ${D(P * (1 + p / 100))}. 2-ci il: ${D(P * (1 + p / 100))} · ${D(1 + p / 100)} = ${D(F)} manat. (Sadə faizdən çoxdur, çünki 2-ci il faiz faizə də hesablanır.)` };
        }
        if (kind === "discount") {
          const d = pick([10, 15, 20, 25, 30, 40, 50]); let X; do { X = rnd(2, 60) * 10; } while (!isNice(X * (100 - d) / 100, 0));
          const Y = X * (100 - d) / 100;
          if (Math.random() < .5) return { text: `Gödəkçə ${X} manatdır. Endirim ${d}%. Gödəkçə endirimlə neçə manata satılır?`, answer: Y, unit: "manat", show: String(Y), tol: 0.01,
            solution: `Ödənilən: ${100 - d}%. ${X} · ${D((100 - d) / 100)} = ${Y} manat.` };
          return { text: `${d}% endirimdən sonra gödəkçə ${Y} manata satılır. Endirimə qədər qiyməti neçə manat idi?`, answer: X, unit: "manat", show: String(X), tol: 0.01,
            solution: `${Y} manat ilkin qiymətin ${100 - d}%-dir: ${Y} : ${D((100 - d) / 100)} = ${X} manat.` };
        }
        if (kind === "tax") {
          const t = pick([10, 14, 20, 25]); let W; do { W = rnd(4, 30) * 50; } while (!isNice(W * (100 - t) / 100, 0));
          return { text: `Əmək haqqından ${t}% vergi tutulur. İşçinin əlinə ${W * (100 - t) / 100} manat çatır. Vergidən əvvəl əmək haqqı neçə manatdır?`, answer: W, unit: "manat", show: String(W), tol: 0.01,
            solution: `Əlinə çatan ${100 - t}%-dir: ${W * (100 - t) / 100} : ${D((100 - t) / 100)} = ${W} manat.` };
        }
        const n = pick([20, 25, 30, 40, 50, 60]); let p; do { p = rnd(10, 19) * 5; } while (!isNice(n * p / 100, 0));
        return { text: `Testdə ${n} sual var. Fikrət sualların ${p}%-ni düz həll etdi. Neçə sualı səhv və ya boş qoydu?`, answer: n - n * p / 100, show: String(n - n * p / 100), tol: 0.01,
          solution: `Düz: ${n} · ${D(p / 100)} = ${n * p / 100}. Qalan: ${n} − ${n * p / 100} = ${n - n * p / 100} (və ya ${100 - p}% · ${n}).` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let P, p, q; do { P = rnd(2, 20) * 50; p = rnd(1, 5) * 10; q = rnd(1, 5) * 10; } while (!isNice(P * (1 + p / 100) * (1 - q / 100), 2));
        const bad = rnd(0, 2);
        let mid = P * (1 + p / 100);
        const s1 = bad === 0 ? `Artımdan sonra: ${P} + ${p} = ${P + p} manat.` : `Artımdan sonra: ${P} · ${D(1 + p / 100)} = ${D(mid)} manat.`;
        if (bad === 0) mid = P + p;
        const cut = bad === 1 ? P * q / 100 : mid * q / 100;
        const s2 = bad === 1 ? `Endirim: ${P}-in ${q}%-i = ${D(cut)} manat.` : `Endirim: ${D(mid)}-in ${q}%-i = ${D(cut)} manat.`;
        const fin = mid - cut;
        const s3 = bad === 2 ? pick([`Son qiymət: ${D(mid)} + ${D(cut)} = ${D(mid + cut)} manat.`, `Faizlər: +${p}% − ${q}% = ${S(p - q)}%, son qiymət ${D(P * (1 + (p - q) / 100))} manat.`]) : `Son qiymət: ${D(mid)} − ${D(cut)} = ${D(fin)} manat.`;
        const steps = [s1, s2, s3].map(s => s.replace(/(\d)-in /g, "$1 manatın "));
        const right = P * (1 + p / 100) * (1 - q / 100);
        const text = h("div", {}, h("p", {}, `Malın qiyməti ${P} manat idi. Əvvəl ${p}% artırıldı, sonra yeni qiymət ${q}% endirildi. Son qiymət neçə manatdır?`),
          h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        const why = [`1-ci addım: artım ${p} manat deyil, ${P} manatın ${p}%-idir. Yeni qiymət: ${P} · ${D(1 + p / 100)} = ${D(P * (1 + p / 100))} manat. Düz cavab ${D(right)} manat.`,
          `2-ci addım: endirim yeni qiymətdən (${D(P * (1 + p / 100))} manat) hesablanır, ilkindən yox. Düz cavab ${D(right)} manat.`,
          `3-cü addım: son qiymət = ${D(mid)} − ${D(cut)} = ${D(fin)} manat. Endirimi əlavə etmək də, faizləri sadəcə toplamaq da səhvdir.`][bad];
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
      key: "faiz", title: "Faiz", fenn: "riyaziyyat", link: "dersler/faiz.html",
      format: "Cavab ədəddir, % işarəsini yazma: 25 (yəni 25%), onluq 12,5 (və ya 12.5), kəsr 3/20. Azalma soruşulanda mənfi: −4.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["faizi", "faizi", "nisbet-faiz", "nisbet-faiz", "ardicil", "ardicil", "qarisiq", "diaqram", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/faiz.html")) b.push("dersler/faiz.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
