// Kvadrat tənliyə gətirilən və sadə irrasional tənliklər — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const S = n => n < 0 ? "−" + (-n) : String(n);
  // polynomial from [coef, "x²"|"x"|""] terms: [[1,"x²"],[-5,"x"],[6,""]] → "x² − 5x + 6"
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const lin = p => poly([[1, "x"], [-p, ""]]);                       // x − p
  const rad = (a, b) => a < 0 && b > 0 ? `${b} − ${a === -1 ? "" : -a}x` : poly([[a, "x"], [b, ""]]);   // ax + b, written "7 − 2x" when nicer
  const sq = e => /^[x0-9]+$/.test(e) ? "√" + e : "√(" + e + ")";
  const distinct = (n, a, b, not = []) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v) && !not.includes(v)) out.push(v); } return out; };
  const isSq = t => t >= 0 && Number.isInteger(Math.sqrt(t));
  const rootShow = t => isSq(t) ? String(Math.sqrt(t)) : "√" + t;     // √t, simplified only for perfect squares
  const list = rs => rs.slice().sort((a, b) => a - b).map(S).join("; ");
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26]];

  // x from t = x² (t ≥ 0 gives ±√t, t = 0 gives 0, t < 0 gives nothing)
  const fromT = t => t > 0 ? `x² = ${t} → x = ±${rootShow(t)}` : t === 0 ? "x² = 0 → x = 0" : `x² = ${S(t)} — kök yoxdur`;
  const countT = t => t > 0 ? 2 : t === 0 ? 1 : 0;

  const levels = [
    { id: "bikv", ad: "Bikvadrat tənlik", izah: "t = x² əvəz et (t ≥ 0). Hər müsbət t iki kök verir, t = 0 — bir kök, mənfi t — heç biri.",
      gen() {
        const T = [-9, -4, -1, 0, 1, 4, 9, 16, 25, 36, 1, 4, 9, 16, 2, 3, 5];
        let t1, t2; do { t1 = pick(T); t2 = pick(T); } while (t1 === t2);
        const b = -(t1 + t2), c = t1 * t2, eq = poly([[1, "x⁴"], [b, "x²"], [c, ""]]) + " = 0";
        const steps = `t = x²: ${poly([[1, "t²"], [b, "t"], [c, ""]])} = 0 → t = ${S(Math.min(t1, t2))}, t = ${S(Math.max(t1, t2))}. ${fromT(Math.min(t1, t2))}; ${fromT(Math.max(t1, t2))}.`;
        const tm = Math.max(t1, t2);
        if (tm > 0 && Math.random() < .5) return { text: `${eq}. Tənliyin ən böyük kökünü tap.`, answer: Math.sqrt(tm), show: rootShow(tm), placeholder: "məs. 3 və ya √5",
          solution: steps + ` Ən böyük kök: ${rootShow(tm)}.` };
        const n = countT(t1) + countT(t2);
        return { text: `${eq}. Tənliyin neçə kökü var?`, answer: n, show: String(n), tol: 0.01, solution: steps + ` Köklərin sayı: ${n}.` };
      } },
    { id: "evez", ad: "Yeni dəyişən", izah: "Təkrarlanan ifadəni t ilə əvəz et, t-ni tap, sonra x-ə qayıt. Cavab x-lərə aiddir!",
      gen() {
        const ask = pick(["count", "big", "sum"]);
        let eq, steps, xs;
        if (Math.random() < .55) { // t = x² + px
          const p = pick([-1, 1]) * rnd(1, 5), u = `(${poly([[1, "x²"], [p, "x"]])})`;
          const m1 = rnd(-5, 5); let t1 = m1 * (m1 + p), t2;
          if (Math.random() < .3) t2 = -(Math.floor(p * p / 4) + rnd(1, 4));        // x² + px = t2 has no roots
          else { let m2; do { m2 = rnd(-5, 5); t2 = m2 * (m2 + p); } while (t2 === t1); }
          eq = poly([[1, u + "²"], [-(t1 + t2), u], [t1 * t2, ""]]) + " = 0";
          const solveT = t => { const D = p * p + 4 * t; if (D < 0) return []; const r = Math.sqrt(D); return [...new Set([(-p - r) / 2, (-p + r) / 2])]; };
          const part = t => { const r = solveT(t); return `${poly([[1, "x²"], [p, "x"], [-t, ""]])} = 0 → ` + (r.length ? "x = " + list(r) : "D < 0, kök yoxdur"); };
          xs = [...new Set([...solveT(t1), ...solveT(t2)])];
          steps = `t = ${u.slice(1, -1)}: ${poly([[1, "t²"], [-(t1 + t2), "t"], [t1 * t2, ""]])} = 0 → t = ${S(t1)}, t = ${S(t2)}. ${part(t1)}; ${part(t2)}.`;
        } else { // t = (x + k)², t ≥ 0
          const k = pick([-1, 1]) * rnd(1, 5), u = `(${lin(-k)})`;
          let t1, t2; do { t1 = pick([-4, -1, 1, 4, 9, 16, 25]); t2 = pick([-9, -4, 1, 4, 9, 16]); } while (t1 === t2 || (t1 < 0 && t2 < 0));
          eq = poly([[1, u + "⁴"], [-(t1 + t2), u + "²"], [t1 * t2, ""]]) + " = 0";
          const solveT = t => t < 0 ? [] : [-k - Math.sqrt(t), -k + Math.sqrt(t)];
          const part = t => t < 0 ? `${u}² = ${S(t)} — kök yoxdur` : `${lin(-k)} = ±${Math.sqrt(t)} → x = ${list(solveT(t))}`;
          xs = [...solveT(t1), ...solveT(t2)];
          steps = `t = ${u}² ≥ 0: ${poly([[1, "t²"], [-(t1 + t2), "t"], [t1 * t2, ""]])} = 0 → t = ${S(t1)}, t = ${S(t2)}. ${part(t1)}; ${part(t2)}.`;
        }
        const n = xs.length, big = Math.max(...xs), sum = xs.reduce((a, b) => a + b, 0);
        const word = { count: "Tənliyin neçə kökü var?", big: "Ən böyük kökü tap.", sum: "Bütün köklərin cəmini tap." }[ask];
        const ans = ask === "count" ? n : ask === "big" ? big : sum;
        const tail = ask === "count" ? `Köklərin sayı: ${n}.` : ask === "big" ? `Köklər: ${list(xs)}. Ən böyüyü: ${S(big)}.` : `Köklər: ${list(xs)}. Cəm: ${S(sum)}.`;
        return { text: `${eq}. ${word}`, answer: ans, show: S(ans), tol: 0.01, solution: steps + " " + tail };
      } },
    { id: "kok1", ad: "√(ax + b) = c", izah: "Kök heç vaxt mənfi olmur. c ≥ 0 olsa — kvadrata yüksəlt: ax + b = c².",
      gen() {
        const a = pick([1, 2, 3, 4, 5, -1, -2, -3]), x = rnd(-8, 12), c = rnd(1, 7), b = c * c - a * x, R = sq(rad(a, b));
        const k = Math.random() < .4 ? pick([-1, 1]) * rnd(1, 6) : 0, lhs = k ? `${R} ${k < 0 ? "−" : "+"} ${Math.abs(k)}` : R;
        if (Math.random() < .3) { // count: 0 or 1
          const neg = Math.random() < .5, cc = neg ? -rnd(1, 6) : c;
          const steps = k ? `${R} = ${S(cc + k)} ${k < 0 ? "+" : "−"} ${Math.abs(k)} = ${S(cc)}. ` : "";
          return { text: `${lhs} = ${S(cc + k)}. Tənliyin neçə kökü var?`, answer: neg ? 0 : 1, show: neg ? "0" : "1", tol: 0.01,
            solution: steps + (neg ? `Kvadrat kök mənfi ola bilməz (${R} ≥ 0), sağ tərəf isə ${S(cc)}. Kök yoxdur: 0.` : `Sağ tərəf ${cc} ≥ 0 → ${rad(a, b)} = ${cc * cc} → x = ${S(x)}. Bir kök.`) };
        }
        return { text: `${lhs} = ${S(c + k)}. x = ?`, answer: x, show: S(x), tol: 0.01,
          solution: (k ? `${R} = ${S(c + k)} ${k < 0 ? "+" : "−"} ${Math.abs(k)} = ${c}. ` : "") + `Kvadrata yüksəlt: ${rad(a, b)} = ${c * c} → ${poly([[a, "x"]])} = ${S(c * c - b)} → x = ${S(x)}. Yoxla: ${sq(String(c * c))} = ${c} ✓.` };
      } },
    { id: "kok2", ad: "√f = g: yoxla!", izah: "Kvadrata yüksəldəndə artıq kök yarana bilər. Sağ tərəf ≥ 0 olmalıdır — hər kökü yoxla.",
      gen() {
        const kind = pick(["xb", "ax", "ax", "sub"]);
        if (kind === "xb") { // √(x + a) = x − b: valid b + k, extraneous b + 1 − k
          const k = rnd(2, 6), b = rnd(-3, 6), a = k * (k - 1) - b, good = b + k, bad = b + 1 - k;
          const cnt = Math.random() < .25;
          return { text: `${sq(lin(-a))} = ${lin(b)}. ${cnt ? "Tənliyin neçə kökü var?" : "Tənliyin kökünü tap."}`, answer: cnt ? 1 : good, show: cnt ? "1" : S(good), tol: 0.01,
            solution: `Şərt: ${lin(b)} ≥ 0, yəni x ≥ ${S(b)}. Kvadrata yüksəlt: ${lin(-a)} = ${poly([[1, "x²"], [-2 * b, "x"], [b * b, ""]])} → ${poly([[1, "x²"], [-(2 * b + 1), "x"], [b * b - a, ""]])} = 0 → x = ${S(good)}, x = ${S(bad)}. x = ${S(bad)} olanda sağ tərəf ${S(1 - k)} < 0 — atılır. ` + (cnt ? "Bir kök." : `Cavab: ${S(good)}.`) };
        }
        if (kind === "ax") { // √(ax + b) = x, roots r1 > 0 and r2
          const r1 = rnd(1, 9); let r2; do { r2 = rnd(-6, 8); } while (r2 === r1 || r2 === -r1);
          const a = r1 + r2, b = -r1 * r2, valid = [r1, r2].filter(r => r >= 0);
          const steps = `Şərt: x ≥ 0. Kvadrata yüksəlt: ${rad(a, b)} = x² → ${poly([[1, "x²"], [-a, "x"], [-b, ""]])} = 0 → x = ${S(r1)}, x = ${S(r2)}. ` + (r2 < 0 ? `x = ${S(r2)} < 0 — atılır.` : "İkisi də ≥ 0, ikisi də kökdür.");
          if (valid.length === 1) return { text: `${sq(rad(a, b))} = x. Tənliyin kökünü tap.`, answer: r1, show: S(r1), tol: 0.01, solution: steps + ` Cavab: ${r1}.` };
          const ask = pick(["sum", "count", "big"]), ans = ask === "sum" ? r1 + r2 : ask === "count" ? 2 : Math.max(r1, r2);
          return { text: `${sq(rad(a, b))} = x. ${{ sum: "Köklərin cəmini tap.", count: "Tənliyin neçə kökü var?", big: "Böyük kökü tap." }[ask]}`, answer: ans, show: S(ans), tol: 0.01, solution: steps + ` Cavab: ${ans}.` };
        }
        // x + p√x + q = 0 with t = √x ≥ 0
        const t1 = rnd(1, 7); let t2; do { t2 = rnd(-6, 7); } while (t2 === t1 || t2 === -t1);
        const p = -(t1 + t2), q = t1 * t2, valid = [t1, t2].filter(t => t >= 0).map(t => t * t);
        const steps = `t = √x ≥ 0, x = t²: ${poly([[1, "t²"], [p, "t"], [q, ""]])} = 0 → t = ${S(t1)}, t = ${S(t2)}. ` + (t2 < 0 ? `t = ${S(t2)} < 0 — atılır. x = ${t1}² = ${t1 * t1}.` : `İkisi də ≥ 0: x = ${valid.join(" və x = ")}.`);
        const eq = poly([[1, "x"], [p, "√x"], [q, ""]]) + " = 0";
        if (valid.length === 1) return { text: `${eq}. Tənliyin kökünü tap.`, answer: valid[0], show: String(valid[0]), tol: 0.01, solution: steps };
        const s = valid[0] + valid[1];
        return { text: `${eq}. Köklərin cəmini tap.`, answer: s, show: String(s), tol: 0.01, solution: steps + ` Cəm: ${s}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const k = rnd(2, 5), b = rnd(1, 5), a = k * (k - 1) - b, good = b + k, bad = b + 1 - k;
        const quad = poly([[1, "x²"], [-(2 * b + 1), "x"], [b * b - a, ""]]);
        const steps = [
          `1) Kvadrata yüksəldirik: ${lin(-a)} = x² − ${2 * b}x + ${b * b}.`,
          `2) ${quad} = 0 → x₁ = ${S(good)}, x₂ = ${S(bad)}.`,
          `3) Yoxlama: x = ${S(bad)} olanda sağ tərəf ${S(bad - b)} < 0 — atılır. Cavab: x = ${S(good)}.`,
        ];
        const which = rnd(0, 2);
        if (which === 0) steps[0] = pick([`1) Kvadrata yüksəldirik: ${lin(-a)} = x² − ${b * b}.`, `1) Kvadrata yüksəldirik: ${lin(-a)} = x² + ${b * b}.`]);
        if (which === 1) steps[1] = `2) ${quad} = 0 → x₁ = ${S(-good)}, x₂ = ${S(-bad)}.`;
        if (which === 2) steps[2] = pick([`3) Hər iki kök yarayır. Cavab: x = ${S(good)} və x = ${S(bad)}.`, `3) Yoxlama: x = ${S(good)} atılır. Cavab: x = ${S(bad)}.`]);
        const text = h("div", {}, h("p", {}, `Tənlik: ${sq(lin(-a))} = ${lin(b)}.`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st.slice(3)))));
        const why = [`1-ci addım: (x − ${b})² = x² − ${2 * b}x + ${b * b}. Ortadakı 2ab həddi unudulmamalıdır.`,
          `2-ci addım: ${quad} = 0-ın kökləri ${S(good)} və ${S(bad)}-dir (cəm ${2 * b + 1}, hasil ${S(b * b - a)}).`,
          `3-cü addım: x = ${S(bad)} olanda sağ tərəf x − ${b} = ${S(bad - b)} mənfidir, kök isə mənfi ola bilməz — bu kök atılır. Düz cavab ${S(good)}.`][which];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: which, show: ch[which], solution: why };
      } },
    { id: "hesab", ad: "Həyatdan", izah: "Məsələdən tənlik qur. Mənfi uzunluq, mənfi kök cavab ola bilməz.",
      gen() {
        const kind = pick(["ladder", "rect", "num", "fall"]);
        if (kind === "ladder") {
          const [p, q, c] = pick(TRIPLES), [d, hh] = Math.random() < .5 ? [p, q] : [q, p];
          return { text: `Uzunluğu ${c} m olan nərdivan şaquli divara söykənib. Onun yuxarı ucu yerdən ${hh} m hündürlükdədir. Nərdivanın aşağı ucu divardan neçə metr aralıdır?`, answer: d, unit: "m", show: d + " m", tol: 0.01,
            solution: `x — aşağı ucdan divara qədər məsafə. Pifaqor: √(${c}² − x²) = ${hh} → ${c * c} − x² = ${hh * hh} → x² = ${d * d} → x = ±${d}. Məsafə mənfi olmur: ${d} m.` };
        }
        if (kind === "rect") {
          const [p, q, c] = pick(TRIPLES), long = Math.random() < .5;
          return { text: `Düzbucaqlı formalı ekranın diaqonalı ${c} sm, sahəsi ${p * q} sm²-dir. Ekranın ${long ? "uzun" : "qısa"} tərəfi neçə sm-dir?`, answer: long ? q : p, unit: "sm", show: (long ? q : p) + " sm", tol: 0.01,
            solution: `Tərəflər x və ${p * q}/x. Pifaqor: x² + (${p * q}/x)² = ${c * c} → x⁴ − ${c * c}x² + ${p * p * q * q} = 0. t = x²: t = ${p * p} və ya t = ${q * q} → x = ${p} və ya x = ${q} (mənfilər atılır). Tərəflər ${p} və ${q} sm; ${long ? "uzunu" : "qısası"} ${long ? q : p} sm.` };
        }
        if (kind === "num") {
          const k = rnd(3, 12), D = k * k - k;
          return { text: `Müsbət ədəd öz kvadrat kökündən ${D} vahid böyükdür. Bu ədədi tap.`, answer: k * k, show: String(k * k), tol: 0.01,
            solution: `x − √x = ${D}. t = √x ≥ 0: t² − t − ${D} = 0 → t = ${k}, t = ${S(1 - k)} (mənfi — atılır). x = ${k}² = ${k * k}. Yoxla: ${k * k} − ${k} = ${D} ✓.` };
        }
        const t = rnd(2, 8), H = 5 * t * t;
        return { text: `Hündürlükdən buraxılan daşın düşmə vaxtı t = √(h/5) düsturu ilə hesablanır (t — saniyə, h — metr). Daş ${t} saniyəyə yerə düşdü. Daş neçə metr hündürlükdən buraxılıb?`, answer: H, unit: "m", show: H + " m", tol: 0.01,
          solution: `√(h/5) = ${t} → h/5 = ${t * t} → h = ${H} m. Yoxla: √(${H}/5) = √${t * t} = ${t} ✓.` };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (forgetting ±, the negative t, the extraneous root, not isolating the root, ...).
  const { ae, again } = Oyun;
  const D = Oyun.num;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const SQ = [1, 4, 9, 16, 25, 36];
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. biquadratic, both t positive: difference between the biggest and the smallest root
    { tip: "qapali", gen: () => again(() => {
      const t1 = pick(SQ), t2 = pick(SQ); if (t1 >= t2) return null;
      const r1 = Math.sqrt(t1), r2 = Math.sqrt(t2), R = 2 * r2, eq = poly([[1, "x⁴"], [-(t1 + t2), "x²"], [t1 * t2, ""]]) + " = 0";
      return mc(ae(R, [r2, 2 * t2, t2 - t1, r2 - r1]), { text: `${eq} tənliyinin ən böyük kökü ilə ən kiçik kökünün fərqini tapın.`,
        solution: `t = x²: ${poly([[1, "t²"], [-(t1 + t2), "t"], [t1 * t2, ""]])} = 0 → t = ${t1}, t = ${t2}. x² = ${t2} → x = ±${r2}; x² = ${t1} → x = ±${r1}. Ən böyük kök ${r2}, ən kiçik −${r2}; fərq ${r2} − (−${r2}) = ${R}. Tələlər: fərq əvəzinə ən böyük kökü yazmaq (${r2}), t-ni kökə çevirməmək (${2 * t2}), t-lərin fərqi (${t2 - t1}), mənfi kökləri unutmaq — ən kiçik kök ${r1} sayılır, fərq ${r2 - r1}.` });
    }) },
    // 2. biquadratic, one negative t: sum of the squares of the real roots
    { tip: "qapali", gen: () => again(() => {
      const t1 = rnd(2, 20), n = rnd(1, 12), t2 = -n, eq = poly([[1, "x⁴"], [-(t1 + t2), "x²"], [t1 * t2, ""]]) + " = 0";
      return mc(ae(2 * t1, [t1, t1 + t2, 2 * (t1 + t2), 2 * (t1 + n)]), { text: `${eq} tənliyinin həqiqi köklərinin kvadratlarının cəmini tapın.`,
        solution: `t = x²: ${poly([[1, "t²"], [-(t1 + t2), "t"], [t1 * t2, ""]])} = 0 → t = ${t1}, t = ${S(t2)}. t = ${S(t2)} < 0 — x² mənfi ola bilməz, kök yoxdur. x² = ${t1} → x = ±√${t1}. Kvadratların cəmi: ${t1} + ${t1} = ${2 * t1}. Tələlər: yalnız bir kökü saymaq (${t1}), mənfi t-ni də saymaq (${S(t1 + t2)}, ${S(2 * (t1 + t2))}).` });
    }) },
    // 3. new variable t = x² + px: sum of the real roots
    { tip: "qapali", gen: () => again(() => {
      const p = pick([-1, 1]) * rnd(1, 4), m1 = rnd(-4, 4); if (2 * m1 + p === 0) return null;
      const t1 = m1 * (m1 + p), none = Math.random() < .5; let t2;
      if (none) t2 = -(Math.floor(p * p / 4) + rnd(1, 4)); else { const m2 = rnd(-4, 4); if (2 * m2 + p === 0) return null; t2 = m2 * (m2 + p); }
      if (t1 === t2) return null;
      const R = none ? -p : -2 * p, u = poly([[1, "x²"], [p, "x"]]), eq = poly([[1, `(${u})²`], [-(t1 + t2), `(${u})`], [t1 * t2, ""]]) + " = 0";
      const w = [-p, -2 * p, p, 2 * p, t1 + t2].filter(v => v !== R); if (new Set(w).size < 4) return null;
      const part = t => { const d = p * p + 4 * t; return d < 0 ? `${poly([[1, "x²"], [p, "x"], [-t, ""]])} = 0: D < 0, kök yoxdur` : `${poly([[1, "x²"], [p, "x"], [-t, ""]])} = 0: köklərin cəmi ${S(-p)}`; };
      return mc(ae(R, w.slice(0, 4)), { text: `${eq} tənliyinin bütün həqiqi köklərinin cəmini tapın.`,
        solution: `t = ${u}: ${poly([[1, "t²"], [-(t1 + t2), "t"], [t1 * t2, ""]])} = 0 → t = ${S(t1)}, t = ${S(t2)}. t = ${S(t1)}: ${part(t1)}. t = ${S(t2)}: ${part(t2)}. Cəm: ${S(R)}. Tələlər: ${none ? "kökü olmayan tənliyi də saymaq, " : "yalnız bir tənliyin köklərini saymaq, "}Viyet düsturunda işarəni səhv yazmaq (${S(-R)}), t-lərin cəmini (${S(t1 + t2)}) cavab yazmaq.` });
    }) },
    // 4. √(ax + b) ± k = m: isolate the root first
    { tip: "qapali", gen: () => again(() => {
      const a = pick([2, 3, 4, 5]), x = rnd(1, 12), c = rnd(2, 7), k = rnd(1, 4), s = pick([1, -1]); if (s < 0 && c <= k) return null;
      const m = c + s * k, b = c * c - a * x, root = sq(poly([[a, "x"], [b, ""]]));
      const ws = [(m * m - k * k - b) / a, ((m + s * k) ** 2 - b) / a, (c - b) / a, (c * c + b) / a];
      if (![x, ...ws].every(Number.isInteger)) return null;
      return mc(ae(x, ws), { text: `${root} ${s > 0 ? "+" : "−"} ${k} = ${m} tənliyinin kökünü tapın.`,
        solution: `Əvvəl kökü təkləyirik: ${root} = ${m} ${s > 0 ? "−" : "+"} ${k} = ${c}. Kvadrata yüksəldirik: ${poly([[a, "x"], [b, ""]])} = ${c * c} → ${poly([[a, "x"]])} = ${S(c * c - b)} → x = ${x}. Yoxlama: ${sq(String(c * c))} ${s > 0 ? "+" : "−"} ${k} = ${m} ✓. Tələlər: kökü təkləmədən kvadrata yüksəltmək və qarışıq həddi unutmaq — ${poly([[a, "x"], [b, ""]])} + ${k * k} = ${m * m} (${S(ws[0])}); təkləyərkən ${k} ədədinin işarəsini səhv keçirmək (${S(ws[1])}); sağ tərəfi kvadrata yüksəltməmək, yəni ${poly([[a, "x"], [b, ""]])} = ${c} götürmək (${S(ws[2])}).` });
    }) },
    // 5. x + p√x + q = 0, t = √x: the negative t is dropped
    { tip: "qapali", gen: () => again(() => {
      const t1 = rnd(1, 7), n = rnd(1, 7); if (t1 === n) return null; const t2 = -n;
      const eq = poly([[1, "x"], [-(t1 + t2), "√x"], [t1 * t2, ""]]) + " = 0";
      return mc(ae(t1 * t1, [t1, t2 * t2, t1 * t1 + t2 * t2, (t1 + t2) ** 2]), { text: `${eq} tənliyinin kökünü tapın.`,
        solution: `t = √x, t ≥ 0, x = t²: ${poly([[1, "t²"], [-(t1 + t2), "t"], [t1 * t2, ""]])} = 0 → t = ${t1}, t = ${S(t2)}. t = ${S(t2)} < 0 — kvadrat kök mənfi ola bilməz, atılır. √x = ${t1} → x = ${t1 * t1}. Tələlər: t-ni x-ə qaytarmamaq (${t1}), mənfi t-ni də kvadrata yüksəltmək (${n * n}, ${t1 * t1 + n * n}).` });
    }) },
    // 6. √(ax + b) = x: the extraneous root, sum of the roots
    { tip: "qapali", gen: () => again(() => {
      const r1 = rnd(2, 9), n = rnd(1, 6); if (r1 === n) return null; const r2 = -n, a = r1 + r2, b = -r1 * r2; if (!a) return null;
      const eq = `${sq(poly([[a, "x"], [b, ""]]))} = x`;
      return mc(ae(r1, [a, r2, r1 * r2, n]), { text: `${eq} tənliyinin köklərinin cəmini tapın.`,
        solution: `Şərt: x ≥ 0. Kvadrata yüksəldirik: ${poly([[a, "x"], [b, ""]])} = x² → ${poly([[1, "x²"], [-a, "x"], [-b, ""]])} = 0 → x = ${r1}, x = ${S(r2)}. x = ${S(r2)} < 0 — atılır (kənar kök). Tənliyin yalnız bir kökü var: ${r1}; cəm ${r1}. Tələlər: hər iki kökü götürmək (cəm ${S(a)}), atılan kökü cavab yazmaq (${S(r2)}), kökləri vurmaq (${S(r1 * r2)}).` });
    }) },
    // 7. coded: sum of the moduli of the real roots of a biquadratic
    { tip: "kod", gen: () => again(() => {
      const t1 = pick(SQ), t2 = pick([...SQ, -1, -4, -9, -16]); if (t1 === t2) return null;
      const ts = [t1, t2].filter(t => t > 0), R = ts.reduce((s, t) => s + 2 * Math.sqrt(t), 0), eq = poly([[1, "x⁴"], [-(t1 + t2), "x²"], [t1 * t2, ""]]) + " = 0";
      return { text: `${eq} tənliyinin bütün həqiqi köklərinin modullarının cəmini tapın.`, answer: R, show: String(R), tol: 1e-6,
        solution: `t = x²: ${poly([[1, "t²"], [-(t1 + t2), "t"], [t1 * t2, ""]])} = 0 → t = ${S(t1)}, t = ${S(t2)}. ` + ts.map(t => `x² = ${t} → x = ±${Math.sqrt(t)}`).join("; ") + (t2 < 0 ? `; t = ${S(t2)} < 0 — kök yoxdur` : "") + `. Modullar cəmi: ${ts.map(t => `2 · ${Math.sqrt(t)}`).join(" + ")} = ${R}.` };
    }) },
    // 8. coded: √(x² + px + q) = x + r — the x² terms cancel
    { tip: "kod", gen: () => again(() => {
      const r = rnd(1, 5), x = rnd(1, 9), p = rnd(-3, 8); if (p === 2 * r) return null;
      const q = r * r - (p - 2 * r) * x, rhs = poly([[1, "x"], [r, ""]]);
      return { text: `${sq(poly([[1, "x²"], [p, "x"], [q, ""]]))} = ${rhs} tənliyinin kökünü tapın.`, answer: x, show: String(x), tol: 1e-6,
        solution: `Şərt: ${rhs} ≥ 0. Kvadrata yüksəldirik: ${poly([[1, "x²"], [p, "x"], [q, ""]])} = ${poly([[1, "x²"], [2 * r, "x"], [r * r, ""]])}. x² ixtisar olunur: ${poly([[p - 2 * r, "x"]])} = ${S(r * r - q)}${p - 2 * r === 1 ? "" : " → x = " + x}. Yoxlama: ${x} + ${r} = ${x + r} ≥ 0 ✓, ${sq(String((x + r) ** 2))} = ${x + r} ✓.` };
    }) },
    // 9. coded: perimeter from diagonal + area, or area from diagonal + perimeter
    { tip: "kod", gen: () => again(() => {
      const [p, q, c] = pick([...TRIPLES, [20, 21, 29], [16, 30, 34], [18, 24, 30], [9, 40, 41], [21, 28, 35], [24, 32, 40], [12, 35, 37], [11, 60, 61]]), P = 2 * (p + q);
      if (Math.random() < .5) return { text: `Düzbucaqlının diaqonalı ${c} sm, sahəsi ${p * q} sm²-dir. Düzbucaqlının perimetrini (sm) tapın.`, answer: P, show: String(P), tol: 1e-6, unit: "sm",
        solution: `Tərəflər x və y: x² + y² = ${c * c}, xy = ${p * q}. (x + y)² = ${c * c} + 2 · ${p * q} = ${c * c + 2 * p * q} → x + y = ${p + q}. Perimetr 2 · ${p + q} = ${P} sm. (Yoxlama: tərəflər ${p} və ${q}.)` };
      return { text: `Düzbucaqlının diaqonalı ${c} sm, perimetri ${P} sm-dir. Düzbucaqlının sahəsini (sm²) tapın.`, answer: p * q, show: String(p * q), tol: 1e-6, unit: "sm²",
        solution: `Tərəflər x və y: x² + y² = ${c * c}, x + y = ${p + q}. (x + y)² = x² + y² + 2xy → ${(p + q) ** 2} = ${c * c} + 2xy → xy = ${p * q}. Sahə ${p * q} sm². (Yoxlama: tərəflər ${p} və ${q}.)` };
    }) },
    // 10. written: √(ax + b) = x − c with an extraneous root
    { tip: "yazili", gen: () => again(() => {
      const c = rnd(1, 6), g = c + rnd(1, 8), s = c - rnd(1, 6), a = g + s - 2 * c; if (a < 1 || a > 5 || g === s) return null;
      const b = c * c - g * s, rhs = poly([[1, "x"], [-c, ""]]), rad2 = poly([[a, "x"], [b, ""]]);
      return { text: `${sq(rad2)} = ${rhs} tənliyini həll edin.`, answer: g, show: String(g), tol: 1e-6,
        solution: `1) Şərt: ${rhs} ≥ 0, yəni x ≥ ${c}. 2) Kvadrata yüksəldirik: ${rad2} = ${poly([[1, "x²"], [-2 * c, "x"], [c * c, ""]])} → ${poly([[1, "x²"], [-(a + 2 * c), "x"], [c * c - b, ""]])} = 0. 3) x = ${S(s)} və x = ${g}. 4) x = ${S(s)} < ${c} — şərti ödəmir, kənar kökdür (sağ tərəf ${S(s - c)} < 0). x = ${g}: ${sq(String((g - c) ** 2))} = ${g - c}, ${g} − ${c} = ${g - c} ✓. Cavab: ${g}. Həll yazılmadan yalnız cavab yazılsa, bal verilmir: şərt, kvadrata yüksəltmə və kökün yoxlanması görünməlidir.` };
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT));
  window.__imtahan = IMT;

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "kvadrat-tenliye-getirilen", title: "Kvadrat tənliyə gətirilən və irrasional tənliklər", fenn: "riyaziyyat", link: "dersler/kvadrat-tenliye-getirilen.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kök √5 (və ya 2.24). Kök yoxdursa və köklərin sayı soruşulursa — 0.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["bikv", "bikv", "evez", "evez", "kok1", "kok1", "kok2", "kok2", "hesab", "hesab"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/kvadrat-tenliye-getirilen.html")) b.push("dersler/kvadrat-tenliye-getirilen.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
