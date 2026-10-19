// Olimpiada · Cəmin hasilə çevrilməsi; a·sin x ± b·cos x — oyun səviyyələri.
// `answer` Math ilə müstəqil hesablanır, `show` düsturla çıxan dəqiq formadır (harness ikisini tutuşdurur).
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const D = Math.PI / 180;
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; p /= g; q /= g; return (p < 0 ? "−" : "") + (q === 1 ? Math.abs(p) : Math.abs(p) + "/" + q); };
  const sqf = n => { let k = 1, m = n; for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return [k, m]; }; // √n = k√m

  // Dəqiq ədədlər: {r: [n, d]} = Σ (n/d)·√r, r ∈ {1,2,3,6}
  const rat = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const eAdd = (A, B, s = 1) => { const R = {}; for (const r of [1, 2, 3, 6]) { const a = A[r] || [0, 1], b = B[r] || [0, 1]; const x = rat(a[0] * b[1] + s * b[0] * a[1], a[1] * b[1]); if (x[0]) R[r] = x; } return R; };
  const eMul = (A, B) => { const R = {}; for (const r1 in A) for (const r2 in B) { const [k, m] = sqf(r1 * r2); const n = A[r1][0] * B[r2][0] * k, d = A[r1][1] * B[r2][1]; const c = R[m] || [0, 1]; R[m] = rat(c[0] * d + n * c[1], c[1] * d); } for (const m in R) if (!R[m][0]) delete R[m]; return R; };
  const eScale = (A, n, d = 1) => eMul(A, { 1: [n, d] });
  function fmtE(E) {
    const ks = Object.keys(E).map(Number).sort((a, b) => a - b);
    if (!ks.length) return "0"; if (ks.length > 2) return null;
    return ks.map((r, i) => { const [n, d] = E[r], an = Math.abs(n);
      const body = r === 1 ? (d === 1 ? "" + an : an + "/" + d) : (an === 1 ? "" : an) + "√" + r + (d === 1 ? "" : "/" + d);
      return (n < 0 ? (i ? " − " : "−") : (i ? " + " : "")) + body; }).join("");
  }
  const BASE = { 0: {}, 30: { 1: [1, 2] }, 45: { 2: [1, 2] }, 60: { 3: [1, 2] }, 90: { 1: [1, 1] } };
  function sinE(deg) {
    deg = ((deg % 360) + 360) % 360; let sg = 1; if (deg > 180) { deg = 360 - deg; sg = -1; } if (deg > 90) deg = 180 - deg;
    if (!(deg in BASE)) throw new Error("not special");
    const E = {}; for (const r in BASE[deg]) E[r] = [sg * BASE[deg][r][0], BASE[deg][r][1]]; return E;
  }
  const cosE = d => sinE(90 - d);
  const nice = d => { try { sinE(d); return true; } catch (e) { return false; } };
  const A_ = (f, d) => d < 0 ? `${f}(−${-d}°)` : `${f} ${d}°`;
  const M = n => String(n).replace("-", "−");

  // hasil -> cəm: (a, b) cütləri, a+b və a−b xüsusi bucaqdır
  const PROD = [];
  for (let a = 15; a <= 165; a += 15) for (let b = 15; b <= 165; b += 15) if (a !== b && nice(a + b) && nice(a - b)) PROD.push([a, b]);
  // cəm -> hasil: s = (a+b)/2, d = (a−b)/2
  const SD = [[45, 30], [60, 30], [60, 45], [90, 30], [90, 45], [90, 60]];

  const rootTerm = (s, k, m) => (s < 0 ? "−" : "") + (k > 1 ? k : "") + "√" + m;
  const withC = (c, s, k, m) => m === 1 ? String(c + s * k).replace("-", "−") : (c === 0 ? rootTerm(s, k, m) : (c < 0 ? "−" + (-c) : String(c)) + (s < 0 ? " − " : " + ") + (k > 1 ? k : "") + "√" + m);
  const expr = (a, b, c) => {
    const t = (v, f, first) => (v < 0 ? (first ? "−" : " − ") : (first ? "" : " + ")) + (Math.abs(v) === 1 ? "" : Math.abs(v)) + f;
    return t(a, "sin x", true) + t(b, "cos x", false) + (c ? (c < 0 ? " − " + (-c) : " + " + c) : "");
  };
  const PY = [[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6], [8, 15], [15, 8], [9, 12], [7, 24]];
  const sg = () => Math.random() < .35 ? -1 : 1;

  const levels = [
    { id: "hasil", ad: "Hasili cəmə çevir", izah: "2 sin a cos b = sin(a+b) + sin(a−b) və s. Cavabı ədəd, ya da iki hədli (məs. 1 + √3/2) kimi yaz.",
      gen() {
        const [a, b] = pick(PROD), t = pick(["sc", "cc", "ss"]);
        let e, v, sol;
        if (t === "sc") { e = `2·sin ${a}°·cos ${b}°`; v = 2 * Math.sin(a * D) * Math.cos(b * D); const E = eAdd(sinE(a + b), sinE(a - b)); sol = [`${A_('sin', a + b)} + ${A_('sin', a - b)}`, E]; }
        else if (t === "cc") { e = `2·cos ${a}°·cos ${b}°`; v = 2 * Math.cos(a * D) * Math.cos(b * D); sol = [`${A_('cos', a + b)} + ${A_('cos', a - b)}`, eAdd(cosE(a + b), cosE(a - b))]; }
        else { e = `2·sin ${a}°·sin ${b}°`; v = 2 * Math.sin(a * D) * Math.sin(b * D); sol = [`${A_('cos', a - b)} − ${A_('cos', a + b)}`, eAdd(cosE(a - b), cosE(a + b), -1)]; }
        const name = t === "sc" ? "2 sin a cos b = sin(a+b) + sin(a−b)" : t === "cc" ? "2 cos a cos b = cos(a+b) + cos(a−b)" : "2 sin a sin b = cos(a−b) − cos(a+b)";
        const parts = t === "sc" ? [sinE(a + b), sinE(a - b), "+"] : t === "cc" ? [cosE(a + b), cosE(a - b), "+"] : [cosE(a - b), cosE(a + b), "−"];
        return { text: `${e} = ?`, answer: v, show: fmtE(sol[1]), placeholder: "məs. 1 + √3/2",
          solution: `${name}. Burada a = ${a}°, b = ${b}°: ${sol[0]} = ${fmtE(parts[0])} ${parts[2]} ${fmtE(parts[1]).replace(/^−(.*)$/, "($&)")} = ${fmtE(sol[1])}.` };
      } },
    { id: "cem", minVariety: 20, ad: "Cəmi hasilə çevir", izah: "sin a + sin b = 2 sin((a+b)/2) cos((a−b)/2) və qalan üç düstur. Cavab bir hədlidir: √6/2, −√2/2, 1 kimi.",
      gen() {
        let s, d, t, E, nm;
        for (;;) {
          [s, d] = pick(SD); t = pick(["s+", "s-", "c+", "c-"]);
          E = t === "s+" ? eScale(eMul(sinE(s), cosE(d)), 2) : t === "s-" ? eScale(eMul(cosE(s), sinE(d)), 2) : t === "c+" ? eScale(eMul(cosE(s), cosE(d)), 2) : eScale(eMul(sinE(s), sinE(d)), -2);
          if (Object.keys(E).length) break;
        }
        const a = s + d, b = s - d, swap = (t === "s+" || t === "c+") && Math.random() < .5;
        const A = swap ? b : a, B = swap ? a : b;
        const f = t[0] === "s" ? "sin" : "cos", op = t[1] === "+" ? "+" : "−";
        const v = t === "s+" ? Math.sin(a * D) + Math.sin(b * D) : t === "s-" ? Math.sin(a * D) - Math.sin(b * D) : t === "c+" ? Math.cos(a * D) + Math.cos(b * D) : Math.cos(a * D) - Math.cos(b * D);
        const form = { "s+": `2 sin ${s}° cos ${d}°`, "s-": `2 cos ${s}° sin ${d}°`, "c+": `2 cos ${s}° cos ${d}°`, "c-": `−2 sin ${s}° sin ${d}°` }[t];
        const rule = { "s+": "sin a + sin b = 2 sin((a+b)/2) cos((a−b)/2)", "s-": "sin a − sin b = 2 cos((a+b)/2) sin((a−b)/2)", "c+": "cos a + cos b = 2 cos((a+b)/2) cos((a−b)/2)", "c-": "cos a − cos b = −2 sin((a+b)/2) sin((a−b)/2)" }[t];
        const vals = { "s+": [sinE(s), cosE(d)], "s-": [cosE(s), sinE(d)], "c+": [cosE(s), cosE(d)], "c-": [sinE(s), sinE(d)] }[t].map(fmtE);
        return { text: `${f} ${A}° ${op} ${f} ${B}° = ?`, answer: v, show: fmtE(E), placeholder: "məs. √6/2",
          solution: `${rule}. (${a}° + ${b}°)/2 = ${s}°, (${a}° − ${b}°)/2 = ${d}°. Deməli ${form} = ${t === "c-" ? "−" : ""}2·${vals[0]}·${vals[1]} = ${fmtE(E)}.` };
      } },
    { id: "maks", minVariety: 30, ad: "a·sin x + b·cos x: ən böyük, ən kiçik", izah: "a sin x + b cos x = R sin(x + φ), R = √(a² + b²). Qiymətləri [−R; R] aralığındadır. Cavab: 13, 1 + √13, −3 − 2√10 kimi.",
      gen() {
        let a, b;
        if (Math.random() < .5) { [a, b] = pick(PY); } else { do { a = rnd(1, 9); b = rnd(1, 9); } while (sqf(a * a + b * b)[1] === 1); }
        a *= sg(); b *= sg();
        const c = rnd(-6, 6), N = a * a + b * b, [k, m] = sqf(N), mx = Math.random() < .5;
        const x0 = Math.atan2(a, b) + (mx ? 0 : Math.PI), v = c + a * Math.sin(x0) + b * Math.cos(x0);
        const Rtxt = m === 1 ? String(k) : (k > 1 ? k : "") + "√" + m;
        return { text: `${expr(a, b, c)} ifadəsinin ən ${mx ? "böyük" : "kiçik"} qiymətini tap.`, answer: v, show: withC(c, mx ? 1 : -1, k, m), placeholder: "məs. 1 + √13",
          solution: `R = √(a² + b²) = √(${a * a} + ${b * b}) = √${N}${m === 1 ? " = " + k : k > 1 ? " = " + Rtxt : ""}. a sin x + b cos x = R sin(x + φ), onun qiymətləri −${Rtxt}-dən ${Rtxt}-ə qədər dəyişir.${c ? ` Üstəgəl ${c}.` : ""} Ən ${mx ? "böyük" : "kiçik"} qiymət = ${c ? c + (mx ? " + " : " − ") : (mx ? "" : "−")}${Rtxt} = ${withC(c, mx ? 1 : -1, k, m)}.` };
      } },
    { id: "tam", ad: "Neçə tam qiymət?", izah: "a sin x + b cos x yalnız [−R; R] aralığındakı qiymətləri alır. Tam ədədləri say.",
      gen() {
        let a, b; do { a = rnd(1, 12); b = rnd(1, 12); } while (a * a + b * b < 5);
        a *= sg(); b *= sg();
        const N = a * a + b * b, fl = Math.floor(Math.sqrt(N) + 1e-9), sqs = sqf(N), Rt = sqs[1] === 1 ? String(sqs[0]) : (sqs[0] > 1 ? sqs[0] : "") + "√" + sqs[1];
        const Req = Rt === "√" + N ? "" : " = " + Rt;
        const r = Math.random();
        if (r < .4) {
          const c = rnd(-5, 5);
          return { text: `${expr(a, b, c)} ifadəsi neçə müxtəlif tam qiymət ala bilər? (x — istənilən həqiqi ədəd)`, answer: 2 * fl + 1, show: String(2 * fl + 1), tol: 0.01,
            solution: `R = √${N}${Req} ≈ ${(Math.round(Math.sqrt(N) * 100) / 100).toString().replace(".", ",")}. İfadə ${c} − R ilə ${c} + R arasındakı bütün qiymətləri alır. ${c} tam ədəddir, ona görə tam qiymətlər ${c}-dan hər iki tərəfə ${fl} addıma qədərdir: cəmi 2·${fl} + 1 = ${2 * fl + 1}.` };
        }
        if (r < .75) {
          return { text: `${a < 0 ? "−" : ""}${Math.abs(a) === 1 ? "" : Math.abs(a)}sin x ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}cos x = n tənliyinin həlli var. n neçə tam qiymət ala bilər?`, answer: 2 * fl + 1, show: String(2 * fl + 1), tol: 0.01,
            solution: `Tənliyin həlli olması üçün |n| ≤ R = √${N}${Req} ≈ ${(Math.round(Math.sqrt(N) * 100) / 100).toString().replace(".", ",")} lazımdır. Tam n: −${fl}, …, ${fl} — cəmi 2·${fl} + 1 = ${2 * fl + 1}.` };
        }
        return { text: `${a < 0 ? "−" : ""}${Math.abs(a) === 1 ? "" : Math.abs(a)}sin x ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}cos x = n tənliyi həlli olmayan ən kiçik natural n-i tap.`, answer: fl + 1, show: String(fl + 1), tol: 0.01,
          solution: `Həll olması üçün n ≤ R = √${N}${Req} ≈ ${(Math.round(Math.sqrt(N) * 100) / 100).toString().replace(".", ",")}. ${fl} bu şərti ödəyir, ${fl + 1} isə R-dən böyükdür. Cavab ${fl + 1}.` };
      } },
    { id: "klassik", minVariety: 20, ad: "Klassik olimpiada məsələləri", izah: "Hasili cəmə, cəmi hasilə çevir, teleskopik ixtisar. Kəsr kimi yaz (məs. 3/8).",
      gen() {
        const r = Math.random();
        if (r < .3) {
          const n = pick([5, 7, 9, 11, 13]), m = (n - 1) / 2, k = rnd(1, 9);
          const terms = Array.from({ length: m }, (_, i) => `cos(${2 * (i + 1)}π/${n})`).join(" + ");
          let v = 0; for (let i = 1; i <= m; i++) v += Math.cos(2 * Math.PI * i / n);
          return { text: `${k > 1 ? k + "·(" : ""}${terms}${k > 1 ? ")" : ""} = ?`, answer: k * v, show: frac(-k, 2), placeholder: "məs. −3/2",
            solution: `S = ${terms} olsun. 2 sin(π/${n}) cos(2jπ/${n}) = sin((2j+1)π/${n}) − sin((2j−1)π/${n}) (hasil → fərq). j = 1…${m} üçün toplayanda ortadakılar ixtisar olur: 2 sin(π/${n})·S = sin(${2 * m + 1}π/${n}) − sin(π/${n}) = sin π − sin(π/${n}) = −sin(π/${n}). Deməli S = −1/2, cavab ${k}·(−1/2) = ${frac(-k, 2)}.` };
        }
        if (r < .5) {
          const k = rnd(1, 15);
          return { text: `${k}·sin 10°·sin 50°·sin 70° = ?`, answer: k * Math.sin(10 * D) * Math.sin(50 * D) * Math.sin(70 * D), show: frac(k, 8), placeholder: "məs. 3/8",
            solution: `sin 10° = cos 80°, sin 50° = cos 40°, sin 70° = cos 20°. P = cos 20°·cos 40°·cos 80°. 8 sin 20°·P = 4 sin 40° cos 40° cos 80° = 2 sin 80° cos 80° = sin 160° = sin 20°, yəni P = 1/8. Cavab ${k}/8 = ${frac(k, 8)}.` };
        }
        if (r < .7) {
          const k = pick([2, 4, 6, 8, 10, 1, 3]);
          return { text: `${k}·(cos 36° − cos 72°) = ?`, answer: k * (Math.cos(36 * D) - Math.cos(72 * D)), show: frac(k, 2), placeholder: "məs. 3/2",
            solution: `cos 36° − cos 72° = −2 sin 54° sin(−18°) = 2 sin 54° sin 18° = 2 cos 36° cos 72°. cos 36°·cos 72° = 1/4 olduğundan (sin 36°-ya vurub ikiqat bucaqdan), fərq 2·1/4 = 1/2. Cavab ${k}/2 = ${frac(k, 2)}.` };
        }
        const k = pick([4, 8, 12, 16, 2, 6, 1, 3]);
        const v = Math.sin(20 * D) ** 2 + Math.cos(50 * D) ** 2 + Math.sin(20 * D) * Math.cos(50 * D);
        return { text: `${k}·(sin²20° + cos²50° + sin 20°·cos 50°) = ?`, answer: k * v, show: frac(3 * k, 4), placeholder: "məs. 9/4",
          solution: `sin²20° = (1 − cos 40°)/2, cos²50° = (1 + cos 100°)/2, sin 20° cos 50° = (sin 70° + sin(−30°))/2 = (sin 70° − 1/2)/2. Cəm = 3/4 + (cos 100° − cos 40° + sin 70°)/2. cos 100° − cos 40° = −2 sin 70° sin 30° = −sin 70°, mötərizə 0 olur. İfadə = 3/4, cavab ${frac(3 * k, 4)}.` };
      } },
    { id: "heyat", ad: "Həyatdan: iki dalğanın cəmi", izah: "Eyni tezlikli iki rəqsin cəmi də rəqsdir. Amplitud — a sin x + b sin(x + φ) ifadəsinin ən böyük qiyməti. Kök və ya tam yaz.",
      gen() {
        const ph = pick([60, 90, 120]), a = rnd(1, 9), b = rnd(1, 9);
        const Nn = ph === 90 ? a * a + b * b : ph === 60 ? a * a + b * b + a * b : a * a + b * b - a * b, [k, m] = sqf(Nn);
        const v = Math.hypot(a + b * Math.cos(ph * D), b * Math.sin(ph * D));
        const story = pick([
          { t: `Ardıcıl qoşulmuş iki mənbənin gərginlikləri U₁ = ${a} sin ωt və U₂ = ${b} sin(ωt + ${ph}°) volt-dur. Birlikdə gərginliyin ən böyük qiyməti (V ilə) nədir?`, u: " V" },
          { t: `İki dinamikdən eyni tezlikli səs dalğaları gəlir: ${a} sin ωt və ${b} sin(ωt + ${ph}°) (Pa ilə). Nöqtədə cəm təzyiqin ən böyük qiyməti (Pa ilə) nədir?`, u: " Pa" },
        ]);
        return { text: story.t, answer: v, unit: story.u.trim(), show: (m === 1 ? String(k) : (k > 1 ? k : "") + "√" + m) + story.u, placeholder: "məs. 5√3",
          solution: `a sin x + b sin(x + φ) = (a + b cos φ) sin x + b sin φ · cos x. Amplitud R² = (a + b cos φ)² + (b sin φ)² = a² + b² + 2ab cos φ. Burada cos ${ph}° = ${ph === 60 ? "1/2" : ph === 90 ? "0" : "−1/2"}: R² = ${a * a} + ${b * b} ${ph === 60 ? "+ " + a * b : ph === 120 ? "− " + a * b : ""} = ${Nn}. R = √${Nn}${m === 1 ? " = " + k : k > 1 ? " = " + k + "√" + m : ""}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "c + a sin x + b cos x ifadəsinin ən böyük qiymətini tapan üç addımlı həll. Birində səhv var. Hansında?",
      gen() {
        const [a, b] = pick(PY), c = rnd(-5, 7) || 3, R = Math.round(Math.sqrt(a * a + b * b)), good = c + R;
        const s = [`a sin x + b cos x = R sin(x + φ), R = √(a² + b²)`, `R = √(${a * a} + ${b * b}) = √${a * a + b * b} = ${R}`, `ən böyük qiymət = c + R = ${M(c)} + ${R} = ${M(good)}`];
        const bad = rnd(0, 2);
        if (bad === 0) { s[0] = `a sin x + b cos x = R sin(x + φ), R = a + b`; s[1] = `R = ${a} + ${b} = ${a + b}`; s[2] = `ən böyük qiymət = c + R = ${M(c)} + ${a + b} = ${M(c + a + b)}`; }
        if (bad === 1) { s[1] = `R = √(${a * a} + ${b * b}) = √${a * a * b * b} = ${a * b}`; s[2] = `ən böyük qiymət = c + R = ${M(c)} + ${a * b} = ${M(c + a * b)}`; }
        if (bad === 2) s[2] = `ən böyük qiymət = c − R = ${M(c)} − ${R} = ${M(c - R)}`;
        const text = h("div", {}, h("p", {}, `Məsələ: ${expr(a, b, c)} ifadəsinin ən böyük qiymətini tap.`), h("ol", { class: "oy-steps" }, ...s.map(x => h("li", {}, x))));
        const why = ["1-ci addımda düstur səhvdir: R = √(a² + b²), a + b yox. Kvadratlar toplanır, sonra kök alınır.", `2-ci addımda səhv var: kvadratlar toplanmalıdır (${a * a} + ${b * b} = ${a * a + b * b}), vurulmamalıdır.`, "3-cü addımda səhv var: ən böyük qiymət üçün R əlavə olunur (c + R); c − R ən kiçik qiymətdir."][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci", "2-ci", "3-cü"][bad] + " addım", solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-trig-cevirme", title: "Cəmin hasilə çevrilməsi; a·sin x ± b·cos x", fenn: "olimpiada", link: "dersler/ol-trig-cevirme.html",
      format: "Cavab ədəddir: kəsr −3/2, kök 5√3 və ya √6/2, iki hədli 1 + √13 (onluq 3.6 təxmini yazma, dəqiq formada yaz).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hasil", "hasil", "cem", "cem", "maks", "maks", "tam", "klassik", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-trig-cevirme.html")) b.push("dersler/ol-trig-cevirme.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
