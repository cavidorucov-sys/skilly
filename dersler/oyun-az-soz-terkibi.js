// Azərbaycan dili · Sözün tərkibi və söz yaradıcılığı — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 1-ci hissə (2024), s. 9 (qalın və incə saitlər), s. 45 (kök və şəkilçi; leksik və
// qrammatik şəkilçilər), s. 49 (sözün quruluşca növləri), s. 53 (ahəng qanunu; iki və dörd cür yazılan şəkilçilər), s. 57
// (mürəkkəb sözlərin yazılışı), s. 63 (bir cür yazılan alınma şəkilçilər: -kar); 2-ci hissə (2024), s. 16, 21, 48 (bitişdirici samit); 6-cı sinif, 1-ci hissə (2025),
// s. 50 (sözlərin təkrarından yaranan mürəkkəb sözlər), s. 56 (başlanğıc forma), s. 61 (eyniköklü sözlər); 6-cı sinif,
// 2-ci hissə, s. 79 (mənsubiyyət şəkilçisi, bitişdirici y); köməkçi mənbə: 7-ci sinif, 1-ci hissə, s. 62, 63, 68 (mürəkkəb
// sözlərin yazılışı, ayrı yazılan mürəkkəb sözlər). Suallar əl ilə yoxlanmış söz bankından qurulur: bankdakı hər söz
// birmənalı təhlil olunur. Bankda qəsdən olmayanlar: kökün dəyişdiyi sözlər (k→y, q→ğ, saitdüşümü), alınma morfemlər
// (kəm-, na-, anti-), mürəkkəb + şəkilçi birgə olan sözlər, feil formalarının başlanğıc forması (lüğətdə məsdərlə verilir).
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const SUP = "¹²³⁴⁵⁶⁷";
  const NUM = ["sıfır", "bir", "iki", "üç", "dörd", "beş", "altı"];
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const lines = arr => h("span", {}, ...arr.map(x => h("span", { style: "display:block" }, x)));

  // ======== 1. sözün tərkibi: kök, leksik (L) və qrammatik (G) şəkilçi, bitişdirici samit (B) ========
  // "kök şəkilçi:L şəkilçi:G n:B …"; "!" — feil (başlanğıc forması lüğətdə məsdərlə verilir, tapşırıqlarda soruşulmur).
  // Hər sözdə leksik şəkilçilər qrammatiklərdən əvvəl gəlir (5-ci sinif / 6-cı sinif dərsliyi).
  const MOR = [
    // yalnız kök və ya kök + qrammatik şəkilçi (sadə)
    "dəftər", "meşə", "kitab lar:G da:G", "dost lar:G ımız:G ın:G", "şagird lər:G dən:G", "ev də:G", "çay lar:G",
    "!gəl di:G", "!oxu du:G", "!yaz dı:G lar:G", "meşə n:B in:G", "küçə y:B ə:G",
    // leksik şəkilçisi olan (düzəltmə)
    "məktəb li:L", "məktəb li:L lər:G imiz:G", "çəmən lik:L də:G dir:G", "odun çu:L lar:G ın:G", "arı çı:L lıq:L dan:G",
    "idman çı:L lar:G", "müəllim lik:L", "oxu cu:L dan:G", "!hazır la:L dı:G", "təhlükə li:L", "maraq lı:L dır:G",
    "!yaxın laş:L dı:G", "dost luq:L", "yaşıl lıq:L", "ağıl lı:L lıq:L", "səbir siz:L lik:L dən:G", "dəniz çi:L lər:G",
    "ev siz:L lər:G", "yol çu:L lar:G", "süd lü:L", "bağ ban:L", "bağ ça:L", "bağ lıq:L", "ot laq:L", "ot lu:L",
    "çiçək çi:L", "çiçək li:L", "ev li:L", "dost luq:L da:G", "yaşıl lıq:L dan:G", "müəllim lik:L də:G", "təhlükə li:L dir:G",
    "çiçək çi:L lər:G", "ot laq:L da:G", "bağ ça:L lar:G", "bağ ban:L lar:G", "ev li:L lər:G", "yol çu:L luq:L",
    "dəniz çi:L lik:L", "oyun çu:L lar:G", "üzüm çü:L lük:L", "meydan ça:L lar:G ın:G",
  ].map(raw => {
    const feil = raw[0] === "!"; if (feil) raw = raw.slice(1);
    const parts = raw.split(" ").map((t, i) => { if (!i) return { x: t, t: "K" }; const [x, k] = t.split(":"); return { x, t: k }; });
    return { w: parts.map(p => p.x).join(""), parts, feil };
  });
  const lek = m => m.parts.filter(p => p.t === "L");
  const qram = m => m.parts.filter(p => p.t === "G");
  const hasB = m => m.parts.some(p => p.t === "B");
  const kok = m => m.parts[0].x;
  const bf = m => kok(m) + lek(m).map(p => p.x).join("");
  const tip = m => lek(m).length ? "düzəltmə" : "sadə";
  const NAMEK = { K: "kök", L: "leksik şəkilçi", G: "qrammatik şəkilçi", B: "bitişdirici samit" };
  const anal = m => m.parts.map(p => (p.t === "K" ? p.x : "-" + p.x) + " — " + NAMEK[p.t]).join("; ");
  const dashed = m => m.parts.map(p => p.x).join("-");

  // ======== 2. mürəkkəb sözlər: "|" — bitişik, "-" — defislə, boşluq — ayrı yazılır ========
  // Yalnız dərslikdəki qayda və nümunələr (5-ci sinif s. 49, 57; 6-cı sinif s. 50; 7-ci sinif s. 62, 63, 68).
  const COMP = [
    // müxtəlifmənalı sözlərin birləşməsi — bitişik
    "dəmir|ağac", "üç|bucaq", "çoban|yastığı", "ürəyi|yumşaq", "gözü|tox", "sülh|sevər", "ara|bir", "stol|üstü", "meşə|bəyi",
    "dəvə|quşu", "diri|baş", "ağac|dələn", "hazır|cavab", "balıq|qulağı", "su|iti", "aş|süzən",
    // eyni sözün təkrarı + ba, bə, ha, a, ə — bitişik
    "addım|ba|addım", "il|bə|il", "vur|ha|vur", "qaç|a|qaç", "kəs|ə|kəs", "ay|ba|ay", "gün|bə|gün",
    "tut|a|tut", "qov|ha|qov", "yaz|ha|yaz", "gəl|ha|gəl",
    // defislə
    "tez-tez", "iki-iki", "qatar-qatar", "yavaş-yavaş", "qaça-qaça", "dildən-dilə", "başdan-başa", "bir-bir",
    "gecə-gündüz", "isti-soyuq", "aşağı-yuxarı", "səhər-axşam", "gediş-gəliş", "gec-tez",
    "adət-ənənə", "səs-küy", "dost-tanış", "ağıllı-kamallı",
    "duz-çörək", "şalvar-köynək", "ağız-burun", "süd-qatıq", "çəngəl-bıçaq", "qoyun-keçi", "toz-torpaq", "dil-dodaq",
    "meyvə-tərəvəz", "gül-çiçək", "alış-veriş", "top-tüfəng", "kağız-kuğuz", "şimal-şərq", "payız-qış",
    // ayrı yazılan mürəkkəb sözlər (7-ci sinif s. 68)
    "iyirmi iki", "yetmiş üçüncü", "beşdə bir", "şad olmaq", "kömək etmək", "görə bilmək", "yəni ki", "belə ki", "madam ki",
    "o cümlədən", "şübhəsiz ki", "yəqin ki", "kaş ki", "ay aman", "ey vay", "ay can",
  ].map(raw => ({ raw, parts: raw.split(/[|\- ]/), kind: raw.includes("-") ? "D" : raw.includes(" ") ? "A" : "B", w: raw.replace(/\|/g, "") }));
  const KIND = { B: "bitişik", D: "defislə", A: "ayrı" };
  const spell = (parts, k) => k === "B" ? parts.join("") : k === "D" ? parts.join("-") : parts.join(" ");
  const COMP_BD = COMP.filter(c => c.kind !== "A");

  // ======== 3. eyniköklü sözlər (6-cı sinif s. 61; kök omonimliyi — s. 61, 2-ci "Yadda saxla") ========
  // m — eyni kökdən düzəlmiş sözlər; forma — həmin kök sözün qrammatik formaları (eyniköklü söz deyil); oxs — başqa kökdən
  const EYN = [
    { k: "bağ", m: ["bağban", "bağlıq", "bağça", "bağbanlıq"], forma: ["bağda", "bağımız"], oxs: ["dağlıq", "dostluq"] },
    { k: "ot", m: ["otlaq", "otlu", "otsuz", "otlamaq"], forma: ["otda", "otumuz"], oxs: ["dadlı", "dostluq"] },
    { k: "meşə", m: ["meşəlik", "meşəçi", "meşəli", "meşəsiz"], forma: ["meşələr", "meşədə"], oxs: ["çəmənlik", "dənizçi"] },
    { k: "ev", m: ["evli", "evsiz", "evlənmək", "evlilik"], forma: ["evlər", "evdə"], oxs: ["yolçu", "dostluq"] },
    { k: "yol", m: ["yolçu", "yolsuz", "yolluq", "yolçuluq"], forma: ["yolda", "yolumuz"], oxs: ["dənizçi", "dostluq"] },
    { k: "çiçək", m: ["çiçəkçi", "çiçəkli", "çiçəklik", "çiçəkçilik"], forma: ["çiçəklər", "çiçəkdə"], oxs: ["çəmənlik", "meşəlik"] },
    { k: "qorx", m: ["qorxaq", "qorxulu", "qorxunc", "qorxaqlıq"], forma: ["qorxdum", "qorxur", "qorxdu"], oxs: ["qoruq"] },
  ];
  // kökləri omonim olan sözlər: eyniköklü sayılmır (6-cı sinif s. 61)
  const OMON_OK = [
    ["gülçü", "güllü", "gül (isim) — çiçək"], ["gülçü", "güldan", "gül (isim) — çiçək"], ["güllü", "güllük", "gül (isim) — çiçək"],
    ["güldan", "güllük", "gül (isim) — çiçək"], ["gülüş", "gülünc", "gül (feil) — gülmək"],
  ];
  const OMON_NO = [
    ["gülçü", "gülüş", "gül (isim) — çiçək və gül (feil) — gülmək"], ["güllü", "gülünc", "gül (isim) və gül (feil)"],
    ["güldan", "gülünc", "gül (isim) və gül (feil)"], ["güllük", "gülüş", "gül (isim) və gül (feil)"],
    ["daşlıq", "daşqın", "daş (isim) və daş (feil) — daşmaq"], ["yağlı", "yağış", "yağ (isim) və yağ (feil) — yağmaq"],
  ];

  // ======== 4. şəkilçinin yazılışı: ahəng qanunu, iki və dörd cür yazılan şəkilçilər ========
  const VOW = "aıoueəiöü";
  const V2 = v => "aıou".includes(v) ? "a" : "ə";
  const V4 = v => "aı".includes(v) ? "ı" : "eəi".includes(v) ? "i" : "ou".includes(v) ? "u" : "ü";
  const lastV = s => { for (let i = s.length - 1; i >= 0; i--) if (VOW.includes(s[i])) return s[i]; return ""; };
  const firstV = s => { for (const c of s) if (VOW.includes(c)) return c; return ""; };
  const isV = c => VOW.includes(c);
  const fill = (tpl, v) => tpl.replace(/A/g, V2(v)).replace(/I/g, V4(v));
  const addSuf = (st, tpl) => st + fill(tpl, lastV(st));
  const trapSuf = (st, tpl) => st + fill(tpl, firstV(st));
  const allForms = (st, tpl) => tpl.includes("I") ? ["ı", "i", "u", "ü"].map(x => st + tpl.replace(/I/g, x)) : ["a", "ə"].map(x => st + tpl.replace(/A/g, x));
  const wrongForm = (st, tpl) => { const right = addSuf(st, tpl), t = trapSuf(st, tpl); return t !== right ? t : pick(allForms(st, tpl).filter(x => x !== right)); };
  const CLS = { a: "qalın, dodaqlanmayan", ı: "qalın, dodaqlanmayan", o: "qalın, dodaqlanan", u: "qalın, dodaqlanan", ə: "incə, dodaqlanmayan", e: "incə, dodaqlanmayan", i: "incə, dodaqlanmayan", ö: "incə, dodaqlanan", ü: "incə, dodaqlanan" };
  // samitlə bitən, kökü dəyişməyən isimlər: kitab, heyvan, nişan, dövlət, mürəkkəb, qərar, qüsur, gündüz, öküz, qunduz, pələng,
  // kənd, döyüş, şagird, üzüm, oyun, meydan, idman, meymun, delfin, ağac, kömür (hamısı dərslik nümunələridir)
  const ST4 = ["kitab", "heyvan", "nişan", "dövlət", "mürəkkəb", "qərar", "qüsur", "gündüz", "öküz", "qunduz", "pələng", "kənd", "döyüş",
    "şagird", "üzüm", "oyun", "meydan", "idman", "meymun", "delfin", "ağac", "kömür"];
  const ST2 = ST4.concat(["torpaq", "çiçək", "toyuq", "pişik"]); // q, k ilə bitənlər yalnız samitlə başlayan şəkilçi ilə
  const S2 = [{ t: "lAr", ad: "cəm şəkilçisi (-lar²)" }, { t: "dA", ad: "yerlik hal şəkilçisi (-da²)" }, { t: "dAn", ad: "çıxışlıq hal şəkilçisi (-dan²)" }];
  const S4 = [{ t: "In", ad: "yiyəlik hal şəkilçisi (-ın⁴)", v: 1 }, { t: "I", ad: "təsirlik hal şəkilçisi (-ı⁴)", v: 1 },
    { t: "Im", ad: "I şəxsin təkində mənsubiyyət şəkilçisi (-ım⁴)", v: 1 }, { t: "ImIz", ad: "I şəxsin cəmində mənsubiyyət şəkilçisi (-ımız⁴)", v: 1 },
    { t: "dIr", ad: "xəbərlik şəkilçisi (-dır⁴)" }];
  const SALL = [...S2, ...S4];
  const stemsOf = sf => sf.v ? ST4 : ST2;
  const sonSait = st => { const v = lastV(st); return "son sait «" + v + "» (" + CLS[v] + ")"; };
  const iz = (st, sf) => {
    const r = addSuf(st, sf.t), v = lastV(st), fv = firstV(st);
    return "«" + st + "» — " + sonSait(st) + " → " + r + (fv !== v && trapSuf(st, sf.t) !== r ? ". Birinci sait «" + fv + "» nəzərə alınmır: " + trapSuf(st, sf.t) + " səhvdir" : "") + ".";
  };

  // ======== 5. bitişdirici samit: y, n, s ========
  const BST = ["küçə", "ana", "ata", "meşə", "qapı", "nənə", "bacı", "xala", "alma", "bina"]; // saitlə bitən
  const BCS = ["şəhər", "kitab", "dəftər", "şagird", "kənd", "məktəb"]; // samitlə bitən
  const BK = [
    { ad: "yönlük hal şəkilçisi (-a²)", b: "y", f: (s, v) => s + (v ? "y" : "") + fill("A", lastV(s)) },
    { ad: "yiyəlik hal şəkilçisi (-ın⁴)", b: "n", f: (s, v) => s + (v ? "n" : "") + fill("In", lastV(s)) },
    { ad: "təsirlik hal şəkilçisi (-ı⁴)", b: "n", f: (s, v) => s + (v ? "n" : "") + fill("I", lastV(s)) },
    { ad: "III şəxsin mənsubiyyət şəkilçisi (-ı⁴)", b: "s", f: (s, v) => s + (v ? "s" : "") + fill("I", lastV(s)) },
    { ad: "yerlik hal şəkilçisi (-da²)", b: "", f: s => s + fill("dA", lastV(s)), samit: 1 },
    { ad: "çıxışlıq hal şəkilçisi (-dan²)", b: "", f: s => s + fill("dAn", lastV(s)), samit: 1 },
  ];
  const bform = (st, k) => { const v = isV(st[st.length - 1]), b = k.samit ? "" : v ? k.b : ""; return { st, k, form: k.f(st, v), b }; };
  const BNONE = "bitişdirici samit işlənmir";
  const bsol = x => x.b
    ? x.st + " + " + x.b + " + " + x.form.slice((x.st + x.b).length) + " = " + x.form + ": söz saitlə bitir, şəkilçi saitlə başlayır, arada «" + x.b + "» bitişdirici samiti işlənir."
    : x.k.samit ? x.form + ": şəkilçi samitlə başlayır, bitişdirici samit lazım deyil." : x.form + ": söz samitlə bitir, bitişdirici samit lazım deyil.";
  const FEILB = [["oxuyacaq", "y"], ["istəyir", "y"], ["deyib", "y"], ["oxuyur", "y"], ["oxudu", ""], ["gəlir", ""], ["yazacaq", ""], ["gəldi", ""]];

  // ======== oyun səviyyələri ========
  const GR3 = ["sadə söz", "düzəltmə söz", "mürəkkəb söz"];
  const levels = [
    { id: "kok", ad: "Kök və şəkilçi", izah: "Sözün hissələrini qruplara ayır: kök ayrılıqda işlənə bilən hissədir; leksik şəkilçi yeni söz yaradır; qrammatik şəkilçi sözün leksik mənasını dəyişmir; bitişdirici samit saitlə bitən sözlə saitlə başlayan şəkilçi arasında işlənir.",
      gen() {
        const m = pick(MOR.filter(x => x.parts.length >= 2)), ps = shuffle(m.parts), idx = { K: 0, L: 1, G: 2, B: 3 };
        return { text: "«" + m.w + "» sözünün hissələrini qruplara ayır.", bol: { soz: ps.map(p => p.x), qrup: ["kök", "leksik şəkilçi", "qrammatik şəkilçi", "bitişdirici samit"], duz: ps.map(p => idx[p.t]) },
          show: m.parts.map(p => p.x + " — " + NAMEK[p.t]).join("; "), solution: dashed(m) + ": " + anal(m) + "." };
      } },
    { id: "bashlangic", ad: "Sözün başlanğıc forması", izah: "Başlanğıc forma — sözün qrammatik şəkilçiyə qədər olan hissəsidir (kök + leksik şəkilçilər). Sadə sözdə o, kökün özüdür.",
      gen() {
        const m = pick(MOR.filter(x => !x.feil && !hasB(x) && x.parts.length >= 3)), pf = []; let acc = "";
        m.parts.forEach(p => { acc += p.x; pf.push(acc); });
        const ch = shuffle(pf), right = bf(m);
        return { text: "«" + m.w + "» sözünün başlanğıc forması hansıdır?", choices: ch, correct: ch.indexOf(right), show: right,
          solution: dashed(m) + ". Başlanğıc forma — qrammatik şəkilçiyə qədər olan hissə: " + right + (qram(m).length ? " (qrammatik şəkilçilər: " + qram(m).map(p => "-" + p.x).join(", ") + ")" : "") + (lek(m).length ? "" : ". Leksik şəkilçisi yoxdur — başlanğıc forma kökün özüdür") + "." };
      } },
    { id: "ahenk", ad: "Şəkilçinin yazılışı", izah: "Şəkilçi sözün SON hecasının ahənginə görə seçilir: iki cür yazılan şəkilçidə qalın / incə, dörd cür yazılanda həm də dodaqlanan / dodaqlanmayan sait. Birinci saitə baxma.",
      gen() {
        if (Math.random() < .2) {
          const A1 = pick([["-kar", "tələb-kar, fəda-kar"], ["-keş", "zəhmət-keş, qayğı-keş"], ["-pərvər", "vətən-pərvər, qonaq-pərvər"], ["-xana", "xəstə-xana, yemək-xana"]]);
          const o = pick([[A1[0], "bir cür", A1[1]], ["-lar", "iki cür", "kitab-lar, dövlət-lər"], ["-ın", "dörd cür", "heyvan-ın, dövlət-in"]]), ch = ["bir cür", "iki cür", "dörd cür"];
          return { text: "«" + o[0] + "» şəkilçisi neçə cür yazılır?", choices: ch, correct: ch.indexOf(o[1]), show: o[1],
            solution: o[1] === "bir cür" ? "«" + o[0] + "» başqa dillərdən alınmış şəkilçidir: bir cür yazılır, qoşulduğu sözdən asılı olaraq dəyişmir (" + o[2] + ")." : "«" + o[0] + "» ahəngə görə dəyişir: " + o[1] + " yazılır (" + o[2] + ")." };
        }
        if (Math.random() < .5) {
          const sf = pick(S4), st = pick(stemsOf(sf)), ch = shuffle(allForms(st, sf.t)), right = addSuf(st, sf.t);
          return { text: "«" + st + "» sözünə " + sf.ad + " artır:", choices: ch, correct: ch.indexOf(right), show: right, solution: iz(st, sf) };
        }
        const pairs = [], used = new Set();
        while (pairs.length < 6) { const sf = pick(SALL), st = pick(stemsOf(sf)); if (!used.has(st)) { used.add(st); pairs.push([st, sf]); } }
        const bad = sample([0, 1, 2, 3, 4, 5], 1 + R(3)).sort((a, b) => a - b);
        const tok = pairs.map(([st, sf], i) => bad.includes(i) ? wrongForm(st, sf.t) : addSuf(st, sf.t));
        return { text: "Şəkilçisi səhv yazılmış sözlərin hamısına toxun.", sec: { soz: tok, duz: bad }, show: bad.map(i => tok[i]).join(", "),
          solution: bad.map(i => tok[i] + " → " + addSuf(pairs[i][0], pairs[i][1].t) + " (" + sonSait(pairs[i][0]) + ")").join("; ") + ". Qalan sözlər düzgün yazılıb." };
      } },
    { id: "bitis", ad: "Bitişdirici samitlər", izah: "Saitlə bitən sözə saitlə başlayan şəkilçi artırılanda arada bitişdirici samit işlənir: y, n, s. Samitlə bitən sözdə və samitlə başlayan şəkilçidə (-da, -dan) bitişdirici yoxdur.",
      gen() {
        if (Math.random() < .55) {
          const x = bform(pick(Math.random() < .8 ? BST : BCS), pick(BK)), opts = ["y", "n", "s", BNONE];
          return { text: "«" + x.st + "» sözünə " + x.k.ad + " artırdıqda köklə şəkilçi arasında hansı bitişdirici samit işlənir?", choices: opts, correct: opts.indexOf(x.b || BNONE), show: x.b || BNONE, solution: bsol(x) };
        }
        for (;;) {
          const xs = sample([...BST.map(s => bform(s, pick(BK))), ...BCS.slice(0, 3).map(s => bform(s, pick(BK)))], 5).map(x => ({ w: x.form, b: x.b }));
          if (Math.random() < .35) sample(FEILB, 2).forEach(([w, b]) => xs.push({ w, b }));
          const tok = shuffle(xs), duz = tok.map((x, i) => x.b ? i : -1).filter(i => i >= 0);
          if (!duz.length || duz.length > 5) continue;
          return { text: "Bitişdirici samiti olan sözlərin hamısına toxun.", sec: { soz: tok.map(x => x.w), duz }, show: duz.map(i => tok[i].w).join(", "),
            solution: tok.map(x => x.w + (x.b ? " — «" + x.b + "»" : " — yoxdur")).join("; ") + "." };
        }
      } },
    { id: "quruluc", ad: "Sözün quruluşca növü", izah: "Sadə: kök və ya kök + qrammatik şəkilçi. Düzəltmə: kök + leksik şəkilçi. Mürəkkəb: iki və daha artıq sözün birləşməsi.",
      gen() {
        const sad = sample(MOR.filter(m => !lek(m).length), 2), duz = sample(MOR.filter(m => lek(m).length), 2), mur = sample(COMP_BD, 2);
        const it = shuffle([...sad.map(m => ({ w: m.w, g: 0, why: dashed(m) + " — kök" + (qram(m).length ? " + qrammatik şəkilçi" : "") })),
          ...duz.map(m => ({ w: m.w, g: 1, why: dashed(m) + " — leksik şəkilçisi var: " + lek(m).map(p => "-" + p.x).join(", ") })),
          ...mur.map(c => ({ w: c.w, g: 2, why: c.parts.join(" + ") + " — iki söz birləşib" }))]);
        return { text: "Sözləri quruluşuna görə qruplara ayır.", bol: { soz: it.map(x => x.w), qrup: GR3, duz: it.map(x => x.g) },
          show: it.map(x => x.w + " — " + GR3[x.g]).join("; "), solution: it.map(x => x.why + " → " + GR3[x.g]).join("; ") + "." };
      } },
    { id: "eynik", ad: "Eyniköklü sözlər", izah: "Eyniköklü sözlər — eyni kökdən düzələn düzəltmə sözlərdir. Eyni sözün qrammatik formaları (bağda, bağlar) və kökləri omonim olan sözlər (daşlıq, daşqın) eyniköklü deyil.",
      gen() {
        const r = Math.random();
        if (r < .45) {
          const f = pick(EYN), three = sample(f.m, 3), odd = pick([...f.forma, ...f.oxs]), ch = shuffle([...three, odd]);
          return { text: "Dördündən biri eyniköklü sözlər sırasına daxil deyil:", choices: ch, correct: ch.indexOf(odd), show: odd,
            solution: three.join(", ") + " — «" + f.k + "» kökündən düzələn eyniköklü sözlərdir. “" + odd + "” " + (f.forma.includes(odd) ? "isə «" + f.k + "» sözünün qrammatik formasıdır, yeni söz deyil." : "başqa kökdəndir.") };
        }
        if (r < .8) {
          const ok = pick(OMON_OK), no = sample(OMON_NO, 3), all = shuffle([[ok, true], ...no.map(p => [p, false])]), ch = all.map(([p]) => p[0] + " – " + p[1]);
          return { text: "Hansı iki söz eyniköklüdür?", choices: ch, correct: all.findIndex(a => a[1]), show: ok[0] + " – " + ok[1],
            solution: "“" + ok[0] + "” və “" + ok[1] + "” eyni kökdəndir: " + ok[2] + ". Qalan cütlərin kökləri omonimdir (" + no.map(p => p[0] + " – " + p[1]).join("; ") + "), onlar eyniköklü sayılmır." };
        }
        const A = ["gülçü", "güldan", "güllü", "güllük"], B = ["gülüş", "gülünc"], C = ["dənizçi", "dostluq", "yolçu", "çiçəkli"];
        const it = shuffle([...sample(A, 2).map(w => ({ w, g: 0 })), ...sample(B, 2).map(w => ({ w, g: 1 })), ...sample(C, 1 + R(2)).map(w => ({ w, g: 2 }))]);
        const GR = ["gül (isim) kökündən", "gül (feil) kökündən", "başqa kökdən"];
        return { text: "Sözləri yarandığı kökə görə qruplara ayır. Gül (isim) — çiçək, gül (feil) — gülmək.", bol: { soz: it.map(x => x.w), qrup: GR, duz: it.map(x => x.g) },
          show: it.map(x => x.w + " — " + GR[x.g]).join("; "), solution: "Eyniköklü sözlər kökün hansı sözdən olmasına görə qruplaşır: gül (isim) — gülçü, güldan, güllü, güllük; gül (feil) — gülüş, gülünc. Qalanlar başqa kökdəndir." };
      } },
    { id: "yazi", ad: "Mürəkkəb sözlərin yazılışı", izah: "Müxtəlifmənalı sözlər və ba, bə, ha, a, ə ilə təkrar — bitişik; eyni sözün təkrarı, əksmənalı və yaxınmənalı sözlər — defislə; saylar, əvəzliklər, bağlayıcılar və s. — ayrı yazılır.",
      gen() {
        if (Math.random() < .2) {
          const fe = Math.random() < .5, [r, m] = fe ? pick([["qaç", "a"], ["kəs", "ə"], ["tut", "a"], ["qov", "ha"], ["vur", "ha"], ["yaz", "ha"], ["gəl", "ha"]]) : pick([["addım", "ba"], ["il", "bə"], ["gün", "bə"], ["ay", "ba"]]);
          const pool = fe ? ["a", "ə", "ha", "ba"] : ["ba", "bə", "a", "ha"], flip = { a: "ə", "ə": "a", ba: "bə", "bə": "ba" }[m];
          const wr = [...new Set([flip, ...shuffle(pool)])].filter(x => x && x !== m).slice(0, 3), ch = shuffle([m, ...wr]).map(x => r + x + r);
          return { text: fe ? "«" + r + "» feil kökünün təkrarından bitişdirici vasitəsilə mürəkkəb isim düzəlt:" : "«" + r + "» sözünün təkrarından bitişdirici vasitəsilə mürəkkəb söz düzəlt:",
            choices: ch, correct: ch.indexOf(r + m + r), show: r + m + r,
            solution: fe ? "Feil kökünün təkrarı: kök kar samitlə bitəndə a, ə, cingiltili samitlə bitəndə ha bitişdiricisi yazılır: " + r + m + r + "." : "Eyni ismin təkrarı ba, bə bitişdiriciləri ilə bitişik yazılır: " + r + m + r + "." };
        }
        const c = pick(COMP), o = { B: spell(c.parts, "B"), D: spell(c.parts, "D"), A: spell(c.parts, "A") }, ch = shuffle([o.B, o.D, o.A]);
        return { text: "Mürəkkəb sözün hissələri: " + c.parts.join(" + ") + ". Düzgün yazılışı seç:", choices: ch, correct: ch.indexOf(o[c.kind]), show: o[c.kind],
          solution: "“" + o[c.kind] + "” — " + KIND[c.kind] + " yazılır." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird sözü təhlil edib. Üç bəndin biri səhvdir — hansı?",
      gen() {
        const m = pick(MOR.filter(x => lek(x).length && qram(x).length && !hasB(x) && !x.feil)), k = R(3);
        const q = qram(m).map(p => "-" + p.x), L1 = lek(m)[0];
        const dz = [kok(m), q.join(", "), bf(m)], bd = [bf(m), ["-" + L1.x, ...q].join(", "), kok(m)], nm = ["kök", "qrammatik şəkilçilər", "başlanğıc forma"];
        const val = [0, 1, 2].map(i => i === k ? bd[i] : dz[i]);
        const ord = ["1-ci bənd", "2-ci bənd", "3-cü bənd"];
        const sol = ["Kök — «" + kok(m) + "». «" + bf(m) + "» başlanğıc formadır (kök + leksik şəkilçi).", "«-" + L1.x + "» leksik şəkilçidir — yeni söz yaradır. Qrammatik şəkilçilər: " + q.join(", ") + ".", "Başlanğıc forma kök deyil: kök + leksik şəkilçilər = «" + bf(m) + "»."];
        return { text: "«" + m.w + "» — şagirdin təhlili: " + [0, 1, 2].map(i => (i + 1) + ") " + nm[i] + " — " + val[i]).join("; ") + ". Hansı bənddə səhv var?", choices: ord, correct: k, show: ord[k],
          solution: sol[k] + " Digər iki bənd düzdür. Tam təhlil: " + anal(m) + "." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const FIKIR_DUZ = [
    "Kök sözün ayrılıqda işlənə bilən, leksik mənası olan hissəsidir.",
    "Şəkilçi sözün ayrılıqda işlənə bilməyən, leksik mənası olmayan hissəsidir.",
    "Leksik şəkilçilər sözə qoşularaq yeni söz yaradır.",
    "Qrammatik şəkilçilər sözün leksik mənasını dəyişmir.",
    "Bir kökdən, ya da kök və qrammatik şəkilçidən ibarət sözlər sadə sözlərdir.",
    "İki və daha artıq sözün birləşməsindən yaranan sözlər mürəkkəb sözlərdir.",
    "Adətən, leksik şəkilçilər əvvəl, qrammatik şəkilçilər sonra gəlir.",
    "Sözün başlanğıc forması onun qrammatik şəkilçiyə qədər olan hissəsidir.",
    "Sadə sözlərdə başlanğıc forma sözün kökü ilə üst-üstə düşür.",
    "Şəkilçilərin əksəriyyəti sözün son hecasının ahənginə uyğun olaraq iki və ya dörd cür yazılır.",
    "Dilimizdəki bəzi alınma şəkilçilər (-kar, -xana) bir cür yazılır, yəni qoşulduğu sözdən asılı olaraq dəyişmir.",
    "İki cür yazılan şəkilçilər qoşulduğu sözün son saitinin qalın və ya incə olmasına görə dəyişir.",
    "Eyni söz kökündən əmələ gələn düzəltmə sözlərə eyniköklü sözlər deyilir.",
    "Kökləri omonim olan düzəltmə sözlər eyniköklü sayılmır.",
    "Qrammatik şəkilçilər artırdıqda eyni sözün müxtəlif qrammatik formaları yaranır.",
    "Təkrar olunan sözlər arasına ba, bə, ha, a, ə bitişdiriciləri artırmaqla yaranan mürəkkəb sözlər bitişik yazılır.",
    "Müxtəlifmənalı sözlərin birləşməsindən yaranan mürəkkəb sözlər bitişik yazılır.",
    "Mürəkkəb söz vahid məna bildirir və bir vurğu ilə deyilir.",
  ];
  const FIKIR_SEHV = [
    "Şəkilçi sözün ayrılıqda işlənə bilən hissəsidir.",
    "Kök sözün leksik mənası olmayan hissəsidir.",
    "Qrammatik şəkilçilər sözə qoşularaq yeni söz yaradır.",
    "Leksik şəkilçisi olan sözlər sadə sözlərdir.",
    "Kök və qrammatik şəkilçidən ibarət sözlər düzəltmə sözlərdir.",
    "Düzəltmə sözlər iki və daha artıq sözün birləşməsindən yaranır.",
    "Sözün başlanğıc forması onun leksik şəkilçiyə qədər olan hissəsidir.",
    "Bütün şəkilçilər dörd cür yazılır.",
    "Alınma şəkilçilər (-kar, -xana) qoşulduğu sözün ahənginə görə dəyişir.",
    "Şəkilçi seçəndə sözün birinci saitinə baxılır.",
    "Samitlə bitən sözlə saitlə başlayan şəkilçi arasında bitişdirici samit işlənir.",
    "Eyni sözün müxtəlif qrammatik formaları eyniköklü sözlərdir.",
    "Kökləri omonim olan düzəltmə sözlər eyniköklü sayılır.",
    "Müxtəlifmənalı sözlərin birləşməsindən yaranan mürəkkəb sözlər defislə yazılır.",
    "Təkrar olunan sözlər arasına ba, bə, ha, a, ə bitişdiriciləri artırmaqla yaranan mürəkkəb sözlər ayrı yazılır.",
    "Mürəkkəb sözlərin hamısı bitişik yazılır.",
  ];
  const nameCnt = (n, ad) => n ? NUM[n] + " " + ad + " var" : ad + " yoxdur";
  // söz haqqında fikirlər: [doğru fikirlər, səhv fikirlər]
  function profil(m) {
    const k = kok(m), b = bf(m), nl = lek(m).length, ng = qram(m).length, t = tip(m), ot = t === "sadə" ? "düzəltmə" : "sadə";
    const dz = ["Kökü «" + k + "» sözüdür.", "Tərkibində " + nameCnt(nl, "leksik şəkilçi") + ".", "Tərkibində " + nameCnt(ng, "qrammatik şəkilçi") + ".", "Quruluşca " + t + " sözdür."];
    const sh = ["Tərkibində " + nameCnt(nl ? nl - 1 : 1, "leksik şəkilçi") + ".", "Tərkibində " + nameCnt(ng ? ng - 1 : 1, "qrammatik şəkilçi") + ".", "Quruluşca " + ot + " sözdür."];
    if (nl || ng) sh.push("Kökü «" + (nl ? b : m.w) + "» sözüdür.");
    if (!m.feil) { dz.push("Başlanğıc forması «" + b + "» sözüdür."); if (nl || ng) sh.push("Başlanğıc forması «" + (nl ? k : m.w) + "» sözüdür."); }
    return [dz, sh];
  }
  const PROF_M = MOR.filter(m => !hasB(m));
  const mixPool = () => [...sample(MOR.filter(m => !lek(m).length && !hasB(m)), 2).map(m => ({ w: m.w, t: "sadə" })), ...sample(MOR.filter(m => lek(m).length), 2).map(m => ({ w: m.w, t: "düzəltmə" })),
    ...sample(COMP_BD, 1).map(c => ({ w: c.w, t: "mürəkkəb" }))];

  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1: leksik şəkilçi yoxdur / yalnız qrammatik şəkilçi var
    { tip: "qapali", gen: () => Oyun.again(() => {
      const four = sample(MOR.filter(m => lek(m).length && !hasB(m)), 4);
      if (Math.random() < .5) { const m = pick(MOR.filter(x => !lek(x).length && !hasB(x))); return AEq("Hansı sözün tərkibində leksik şəkilçi yoxdur?", m.w, four.map(x => x.w), m.w + ": " + anal(m) + ". Qalan sözlərdə leksik şəkilçi var: " + four.map(x => x.w + " (" + lek(x).map(p => "-" + p.x).join(", ") + ")").join("; ") + "."); }
      const m = pick(MOR.filter(x => !qram(x).length && !hasB(x) && x.parts.length > 1)), others = sample(MOR.filter(x => qram(x).length && !hasB(x)), 4);
      return AEq("Hansı sözün tərkibində qrammatik şəkilçi yoxdur?", m.w, others.map(x => x.w), m.w + ": " + anal(m) + ". Qalan sözlərdə qrammatik şəkilçi var: " + others.map(x => x.w + " (" + qram(x).map(p => "-" + p.x).join(", ") + ")").join("; ") + ".");
    }) },
    // 2: iki leksik şəkilçi
    { tip: "qapali", gen: () => Oyun.again(() => {
      const m = pick(MOR.filter(x => lek(x).length === 2)), four = sample(MOR.filter(x => lek(x).length < 2), 4);
      return AEq("Hansı sözün tərkibində iki leksik şəkilçi var?", m.w, four.map(x => x.w), m.w + ": " + anal(m) + ". Qalan sözlərdə leksik şəkilçi ikidən azdır: " + four.map(x => x.w + " (" + lek(x).length + ")").join(", ") + ".");
    }) },
    // 3: şəkilçinin yazılışı (alınma sözlərlə tələ: son hecaya bax)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ps = [], used = new Set();
      while (ps.length < 5) { const sf = pick(SALL), st = pick(stemsOf(sf)); if (!used.has(st)) { used.add(st); ps.push([st, sf]); } }
      const [st, sf] = ps[0], wf = wrongForm(st, sf.t), others = ps.slice(1).map(([s2, f]) => [s2, f, wrongForm(s2, f.t)]);
      if (Math.random() < .5) return AEq("Şəkilçisi səhv yazılmış sözü müəyyən edin.", wf, ps.slice(1).map(([s2, f]) => addSuf(s2, f.t)), "Səhv: " + wf + ". " + iz(st, sf) + " Qalan sözlər düzgün yazılıb.");
      return AEq("Şəkilçisi düzgün yazılmış sözü müəyyən edin.", addSuf(st, sf.t), others.map(x => x[2]), "Düzgün: " + addSuf(st, sf.t) + ". " + iz(st, sf) + " Qalan sözlərdə şəkilçi son saitin ahənginə uyğun seçilməyib.");
    }) },
    // 4: bitişdirici samit (nömrə kombinasiyası)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const xs = sample([...BST.map(s => bform(s, pick(BK))), ...BCS.map(s => bform(s, pick(BK)))], 5);
      const right = xs.map((x, i) => x.b ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansılarında bitişdirici samit işlənmişdir?", lines(xs.map((x, i) => (i + 1) + ". " + x.form))), ...o, show: o.choices[o.correct],
        solution: xs.map((x, i) => (i + 1) + ") " + x.form + (x.b ? " — «" + x.b + "»" : " — yoxdur")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 5: quruluşca biri fərqlidir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const pool = { sadə: MOR.filter(m => !lek(m).length), düzəltmə: MOR.filter(m => lek(m).length), mürəkkəb: COMP_BD }, [a, b] = sample(["sadə", "düzəltmə", "mürəkkəb"], 2);
      const four = sample(pool[a], 4), one = pick(pool[b]), w = x => x.w;
      return AEq("Quruluşuna görə biri fərqlidir:", w(one), four.map(w), w(one) + " — " + b + " söz. Qalanları " + a + " sözlərdir: " + four.map(w).join(", ") + ".");
    }) },
    // 6: nömrə kombinasiyası: düzəltmə / sadə / mürəkkəb sözlər
    { tip: "qapali", gen: () => Oyun.again(() => {
      const want = pick(["düzəltmə", "sadə", "mürəkkəb"]), five = shuffle(mixPool());
      const right = five.map((x, i) => x.t === want ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı sözlər " + want + " sözdür?", lines(five.map((x, i) => (i + 1) + ". " + x.w))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + x.t).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 7: başlanğıc forma
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ms = sample(MOR.filter(m => !m.feil && lek(m).length && qram(m).length), 5), bad = ms[0];
      const rightPair = m => m.w + " – " + bf(m), wrongPair = m => m.w + " – " + (Math.random() < .5 ? kok(m) : m.w);
      const wp = wrongPair(bad);
      return AEq("Hansı sözün yanında başlanğıc forması səhv göstərilib?", wp, ms.slice(1).map(rightPair), "“" + bad.w + "”: " + anal(bad) + ". Başlanğıc forma — qrammatik şəkilçiyə qədər olan hissədir: " + bf(bad) + ". Digər sətirlər düzdür.");
    }) },
    // 8: eyniköklü
    { tip: "qapali", gen: () => Oyun.again(() => {
      const f = pick(EYN), odd = pick([...f.forma, ...f.oxs]);
      return AEq("Beşindən biri eyniköklü sözlər sırasına daxil deyil:", odd, f.m, "“" + odd + "” " + (f.forma.includes(odd) ? "«" + f.k + "» sözünün qrammatik formasıdır (eyniköklü söz deyil)." : "başqa kökdəndir.") + " Qalan dörd söz «" + f.k + "» kökündən düzəlib.");
    }) },
    // 9: mürəkkəb sözlərin yazılışı
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) {
        const five = sample(COMP, 5), bad = five[0], kinds = ["B", "D", "A"].filter(k => k !== bad.kind), wk = pick(kinds);
        const wrong = spell(bad.parts, wk), right4 = five.slice(1).map(c => c.w);
        return AEq("Hansı mürəkkəb sözün yazılışı səhvdir?", wrong, right4, "Səhv: " + wrong + ". Düzgün yazılış: " + bad.w + " (" + KIND[bad.kind] + "). Qalan sözlər düzgün yazılıb.");
      }
      const want = pick(["B", "D", "A"]), five = sample(COMP, 5), right = five.map((c, i) => c.kind === want ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hissələri verilmiş mürəkkəb sözlərdən hansılar " + KIND[want] + " yazılır?", lines(five.map((c, i) => (i + 1) + ". " + c.parts.join(" + ")))), ...o, show: o.choices[o.correct],
        solution: five.map((c, i) => (i + 1) + ") " + c.w + " — " + KIND[c.kind]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 10: fikirlər
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) {
        const m = pick(PROF_M), [dz, sh] = profil(m), bad = pick(sh);
        if (Math.random() < .5) return AEq("“" + m.w + "” sözü ilə bağlı səhv fikri müəyyən edin.", bad, sample(dz, 4), "“" + m.w + "”: " + anal(m) + ". Səhv fikir: " + bad);
        const ok = pick(dz); return AEq("“" + m.w + "” sözü ilə bağlı doğru fikri müəyyən edin.", ok, sample(sh, 4), "“" + m.w + "”: " + anal(m) + ". Doğru fikir: " + ok);
      }
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("Sözün tərkibi və yazılışı ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Sözün tərkibi və yazılışı ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== müstəqil yoxlama bəndləri (Codex cavabsız həll edir) ========
  const Y = [], add = (id, sual, cavab) => Y.push({ id, sual, cavab: String(cavab) });
  const chunk = (arr, n) => arr.reduce((r, x, i) => (i % n ? r[r.length - 1].push(x) : r.push([x]), r), []);
  const FMT = " Cavabı boşluqsuz, «/» ilə ayıraraq yaz.";
  MOR.forEach(m => {
    add("say-" + m.w, "«" + m.w + "» sözündə neçə leksik, neçə qrammatik şəkilçi var və söz quruluşca hansıdır (sadə, düzəltmə, mürəkkəb)? Bitişdirici samit şəkilçi sayılmır. Cavabı leksik:qrammatik:növ formasında yaz (məsələn, 1:2:düzəltmə).", lek(m).length + ":" + qram(m).length + ":" + tip(m));
    if (m.feil) add("kok-" + m.w, "«" + m.w + "» sözünün kökü hansıdır?", kok(m));
    else add("kok-" + m.w, "«" + m.w + "» sözünün kökü və başlanğıc forması (qrammatik şəkilçiyə qədər olan hissə) hansıdır?" + FMT + " Format: kök/başlanğıc forma.", kok(m) + "/" + bf(m));
  });
  chunk(shuffle(COMP), 2).forEach(([a, b], i) => add("yaz-" + (i + 1), "İki mürəkkəb sözün necə yazıldığını müəyyən et (bitişik, defislə, ayrı). Hissələri: 1) " + a.parts.join(" + ") + "; 2) " + (b ? b.parts.join(" + ") : "—") + "." + FMT, b ? KIND[a.kind] + "/" + KIND[b.kind] : KIND[a.kind]));
  EYN.forEach(f => {
    const ws = [...f.m.slice(0, 3), ...f.forma.slice(0, 2), ...f.oxs.slice(0, 2)].concat(f.m.slice(3)), list = [...f.m, ...f.forma, ...f.oxs].sort((x, y) => x.localeCompare(y, "az"));
    add("eyn-" + f.k, "«" + f.k + "» kökündən düzələn eyniköklü sözlərə yalnız düzəltmə sözlər aiddir. Aşağıdakı sözlərdən hansılar eyniköklü söz DEYİL (başqa kökdəndir və ya «" + f.k + "» sözünün qrammatik formasıdır)? Sözlər: " + list.join(", ") + "." + FMT + " Əlifba sırası ilə yaz.", [...f.forma, ...f.oxs].sort((x, y) => x.localeCompare(y, "az")).join("/"));
  });
  chunk(shuffle(OMON_OK.concat(OMON_NO)), 3).forEach((g, i) => add("omon-" + (i + 1), "Hər cüt sözün eyniköklü olub-olmadığını müəyyən et (eyni kökdən düzələn düzəltmə sözlər eyniköklüdür; kökləri omonim olan sözlər eyniköklü sayılmır). " + g.map(([a, b, why], j) => (j + 1) + ") " + a + " – " + b + " (" + why + ")").join("; ") + ". Cavab: bəli/xeyr." + FMT, g.map(([a, b]) => OMON_OK.some(p => p[0] === a && p[1] === b) ? "bəli" : "xeyr").join("/")));
  const AH = [...ST2.map(st => [st, S2[0]]), ...ST4.map((st, i) => [st, S4[i % 4]])];
  chunk(AH, 3).forEach((g, i) => add("ahenk-" + (i + 1), g.map(([st, sf], j) => (j + 1) + ") «" + st + "» + " + sf.ad + ": " + allForms(st, sf.t).join(" | ")).join("; ") + ". Hər söz üçün düzgün yazılışı seç." + FMT, g.map(([st, sf]) => addSuf(st, sf.t)).join("/")));
  BST.forEach(st => { const ks = sample(BK, 3);
    add("bit-" + st, "«" + st + "» sözünə " + ks.map((k, j) => (j + 1) + ") " + k.ad).join(", ") + " artırdıqda köklə şəkilçi arasında hansı bitişdirici samit işlənir (y, n, s, yoxdur)?" + FMT, ks.map(k => bform(st, k).b || "yoxdur").join("/")); });
  add("bit-samit", "Samitlə bitən «şəhər» sözünə 1) yönlük, 2) yiyəlik, 3) III şəxsin mənsubiyyət şəkilçisi, «küçə» sözünə 4) yerlik hal şəkilçisi (-da²) artırdıqda köklə şəkilçi arasında hansı bitişdirici samit işlənir (y, n, s, yoxdur)?" + FMT, "yoxdur/yoxdur/yoxdur/yoxdur");
  chunk(shuffle(FEILB), 4).forEach((g, i) => add("bitf-" + (i + 1), "Hansı sözlərdə bitişdirici samit işlənib (bəli, xeyr)? " + g.map(([w], j) => (j + 1) + ") " + w).join("; ") + "." + FMT, g.map(([w, b]) => b ? "bəli" : "xeyr").join("/")));
  chunk(shuffle(FIKIR_DUZ.map(x => [x, "doğru"]).concat(FIKIR_SEHV.map(x => [x, "səhv"]))), 3).forEach((g, i) => add("fikir-" + (i + 1), "Hər fikir sözün tərkibi və yazılışı ilə bağlı dərslik qaydasına görə doğrudurmu? " + g.map(([x], j) => (j + 1) + ") " + x).join(" ") + " Cavab: doğru/səhv." + FMT, g.map(x => x[1]).join("/")));
  const BB = [["qaç", "a"], ["kəs", "ə"], ["tut", "a"], ["qov", "ha"], ["vur", "ha"], ["yaz", "ha"], ["gəl", "ha"], ["addım", "ba"], ["il", "bə"], ["gün", "bə"], ["ay", "ba"]];
  chunk(BB, 3).forEach((g, i) => add("bb-" + (i + 1), "Sözlərin təkrarından bitişdirici (a, ə, ha, ba, bə) vasitəsilə mürəkkəb söz düzəldilir (feil kökündə a, ə, ha; isimdə ba, bə). Düzgün yazılışı müəyyən et: " + g.map(([r, m], j) => (j + 1) + ") " + [m, ...["a", "ə", "ha", "ba", "bə"].filter(x => x !== m).slice(0, 2)].sort().map(x => r + x + r).join(" | ")).join("; ") + "." + FMT, g.map(([r, m]) => r + m + r).join("/")));
  add("bircur", "Hər şəkilçi neçə cür yazılır (bir, iki, dörd)? 1) -kar (tələb-kar, fəda-kar); 2) -xana (xəstə-xana); 3) -lar (kitab-lar); 4) -ın (heyvan-ın); 5) -keş (zəhmət-keş); 6) -pərvər (vətən-pərvər)." + FMT, "bir/bir/iki/dörd/bir/bir");
  window.__yoxla = Y;

  window.__levels = levels;
  window.__bank = { MOR, COMP, EYN, OMON_OK, OMON_NO, ST2, ST4, BST, BCS, FIKIR_DUZ, FIKIR_SEHV };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-soz-terkibi", title: "Sözün tərkibi və söz yaradıcılığı", fenn: "azdili", link: "dersler/az-soz-terkibi.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, sözlərə toxunmaq və ya sözləri qruplara ayırmaq. Hər sözü kökə, şəkilçilərə ayır, sonra qaydaya bax.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["kok", "kok", "bashlangic", "ahenk", "ahenk", "bitis", "quruluc", "eynik", "yazi", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-soz-terkibi.html")) b.push("dersler/az-soz-terkibi.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
