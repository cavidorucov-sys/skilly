// Azərbaycan dili · İsim II: hallar, mənsubiyyət, xəbərlik — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024), s. 16 (ismin halları, "Xatırla"), s. 21 (mənsubiyyət şəkilçiləri),
// s. 27 (xəbərlik şəkilçiləri); 6-cı sinif, 1-ci hissə (2025), s. 10 (ikihecalı sözlərdə qapalı saitin düşməsi), s. 72 (qeyri-müəyyən
// yiyəlik hal); 6-cı sinif, 2-ci hissə (2025), s. 28 (qeyri-müəyyən təsirlik hal), s. 35 (adlıq, qeyri-müəyyən yiyəlik və təsirlik halın
// fərqi), s. 79 (mənsubiyyət şəkilçisinin yazılışı: tale, mənafe, mənbə, mənşə, mövqe, nə, su); 7-ci sinif, 2-ci hissə, s. 21
// (yönlük hal: baltaya, kölgəyə; çıxışlıq hal: vaqondan [vaqonnan]) — 7-ci sinif köməkçi mənbədir. Cümlələrdə bütün isimlər halına
// görə etiketlənib (a2 = bank etiketi), qeyri-müəyyən hallar yalnız kontekstdə birmənalı olduqda götürülüb. Bankda qəsdən olmayanlar:
// mənsubiyyətli sözün halı (kitabı, şəkli kimi formalar tək-tək verilmir), ilə/-la şəkilçili isimlər, sifətləşmə və isimləşmə
// (yalnız qısa təsirlik nümunələri), əvəzliyin halları.
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const SUP = "¹²³⁴⁵⁶⁷";
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const lineS = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const cap = s => s[0].toLocaleUpperCase("az") + s.slice(1);

  // ---- saitlər, ahəng, şəkilçi düzəltmə
  const isV = ch => "aıoueəiöü".includes(ch);
  const lastV = w => { for (let i = w.length - 1; i >= 0; i--) if (isV(w[i])) return w[i]; return "a"; };
  const H4 = { a: "ı", ı: "ı", o: "u", u: "u", e: "i", ə: "i", i: "i", ö: "ü", ü: "ü" };
  const harm4 = w => H4[lastV(w)];
  const back = w => "aıou".includes(lastV(w));
  const harm2 = w => back(w) ? "a" : "ə";
  const dropV = w => { for (let i = w.length - 1; i >= 0; i--) if (isV(w[i])) return w.slice(0, i) + w.slice(i + 1); return w; };
  const endsV = w => isV(w[w.length - 1]);

  // ---- hallar
  const AD = { ad: "adlıq", yi: "yiyəlik", qy: "qeyri-müəyyən yiyəlik", yo: "yönlük", te: "təsirlik", qt: "qeyri-müəyyən təsirlik", ye: "yerlik", ci: "çıxışlıq" };
  const OPT6 = ["adlıq", "yiyəlik", "yönlük", "təsirlik", "yerlik", "çıxışlıq"];
  const WHY = {
    ad: "hal şəkilçisi yoxdur (söz yalnız mənsubiyyət şəkilçisi qəbul etmiş ola bilər: zirvəsi, ağacı), cümlədə subyekti bildirir",
    yi: "yiyəlik hal şəkilçisi (-ın⁴) var",
    qy: "şəkilçisi yoxdur, ismi birləşmənin birinci tərəfidir (müvafiq şəkilçi artırmaq olar)",
    yo: "yönlük hal şəkilçisi (-a²) var",
    te: "təsirlik hal şəkilçisi (-ı⁴) var, obyekti bildirir",
    qt: "şəkilçisi yoxdur, obyekti bildirir (müvafiq şəkilçi artırmaq olar)",
    ye: "yerlik hal şəkilçisi (-da²) var",
    ci: "çıxışlıq hal şəkilçisi (-dan²) var",
  };
  const isP = w => !/[\p{L}\d]/u.test(w);
  const plain = s => s.map((x, i) => (i && !isP(x.w) ? " " : "") + x.w).join("");
  const markS = (s, idx) => s.map((x, j) => [j && !isP(x.w) ? " " : "", idx.includes(j) ? h("u", {}, h("b", {}, x.w)) : x.w]);
  const markStr = (s, idx) => s.map((x, j) => (j && !isP(x.w) ? " " : "") + (idx.includes(j) ? "[" + x.w + "]" : x.w)).join("");

  // ---- cümlə bankı: "söz:etiket" — etiket yalnız isimdədir (ad, yi, qy, yo, te, qt, ye, ci); etiketsiz söz isim deyil
  // (feil, sifət, zərf, əvəzlik, say) və ya durğu işarəsidir; "_" bir vahiddə iki söz. Hər cümlədə bütün isimlər etiketlənib.
  const BANK = [
    "Balıqçı:ad dənizdən:ci balıq:qt tutdu .",
    "Uşaqlar:ad bağda:ye oynayırdılar .",
    "Atam:ad qapını:te açdı .",
    "Qatar:ad stansiyaya:yo yaxınlaşdı .",
    "Gülay:ad kitabxanadan:ci üç kitab:qt götürdü .",
    "Dağın:yi zirvəsi:ad ucalırdı .",
    "Müəllim:ad şagirdlərə:yo yeni mövzunu:te izah etdi .",
    "Nənəm:ad bağçada:ye gül:qt əkir .",
    "Uşaq:ad süd:qt içdi .",
    "Pəncərə:qy şüşəsi:ad qırıldı .",
    "Məktəb:qy direktoru:ad toplantıya:yo gəldi .",
    "Qonşunun:yi oğlu:ad şəhərə:yo getdi .",
    "Gəmi:ad limandan:ci ayrıldı .",
    "Babam:ad bağdan:ci alma:qt gətirdi .",
    "Biz yay:qy tətilini:te kənddə:ye keçirdik .",
    "Qardaşım:ad məktəbə:yo tez gedir .",
    "Biz dərsdə:ye yeni sözlər:qt öyrəndik .",
    "Çobanın:yi sürüsü:ad yamacda:ye otlayırdı .",
    "Qız:ad güllərin:yi ətrini:te duydu .",
    "Əli:ad Bakıdan:ci Gəncəyə:yo getdi .",
    "Ana:ad körpəyə:yo layla:qt dedi .",
    "Həkim:ad uşağa:yo dərman:qt yazdı .",
    "Usta:ad divarı:te rəngləyir .",
    "Çay:ad dağlardan:ci başlayır .",
    "Şagirdlər:ad ekskursiyaya:yo hazırlaşırlar .",
    "Quşlar:ad budaqda:ye oturmuşdu .",
    "Mən tarlada:ye buğda:qt gördüm .",
    "Dəniz:qy havası:ad çox sağlamdır .",
    "Alma:qy ağacı:ad bağda:ye bitir .",
    "Balıq:qy yağı:ad çox xeyirlidir .",
    "Bulaq:qy suyu:ad sərindir .",
    "Zəng:qy səsi:ad uşağı:te yuxudan:ci oyatdı .",
    "Qala:qy divarları:ad qədimdir .",
    "Uşaqlıq:qy xatirələri:ad əzizdir .",
    "Çörək:qy muzeyi:ad Ağdamda:ye yerləşirdi .",
    "Uşaqlar:ad çərpələngi:te uçurtdular .",
    "Uşaqlar:ad çərpələng:qt uçurtdular .",
    "Mən yolda:ye maşını:te gördüm .",
    "Mən yolda:ye maşın:qt gördüm .",
    "Gülnar:ad kitab:qt oxuyur .",
    "İdmançı:ad medal:qt qazandı .",
    "İnşaatçılar:ad körpü:qt tikirlər .",
    "Usta:ad maşın:qt təmir_edir .",
    "Kitabın:yi cildi:ad rəngarəngdir .",
    "Müəllim:ad xəritəni:te divardan:ci asdı .",
    "Dünən kəndlilər:ad meşədə:ye ayını:te görüblər .",
    "Müəllim:ad sual:qt verdi .",
    "Ata:ad çörək:qt aldı .",
    "Qız:ad şeir:qt oxuyur .",
    "Anam:ad plov:qt bişirdi .",
    "Uşaq:ad çay:qt içir .",
    "Nənə:ad corab:qt toxuyur .",
    "Şagird:ad məktub:qt yazdı .",
    "Meyvə:qy bağı:ad böyükdür .",
    "Çay:qy sahili:ad gözəldir .",
    "Şəhər:qy bazarı:ad səs-küylüdür .",
  ].map(s => s.split(" ").map(t => { const m = t.match(/^(.+):([a-z]{2})$/); return m ? { w: m[1].replace(/_/g, " "), t: m[2] } : { w: t.replace(/_/g, " "), t: null }; }));
  const nouns = s => s.filter(x => x.t);
  const idxOf = (s, t) => s.map((x, i) => x.t === t ? i : -1).filter(i => i >= 0);
  // "te" təsirlik, "qt" qeyri-müəyyən təsirlik də təsirlikdir; "yi" ilə "qy" də yiyəlik haldır — sual belə ümumi adı soruşanda ikisi də sayılır
  const has = (s, t) => s.some(x => x.t === t);
  const hasWide = (s, t) => s.some(x => x.t === t || (t === "te" && x.t === "qt") || (t === "yi" && x.t === "qy"));
  const QB = BANK.filter(s => nouns(s).every(x => ["ad", "qy", "qt"].includes(x.t)) && new Set(nouns(s).map(x => x.t)).size >= 2 && new Set(nouns(s).map(x => x.w)).size === nouns(s).length);
  const sentLine = s => nouns(s).map(x => x.w + " — " + AD[x.t]).join("; ");

  // ---- sözlər
  // 6-cı sinif, 1-ci hissə, s. 10: ikihecalı sözlərdə ikinci hecadakı qapalı saitin düşməsi
  const G1 = ["isim", "cisim", "fəsil", "nəsil", "şəkil", "ömür", "sinif", "sətir", "səbir", "ətir", "xeyir", "zehin", "eyib"]; // həm mənsubiyyət, həm hal
  const G2 = ["ağıl", "alın", "ağız", "beyin", "burun", "boyun", "çiyin", "qarın", "əyin", "oğul", "ovuc", "könül"]; // yalnız mənsubiyyət
  const NODROP = ["kitab", "dəftər", "qələm", "məktəb", "şagird", "qardaş", "şəhər", "dəniz", "həyət"]; // saiti düşməyən
  const Y_SOZ = ["tale", "mənafe", "mənbə", "mənşə", "mövqe", "nə", "su"]; // 6-cı sinif, 2-ci hissə, s. 79
  const M_C = ["kitab", "dəftər", "qələm", "məktəb", "ev", "göz", "dost", "gül", "bağ", "çay", "yol", "qardaş", "şagird", "müəllim", "həyət", "şəhər", "dəniz"];
  const M_V = ["ana", "baba", "quzu", "bacı", "çanta", "dayı", "nənə", "xala"];
  const XB = ["şagird", "rəssam", "həkim", "dost", "əsgər", "bağban", "mühəndis"]; // samitlə bitən, kökü dəyişməyən
  const MN = ["vaqon", "qələm", "adam", "meydan", "imtahan", "zaman", "üzüm", "salam", "telefon", "stadion"]; // m və n ilə bitən
  const NMN = ["dəftər", "kitab", "körpü", "ağac", "şəhər", "dost", "göz", "yol", "gül", "çay", "bağ", "qapı", "ana", "alma", "küçə", "məktəb", "dərs"];
  // yönlük: [söz, düzgün, tələffüzə görə səhv yazılışlar] (7-ci sinif, 2-ci hissə, s. 21)
  const YO = [
    ["balta", "baltaya", ["baltıya", "baltaa", "baltya"]],
    ["kölgə", "kölgəyə", ["kölgüyə", "kölgəə", "kölgiyə"]],
    ["pəncərə", "pəncərəyə", ["pəncəriyə", "pəncərüyə", "pəncərəə"]],
    ["xəritə", "xəritəyə", ["xəritiyə", "xəritüyə", "xəritəə"]],
    ["meşə", "meşəyə", ["meşiyə", "meşüyə", "meşəə"]],
    ["kitabxana", "kitabxanaya", ["kitabxanıya", "kitabxanaa", "kitabxanıyə"]],
    ["dəstə", "dəstəyə", ["dəstiyə", "dəstüyə", "dəstəə"]],
    ["xala", "xalaya", ["xalıya", "xalaa", "xalya"]],
  ];

  // ---- şəkilçi düzəldən funksiyalar
  // mənsubiyyət (5-ci sinif, 2-ci hissə, s. 21): I təki -ım⁴ (-m), II təki -ın⁴ (-n), III -ı⁴ (-sı⁴), I cəmi -ımız⁴ (-mız⁴), II cəmi -ınız⁴ (-nız⁴)
  const SUFC = (a, p) => ({ I1: a + "m", II1: a + "n", III: a, I2: a + "m" + a + "z", II2: a + "n" + a + "z" })[p]; // samitlə bitən kökdən sonra
  const SUFV = (a, p) => ({ I1: "m", II1: "n", III: "s" + a, I2: "m" + a + "z", II2: "n" + a + "z" })[p]; // saitlə bitən kökdən sonra
  const mensForm = (w, p, a = harm4(w)) => w + (endsV(w) ? SUFV : SUFC)(a, p);
  const yForm = (w, p, a = harm4(w)) => w + "y" + SUFC(a, p);
  const PL = { I1: "I şəxsin təki", II1: "II şəxsin təki", III1: "III şəxsin təki", I2: "I şəxsin cəmi", II2: "II şəxsin cəmi", III2: "III şəxsin cəmi" };
  const PRON = { I1: "mənim", II1: "sənin", III1: "onun", I2: "bizim", II2: "sizin", III2: "onların" };
  const pKey = k => k === "III1" || k === "III2" ? "III" : k;
  const PKEYS = Object.keys(PL);
  const PLIST = PKEYS.map(k => PL[k]);
  // xəbərlik (5-ci sinif, 2-ci hissə, s. 27): I təki -am², II təki -san², III təki -dır⁴, I cəmi -ıq⁴, II cəmi -sınız⁴, III cəmi -dır⁴(lar²)
  function xebForm(w, p, o = {}) {
    const a = o.a || harm4(w), b = o.b || harm2(w), bk = o.bk !== undefined ? o.bk : back(w);
    return w + ({ I1: b + "m", II1: "s" + b + "n", III1: "d" + a + "r", I2: a + (bk ? "q" : "k"), II2: "s" + a + "n" + a + "z", III2: "d" + a + "r" + "l" + b + "r" })[p];
  }
  const XPRON = { I1: "Mən", II1: "Sən", III1: "O", I2: "Biz", II2: "Siz", III2: "Onlar" };
  // hal şəkilçiləri (5-ci sinif, 2-ci hissə, s. 16): sait ilə bitəndə yiyəlik və təsirlikdə n, yönlükdə y bitişdirici samiti
  function halForm(w, t, o = {}) {
    const v = endsV(w), a = o.a || harm4(w), b = o.b || harm2(w);
    if (t === "yi") return w + (v && !o.nobuf ? "n" : "") + a + "n";
    if (t === "yo") return w + (v && !o.nobuf ? "y" : "") + b;
    if (t === "te") return w + (v && !o.nobuf ? "n" : "") + a;
    if (t === "ye") return w + "d" + b;
    return w + "d" + b + "n";
  }
  const dan = w => halForm(w, "ci"), dpron = w => w + "n" + harm2(w) + "n";
  // qapalı saitin düşməsi (6-cı sinif, 1-ci hissə, s. 10); g = 1: həm mənsubiyyət, həm hal; g = 2: yalnız mənsubiyyət
  function dropForms(w, g) {
    const d = dropV(w), a = harm4(d), b = harm2(d), a0 = harm4(w), b0 = harm2(w);
    const mens = { I1: d + a + "m", II1: d + a + "n", III: d + a, I2: d + a + "m" + a + "z", II2: d + a + "n" + a + "z" };
    const hal = g === 1 ? { yi: d + a + "n", yo: d + b, te: d + a } : { yi: w + a0 + "n", yo: w + b0, te: w + a0 };
    hal.ye = w + "d" + b0; hal.ci = w + "d" + b0 + "n";
    return { mens, hal };
  }
  const ALT = { yi: ["yiyəlik", "-ın"], yo: ["yönlük", ""], te: ["təsirlik", ""] };
  const HAL_AD = { yi: "yiyəlik", yo: "yönlük", te: "təsirlik", ye: "yerlik", ci: "çıxışlıq" };

  // ---- dərslik fikirləri
  const FIKIR_DUZ = [
    "İsmin adlıq, qeyri-müəyyən yiyəlik və qeyri-müəyyən təsirlik halının xüsusi şəkilçisi yoxdur.",
    "Adlıq halda işlənən söz cümlədə, əsasən, subyekti — hərəkətin icraçısını bildirir.",
    "Qeyri-müəyyən təsirlik halda işlənən söz obyekt bildirir.",
    "Qeyri-müəyyən yiyəlik hal ismi birləşmənin birinci tərəfi olur.",
    "Asılı tərəfi yiyəlik halda olan ismi birləşmələrin əsas tərəfi mənsubiyyət şəkilçisi qəbul edir.",
    "Birinci tərəfi şəkilçili yiyəlik halda olan birləşmə müəyyənlik, konkretlik bildirir.",
    "Birinci tərəfi şəkilçisiz yiyəlik halda olan birləşmə ümumilik, qeyri-müəyyənlik bildirir.",
    "Qeyri-müəyyənlik bildirən təsirlik hallı söz təsirlik şəkilçisi qəbul etmir.",
    "A və ə saiti ilə bitən çoxhecalı sözlərin yönlük halda düzgün yazılışını müəyyən etmək üçün onları adlıq halda işlətmək lazımdır.",
    "M və n samitləri ilə bitən sözlərə artırılan -dan² çıxışlıq hal şəkilçisi [-nan²] kimi tələffüz olunur.",
    "Tale, mənafe, mənbə, mənşə, mövqe, nə, su sözlərinə mənsubiyyət şəkilçisi artırdıqda kök ilə şəkilçi arasına y bitişdirici samiti əlavə edilir.",
    "Bəzi ikihecalı sözlərə saitlə başlayan hal və mənsubiyyət şəkilçisi qoşulduqda ikinci hecadakı qapalı sait düşür.",
    "Mənsubiyyət şəkilçiləri əşyanın hansı şəxsə mənsub olduğunu bildirir.",
    "İsimlər cümlədə xəbər vəzifəsində olanda şəxs şəkilçiləri qəbul edir.",
    "Xəbərlik şəkilçisi isimlərin xəbər vəzifəsində qəbul etdiyi şəxs şəkilçisidir.",
    "Yiyəlik halda -ın⁴, yönlük halda -a², təsirlik halda -ı⁴, yerlik halda -da², çıxışlıq halda -dan² şəkilçisi işlənir.",
  ];
  const FIKIR_SEHV = [
    "İsmin adlıq halının -ın⁴ şəkilçisi var.",
    "Qeyri-müəyyən təsirlik halda işlənən söz hərəkəti icra edən subyekti bildirir.",
    "Qeyri-müəyyən yiyəlik hal ismi birləşmənin əsas tərəfi olur.",
    "Asılı tərəfi yiyəlik halda olan ismi birləşmələrin əsas tərəfi mənsubiyyət şəkilçisi qəbul etmir.",
    "Çıxışlıq hal şəkilçisi bütün sözlərdə yazıldığı kimi tələffüz olunur.",
    "A və ə saiti ilə bitən sözlərin yönlük halı tələffüzə görə yazılır: baltıya, kölgüyə.",
    "Tale, mənbə, su sözlərinə mənsubiyyət şəkilçisi artırdıqda y bitişdirici samiti əlavə edilmir.",
    "Bütün ikihecalı sözlərdə saitlə başlayan şəkilçi qoşulduqda ikinci hecadakı sait düşür.",
    "Mənsubiyyət şəkilçiləri əşyanın hansı halda olduğunu bildirir.",
    "Xəbərlik şəkilçisi yalnız feilə qoşulur.",
    "Yönlük halın şəkilçisi -dan²-dir.",
    "Yerlik halın şəkilçisi -ın⁴-dir.",
    "Qeyri-müəyyən yiyəlik halda işlənən söz təsirlik şəkilçisi qəbul edir.",
    "Hal şəkilçisi qəbul etməyən isimlər yalnız yönlük və yerlik halda olur.",
  ];
  // təsirlik halda olan isimləşmiş sifətlər (qısa xatırlatma; isimləşmə 5-ci mövzuda): [cümlə, sifət]
  const SIF_TE = [
    ["Biz yaxşını pisdən ayırmalıyıq.", "yaxşını"],
    ["Müəllim sinifdə ən çalışqanı mükafatlandırdı.", "çalışqanı"],
    ["Güclü zəifi qorumalıdır.", "zəifi"],
    ["Ata qocanı həkimə apardı.", "qocanı"],
  ];

  // ======== oyun səviyyələri ========
  const levels = [
    // 1. halı tanı
    { id: "hal", ad: "Halı tanı", izah: "Cümlədə fərqləndirilmiş isim hansı haldadır? Şəkilçiyə bax: -ın⁴ yiyəlik, -a² yönlük, -ı⁴ təsirlik, -da² yerlik, -dan² çıxışlıq. Şəkilçisiz söz subyekt olanda adlıq haldadır.",
      gen() {
        const c = []; BANK.forEach(s => s.forEach((x, i) => { if (["ad", "yi", "yo", "te", "ye", "ci"].includes(x.t)) c.push([s, i]); }));
        const [s, i] = pick(c), t = s[i].t;
        return { text: h("span", {}, "Fərqləndirilmiş söz ismin hansı halındadır?", lineS(...markS(s, [i]))), choices: OPT6, correct: OPT6.indexOf(AD[t]), show: AD[t],
          solution: "“" + s[i].w + "” — " + AD[t] + ": " + WHY[t] + "." };
      } },
    // 2. halı olan sözə toxun
    { id: "halsec", ad: "Halı olan sözə toxun", izah: "Cümlədə göstərilən halda olan bütün sözlərə toxun.",
      gen() {
        const t = pick(["yi", "yo", "te", "ye", "ci", "ad", "qy", "qt"]);
        const s = pick(BANK.filter(x => has(x, t) && !(t === "ad" && x.some(y => /^(Biz|Mən|O|Onlar|Sən|Siz)$/.test(y.w))) && !(t === "yi" && has(x, "qy")) && !(t === "te" && has(x, "qt"))));
        const duz = idxOf(s, t);
        return { text: "Cümlədə " + AD[t] + " halda olan bütün sözlərə toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
          solution: sentLine(s) + ". " + cap(AD[t]) + " halda: " + duz.map(i => s[i].w).join(", ") + " (" + WHY[t] + ")." };
      } },
    // 3. adlıq, qeyri-müəyyən yiyəlik, qeyri-müəyyən təsirlik
    { id: "qeyri", ad: "Adlıq, qeyri-müəyyən yiyəlik və təsirlik", izah: "Bu üç halın xüsusi şəkilçisi yoxdur. Rola bax: subyekt — adlıq, obyekt — qeyri-müəyyən təsirlik, ismi birləşmənin birinci tərəfi — qeyri-müəyyən yiyəlik.",
      gen() {
        const s = pick(QB), ns = nouns(s), here = [...new Set(ns.map(x => x.t))];
        const ord = ["ad", "qy", "qt"].filter(t => here.includes(t));
        const extra = sample(["yo", "ye", "ci"], 1 + R(2));
        const tags = [...ord, ...extra], qrup = tags.map(t => AD[t]);
        return { text: "«" + plain(s) + "» — isimləri hallarına görə qruplara ayır.", bol: { soz: ns.map(x => x.w), qrup, duz: ns.map(x => tags.indexOf(x.t)) },
          show: ns.map(x => x.w + " — " + AD[x.t]).join("; "),
          solution: ns.map(x => "“" + x.w + "” — " + AD[x.t] + ": " + WHY[x.t]).join("; ") + "." };
      } },
    // 4. hal şəkilçisinin yazılışı və tələffüzü
    { id: "yaz", ad: "Hal şəkilçisinin yazılışı və tələffüzü", izah: "Sait ilə bitən sözdə yiyəlik və təsirlik halda n, yönlük halda y əlavə olunur. A və ə ilə bitən sözlərin yönlük halını adlıq halına görə yaz. M və n ilə bitən sözlərdə -dan² [-nan²] kimi tələffüz olunur.",
      gen() {
        const k = R(100);
        if (k < 35) {
          const w = pick(["küçə", "qapı", "ana", "alma", "xəritə", "dəftər", "kitab", "şəhər", "ev", "göz", "dost", "bağ", "yol", "çay", "bacı", "meşə"]);
          const t = pick(["yi", "yo", "te", "ye", "ci"]), right = halForm(w, t);
          const a0 = harm4(w), alt4 = shuffle([..."ıiuü"].filter(x => x !== a0)), b0 = harm2(w), alt2 = b0 === "a" ? "ə" : "a";
          const wr = [];
          if (endsV(w) && t !== "ye" && t !== "ci") wr.push(halForm(w, t, { nobuf: true }));
          wr.push(halForm(w, t, t === "yo" ? { b: alt2 } : t === "ye" || t === "ci" ? { b: alt2 } : { a: alt4[0] }));
          if (t === "yi" || t === "te") wr.push(halForm(w, t, { a: alt4[1] }));
          if (t === "yo" || t === "ye" || t === "ci") wr.push(w + (endsV(w) ? "n" : "y") + (t === "yo" ? b0 : t === "ye" ? "d" + b0 : "d" + b0 + "n"));
          const opts = [right, ...new Set(wr.filter(x => x !== right))];
          if (opts.length < 3) return this.gen();
          const ch = shuffle(opts);
          const buf = endsV(w) && (t === "yi" || t === "te") ? " Söz sait ilə bitir — yiyəlik və təsirlik halda n bitişdirici samiti əlavə olunur." : endsV(w) && t === "yo" ? " Söz sait ilə bitir — yönlük halda y bitişdirici samiti əlavə olunur." : "";
          return { text: "«" + w + "» sözü " + HAL_AD[t] + " halda necə yazılır?", choices: ch, correct: ch.indexOf(right), show: right,
            solution: w + " + " + HAL_AD[t] + " hal → " + right + "." + buf };
        }
        if (k < 60) {
          const [w, right, wr] = pick(YO), ch = shuffle([right, ...wr]);
          return { text: "«" + w + "» sözü yönlük halda düzgün hansı cür yazılır?", choices: ch, correct: ch.indexOf(right), show: right,
            solution: "Adlıq halda “" + w + "” " + (w.endsWith("a") ? "a" : "ə") + " ilə bitir — yönlük halda " + right + " yazılır; tələffüzə görə yazmaq olmaz." };
        }
        if (k < 85) {
          const m = pick(MN), four = sample(NMN, 3), ch = shuffle([dan(m), ...four.map(dan)]);
          return { text: "Hansı sözdə çıxışlıq hal şəkilçisi yazılışından fərqli tələffüz olunur?", choices: ch, correct: ch.indexOf(dan(m)), show: dan(m),
            solution: "“" + m + "” " + (m.endsWith("m") ? "m" : "n") + " ilə bitir — " + dan(m) + " [" + dpron(m) + "] kimi tələffüz olunur. Qalan sözlər başqa samitlə və ya saitlə bitir — yazıldığı kimi deyilir." };
        }
        const m = pick(MN), r = dpron(m), wr = [dan(m), m + "t" + harm2(m) + "n", m + "l" + harm2(m) + "n", m + harm2(m) + "n"], ch = shuffle([r, ...wr]);
        return { text: "«" + dan(m) + "» sözü necə tələffüz olunur?", choices: ch, correct: ch.indexOf(r), show: r,
          solution: "M və n ilə bitən sözlərə artırılan -dan² çıxışlıq hal şəkilçisi [-nan²] kimi tələffüz olunur: " + dan(m) + " [" + r + "]." };
      } },
    // 5. mənsubiyyət
    { id: "mens", ad: "Mənsubiyyət şəkilçiləri", izah: "Mənsubiyyət şəkilçisi əşyanın hansı şəxsə mənsub olduğunu bildirir. Tale, mənafe, mənbə, mənşə, mövqe, nə, su sözlərində kök ilə şəkilçi arasına y əlavə olunur.",
      gen() {
        const k = R(100);
        if (k < 40) {
          const pk = pick(PKEYS), w = pick([...M_C, ...M_V]), f = mensForm(w, pKey(pk));
          return { text: h("span", {}, "Fərqləndirilmiş sözdəki mənsubiyyət şəkilçisi hansı şəxsə aiddir?", lineS(PRON[pk] + " ", h("u", {}, h("b", {}, f)))), choices: PLIST, correct: PKEYS.indexOf(pk), show: PL[pk],
            solution: "“" + f + "” — " + w + " + " + f.slice(w.length) + " şəkilçisi; “" + PRON[pk] + "” sözü ilə uzlaşır: " + PL[pk] + "." + (pKey(pk) === "III" ? " III şəxsin təkində və cəmində şəkilçi eynidir; təki, yoxsa cəmi olduğunu əvəzlik göstərir." : "") };
        }
        if (k < 75) {
          const w = pick(Y_SOZ), pk = pick(PKEYS), p = pKey(pk), right = yForm(w, p), a = harm4(w), alt = shuffle([..."ıiuü"].filter(x => x !== a));
          const set = [...new Set([mensForm(w, p), w + SUFC(a, p), yForm(w, p, alt[0]), yForm(w, p, alt[1])].filter(x => x !== right))];
          const ch = shuffle([right, ...set.slice(0, 3)]);
          return { text: "«" + PRON[pk] + " ...» — " + w + " sözünə mənsubiyyət şəkilçisini düzgün artır.", choices: ch, correct: ch.indexOf(right), show: right,
            solution: "“" + w + "” sözünə mənsubiyyət şəkilçisi artırdıqda kök ilə şəkilçi arasına y əlavə olunur: " + w + "-y-" + right.slice(w.length + 1) + " → " + right + "." };
        }
        const w = pick([...M_C, ...M_V]), pk = pick(["I1", "II1", "I2", "II2"]), right = mensForm(w, pk), a = harm4(w), alt = shuffle([..."ıiuü"].filter(x => x !== a));
        const swap = (endsV(w) ? w + SUFC(a, pk) : w + SUFV(a, pk));
        const set = [...new Set([swap, mensForm(w, pk, alt[0]), mensForm(w, pk, alt[1]), mensForm(w, pk, alt[2])].filter(x => x !== right))];
        const ch = shuffle([right, ...set.slice(0, 3)]);
        return { text: "«" + PRON[pk] + " ...» — " + w + " sözünə mənsubiyyət şəkilçisini düzgün artır.", choices: ch, correct: ch.indexOf(right), show: right,
          solution: "“" + w + "” " + (endsV(w) ? "sait" : "samit") + " ilə bitir; " + PL[pk] + " üçün şəkilçi " + right.slice(w.length) + " (ahəng qanununa uyğun): " + right + "." };
      } },
    // 6. qapalı saitin düşməsi
    { id: "dus", ad: "Qapalı saitin düşməsi", izah: "Bəzi ikihecalı sözlərə saitlə başlayan şəkilçi qoşulduqda ikinci hecadakı qapalı sait düşür. Bir qrup sözdə həm mənsubiyyət, həm hal şəkilçisində, başqa qrupda yalnız mənsubiyyət şəkilçisində.",
      gen() {
        if (R(2)) {
          const groups = ["həm mənsubiyyət, həm hal şəkilçisi qoşulduqda düşür", "yalnız mənsubiyyət şəkilçisi qoşulduqda düşür", "düşmür"];
          const pools = [G1, G2, NODROP], two = sample([0, 1, 2], 2), items = [];
          sample(pools[two[0]], 3).forEach(w => items.push([w, two[0]])); sample(pools[two[1]], 2).forEach(w => items.push([w, two[1]]));
          const it = shuffle(items);
          return { text: "Sözləri qruplara ayır: ikinci hecadakı sait nə vaxt düşür?", bol: { soz: it.map(x => x[0]), qrup: groups, duz: it.map(x => x[1]) },
            show: it.map(x => x[0] + " — " + groups[x[1]]).join("; "),
            solution: "Həm mənsubiyyət, həm hal: " + G1.slice(0, 5).join(", ") + " və s.; yalnız mənsubiyyət: " + G2.slice(0, 5).join(", ") + " və s. Kitab, dəftər kimi sözlərdə sait düşmür." };
        }
        const g = pick([1, 2]), w = pick(g === 1 ? G1 : G2), t = pick(["yi", "yo", "te"]), F = dropForms(w, g), right = F.hal[t];
        const dropped = dropForms(w, 1).hal[t], full = dropForms(w, 2).hal[t];
        const wrongRule = g === 1 ? full : dropped;
        const others = shuffle(["yi", "yo", "te", "ye", "ci"].filter(x => x !== t)).map(x => F.hal[x]);
        const ch = shuffle([right, wrongRule, ...others.slice(0, 2)]);
        return { text: "«" + w + "» sözünün " + HAL_AD[t] + " halı hansıdır?", choices: ch, correct: ch.indexOf(right), show: right,
          solution: g === 1 ? "“" + w + "” — həm mənsubiyyət, həm hal şəkilçisi qoşulduqda sait düşür: " + right + "." : "“" + w + "” — yalnız mənsubiyyət şəkilçisi qoşulduqda sait düşür (onun " + F.mens.III + "); hal şəkilçisində düşmür: " + right + "." };
      } },
    // 7. xəbərlik
    { id: "xeb", ad: "Xəbərlik şəkilçiləri", izah: "Xəbər vəzifəsində olan isim şəxs şəkilçisi qəbul edir: -am², -san², -dır⁴, -ıq⁴, -sınız⁴, -dır⁴(lar²). Bu, mənsubiyyət şəkilçisi deyil.",
      gen() {
        const k = R(100);
        if (k < 40) {
          const pk = pick(PKEYS), w = pick(XB), f = xebForm(w, pk);
          return { text: h("span", {}, "Fərqləndirilmiş sözdəki xəbərlik şəkilçisi hansı şəxsə aiddir?", lineS(XPRON[pk] + " ", h("u", {}, h("b", {}, f)), ".")), choices: PLIST, correct: PKEYS.indexOf(pk), show: PL[pk],
            solution: "“" + f + "” — " + w + " + " + f.slice(w.length) + " xəbərlik şəkilçisi; " + XPRON[pk].toLowerCase() + " sözü ilə uyğundur: " + PL[pk] + "." };
        }
        if (k < 70) {
          const w = pick(XB), pk = pick(PKEYS), right = xebForm(w, pk), alt = shuffle([..."ıiuü"].filter(x => x !== harm4(w))), fb = harm2(w) === "a" ? "ə" : "a";
          const others = shuffle(PKEYS.filter(x => x !== pk)).map(x => xebForm(w, x));
          const set = [...new Set([xebForm(w, pk, { a: alt[0], b: fb, bk: !back(w) }), xebForm(w, pk, { b: fb, bk: !back(w) }), xebForm(w, pk, { a: alt[1] }), ...others].filter(x => x !== right))];
          const ch = shuffle([right, ...set.slice(0, 3)]);
          return { text: "«" + XPRON[pk] + " " + w + "...» — cümlədə xəbər olan isimə düzgün şəxs şəkilçisini artır.", choices: ch, correct: ch.indexOf(right), show: right,
            solution: XPRON[pk] + " " + right + ": " + PL[pk] + " üçün xəbərlik şəkilçisi " + right.slice(w.length) + "." };
        }
        const gr = ["xəbərlik şəkilçisi", "mənsubiyyət şəkilçisi", "hal şəkilçisi"];
        const mk = { x: () => [xebForm(pick(XB), pick(PKEYS)), 0], m: () => [mensForm(pick(M_C.filter(x => !XB.includes(x))), pick(["I1", "I2", "II2"])), 1], h: () => [halForm(pick(M_C), pick(["yo", "ye", "ci"])), 2] };
        const kinds = sample(["x", "m", "h"], 2), ct = R(2) ? [3, 2] : [2, 3], seen = new Set(), items = [];
        kinds.forEach((kd, j) => { let c = 0; while (c < ct[j]) { const it = mk[kd](); if (!seen.has(it[0])) { seen.add(it[0]); items.push(it); c++; } } });
        const it = shuffle(items);
        return { text: "Sözləri şəkilçisinin növünə görə qruplara ayır.", bol: { soz: it.map(x => x[0]), qrup: gr, duz: it.map(x => x[1]) }, show: it.map(x => x[0] + " — " + gr[x[1]]).join("; "),
          solution: "Xəbərlik: -am², -san², -dır⁴, -ıq⁴, -sınız⁴, -dır⁴(lar²). Mənsubiyyət: -ım⁴, -ın⁴, -ı⁴, -ımız⁴, -ınız⁴. Hal: -a², -da², -dan², -ın⁴, -ı⁴." };
      } },
    // 8. səhvi tap
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird üç sözü təhlil edib. Biri səhvdir — hansı?",
      gen() {
        if (R(3)) {
          const CONF = { ad: "qt", qt: "ad", qy: "qt", yi: "te", te: "yi", yo: "ye", ye: "ci", ci: "ye" };
          const s = pick(BANK.filter(x => nouns(x).length >= 3)), ns = sample(nouns(s), 3).sort((a, b) => s.indexOf(a) - s.indexOf(b)), k = R(3);
          const lab = ns.map((w, j) => j === k ? CONF[w.t] : w.t), ord = ["1-ci", "2-ci", "3-cü"];
          return { text: "«" + plain(s) + "» — şagirdin təhlili: " + ns.map((w, j) => (j + 1) + ") " + w.w + " — " + AD[lab[j]]).join("; ") + ". Hansı bənddə səhv var?",
            choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
            solution: "“" + ns[k].w + "” " + AD[lab[k]] + " deyil, " + AD[ns[k].t] + " haldadır: " + WHY[ns[k].t] + ". Digər iki bənd düzdür." };
        }
        const ps = sample(PKEYS, 3), ws = sample([...M_C, ...M_V], 3), k = R(3), ord = ["1-ci", "2-ci", "3-cü"];
        const lab = ps.map((p, j) => j === k ? pick(PKEYS.filter(x => x !== p && !(pKey(x) === "III" && pKey(p) === "III"))) : p);
        const forms = ps.map((p, j) => PRON[p] + " " + mensForm(ws[j], pKey(p)));
        return { text: "Şagirdin təhlili (mənsubiyyət şəkilçisi hansı şəxsə aiddir): " + forms.map((f, j) => (j + 1) + ") " + f + " — " + PL[lab[j]]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "“" + forms[k] + "” — " + PL[ps[k]] + " (“" + PRON[ps[k]] + "” ilə uyğundur), " + PL[lab[k]] + " deyil. Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. çıxışlıq hal şəkilçisinin tələffüzü (BSİ-2, 27)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const m = pick(MN), four = sample(NMN, 4);
      return AEq("Hansı sözdə çıxışlıq hal şəkilçisi yazılışından fərqli tələffüz olunur?", dan(m), four.map(dan),
        "“" + m + "” " + (m.endsWith("m") ? "m" : "n") + " ilə bitir: " + dan(m) + " [" + dpron(m) + "]. Qalan sözlər başqa samitlə və ya saitlə bitir — çıxışlıq hal şəkilçisi yazıldığı kimi tələffüz olunur.");
    }) },
    // 2. halını dəqiq müəyyən etmək mümkün olmayan söz (BSİ-2, 30)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const w = pick(G1), F = dropForms(w, 1), right = pick([F.mens.III, F.hal.yi]);
      const unamb = [...G2.map(x => dropForms(x, 2).hal.yi), ...sample(NMN, 6).flatMap(x => [halForm(x, "yo"), halForm(x, "ye")]), ...sample(G1, 4).map(x => dropForms(x, 1).hal.ye), ...sample(MN, 3).map(dan)];
      const four = sample(unamb, 4);
      return AEq("Hansı sözün halını dəqiq müəyyən etmək mümkün deyil?", right, four,
        right === F.mens.III ? "“" + right + "”: “" + w + "” sözündə həm mənsubiyyət, həm hal şəkilçisi qoşulduqda sait düşür. Ona görə “" + right + "” həm mənsubiyyətli adlıq (onun " + right + "), həm də təsirlik hal ola bilər. Qalan sözlərdə hal birmənalıdır: yönlük, yerlik, çıxışlıq şəkilçisi və ya yalnız mənsubiyyətdə düşən saitli söz üzrə yiyəlik hal."
          : "“" + right + "”: “" + w + "” sözündə həm mənsubiyyət, həm hal şəkilçisi qoşulduqda sait düşür. Ona görə “" + right + "” həm yiyəlik hal, həm II şəxsin təkində mənsubiyyətli söz (sənin " + right + ") ola bilər. Qalan sözlərdə hal birmənalıdır.");
    }) },
    // 3. təsirlik hallı sifət (BSİ-2, 32)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [s, w] = pick(SIF_TE), four = sample(BANK.filter(x => has(x, "te") && !has(x, "qt")), 4).map(plain);
      return AEq("Təsirlik hallı sifətin işləndiyi cümləni müəyyən edin.", s, four,
        "“" + w + "” — sifətdir, təsirlik hal şəkilçisi qəbul edib (isimləşib). Qalan cümlələrdə təsirlik halda olan sözlər isimdir.");
    }) },
    // 4. y bitişdirici samiti (tale, mənafe, mənbə, mənşə, mövqe, su)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const pool = Y_SOZ.filter(x => x !== "nə"), pk = pick(PKEYS), p = pKey(pk), pr = PRON[pk] + " ";
      if (R(2)) {
        const ws = sample(pool, 5);
        return AEq("Mənsubiyyət şəkilçisi ilə yazılışı düzgün olan sözü müəyyən edin.", pr + yForm(ws[0], p), ws.slice(1).map(w => pr + mensForm(w, p)),
          "Tale, mənafe, mənbə, mənşə, mövqe, su sözlərinə mənsubiyyət şəkilçisi artırdıqda kök ilə şəkilçi arasına y əlavə olunur: " + pr + yForm(ws[0], p) + ". Səhv variantlarda y yoxdur: " + ws.slice(1).map(w => pr + mensForm(w, p)).join(", ") + ".");
      }
      const ws = sample(pool, 5);
      return AEq("Mənsubiyyət şəkilçisi ilə yazılışı səhv olan sözü müəyyən edin.", pr + mensForm(ws[0], p), ws.slice(1).map(w => pr + yForm(w, p)),
        "“" + ws[0] + "” sözünə mənsubiyyət şəkilçisi y bitişdirici samiti ilə artırılır: " + pr + yForm(ws[0], p) + ". Səhv: " + pr + mensForm(ws[0], p) + ". Qalan dörd söz düzgündür.");
    }) },
    // 5. qapalı saitin düşməsi
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (R(2)) {
        const r = pick(G2), four = sample(G1, 4), F = dropForms(r, 2);
        return AEq("İkinci hecadakı qapalı sait yalnız mənsubiyyət şəkilçisi qoşulduqda düşən sözü müəyyən edin.", r, four,
          "“" + r + "”: onun " + F.mens.III + " (sait düşür), amma " + F.hal.yi + " (yiyəlik halda düşmür). Qalan sözlərdə həm mənsubiyyət, həm hal şəkilçisi qoşulduqda sait düşür: " + four.map(w => w + " — " + dropForms(w, 1).hal.yi).join(", ") + ".");
      }
      const r = pick(G1), four = sample(G2, 4), F = dropForms(r, 1);
      return AEq("İkinci hecadakı qapalı sait həm mənsubiyyət, həm də hal şəkilçisi qoşulduqda düşən sözü müəyyən edin.", r, four,
        "“" + r + "”: onun " + F.mens.III + ", " + F.hal.yi + " — hər iki halda sait düşür. Qalan sözlərdə sait yalnız mənsubiyyət şəkilçisi qoşulduqda düşür: " + four.map(w => w + " — onun " + dropForms(w, 2).mens.III + ", " + dropForms(w, 2).hal.yi).join("; ") + ".");
    }) },
    // 6. cümlələrdə hal
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["qt", "qy", "yo", "ye", "ci", "te", "yi"]);
      const yes = BANK.filter(x => hasWide(x, t) && (t === "te" ? has(x, "te") : t === "yi" ? has(x, "yi") : true)), no = BANK.filter(x => !hasWide(x, t));
      const nm = t === "qt" || t === "qy" ? AD[t] : AD[t];
      if (R(2)) {
        const r = pick(t === "te" || t === "yi" ? yes : BANK.filter(x => has(x, t))), four = sample(no, 4);
        return AEq("Cümlələrin hansında " + nm + " halda söz işlənib?", plain(r), four.map(plain),
          "“" + plain(r) + "” — " + sentLine(r) + ". Digər cümlələrdə " + nm + " halda söz yoxdur: " + four.map(x => sentLine(x)).join(" | ") + ".");
      }
      const r = pick(no), four = sample(t === "te" || t === "yi" ? yes : BANK.filter(x => has(x, t)), 4);
      return AEq("Cümlələrin birində " + nm + " halda söz yoxdur:", plain(r), four.map(plain),
        "“" + plain(r) + "” — " + sentLine(r) + ": " + nm + " halda söz yoxdur. Digər cümlələrdə var: " + four.map(x => sentLine(x)).join(" | ") + ".");
    }) },
    // 7. nömrə kombinasiyası: fərqləndirilmiş sözün halı
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["qy", "qt", "ad", "yo", "ci", "ye"]), pos = [], neg = [];
      BANK.forEach(s => s.forEach((x, i) => { if (x.t === t) pos.push([s, i]); else if (x.t) neg.push([s, i]); }));
      const k = 1 + R(3), P = sample(pos, k), N = sample(neg, 5 - k), five = shuffle([...P, ...N]);
      if (new Set(five.map(x => plain(x[0]))).size < 5) return null;
      const right = five.map((x, i) => x[1] !== undefined && x[0][x[1]].t === t ? i + 1 : 0).filter(Boolean);
      const o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz " + AD[t] + " haldadır?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", ...markS(x[0], [x[1]]))));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((x, i) => (i + 1) + ") " + x[0][x[1]].w + " — " + AD[x[0][x[1]].t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 8. xəbərlik / mənsubiyyət: biri fərqlidir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const mensW = () => { const w = pick(M_C.filter(x => !XB.includes(x))), p = pick(["I1", "I2", "II2"]); return mensForm(w, p); };
      const xebW = () => xebForm(pick(XB), pick(PKEYS));
      const mt = R(2) === 0, odd = mt ? mensW() : xebW(), four = Array.from({ length: 4 }, mt ? xebW : mensW);
      return AEq("Şəkilçisinin növünə görə biri fərqlidir:", odd, four,
        mt ? "“" + odd + "” — mənsubiyyət şəkilçisi (əşyanın şəxsə mənsubluğu). Qalan sözlər xəbərlik şəkilçisi qəbul edib: " + four.join(", ") + "." : "“" + odd + "” — xəbərlik şəkilçisi (isim xəbər vəzifəsində). Qalan sözlər mənsubiyyət şəkilçisi qəbul edib: " + four.join(", ") + ".");
    }) },
    // 9. nömrə kombinasiyası: xəbərlik şəkilçisi
    { tip: "qapali", gen: () => Oyun.again(() => {
      const pool = [];
      for (let i = 0; i < 3; i++) pool.push([xebForm(pick(XB), pick(PKEYS)), "x"]);
      for (let i = 0; i < 3; i++) pool.push([mensForm(pick(M_C.filter(x => !XB.includes(x))), pick(["I1", "I2", "II2"])), "m"]);
      for (let i = 0; i < 2; i++) pool.push([halForm(pick(M_C), pick(["yo", "ye", "ci"])), "h"]);
      const k = 1 + R(3), xs = pool.filter(x => x[1] === "x"), os = pool.filter(x => x[1] !== "x");
      const five = shuffle([...sample(xs, k), ...sample(os, 5 - k)]);
      if (new Set(five.map(x => x[0])).size < 5) return null;
      const right = five.map((x, i) => x[1] === "x" ? i + 1 : 0).filter(Boolean), o = comboChoices(right); if (!o) return null;
      const kind = { x: "xəbərlik", m: "mənsubiyyət", h: "hal" };
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansılarında xəbərlik şəkilçisi var?", lineS(five.map((x, i) => x[0] + SUP[i]).join(", "))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x[0] + " — " + kind[x[1]] + " şəkilçisi").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 10. dərslik qaydaları: doğru / səhv fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (R(2)) { const bad = pick(FIKIR_SEHV); return AEq("İsmin halı, mənsubiyyəti və xəbərliyi ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("İsmin halı, mənsubiyyəti və xəbərliyi ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== müstəqil yoxlama siyahısı (Codex cavabsız həll edəcək) ========
  const HALL_LIST = "(adlıq, yiyəlik, qeyri-müəyyən yiyəlik, yönlük, təsirlik, qeyri-müəyyən təsirlik, yerlik, çıxışlıq)";
  const Y = [];
  let n = 0; const add = (sual, cavab) => Y.push({ id: "q" + (++n), sual, cavab });
  BANK.forEach(s => nouns(s).forEach((x, k, arr) => { const same = arr.filter(y => y.w === x.w).length > 1, nth = arr.slice(0, k + 1).filter(y => y.w === x.w).length;
    add("«" + plain(s) + "» cümləsində «" + x.w + "» sözü" + (same ? " (cümlədə " + nth + "-ci dəfə işlənən)" : "") + " ismin hansı halındadır? " + HALL_LIST, AD[x.t]); }));
  const PERS = "(I şəxsin təki, II şəxsin təki, III şəxsin təki, I şəxsin cəmi, II şəxsin cəmi, III şəxsin cəmi)";
  [...M_C, ...M_V].forEach((w, i) => { const pk = PKEYS[i % 6]; add("«" + PRON[pk] + "» sözündən sonra gələn «" + w + "» sözünə mənsubiyyət şəkilçisi artırın (" + PL[pk] + "). Mənsub olunan əşya təkdir. Düzgün forma hansıdır?", mensForm(w, pKey(pk))); });
  Y_SOZ.forEach((w, i) => { const pk = PKEYS[i % 6], pk2 = PKEYS[(i + 3) % 6]; [pk, pk2].forEach(k => add("«" + PRON[k] + "» sözündən sonra gələn «" + w + "» sözünə mənsubiyyət şəkilçisi artırın (" + PL[k] + "). Mənsub olunan əşya təkdir. Düzgün forma hansıdır?", yForm(w, pKey(k)))); });
  [...M_C.slice(0, 6), ...M_V.slice(0, 4)].forEach((w, i) => { const pk = PKEYS[(i * 2) % 6]; add("«" + PRON[pk] + " " + mensForm(w, pKey(pk)) + "» ifadəsində «" + mensForm(w, pKey(pk)) + "» sözündəki mənsubiyyət şəkilçisi hansı şəxsə aiddir? " + PERS, PL[pk]); });
  XB.forEach((w, i) => { [PKEYS[i % 6], PKEYS[(i + 2) % 6], PKEYS[(i + 4) % 6]].forEach(pk => add("«" + XPRON[pk] + "» sözündən sonra gələn «" + w + "» isimi cümlədə xəbər vəzifəsindədir. Ona (" + PL[pk] + ") xəbərlik şəkilçisi artırın. Düzgün forma hansıdır?", xebForm(w, pk))); });
  XB.forEach((w, i) => { const pk = PKEYS[(i * 5) % 6]; add("«" + XPRON[pk] + " " + xebForm(w, pk) + ".» cümləsində xəbərlik şəkilçisi hansı şəxsə aiddir? " + PERS, PL[pk]); });
  [...G1, ...G2].forEach((w, i) => {
    const g = G1.includes(w) ? 1 : 2, F = dropForms(w, g), t = ["yi", "yo", "te"][i % 3];
    add("«" + w + "» sözünün " + HAL_AD[t] + " halını yazın (dərslikdə ikihecalı bəzi sözlərdə qapalı sait düşür).", F.hal[t]);
    add("«onun ...» — «" + w + "» sözünə III şəxsin təkinin mənsubiyyət şəkilçisini artırın. Düzgün forma hansıdır?", F.mens.III);
    add("«" + w + "» sözünün yerlik halını yazın.", F.hal.ye);
  });
  G1.forEach(w => { const F = dropForms(w, 1); add("«" + F.mens.III + "» sözü kontekstdən kənarda yazılıb. Bu söz həm III şəxsin mənsubiyyət şəkilçisi qəbul etmiş adlıq, həm də təsirlik hal ola bilərmi? (bəli/xeyr)", "bəli"); });
  G2.forEach(w => { const F = dropForms(w, 2); add("«" + F.hal.yi + "» sözü kontekstdən kənarda yazılıb. Bu söz hansı haldadır, yoxsa mənsubiyyətli adlıqdır? (yiyəlik, mənsubiyyətli adlıq)", "yiyəlik"); });
  YO.forEach(([w, right, wr]) => { add("«" + w + "» sözünün yönlük halının düzgün yazılışı hansıdır? " + shuffle([right, ...wr]).join(", "), right); });
  NODROP.forEach(w => add("«" + w + "» sözünə saitlə başlayan şəkilçi (məsələn, III şəxsin mənsubiyyət şəkilçisi) qoşulduqda ikinci hecadakı sait düşürmü? (düşür/düşmür)", "düşmür"));
  ["küçə", "qapı", "ana", "alma", "xəritə", "dəftər", "kitab", "şəhər", "ev", "göz", "dost", "bağ", "yol", "çay", "bacı", "meşə"].forEach((w, i) => [["yi", "yo", "te", "ye", "ci"][i % 5], ["yi", "yo", "te", "ye", "ci"][(i + 2) % 5]].forEach(t => add("«" + w + "» sözünü " + HAL_AD[t] + " halda yazın.", halForm(w, t))));
  MN.forEach(w => add("«" + dan(w) + "» sözündə çıxışlıq hal şəkilçisinin d samiti yazılışından fərqli (n kimi) tələffüz olunurmu? (bəli/xeyr)", "bəli"));
  NMN.forEach(w => add("«" + dan(w) + "» sözündə çıxışlıq hal şəkilçisinin d samiti yazılışından fərqli (n kimi) tələffüz olunurmu? (bəli/xeyr)", "xeyr"));
  SIF_TE.forEach(([s, w]) => add("«" + s + "» cümləsində təsirlik hal şəkilçisi qəbul etmiş sifət hansı sözdür?", w));
  FIKIR_DUZ.forEach(f => add("Fikir doğrudurmu (Azərbaycan dili qaydasına görə)? «" + f + "» (doğru/səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => add("Fikir doğrudurmu (Azərbaycan dili qaydasına görə)? «" + f + "» (doğru/səhv)", "səhv"));
  ["yi", "yo", "te", "ye", "ci"].forEach(t => add("İsmin " + HAL_AD[t] + " halının şəkilçisi hansıdır? (-ın⁴, -a², -ı⁴, -da², -dan², yoxdur)", { yi: "-ın⁴", yo: "-a²", te: "-ı⁴", ye: "-da²", ci: "-dan²" }[t]));
  add("İsmin adlıq halının şəkilçisi varmı? (var/yoxdur)", "yoxdur");
  window.__yoxla = Y;

  window.__levels = levels;
  window.__bank = { BANK, G1, G2, NODROP, Y_SOZ, M_C, M_V, XB, MN, NMN, YO, SIF_TE, FIKIR_DUZ, FIKIR_SEHV, AD };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-isim-2", title: "İsim II: hallar, mənsubiyyət, xəbərlik", fenn: "azdili", link: "dersler/az-isim-2.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər sözün halını və şəkilçisini cümlədəki işlənməsinə görə müəyyən et.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hal", "halsec", "qeyri", "qeyri", "yaz", "mens", "mens", "dus", "xeb", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-isim-2.html")) b.push("dersler/az-isim-2.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
