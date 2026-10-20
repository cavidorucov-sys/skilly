// Permutasiya, aranjeman, kombinasiya; kombinatorik ehtimal (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { const g = gcd(p, q) || 1; return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };
  const F = n => n <= 1 ? 1 : n * F(n - 1);                          // n!
  const A = (n, k) => k < 0 || k > n ? 0 : F(n) / F(n - k);          // aranjeman
  const C = (n, k) => k < 0 || k > n ? 0 : Math.round(F(n) / (F(k) * F(n - k)));
  const EX = 0.01;                                                     // exact integer answers
  const PR = 1e-4;                                                     // probabilities: fraction, not a rounded decimal

  // words for arrangements with repeated letters
  const WORDS = ["KİTAB", "ALMA", "BANAN", "ANANAS", "DƏDƏ", "MƏKTƏB", "KƏLƏM", "PAPAQ", "KOKOS", "LALƏ", "TƏTİL", "SƏMƏNİ", "QARAQAŞ", "NANƏ", "BAĞBAN", "KAKAO", "TƏTƏ", "BULUD"];
  function wordInfo(w) {
    const L = Array.from(w), cnt = {};
    for (const c of L) cnt[c] = (cnt[c] || 0) + 1;
    const rep = Object.entries(cnt).filter(([, k]) => k > 1);
    let den = 1; for (const [, k] of rep) den *= F(k);
    return { n: L.length, rep, den, ans: F(L.length) / den };
  }

  const levels = [
    { id: "perm", ad: "Permutasiya", izah: "n əşyanı sıraya düzmək: n!. Şərt varsa: \"yanaşı\" — blok kimi say; \"yanaşı deyil\" — hamısından yanaşıları çıx; təkrarlanan hərflər — n!-i təkrarların faktoriallarına böl.",
      gen() {
        const kind = pick(["simple", "together", "apart", "ends", "round", "word", "word"]);
        const n = rnd(4, 8);
        if (kind === "simple") return { text: `${n} kitab rəfdə bir sırada neçə müxtəlif üsulla düzülə bilər?`, answer: F(n), show: String(F(n)), tol: EX,
          solution: `Birinci yerə ${n} kitab, ikinciyə ${n - 1}, … sonuncuya 1. ${n}! = ${F(n)}.` };
        if (kind === "together") return { text: `${n} nəfər bir sırada şəkil çəkdirir. Aysel və Fikrət mütləq yanaşı durmalıdır. Neçə düzülüş var?`, answer: 2 * F(n - 1), show: String(2 * F(n - 1)), tol: EX,
          solution: `Aysel və Fikrəti bir "blok" say: ${n - 1} obyekt → ${n - 1}! = ${F(n - 1)}. Blokun içində 2 sıra var (AF, FA). 2 · ${F(n - 1)} = ${2 * F(n - 1)}.` };
        if (kind === "apart") return { text: `${n} nəfər bir sırada durur. Aysel və Fikrət yanaşı durmamalıdır. Neçə düzülüş var?`, answer: F(n) - 2 * F(n - 1), show: String(F(n) - 2 * F(n - 1)), tol: EX,
          solution: `Hamısı: ${n}! = ${F(n)}. Yanaşı olanlar: 2 · ${n - 1}! = ${2 * F(n - 1)}. Fərq: ${F(n)} − ${2 * F(n - 1)} = ${F(n) - 2 * F(n - 1)}.` };
        if (kind === "ends") return { text: `${n} nəfər bir sırada durur. Aysel birinci, Fikrət isə sonuncu olmalıdır. Neçə düzülüş var?`, answer: F(n - 2), show: String(F(n - 2)), tol: EX,
          solution: `İki yer artıq doludur. Qalan ${n - 2} nəfər ortadakı ${n - 2} yerə düzülür: ${n - 2}! = ${F(n - 2)}.` };
        if (kind === "round") return { text: `${n} nəfər dəyirmi masa arxasında oturur. Yalnız qonşuluq vacibdir (hamını eyni qədər fırlatsaq, düzülüş dəyişmir). Neçə müxtəlif oturuş var?`, answer: F(n - 1), show: String(F(n - 1)), tol: EX,
          solution: `Bir nəfəri yerində "bərkid" (fırlanmanı aradan qaldırırıq). Qalan ${n - 1} nəfər: (${n} − 1)! = ${F(n - 1)}.` };
        const w = pick(WORDS), I = wordInfo(w);
        const repTxt = I.rep.length ? I.rep.map(([c, k]) => `"${c}" ${k} dəfə`).join(", ") : "təkrar yoxdur";
        return { text: `"${w}" sözünün hərflərindən (hamısını işlətməklə) neçə müxtəlif "söz" (hərf düzülüşü) yazmaq olar? Mənası olması vacib deyil.`, answer: I.ans, show: String(I.ans), tol: EX,
          solution: `${I.n} hərf; ${repTxt}. ${I.n}!` + (I.rep.length ? ` / (${I.rep.map(([, k]) => k + "!").join(" · ")}) = ${F(I.n)} / ${I.den} = ${I.ans}.` : ` = ${I.ans}.`) };
      } },
    { id: "aranj", ad: "Aranjeman", izah: "n-dən k-nı seçib sıraya düzmək (yer/rol vacibdir): A(n, k) = n · (n − 1) · … (k vuruq) = n!/(n − k)!.",
      gen() {
        const kind = pick(["podium", "roles", "digits", "flag"]);
        if (kind === "podium") { const n = rnd(5, 12);
          return { text: `Yarışda ${n} idmançı var. Qızıl, gümüş və bürünc medallar neçə üsulla paylana bilər? (Bir nəfər bir medal alır.)`, answer: A(n, 3), show: String(A(n, 3)), tol: EX,
            solution: `Sıra vacibdir (qızıl ≠ gümüş): A(${n}, 3) = ${n} · ${n - 1} · ${n - 2} = ${A(n, 3)}.` }; }
        if (kind === "roles") { const n = rnd(8, 30), k = pick([2, 2, 3]);
          const r = k === 2 ? "kapitan və onun müavinini" : "sədr, müavin və katibi";
          return { text: `Sinifdə ${n} şagird var. ${r} neçə üsulla seçmək olar? (Bir nəfər bir vəzifə tutur.)`, answer: A(n, k), show: String(A(n, k)), tol: EX,
            solution: `Vəzifələr fərqlidir — sıra vacibdir: A(${n}, ${k}) = ${Array.from({ length: k }, (_, i) => n - i).join(" · ")} = ${A(n, k)}.` }; }
        if (kind === "digits") { const m = rnd(5, 9), k = rnd(2, Math.min(4, m - 1));
          return { text: `1, 2, …, ${m} rəqəmlərindən rəqəmləri təkrarlanmayan neçə ${k}-rəqəmli ədəd yazmaq olar?`, answer: A(m, k), show: String(A(m, k)), tol: EX,
            solution: `Sıfır yoxdur, ona görə hər yerə istənilən qalmış rəqəm düşə bilər: A(${m}, ${k}) = ${Array.from({ length: k }, (_, i) => m - i).join(" · ")} = ${A(m, k)}.` }; }
        const n = rnd(4, 9);
        return { text: `${n} rəngli parça var. Üç üfüqi zolaqlı bayraq tikilir, zolaqların rəngi müxtəlifdir. Neçə bayraq tikmək olar? (Yuxarı, orta, aşağı zolaq fərqlidir.)`, answer: A(n, 3), show: String(A(n, 3)), tol: EX,
          solution: `Yuxarıya ${n}, ortaya ${n - 1}, aşağıya ${n - 2} rəng: A(${n}, 3) = ${A(n, 3)}.` };
      } },
    { id: "komb", ad: "Kombinasiya", izah: "Sıra vacib deyilsə — C(n, k) = n!/(k!(n − k)!). Şərtli seçimdə hasil qaydası və \"hamısı − pis hallar\".",
      gen() {
        const kind = pick(["team", "hands", "diag", "tri", "tri-col", "mixed", "atleast", "parallel"]);
        if (kind === "team") { const n = rnd(6, 15), k = rnd(2, 4);
          return { text: `${n} şagirddən ${k} nəfərlik komanda neçə üsulla seçilə bilər?`, answer: C(n, k), show: String(C(n, k)), tol: EX,
            solution: `Komandada sıra yoxdur: C(${n}, ${k}) = ${A(n, k)} / ${k}! = ${A(n, k)} / ${F(k)} = ${C(n, k)}.` }; }
        if (kind === "hands") { const n = rnd(5, 30);
          return { text: `Görüşdə ${n} nəfər hər biri digərləri ilə bir dəfə əl sıxdı. Cəmi neçə əl sıxma oldu?`, answer: C(n, 2), show: String(C(n, 2)), tol: EX,
            solution: `Hər əl sıxma — 2 nəfərlik cütdür: C(${n}, 2) = ${n} · ${n - 1} / 2 = ${C(n, 2)}.` }; }
        if (kind === "diag") { const n = rnd(5, 20);
          return { text: `Qabarıq ${n}-bucaqlının neçə diaqonalı var?`, answer: n * (n - 3) / 2, show: String(n * (n - 3) / 2), tol: EX,
            solution: `Təpə cütləri: C(${n}, 2) = ${C(n, 2)}. Onlardan ${n} cüt tərəfdir. ${C(n, 2)} − ${n} = ${n * (n - 3) / 2}.` }; }
        if (kind === "tri") { const n = rnd(5, 12);
          return { text: `Müstəvidə ${n} nöqtə var, heç üçü bir düz xətt üzərində deyil. Təpələri bu nöqtələrdə olan neçə üçbucaq var?`, answer: C(n, 3), show: String(C(n, 3)), tol: EX,
            solution: `İstənilən 3 nöqtə üçbucaq verir: C(${n}, 3) = ${n} · ${n - 1} · ${n - 2} / 6 = ${C(n, 3)}.` }; }
        if (kind === "tri-col") { const n = rnd(7, 12), m = rnd(3, n - 3);
          return { text: `Müstəvidə ${n} nöqtə var. Onlardan ${m} nöqtə bir düz xətt üzərindədir, başqa heç üç nöqtə bir xətt üzərində deyil. Təpələri bu nöqtələrdə olan neçə üçbucaq var?`, answer: C(n, 3) - C(m, 3), show: String(C(n, 3) - C(m, 3)), tol: EX,
            solution: `Bütün üçlüklər: C(${n}, 3) = ${C(n, 3)}. Bir xəttdəki ${m} nöqtədən götürülən üçlüklər üçbucaq vermir: C(${m}, 3) = ${C(m, 3)}. ${C(n, 3)} − ${C(m, 3)} = ${C(n, 3) - C(m, 3)}.` }; }
        if (kind === "mixed") { const B = rnd(4, 9), G = rnd(4, 9), b = rnd(1, 3), g = rnd(1, 3);
          const v = C(B, b) * C(G, g);
          return { text: `${B} oğlan və ${G} qızdan ${b} oğlan və ${g} qızdan ibarət qrup neçə üsulla seçilə bilər?`, answer: v, show: String(v), tol: EX,
            solution: `Oğlanlar: C(${B}, ${b}) = ${C(B, b)}. Qızlar: C(${G}, ${g}) = ${C(G, g)}. Seçimlər müstəqildir — vururuq: ${C(B, b)} · ${C(G, g)} = ${v}.` }; }
        if (kind === "atleast") { const B = rnd(4, 8), G = rnd(3, 7), k = rnd(3, 4);
          const v = C(B + G, k) - C(B, k);
          return { text: `${B} oğlan və ${G} qızdan ${k} nəfərlik komanda seçilir. Komandada ən azı bir qız olmalıdır. Neçə üsul var?`, answer: v, show: String(v), tol: EX,
            solution: `"Ən azı bir" — tərsindən say. Hamısı: C(${B + G}, ${k}) = ${C(B + G, k)}. Qızsız (yalnız oğlan): C(${B}, ${k}) = ${C(B, k)}. ${C(B + G, k)} − ${C(B, k)} = ${v}.` }; }
        const p = rnd(3, 8), q = rnd(3, 8), v = C(p, 2) * q + C(q, 2) * p;
        return { text: `İki paralel düz xətt var: birində ${p}, digərində ${q} nöqtə qeyd olunub. Təpələri bu nöqtələrdə olan neçə üçbucaq var?`, answer: v, show: String(v), tol: EX,
          solution: `Üçbucağın 2 təpəsi bir xəttdə, 1 təpəsi o biri xəttdə olmalıdır. C(${p}, 2) · ${q} + C(${q}, 2) · ${p} = ${C(p, 2) * q} + ${C(q, 2) * p} = ${v}.` };
      } },
    { id: "reqem", ad: "Rəqəmlərlə ədədlər", izah: "Birinci rəqəm 0 ola bilməz! Əvvəl ən çox şərti olan yeri doldur (birinci rəqəm, sonuncu rəqəm), sonra qalanları.",
      gen() {
        const kind = pick(["rep", "distinct", "even", "five", "inc", "dec"]);
        if (kind === "rep") { const k = rnd(2, 6), v = 9 * 10 ** (k - 1);
          return { text: `Neçə ${k}-rəqəmli natural ədəd var?`, answer: v, show: String(v), tol: EX,
            solution: `Birinci rəqəm: 9 seçim (1–9). Qalan ${k - 1} rəqəmin hər biri: 10 seçim. 9 · 10${k - 1 > 1 ? "^" + (k - 1) : ""} = ${v}.` }; }
        if (kind === "distinct") { const k = rnd(2, 5), v = 9 * A(9, k - 1);
          return { text: `Rəqəmləri təkrarlanmayan neçə ${k}-rəqəmli natural ədəd var?`, answer: v, show: String(v), tol: EX,
            solution: `Birinci rəqəm: 9 seçim (0 olmaz). Qalan ${k - 1} yerə qalmış 9 rəqəmdən (0 daxil) sıra ilə: A(9, ${k - 1}) = ${A(9, k - 1)}. 9 · ${A(9, k - 1)} = ${v}.` }; }
        if (kind === "even") { const k = rnd(3, 4), a0 = A(9, k - 1), a1 = 4 * 8 * A(8, k - 2), v = a0 + a1;
          return { text: `Rəqəmləri təkrarlanmayan neçə ${k}-rəqəmli cüt ədəd var?`, answer: v, show: String(v), tol: EX,
            solution: `Son rəqəm 0: qalan ${k - 1} yer — A(9, ${k - 1}) = ${a0}. Son rəqəm 2, 4, 6, 8 (4 seçim): birinci rəqəm 0 və son rəqəmdən fərqli — 8 seçim, ortadakılar A(8, ${k - 2}) = ${A(8, k - 2)}; 4 · 8 · ${A(8, k - 2)} = ${a1}. Cəmi ${a0} + ${a1} = ${v}.` }; }
        if (kind === "five") { const k = rnd(3, 4), a0 = A(9, k - 1), a1 = 8 * A(8, k - 2), v = a0 + a1;
          return { text: `Rəqəmləri təkrarlanmayan neçə ${k}-rəqəmli ədəd 5-ə bölünür?`, answer: v, show: String(v), tol: EX,
            solution: `Son rəqəm 0 və ya 5. Son 0: A(9, ${k - 1}) = ${a0}. Son 5: birinci rəqəm 0 və 5 ola bilməz — 8 seçim, ortadakılar A(8, ${k - 2}) = ${A(8, k - 2)}; 8 · ${A(8, k - 2)} = ${a1}. Cəmi ${v}.` }; }
        if (kind === "inc") { const k = rnd(2, 7);
          return { text: `Rəqəmləri soldan sağa ciddi artan neçə ${k}-rəqəmli ədəd var? (məs. 1358)`, answer: C(9, k), show: String(C(9, k)), tol: EX,
            solution: `0 belə ədəddə ola bilməz (birinci yerə düşərdi). 1–9-dan istənilən ${k} rəqəmi seçəndə onları artan sırada düzməyin yalnız 1 yolu var: C(9, ${k}) = ${C(9, k)}.` }; }
        const k = rnd(2, 7);
        return { text: `Rəqəmləri soldan sağa ciddi azalan neçə ${k}-rəqəmli ədəd var? (məs. 9520)`, answer: C(10, k), show: String(C(10, k)), tol: EX,
          solution: `Burada 0 da olar — o həmişə sona düşür. 0–9-dan istənilən ${k} rəqəmi seç, azalan sırada düzməyin 1 yolu var: C(10, ${k}) = ${C(10, k)}.` };
      } },
    { id: "ulduz", ad: "Bölgü və yollar", izah: "Eyni əşyaları paylamaq: n əşya, k qutu, hər qutuda ən azı 1 — C(n − 1, k − 1). Boş qutu olar — C(n + k − 1, k − 1). Şəbəkədə yol: C(a + b, a).",
      gen() {
        const kind = pick(["nat", "nonneg", "candy", "path"]);
        if (kind === "nat") { const k = rnd(2, 4), n = rnd(k + 2, 15), v = C(n - 1, k - 1);
          const vars = ["x", "y", "z", "t"].slice(0, k).join(" + ");
          return { text: `${vars} = ${n} tənliyinin neçə natural həlli var? (hər dəyişən ≥ 1)`, answer: v, show: String(v), tol: EX,
            solution: `${n} ulduzu sıraya düz: aralarında ${n - 1} boşluq var. ${k} hissəyə bölmək üçün ${k - 1} çubuğu bu boşluqlara qoyuruq: C(${n - 1}, ${k - 1}) = ${v}.` }; }
        if (kind === "nonneg") { const k = rnd(2, 4), n = rnd(3, 12), v = C(n + k - 1, k - 1);
          const vars = ["x", "y", "z", "t"].slice(0, k).join(" + ");
          return { text: `${vars} = ${n} tənliyinin neçə həlli var, harada hər dəyişən mənfi olmayan tam ədəddir (0 da olar)?`, answer: v, show: String(v), tol: EX,
            solution: `${n} ulduz və ${k - 1} çubuq — cəmi ${n + k - 1} yer; çubuqların yerini seç: C(${n + k - 1}, ${k - 1}) = ${v}. (Və ya hər dəyişənə 1 əlavə et: natural həllər, cəm ${n + k}.)` }; }
        if (kind === "candy") { const k = rnd(3, 5), n = rnd(k + 1, 14), v = C(n - 1, k - 1);
          return { text: `${n} eyni konfet ${k} uşağa paylanır, hər uşaq ən azı bir konfet alır. Neçə üsul var?`, answer: v, show: String(v), tol: EX,
            solution: `Konfetlər eynidir — yalnız hər uşağın neçə aldığı vacibdir. x₁ + … + x${"₀₁₂₃₄₅₆₇₈₉"[k]} = ${n}, hər biri ≥ 1: C(${n} − 1, ${k} − 1) = C(${n - 1}, ${k - 1}) = ${v}.` }; }
        const a = rnd(2, 7), b = rnd(2, 6), v = C(a + b, a);
        return { text: `Şəhər ${a} × ${b} kvadrat məhəllədən ibarətdir (eni ${a}, hündürlüyü ${b} məhəllə). Sol aşağı küncdən sağ yuxarı küncə küçələrlə yalnız sağa və yuxarı hərəkət edərək neçə ən qısa yol var?`, answer: v, show: String(v), tol: EX,
          solution: `Hər yol ${a} "sağa" və ${b} "yuxarı" addımdan ibarətdir — cəmi ${a + b} addım. "Sağa" addımların yerini seç: C(${a + b}, ${a}) = ${v}.` };
      } },
    { id: "ehtimal", ad: "Kombinatorik ehtimal", izah: "P = əlverişli hallar / bütün hallar (hallar bərabər imkanlı olmalıdır). Cavabı ixtisar olunmuş kəsr yaz: 3/10.",
      gen() {
        const kind = pick(["dice", "balls2", "balls1", "coins", "adj", "div"]);
        if (kind === "dice") { const s = rnd(2, 12), f = 6 - Math.abs(s - 7);
          return { text: `İki ədalətli zər atılır (atışlar müstəqildir). Düşən xalların cəminin ${s} olması ehtimalı nədir?`, answer: f / 36, show: frac(f, 36), tol: PR,
            solution: `Bütün hallar: 6 · 6 = 36. Cəmi ${s} olan cütlər: ${f} (məs. ${Array.from({ length: 6 }, (_, i) => i + 1).filter(a => s - a >= 1 && s - a <= 6).map(a => `(${a}; ${s - a})`).join(", ")}). P = ${f}/36 = ${frac(f, 36)}.` }; }
        if (kind === "balls2") { const R = rnd(2, 8), B = rnd(2, 8), f = C(R, 2), t = C(R + B, 2);
          return { text: `Qutuda ${R} qırmızı və ${B} göy kürə var. Eyni ehtimalla, geri qaytarılmadan təsadüfən 2 kürə götürülür. İkisinin də qırmızı olması ehtimalı nədir?`, answer: f / t, show: frac(f, t), tol: PR,
            solution: `Bütün hallar: C(${R + B}, 2) = ${t}. Əlverişli: C(${R}, 2) = ${f}. P = ${f}/${t} = ${frac(f, t)}.` }; }
        if (kind === "balls1") { const R = rnd(2, 8), B = rnd(2, 8), f = R * B, t = C(R + B, 2);
          return { text: `Qutuda ${R} qırmızı və ${B} göy kürə var. Eyni ehtimalla, geri qaytarılmadan təsadüfən 2 kürə götürülür. Kürələrin müxtəlif rəngli olması ehtimalı nədir?`, answer: f / t, show: frac(f, t), tol: PR,
            solution: `Bütün hallar: C(${R + B}, 2) = ${t}. Bir qırmızı və bir göy: ${R} · ${B} = ${f}. P = ${f}/${t} = ${frac(f, t)}.` }; }
        if (kind === "coins") { const n = rnd(3, 6), k = rnd(0, n), f = C(n, k), t = 2 ** n;
          return { text: `Ədalətli pul ${n} dəfə müstəqil atılır. Düz ${k} dəfə "gerb" düşməsi ehtimalı nədir?`, answer: f / t, show: frac(f, t), tol: PR,
            solution: `Bütün nəticələr: 2^${n} = ${t}. "Gerb"in düşdüyü ${k} atışı seç: C(${n}, ${k}) = ${f}. P = ${f}/${t} = ${frac(f, t)}.` }; }
        if (kind === "adj") { const n = rnd(3, 10);
          return { text: `${n} nəfər təsadüfi qaydada bir sıraya düzülür. Aysel ilə Fikrətin yanaşı durması ehtimalı nədir?`, answer: 2 / n, show: frac(2, n), tol: PR,
            solution: `Bütün hallar: ${n}!. Yanaşı: 2 · (${n} − 1)!. P = 2 · ${n - 1}! / ${n}! = 2/${n}` + (frac(2, n) !== "2/" + n ? ` = ${frac(2, n)}.` : ".") }; }
        const N = pick([20, 30, 36, 40, 50, 60, 100]), [a, b] = pick([[2, 3], [2, 5], [3, 5], [3, 4], [4, 6], [2, 7]]);
        const l = a * b / gcd(a, b), f = Math.floor(N / a) + Math.floor(N / b) - Math.floor(N / l);
        return { text: `1, 2, …, ${N} ədədlərindən biri təsadüfən seçilir. Onun ${a} və ya ${b} ədədinə bölünməsi ehtimalı nədir?`, answer: f / N, show: frac(f, N), tol: PR,
          solution: `${a} ədədinə bölünənlər: ${Math.floor(N / a)}; ${b} ədədinə: ${Math.floor(N / b)}; hər ikisinə (yəni ${l} ədədinə): ${Math.floor(N / l)} — iki dəfə sayılıb. ${Math.floor(N / a)} + ${Math.floor(N / b)} − ${Math.floor(N / l)} = ${f}. P = ${f}/${N} = ${frac(f, N)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const B = rnd(4, 9), G = rnd(4, 8), cg = C(G, 2), right = cg * B;
        const steps = [
          `Qızları seç (sıra vacib deyil): C(${G}, 2) = ${cg}.`,
          `Oğlanı seç: C(${B}, 1) = ${B}.`,
          `Seçimlər müstəqildir — vururuq: ${cg} · ${B} = ${right}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `Qızları seç: A(${G}, 2) = ${G} · ${G - 1} = ${A(G, 2)}.`;
        if (bad === 1) steps[1] = `Oğlanı seç: C(${B}, 2) = ${C(B, 2)}.`;
        if (bad === 2) steps[2] = `Seçimləri toplayırıq: ${cg} + ${B} = ${cg + B}.`;
        if (bad === 1) steps[2] = `Seçimlər müstəqildir — vururuq: ${cg} · ${C(B, 2)} = ${cg * C(B, 2)}.`;
        if (bad === 0) steps[2] = `Seçimlər müstəqildir — vururuq: ${A(G, 2)} · ${B} = ${A(G, 2) * B}.`;
        const text = h("div", {}, h("p", {}, `Məsələ: ${B} oğlan və ${G} qızdan 3 nəfərlik qrup seçilir — 2 qız və 1 oğlan. Neçə üsul var?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: qızların sırası vacib deyil — kombinasiya C(${G}, 2) = ${cg} lazımdır, aranjeman yox.`,
          `2-ci addım: bir oğlan seçilir — C(${B}, 1) = ${B}, C(${B}, 2) yox.`,
          `3-cü addım: hər qız cütü hər oğlanla birləşir — vurmaq lazımdır: ${cg} · ${B} = ${right}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Əvvəl soruş: sıra vacibdirmi? Təkrar olarmı? Sonra hasil qaydası, A(n, k) və ya C(n, k).",
      gen() {
        const kind = pick(["league1", "league2", "menu", "code", "code-rep", "prizes", "prizes-rep", "books"]);
        if (kind === "league1") { const n = rnd(6, 20);
          return { text: `Futbol turnirində ${n} komanda var, hər komanda hər biri ilə bir dəfə oynayır. Cəmi neçə oyun olacaq?`, answer: C(n, 2), show: String(C(n, 2)), tol: EX,
            solution: `Hər oyun — komanda cütüdür, sıra vacib deyil: C(${n}, 2) = ${n} · ${n - 1} / 2 = ${C(n, 2)}.` }; }
        if (kind === "league2") { const n = rnd(6, 20);
          return { text: `Liqada ${n} komanda var, hər cüt iki dəfə oynayır: bir dəfə birinin, bir dəfə digərinin meydanında. Cəmi neçə oyun olacaq?`, answer: A(n, 2), show: String(A(n, 2)), tol: EX,
            solution: `Oyun = (ev sahibi, qonaq) — sıra vacibdir: A(${n}, 2) = ${n} · ${n - 1} = ${A(n, 2)}.` }; }
        if (kind === "menu") { const a = rnd(2, 6), b = rnd(3, 8), c = rnd(2, 5);
          return { text: `Yeməkxanada ${a} növ şorba, ${b} növ əsas yemək və ${c} növ şirniyyat var. Hər növdən birini seçməklə neçə müxtəlif nahar mümkündür?`, answer: a * b * c, show: String(a * b * c), tol: EX,
            solution: `Hasil qaydası: ${a} · ${b} · ${c} = ${a * b * c}.` }; }
        if (kind === "code") { const k = rnd(3, 5);
          return { text: `Seyfin kodu ${k} rəqəmlidir (0 ilə başlaya bilər), rəqəmlər təkrarlanmır. Neçə müxtəlif kod var?`, answer: A(10, k), show: String(A(10, k)), tol: EX,
            solution: `10 rəqəmdən sıra ilə ${k} rəqəm: A(10, ${k}) = ${Array.from({ length: k }, (_, i) => 10 - i).join(" · ")} = ${A(10, k)}.` }; }
        if (kind === "code-rep") { const k = rnd(3, 6), m = pick([4, 5, 6, 10]);
          return { text: `Kilid ${k} təkərdən ibarətdir, hər təkərdə ${m} işarə var. Neçə müxtəlif kombinasiya qurmaq olar?`, answer: m ** k, show: String(m ** k), tol: EX,
            solution: `Hər təkər müstəqil: ${m} seçim. ${m}^${k} = ${m ** k}.` }; }
        if (kind === "prizes") { const n = rnd(5, 15);
          return { text: `${n} şagird arasında 3 müxtəlif hədiyyə (kitab, top, saat) paylanır, hər şagird ən çox bir hədiyyə alır. Neçə üsul var?`, answer: A(n, 3), show: String(A(n, 3)), tol: EX,
            solution: `Kitab: ${n} seçim, top: ${n - 1}, saat: ${n - 2}. A(${n}, 3) = ${A(n, 3)}.` }; }
        if (kind === "prizes-rep") { const n = rnd(3, 12);
          return { text: `${n} şagird arasında 3 müxtəlif hədiyyə paylanır; bir şagird bir neçə hədiyyə ala bilər. Neçə üsul var?`, answer: n ** 3, show: String(n ** 3), tol: EX,
            solution: `Hər hədiyyənin sahibi ${n} şagirddən biridir, seçimlər müstəqildir: ${n}³ = ${n ** 3}.` }; }
        const n = rnd(6, 15), k = rnd(2, 4);
        return { text: `Fikrətin ${n} kitabı var. Səfərə ${k} kitab götürmək istəyir. Neçə üsulla seçə bilər?`, answer: C(n, k), show: String(C(n, k)), tol: EX,
          solution: `Kitabların sırası vacib deyil: C(${n}, ${k}) = ${C(n, k)}.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-kombinasiya", title: "Kombinatorika və ehtimal", fenn: "olimpiada", link: "dersler/ol-kombinasiya.html",
      format: "Cavab ədəddir: üsulların sayı (məs. 120) və ya ehtimal — ixtisar olunmuş kəsr (məs. 3/10).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["perm", "perm", "aranj", "komb", "komb", "reqem", "ulduz", "ehtimal", "ehtimal", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-kombinasiya.html")) b.push("dersler/ol-kombinasiya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
