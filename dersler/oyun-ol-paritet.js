// Olimpiada: paritet (cüt/tək) — game levels (x² − y² = N, sums of consecutive numbers, ± signs, domino colouring, cup flipping, word problems).
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const D1 = ["", "ə", "yə", "ə", "ə", "ə", "ya", "yə", "ə", "a"], D10 = ["", "a", "yə", "a", "a", "yə", "a", "ə", "ə", "a"];
  const dat = n => { const a = Math.abs(n); const s = a === 0 ? "a" : a % 10 ? D1[a % 10] : a % 100 ? D10[(a / 10) % 10] : a % 1e6 ? "ə" : "a"; return S(n) + "-" + s; };
  const isSq = n => { const r = Math.round(Math.sqrt(n)); return r * r === n; };
  const oddDivs = n => { const o = []; for (let d = 1; d <= n; d += 2) if (n % d === 0) o.push(d); return o; };
  // representations of N as a sum of k ≥ 2 consecutive natural numbers: [first, k]
  const reps = N => { const out = []; for (let k = 2; k * (k + 1) / 2 <= N; k++) { const t = N - k * (k - 1) / 2; if (t % k === 0 && t / k >= 1) out.push([t / k, k]); } return out; };
  const repTxt = ([a, k]) => k === 2 ? `${a} + ${a + 1}` : k === 3 ? `${a} + ${a + 1} + ${a + 2}` : `${a} + ${a + 1} + … + ${a + k - 1}`;
  // factor pairs d · e = N with d < e, same parity
  const sqPairs = N => { const p = []; for (let d = 1; d * d < N; d++) if (N % d === 0 && (d + N / d) % 2 === 0) p.push([d, N / d]); return p; };

  const levels = [
    { id: "kvferq", ad: "x² − y² = N", izah: "(x − y)(x + y) = N, və x − y ilə x + y eyni paritetlidir (cəmləri 2x cütdür). N ≡ 2 (mod 4) olsa, həll yoxdur.",
      gen() {
        const N = Math.random() < .25 ? 4 * rnd(5, 100) + 2 : rnd(15, 400);
        const P = sqPairs(N);
        let brute = 0; for (let y = 1; y <= N; y++) if (isSq(N + y * y)) brute++;
        if (brute !== P.length) throw new Error("kvferq " + N);
        const sols = P.map(([d, e]) => `(${(d + e) / 2}; ${(e - d) / 2})`);
        const head = `x² − y² = (x − y)(x + y) = ${N}. (x − y) + (x + y) = 2x cütdür → x − y və x + y ikisi də cüt və ya ikisi də təkdir. `;
        if (P.length && Math.random() < .3) {
          const xmax = (P[0][0] + P[0][1]) / 2;
          return { text: `x² − y² = ${N} tənliyinin natural ədədlərdə həlləri içində x-in ən böyük qiymətini tap.`, answer: xmax, show: String(xmax), tol: 0.01,
            solution: head + `Uyğun ayrılışlar: ${P.map(([d, e]) => d + " · " + e).join("; ")}. Həllər (x; y): ${sols.join(", ")}. x = (d + e)/2 ən böyükdür, d ən kiçik olanda: x = ${xmax}.` };
        }
        const why = N % 4 === 2
          ? `${N} cütdür, amma 4-ə bölünmür. İki tək ədədin hasili tək olardı, iki cüt ədədin hasili 4-ə bölünərdi — hər ikisi mümkün deyil. Həll yoxdur: 0.`
          : P.length ? `Eyni paritetli ayrılışlar (d < e): ${P.map(([d, e]) => d + " · " + e).join("; ")}. Hər biri bir həll verir: x = (d + e)/2, y = (e − d)/2 → ${sols.join(", ")}. Cəmi ${P.length}.`
          : `${N} ədədinin eyni paritetli, müxtəlif vuruqlu ayrılışı yoxdur — həll yoxdur: 0.`;
        return { text: `x² − y² = ${N} tənliyinin natural ədədlərdə neçə həlli (x; y) var?`, answer: P.length, show: String(P.length), tol: 0.01, solution: head + why };
      } },
    { id: "ardicil", ad: "Ardıcıl ədədlərin cəmi", izah: "a + (a + 1) + … (k toplanan) = k(2a + k − 1)/2. Vuruqlar k və 2a + k − 1 müxtəlif paritetlidir → yazılışların sayı = tək bölənlərin sayı − 1.",
      gen() {
        const kind = pick(["ways", "ways", "maxk", "pow2", "tri"]);
        if (kind === "ways" || kind === "maxk") {
          let N, R; do { N = rnd(30, 3000); R = reps(N); } while (!R.length || (kind === "ways" && R.length < 2 && Math.random() < .7));
          const od = oddDivs(N); if (od.length - 1 !== R.length) throw new Error("ardicil " + N);
          const list = R.length <= 4 ? R.map(r => `${N} = ${repTxt(r)} (${r[1]} toplanan)`).join("; ") : "";
          if (kind === "maxk") {
            const best = R.reduce((m, r) => r[1] > m[1] ? r : m);
            return { text: `${N} ədədini ən çox neçə ardıcıl natural ədədin cəmi kimi yazmaq olar?`, answer: best[1], show: String(best[1]), tol: 0.01,
              solution: `2 · ${N} = k(2a + k − 1), burada k — toplananların sayı, a ≥ 1 — birinci toplanan. k < 2a + k − 1 olmalıdır və vuruqlar müxtəlif paritetlidir. Mümkün k-lar: ${R.map(r => r[1]).join(", ")}. Ən böyüyü: ${N} = ${repTxt(best)}, k = ${best[1]}.`};
          }
          return { text: `${N} ədədini iki və ya daha çox ardıcıl natural ədədin cəmi kimi neçə üsulla yazmaq olar?`, answer: R.length, show: String(R.length), tol: 0.01,
            solution: `2 · ${N} = k(2a + k − 1): vuruqların fərqi 2a − 1 təkdir, deməli biri tək, biri cütdür. Hər tək bölən bir yazılış verir. ${N} ədədinin tək bölənləri: ${od.join(", ")} — ${od.length} dənə; 1 böləni bir toplananlı "yazılışa" (ədədin özünə) uyğundur. Cavab: ${od.length} − 1 = ${R.length}.` + (list ? ` (${list}.)` : "") };
        }
        if (kind === "pow2") {
          const M = rnd(50, 5000); let c = 0, t = 1; while (t <= M) { c++; t *= 2; }
          let brute = 0; for (let n = 1; n <= M; n++) if (!reps(n).length) brute++;
          if (brute !== c) throw new Error("pow2");
          return { text: `1, 2, 3, …, ${M} ədədlərindən neçəsini iki və ya daha çox ardıcıl natural ədədin cəmi kimi yazmaq olmur?`, answer: c, show: String(c), tol: 0.01,
            solution: `Yazılışların sayı = (tək bölənlərin sayı) − 1. Yazılış yoxdursa, yeganə tək bölən 1-dir — ədəd 2-nin qüvvətidir. ${dat(M)} qədər 2-nin qüvvətləri: 1, 2, 4, …, ${t / 2} — cəmi ${c}.` };
        }
        const M = rnd(20, 500); let c = 0; for (let n = 1; n <= M; n++) if ((n * (n + 1) / 2) % 2) c++;
        return { text: `n = 1, 2, …, ${M} üçün 1 + 2 + … + n cəmlərindən neçəsi tək ədəddir?`, answer: c, show: String(c), tol: 0.01,
          solution: `1 + 2 + … + n = n(n + 1)/2. n-in 4-ə bölmədə qalığına bax. n ≡ 0 və ya 3 (mod 4) olsa, n və ya n + 1 4-ə bölünür → cəm cüt. n ≡ 1 və ya 2 olsa, n(n + 1) yalnız bir dəfə 2-yə bölünür → cəm tək. 1-dən ${dat(M)} qədər qalığı 1 və ya 2 olan ədədlər: ${c}.` };
      } },
    { id: "isare", ad: "± işarələri", izah: "Bir ədədin işarəsini dəyişmək cəmi 2a qədər dəyişir — paritet dəyişmir. ±1 ± 2 … ± n qiymətləri: −S, −S + 2, …, S (S = 1 + … + n).",
      gen() {
        const n = rnd(4, 30), Sm = n * (n + 1) / 2, ask = pick(["all", "pos", "rng", "rng"]);
        const base = `1-dən ${dat(n)} qədər bütün ədədləri sırayla yazıb hər birinin qarşısına "+" və ya "−" qoyuruq (birincinin də) və nəticəni hesablayırıq.`;
        const why = `Hamısı "+" olanda nəticə S = ${n} · ${n + 1}/2 = ${Sm}. Bir ədədin (a) işarəsini dəyişmək nəticəni 2a azaldır — paritet dəyişmir, ona görə nəticə həmişə ${Sm % 2 ? "təkdir" : "cütdür"} və −${Sm} ilə ${Sm} arasındadır. Hər belə qiymət alınır (1, 2, …, ${n} ədədlərindən cəmi 0-dan ${dat(Sm)} qədər istənilən ədəd olan dəstə seçmək olur). Qiymətlər: −${Sm}, −${Sm - 2}, …, ${Sm}.`;
        if (ask === "all") return { text: base + " Neçə müxtəlif nəticə alına bilər?", answer: Sm + 1, show: String(Sm + 1), tol: 0.01, solution: why + ` Sayı: ${Sm + 1}.` };
        if (ask === "pos") { const c = Sm % 2 ? (Sm + 1) / 2 : Sm / 2;
          return { text: base + " Alına bilən nəticələrdən neçəsi müsbətdir?", answer: c, show: String(c), tol: 0.01, solution: why + ` Müsbətlər: ${Sm % 2 ? "1, 3" : "2, 4"}, …, ${Sm} — ${c} dənə.` }; }
        const L = Math.min(Sm, 40), A = rnd(-L, L - 4), B = rnd(A + 3, Math.min(Sm, A + 40));
        let c = 0; for (let t = A; t <= B; t++) if (Math.abs(t % 2) === Sm % 2) c++;
        return { text: base + ` Alına bilən nəticələrdən neçəsi ${S(A)} ilə ${S(B)} arasındadır (bu ədədlər də daxil)?`, answer: c, show: String(c), tol: 0.01,
          solution: why + ` [${S(A)}; ${S(B)}] aralığında ${Sm % 2 ? "tək" : "cüt"} ədədlər: ${c} dənə.` };
      } },
    { id: "domino", ad: "Domino və şahmat rəngi", izah: "Lövhəni şahmat kimi rənglə. Hər domino bir tünd, bir açıq xana örtür → dominoların sayı ≤ min(tünd, açıq).",
      gen() {
        for (;;) {
          const r = rnd(3, 7), c = rnd(3, 8), odd = (r * c) % 2 === 1;
          const k = odd ? pick([1, 3]) : 2, cut = new Set();
          const same = Math.random() < .6;
          while (cut.size < k) { const i = rnd(0, r - 1), j = rnd(0, c - 1); if (k === 2 && cut.size === 1 && same) { const [a, b] = [...cut][0].split(",").map(Number); if ((a + b) % 2 !== (i + j) % 2) continue; } cut.add(i + "," + j); }
          let dark = 0, light = 0; const cells = [];
          for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) if (!cut.has(i + "," + j)) { cells.push([i, j]); (i + j) % 2 ? light++ : dark++; }
          // maximum matching (Kuhn) between dark and light cells
          const id = (i, j) => i + "," + j, match = {};
          const tryK = (i, j, seen) => { for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= r || b >= c || cut.has(id(a, b)) || seen.has(id(a, b))) continue; seen.add(id(a, b)); if (!match[id(a, b)] || tryK(...match[id(a, b)], seen)) { match[id(a, b)] = [i, j]; return true; } } return false; };
          let M = 0; for (const [i, j] of cells) if ((i + j) % 2 === 0 && tryK(i, j, new Set())) M++;
          if (M !== Math.min(dark, light)) continue;
          const W = 26, svg = sv("svg", { viewBox: `0 0 ${c * W + 8} ${r * W + 8}`, class: "oy-svg", role: "img", "aria-label": `${r}×${c} lövhə, ${k} xana kəsilib` });
          for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
            const x = 4 + j * W, y = 4 + i * W, isCut = cut.has(id(i, j));
            svg.append(sv("rect", { x, y, width: W, height: W, style: `fill:${isCut ? "var(--ink)" : (i + j) % 2 ? "var(--sheet)" : "var(--accent-soft)"};stroke:var(--ink);stroke-width:1` }));
            if (isCut) svg.append(sv("text", { x: x + W / 2, y: y + W / 2 + 5, "text-anchor": "middle", style: "fill:var(--sheet);font-size:15px" }, "×"));
          }
          const where = [...cut].map(s => { const [i, j] = s.split(",").map(Number); return `${i + 1}-ci sətir, ${j + 1}-ci sütun`.replace(/(\d+)-ci/g, (m, d) => d + "-" + ({ 1: "ci", 2: "ci", 3: "cü", 4: "cü", 5: "ci", 6: "cı", 7: "ci", 8: "ci" }[d])); }).join("; ");
          return { text: `${r} × ${c} lövhədən ${k} xana kəsilib (${where}). Qalan xanalara ən çox neçə domino (1 × 2) qoymaq olar? Dominolar üst-üstə düşmür, hər biri iki qonşu xananı örtür.`, svg,
            answer: M, show: String(M), tol: 0.01,
            solution: `Lövhəni şahmat kimi rənglə (sol üst xana tünd). Kəsilmədən sonra tünd xana ${dark}, açıq xana ${light}. Hər domino bir tünd, bir açıq xana örtür → ən çox min(${dark}; ${light}) = ${M} domino. Bu qədər domino həqiqətən yerləşir (sətir-sətir düzməklə tapmaq olur). Cavab: ${M}.` };
        }
      } },
    { id: "stekan", ad: "Stəkanlar: paritet invariantı", izah: "Hər stəkan tək sayda çevrilməlidir → ümumi çevirmə sayı t · m ilə N eyni paritetlidir, həm də t · m ≥ N.",
      gen() {
        for (;;) {
          const N = rnd(5, 16), m = rnd(2, N - 1);
          if (m % 2 === 0 && N % 2 === 1) continue;
          let t0 = 1; while (t0 * m < N || (t0 * m - N) % 2) t0++;
          // BFS over the number of upside-down cups
          const dist = Array(N + 1).fill(-1), prev = Array(N + 1).fill(-1); dist[0] = 0; const q = [0];
          while (q.length) { const d = q.shift(); for (let j = 0; j <= m; j++) { if (j > d || m - j > N - d) continue; const nd = d - j + (m - j); if (dist[nd] < 0) { dist[nd] = dist[d] + 1; prev[nd] = d; q.push(nd); } } }
          if (dist[N] !== t0) continue;
          const path = []; for (let x = N; x >= 0; x = prev[x]) { path.unshift(x); if (x === 0) break; }
          return { text: `Masada ${N} stəkan var, hamısı ağzı yuxarı. Bir gedişdə istənilən ${m} stəkanı çevirmək olar (düz ${m} dənə). Hamısını ağzıaşağı etmək üçün ən az neçə gediş lazımdır?`, answer: t0, show: String(t0), tol: 0.01,
            solution: `Sonda hər stəkan tək sayda çevrilməlidir. t gedişdə cəmi ${m}t çevirmə olur; ${N} tək ədədin cəmi ${N % 2 ? "təkdir" : "cütdür"} → ${m}t ${N % 2 ? "tək" : "cüt"} olmalıdır, həm də ${m}t ≥ ${N}. Bu şərtləri ödəyən ən kiçik t = ${t0}. Bu qədər gediş kifayətdir — ağzıaşağı stəkanların sayı: ${path.join(" → ")}. Cavab: ${t0}.` };
        }
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Dostluqlar iki dəfə sayılır; vərəqin bir üzü tək, o biri cüt səhifədir; hər sındırma parçaların sayını 1 artırır.",
      gen() {
        const kind = pick(["dost", "dost", "vereq", "vereq", "sokolad", "turnir"]);
        if (kind === "dost") {
          for (;;) {
            const n = rnd(8, 30), d1 = rnd(2, 6); let d2 = rnd(2, 6); if (d2 === d1) continue;
            const a = rnd(2, n - 2); if ((a * d1 + (n - a) * d2) % 2) continue;
            const deg = Array(a).fill(d1).concat(Array(n - a).fill(d2)).sort((x, y) => y - x);
            let ok = true, L = 0; for (let k = 1; k <= n && ok; k++) { L += deg[k - 1]; let R = k * (k - 1); for (let i = k; i < n; i++) R += Math.min(deg[i], k); if (L > R) ok = false; }
            if (!ok) continue;
            const T = a * d1 + (n - a) * d2;
            return { text: `Klubda ${n} nəfər var. Onlardan ${a} nəfərin hər birinin klubda düz ${d1} dostu, qalanlarının hər birinin isə düz ${d2} dostu var. Klubda neçə dost cütü var?`, answer: T / 2, show: String(T / 2), tol: 0.01,
              solution: `Hər kəsin dostlarını toplayaq: ${a} · ${d1} + ${n - a} · ${d2} = ${T}. Hər dostluq bu cəmdə iki dəfə sayılır (hər iki dostda). Cütlərin sayı: ${T} : 2 = ${T / 2}. (Buna görə cəm həmişə cütdür və tək sayda dostu olan adamların sayı həmişə cütdür.)` };
          }
        }
        if (kind === "vereq") {
          for (;;) {
            const p = rnd(101, 899); if (p % 2 === 0) continue; const ds = String(p).split(""); if (new Set(ds).size < 3) continue;
            const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(o => +o.map(i => ds[i]).join(""));
            const cand = [...new Set(perms)].filter(x => x > p && x % 2 === 0);
            if (cand.length !== 1) continue;
            const L = cand[0], sheets = (L - p + 1) / 2;
            return { text: `Kitabdan ardıcıl bir neçə vərəq qopub. Qopmuş hissənin ilk səhifəsinin nömrəsi: ${p}. Sonuncu səhifənin nömrəsi isə eyni rəqəmlərdən başqa sırada yazılıb. Neçə vərəq qopub?`, answer: sheets, show: String(sheets), unit: "vərəq", tol: 0.01,
              solution: `Hər vərəqin bir üzü tək, o biri cüt səhifədir: qopmuş hissə tək səhifə ilə başlayır, cüt səhifə ilə bitir. ${p} ədədinin rəqəmlərindən düzələn, ${p} ədədindən böyük cüt ədədlər: yalnız ${L}. Səhifələr ${p}…${L}: ${L} − ${p} + 1 = ${L - p + 1} səhifə = ${sheets} vərəq.` };
          }
        }
        if (kind === "sokolad") {
          const a = rnd(3, 12), b = rnd(3, 12);
          return { text: `${a} × ${b} şokolad lövhəsini ayrı-ayrı ${a * b} kiçik kvadrata bölmək lazımdır. Bir sındırmada bir parçanı düz xətt boyunca iki parçaya bölmək olar (parçaları üst-üstə qoymaq olmaz). Ən az neçə sındırma lazımdır?`, answer: a * b - 1, show: String(a * b - 1), tol: 0.01,
            solution: `Hər sındırma parçaların sayını düz 1 artırır. Əvvəl 1 parça, sonda ${a * b} parça → necə sındırsan da, ${a * b} − 1 = ${a * b - 1} sındırma lazımdır.` };
        }
        const n = rnd(9, 300);
        return { text: `Stolüstü tennis turnirində ${n} oyunçu iştirak edir. Hər oyunda uduzan turnirdən çıxır, heç-heçə olmur. Qalib bəlli olana qədər neçə oyun keçiriləcək?`, answer: n - 1, show: String(n - 1), tol: 0.01,
          solution: `Hər oyun düz bir oyunçunu çıxarır. Qalib qalana qədər ${n} − 1 = ${n - 1} oyunçu çıxmalıdır → ${n - 1} oyun. Cütlərin necə düzülməsi (və oyunçu sayının cüt-tək olması) heç nəyi dəyişmir.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const C = ["1-ci addım", "2-ci addım", "3-cü addım"], bad = rnd(0, 2);
        if (Math.random() < .5) {
          let N, P; do { N = rnd(20, 300); P = sqPairs(N); } while (P.length < 2);
          let pairs = P.map(([d, e]) => d + " · " + e), cnt = P.length;
          const wrongPair = (() => { for (let d = 1; d * d < N; d++) if (N % d === 0 && (d + N / d) % 2) return d + " · " + N / d; return null; })();
          const steps = [`x² − y² = (x − y)(x + y) = ${N}.`, `x − y və x + y eyni paritetlidir; uyğun ayrılışlar: ${pairs.join("; ")}.`, `Hər ayrılış bir həll verir → ${cnt} həll.`];
          let why;
          if (bad === 0) { steps[0] = `x² − y² = (x − y)² = ${N}.`; why = `1-ci addım: x² − y² = (x − y)(x + y); (x − y)² = x² − 2xy + y² başqa ifadədir.`; }
          if (bad === 1) {
            if (wrongPair) { steps[1] = `x − y və x + y eyni paritetlidir; uyğun ayrılışlar: ${pairs.concat(wrongPair).join("; ")}.`; why = `2-ci addım: ${wrongPair} ayrılışında vuruqlar müxtəlif paritetlidir — x = (d + e)/2 tam olmur. Düz siyahı: ${pairs.join("; ")}.`; }
            else { steps[1] = `x − y və x + y eyni paritetlidir; uyğun ayrılışlar: ${pairs.slice(1).join("; ")}.`; why = `2-ci addım: ${pairs[0]} ayrılışı unudulub. Düz siyahı: ${pairs.join("; ")}.`; }
          }
          if (bad === 2) { steps[2] = `Hər ayrılış iki həll verir: (x; y) və (y; x) → ${2 * cnt} həll.`; why = `3-cü addım: x² − y² = ${N} > 0 olduğu üçün x > y; (y; x) həll deyil. Düz cavab: ${cnt} həll.`; }
          const text = h("div", {}, h("p", {}, `Tapşırıq: x² − y² = ${N} tənliyinin natural həllərinin sayını tap.`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
          return { text, choices: C, correct: bad, show: C[bad], solution: why };
        }
        let N, od; do { N = rnd(30, 600); od = oddDivs(N); } while (od.length < 3 || N % 2);
        const steps = [`a + (a + 1) + … + (a + k − 1) = ${N} → 2 · ${N} = k(2a + k − 1); vuruqlardan biri tək, biri cütdür.`, `${N} ədədinin tək bölənləri: ${od.join(", ")} — ${od.length} dənə.`, `1 bölənini (bir toplananlı "cəm") atırıq → ${od.length - 1} üsul.`];
        let why;
        if (bad === 0) { steps[0] = `a + (a + 1) + … + (a + k − 1) = ${N} → 2 · ${N} = k(2a + k − 1); vuruqların ikisi də təkdir.`; why = `1-ci addım: k və 2a + k − 1-in fərqi 2a − 1 təkdir, deməli onlar müxtəlif paritetlidir (biri tək, biri cüt) — 2 · ${N} cüt olduğu üçün ikisi də tək ola bilməz.`; }
        if (bad === 1) { const miss = od[1 + rnd(0, od.length - 2)], wl = od.filter(x => x !== miss); steps[1] = `${N} ədədinin tək bölənləri: ${wl.join(", ")} — ${wl.length} dənə.`; steps[2] = `1 bölənini (bir toplananlı "cəm") atırıq → ${wl.length - 1} üsul.`; why = `2-ci addım: ${miss} bölənini unudub. Tək bölənlər: ${od.join(", ")} — ${od.length} dənə, cavab ${od.length - 1}.`; }
        if (bad === 2) { steps[2] = `Hər tək bölən bir üsul verir → ${od.length} üsul.`; why = `3-cü addım: 1 böləni "${N} = ${N}" yazılışına uyğundur — bu, ən azı iki toplananlı cəm deyil. Düz cavab: ${od.length} − 1 = ${od.length - 1}.`; }
        const text = h("div", {}, h("p", {}, `Tapşırıq: ${N} ədədini iki və ya daha çox ardıcıl natural ədədin cəmi kimi neçə üsulla yazmaq olar?`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: C, correct: bad, show: C[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-paritet", title: "Paritet (cüt/tək)", fenn: "olimpiada", link: "dersler/ol-paritet.html",
      format: "Cavab ədəddir: say (neçə həll, neçə üsul, neçə gediş). Həll yoxdursa — 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["kvferq", "kvferq", "ardicil", "ardicil", "isare", "domino", "domino", "stekan", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-paritet.html")) b.push("dersler/ol-paritet.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
