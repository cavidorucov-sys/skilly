// Azərbaycan dili · Fonetika və orfoepiya — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 1-ci hissə (2024), s. 9 (saitlər), s. 13 (samitlər), s. 17 ("k"), s. 21 ("q"),
// s. 53 (ahəng qanunu), s. 63 (alınma sözlər), s. 71 (heca); 6-cı sinif, 1-ci hissə (2025), s. 15 (uzun tələffüz),
// s. 20 (söz sonunda b, c, d, g; söz ortasında yanaşı kar samitlər), s. 39 (qoşa samitlə bitən təkhecalı sözlər);
// 6-cı sinif, 2-ci hissə, s. 26 (fonetika); 7-ci sinif, 1-ci hissə, s. 55 (vurğu; köməkçi mənbə).
// Transkripsiya dərslikdəki kimidir ([k'], [x'], [ğ], qoşa nöqta). Bankda qəsdən olmayanlar: ae, ea, eə, əa, eo, üa, üə,
// au, ua, ue, uə yanaşı saitli və ov, öv hərf birləşməli sözlərin tələffüzü (proqram qeydi: imtahanda soruşulmur).
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const uniq = a => [...new Set(a)];
  const SUP = "¹²³⁴⁵⁶⁷";
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const mk = (pre, m, post) => h("span", {}, pre, h("u", {}, h("b", {}, m)), post || "");
  const lc = s => s.toLocaleLowerCase("az");

  // ---- saitlər (5-ci sinif, 1-ci hissə, s. 9): açıq a, e, ə, o, ö; qapalı ı, i, u, ü; cədvəl: qalın/incə × dodaqlanmayan/dodaqlanan
  const VP = { a: ["qalın", "açıq", "dodaqlanmayan"], ı: ["qalın", "qapalı", "dodaqlanmayan"], o: ["qalın", "açıq", "dodaqlanan"], u: ["qalın", "qapalı", "dodaqlanan"],
    ə: ["incə", "açıq", "dodaqlanmayan"], e: ["incə", "açıq", "dodaqlanmayan"], i: ["incə", "qapalı", "dodaqlanmayan"], ö: ["incə", "açıq", "dodaqlanan"], ü: ["incə", "qapalı", "dodaqlanan"] };
  const VOW = Object.keys(VP);
  const OPP = { qalın: "incə", incə: "qalın", açıq: "qapalı", qapalı: "açıq", dodaqlanan: "dodaqlanmayan", dodaqlanmayan: "dodaqlanan" };
  const DIK = [["qalın", "incə"], ["açıq", "qapalı"], ["dodaqlanan", "dodaqlanmayan"]];
  const SF = { qalın: "dır", incə: "dir", açıq: "dır", qapalı: "dır", dodaqlanan: "dır", dodaqlanmayan: "dır" };
  const hasP = (v, ps) => ps.every(p => VP[v].includes(p));
  const sayP = ps => { const a = ps.slice(), last = a.pop(); return (a.length ? a.join(", ") + " və " : "") + last; };
  const pred = ps => sayP(ps) + SF[ps[ps.length - 1]];
  const PROPS = [];
  DIK.forEach(d => d.forEach(p => PROPS.push([p])));
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) DIK[i].forEach(p => DIK[j].forEach(q => PROPS.push([p, q])));
  DIK[0].forEach(p => DIK[1].forEach(q => DIK[2].forEach(r => PROPS.push([p, q, r]))));
  const vdesc = v => "«" + v + "» — " + VP[v].join(", ");

  // ---- samitlər (s. 13): kar ş f x k p s ç t h; cingiltili j v ğ g b z c d q l m n r y
  const KAR = "ş f x k p s ç t h".split(" "), CING = "j v ğ g b z c d q l m n r y".split(" ");
  const PAIRS = [["ş", "j"], ["f", "v"], ["x", "ğ"], ["k", "g"], ["p", "b"], ["s", "z"], ["ç", "c"], ["t", "d"]];
  const PARTNER = {}; PAIRS.forEach(([a, b]) => { PARTNER[a] = b; PARTNER[b] = a; });
  const NOPAIRC = ["l", "m", "n", "r"];
  const isKar = c => KAR.includes(c);
  const kcName = c => isKar(c) ? "kar" : "cingiltili";
  const SIMPLE = [...KAR, ...CING].filter(c => c !== "q" && c !== "y");

  // ---- ahəng qanunu və heca (s. 53, 63, 71)
  const lastV = w => { w = lc(w); for (let i = w.length - 1; i >= 0; i--) if (VOW.includes(w[i])) return w[i]; };
  const sfx4 = v => ({ a: "ın", ı: "ın", ə: "in", e: "in", i: "in", o: "un", u: "un", ö: "ün", ü: "ün" })[v];
  const sfx2 = v => "aıou".includes(v) ? "lar" : "lər";
  const vowelsOf = w => [...lc(w)].filter(c => VOW.includes(c));
  const ahengKind = w => { const t = uniq(vowelsOf(w).map(v => VP[v][0])); return t.length > 1 ? "tabe olmur" : t[0] === "qalın" ? "qalın" : "incə"; };
  const ahengWhy = w => { const vs = vowelsOf(w); return "«" + w + "»: " + vs.map(v => v + " (" + VP[v][0] + ")").join(", ") + " — " + (ahengKind(w) === "tabe olmur" ? "həm qalın, həm incə sait var, ahəng qanununa tabe olmur" : "bütün saitlər " + ahengKind(w) + "dir, ahəng qanununa tabe olur").replace("qalındir", "qalındır"); };
  const TABE = ["qapı", "uşaq", "ağıl", "torpaq", "ağac", "qanun", "oğul", "qarpız", "çiçək", "dərin", "mürəkkəb", "dövlət", "ürək", "şəhər", "dəftər", "məktəb", "qəribə", "bünövrə", "gözəl", "xəbər"];
  const MIXED = ["kitab", "nişan", "heyvan", "ziyalı", "günah", "kompüter", "qida", "şagird", "dünya", "məktub", "telefon", "natiq"];
  const STEMS4 = ["qərar", "qüsur", "gündüz", "heyvan", "qunduz", "pələng", "öküz", "kitab", "dəftər", "şagird", "qələm", "gül", "dost", "göz", "dil", "qız", "yol"];
  const STEMS2 = { lar: ["kitab", "heyvan", "torpaq", "uşaq", "ziyalı", "dünya", "günah", "qapı", "oğul", "dost"], lər: ["dəftər", "kompüter", "şagird", "gecə", "çiçək", "ürək", "dövlət", "məktəb", "gül", "göz"] };
  const HECA = { dost: "dost", qız: "qız", kitab: "ki-tab", məktəb: "mək-təb", ağac: "a-ğac", şagird: "şa-gird", çörək: "çö-rək", uşaqlar: "u-şaq-lar", məktəbli: "mək-təb-li", dəftərlik: "dəf-tər-lik",
    kitabxana: "ki-tab-xa-na", Azərbaycan: "A-zər-bay-can", kompüter: "kom-pü-ter", universitet: "u-ni-ver-si-tet", şəkilçi: "şə-kil-çi", mürəkkəb: "mü-rək-kəb", televizor: "te-le-vi-zor", qələm: "qə-ləm", ürək: "ü-rək", qanun: "qa-nun", ahəng: "a-həng" };
  const hecaN = w => vowelsOf(w).length;
  const KEC_NO = ["ümid", "azad", "elan", "ağac", "ata", "ana", "uşaq", "ürək"];
  const KEC_OK = ["arzu", "güllü", "kitab", "dəftər", "məktəb", "şagird", "çörək", "qələm"];
  const HB = [["Kor-oğ-lu", "Ko-roğ-lu"], ["ya-rım-a-da", "ya-rı-ma-da"]]; // [düzgün, yanlış] — 5-ci sinif, s. 71
  // vurğu (7-ci sinif, 1-ci hissə, s. 55; köməkçi mənbə). [söz, hecaların sayı, vurğulu heca, vurğu işarəli yazılış]
  const VUR = [["bulaq", 2, 2, "buláq"], ["bulud", 2, 2, "bulúd"], ["ancaq", 2, 1, "áncaq"], ["bayaq", 2, 1, "báyaq"], ["sonra", 2, 1, "sónra"],
    ["radio", 3, 1, "rádio"], ["direktor", 3, 2, "diréktor"], ["monitorinq", 4, 3, "monitórinq"]];
  const vurQrup = r => r[2] === 1 ? 1 : r[2] === r[1] ? 0 : 2;
  const OMOQ = [["qızártma", "feil", "inkar feil"], ["qızartmá", "isim", "isim"], ["qóvun", "feil", "feil"], ["qovún", "isim", "isim"], ["qálın", "feil", "feil"]];

  // ---- samitlərin tələffüzü (6-cı sinif, s. 20)
  const KP = { b: "p", d: "t", c: "ç", g: "k" };
  const CONDT = { tek: "söz tək işlənir", sam: "sonra samitlə başlayan söz və ya şəkilçi gəlir", sait: "sonra saitlə başlayan söz və ya şəkilçi gəlir" };
  const sonMk = (d, w, c) => ({ d, w, L: w.slice(-1), c, s: c === "sait" ? w.slice(-1) : KP[w.slice(-1)], phrase: d.includes(" ") });
  const SON = [sonMk("kitab", "kitab", "tek"), sonMk("kitabda", "kitab", "sam"), sonMk("kitab nəşri", "kitab", "sam"), sonMk("kitabın", "kitab", "sait"), sonMk("kitab almaq", "kitab", "sait"),
    sonMk("cavab", "cavab", "tek"), sonMk("cavab vermək", "cavab", "sam"), sonMk("cavabı", "cavab", "sait"), sonMk("gülab ətri", "gülab", "sait"), sonMk("gülab suyu", "gülab", "sam"),
    sonMk("xarab olmaq", "xarab", "sait"), sonMk("xarab saat", "xarab", "sam"), sonMk("mərd", "mərd", "tek"), sonMk("mərd adam", "mərd", "sait"), sonMk("mərd igid", "mərd", "sait"),
    sonMk("dərd", "dərd", "tek"), sonMk("dərd çəkmək", "dərd", "sam"), sonMk("dərdi", "dərd", "sait"), sonMk("dörd", "dörd", "tek"), sonMk("dörd alma", "dörd", "sait"), sonMk("dörd kitab", "dörd", "sam"),
    sonMk("gənc", "gənc", "tek"), sonMk("gənc oğlan", "gənc", "sait"), sonMk("gənc qız", "gənc", "sam"), sonMk("gənc ailə", "gənc", "sait"), sonMk("gənc şair", "gənc", "sam")];
  const sonSol = e => "«" + e.d + "»: " + CONDT[e.c] + " → «" + e.w + "» sözünün son samiti [" + e.s + "] kimi tələffüz olunur (" + (e.s === e.L ? "cingiltili qalır" : "kar tələffüz olunur") + ").";
  // söz ortasında yanaşı kar samitlər (s. 20): [söz, fərqləndirilmiş hissə, əvvəl, sonra, səs, səhv variantlar, tələffüz forması, nə üçün]
  const YAN = [
    ["isti", "t", "is", "i", "d", ["t", "s", "z"], "[isdi]", "yanaşı kar samitlərin (s, t) ikincisi t-dir, cingiltili tələffüz olunur"],
    ["əlbəttə", "ikinci t", "əlbət", "ə", "d", ["t", "b", "g"], "[əlbətdə]", "yanaşı tt: ikinci t cingiltili tələffüz olunur"],
    ["töhfə", "f", "töh", "ə", "v", ["f", "h", "p"], "[töhvə]", "yanaşı kar samitlərin (h, f) ikincisi f-dir, cingiltili tələffüz olunur"],
    ["itki", "k", "it", "i", "g", ["k", "t", "x"], "[itgi]", "yanaşı kar samitlərin (t, k) ikincisi k-dir, cingiltili tələffüz olunur"],
    ["təşəkkür", "ikinci k", "təşək", "ür", "g", ["k", "x'", "y"], "[təşəkgür]", "yanaşı kk: ikinci k cingiltili tələffüz olunur"],
    ["asfalt", "f", "as", "alt", "v", ["f", "s", "p"], "[asvalt]", "yanaşı kar samitlərin (s, f) ikincisi f-dir, cingiltili tələffüz olunur"],
    ["hoppanmaq", "ikinci p", "hop", "anmaq", "b", ["p", "m", "v"], "[hopbammax]", "yanaşı pp: ikinci p cingiltili tələffüz olunur"],
    ["doqquz", "birinci q", "do", "quz", "k'", ["q", "x", "ğ"], "[dok'quz]", "qq samitlərindən birincisi kar tələffüz olunur"],
    ["taqqıltı", "birinci q", "ta", "qıltı", "k'", ["q", "x", "ğ"], "[tak'qıltı]", "qq samitlərindən birincisi kar tələffüz olunur"],
    ["sənətkar", "k", "sənət", "ar", "k", ["g", "k'", "x'"], "[sənətkar]", "fars mənşəli -kar şəkilçisi yazıldığı kimi tələffüz olunur"],
  ].map(([w, m, pre, post, s, wr, tr, why]) => ({ w, m, pre, post, s, wr, tr, why }));
  // transkripsiya: düzgün və səhv forma (dərslik: s. 20; 6-cı sinif)
  const YANT = YAN.filter(y => y.w !== "hoppanmaq").map(y => ({ w: y.w, ok: y.tr, bad: y.tr.replace(y.s, y.wr[0]), wrong: y.wr.map(x => y.tr.replace(y.s, x)) }));
  // "k" və "q" (5-ci sinif, s. 17, 21): [söz, əvvəl, hərf, sonra, səs]
  const KS = ["[k]", "[k']", "[g]", "[x']", "[y]"], QS = ["[q]", "[k']", "[x]", "[ğ]", "[k]"];
  const KQ = [
    ["k", "kitab", "", "k", "itab", "[k]"], ["k", "təbrik", "təbri", "k", "", "[k]"], ["k", "kosmos", "", "k", "osmos", "[k']"], ["k", "park", "par", "k", "", "[k']"],
    ["k", "bitki", "bit", "k", "i", "[g]"], ["k", "ötkəm", "öt", "k", "əm", "[g]"], ["k", "məktub", "mə", "k", "tub", "[x']"], ["k", "çörək", "çörə", "k", "", "[x']"], ["k", "çiçək ətri", "çiçə", "k", " ətri", "[y]"],
    ["q", "qapı", "", "q", "apı", "[q]"], ["q", "maqnit", "ma", "q", "nit", "[q]"], ["q", "məqsəd", "mə", "q", "səd", "[k']"], ["q", "şəfəq", "şəfə", "q", "", "[k']"], ["q", "vərəq", "vərə", "q", "", "[k']"],
    ["q", "otaq", "ota", "q", "", "[x]"], ["q", "budaq", "buda", "q", "", "[x]"], ["q", "torpaq ətri", "torpa", "q", " ətri", "[ğ]"], ["q", "barmaqarası", "barma", "q", "arası", "[ğ]"],
  ].map(([L, w, pre, m, post, s]) => ({ L, w, pre, m, post, s, set: L === "k" ? KS : QS }));
  const KQWHY = { "[k]": "k [k] kimi", "[k']": "k [k'] kimi", "[g]": "k [g] kimi", "[x']": "k [x'] kimi", "[y]": "saitlə başlanan söz əlavə edildikdə k [y] kimi", "[q]": "q [q] kimi", "[x]": "q [x] kimi", "[ğ]": "saitlə başlanan söz əlavə edildikdə q [ğ] kimi" };
  const KQSOL = e => "«" + e.w + "» sözündə " + e.L + " hərfi " + e.s + " kimi tələffüz olunur (dərslik: " + (e.L === "k" ? "5-ci sinif, s. 17" : "5-ci sinif, s. 21") + ").";
  // şəkilçi artırdıqda (s. 17, 21): [kök, şəkilçi, düzgün, səhv, səhv]
  const KQSUF = [["ürək", "ə", "ürəyə", "ürəkə", "ürəğə"], ["təbrik", "ə", "təbrikə", "təbriyə", "təbrigə"], ["otaq", "a", "otağa", "otaqa", "otaya"], ["vərəq", "in", "vərəqin", "vərəğin", "vərəxin"]];
  // uzun tələffüz (6-cı sinif, s. 15) və o → [a] (5-ci sinif, s. 13: konfet [k'anfet])
  const UZUN = [
    ["alim", "[a:lim]", ["[alim]", "[ali:m]", "[a:li:m]", "[a:lim:]"]], ["məna", "[mə:na]", ["[məna]", "[mən:a]", "[məna:]", "[mə:nə:]"]],
    ["tarix", "[ta:rix]", ["[tarix]", "[tari:x]", "[ta:ri:x]", "[tar:ix]"]], ["təmir", "[tə:mir]", ["[təmir]", "[təmi:r]", "[tə:mi:r]", "[təm:ir]"]],
    ["maarif", "[ma:rif]", ["[maarif]", "[mari:f]", "[ma:ri:f]", "[ma:a:rif]"]], ["mənfəət", "[mənfə:t]", ["[mənfəət]", "[mən:fəət]", "[mənfət:]", "[mə:nfəət]"]],
    ["bədii", "[bədi:]", ["[bədii]", "[bə:dii]", "[bədi:i]", "[bədi:i:]"]], ["maaş", "[ma:ş]", ["[maaş]", "[maş:]", "[ma:aş]", "[ma:a:ş]"]],
    ["təbii", "[təbi:]", ["[təbii]", "[tə:bi]", "[təbi:i]", "[tə:bi:]"]], ["camaat", "[cama:t]", ["[camaat]", "[ca:maat]", "[camat:]", "[ca:ma:t]"]],
    ["mətbəə", "[mətbə:]", ["[mətbəə]", "[mətbəə:]", "[mə:tbə]", "[mətbə:ə]"]], ["inşaat", "[inşa:t]", ["[inşaat]", "[i:nşat]", "[inşat:]", "[inşa:a:t]"]],
    ["konfet", "[k'anfet]", ["[konfet]", "[k'onfet]", "[k'anfət]", "[kanfet]"]],
  ].map(([w, ok, bad]) => ({ w, ok, bad, o: w === "konfet" }));
  const LONGW = ["bədii", "saat", "maaş", "təbii", "camaat", "mətbəə", "inşaat", "maarif", "mənfəət"];
  const EQW = ["kitab", "məktəb", "dəftər", "torpaq", "qələm", "ürək", "şagird", "uşaq", "çörək", "dərin", "gözəl", "bazar"];
  const nHerf = w => [...w].length;
  const nSes = w => nHerf(w) - (LONGW.includes(w) ? 1 : 0);
  const hs = (a, b) => a + " hərf, " + b + " səs";
  // qoşa samitlə bitən təkhecalı sözlər (6-cı sinif, s. 39): [düzgün, yanlış]
  const PQ = [["fənlər", "fənnlər"], ["xətkeş", "xəttkeş"], ["sirli", "sirrli"], ["sirrini", "sirini"], ["rəsmxət", "rəsmxətt"], ["qəsr", "qəsir"], ["sehrkar", "sehirkar"], ["rəhmdil", "rəhimdil"]];
  const QF = [["fənn", "lər", "fənlər", "fənnlər", "fənilər"], ["xətt", "keş", "xətkeş", "xəttkeş", "xətikeş"], ["sirr", "li", "sirli", "sirrli", "sirili"], ["hiss", "lər", "hisslər", "hisslar", "hissilər"], ["sirr", "ini", "sirrini", "sirini", "sirrnini"]];

  // ---- qaydalar: doğru və səhv fikirlər (dərslikdəki qayda sözlərinə yaxın)
  const FD = [
    "Saitlər alt çənənin vəziyyətinə görə açıq və qapalı olur.", "Açıq saitlər a, e, ə, o, ö saitləridir.", "Qapalı saitlər ı, i, u, ü saitləridir.",
    "u və ü qapalı, dodaqlanan saitlərdir.", "ə, i, e incə, dodaqlanmayan saitlərdir.", "o və u qalın, dodaqlanan saitlərdir.", "Səs tellərinin iştirakına görə samitlər kar və cingiltili olur.",
    "Kar və cingiltili samit cütlərinin tələffüzü oxşar olur.", "k və g kar və cingiltili samit cütüdür.", "Sözlərin düzgün yazılışı orfoqrafik norma adlanır.", "Sözlərin düzgün tələffüzü orfoepik norma adlanır.",
    "Fonetika dilin səs tərkibini öyrənən elm sahəsidir.", "Sözlərin tələffüz forması mötərizə içərisində yazılırsa, buna transkripsiya deyilir.", "Sözdəki hecaların sayı saitlərin sayına bərabərdir.",
    "Eynicinsli qoşa saitlər bir uzun sait kimi tələffüz olunur.", "Bəzi ərəb-fars mənşəli sözlərdə saitlərdən biri digərlərinə nisbətən uzun tələffüz olunur.",
    "Söz tək işlənərsə, sonundakı b, c, d, g samitləri kar tələffüz olunur.", "Sözdən sonra saitlə başlayan şəkilçi gələrsə, sonundakı b, c, d, g samitləri cingiltili tələffüz olunur.",
    "Söz ortasında yanaşı işlənən kar samitlərin ikincisi k, t, p, f olduqda cingiltili tələffüz olunur.", "Fars mənşəli -kar, -keş şəkilçiləri yazıldığı kimi tələffüz olunur.",
    "Eynicinsli qoşa samitlə bitən təkhecalı sözlərə samitlə başlanan şəkilçi artırdıqda kökdəki qoşa samitlərdən biri düşür («hiss» sözü istisnadır).", "Dilimizdəki milli mənşəli sözlərdə vurğu, əsasən, sözün son hecasına düşür.",
    "Eyni cür yazılıb vurğuya görə fərqli tələffüz edilən sözlər omoqraf adlanır.", "Şəkilçilərin əksəriyyəti sözün son hecasının ahənginə uyğun olaraq iki və ya dörd cür yazılır.",
    "Bir çox alınma sözlər ahəng qanununa tabe olmur.", "Bir saitdən ibarət hecanı sətrin sonunda saxlamaq olmaz.", "Sətirdən sətrə keçirmədə mürəkkəb sözlərin tərkib hissələri ayrı-ayrılıqda hecalara bölünür.",
    "Adların bir hərfdən ibarət qısaltmalarını sətrin sonunda saxlamaq olmaz.", "Bir sıra sözlərdə o saiti [a] kimi tələffüz olunur.", "Müxtəlifcinsli qoşa samitlə bitən təkhecalı sözlərin yazılışında yanaşı samitlərin arasına sait artırmaq olmaz.",
  ];
  const FS = [
    "Açıq saitlər ı, i, u, ü saitləridir.", "Qapalı saitlər a, e, ə, o, ö saitləridir.", "o və u incə saitlərdir.", "ö və ü dodaqlanmayan saitlərdir.", "ı və i qalın saitlərdir.", "a və ə eyni zamanda qalın saitdir.",
    "Səs tellərinin iştirakına görə samitlər qalın və incə olur.", "Bütün samitlərin kar və cingiltili qarşılığı var.", "Hecaların sayı samitlərin sayına bərabərdir.", "Eynicinsli qoşa saitlər iki ayrı sait kimi tələffüz olunur.",
    "Söz tək işlənərsə, sonundakı b, c, d, g samitləri cingiltili tələffüz olunur.", "Sözdən sonra saitlə başlayan söz gələrsə, sonundakı b samiti kar tələffüz olunur.",
    "Dilimizdəki milli mənşəli sözlərdə vurğu, əsasən, sözün ilk hecasına düşür.", "Alınma sözlərin hamısı ahəng qanununa tabe olur.", "Sözlərin düzgün tələffüzü orfoqrafik norma adlanır.", "Sözlərin düzgün yazılışı orfoepik norma adlanır.",
    "Eynicinsli qoşa samitlə bitən təkhecalı sözlərə samitlə başlanan şəkilçi artırdıqda kökdəki qoşa samitlərdən heç biri düşmür.",
    "Müxtəlifcinsli qoşa samitlə bitən təkhecalı sözlərin yazılışında yanaşı samitlərin arasına sait yazılmalıdır.", "Fars mənşəli -kar, -keş şəkilçiləri cingiltili tələffüz olunur.",
    "Fonetika sözlərin düzgün yazılış qaydalarını öyrənən elm sahəsidir.", "Transkripsiya sözün hecalara bölünməsidir.", "Bir saitdən ibarət hecanı sətrin sonunda saxlamaq olar.",
    "Söz ortasında yanaşı işlənən kar samitlərin ikincisi k, t, p, f olduqda həmişə kar qalır.", "qq samitlərindən ikincisi kar tələffüz olunur.",
  ];

  // ======== oyun səviyyələri ========
  const bolQ = (text, soz, qrup, duz, show, solution) => ({ text, bol: { soz, qrup, duz }, show, solution });
  const levels = [
    { id: "sait", ad: "Saitlər", izah: "Saitlərin növləri: qalın / incə, açıq / qapalı, dodaqlanan / dodaqlanmayan. Açıq: a, e, ə, o, ö. Qapalı: ı, i, u, ü. Cədvəl: qalın a, ı (dodaqlanmayan), o, u (dodaqlanan); incə ə, i, e (dodaqlanmayan), ö, ü (dodaqlanan).",
      gen() {
        const m = R(3);
        if (m === 0) {
          const ps = pick(PROPS), set = VOW.filter(v => hasP(v, ps)), soz = shuffle(VOW);
          return { text: "Bütün " + sayP(ps) + " saitlərin hamısına toxun.", sec: { soz, duz: soz.map((v, i) => set.includes(v) ? i : -1).filter(i => i >= 0) }, show: set.join(", "),
            solution: set.map(vdesc).join("; ") + ". Qalan saitlər başqa növdədir." };
        }
        if (m === 1) {
          const v = pick(VOW), right = VP[v].join(", ");
          const wrong = sample([1, 2, 3, 4, 5, 6, 7].map(mask => VP[v].map((p, i) => mask >> i & 1 ? OPP[p] : p).join(", ")), 3);
          const ch = shuffle([right, ...wrong]);
          return { text: "«" + v + "» saiti hansı xüsusiyyətlərə malikdir? (qalın/incə, açıq/qapalı, dodaqlanan/dodaqlanmayan)", choices: ch, correct: ch.indexOf(right), show: right, solution: vdesc(v) + "." };
        }
        for (;;) {
          const [x, y] = sample(VOW, 2), shared = VP[x].filter(p => VP[y].includes(p));
          if (shared.length < 1 || shared.length > 2) continue;
          const right = sayP(shared), cand = PROPS.filter(p => p.length <= 2 && p.some(q => !shared.includes(q))).map(sayP).filter(s => s !== right);
          const ch = shuffle([right, ...sample(cand, 3)]);
          return { text: "«" + x + "» və «" + y + "» saitlərinin bütün ortaq xüsusiyyətləri hansıdır?", choices: ch, correct: ch.indexOf(right), show: right, solution: vdesc(x) + "; " + vdesc(y) + ". Ortaq: " + right + "." };
        }
      } },
    { id: "samit", ad: "Samitlər: kar və cingiltili", izah: "Səs tellərinin iştirakına görə samitlər kar və cingiltili olur. Cütlər: ş–j, f–v, x–ğ, k–g, p–b, s–z, ç–c, t–d. h-nın cingiltili, l, m, n, r-in kar qarşılığı yoxdur.",
      gen() {
        const m = R(4);
        if (m === 0) {
          const items = shuffle([...sample(VOW, 2).map(v => [v, 0]), ...sample(KAR, 2).map(v => [v, 1]), ...sample(CING, 2).map(v => [v, 2])]);
          return bolQ("Hərfləri qruplara ayır: sait, kar samit, cingiltili samit.", items.map(x => x[0]), ["sait", "kar samit", "cingiltili samit"], items.map(x => x[1]),
            items.map(x => x[0] + " — " + ["sait", "kar samit", "cingiltili samit"][x[1]]).join("; "), "Saitlər: a, ı, o, u, ə, e, i, ö, ü. Kar samitlər: ş, f, x, k, p, s, ç, t, h. Cingiltili samitlər: j, v, ğ, g, b, z, c, d, q, l, m, n, r, y.");
        }
        if (m === 1) {
          const [k, c] = pick(PAIRS), ask = Math.random() < .5 ? k : c, right = PARTNER[ask];
          const others = sample(SIMPLE.filter(x => x !== ask && x !== right), 3), ch = shuffle([right, ...others]);
          return { text: "«" + ask + "» " + kcName(ask) + " samitinin " + (isKar(ask) ? "cingiltili" : "kar") + " qarşılığı hansıdır?", choices: ch, correct: ch.indexOf(right), show: right, solution: "«" + k + "» kar, «" + c + "» cingiltili samit cütüdür: " + k + "–" + c + "." };
        }
        if (m === 2) {
          const karMajor = Math.random() < .5, major = karMajor ? KAR : CING, minor = karMajor ? CING : KAR, odd = pick(minor);
          const ch = shuffle([odd, ...sample(major, 3)]);
          return { text: "Dördündən biri fərqlidir (kar – cingiltili):", choices: ch, correct: ch.indexOf(odd), show: odd,
            solution: "«" + odd + "» " + kcName(odd) + " samitdir; qalanları " + (karMajor ? "kar" : "cingiltili") + ": " + ch.filter(x => x !== odd).join(", ") + "." };
        }
        const np = sample(NOPAIRC, 3), pr = sample(["j", "v", "ğ", "g", "b", "z", "c", "d"], 3), soz = shuffle([...np, ...pr]);
        return { text: "Kar qarşılığı olmayan cingiltili samitlərin hamısına toxun.", sec: { soz, duz: soz.map((c, i) => np.includes(c) ? i : -1).filter(i => i >= 0) }, show: np.join(", "),
          solution: "l, m, n, r cingiltili samitlərdir, kar qarşılıqları yoxdur. Qalanların kar cütü var: " + pr.map(c => c + "–" + PARTNER[c]).join(", ") + "." };
      } },
    { id: "ahang", ad: "Ahəng, heca, vurğu", izah: "Şəkilçi sözün son hecasının ahənginə görə iki (-lar/-lər) və ya dörd (-ın⁴) cür yazılır. Heca sayı saitlərin sayına bərabərdir. Vurğu: milli sözlərdə əsasən son hecaya düşür.",
      gen() {
        const m = R(8);
        if (m === 0) {
          const w = pick(STEMS4), v = lastV(w), right = w + sfx4(v), ch = shuffle(["ın", "in", "un", "ün"].map(s => w + s));
          return { text: "«" + w + "» sözünə «-ın⁴» şəkilçisini artır:", choices: ch, correct: ch.indexOf(right), show: right, solution: "«" + w + "» sözünün son saiti «" + v + "» (" + VP[v].join(", ") + ") → " + right + "." };
        }
        if (m === 1) {
          const a = sample(STEMS2.lar, 3), b = sample(STEMS2.lər, 3), items = shuffle([...a.map(w => [w, 0]), ...b.map(w => [w, 1])]);
          return bolQ("Sözlərə cəm şəkilçisini artır: hansı sözlərə «-lar», hansılarına «-lər» artırılır?", items.map(x => x[0]), ["-lar", "-lər"], items.map(x => x[1]),
            items.map(x => x[0] + " → " + x[0] + sfx2(lastV(x[0]))).join("; "), "Şəkilçi sözün son saitinə görə seçilir: qalın saitdən sonra -lar, incə saitdən sonra -lər.");
        }
        if (m === 2) {
          const mx = sample(MIXED, 1 + R(2)), tb = sample(TABE, 6 - mx.length), soz = shuffle([...mx, ...tb]);
          return { text: "Ahəng qanununa tabe olmayan sözlərin hamısına toxun.", sec: { soz, duz: soz.map((w, i) => mx.includes(w) ? i : -1).filter(i => i >= 0) }, show: mx.join(", "),
            solution: soz.map(ahengWhy).join("; ") + "." };
        }
        if (m === 3) {
          const w = pick(Object.keys(HECA)), n = hecaN(w), ch = shuffle(uniq([n, ...sample([1, 2, 3, 4, 5, 6].filter(x => x !== n), 3)]).map(String));
          return { text: "«" + w + "» sözündə neçə heca var?", choices: ch, correct: ch.indexOf(String(n)), show: String(n), solution: "Hecaların sayı saitlərin sayına bərabərdir: " + HECA[w] + " — " + n + " heca." };
        }
        if (m === 4) {
          const no = sample(KEC_NO, 2 + R(2)), ok = sample(KEC_OK, 6 - no.length), soz = shuffle([...no, ...ok]);
          return { text: "Sətirdən sətrə keçirilməsi mümkün olmayan sözlərin hamısına toxun.", sec: { soz, duz: soz.map((w, i) => no.includes(w) ? i : -1).filter(i => i >= 0) }, show: no.join(", "),
            solution: "Bir saitdən ibarət hecanı sətrin sonunda saxlamaq və ya yeni sətrə keçirmək olmaz: " + no.map(w => w.slice(0, 1) + "-" + w.slice(1)).join(", ") + ". Qalanları keçirilə bilər." };
        }
        if (m === 5) {
          const items = shuffle(sample(VUR, 6).map(r => [r[0], vurQrup(r), r[3]])), q = ["vurğu son hecaya düşür", "vurğu ilk hecaya düşür", "vurğu orta hecaya düşür"];
          if (new Set(items.map(x => x[1])).size < 2) return null;
          return bolQ("Sözləri vurğunun yerinə görə qruplara ayır.", items.map(x => x[0]), q, items.map(x => x[1]), items.map(x => x[2] + " — " + q[x[1]]).join("; "), "Vurğulu hecanı dərslikdəki nümunələr göstərir: " + items.map(x => x[2]).join(", ") + ".");
        }
        if (m === 6) {
          const o = pick(OMOQ), opts = ["isim", "sifət", "feil", "say"];
          return { text: "Vurğuya görə «" + o[0] + "» sözü hansı nitq hissəsidir? (vurğulu heca işarələnib)", choices: opts, correct: opts.indexOf(o[1]), show: o[1], solution: "«" + o[0] + "» — " + o[2] + ". Eyni cür yazılıb vurğuya görə fərqli tələffüz olunan sözlər omoqrafdır (7-ci sinif, s. 55)." };
        }
        if (m === 7) {
          const hb = pick(HB), items = shuffle([[hb[0], 0], [hb[1], 1]]);
          return bolQ("Mürəkkəb sözün hecalara bölünməsində (sətirdən sətrə keçirmədə) hansı düzgün, hansı yanlışdır?", items.map(x => x[0]), ["düzgün", "yanlış"], items.map(x => x[1]), hb[0] + " — düzgün; " + hb[1] + " — yanlış",
            "Mürəkkəb sözlərin tərkib hissələri ayrı-ayrılıqda hecalara bölünür və sətirdən sətrə keçirilir: " + hb[0] + ".");
        }
        return null;
      } },
    { id: "sonsamit", ad: "Söz sonu və söz ortası samitləri", izah: "Söz sonunda b, c, d, g: söz tək işlənərsə və ya sonra samitlə başlayan şəkilçi/söz gələrsə, kar tələffüz olunur; saitlə başlayanda cingiltili qalır. Yanaşı kar samitlərin ikincisi k, t, p, f isə cingiltili tələffüz olunur.",
      gen() {
        const m = R(4);
        if (m === 0) {
          const e = pick(SON), L = e.L, K = KP[L], other = pick(Object.keys(KP).filter(x => x !== L)), right = "[" + e.s + "]";
          const ch = shuffle([right, "[" + (e.s === L ? K : L) + "]", "[" + other + "]", "[" + KP[other] + "]"]);
          return { text: "«" + e.d + "» — «" + e.w + "» sözünün son «" + L + "» samiti necə tələffüz olunur?", choices: ch, correct: ch.indexOf(right), show: right, solution: sonSol(e) };
        }
        if (m === 1) {
          const kar = sample(SON.filter(e => e.s !== e.L), 2 + R(2)), cing = sample(SON.filter(e => e.s === e.L), 6 - kar.length), soz = shuffle([...kar, ...cing]);
          return { text: "Kök sözün son samiti kar tələffüz olunan ifadələrin hamısına toxun.", sec: { soz: soz.map(e => e.d), duz: soz.map((e, i) => kar.includes(e) ? i : -1).filter(i => i >= 0) }, show: kar.map(e => e.d).join(", "),
            solution: soz.map(e => "«" + e.d + "» [" + e.s + "]").join("; ") + ". Tək işlənəndə və samitlə başlayan söz/şəkilçidən əvvəl kar, saitdən əvvəl cingiltili." };
        }
        if (m === 2) {
          const y = pick(YAN), ch = shuffle(uniq(["[" + y.s + "]", ...y.wr.map(x => "[" + x + "]")]));
          return { text: h("span", {}, "«" + y.w + "» sözündə fərqləndirilmiş samit necə tələffüz olunur?", line(mk(y.pre, y.m.replace(/^(ikinci|birinci) /, ""), y.post))), choices: ch, correct: ch.indexOf("[" + y.s + "]"), show: "[" + y.s + "]", solution: "«" + y.w + "» " + y.tr + ": " + y.why + "." };
        }
        const y = pick(YANT), alt = shuffle([y.ok, ...y.wrong]);
        return { text: "«" + y.w + "» sözünün tələffüz forması (transkripsiyası) hansıdır?", choices: alt, correct: alt.indexOf(y.ok), show: y.ok, solution: "«" + y.w + "» " + y.ok + " (dərslik: 6-cı sinif, s. 20)." };
      } },
    { id: "kq", ad: "K və Q samitləri", izah: "k hərfi [k], [k'], [g], [x'], [y]; q hərfi [q], [k'], [x], [ğ] səslərini ifadə edir. Saitlə başlanan şəkilçi artırdıqda: ürək – ürəyə, otaq – otağa.",
      gen() {
        const m = R(3);
        if (m === 0) {
          const e = pick(KQ), ch = shuffle(e.set);
          return { text: h("span", {}, "Fərqləndirilmiş hərf necə tələffüz olunur?", line(mk(e.pre, e.m, e.post))), choices: ch, correct: ch.indexOf(e.s), show: e.s, solution: KQSOL(e) };
        }
        if (m === 1) {
          const e = pick(KQSUF), opts = shuffle([e[2], e[3], e[4]]);
          return { text: "«" + e[0] + "» sözünə «-" + e[1] + "» artırdıqda necə yazılır?", choices: opts, correct: opts.indexOf(e[2]), show: e[2], solution: "Düzgün yazılış: " + e[2] + (e[0] === "ürək" ? " (k hərfi y ilə əvəzlənir)" : e[0] === "otaq" ? " (q hərfi ğ ilə əvəzlənir)" : " (hərf dəyişmir)") + "." };
        }
        const L = pick(["k", "q"]), pool = KQ.filter(e => e.L === L), items = shuffle(sample(pool, 6)), set = L === "k" ? KS : QS;
        if (new Set(items.map(e => e.s)).size < 2) return null;
        return bolQ("«" + L + "» hərfinin tələffüzünə görə sözləri qruplara ayır.", items.map(e => e.w), set, items.map(e => set.indexOf(e.s)), items.map(e => e.w + " " + e.s).join("; "), "Dərslik (5-ci sinif, s. " + (L === "k" ? 17 : 21) + "): " + items.map(e => e.w + " " + e.s).join("; ") + ".");
      } },
    { id: "uzun", ad: "Uzun sait, o → [a], hərf və səs", izah: "Bəzi sözlərdə sait uzun tələffüz olunur: alim [a:lim]. Eynicinsli qoşa saitlər bir uzun sait kimi deyilir: bədii [bədi:]. Bir sıra sözlərdə o saiti [a] kimi tələffüz olunur: konfet [k'anfet].",
      gen() {
        const m = R(3);
        if (m === 0) {
          const e = pick(UZUN), ch = shuffle([e.ok, ...sample(e.bad, 3)]);
          return { text: "«" + e.w + "» sözünün tələffüz forması (transkripsiyası) hansıdır?", choices: ch, correct: ch.indexOf(e.ok), show: e.ok, solution: "«" + e.w + "» " + e.ok + (e.o ? " — o saiti [a] kimi tələffüz olunur (5-ci sinif, s. 13)." : " — uzun saitdən sonra qoşa nöqta yazılır (6-cı sinif, s. 15).") };
        }
        const long = Math.random() < .6, w = long ? pick(LONGW) : pick(EQW), n = nHerf(w), s = nSes(w);
        const cand = uniq([hs(n, s), hs(n, n), hs(n - 1, n - 1), hs(n, n - 1), hs(n + 1, n), hs(n, n + 1), hs(n - 1, n)]).filter(x => x !== hs(n, s));
        const ch = shuffle([hs(n, s), ...sample(cand, 3)]);
        return { text: "«" + w + "» sözündə neçə hərf və neçə səs var? (Eynicinsli qoşa saitlər bir uzun sait kimi deyilir.)", choices: ch, correct: ch.indexOf(hs(n, s)), show: hs(n, s),
          solution: "«" + w + "»: " + n + " hərf" + (long ? ", qoşa sait bir uzun sait kimi tələffüz olunur, ona görə " + s + " səs." : "; hər hərf ayrıca səslənir, " + s + " səs.") };
      } },
    { id: "qosa", ad: "Qoşa samitlə bitən təkhecalı sözlər", izah: "Eynicinsli qoşa samitlə bitən təkhecalı sözlərə samitlə başlayan şəkilçi artırdıqda qoşa samitlərdən biri düşür: fənn – fənlər (hiss — istisna: hisslər). Bu cür sözlər mürəkkəb sözün ikinci tərəfi olduqda da sonda bir samit yazılır: xətt – rəsmxət. Müxtəlifcinsli: üzr, qəsr, sehrkar, rəhmdil — samitlərin arasına sait yazılmır.",
      gen() {
        const m = R(3);
        if (m === 0) {
          const items = shuffle(sample(PQ, 6).map(p => Math.random() < .5 ? [p[0], 0] : [p[1], 1]));
          if (new Set(items.map(x => x[1])).size < 2) return null;
          return bolQ("Sözlərin yazılışını yoxla: hansı düzgün, hansı səhv yazılıb?", items.map(x => x[0]), ["düzgün yazılıb", "səhv yazılıb"], items.map(x => x[1]),
            items.map(x => x[0] + " — " + (x[1] ? "səhv" : "düzgün")).join("; "), "Düzgün yazılışlar (6-cı sinif, s. 39): " + items.map(x => PQ.find(p => p.includes(x[0]))[0]).join(", ") + ".");
        }
        if (m === 1) {
          const q = pick(QF), ch = shuffle([q[2], q[3], q[4]]);
          return { text: "«" + q[0] + "» sözünə «-" + q[1] + "» artırdıqda necə yazılır?", choices: ch, correct: ch.indexOf(q[2]), show: q[2],
            solution: "Düzgün: " + q[2] + (q[2] === "hisslər" ? " — «hiss» sözü istisnadır." : q[1] === "ini" ? " — şəkilçi saitlə başlayır, qoşa samit düşmür." : " — samitlə başlayan şəkilçi artırdıqda qoşa samitlərdən biri düşür.") };
        }
        const ch = shuffle(["[hökümdar]", "[hökmdar]", "[hökmdər]", "[hökmtar]"]);
        return { text: "«hökmdar» sözünün tələffüz forması (transkripsiyası) hansıdır?", choices: ch, correct: ch.indexOf("[hökümdar]"), show: "[hökümdar]", solution: "Müxtəlifcinsli qoşa samitlə bitən sözlərdən bəzilərinə samitlə başlayan şəkilçi artırdıqda tələffüzdə səsartımı baş verir: hökmdar [hökümdar]." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird fonetikaya aid üç fikir yazıb. Biri səhvdir — hansı?",
      gen() {
        const F = [
          () => { const v = pick(VOW), mask = 1 + R(7), t = "«" + v + "» saiti " + sayP(VP[v]) + " saitdir.", f = "«" + v + "» saiti " + sayP(VP[v].map((p, i) => mask >> i & 1 ? OPP[p] : p)) + " saitdir."; return { t, f, w: "sait" }; },
          () => { const [k, c] = pick(PAIRS), x = Math.random() < .5 ? k : c, y = PARTNER[x]; return { t: "«" + x + "» " + kcName(x) + " samitdir, " + (isKar(x) ? "cingiltili" : "kar") + " qarşılığı «" + y + "»-dir.", f: "«" + x + "» " + kcName(x) + " samitdir, " + (isKar(x) ? "cingiltili" : "kar") + " qarşılığı «" + PARTNER[pick(PAIRS.flat().filter(q => q !== x && q !== y))] + "»-dir.", w: "cüt" }; },
          () => { const e = pick(SON.filter(x => x.phrase)), bad = e.s === e.L ? KP[e.L] : e.L; return { t: "«" + e.d + "» ifadəsində «" + e.w + "» sözünün son samiti [" + e.s + "] kimi tələffüz olunur.", f: "«" + e.d + "» ifadəsində «" + e.w + "» sözünün son samiti [" + bad + "] kimi tələffüz olunur.", w: "son" }; },
          () => { const y = pick(YANT); return { t: "«" + y.w + "» sözünün tələffüz forması " + y.ok + " kimidir.", f: "«" + y.w + "» sözünün tələffüz forması " + y.bad + " kimidir.", w: "yan" }; },
          () => { const e = pick(KQ), bad = pick(e.set.filter(x => x !== e.s)); return { t: "«" + e.w + "» sözündə " + e.L + " hərfi " + e.s + " kimi tələffüz olunur.", f: "«" + e.w + "» sözündə " + e.L + " hərfi " + bad + " kimi tələffüz olunur.", w: "kq" }; },
          () => { const a = pick(MIXED), b = pick(TABE); return { t: "«" + a + "» sözü ahəng qanununa tabe olmur.", f: "«" + b + "» sözü ahəng qanununa tabe olmur.", w: "ahəng" }; },
          () => { const w = pick(STEMS4), v = lastV(w), bad = pick(["ın", "in", "un", "ün"].filter(x => x !== sfx4(v))); return { t: "«" + w + "» sözünə «-ın⁴» şəkilçisi artırılanda «" + w + sfx4(v) + "» yazılır.", f: "«" + w + "» sözünə «-ın⁴» şəkilçisi artırılanda «" + w + bad + "» yazılır.", w: "şəkilçi" }; },
          () => { const w = pick(Object.keys(HECA)), n = hecaN(w); return { t: "«" + w + "» sözündə " + n + " heca var.", f: "«" + w + "» sözündə " + (n === 1 ? 2 : n - 1) + " heca var.", w: "heca" }; },
          () => { const a = pick(KEC_NO), b = pick(KEC_OK); return { t: "«" + a + "» sözünü sətirdən sətrə keçirmək olmaz.", f: "«" + b + "» sözünü sətirdən sətrə keçirmək olmaz.", w: "keç" }; },
          () => { const r = pick(VUR), bad = r[2] === 1 ? "son" : "ilk", good = r[2] === 1 ? "ilk" : r[2] === r[1] ? "son" : "orta"; return { t: "«" + r[0] + "» sözündə vurğu " + good + " hecaya düşür.", f: "«" + r[0] + "» sözündə vurğu " + (good === "ilk" ? "son" : "ilk") + " hecaya düşür.", w: "vurğu" }; },
          () => { const p = pick(PQ); return { t: "Düzgün yazılış: " + p[0] + ".", f: "Düzgün yazılış: " + p[1] + ".", w: "qoşa" }; },
          () => { const e = pick(UZUN); return { t: "«" + e.w + "» sözünün tələffüz forması " + e.ok + " kimidir.", f: "«" + e.w + "» sözünün tələffüz forması " + pick(e.bad) + " kimidir.", w: "uzun" }; },
          () => { const w = pick([...LONGW, ...EQW]), n = nHerf(w), s = nSes(w); return { t: "«" + w + "» sözündə " + hs(n, s) + " var.", f: "«" + w + "» sözündə " + hs(n, n === s ? n - 1 : n) + " var.", w: "hərf-səs" }; },
          () => ({ t: pick(FD), f: pick(FS), w: "qayda" }),
        ];
        const ws = sample(F, 3).map(f => f()), k = R(3);
        const ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "Şagird üç fikir yazıb: " + ws.map((x, j) => (j + 1) + ") " + (j === k ? x.f : x.t)).join(" ") + " Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd", solution: "Səhv fikir: " + ws[k].f + " Düzgünü: " + ws[k].t + " Digər iki bənd düzdür." };
      } },
  ];

  levels.forEach(l => { const g = l.gen; l.gen = () => Oyun.again(() => g.call(l)); });

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const phrases = SON.filter(e => e.phrase);
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ps = pick(PROPS.filter(p => p.length >= 2)), S = VOW.filter(v => hasP(v, ps)), N = VOW.filter(v => !hasP(v, ps));
      if (!S.length || N.length < 4) return null;
      const right = pick(S), wrong = sample(N, 4);
      return AEq("Hansı sait " + pred(ps) + "?", right, wrong, vdesc(right) + ". Qalanlar bu xüsusiyyətlərə malik deyil: " + wrong.map(vdesc).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) {
        const five = sample(VOW, 5); let odd = null, cnt = 0;
        DIK.forEach(([p, q]) => { const c = five.filter(v => VP[v].includes(p)).length; if (c === 4) { odd = five.find(v => VP[v].includes(q)); cnt++; } else if (c === 1) { odd = five.find(v => VP[v].includes(p)); cnt++; } });
        if (cnt !== 1) return null;
        return AEq("Saitlərdən biri digərlərindən fərqlidir:", odd, five.filter(v => v !== odd), "«" + odd + "» — " + VP[odd].join(", ") + "; digər dördü: " + five.filter(v => v !== odd).map(v => v + " (" + VP[v].join(", ") + ")").join("; ") + ". Fərq tək bir xüsusiyyətdə qalır.");
      }
      const karMajor = Math.random() < .5, major = karMajor ? KAR : CING, minor = karMajor ? CING : KAR, odd = pick(minor);
      return AEq("Samitlərdən biri digərlərindən fərqlidir (kar – cingiltili):", odd, sample(major, 4), "«" + odd + "» " + kcName(odd) + " samitdir; qalanları " + (karMajor ? "kar" : "cingiltili") + " samitlərdir.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const kar = Math.random() < .5, right = pick(phrases.filter(e => (e.s !== e.L) === kar)), wrong = sample(phrases.filter(e => (e.s !== e.L) !== kar && e.w !== right.w), 4);
      return AEq("Hansı ifadədə birinci sözün son samiti " + (kar ? "kar" : "cingiltili") + " tələffüz olunur?", right.d, wrong.map(e => e.d), sonSol(right) + " Digərlərində: " + wrong.map(e => "«" + e.d + "» [" + e.s + "]").join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(phrases, 5), kar = Math.random() < .5, right = five.map((e, i) => (e.s !== e.L) === kar ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş ifadələrdən hansılarında birinci sözün son samiti " + (kar ? "kar" : "cingiltili") + " tələffüz olunur?", ...five.map((e, i) => h("span", { style: "display:block" }, (i + 1) + ". " + e.d))), ...o, show: o.choices[o.correct],
        solution: five.map((e, i) => (i + 1) + ") " + e.d + " — [" + e.s + "]").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const good = Math.random() < .5, pool = YANT.slice(), right = pick(pool), wrong = sample(pool.filter(x => x.w !== right.w), 4);
      if (good) return AEq("Tələffüz forması (transkripsiyası) düzgün göstərilən sözü müəyyən edin:", right.w + " " + right.ok, wrong.map(x => x.w + " " + x.bad), "«" + right.w + "» " + right.ok + " (" + YAN.find(y => y.w === right.w).why + "). Digərlərində tələffüz forması səhv göstərilib: " + wrong.map(x => x.w + " " + x.ok).join("; ") + " olmalıdır.");
      return AEq("Tələffüz forması (transkripsiyası) düzgün göstərilməyən sözü müəyyən edin:", right.w + " " + right.bad, wrong.map(x => x.w + " " + x.ok), "«" + right.w + "» sözünün düzgün forması " + right.ok + " (" + YAN.find(y => y.w === right.w).why + "). Digərləri düzgündür.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const e = pick(KQ), ch = e.set.filter(x => x !== e.s);
      return AEq(h("span", {}, "Fərqləndirilmiş hərf necə tələffüz olunur?", line(mk(e.pre, e.m, e.post))), e.s, ch, KQSOL(e) + " Digər variantlar başqa sözlərdəki tələffüzdür.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) {
        const e = pick(UZUN.filter(x => !x.o)), wrong = e.bad;
        return AEq("«" + e.w + "» sözünün tələffüz forması (transkripsiyası) düzgün göstərilib:", e.w + " " + e.ok, wrong.map(x => e.w + " " + x), "«" + e.w + "» " + e.ok + ": uzun tələffüz olunan saitdən sonra qoşa nöqta yazılır (eynicinsli qoşa saitlər bir uzun sait kimi deyilir).");
      }
      const right = pick(LONGW), wrong = sample(EQW, 4);
      return AEq("Hansı sözdə hərflərin sayı səslərin sayından çoxdur?", right, wrong, "«" + right + "»: " + hs(nHerf(right), nSes(right)) + " (qoşa sait bir uzun sait kimi deyilir). Digərlərində hərf və səs sayı bərabərdir: " + wrong.map(w => w + " — " + hs(nHerf(w), nSes(w))).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const p = pick(PQ), others = sample(PQ.filter(x => x !== p), 4); return AEq("Hansı sözdə orfoqrafik səhv var?", p[1], others.map(x => x[0]), "Düzgün yazılış: " + p[0] + " (6-cı sinif, s. 39). Digər dördü düzgün yazılıb."); }
      const p = pick(PQ), others = sample(PQ.filter(x => x !== p), 4); return AEq("Hansı söz düzgün yazılıb?", p[0], others.map(x => x[1]), "Düzgün yazılış: " + p[0] + ". Digərlərində səhv var: " + others.map(x => x[1] + " → " + x[0]).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const tabe = Math.random() < .5, five = sample([...TABE, ...MIXED], 5);
      const right = five.map((w, i) => (ahengKind(w) !== "tabe olmur") === tabe ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansıları ahəng qanununa " + (tabe ? "tabe olur" : "tabe olmur") + "?", line(five.map((w, i) => (i + 1) + ". " + w).join("  "))), ...o, show: o.choices[o.correct],
        solution: five.map((w, i) => (i + 1) + ") " + ahengWhy(w)).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = R(3);
      if (t === 0) { const ilk = VUR.filter(r => r[2] === 1), not = VUR.filter(r => r[2] !== 1), right = pick(ilk); return AEq("Vurğu ilk hecaya düşən sözü müəyyən edin:", right[0], not.map(r => r[0]), "«" + right[3] + "» — vurğu ilk hecaya düşür. Digərləri: " + not.map(r => r[3]).join(", ") + " (7-ci sinif, s. 55)."); }
      if (t === 1) {
        if (Math.random() < .5) { const bad = pick(FS); return AEq("Fonetika ilə bağlı səhv fikri müəyyən edin.", bad, sample(FD, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
        const ok = pick(FD); return AEq("Fonetika ilə bağlı doğru fikri müəyyən edin.", ok, sample(FS, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
      }
      const n = pick([2, 3]), same = sample(Object.keys(HECA).filter(w => hecaN(w) === n), 4), odd = pick(Object.keys(HECA).filter(w => hecaN(w) !== n));
      return AEq("Hecaların sayına görə biri fərqlidir:", odd, same, "«" + odd + "» — " + hecaN(odd) + " heca (" + HECA[odd] + "); qalanları " + n + " hecalıdır: " + same.map(w => HECA[w]).join(", ") + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  window.__levels = levels;
  window.__bank = { VP, KAR, CING, PAIRS, SON, YAN, YANT, KQ, KQSUF, UZUN, LONGW, EQW, PQ, QF, TABE, MIXED, STEMS4, STEMS2, HECA, KEC_NO, KEC_OK, HB, VUR, OMOQ, FD, FS };

  // ======== müstəqil yoxlama siyahısı (Codex): bankdakı hər fakt ========
  const Y = []; const addY = (id, sual, cavab) => Y.push({ id, sual, cavab });
  VOW.forEach(v => addY("sait-" + v, "«" + v + "» saiti: qalın, yoxsa incə? açıq, yoxsa qapalı? dodaqlanan, yoxsa dodaqlanmayan? (üç cavabı sırası ilə, vergüllə yaz; qalın/incə, açıq/qapalı, dodaqlanan/dodaqlanmayan)", VP[v].join(", ")));
  [...KAR, ...CING].forEach(c => addY("samit-" + c, "«" + c + "» samiti kar, yoxsa cingiltilidir? (kar, cingiltili)", kcName(c)));
  PAIRS.forEach(([k, c]) => { addY("cut-" + k, "«" + k + "» kar samitinin cingiltili qarşılığı hansıdır? (Azərbaycan əlifbasındakı kar–cingiltili cütlük)", c); addY("cut-" + c, "«" + c + "» cingiltili samitinin kar qarşılığı hansıdır? (Azərbaycan əlifbasındakı kar–cingiltili cütlük)", k); });
  ["h"].forEach(c => addY("qarsi-" + c, "«h» kar samitinin cingiltili qarşılığı varmı? (bəli, xeyr)", "xeyr"));
  NOPAIRC.forEach(c => addY("qarsi-" + c, "«" + c + "» cingiltili samitinin kar qarşılığı varmı? (bəli, xeyr)", "xeyr"));
  SON.forEach((e, i) => addY("son" + (i + 1), "«" + e.d + "» — «" + e.w + "» sözünün son «" + e.L + "» samiti bu ifadədə [" + e.L + "] kimi, yoxsa [" + KP[e.L] + "] kimi tələffüz olunur? (cavab: [" + e.L + "] və ya [" + KP[e.L] + "])", "[" + e.s + "]"));
  YAN.forEach((y, i) => addY("yan" + (i + 1), "«" + y.w + "» sözündə " + y.m + " samiti necə tələffüz olunur? (seçimlər: [" + [y.s, ...y.wr].join("], [") + "])", "[" + y.s + "]"));
  KQ.forEach((e, i) => addY("kq" + (i + 1), "«" + e.w + "» ifadəsində " + (e.L === "k" ? "k" : "q") + " hərfi necə tələffüz olunur? (seçimlər: " + e.set.join(", ") + ")", e.s));
  KQSUF.forEach((e, i) => addY("kqs" + (i + 1), "«" + e[0] + "» sözünə «-" + e[1] + "» şəkilçisini artırın (yazılışı yaz).", e[2]));
  UZUN.forEach((e, i) => addY("uzun" + (i + 1), "«" + e.w + "» sözünün tələffüz formasını (transkripsiyasını) mötərizədə yaz. Uzun tələffüz olunan saitdən sonra qoşa nöqta (:) qoy" + (e.o ? "; k-nın [k'] səsini bu işarə ilə göstər" : "") + ".", e.ok));
  [...LONGW, ...EQW].forEach((w, i) => addY("hs" + (i + 1), "«" + w + "» sözündə neçə hərf və neçə səs var? (eynicinsli qoşa saitlər bir uzun sait kimi tələffüz olunur; cavab forması: 5 hərf, 5 səs)", hs(nHerf(w), nSes(w))));
  PQ.forEach((p, i) => addY("pq" + (i + 1), "Hansı yazılış düzgündür: «" + shuffle([p[0], p[1]]).join("», yoxsa «") + "»?", p[0]));
  addY("hokmdar", "«hökmdar» sözünün tələffüz formasını (transkripsiyasını) yaz (tələffüzdə iki samitin arasına sait əlavə olunur).", "[hökümdar]");
  [...TABE, ...MIXED].forEach((w, i) => addY("ah" + (i + 1), "«" + w + "» sözündəki saitlərin hamısı qalındırmı, hamısı incədirmi, yoxsa həm qalın, həm incə sait var? Söz ahəng qanununa tabe olurmu? (bəli, xeyr)", ahengKind(w) === "tabe olmur" ? "xeyr" : "bəli"));
  STEMS4.forEach((w, i) => addY("s4-" + (i + 1), "«" + w + "» sözünə dörd cür yazılan «-ın⁴» şəkilçisini artırın (-ın, -in, -un, -ün; yazılışı yaz).", w + sfx4(lastV(w))));
  [...STEMS2.lar, ...STEMS2.lər].forEach((w, i) => addY("s2-" + (i + 1), "«" + w + "» sözünə cəm şəkilçisini artırın (-lar, -lər; yazılışı yaz).", w + sfx2(lastV(w))));
  Object.keys(HECA).forEach((w, i) => addY("heca" + (i + 1), "«" + w + "» sözündə neçə heca var?", String(hecaN(w))));
  KEC_NO.forEach((w, i) => addY("kecno" + (i + 1), "«" + w + "» sözünü sətirdən sətrə keçirmək olarmı? (olar, olmaz)", "olmaz"));
  KEC_OK.forEach((w, i) => addY("kecok" + (i + 1), "«" + w + "» sözünü sətirdən sətrə keçirmək olarmı? (olar, olmaz)", "olar"));
  HB.forEach((p, i) => addY("hb" + (i + 1), "Mürəkkəb sözün hecalara bölünməsi (sətirdən sətrə keçirmədə) hansı düzgündür: «" + shuffle(p).join("», yoxsa «") + "»?", p[0]));
  VUR.forEach((r, i) => addY("vur" + (i + 1), "«" + r[0] + "» sözündə vurğu neçənci hecaya düşür? (Azərbaycan dilindəki normal tələffüzə görə; 1, 2, 3, 4)", String(r[2])));
  OMOQ.forEach((o, i) => addY("omoq" + (i + 1), "Vurğuya görə (vurğulu saitə qoyulmuş işarə) «" + o[0] + "» sözü hansı nitq hissəsidir? (isim, sifət, feil, say)", o[1]));
  FD.forEach((x, i) => addY("dogru" + (i + 1), "Fikir: «" + x + "» (doğru, səhv)", "doğru"));
  FS.forEach((x, i) => addY("sehv" + (i + 1), "Fikir: «" + x + "» (doğru, səhv)", "səhv"));
  window.__yoxla = Y;

  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-fonetika", title: "Fonetika və orfoepiya", fenn: "azdili", link: "dersler/az-fonetika.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, sözə toxunmaq və ya hərfləri/sözləri qruplara ayırmaq. Tələffüz qaydalarını dərslikdəki nümunələrlə yoxla.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sait", "samit", "ahang", "ahang", "sonsamit", "sonsamit", "kq", "uzun", "qosa", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-fonetika.html")) b.push("dersler/az-fonetika.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
