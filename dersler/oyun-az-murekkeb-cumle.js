// Azərbaycan dili · Mürəkkəb cümlə və durğu işarələri — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 1-ci hissə (2024), s. 36–39 (cümlə sonunda durğu işarələri); 2-ci hissə (2024),
// s. 104–105 (sadə və mürəkkəb cümlələr; bağlayıcı və vergül); 6-cı sinif, 1-ci hissə (2025), s. 92 (bağlayıcıların funksiyası);
// 8-ci sinif (2023), s. 58, 69, 123–125 (qrammatik əsas, ümumiləşdirici sözlər); 9-cu sinif (2024), s. 71, 75, 81–82, 90–93
// (tabesiz mürəkkəb cümlə, bağlayıcılar, vergül), s. 109–110, 117 (tabeli), s. 165–167, 176–178 (vasitəsiz nitq, dialoq, tire/defis).
// Cümlə bankı: hər cümlənin növü (sadə/tabesiz/tabeli/səbəb bağlayıcılı), qrammatik əsaslarının sayı və durğusu əl ilə yoxlanıb.
// Bankda qəsdən olmayanlar: budaq cümlənin növləri; "çünki", "ona görə də" cümlələrinin tabesiz/tabeli növü (yalnız sadə/mürəkkəb
// və vergül tapşırıqlarında); omitted mübtədalı, təktərkibli və tərkibində feili bağlama/feili sifət xəbər olan cümlələr.
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const ORD = ["1-ci", "2-ci", "3-cü", "4-cü", "5-ci"];
  const NW = { 1: "bir", 2: "iki", 3: "üç", 4: "dörd" };
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  // A–E variantı üçün "nömrə kombinasiyası": düz alt çoxluq + 4 başqa (1–4 elementli) alt çoxluq
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }
  const bl = (...k) => h("span", { style: "display:block" }, ...k);
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const strip = w => w.replace(/[.,!?;:“”]/g, "");
  const cap = w => w[0].toLocaleUpperCase("az") + w.slice(1);
  const low = w => w[0].toLocaleLowerCase("az") + w.slice(1);

  // ======== cümlə bankı ========
  // Q(növ, mənbə, [qeyd]). Növ: S sadə · T tabesiz mürəkkəb (T3 — üç əsaslı) · B tabeli mürəkkəb · M mürəkkəb (növü soruşulmur: çünki, ona görə də).
  // Söz: "söz{bayraqlar}" — m mübtəda, x xəbər, b hissələri (və ya əsası) bağlayan bağlayıcı, c həmcins üzvləri bağlayan bağlayıcı;
  // "_" iki sözdən ibarət bir vahid; "/" — tərkib hissələrin sərhədi. Bayraqlı cümlələrdə bütün mübtəda və xəbərlər (bir sözlü) işarələnib.
  const MEANW = { amma: "qarşılaşdırma", ancaq: "qarşılaşdırma", lakin: "qarşılaşdırma", halbuki: "qarşılaşdırma", "və": "birləşdirmə",
    "ya da": "bölüşdürmə", "yəni": "aydınlaşdırma" };
  const MEANS = ["qarşılaşdırma", "bölüşdürmə", "birləşdirmə", "aydınlaşdırma", "inkarlıq"];
  function Q(kind, src, note) {
    const k = kind[0], n = k === "S" ? 1 : +(kind.slice(1) || 2);
    const toks = []; let part = 0;
    src.split(" ").forEach(t => {
      if (t === "/") { part++; return; }
      const m = t.match(/^([^{}]*)(?:\{([mxbc]+)\})?(.*)$/), f = m[2] || "";
      const w = (m[1] + m[3]).replace(/_/g, " ");
      toks.push({ w, bare: strip(w), m: f.includes("m"), x: f.includes("x"), b: f.includes("b"), c: f.includes("c"), part });
    });
    const s = { k, n, toks, text: toks.map(t => t.w).join(" "), note: note && note.replace(/\.$/, ""), mx: toks.some(t => t.m || t.x), parts: part + 1 };
    const bT = toks.filter(t => t.b);
    s.vas = k === "T" ? (n > 2 && bT.length ? "m" : bT.length ? "b" : "i") : null; // m — qarışıq: bir yerdə intonasiya, bir yerdə bağlayıcı (vasitə tapşırıqlarında işlənmir)
    if (bT.length) { const a = bT[0].bare.toLowerCase(), z = bT[bT.length - 1].bare.toLowerCase(); s.conn = bT.length > 1 ? a + " … " + z : a; s.mean = MEANW[z]; }
    return s;
  }
  const QS = [
    // sadə (bir qrammatik əsas)
    Q("S", "Sinfimizin şagirdləri həyətdə futbol oynayırlar."),
    Q("S", "Quşlar{m} oxuyur{x}, budaqdan budağa qonurdular{x}.", "Bir mübtəda (quşlar) ilə bağlı iki xəbər (oxuyur, qonurdular) var: 1 qrammatik əsas."),
    Q("S", "Leyla{m} dərslərini oxudu{x}, tapşırıqlarını yazdı{x}.", "Bir mübtəda (Leyla) ilə bağlı iki xəbər (oxudu, yazdı) var: 1 qrammatik əsas."),
    Q("S", "Həm müəllimlər, həm də şagirdlər tədbiri maraqla izləyirdilər.", "İki mübtəda (müəllimlər, şagirdlər), bir xəbər (izləyirdilər): 1 qrammatik əsas."),
    Q("S", "Nə uşaqlar, nə də böyüklər zalı tərk etmək istəyirdilər.", "İki mübtəda (uşaqlar, böyüklər), bir xəbər (tərk etmək istəyirdilər): 1 qrammatik əsas."),
    Q("S", "Uşaqlar{m} gülür{x}, oynayır{x} və{c} sevinirdilər{x}.", "Bir mübtəda (uşaqlar) ilə bağlı üç xəbər (gülür, oynayır, sevinirdilər) var: 1 qrammatik əsas."),
    Q("S", "Biz{m} dənizə getdik{x} və{c} dağlara qalxdıq{x}.", "Bir mübtəda (biz) ilə bağlı iki xəbər (getdik, qalxdıq) var: 1 qrammatik əsas."),
    Q("S", "Aytən{m} pianoda yaxşı çalırdı{x}."),
    Q("S", "Anam{m} bazardan meyvə, tərəvəz və{c} çörək aldı{x}.", "Mübtəda və xəbər birdir (anam — aldı); meyvə, tərəvəz, çörək həmcins tamamlıqlardır: 1 qrammatik əsas."),
    Q("S", "Yağış{m} gecə boyu yağdı{x}."),
    Q("S", "Müəllim{m} şagirdlərə yeni mövzunu izah_etdi{x}."),
    Q("S", "Mən{m} dünən kitabxanaya getdim{x}, iki kitab götürdüm{x}.", "Bir mübtəda (mən) ilə bağlı iki xəbər (getdim, götürdüm) var: 1 qrammatik əsas."),
    Q("S", "Nənəm{m} həyətdə güllər əkir{x} və{c} onlara qulluq_edir{x}.", "Bir mübtəda (nənəm) ilə bağlı iki xəbər (əkir, qulluq edir) var: 1 qrammatik əsas."),
    Q("S", "Dəniz kənarında yerləşən kiçik şəhərin sakinləri hər səhər balıq tutmağa çıxırdılar."),
    // tabesiz mürəkkəb
    Q("T", "Bahar{m} gəldi{x}, / çiçəklər{m} açdı{x}."),
    Q("T", "Bayaq göy guruldadı, güclü yağış yağdı."),
    Q("T", "Quşlar oxuyur, çiçəklərin ətri ətrafa yayılırdı."),
    Q("T", "Bağça dərin sükut içində idi, təkcə axan çayın şırıltısı eşidilirdi."),
    Q("T", "Gün{m} çıxmışdı{x}, / amma{b} / hava{m} soyuq_idi{x}."),
    Q("T", "Ana layla_dedi, / lakin{b} / körpə yata_bilmədi."),
    Q("T", "Çox yaşamaq əlimizdə deyil, / lakin{b} / adımızı çox yaşatmaq əlimizdədir."),
    Q("T", "Surxay yarımçıq qalmış simfoniyasını davam etdirmək istədi, / ancaq{b} / qəlbindəki anlaşılmaz hisslər imkan vermədi."),
    Q("T", "Teymur birtəhər özünü ələ aldı, / halbuki{b} / Şəmsidən eşitdiyi xəbər onun ürəyinə bir ox kimi sancılmışdı."),
    Q("T", "Müəllim{m} danışırdı{x} / və{b} / valideynlər{m} ona diqqət_kəsilmişdilər{x}."),
    Q("T", "Nənə{m} nağıl danışdı{x} / və{b} / körpə{m} yatdı{x}."),
    Q("T", "Yağış{m} kəsdi{x} / və{b} / günəş{m} çıxdı{x}."),
    Q("T", "Çalışmaq həyat, / düşünmək isə{b} işıqdır."),
    Q("T", "Elmi ədəbiyyat insanları nadanlıqdan qurtarır, / bədii ədəbiyyat isə{b} kobudluq və{c} bayağılıqdan xilas edir."),
    Q("T", "Ya{b} hamı bu işdən imtina etsin, / ya_da{b} əl-ələ verib tez bitirməyə çalışaq."),
    Q("T", "Nə{b} atası razı_oldu, / nə_də{b} qızı atasız getmək_istəyirdi."),
    Q("T", "Həm{b} hava{m} soyuq_idi{x}, / həm_də{b} külək{m} əsirdi{x}."),
    Q("T", "Hava{m} çox soyuq_idi{x}, / hətta{b} gölməçələr{m} donmuşdu{x}."),
    Q("T", "Fəsil{m} dəyişdi{x}, / yəni{b} payız{m} gəldi{x}."),
    Q("T", "Gah{b} yağış{m} yağırdı{x}, / gah_da{b} qar{m} yağırdı{x}."),
    Q("T", "Nənəm{m} danışırdı{x}, / biz{m} isə{b} dinləyirdik{x}."),
    Q("T", "Mən{m} dərsi oxudum{x}, / qardaşım{m} isə{b} tapşırığı yazdı{x}."),
    Q("T", "Biz{m} səhər erkən durduq{x}, / lakin{b} / avtobus{m} artıq getmişdi{x}."),
    Q("T", "Uşaqlar{m} oynayırdılar{x}, / valideynlər{m} onlara baxırdılar{x}."),
    Q("T", "Külək{m} əsdi{x}, / yarpaqlar{m} tökülürdü{x}."),
    Q("T3", "Bahar{m} gəldi{x}, / günəş{m} qızdırdı{x}, / çiçəklər{m} açdı{x}."),
    Q("T3", "Yağış{m} dayandı{x}, / günəş{m} çıxdı{x} / və{b} / uşaqlar{m} həyətə düşdülər{x}."),
    // mürəkkəb, növü soruşulmur (səbəb bildirən bağlayıcılar)
    Q("M", "Avtobus{m} dayandı{x}, / çünki{b} / yanacağı{m} qurtarmışdı{x}."),
    Q("M", "Mərdan pəncərəni bağladı, / çünki{b} / güclü külək başlamışdı."),
    Q("M", "Nar hələ yetişməyib, / ona_görə_də{b} / mən pay gətirə bilmədim."),
    Q("M", "Axşam vaxtı şəhərdə sıxlıq olur, / ona_görə_də{b} / evə tez getdik."),
    Q("M", "Hava{m} soyuq_idi{x}, / ona_görə_də{b} / biz{m} evdə qaldıq{x}."),
    // tabeli mürəkkəb
    Q("B", "Məşqçi hiss etdi ki, balaca uşaqlar çox yorulub."),
    Q("B", "Əgər{b} yağış{m} yağsa{x}, / biz{m} evdə qalarıq{x}."),
    Q("B", "O, həmişə deyərdi ki, nar birlik, möhkəmlik rəmzidir."),
    Q("B", "Müəllim{m} dedi{x} ki{b}, / sabah imtahan{m} olacaq{x}."),
    Q("B", "Atam{m} dedi{x} ki{b}, / dərslər{m} sabah başlayacaq{x}."),
    Q("B", "Mən{m} bilirəm{x} ki{b}, / sən{m} yaxşı hazırlaşmısan{x}."),
    Q("B", "Müəllim{m} xəbər_verdi{x} ki{b}, / imtahan{m} cümə günü keçiriləcək{x}."),
    Q("B", "Əgər{b} hava{m} yaxşı_olsa{x}, / biz{m} gəzintiyə çıxarıq{x}."),
    Q("B", "Valideynləri hökumətdən xahiş etdilər ki, Nik adi məktəbdə oxusun."),
    Q("B", "Mən etiraf edirəm ki, bizim dağların mənzərəsini tam verə bilmək üçün Səməd Vurğun qələmi gərəkdir."),
    Q("B", "Zaman keçdikcə həyat bizə öyrədir ki, həqiqətdən böyük möcüzə yoxdur."),
  ];
  const S_ = QS.filter(x => x.k === "S"), T_ = QS.filter(x => x.k === "T"), B_ = QS.filter(x => x.k === "B"), MR = QS.filter(x => x.k !== "S");
  const STB = QS.filter(x => x.k !== "M"), TV = T_.filter(x => x.vas !== "m");
  const KIND = { S: "sadə cümlə", T: "tabesiz mürəkkəb cümlə", B: "tabeli mürəkkəb cümlə" };
  const KIND_WHY = { S: "bir qrammatik əsas var, cümlə sadədir", T: "hissələr bərabərhüquqludur → tabesiz mürəkkəb cümlə", B: "budaq cümlə baş cümlədən asılıdır → tabeli mürəkkəb cümlə" };
  const CW = new Set(["və", "amma", "ancaq", "lakin", "halbuki", "yəni", "isə", "hətta", "ya", "ya da", "da", "də", "həm", "həm də", "nə", "nə də", "gah", "gah da", "istər", "istərsə də", "çünki", "ona görə də", "ki", "əgər"]);
  // hissələri bağlayan bağlayıcıya toxunma tapşırığı: cümlədə başqa bağlayıcı (həmcins üzvləri bağlayan və ya bağlayıcısız) qalmamalıdır
  const secB = s => (s.k === "T" || s.k === "M") && s.toks.some(t => t.b) && !s.toks.some(t => t.c) && s.toks.every(t => t.b || !CW.has(t.bare.toLowerCase()));
  const solEsas = s => s.mx ? pairsText(s) + " → " + s.n + " qrammatik əsas." : (s.note ? s.note + "." : (s.k === "S" ? "Mübtəda–xəbər cütü bir: 1 qrammatik əsas." : "Mübtəda–xəbər cütləri: " + s.n + " → " + s.n + " qrammatik əsas."));
  function pairsText(s) {
    const out = [];
    for (let p = 0; p < s.parts; p++) {
      const ms = s.toks.filter(t => t.part === p && t.m).map(t => t.bare), xs = s.toks.filter(t => t.part === p && t.x).map(t => t.bare);
      if (ms.length || xs.length) out.push(ORD[out.length] + " əsas: " + ms.join(", ") + " (mübtəda) — " + xs.join(", ") + " (xəbər)");
    }
    return out.join("; ");
  }
  const mubtedas = s => s.toks.filter(t => t.m).map(t => t.bare), xeberler = s => s.toks.filter(t => t.x).map(t => t.bare);
  const verdict = s => s.k === "S" ? "sadə cümlə" : "mürəkkəb cümlə";
  const solFull = s => solEsas(s) + " → " + verdict(s) + ".";

  // ---- vergül: cümlənin düz və səhv variantları (düz variant yalnız tərkib hissələr arasında bir vergüllü və ya vergülsüz "və" cümləsidir)
  function commaVars(s) {
    const text = s.text, nC = (text.match(/,/g) || []).length;
    if (nC > 1 || s.k === "S" || s.k === "B") return null;
    const words = text.replace(/,/g, "").split(" "), orig = text.split(" ");
    const k0 = orig.findIndex(w => w.endsWith(","));
    const iv = words.indexOf("və");
    if (k0 < 0 && iv < 0) return null;
    const withC = k => words.map((w, i) => i === k ? w + "," : w).join(" ");
    let out = [];
    if (k0 >= 0) { out.push(words.join(" ")); [k0 + 1, k0 - 1, k0 + 2, k0 - 2].forEach(k => { if (k >= 0 && k <= words.length - 2 && k !== k0) out.push(withC(k)); }); }
    else [iv - 1, iv, iv - 2, iv + 1].forEach(k => { if (k >= 0 && k <= words.length - 2) out.push(withC(k)); });
    out = [...new Set(out)].filter(x => x !== text);
    return out.length >= 3 ? { ok: text, wrongs: out, k0, words } : null;
  }
  const CE = QS.filter(x => commaVars(x));
  const commaWhy = s => {
    if (s.conn && /^(ya|həm|nə|gah)\b/.test(s.conn)) return "Təkrarlanan bağlayıcılarda vergül birincidən başqa digərlərindən əvvəl qoyulur.";
    if (s.conn === "və") return "Və bağlayıcısı ilə bağlanan tabesiz mürəkkəb cümlənin hissələri arasında vergül qoyulmur.";
    if (s.conn === "isə") return "Vergül hissələr arasında durur; isə bağlayıcısının yanında vergül qoyulmur.";
    if (s.conn) return "Vergül " + s.conn + " bağlayıcısından əvvəl qoyulur.";
    if (/çünki|ona görə də/.test(s.text)) return "Mürəkkəb cümlənin hissələri arasında vergül qoyulur (çünki, ona görə də — bağlayıcıdan əvvəl).";
    return "İntonasiya ilə bağlanan hissələr arasında vergül qoyulur.";
  };

  // ---- cümlə sonu: [cümlə, işarə, izah]
  const END = [
    ["Səmra ilə Aytən bir sinifdə oxuyurdular", ".", "nəqli cümlə"], ["Aytən pianoda yaxşı çalırdı", ".", "nəqli cümlə"], ["Nənəm bağda gül əkir", ".", "nəqli cümlə"],
    ["Biz səhər dənizə getdik", ".", "nəqli cümlə"], ["Bu gün hava çox isti idi", ".", "nəqli cümlə"], ["Sənan dostları ilə parka getdi", ".", "nəqli cümlə"],
    ["Sən şəkli sevə-sevə çək", ".", "əmr cümləsi"], ["Dərslərini vaxtında hazırla", ".", "əmr cümləsi"], ["Pəncərəni bağla", ".", "əmr cümləsi"], ["Kitabını sabah gətir", ".", "əmr cümləsi"],
    ["Sən qrammatikanı bilirsənmi", "?", "sual cümləsi"], ["Siz üzə bilirsinizmi", "?", "sual cümləsi"], ["Kim bu şəkli çəkib", "?", "sual cümləsi"],
    ["Sabah saat neçədə görüşəcəyik", "?", "sual cümləsi"], ["Nə üçün bu qədər gec gəldin", "?", "sual cümləsi"], ["Hara gedirsən", "?", "sual cümləsi"],
    ["Nə gözəl mənzərədir", "!", "nida cümləsi"], ["Nə gözəl gündür", "!", "nida cümləsi"], ["Nə böyük sevincdir", "!", "nida cümləsi"], ["Nə qədər şirin meyvədir", "!", "nida cümləsi"], ["Balaca qızdır, gör nə gözəl ifa edir", "!", "nida cümləsi"],
  ];
  const MARK = { ".": "nöqtə", "?": "sual işarəsi", "!": "nida işarəsi" };
  const END_WHY = { "nəqli cümlə": "Nəqli cümlə xəbər verir, sonunda nöqtə qoyulur.", "əmr cümləsi": "Əmr cümləsi xahiş, göstəriş ifadə edir; adi intonasiya ilə deyiləndə sonunda nöqtə qoyulur.",
    "sual cümləsi": "Sual cümləsi xəbər almaq məqsədi daşıyır, sonunda sual işarəsi qoyulur.", "nida cümləsi": "Nida cümləsi duyğu (heyranlıq, sevinc, qorxu, təəccüb) ifadə edir, sonunda nida işarəsi qoyulur." };

  // ---- vasitəsiz nitq
  const VN = [
    { m: "İngilis şairi Con Milton demişdir", v: "Uğur qazanıb sevinmək üçün bir çox məhrumiyyətlərə dözmək lazımdır", e: "." },
    { m: "Avstriya psixoloqu Vilhelm Reyx demişdir", v: "Bu gün çıxdığınız hər pillə sabahkı həyatınızın təməlidir", e: "." },
    { m: "Türk ordu komandanı Kazım Qarabəkir Paşa demişdir", v: "Tarixini bilən millət kökü sağlam çinar ağacı kimidir", e: "." },
    { m: "Amerika yazıçısı Uilyam Porter yazırdı", v: "Başqalarının eyiblərini ortaya çıxaran adam öz eyiblərini nümayiş etdirmiş olur", e: "." },
    { m: "Nənəm həmişə deyirdi", v: "Dost dostun güzgüsüdür", e: "." },
    { m: "Anam sevinclə dedi", v: "Sabah qonaqlarımız gələcək", e: "." },
    { m: "Şagird müəlliminə cavab verdi", v: "Mən bu mövzunu yaxşı başa düşdüm", e: "." },
    { m: "Fransız fiziki P.S.Laplas demişdir", v: "Bildiklərimiz bilmədiklərimizlə müqayisədə elə cüzidir ki", e: "!" },
    { m: "Sənan sevincək qışqırdı", v: "Nə gözəl qar yağıb", e: "!" },
    { m: "Qız heyranlıqla dedi", v: "Nə böyük sevincdir", e: "!" },
    { m: "Müəllim soruşdu", v: "Sabah kim növbətçidir", e: "?" },
    { m: "Moris Meterlinq deyirdi", v: "Elmlə məşğul olmadan dünyanın sirlərini necə öyrənə bilərsən", e: "?" },
    { m: "Uşaq atasından soruşdu", v: "Biz nə vaxt dənizə gedəcəyik", e: "?" },
  ];
  const CN = [
    { v: "Ağıllı ancaq nail ola biləcəyi məqsədə can atan adama deyirlər", t: "deyə Sokrat gənclərə müraciət edərmiş" },
    { v: "Dost dostun güzgüsüdür", t: "deyə nənəm həmişə təkrar edirdi" },
    { v: "Sabah imtahan olacaq", t: "deyə müəllim xəbər verdi" },
    { v: "Mən bu mövzunu yaxşı başa düşdüm", t: "deyə şagird cavab verdi" },
  ];
  const vnOk = x => x.e === "." ? x.m + ": “" + x.v + "”." : x.m + ": “" + x.v + x.e + "”";
  const vnWrong = x => x.e === "."
    ? [x.m + ", “" + x.v + "”.", x.m + " “" + x.v + "”.", x.m + ": “" + x.v + ".”", x.m + ": “" + low(x.v) + "”.", x.m + ": " + x.v + "."]
    : [x.m + ": “" + x.v + "”" + x.e, x.m + ": “" + x.v + x.e + "”.", x.m + " “" + x.v + x.e + "”", x.m + ": “" + low(x.v) + x.e + "”", x.m + ": " + x.v + x.e];
  const vnWhy = x => "Müəllifin sözündən sonra qoşa nöqtə qoyulur; vasitəsiz nitq böyük hərflə və dırnaq içində verilir. " +
    (x.e === "." ? "Nöqtə dırnaqdan sonra qoyulur." : "Sual, nida işarəsi olduqda dırnaq həmin işarədən sonra qoyulur.");
  const cnOk = x => "“" + x.v + "”, – " + x.t + ".";
  const cnWrong = x => ["“" + x.v + "” – " + x.t + ".", "“" + x.v + "”, " + x.t + ".", "“" + x.v + ".” – " + x.t + ".", "“" + x.v + "”, – " + cap(x.t) + ".", x.v + ", – " + x.t + "."];
  const cnWhy = "Vasitəsiz nitq əvvəldə olarsa, dırnaqdan sonra vergül və tire qoyulur, müəllifin sözü kiçik hərflə başlayır: “V”, – m.";

  // ---- ümumiləşdirici söz, tire və defis: [sətir, düzgün işarə, izah]
  const MARKS4 = ["qoşa nöqtə", "tire", "vergül", "defis"];
  const UMUM = [
    ["Qızlar ___ Nigar, Xanım, Röya və Nəzrin həvəslə bayram şənliyinə hazırlaşırdılar.", "qoşa nöqtə", "Ümumiləşdirici söz (qızlar) həmcins üzvlərdən əvvəl gəlir, ondan sonra qoşa nöqtə qoyulur."],
    ["Meyvələr ___ alma, armud, heyva və nar bağımızda yetişir.", "qoşa nöqtə", "Ümumiləşdirici söz (meyvələr) həmcins üzvlərdən əvvəl gəlir, ondan sonra qoşa nöqtə qoyulur."],
    ["H.Turabov, N.Zeynalova, H.Məmmədov, F.Mütəllimova, R.Balayev ___ bunların hamısı səhnəmizin görkəmli xadimləridir.", "tire", "Ümumiləşdirici söz (bunların hamısı) həmcins üzvlərdən sonra gəlir, ondan əvvəl tire qoyulur."],
    ["Alma, armud, heyva, nar ___ bunların hamısı bağımızda yetişir.", "tire", "Ümumiləşdirici söz (bunların hamısı) həmcins üzvlərdən sonra gəlir, ondan əvvəl tire qoyulur."],
    ["Bir nəfər Epiktetin yanına gəlib deyir: ___ Hörmətli filosof, nə edim ki, hamı məni sevsin?", "tire", "Dialoqda yeni sətirdən yazılan vasitəsiz nitqdən (replikadan) əvvəl tire qoyulur."],
    ["Sən şəkli sevə___sevə çək.", "defis", "Sevə-sevə eyni sözün təkrarından yaranan mürəkkəb sözdür; mürəkkəb sözlərin tərkib hissələri arasında defis yazılır."],
    ["Kitabı tez___tez oxuyur.", "defis", "Tez-tez təkrardan yaranan mürəkkəb zərfdir; tərkib hissələri arasında defis yazılır."],
  ];

  // ---- dialoqlar: [müəllifin sözü, replikalar…]; DIA0 — müəllif sözsüz (dərslikdəki nümunə kimi)
  const DIA = [
    ["Bir nəfər Epiktetin yanına gəlib deyir:", "Hörmətli filosof, nə edim ki, hamı məni sevsin?", "Bəd əməllərdən əl çək."],
    ["Müəllim şagirdlərdən soruşdu:", "Sabah kim növbətçidir?", "Mən növbətçiyəm."],
    ["Nənə nəvəsinə dedi:", "Dərslərini vaxtında hazırla.", "Artıq hazırlamışam."],
    ["Satıcı alıcıdan soruşdu:", "Siz hansı meyvəni istəyirsiniz?", "Mənə iki kilo alma lazımdır.", "Buyurun, götürün."],
    ["Uşaqlar pəncərədən baxıb sevinclə qışqırdılar:", "Nə gözəl qar yağıb!", "Ura, bu gün xizək sürəcəyik!"],
  ];
  const DIA5 = [
    ["Aytən Səmradan soruşdu:", "Sabah məktəbə nə vaxt gəlirsən?", "Səhər səkkizdə.", "Onda birlikdə gedək.", "Yaxşı, razıyam."],
    ["Atam mənə baxıb dedi:", "Sən bu gün niyə belə sevinclisən?", "Çünki imtahandan yüksək bal almışam.", "Afərin, oğlum!", "Sağ ol, ata."],
    ["Mağazada satıcı gülərüzlə dedi:", "Nə arzu edirsiniz?", "Mənə bir dəftər lazımdır.", "Neçə ədəd lazımdır?", "Üç ədəd."],
  ];
  const DIA0 = [
    ["Səmra, qızım, nə fikirləşirsən?", "Heç...", "Hədiyyə barədə düşünürsən?", "Qızım, vacib deyil ki, bahalı hədiyyə olsun."],
  ];
  // sətirlərin göstərilişi: müəllifin sözü tiresiz, replika tire ilə
  const diaLines = (d, author) => d.map((l, i) => author && i === 0 ? l : "– " + l);
  // pozulmuş dialoq: sətir göstərilişləri + hansı sətirlərin pozulduğu
  function diaBreakAt(d, author, idxs) {
    const lines = diaLines(d, author), why = {};
    idxs.forEach(i => {
      const l = d[i], isAuth = author && i === 0;
      let opts;
      if (isAuth) opts = [[l.replace(/:$/, "."), "müəllifin sözündən sonra qoşa nöqtə qoyulur"], [l.replace(/:$/, ","), "müəllifin sözündən sonra qoşa nöqtə qoyulur"], [l.replace(/:$/, ""), "müəllifin sözündən sonra qoşa nöqtə qoyulur"]];
      else {
        opts = [[l, "replika yeni sətirdən tire ilə başlayır (burada tire yoxdur)"], ["“" + l + "”", "dialoqda replikalar dırnaqsız, tire ilə yazılır"]];
        if (/\?$/.test(l)) opts.push(["– " + l.slice(0, -1) + ".", "sual cümləsinin sonunda sual işarəsi qoyulur"]);
        if (/^Nə.*!$/.test(l)) opts.push(["– " + l.slice(0, -1) + ".", "nida cümləsinin sonunda nida işarəsi qoyulur"]);
      }
      const [x, w] = pick(opts); lines[i] = x; why[i] = w;
    });
    return { lines, why };
  }
  const diaOk = (d, author) => diaLines(d, author);
  const diaTarget = (d, author) => d.map((l, i) => i).filter(i => !/\.\.\.$/.test(d[i]));

  // ---- cümlə üzvləri: [söz:qrup]; M mübtəda, X xəbər, T tamamlıq, Y təyin, Z zərflik; "_" bir vahid
  const UZV = [
    "Yeni:Y müəllim:M dərsi:T diqqətlə:Z izah_etdi:X", "Balaca:Y qız:M səhər:Z bağda:Z oynayırdı:X", "Nənəm:M həyətdə:Z qırmızı:Y gülləri:T əkdi:X",
    "Atam:M mənə:T maraqlı:Y kitab:T gətirdi:X", "Qardaşım:M dünən:Z yeni:Y kompüter:T aldı:X", "Şagirdlər:M imtahana:T diqqətlə:Z hazırlaşırlar:X",
    "Qonşumuz:M bağda:Z yeni:Y ağaclar:T əkir:X",
  ].map(s => s.split(" ").map(t => { const [w, g] = t.split(":"); return { w: w.replace(/_/g, " "), g }; }));
  const UG = { M: "mübtəda", X: "xəbər", T: "tamamlıq", Y: "təyin", Z: "zərflik" };
  const UQ = { M: "kim? nə? (haqqında danışılan)", X: "nə etdi?", T: "kimi? nəyi? kimə? nəyə?", Y: "hansı?", Z: "necə? nə vaxt? harada?" };

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "esas", ad: "Qrammatik əsası tap", izah: "Qrammatik əsas — mübtəda və xəbərdir. Cümlədəki bütün mübtəda və xəbərlərə toxun (hər tərkib hissədə ayrıca).",
      gen() {
        const s = pick(QS.filter(x => x.mx)), duz = s.toks.map((t, i) => t.m || t.x ? i : -1).filter(i => i >= 0);
        return { text: "Cümlədəki bütün mübtəda və xəbərlərə toxun.", sec: { soz: s.toks.map(t => t.w), duz }, show: duz.map(i => s.toks[i].bare).join(", "), solution: solFull(s) };
      } },
    { id: "sade", ad: "Sadə, yoxsa mürəkkəb", izah: "Mübtəda–xəbər cütlərini say: bir cüt — sadə cümlə, iki və daha çox — mürəkkəb. Bir mübtəda ilə bağlı bir neçə xəbər sadə cümlədir.",
      gen() {
        const f = R(3);
        if (f === 0) {
          const s = pick(QS), opts = ["1", "2", "3", "4"];
          return { text: h("span", {}, "Cümlədə neçə qrammatik əsas var?", line("«" + s.text + "»")), choices: opts, correct: s.n - 1, show: String(s.n), solution: solFull(s) };
        }
        const wantMur = f === 1, right = pick(wantMur ? MR : S_);
        const trap = (wantMur ? S_ : MR).filter(x => x.note), rest = (wantMur ? S_ : MR).filter(x => !x.note);
        const wrong = wantMur ? [...sample(trap, 2), ...sample(rest, 1)] : sample(MR, 3);
        const ch = shuffle([right, ...wrong]);
        return { text: wantMur ? "Cümlələrdən hansı mürəkkəbdir?" : "Cümlələrdən hansı sadədir?", choices: ch.map(x => x.text), correct: ch.indexOf(right), show: right.text,
          solution: ch.map(x => "«" + x.text + "» — " + x.n + " əsas" + (x.note ? " (" + x.note + ")" : "")).join("; ") + "." };
      } },
    { id: "nov", ad: "Sadə, tabesiz, tabeli", izah: "Hər cümləni sadə, tabesiz və ya tabeli mürəkkəb cümləyə ayır. Əvvəl əsasları say: bir cüt — sadə. İki və daha çoxdursa, hissələr bərabərdirsə — tabesiz, biri digərindən asılıdırsa — tabeli.",
      gen() {
        for (;;) {
          const ss = sample(STB, 4), kinds = new Set(ss.map(x => x.k));
          if (kinds.size < 2) continue;
          const qrup = ["sadə cümlə", "tabesiz mürəkkəb cümlə", "tabeli mürəkkəb cümlə"], idx = { S: 0, T: 1, B: 2 };
          return { text: "Cümlələri növünə görə ayır.", bol: { soz: ss.map(x => x.text), qrup, duz: ss.map(x => idx[x.k]) },
            show: ss.map(x => "«" + x.text + "» — " + KIND[x.k]).join("; "), solution: ss.map(x => "«" + x.text + "» — " + KIND_WHY[x.k]).join("; ") + "." };
        }
      } },
    { id: "vasite", ad: "Bağlayan vasitə və məna", izah: "Tabesiz mürəkkəb cümlənin hissələrini intonasiya və ya tabesizlik bağlayıcıları bağlayır. Qarşılaşdırma: amma, ancaq, lakin, halbuki; bölüşdürmə: ya … ya da; birləşdirmə: və; aydınlaşdırma: yəni; inkarlıq: nə … nə də.",
      gen() {
        const f = R(3);
        if (f === 0) {
          const s = pick(QS.filter(secB)), duz = s.toks.map((t, i) => t.b ? i : -1).filter(i => i >= 0);
          return { text: "Tərkib hissələri bağlayan bağlayıcıya toxun.", sec: { soz: s.toks.map(t => t.w), duz }, show: duz.map(i => s.toks[i].bare).join(", "),
            solution: "Bağlayıcı: " + s.conn + ". " + (s.mean ? "Mənası: " + s.mean + "." : "") };
        }
        if (f === 1) {
          const s = pick(TV.concat(TV.filter(x => x.vas === "i"))), all = ["və", "amma", "lakin", "ancaq", "halbuki", "yəni", "hətta", "isə", "ya … ya da", "həm … həm də", "nə … nə də", "gah … gah da"];
          const inS = new Set(s.toks.filter(t => t.b || CW.has(t.bare.toLowerCase())).map(t => t.bare.toLowerCase()));
          const pool = all.filter(c => !c.split(" … ").some(p => inS.has(p)));
          const right = s.vas === "i" ? "yalnız intonasiya ilə" : s.conn + " bağlayıcısı ilə", wrong = sample(pool, 3).map(c => c + " bağlayıcısı ilə");
          const wr = s.vas === "i" ? wrong : [...wrong.slice(0, 2), "yalnız intonasiya ilə"];
          const ch = shuffle([right, ...wr]);
          return { text: h("span", {}, "Tabesiz mürəkkəb cümlənin hissələri nə ilə bağlanıb?", line("«" + s.text + "»")), choices: ch, correct: ch.indexOf(right), show: right,
            solution: s.vas === "i" ? "Cümlədə bağlayıcı yoxdur: hissələri yalnız intonasiya bağlayır, aralarında vergül qoyulur." : "Hissələri " + s.conn + " bağlayıcısı bağlayır." };
        }
        const s = pick(TV.filter(x => x.mean && x.mean in { qarşılaşdırma: 1, bölüşdürmə: 1, birləşdirmə: 1, aydınlaşdırma: 1, inkarlıq: 1 }));
        const marked = h("span", {}, ...s.toks.map((t, i) => [i ? " " : "", t.b ? h("u", {}, h("b", {}, t.w)) : t.w]));
        const ch = shuffle(MEANS);
        return { text: h("span", {}, "Fərqləndirilmiş bağlayıcı hansı mənanı bildirir?", line(marked)), choices: ch, correct: ch.indexOf(s.mean), show: s.mean,
          solution: "“" + s.conn + "” — " + s.mean + " bağlayıcısıdır." };
      } },
    { id: "sonu", ad: "Cümlə sonunda işarə", izah: "Nəqli və adi intonasiya ilə deyilən əmr cümləsində nöqtə, sual cümləsində sual işarəsi, nida cümləsində nida işarəsi qoyulur.",
      gen() {
        const [t, m, w] = pick(END), ch = ["nöqtə", "sual işarəsi", "nida işarəsi", "üç nöqtə"];
        return { text: h("span", {}, "Cümlənin sonunda hansı durğu işarəsi qoyulmalıdır?" + (w === "əmr cümləsi" ? " (adi intonasiya ilə deyilən əmr cümləsi)" : ""), line(t + " ___")), choices: ch, correct: ch.indexOf(MARK[m]), show: MARK[m], solution: "Bu — " + w + ". " + END_WHY[w] };
      } },
    { id: "vergul", ad: "Vergül", izah: "İntonasiya ilə bağlanan hissələr arasında vergül; və-dən əvvəl vergül yoxdur; amma, ancaq, lakin, halbuki, hətta, yəni-dən əvvəl vergül; isə-nin yanında vergül yoxdur.",
      gen() {
        if (R(2) === 0) {
          const s = pick(CE.filter(x => x.text.includes(","))), v = commaVars(s);
          const toks = v.words, duz = [v.k0];
          return { text: "Vergül hansı sözdən sonra qoyulmalıdır?", sec: { soz: toks, duz }, show: toks[v.k0], solution: commaWhy(s) + " Düzü: «" + s.text + "»" };
        }
        const s = pick(CE), v = commaVars(s), wr = v.wrongs.length > 3 ? sample(v.wrongs, 3) : v.wrongs;
        const ch = shuffle([v.ok, ...wr]);
        return { text: "Hansı cümlədə vergül düzgün qoyulub?", choices: ch, correct: ch.indexOf(v.ok), show: v.ok, solution: commaWhy(s) };
      } },
    { id: "nitq", ad: "Vasitəsiz nitq, qoşa nöqtə, tire", izah: "M: “V”. — qoşa nöqtə, dırnaq, nöqtə dırnaqdan sonra. M: “V?” — dırnaq işarədən sonra. “V”, – m. Ümumiləşdirici söz əvvəldə — qoşa nöqtə, sonda — tire.",
      gen() {
        const f = R(5);
        if (f === 4) {
          const [t, a, w] = pick(UMUM);
          return { text: h("span", {}, "Nöqtələrin yerinə hansı işarə qoyulmalıdır?", line(t.replace(/___/g, "…"))), choices: MARKS4, correct: MARKS4.indexOf(a), show: a, solution: w };
        }
        if (f === 3) {
          const x = pick(CN), ch = shuffle([cnOk(x), ...sample(cnWrong(x), 3)]);
          return { text: "Hansı cümlədə durğu işarələri düzgün qoyulub?", choices: ch, correct: ch.indexOf(cnOk(x)), show: cnOk(x), solution: cnWhy };
        }
        const x = pick(VN), ok = vnOk(x), ch = shuffle([ok, ...sample(vnWrong(x), 3)]);
        return { text: "Hansı cümlədə durğu işarələri düzgün qoyulub?", choices: ch, correct: ch.indexOf(ok), show: ok, solution: vnWhy(x) };
      } },
    { id: "dialoq", ad: "Dialoqda durğu", izah: "Dialoqda müəllifin sözündən sonra qoşa nöqtə, hər replika yeni sətirdən tire ilə başlayır, replikalar dırnaqsızdır. Hər replikanın sonunda öz cümləsinin işarəsi durur.",
      gen() {
        const useA = R(4) > 0, d = useA ? pick(DIA) : pick(DIA0), tg = diaTarget(d, useA), i = pick(tg);
        const { lines, why } = diaBreakAt(d, useA, [i]);
        const names = lines.map((_, j) => ORD[j] + " sətir");
        return { text: h("span", {}, "Dialoqda durğu işarəsi hansı sətirdə səhv işlədilib?", ...lines.map((l, j) => bl((j + 1) + ". " + l))), choices: names, correct: i, show: names[i], solution: ORD[i] + " sətirdə: " + why[i] + "." };
      } },
    { id: "tehlil", ad: "Sintaktik təhlil: üzvlər", izah: "Hər sözü cümlədəki yerinə görə ayır: mübtəda, xəbər, bağlayıcı, ikincidərəcəli üzv (tamamlıq, təyin, zərflik).",
      gen() {
        if (R(2) === 0) {
          const s = pick(QS.filter(x => x.mx && x.toks.length <= 9)), qrup = ["mübtəda", "xəbər", "bağlayıcı", "ikincidərəcəli üzv"];
          const g = t => t.m ? 0 : t.x ? 1 : (t.b || t.c) ? 2 : 3;
          return { text: "«" + s.text + "» — sözləri cümlədəki yerinə görə ayır.", bol: { soz: s.toks.map(t => t.bare), qrup, duz: s.toks.map(g) },
            show: s.toks.map(t => t.bare + " — " + qrup[g(t)]).join("; "), solution: s.toks.map(t => t.bare + " — " + qrup[g(t)]).join("; ") + ". İkinci dərəcəli üzv: tamamlıq, təyin və ya zərflik." };
        }
        const s = pick(UZV), qrup = ["mübtəda", "xəbər", "tamamlıq", "təyin", "zərflik"], idx = { M: 0, X: 1, T: 2, Y: 3, Z: 4 };
        return { text: "«" + s.map(x => x.w).join(" ") + ".» — sözləri cümlə üzvlərinə ayır.", bol: { soz: s.map(x => x.w), qrup, duz: s.map(x => idx[x.g]) },
          show: s.map(x => x.w + " — " + UG[x.g]).join("; "), solution: s.map(x => x.w + " — " + UG[x.g] + " (" + UQ[x.g] + ")").join("; ") + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümləni üç bənd üzrə təhlil edib. Biri səhvdir — hansı?",
      gen() {
        const s = pick(QS), F = factsOf(s), ts = sample(F, 3), k = R(3);
        const lab = ts.map((f, i) => i === k ? f.f : f.t);
        const ord = ["1-ci bənd", "2-ci bənd", "3-cü bənd"];
        return { text: "«" + s.text + "» — şagirdin təhlili: " + lab.map((x, i) => (i + 1) + ") " + x).join("; ") + ". Hansı bənddə səhv var?", choices: ord, correct: k, show: ord[k],
          solution: "Səhv bənd: “" + lab[k] + "” — düzü: " + ts[k].t + ". " + solEsas(s) };
      } },
  ];

  // cümlənin təhlil faktları: { t: doğru, f: səhv }
  function factsOf(s) {
    const F = [];
    F.push({ t: s.k === "S" ? "sadə cümlədir" : "mürəkkəb cümlədir", f: s.k === "S" ? "mürəkkəb cümlədir" : "sadə cümlədir" });
    F.push({ t: NW[s.n] + " qrammatik əsası var", f: NW[s.n === 1 ? 2 : s.n === 2 ? (R(2) ? 1 : 3) : 2] + " qrammatik əsası var" });
    F.push({ t: "nəqli cümlədir", f: pick(["sual cümləsidir", "nida cümləsidir"]) });
    if (s.k === "T") {
      F.push({ t: "tabesiz mürəkkəb cümlədir", f: "tabeli mürəkkəb cümlədir" });
      if (s.vas !== "m") F.push(s.vas === "i" ? { t: "hissələri yalnız intonasiya bağlayır", f: "hissələri tabesizlik bağlayıcısı bağlayır" } : { t: "hissələri " + s.conn + " bağlayıcısı bağlayır", f: "hissələri yalnız intonasiya bağlayır" });
      if (s.mean && s.vas !== "m") F.push({ t: s.conn + " bağlayıcısı " + s.mean + " bildirir", f: s.conn + " bağlayıcısı " + pick(MEANS.filter(m => m !== s.mean)) + " bildirir" });
    }
    if (s.k === "B") F.push({ t: "tabeli mürəkkəb cümlədir", f: "tabesiz mürəkkəb cümlədir" }, { t: "hissələrindən biri digərindən asılıdır", f: "hissələri bərabərhüquqludur" });
    return F;
  }

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E) ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const FIKIR_DUZ = [
    "Sadə cümlənin bir, mürəkkəb cümlənin iki və daha artıq qrammatik əsası var.",
    "Mübtəda və xəbər cümlənin baş üzvləridir; qrammatik əsas baş üzvlərlə ifadə olunur.",
    "Bir mübtəda ilə bağlı iki və daha çox xəbər olan cümlə sadə cümlədir.",
    "Mürəkkəb cümlələr tabesiz və tabeli mürəkkəb cümlələrə ayrılır.",
    "Tabesiz mürəkkəb cümlənin tərkib hissələri bərabərhüquqludur.",
    "Tabeli mürəkkəb cümlənin hissələrindən biri qrammatik cəhətdən digərindən asılıdır.",
    "Tabeli mürəkkəb cümlədə müstəqil hissə baş cümlə, asılı hissə budaq cümlə adlanır.",
    "Tabesiz mürəkkəb cümlənin hissələri intonasiya və ya tabesizlik bağlayıcıları ilə bağlanır.",
    "İntonasiya ilə bağlanan tərkib hissələr arasında adətən vergül qoyulur.",
    "Və bağlayıcısı ilə bağlanan tabesiz mürəkkəb cümlənin hissələri arasında vergül qoyulmur.",
    "Amma, ancaq, lakin, halbuki bağlayıcılarının işləndiyi tabesiz mürəkkəb cümlələrdə vergül bağlayıcıdan əvvəl qoyulur.",
    "Qarşılaşdırma bağlayıcıları tərkib hissələr arasında ziddiyyət yaradır.",
    "Təkrarlanan bağlayıcılarda vergül birincidən başqa digərlərindən əvvəl qoyulur.",
    "Nəqli cümlənin sonunda nöqtə qoyulur.",
    "Adi intonasiya ilə deyilən əmr cümləsinin sonunda nöqtə qoyulur.",
    "Sual cümləsinin sonunda sual işarəsi qoyulur.",
    "Nida cümləsinin sonunda nida işarəsi qoyulur.",
    "Dialoqdan kənar cümlədə müəllifin sözündən sonra verilən vasitəsiz nitq böyük hərflə və dırnaq işarəsi içərisində yazılır.",
    "Vasitəsiz nitqdən əvvəl müəllifin sözündən sonra qoşa nöqtə qoyulur.",
    "Vasitəsiz nitqdən sonra sual işarəsi olarsa, dırnaq həmin işarədən sonra qoyulur.",
    "Dialoqda yeni sətirdən yazılan vasitəsiz nitqdən əvvəl tire qoyulur.",
    "Ümumiləşdirici söz həmcins üzvlərdən əvvəl gəldikdə ondan sonra qoşa nöqtə qoyulur.",
    "Ümumiləşdirici söz həmcins üzvlərdən sonra gəldikdə ondan əvvəl tire qoyulur.",
    "Yazıda üç nöqtə fikrin bitmədiyini və ya nitqdə pauzanı göstərir.",
  ];
  const FIKIR_SEHV = [
    "Sadə cümlənin iki qrammatik əsası olur.",
    "Vergül olan hər cümlə mürəkkəb cümlədir.",
    "Bir mübtəda ilə bağlı iki xəbər olan cümlə mürəkkəb cümlədir.",
    "Tabesiz mürəkkəb cümlənin hissələrindən biri digərindən asılıdır.",
    "Tabeli mürəkkəb cümlənin tərkib hissələri bərabərhüquqludur.",
    "Mürəkkəb cümlənin bir qrammatik əsası var.",
    "Və bağlayıcısından əvvəl həmişə vergül qoyulur.",
    "Amma, lakin, ancaq bağlayıcılarından sonra vergül qoyulur.",
    "İntonasiya ilə bağlanan tərkib hissələr arasında heç vaxt vergül qoyulmur.",
    "Nəqli cümlənin sonunda sual işarəsi qoyulur.",
    "Adi intonasiya ilə deyilən əmr cümləsinin sonunda nida işarəsi qoyulur.",
    "Sual cümləsinin sonunda nöqtə qoyulur.",
    "Dialoqdan kənar cümlədə müəllifin sözündən sonra verilən vasitəsiz nitq dırnaqsız və kiçik hərflə yazılır.",
    "Müəllifin sözündən sonra, vasitəsiz nitqdən əvvəl vergül qoyulur.",
    "Vasitəsiz nitqdən sonra sual işarəsi olarsa, dırnaq sual işarəsindən əvvəl qoyulur.",
    "Dialoqda replikalardan əvvəl dırnaq qoyulur.",
    "Ümumiləşdirici söz həmcins üzvlərdən əvvəl gəldikdə ondan sonra tire qoyulur.",
    "Ümumiləşdirici söz həmcins üzvlərdən sonra gəldikdə ondan əvvəl qoşa nöqtə qoyulur.",
    "Üç nöqtə fikrin tam bitdiyini göstərir.",
    "Tabeli mürəkkəb cümlədə baş cümlə budaq cümlədən asılıdır.",
  ];

  const sentLines = a => a.map((x, i) => bl((i + 1) + ". " + x));
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    { tip: "qapali", gen: () => Oyun.again(() => {   // 1. hansı mürəkkəbdir
      const right = pick(MR), trap = S_.filter(x => x.note), rest = S_.filter(x => !x.note), wrong = [...sample(trap, 2), ...sample(rest, 2)];
      return AEq("Cümlələrdən hansı mürəkkəbdir?", right.text, wrong.map(x => x.text), "Mübtəda–xəbər cütlərini say. «" + right.text + "» — " + right.n + " əsas, mürəkkəbdir. " + wrong.map(x => "«" + x.text + "» — " + x.n + " əsas" + (x.note ? " (" + x.note + ")" : "")).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 2. hansı sadədir
      const right = pick(S_), wrong = sample(MR, 4);
      return AEq("Cümlələrdən hansı sadədir?", right.text, wrong.map(x => x.text), "«" + right.text + "» — " + (right.note || "bir qrammatik əsas") + ". Qalanlarının hər birində iki əsas var: " + wrong.map(x => "«" + x.text + "»").join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 3. nömrə kombinasiyası: tabesiz
      const five = sample(STB, 5), right = five.map((x, i) => x.k === "T" ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələr tabesiz mürəkkəb cümlədir?", ...sentLines(five.map(x => x.text))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + KIND[x.k]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 4. nömrə kombinasiyası: bağlayıcı ilə bağlanan
      const five = sample(TV, 5), right = five.map((x, i) => x.vas === "b" ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı tabesiz mürəkkəb cümlələrdə tərkib hissələr bağlayıcı vasitəsilə bağlanıb?", ...sentLines(five.map(x => x.text))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + (x.vas === "b" ? x.conn + " bağlayıcısı" : "yalnız intonasiya")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 5. tabeli
      const right = pick(B_), wrong = [...sample(T_, 2), ...sample(S_, 2)];
      return AEq("Cümlələrdən hansı tabeli mürəkkəb cümlədir?", right.text, wrong.map(x => x.text),
        "«" + right.text + "» — hissələrdən biri (budaq cümlə) digərindən (baş cümlədən) asılıdır. " + wrong.map(x => "«" + x.text + "» — " + (x.k === "S" ? "sadə cümlə" : "tabesiz mürəkkəb cümlə")).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 6. vergül düzgün
      const five = sample(CE, 5), vs = five.map(commaVars), right = five[0];
      return AEq("Cümlələrdən hansında vergül düzgün qoyulub?", vs[0].ok, vs.slice(1).map(v => pick(v.wrongs)), "Düzgün: «" + vs[0].ok + "» — " + commaWhy(right) + " Qalanlarında vergül yanlış yerdədir və ya lazım olmayan yerdə qoyulub.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 7. vergül səhv
      const five = sample(CE, 5), vs = five.map(commaVars);
      return AEq("Hansı cümlədə vergül işarəsi səhv işlədilib?", pick(vs[0].wrongs), vs.slice(1).map(v => v.ok), "Səhv cümlə «" + five[0].text + "» cümləsinin pozulmuş variantıdır: " + commaWhy(five[0]) + " Qalan dörd cümlədə vergül qaydaya uyğundur.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 8. vasitəsiz nitq
      if (R(3) === 0) { const x = pick(CN); return AEq("Hansı cümlədə durğu işarələri düzgün qoyulub?", cnOk(x), sample(cnWrong(x), 4), cnWhy); }
      const x = pick(VN);
      return AEq("Hansı cümlədə durğu işarələri düzgün qoyulub?", vnOk(x), sample(vnWrong(x), 4), vnWhy(x));
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 9. dialoq: nömrə kombinasiyası
      const d = pick(DIA5), k = 1 + R(3), bad = sample([0, 1, 2, 3, 4], k).sort((a, b) => a - b);
      const right = [0, 1, 2, 3, 4].filter(i => !bad.includes(i)).map(i => i + 1);
      const o = comboChoices(right); if (!o) return null;
      const { lines, why } = diaBreakAt(d, true, bad);
      return { text: h("span", {}, "Dialoqda hansı sətirlərdə durğu işarələri düzgün işlədilib?", ...sentLines(lines)), ...o, show: o.choices[o.correct],
        solution: bad.map(i => (i + 1) + "-ci sətir səhvdir: " + why[i]).join("; ") + ". Düzgün sətirlər: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {   // 10. fikir və ya cümlənin təhlili
      if (R(2) === 0) {
        if (R(2) === 0) { const bad = pick(FIKIR_SEHV); return AEq("Mürəkkəb cümlə və durğu işarələri ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
        const ok = pick(FIKIR_DUZ); return AEq("Mürəkkəb cümlə və durğu işarələri ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
      }
      const s = pick(QS.filter(x => x.k === "T" || x.k === "B")), F = factsOf(s);
      if (R(2) === 0) { const f = pick(F), others = sample(F.filter(x => x !== f), 4); if (others.length < 4) return null; return AEq("«" + s.text + "» cümləsi ilə bağlı səhv fikri müəyyən edin.", f.f, others.map(x => x.t), "Səhv fikir: “" + f.f + "”. Düzü: " + f.t + ". " + solEsas(s)); }
      const f = pick(F), others = sample(F.filter(x => x !== f), 4); if (others.length < 4) return null;
      return AEq("«" + s.text + "» cümləsi ilə bağlı doğru fikri müəyyən edin.", f.t, others.map(x => x.f), "Doğru fikir: “" + f.t + "”. " + solEsas(s));
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: bankdakı hər fakt müstəqil sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "m" + (++yn), sual, cavab });
  const RULE_N = " — dərsliyə görə: sadə cümlənin bir, mürəkkəb cümlənin iki və daha artıq qrammatik əsası (mübtəda–xəbər cütü) var; bir mübtəda ilə bağlı bir neçə xəbər bir əsasdır.";
  QS.forEach(s => {
    addY("«" + s.text + "» cümləsi sadədir, yoxsa mürəkkəb? (sadə, mürəkkəb)" + RULE_N, s.k === "S" ? "sadə" : "mürəkkəb");
    addY("«" + s.text + "» cümləsində neçə qrammatik əsas (mübtəda–xəbər cütü) var? (1, 2, 3)" + RULE_N, String(s.n));
    if (s.k !== "M") addY("«" + s.text + "» cümləsi quruluşca hansıdır? (sadə cümlə, tabesiz mürəkkəb cümlə, tabeli mürəkkəb cümlə) — dərsliyə görə: tabesizdə hissələr bərabərhüquqludur, tabelidə biri (budaq cümlə) digərindən (baş cümlədən) asılıdır.", KIND[s.k]);
    if (s.k === "T" && s.vas !== "m") {
      addY("«" + s.text + "» tabesiz mürəkkəb cümləsinin hissələrini hansı vasitə bağlayır? (yalnız intonasiya, tabesizlik bağlayıcısı)", s.vas === "i" ? "yalnız intonasiya" : "tabesizlik bağlayıcısı");
      if (s.vas === "b") addY("«" + s.text + "» tabesiz mürəkkəb cümləsində hissələri bağlayan bağlayıcı hansıdır? (bağlayıcının özünü yaz; təkrarlananda hər ikisini: ya … ya da)", s.conn);
    }
    if (s.mean && s.vas !== "m") addY("«" + s.text + "» cümləsində hissələri bağlayan “" + s.conn + "” bağlayıcısı hansı mənanı bildirir? (qarşılaşdırma, bölüşdürmə, birləşdirmə, aydınlaşdırma, inkarlıq) — dərsliyə görə: qarşılaşdırma — amma, ancaq, lakin, halbuki; bölüşdürmə — ya … ya da; birləşdirmə — və; aydınlaşdırma — yəni; inkarlıq — nə … nə də.", s.mean);
    if (s.mx) {
      addY("«" + s.text + "» cümləsində mübtəda olan söz və ya sözlər hansılardır? (cümlədə mübtəda–xəbər cütləri axtarılır; bir sözlü mübtədalar)", mubtedas(s).join(", "));
      addY("«" + s.text + "» cümləsində xəbər olan söz və ya sözlər hansılardır? (bir sözlü və ya iki sözdən ibarət bir vahid xəbərlər)", xeberler(s).join(", "));
    }
  });
  END.forEach(([t, m, w]) => addY("«" + t + " ___» cümləsinin sonunda hansı durğu işarəsi qoyulmalıdır?" + (w === "əmr cümləsi" ? " (adi intonasiya ilə deyilən əmr cümləsi)" : "") + " (nöqtə, sual işarəsi, nida işarəsi, üç nöqtə) — dərsliyə görə: nəqli və adi intonasiya ilə deyilən əmr cümləsində nöqtə, sual cümləsində sual işarəsi, nida cümləsində nida işarəsi.", MARK[m]));
  const RULE_V = " — dərsliyə görə: intonasiya ilə bağlanan hissələr arasında vergül qoyulur; və bağlayıcısı ilə vergül yoxdur; amma, ancaq, lakin, halbuki, hətta, yəni, çünki, ona görə də — vergül bağlayıcıdan əvvəl; isə-nin yanında vergül yoxdur; təkrarlanan bağlayıcılarda vergül birincidən başqa digərlərindən əvvəl.";
  CE.forEach(s => { const v = commaVars(s); addY("«" + v.ok + "» — bu cümlədə vergül düzgün qoyulubmu? (düzgün, səhv)" + RULE_V, "düzgün"); v.wrongs.slice(0, 2).forEach(w => addY("«" + w + "» — bu cümlədə vergül düzgün qoyulubmu? (düzgün, səhv)" + RULE_V, "səhv")); });
  const RULE_N2 = " — dərsliyə görə: müəllifin sözündən sonra qoşa nöqtə; vasitəsiz nitq böyük hərflə və dırnaq içində; nöqtə dırnaqdan sonra; sual və nida işarəsi olduqda dırnaq həmin işarədən sonra; vasitəsiz nitq əvvəldə olarsa: “V”, – m.";
  VN.forEach(x => { addY("«" + vnOk(x) + "» — bu cümlədə durğu işarələri düzgün qoyulubmu? (düzgün, səhv)" + RULE_N2, "düzgün"); vnWrong(x).slice(0, 2).forEach(w => addY("«" + w + "» — bu cümlədə durğu işarələri düzgün qoyulubmu? (düzgün, səhv)" + RULE_N2, "səhv")); });
  CN.forEach(x => { addY("«" + cnOk(x) + "» — bu cümlədə durğu işarələri düzgün qoyulubmu? (düzgün, səhv)" + RULE_N2, "düzgün"); cnWrong(x).slice(0, 3).forEach(w => addY("«" + w + "» — bu cümlədə durğu işarələri düzgün qoyulubmu? (düzgün, səhv)" + RULE_N2, "səhv")); });
  UMUM.forEach(([t, a]) => addY("«" + t + "» — nöqtələrin yerinə hansı işarə qoyulmalıdır? (qoşa nöqtə, tire, vergül, defis) — dərsliyə görə: ümumiləşdirici söz həmcins üzvlərdən əvvəl olarsa, ondan sonra qoşa nöqtə; sonra olarsa, ondan əvvəl tire; dialoqda replikadan əvvəl tire; mürəkkəb sözün tərkib hissələri arasında defis.", a));
  const RULE_D = " — dərsliyə görə: dialoqda müəllifin sözündən sonra qoşa nöqtə qoyulur, yeni sətirdən yazılan replikadan əvvəl tire qoyulur, replikalar dırnaqsızdır, hər replikanın sonunda öz cümləsinin işarəsi durur.";
  [[DIA, true], [DIA5, true], [DIA0, false]].forEach(([arr, au]) => arr.forEach(d => {
    addY("Dialoqun durğu işarələri düzgündürmü? (düzgün, səhv)\n" + diaOk(d, au).join("\n") + RULE_D, "düzgün");
    diaTarget(d, au).forEach(i => { const { lines } = diaBreakAt(d, au, [i]); addY("Dialoqun durğu işarələri düzgündürmü? (düzgün, səhv)\n" + lines.join("\n") + RULE_D, "səhv"); });
  }));
  UZV.forEach(s => {
    const sent = s.map(x => x.w).join(" ") + ".";
    s.forEach(x => addY("«" + sent + "» cümləsində “" + x.w + "” hansı cümlə üzvüdür? (mübtəda, xəbər, tamamlıq, təyin, zərflik) — dərsliyə görə: tamamlıq kimi? nəyi? kimə? nəyə? suallarına, təyin hansı? necə? suallarına, zərflik necə? nə vaxt? harada? suallarına cavab verir.", UG[x.g]));
  });
  FIKIR_DUZ.forEach(x => addY("Bu fikir doğrudurmu? (doğru, səhv): " + x, "doğru"));
  FIKIR_SEHV.forEach(x => addY("Bu fikir doğrudurmu? (doğru, səhv): " + x, "səhv"));
  Object.entries(MEANW).forEach(([c, m]) => addY("“" + c + "” bağlayıcısı hansı mənanı bildirir? (qarşılaşdırma, bölüşdürmə, birləşdirmə, aydınlaşdırma, inkarlıq)", m));
  window.__yoxla = YOX;
  window.__levels = levels;
  window.__bank = { QS, END, VN, CN, UMUM, DIA, DIA5, DIA0, UZV, FIKIR_DUZ, FIKIR_SEHV };

  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-murekkeb-cumle", title: "Mürəkkəb cümlə və durğu işarələri", fenn: "azdili", link: "dersler/az-murekkeb-cumle.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər cümləni mübtəda–xəbər cütlərinə və durğu qaydalarına görə yoxla.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["esas", "sade", "nov", "vasite", "sonu", "vergul", "nitq", "dialoq", "tehlil", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-murekkeb-cumle.html")) b.push("dersler/az-murekkeb-cumle.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
