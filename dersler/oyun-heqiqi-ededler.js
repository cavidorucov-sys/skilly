// İrrasional və həqiqi ədədlər; tam və kəsr hissə; ədədi və həndəsi orta — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
// [x] — x-i aşmayan ən böyük tam ədəd; {x} = x − [x] (0 ≤ {x} < 1, mənfi x üçün də).
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const N = x => { const r = Math.round(x * 1000) / 1000; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const P = x => x < 0 ? "(" + N(x) + ")" : N(x);
  const red = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; return [p / g, q / g]; };
  const F = (p, q) => { [p, q] = red(p, q); return q === 1 ? N(p) : (p < 0 ? "−" : "") + Math.abs(p) + "/" + q; };
  const isSq = n => Number.isInteger(Math.round(Math.sqrt(n))) && Math.round(Math.sqrt(n)) ** 2 === n;
  const fl = n => { let k = Math.floor(Math.sqrt(n)); while (k * k > n) k--; while ((k + 1) ** 2 <= n) k++; return k; }; // [√n], exact
  const simp = n => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d; } return [k, n]; }; // √n = k√r
  const R = (k, r) => r === 1 ? String(k) : (k === 1 ? "" : k) + "√" + r;
  const nonSq = (a, b) => { let n; do n = rnd(a, b); while (isSq(n)); return n; };
  const SQF = [2, 3, 5, 6, 7, 10, 11];

  const levels = [
    { id: "irrasional", ad: "Rasional, yoxsa irrasional?", izah: "Kökü əvvəl sadələşdir: √49 = 7 rasionaldır, √20 isə yox.",
      gen() {
        const RAT = [
          () => { const k = rnd(2, 12); return [`√${k * k}`, `√${k * k} = ${k}`]; },
          () => { const k = rnd(1, 9); return [`√0,${String(k * k).padStart(2, "0")}`, `√0,${String(k * k).padStart(2, "0")} = 0,${k}`]; },
          () => { let a, b; do { a = rnd(1, 7); b = rnd(2, 9); } while (gcd(a, b) !== 1 || a === b); return [`√(${a * a}/${b * b})`, `√(${a * a}/${b * b}) = ${a}/${b}`]; },
          () => { const d = rnd(1, 8); return [`0,(${d})`, `0,(${d}) = ${F(d, 9)} — dövri kəsr rasionaldır`]; },
          () => { let q, p; do { q = rnd(3, 11); p = rnd(1, q - 1); } while (gcd(p, q) !== 1); return [`−${p}/${q}`, `−${p}/${q} — adi kəsr, rasionaldır`]; },
          () => { const n = nonSq(2, 30); return [`(√${n})²`, `(√${n})² = ${n}`]; },
          () => { const s = pick([2, 3, 5, 6, 7]), u = rnd(1, 2), v = rnd(3, 4); return [`√${s * u * u} · √${s * v * v}`, `√${s * u * u} · √${s * v * v} = √${s * s * u * u * v * v} = ${s * u * v}`]; },
          () => { const s = pick([2, 3, 5, 6, 7]), u = rnd(2, 5); return [`√${s * u * u} : √${s}`, `√${s * u * u} : √${s} = √${u * u} = ${u}`]; },
          () => { let d; do d = rnd(11, 99); while (d % 10 === 0); return [N(d / 10), `${N(d / 10)} — sonlu onluq kəsr, rasionaldır`]; },
        ];
        const IRR = [
          () => { const n = nonSq(2, 99); return [`√${n}`, `√${n} — ${n} tam kvadrat deyil, irrasionaldır`]; },
          () => ["π", "π = 3,14159… — sonsuz və dövri olmayan, irrasionaldır"],
          () => { const a = rnd(1, 5), n = pick(SQF); return [`${a} + √${n}`, `${a} + √${n} — rasional + irrasional = irrasional`]; },
          () => { const d = rnd(1, 9); return [`√0,${d}`, `√0,${d} = √(${d}/10) — irrasionaldır (√0,${String(d * d).padStart(2, "0")} ilə qarışdırma)`]; },
          () => ["0,1010010001…", "0,1010010001… — sonsuz, dövri deyil, irrasionaldır"],
          () => { const k = rnd(2, 5), r = pick(SQF); return [`${k}√${r}`, `${k}√${r} — irrasionaldır`]; },
          () => { let a, b; do { a = nonSq(2, 15); b = nonSq(2, 15); } while (isSq(a * b) || a === b); return [`√${a} · √${b}`, `√${a} · √${b} = √${a * b} — ${a * b} tam kvadrat deyil, irrasionaldır`]; },
          () => { const n = pick(SQF); return [`−√${n}`, `−√${n} — irrasionaldır`]; },
        ];
        const items = [], used = new Set(), nIrr = rnd(1, 4);
        const order = [...Array(5)].map((_, i) => i < nIrr);
        for (const irr of order.sort(() => Math.random() - .5)) {
          let it; do it = pick(irr ? IRR : RAT)(); while (used.has(it[0]));
          used.add(it[0]); items.push({ t: it[0], why: it[1], irr });
        }
        const askIrr = Math.random() < .6, c = items.filter(x => x.irr === askIrr).length;
        return { text: `${items.map(x => x.t).join(";   ")}.  Bu ədədlərdən neçəsi ${askIrr ? "irrasionaldır" : "rasionaldır"}?`, answer: c, show: String(c), tol: 0.01,
          solution: items.map(x => x.why).join(". ") + `. Cavab: ${c}.` };
      } },
    { id: "araliq", ad: "Kök hansı tam ədədlər arasındadır?", izah: "Yaxın tam kvadratları tap: 16 < 20 < 25, deməli 4 < √20 < 5.",
      gen() {
        const t = rnd(0, 4);
        if (t === 0 || t === 1) {
          const n = nonSq(2, 200), k = fl(n), neg = t === 1;
          return { text: `${neg ? "−" : ""}√${n} hansı iki ardıcıl tam ədəd arasındadır? Kiçiyini yaz.`, answer: neg ? -(k + 1) : k, show: N(neg ? -(k + 1) : k), tol: 0.01,
            solution: `${k * k} < ${n} < ${(k + 1) ** 2}, deməli ${k} < √${n} < ${k + 1}.` + (neg ? ` Mənfi işarə bərabərsizliyi çevirir: −${k + 1} < −√${n} < −${k}. Kiçiyi −${k + 1}.` : ` Kiçiyi ${k}.`) };
        }
        if (t === 2) {
          const p = rnd(2, 6), q = pick(SQF), n = p * p * q, k = fl(n);
          return { text: `${p}√${q} hansı iki ardıcıl tam ədəd arasındadır? Kiçiyini yaz.`, answer: k, show: String(k), tol: 0.01,
            solution: `Vuruğu kök altına sal: ${p}√${q} = √(${p * p} · ${q}) = √${n}. ${k * k} < ${n} < ${(k + 1) ** 2}, deməli ${k} < ${p}√${q} < ${k + 1}.` };
        }
        if (t === 3) {
          const a = nonSq(2, 80), b = nonSq(2, 80), ka = fl(a), kb = fl(b), c = ka + kb + 1;
          return { text: `−√${a} ilə √${b} arasında neçə tam ədəd var?`, answer: c, show: String(c), tol: 0.01,
            solution: `${ka} < √${a} < ${ka + 1}, deməli −${ka + 1} < −√${a} < −${ka}. ${kb} < √${b} < ${kb + 1}. Tam ədədlər: −${ka}; …; ${kb} — ${ka} mənfi, 0 və ${kb} müsbət: ${ka} + 1 + ${kb} = ${c}.` };
        }
        const n = nonSq(2, 150), k = fl(n), near = n <= k * k + k ? k : k + 1;
        return { text: `√${n} ədədinə ən yaxın tam ədəd hansıdır?`, answer: near, show: String(near), tol: 0.01,
          solution: `${k} < √${n} < ${k + 1}. Orta nöqtə ${k},5 və (${k},5)² = ${N((k + .5) ** 2)}. ${n} ${n < (k + .5) ** 2 ? "<" : ">"} ${N((k + .5) ** 2)}, deməli √${n} ədədinə ən yaxın tam ədəd ${near}.` };
      } },
    { id: "muqayise", ad: "Kökləri müqayisə et", izah: "Hamısını kök altına sal: 3√2 = √18, 4 = √16. Sonra kök altındakıları müqayisə et.",
      gen() {
        let items;
        for (;;) {
          const c = rnd(15, 80); items = []; const seen = new Set(); let tries = 0;
          while (items.length < 4 && tries++ < 300) {
            const t = rnd(0, 2); let it;
            if (t === 0) { const m = rnd(3, 9); it = { s: String(m), sq: m * m }; }
            else if (t === 1) { const n = nonSq(5, 99); it = { s: `√${n}`, sq: n }; }
            else { const p = rnd(2, 5), q = pick([2, 3, 5, 6, 7]); it = { s: `${p}√${q}`, sq: p * p * q }; }
            if (Math.abs(it.sq - c) > 14 || seen.has(it.sq)) continue;
            if (t !== 2 && items.filter(x => !x.s.match(/^\d√/)).length >= 2) continue;
            seen.add(it.sq); items.push(it);
          }
          if (items.length === 4) break;
        }
        const neg = Math.random() < .3;
        items.forEach(it => { it.v = (neg ? -1 : 1) * Math.sqrt(it.sq); if (neg) it.s = "−" + it.s; });
        const sorted = [...items].sort((a, b) => a.v - b.v);
        const under = items.filter(it => !/^−?√/.test(it.s)).map(it => `${it.s} = ${neg ? "−" : ""}√${it.sq}`).join(", ");
        const sol = `${under}. ${neg ? "Mənfi ədədlərdə kök altındakı böyük olan ədəd kiçikdir. " : ""}Artan sıra: ${sorted.map(x => x.s).join(" < ")}.`;
        const k = rnd(0, 2);
        if (k < 2) {
          const want = k === 0 ? sorted[3] : sorted[0];
          return { text: `Ən ${k === 0 ? "böyük" : "kiçik"} ədəd hansıdır?`, choices: items.map(x => x.s), correct: items.indexOf(want), show: want.s, solution: sol };
        }
        let M; do M = rnd(4, 9); while (items.some(it => it.sq === M * M));
        const MV = neg ? -M : M, c = items.filter(it => it.v > MV).length;
        return { text: `${items.map(x => x.s).join(";   ")}.  Bu ədədlərdən neçəsi ${N(MV)} ədədindən böyükdür?`, answer: c, show: String(c), tol: 0.01,
          solution: `${N(MV)} = ${neg ? "−" : ""}√${M * M}. ${sol} Cavab: ${c}.` };
      } },
    { id: "tamkesr", ad: "Tam və kəsr hissə", izah: "[x] — x-i aşmayan ən böyük tam ədəd; {x} = x − [x]. Mənfi ədədə diqqət: [−2,3] = −3.",
      gen() {
        const t = rnd(0, 5);
        if (t === 0 || t === 1) {
          const D = pick([10, 10, 100]); let M; do M = rnd(-9 * D, 9 * D); while (M % D === 0 || (D === 100 && M % 10 === 0));
          const x = M / D, f = Math.floor(M / D), fr = (M - f * D) / D;
          if (t === 0) return { text: `[${N(x)}] = ?`, answer: f, show: N(f), tol: 0.01,
            solution: `${N(x)} ədədi ${N(f)} ilə ${N(f + 1)} arasındadır; aşmayan ən böyük tam — ${N(f)}.` + (x < 0 ? ` Mənfi ədəddə vergüldən əvvəlki rəqəmi götürmək olmaz: [${N(x)}] ≠ ${N(Math.trunc(x))}.` : "") };
          return { text: `{${N(x)}} = ?`, answer: fr, show: N(fr), tol: 0.001,
            solution: `[${N(x)}] = ${N(f)}, {${N(x)}} = ${N(x)} − ${P(f)} = ${N(fr)}.` + (x < 0 ? " Kəsr hissə həmişə 0 ≤ {x} < 1." : "") };
        }
        if (t === 2) {
          let p, q; do { q = rnd(2, 9); p = rnd(-40, 40); } while (p % q === 0 || gcd(p, q) !== 1);
          const f = Math.floor(p / q), r = p - f * q, askF = Math.random() < .5;
          const base = `${F(p, q)} = ${N(f)} + ${r}/${q}, burada 0 < ${r}/${q} < 1.`;
          return askF ? { text: `[${F(p, q)}] = ?`, answer: f, show: N(f), tol: 0.01, solution: `${base} Deməli [${F(p, q)}] = ${N(f)}.` }
            : { text: `{${F(p, q)}} = ?`, answer: r / q, show: F(r, q), placeholder: "məs. 2/3", solution: `${base} Deməli {${F(p, q)}} = ${F(r, q)}.` };
        }
        if (t === 3) {
          const n = nonSq(2, 150), k = fl(n), neg = Math.random() < .5, v = neg ? -(k + 1) : k;
          return { text: `[${neg ? "−" : ""}√${n}] = ?`, answer: v, show: N(v), tol: 0.01,
            solution: `${k * k} < ${n} < ${(k + 1) ** 2} → ${k} < √${n} < ${k + 1}.` + (neg ? ` Onda −${k + 1} < −√${n} < −${k}, deməli [−√${n}] = −${k + 1}.` : ` Deməli [√${n}] = ${k}.`) };
        }
        if (t === 4) {
          const n = nonSq(2, 99), k = fl(n), neg = Math.random() < .5;
          if (!neg) return { text: `{√${n}} = ?`, answer: Math.sqrt(n) - k, show: `√${n} − ${k}`, placeholder: "məs. √5 − 2",
            solution: `${k} < √${n} < ${k + 1}, [√${n}] = ${k}. {√${n}} = √${n} − ${k}.` };
          return { text: `{−√${n}} = ?`, answer: k + 1 - Math.sqrt(n), show: `${k + 1} − √${n}`, placeholder: "məs. 3 − √5",
            solution: `−${k + 1} < −√${n} < −${k}, [−√${n}] = −${k + 1}. {−√${n}} = −√${n} − (−${k + 1}) = ${k + 1} − √${n}.` };
        }
        let M; do M = rnd(11, 89); while (M % 10 === 0);
        const x = M / 10, sumF = Math.random() < .5;
        return sumF ? { text: `{${N(x)}} + {−${N(x)}} = ?`, answer: 1, show: "1", tol: 0.01,
            solution: `{${N(x)}} = ${N((M % 10) / 10)}, [−${N(x)}] = −${Math.floor(x) + 1}, {−${N(x)}} = −${N(x)} + ${Math.floor(x) + 1} = ${N(1 - (M % 10) / 10)}. Cəm: 1 (tam olmayan hər x üçün belədir).` }
          : { text: `[${N(x)}] + [−${N(x)}] = ?`, answer: -1, show: "−1", tol: 0.01,
            solution: `[${N(x)}] = ${Math.floor(x)}, [−${N(x)}] = −${Math.floor(x) + 1}. Cəm: −1 (tam olmayan hər x üçün belədir).` };
      } },
    { id: "orta", ad: "Ədədi və həndəsi orta", izah: "Ədədi orta = cəm / say. İki müsbət ədədin həndəsi ortası = √(a · b).",
      gen() {
        const t = rnd(0, 4);
        if (t === 0) {
          let xs, m; const n = rnd(3, 5);
          do { m = rnd(-5, 12); xs = Array.from({ length: n - 1 }, () => m + rnd(-9, 9)); xs.push(n * m - xs.reduce((a, b) => a + b, 0)); } while (Math.abs(xs[n - 1] - m) > 12 || !xs.some(x => x < 0));
          const S = xs.reduce((a, b) => a + b, 0);
          return { text: `${xs.map(N).join(";  ")} ədədlərinin ədədi ortasını tap.`, answer: m, show: N(m), tol: 0.01,
            solution: `Cəm: ${xs.map((x, i) => i ? P(x) : N(x)).join(" + ")} = ${N(S)}. Say: ${n}. Ədədi orta = ${N(S)} : ${n} = ${N(m)}.` };
        }
        if (t === 1) {
          let a, b; do { a = rnd(1, 30); b = rnd(1, 30); } while (a === b);
          const [k, r] = simp(a * b);
          return { text: `${a} və ${b} ədədlərinin həndəsi ortasını tap.`, answer: Math.sqrt(a * b), show: R(k, r), placeholder: "məs. 6 və ya 2√3",
            solution: `√(${a} · ${b}) = √${a * b}` + (r === 1 ? ` = ${k}.` : k > 1 ? ` = √(${k * k} · ${r}) = ${R(k, r)}.` : ".") };
        }
        if (t === 2) {
          const two = Math.random() < .4, m = rnd(-3, 15);
          if (two) { const a = rnd(-10, 25), x = 2 * m - a;
            return { text: `İki ədədin ədədi ortası ${N(m)}. Biri ${N(a)}. O biri nədir?`, answer: x, show: N(x), tol: 0.01,
              solution: `Cəm = 2 · ${P(m)} = ${N(2 * m)}. O biri = ${N(2 * m)} − ${P(a)} = ${N(x)}.` }; }
          const a = rnd(-10, 25), b = rnd(-10, 25), x = 3 * m - a - b;
          return { text: `${N(a)}, ${N(b)} və x ədədlərinin ədədi ortası ${N(m)}. x = ?`, answer: x, show: N(x), tol: 0.01,
            solution: `Cəm = 3 · ${P(m)} = ${N(3 * m)}. x = ${N(3 * m)} − ${P(a)} − ${P(b)} = ${N(x)}.` };
        }
        if (t === 3) {
          const g = rnd(2, 12), divs = []; for (let d = 1; d <= g * g; d++) if ((g * g) % d === 0 && d !== g && d <= 48 && g * g / d <= 150) divs.push(d);
          const a = pick(divs), x = g * g / a;
          return { text: `${a} və x müsbət ədədlərinin həndəsi ortası ${g}. x = ?`, answer: x, show: String(x), tol: 0.01,
            solution: `√(${a} · x) = ${g} → ${a} · x = ${g}² = ${g * g} → x = ${g * g} : ${a} = ${x}.` };
        }
        let u, v; do { u = rnd(1, 8); v = rnd(1, 8); } while (u === v);
        const a = u * u, b = v * v, am = (a + b) / 2, gm = u * v, d = am - gm;
        return { text: `${a} və ${b} ədədlərinin ədədi ortası onların həndəsi ortasından nə qədər böyükdür?`, answer: d, show: N(d), tol: 0.01,
          solution: `Ədədi orta: (${a} + ${b}) / 2 = ${N(am)}. Həndəsi orta: √(${a} · ${b}) = √${a * b} = ${gm}. Fərq: ${N(am)} − ${gm} = ${N(d)}. (Ədədi orta heç vaxt həndəsi ortadan kiçik olmur.)` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Orta bal, temperatur, bağın tərəfi — ədədi orta, həndəsi orta və kökün qiymətləndirilməsi.",
      gen() {
        const t = rnd(0, 3);
        if (t === 0) {
          let s, T, x; do { s = [rnd(60, 95), rnd(60, 95), rnd(60, 95)]; T = rnd(75, 90); x = 4 * T - s[0] - s[1] - s[2]; } while (x < 40 || x > 100);
          return { text: `Elvin üç sınaqdan ${s.join(", ")} bal alıb (hər sınaq 100 bal). Dörd sınağın orta balı ${T} olsun deyə 4-cü sınaqdan neçə bal almalıdır?`, answer: x, show: String(x), tol: 0.01,
            solution: `Dörd sınağın cəmi 4 · ${T} = ${4 * T} olmalıdır. Artıq var: ${s.join(" + ")} = ${s[0] + s[1] + s[2]}. Lazımdır: ${4 * T} − ${s[0] + s[1] + s[2]} = ${x} bal.` };
        }
        if (t === 1) {
          let a, b, s, u, v; do { s = pick([1, 1, 2, 3, 5]); u = rnd(1, 5); v = rnd(1, 6); a = s * u * u; b = s * v * v; } while (u === v || a > 60 || b > 60 || a < 2 || b < 2);
          const side = s * u * v;
          return { text: `Düzbucaqlı formalı sahənin ölçüləri ${a} m və ${b} m-dir. Eyni sahəli kvadrat formalı sahənin tərəfi neçə metr olar?`, answer: side, unit: "m", show: side + " m", tol: 0.01,
            solution: `Sahə: ${a} · ${b} = ${a * b} m². Kvadratın tərəfi = √${a * b} = ${side} m — bu, ${a} və ${b} ədədlərinin həndəsi ortasıdır.` };
        }
        if (t === 2) {
          const days = ["B.e.", "Ç.a.", "Ç.", "C.a.", "C."]; let xs, m;
          do { m = rnd(-6, 3); xs = Array.from({ length: 4 }, () => m + rnd(-5, 5)); xs.push(5 * m - xs.reduce((a, b) => a + b, 0)); } while (Math.abs(xs[4] - m) > 6 || !xs.some(x => x < 0) || !xs.some(x => x > 0));
          const S = xs.reduce((a, b) => a + b, 0);
          return { text: `Yanvarda Şamaxıda 5 gün ərzində günorta temperaturu: ${xs.map((x, i) => days[i] + " " + N(x) + "°").join(";  ")}. Orta temperatur neçə dərəcədir?`, answer: m, unit: "°", show: N(m) + "°", tol: 0.01,
            solution: `Cəm: ${xs.map((x, i) => i ? P(x) : N(x)).join(" + ")} = ${N(S)}. Orta: ${N(S)} : 5 = ${N(m)}°.` };
        }
        const A = nonSq(20, 200), k = fl(A);
        return { text: `Kvadrat formalı bağın sahəsi ${A} m²-dir. Bağın tərəfi hansı iki ardıcıl tam ədəd (metrlə) arasındadır? Kiçiyini yaz.`, answer: k, unit: "m", show: k + " m", tol: 0.01,
          solution: `Tərəf = √${A}. ${k}² = ${k * k} < ${A} < ${(k + 1) ** 2} = ${k + 1}², deməli ${k} m < tərəf < ${k + 1} m.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır. İlk səhv hansı addımdadır?",
      gen() {
        const t = rnd(0, 2), bad = rnd(0, 2);
        let task, steps, why;
        if (t === 0) {
          let M; do M = rnd(11, 89); while (M % 10 === 0 || M % 10 === 5); // x,5: "digits after the comma" would be right by accident
          const X = -M; // x = X/10
          let f = Math.floor(X / 10); if (bad === 0) f += 1; // bad 0: "drop the decimals" → [x] one too big
          let fr10 = X - 10 * f; if (bad === 1) fr10 = M % 10; // bad 1: digits after the comma
          const res10 = bad === 2 ? 10 * f + 2 * fr10 : 10 * f - 2 * fr10;
          task = `x = ${N(X / 10)}. [x] − 2{x} = ?`;
          steps = [`[x] = ${N(f)}`, bad === 1 ? `{x} = ${N(fr10 / 10)} (vergüldən sonrakı hissə)` : `{x} = x − [x] = ${N(X / 10)} − ${P(f)} = ${N(fr10 / 10)}`,
            `[x] − 2{x} = ${N(f)} − 2 · ${P(fr10 / 10)} = ${N(res10 / 10)}`];
          const F0 = Math.floor(X / 10);
          why = [`[x] — x-i aşmayan ən böyük tam ədəddir. ${N(F0)} < ${N(X / 10)} < ${N(F0 + 1)}, deməli [x] = ${N(F0)}.`,
            `{x} = x − [x] = ${N(X / 10)} − ${P(F0)} = ${N((X - 10 * F0) / 10)}. Kəsr hissə "vergüldən sonrakı rəqəmlər" deyil.`,
            `${N(F0)} − 2 · ${N((X - 10 * F0) / 10)} = ${N((10 * F0 - 2 * (X - 10 * F0)) / 10)}: hesab səhvi.`][bad];
        } else if (t === 1) {
          let p, q, r, s; do { p = rnd(2, 5); q = pick([2, 3, 5, 6, 7]); r = rnd(2, 5); s = pick([2, 3, 5, 6, 7]); } while (q === s || p * p * q === r * r * s || (bad === 0 && p * q === r * r * s) || (bad === 1 && p * p * q === r * s));
          const A = bad === 0 ? p * q : p * p * q, B = bad === 1 ? r * s : r * r * s;
          let sign = A > B ? ">" : A < B ? "<" : "=";
          if (bad === 2) sign = A > B ? "<" : ">";
          task = `${p}√${q} və ${r}√${s} ədədlərini müqayisə et.`;
          steps = [`${p}√${q} = √${A}`, `${r}√${s} = √${B}`, `${A} ${A > B ? ">" : "<"} ${B}, deməli ${p}√${q} ${sign} ${r}√${s}`];
          why = [`${p}√${q} = √(${p}² · ${q}) = √${p * p * q}: vuruq kök altına kvadratı ilə girir.`, `${r}√${s} = √(${r}² · ${s}) = √${r * r * s}: vuruq kök altına kvadratı ilə girir.`,
            `Kök altındakı ədəd böyükdürsə, kök də böyükdür: işarə ${A > B ? ">" : "<"} olmalıdır.`][bad];
        } else {
          const n = nonSq(5, 120), K = fl(n), k = bad === 0 ? K - 1 : K;
          task = `[−√${n}] = ?`;
          steps = [`${k * k} < ${n} < ${(k + 1) ** 2}, deməli ${k} < √${n} < ${k + 1}`,
            bad === 1 ? `−${k} < −√${n} < −${k + 1}` : `−${k + 1} < −√${n} < −${k}`,
            `[−√${n}] = ${bad === 0 ? "−" + (k + 1) : bad === 1 ? "−" + k : "−" + k}`];
          why = [`${(K - 1) ** 2} < ${n} < ${K * K} doğru deyil: ${n} ədədi ${K * K} ilə ${(K + 1) ** 2} arasındadır, deməli ${K} < √${n} < ${K + 1}.`,
            `−1-ə vuranda bərabərsizlik işarəsi çevrilir: −${K + 1} < −√${n} < −${K}.`,
            `[−√${n}] — −√${n}-i aşmayan ən böyük tam ədəd: −${K + 1}, −${K} yox.`][bad];
        }
        const text = h("div", {}, h("p", {}, "Məsələ: " + task), h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are the
  // answers of typical mistakes ([−3,7] = −3, {x} = digits after the comma, root sign = irrational, the plain mean, ...).
  const { ae, again } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const shuf = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. which one is irrational (the rational options look irrational for a typical reason)
    { tip: "qapali", gen: () => again(() => {
      const RAT = [
        () => { const k = rnd(3, 15); return [`√${k * k}`, `√${k * k} = ${k} (kök işarəsi var, amma ${k * k} tam kvadratdır)`]; },
        () => { const k = rnd(2, 9), t = String(k * k).padStart(2, "0"); return [`√0,${t}`, `√0,${t} = 0,${k} (0,${t} = ${k * k}/100 olduğundan √0,${t} = ${k}/10 = 0,${k} rasionaldır)`]; },
        () => { const a = rnd(1, 3), d = rnd(1, 8); return [`${a},(${d})`, `${a},(${d}) = ${a * 9 + d}/9 (dövri kəsr sonsuzdur, amma rasionaldır)`]; },
        () => pick([["3,14", "3,14 = 314/100 sonlu kəsrdir, rasionaldır (π-yə yaxındır, özü deyil)"], ["22/7", "22/7 adi kəsrdir, rasionaldır (π-yə yaxındır, özü deyil)"], ["1,41", "1,41 = 141/100 rasionaldır (√2-yə yaxındır, özü deyil)"]]),
        () => { const n = nonSq(2, 30); return [`(√${n})²`, `(√${n})² = ${n}`]; },
        () => { let a, b; do { a = rnd(1, 7); b = rnd(2, 9); } while (gcd(a, b) !== 1 || a >= b); return [`√(${a * a}/${b * b})`, `√(${a * a}/${b * b}) = ${a}/${b}`]; },
        () => { const s = pick([2, 3, 5, 6, 7]), u = rnd(1, 2), v = rnd(3, 4); return [`√${s * u * u} · √${s * v * v}`, `√${s * u * u} · √${s * v * v} = √${s * s * u * u * v * v} = ${s * u * v} (hasil tam kvadratdır)`]; },
      ];
      const IRR = [
        () => { const n = nonSq(2, 99); return [`√${n}`, `√${n} irrasionaldır: ${n} tam kvadrat deyil`]; },
        () => ["π", "π sonsuz və dövri olmayan kəsrdir, irrasionaldır"],
        () => { const a = rnd(1, 5), n = pick(SQF); return [`${a} + √${n}`, `${a} + √${n}: rasional + irrasional = irrasional`]; },
        () => { const d = rnd(1, 9); return [`√0,${d}`, `√0,${d} = √(${d}/10), ${d}/10 kvadrat deyil: irrasionaldır`]; },
        () => { const k = rnd(2, 5), r = pick(SQF); return [`${k}√${r}`, `${k}√${r} = √${k * k * r}, tam kvadrat deyil: irrasionaldır`]; },
        () => { let a, b; do { a = nonSq(2, 15); b = nonSq(2, 15); } while (isSq(a * b) || a === b); return [`√${a} · √${b}`, `√${a} · √${b} = √${a * b}, ${a * b} tam kvadrat deyil: irrasionaldır`]; },
      ];
      const r = pick(IRR)(), w = shuf(RAT.map((f, i) => i)).slice(0, 4).map(i => RAT[i]());
      return mc(ae(r[0], w.map(x => x[0]), x => x), { text: "Aşağıdakı ədədlərdən hansı irrasionaldır?",
        solution: `Doğru cavab ${r[0]}: ${r[1]}. Qalanları rasionaldır: ${w.map(x => x[1]).join("; ")}. Tələ: kök işarəsini və ya sonsuz yazılışı görüb “irrasionaldır” demək.` });
    }) },
    // 2. how many integers between −√a and p√q: [0 forgotten, an end counted, p·[√q] instead of [p√q], difference instead of sum]
    { tip: "qapali", gen: () => again(() => {
      const a = nonSq(3, 40), p = rnd(2, 4), q = pick(SQF), n = p * p * q, ka = fl(a), kb = fl(n), right = ka + kb + 1;
      const w = [ka + kb, ka + kb + 2, ka + p * fl(q) + 1, Math.abs(kb - ka) + 1];
      return mc(ae(right, w), { text: `−√${a} ilə ${p}√${q} ədədləri arasında neçə tam ədəd var?`,
        solution: `${ka * ka} < ${a} < ${(ka + 1) ** 2} → −${ka + 1} < −√${a} < −${ka}. ${p}√${q} = √${n}, ${kb * kb} < ${n} < ${(kb + 1) ** 2} → ${kb} < ${p}√${q} < ${kb + 1}. Tam ədədlər −${ka} ilə ${kb} arasındadır: ${ka} mənfi, sıfır və ${kb} müsbət: ${ka} + 1 + ${kb} = ${right}. Tələlər: sıfırı unutmaq (${ka + kb}), ${p} vuruğunu kökdən kənarda saxlayıb ${p} · [√${q}] = ${p * fl(q)} götürmək (${ka + p * fl(q) + 1}), uc nöqtəni də saymaq (${ka + kb + 2}).` });
    }) },
    // 3. [x] − c{x} for a negative decimal: truncating instead of the floor, "digits after the comma" instead of {x}, a sign slip
    { tip: "qapali", gen: () => again(() => {
      const M = rnd(11, 99); if (M % 10 === 0 || M % 10 === 5) return null;
      const x10 = -M, f = Math.floor(x10 / 10), fr10 = x10 - 10 * f, t = Math.trunc(x10 / 10), g10 = M % 10, c = rnd(2, 4);
      const v = (i, j) => (10 * i + j) / 10; // integer part i, tenths j
      const right = v(f, -c * fr10), w = [v(t, -c * g10), v(f, -c * g10), v(t, -c * fr10), v(f, c * fr10)];
      return mc(ae(right, w), { text: `x = ${N(x10 / 10)} olarsa, [x] − ${c}{x} ifadəsinin qiyməti neçədir?`,
        solution: `[${N(x10 / 10)}] = ${N(f)}, çünki ${N(f)} < ${N(x10 / 10)} < ${N(f + 1)}. {x} = ${N(x10 / 10)} − (${N(f)}) = ${N(fr10 / 10)}. [x] − ${c}{x} = ${N(f)} − ${c} · ${N(fr10 / 10)} = ${N(right)}. Tələlər: [x] = ${N(t)} (vergüldən əvvəlki rəqəm) → ${N(w[0])} və ya ${N(w[2])}; {x} = ${N(g10 / 10)} (vergüldən sonrakı rəqəm) → ${N(w[0])} və ya ${N(w[1])}; işarə səhvi → ${N(w[3])}.` });
    }) },
    // 4. the fractional part of ±√n written with k = [√n]
    { tip: "qapali", gen: () => again(() => {
      const n = nonSq(3, 99), k = fl(n), neg = pick([0, 1]), s = `√${n}`;
      if (!neg) return mc(ae(`${s} − ${k}`, [`${k} − ${s}`, `${s} − ${k + 1}`, s, `${k + 1} − ${s}`], x => x), { text: `${s} ədədinin kəsr hissəsi, yəni {${s}} aşağıdakılardan hansına bərabərdir?`,
        solution: `${k * k} < ${n} < ${(k + 1) ** 2}, deməli [${s}] = ${k}. {${s}} = ${s} − [${s}] = ${s} − ${k}. Tələlər: çıxanı və çıxılanı dəyişmək (${k} − ${s} mənfidir, kəsr hissə isə mənfi olmur), ${k} əvəzinə ${k + 1} çıxmaq, tam hissəni çıxmağı unutmaq, {−${s}} ilə qarışdırmaq (${k + 1} − ${s}).` });
      return mc(ae(`${k + 1} − ${s}`, [`${s} − ${k}`, `${k} − ${s}`, `−${s}`, `${s} − ${k + 1}`], x => x), { text: `−${s} ədədinin kəsr hissəsi, yəni {−${s}} aşağıdakılardan hansına bərabərdir?`,
        solution: `−${k + 1} < −${s} < −${k}, deməli [−${s}] = −${k + 1}. {−${s}} = −${s} − (−${k + 1}) = ${k + 1} − ${s}. Tələlər: mənfi işarəni nəzərə almamaq (${s} − ${k}), [−${s}] = −${k} götürmək (${k} − ${s} mənfi çıxır), tam hissəni çıxmamaq (−${s}), işarəni çevirmək (${s} − ${k + 1}).` });
    }) },
    // 5. arithmetic and geometric mean of two numbers given → the larger number
    { tip: "qapali", gen: () => again(() => {
      const s = rnd(1, 4), u = rnd(2, 6), v = rnd(1, 5); if (u <= v || gcd(u, v) !== 1 || (s * (u * u + v * v)) % 2) return null;
      const A = s * (u * u + v * v) / 2, G = s * u * v, d = s * (u * u - v * v) / 2, big = A + d, small = A - d;
      const w = [2 * A - G, A + G, 2 * A, G * G];
      return mc(ae(big, w), { text: `Ədədi ortası ${A}, həndəsi ortası ${G} olan iki müsbət ədədin böyüyü neçədir?`,
        solution: `a + b = 2 · ${A} = ${2 * A}, a · b = ${G}² = ${G * G}. (a − b)² = (a + b)² − 4ab = ${(2 * A) ** 2} − ${4 * G * G} = ${(2 * d) ** 2}, a − b = ${2 * d}. Böyük ədəd: (${2 * A} + ${2 * d}) : 2 = ${big}, kiçik: ${small} (yoxlama: ${big} · ${small} = ${G * G}). Tələlər: həndəsi ortanı (${G}) kiçik ədəd saymaq (2 · ${A} − ${G} = ${2 * A - G}), ortaları toplamaq (${A + G}), cəmi (${2 * A}) və ya hasili (${G * G}) cavab yazmaq.` });
    }) },
    // 6. mean of a whole class from the means of two groups (weights!)
    { tip: "qapali", gen: () => again(() => {
      const m = rnd(2, 12), n = rnd(2, 12), a = rnd(55, 95), b = rnd(55, 95); if (m === n || a === b || (m * a + n * b) % (m + n)) return null;
      const right = (m * a + n * b) / (m + n), w = [(a + b) / 2, (m * b + n * a) / (m + n), m * a + n * b, (m * a + n * b) / 2];
      return mc(ae(right, w), { text: `Sinifdə ${m} oğlan və ${n} qız var. Oğlanların sınaqda orta balı ${a}, qızların orta balı ${b} olub. Bütün sinfin orta balı neçədir?`,
        solution: `Bütün ballar: ${m} · ${a} + ${n} · ${b} = ${m * a + n * b}. Şagird sayı: ${m} + ${n} = ${m + n}. Orta bal: ${m * a + n * b} : ${m + n} = ${N(right)}. Tələlər: iki ortanın ədədi ortasını götürmək (${N((a + b) / 2)}) — şagird sayları fərqlidir; çəkiləri dəyişmək (${N(w[1])}); bölməyi unutmaq (${m * a + n * b}); ikiyə bölmək (${N(w[3])}).` });
    }) },
    // 7. coded: integer solutions of x² < n
    { tip: "kod", gen: () => again(() => {
      const n = nonSq(10, 200), k = fl(n);
      return { text: `x² < ${n} bərabərsizliyinin neçə tam həlli var?`, answer: 2 * k + 1, show: String(2 * k + 1), tol: 1e-6,
        solution: `x² < ${n} ⇔ |x| < √${n}. ${k * k} < ${n} < ${(k + 1) ** 2}, deməli ${k} < √${n} < ${k + 1}. Tam həllər: −${k}, …, −1, 0, 1, …, ${k}: 2 · ${k} + 1 = ${2 * k + 1}. Tələ: sıfırı və ya mənfi həlləri saymamaq.` };
    }) },
    // 8. coded: a number removed from / added to a set, the mean changes
    { tip: "kod", gen: () => again(() => {
      const n = rnd(4, 9), A = rnd(10, 30), B = rnd(A - 6, A + 6); if (A === B) return null;
      if (pick([0, 1])) { const x = n * A - (n - 1) * B; if (x < 1) return null;
        return { text: `Ədədi ortası ${A} olan ${n} ədəddən biri çıxarılandan sonra qalan ${n - 1} ədədin ədədi ortası ${B} oldu. Çıxarılan ədəd neçədir?`, answer: x, show: String(x), tol: 1e-6,
          solution: `Əvvəl cəm: ${n} · ${A} = ${n * A}. Sonra cəm: ${n - 1} · ${B} = ${(n - 1) * B}. Çıxarılan ədəd: ${n * A} − ${(n - 1) * B} = ${x}.` }; }
      const x = (n + 1) * B - n * A; if (x < 1) return null;
      return { text: `Ədədi ortası ${A} olan ${n} ədədə bir ədəd əlavə ediləndən sonra ${n + 1} ədədin ədədi ortası ${B} oldu. Əlavə edilən ədəd neçədir?`, answer: x, show: String(x), tol: 1e-6,
        solution: `Əvvəl cəm: ${n} · ${A} = ${n * A}. Sonra cəm: ${n + 1} · ${B} = ${(n + 1) * B}. Əlavə edilən ədəd: ${(n + 1) * B} − ${n * A} = ${x}.` };
    }) },
    // 9. coded: [x] − {x} = c  (x = 2[x] − c)
    { tip: "kod", gen: () => again(() => {
      const P0 = rnd(1, 9), e = rnd(1, 9), c10 = 10 * P0 + e, n = P0 + 1, x10 = 20 * n - c10;
      return { text: `x həqiqi ədədi üçün [x] − {x} = ${N(c10 / 10)} bərabərliyi ödənir. x-i tapın.`, answer: x10 / 10, show: N(x10 / 10), tol: 1e-6,
        solution: `{x} ədədi 0 ilə 1 arasındadır (1 daxil deyil), [x] tam ədəddir. [x] − {x} = ${N(c10 / 10)} ədədi ${P0} ilə ${n} arasında olduğundan [x] = ${n}, {x} = ${n} − ${N(c10 / 10)} = ${N((10 * n - c10) / 10)}. x = [x] + {x} = ${N(x10 / 10)}.` };
    }) },
    // 10. written: t = {√n}, k = [√n]; t² + 2kt = (√n − k)(√n + k) = n − k²
    { tip: "yazili", gen: () => again(() => {
      const n = nonSq(10, 120), k = fl(n), r = n - k * k;
      return { text: `a = [√${n}] və b = {√${n}} olsun. b² + 2ab ifadəsinin qiymətini tapın.`, answer: r, show: String(r), tol: 1e-6,
        solution: `1) ${k * k} < ${n} < ${(k + 1) ** 2} → ${k} < √${n} < ${k + 1}, deməli a = [√${n}] = ${k}. 2) b = {√${n}} = √${n} − ${k}. 3) b² + 2ab = b(b + 2a) = (√${n} − ${k})(√${n} − ${k} + ${2 * k}) = (√${n} − ${k})(√${n} + ${k}) = ${n} − ${k * k} = ${r}. Həll yazılmadan yalnız cavab yazılsa, bal verilmir.` };
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
      key: "heqiqi-ededler", title: "Həqiqi ədədlər; tam və kəsr hissə; orta", fenn: "riyaziyyat", link: "dersler/heqiqi-ededler.html",
      format: "Cavab yazmaq: tam −4, onluq 0,6, kəsr 2/3, kök 3√2, kök ilə ifadə √23 − 4 (vergül də, nöqtə də olar).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["irrasional", "araliq", "araliq", "muqayise", "tamkesr", "tamkesr", "tamkesr", "orta", "orta", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/heqiqi-ededler.html")) b.push("dersler/heqiqi-ededler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
