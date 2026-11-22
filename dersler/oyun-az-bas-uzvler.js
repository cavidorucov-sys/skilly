// Azərbaycan dili · Sintaktik əlaqələr və baş üzvlər — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: 8-ci sinif (2023), s. 41 (sintaktik əlaqə, tabesizlik), s. 45–46 (tabelilik, uzlaşma nümunəsi), s. 58 (cümlə üzvü),
// s. 69–73 (mübtəda və xəbər üzrə təkrar tapşırıqlar); 5-ci sinif, 2-ci hissə (2024), s. 100–101 (cümlə üzvləri, baş üzvlər,
// qrammatik əsas, mübtəda, xəbər); 6-cı sinif, 1-ci hissə (2025), s. 23, 28, 50; 7-ci sinif (köməkçi), 1-ci hissə, s. 47;
// 2-ci hissə, s. 50, 59, 65, 71 (xəbər növləri, var/yox/lazım/mümkün, deyil). Bankdakı hər cümlə yalnız bir cür təhlil olunur:
// mübtəda və xəbəri birmənalıdır. Bankda qəsdən olmayanlar: ikinci dərəcəli üzvlərin növləri, həmcins üzvlər, xitab, idi/imiş/isə,
// "çünki"-li (tabeli) mürəkkəb cümlələr, insan bildirən cəm mübtədanın tək xəbərlə işləndiyi cümlələr (uzlaşmanın mübahisəli halları).
(function () {
  const h = Oyun.h;
  const LET = /[\p{L}\d]/u;
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
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  // *…* arasındakı hissələr qalın və altdan xətli
  const mark = s => h("span", {}, ...s.split("*").map((p, i) => i % 2 ? h("u", {}, h("b", {}, p)) : p));
  const unstar = s => s.replace(/\*/g, "");
  const cap = s => s.charAt(0).toLocaleUpperCase("az") + s.slice(1);

  // ---- əsas bank: cümlə. ":M" — mübtəda, ":X" — xəbər; "_" iki sözdən ibarət bir vahiddir.
  // mv — mübtədanın ifadəsi: I isim, E əvəzlik, T isimləşmiş söz, D məsdər tərkibi, B ismi birləşmə
  // xv — xəbərin növü: F feili, I ismi; xs — ismi xəbərin ifadəsi: Is isim, Sf sifət, Sy say, Ev əvəzlik, Zr zərf, Md məsdər
  // fl: O — obyekt mübtəda yerindədir; Fr — xəbər frazeoloji birləşmədir
  const ES = [
    ["Dünən qardaşım:M yeni kitab aldı:X .", "I", "F"],
    ["Qatar:M stansiyaya yavaş-yavaş yaxınlaşırdı:X .", "I", "F"],
    ["Nənəm:M bağda qırmızı güllər əkdi:X .", "I", "F"],
    ["Yazıçı:M tamaşaçıları salamladı:X .", "I", "F"],
    ["Dayımgil:M Bakıya köçdü:X .", "I", "F"],
    ["Zərifə:M məktəbdən qayıtdı:X .", "I", "F"],
    ["O:M , avtobusdan düşdü:X .", "E", "F"],
    ["Yazda havalar:M isinir:X .", "I", "F"],
    ["Bu_gün hava:M istidir:X .", "I", "I", "Sf"],
    ["Bərdə:M qədim şəhərdir:X .", "I", "I", "Is"],
    ["Axşam şagirdlər:M zalda direktoru xeyli gözlədilər:X .", "I", "F"],
    ["Biz:M kitabxanadan yeni kitabları götürdük:X .", "E", "F"],
    ["Dənizdən hər gün neft:M çıxarılır:X .", "I", "F", null, "O"],
    ["Məktub:M dünən göndərildi:X .", "I", "F", null, "O"],
    ["Bağda yeni ağaclar:M əkildi:X .", "I", "F", null, "OTy"],
    ["Şəhərdə yeni körpü:M tikildi:X .", "I", "F", null, "OTy"],
    ["Birinci:M finişə çatdı:X .", "T", "F"],
    ["Çalışan:M qazanar:X .", "T", "F"],
    ["Oxumaq:M hamı üçün vacibdir:X .", "D", "I", "Sf"],
    ["Vətəni:M qorumaq:M borcumuzdur:X .", "D", "I", "Is"],
    ["Öz:M işində:M peşəkar:M olmaq:M hamı üçün vacibdir:X .", "D", "I", "Sf"],
    ["Maşının:M sürəti:M getdikcə azalırdı:X .", "B", "F"],
    ["Ağacın:M budaqları:M əyilmişdi:X .", "B", "F"],
    ["Arifin:M bacısı:M kitabxanaya getdi:X .", "B", "F"],
    ["Bu rəfdəki kitablar:M mənimdir:X .", "I", "I", "Ev", "Ty"],
    ["Azərbaycan:M musiqisinin:M tacı:M muğamdır:X .", "B", "I", "Is"],
    ["O:M , həmişə birincidir:X .", "E", "I", "Sy"],
    ["Xoşbəxt günlərimiz:M irəlidədir:X .", "I", "I", "Zr", "Ty"],
    ["Rəfiqəmin:M qardaşı:M çox nadincdir:X .", "B", "I", "Sf"],
    ["Musiqi:M notlarının:M sayı:M yeddidir:X .", "B", "I", "Sy"],
    ["Əqrəbin:M adəti:M sancmaqdır:X .", "B", "I", "Md"],
    ["Sən:M sabah bizə gələcəksən:X .", "E", "F"],
    ["Mən:M sənin məktubunu aldım:X .", "E", "F"],
    ["Uşaqlar:M parkda oynayırdılar:X .", "I", "F"],
    ["Gəmi:M dayandı:X .", "I", "F"],
    ["Bu çanta:M ağırdır:X .", "I", "I", "Sf", "Ty"],
    ["Bu alma:M şirindir:X .", "I", "I", "Sf", "Ty"],
    ["Uşaqlar:M nağıla diqqətlə qulaq:X asırdılar:X .", "I", "F", null, "Fr"],
    ["Qatar:M gecəyarısı yola:X düşdü:X .", "I", "F", null, "Fr"],
    ["Uşaq:M bu məsələnin üzərində xeyli baş:X sındırdı:X .", "I", "F", null, "Fr"],
    ["Bu xəbər:M dillər:X əzbəridir:X .", "I", "I", null, "FrTy"],
  ].map(([s, mv, xv, xs, fl]) => {
    const toks = s.split(" ").map(t => { const m = t.match(/^(.+):([MX])$/); return { w: (m ? m[1] : t).replace(/_/g, " "), r: m ? m[2] : null }; });
    const m = [], x = [];
    toks.forEach((t, i) => { if (t.r === "M") m.push(i); if (t.r === "X") x.push(i); });
    const plain = toks.map((t, i) => (i && LET.test(t.w) ? " " : "") + t.w).join("");
    const ws = toks.map((t, i) => i).filter(i => LET.test(toks[i].w));
    return { toks, m, x, mv, xv, xs, fl, plain, ws, mw: m.map(i => toks[i].w).join(" "), xw: x.map(i => toks[i].w).join(" ") };
  });
  const ESMV = ES.filter(e => e.mv && !(e.fl || "").includes("Ty"));          // mübtədanın ifadəsi birmənalı olanlar
  const ES1 = ES.filter(e => e.m.length === 1 && e.x.length === 1 && !(e.fl || "").includes("Ty"));           // hər biri bir sözdən ibarət baş üzvlər
  const withMark = (e, idx) => h("span", {}, ...e.toks.map((t, j) => [j && LET.test(t.w) ? " " : "", idx.includes(j) ? h("u", {}, h("b", {}, t.w)) : t.w]));
  const MVL = { I: "isim", E: "əvəzlik", T: "isimləşmiş söz (isimləşmiş sifət, say və ya feili sifət)", D: "məsdər və ya məsdər tərkibi", B: "ismi birləşmə" };
  const XSN = { Is: "isim", Sf: "sifət", Sy: "say", Ev: "əvəzlik", Zr: "zərf", Md: "məsdər" };
  const MVSOL = { I: "isimdir (kim? nə?)", E: "əvəzlikdir (ismin yerində işlənir)", T: "isimləşmiş sözdür (sifət, say və ya feili sifət isim kimi işlənib)", D: "məsdər tərkibidir (məsdər feilin təsriflənməyən formasıdır)", B: "ismi birləşmədir (iki söz bir mübtəda kimi çıxış edir)" };
  const XNOV = { F: "feili xəbər", I: "ismi xəbər" };
  const wordSual = (e, i) => e.xv === "F" ? "nə edir? nə etdi?" : "necədir? kimdir? nədir?";

  // ---- sintaktik əlaqə: tabesizlik (8-ci sinif, s. 41) və tabelilik (s. 46)
  const TS = [
    ["*Səbinə və Lalə* məktəbə getdilər.", "bərabərhüquqlu sözlərdir (həmcins mübtədalar): biri digərindən asılı deyil, hər ikisi «getdilər» sözü ilə əlaqələnir"],
    ["*Qardaşım və mən* gəzintiyə çıxmaq istədik.", "bərabərhüquqlu sözlərdir: «və» ilə bağlanıb, biri digərindən asılı deyil"],
    ["Çantaya *dəftər və qələm* qoydum.", "həmcins üzvlərdir: «və» ilə bağlanıb, biri digərindən asılı deyil"],
    ["Bağda *alma, armud, heyva* əkdik.", "həmcins üzvlərdir: vergüllə sadalanıb, biri digərindən asılı deyil"],
    ["Həyətdə uşaqlar *oynayır, gülür və əylənirlər*.", "həmcins xəbərlərdir: eyni mübtədaya aiddir, biri digərindən asılı deyil"],
    ["*Yağış yağırdı*, amma *biz evə qayıtmadıq*.", "iki cümlə arasında tabesizlik əlaqəsidir: «amma» tabesizlik bağlayıcısıdır"],
    ["*Kitabı oxudum*, lakin *məzmununu unutdum*.", "iki cümlə arasında tabesizlik əlaqəsidir: «lakin» tabesizlik bağlayıcısıdır"],
    ["*Anam çay hazırladı*, *atam qəzet oxudu*.", "iki cümlə arasında tabesizlik əlaqəsidir: onlar bərabərhüquqludur"],
  ];
  // SK: [cümlə, tabelilik əlaqəsini yaradan şəkilçi: H hal, M mənsubiyyət, X xəbərlik, izah]
  const SK = [
    ["Uşaq *evə gəldi*.", "H", "«evə» sözündəki yönlük hal şəkilçisi onu «gəldi» sözündən asılı edir"],
    ["Şagirdlər *həyətdə oynadılar*.", "H", "«həyətdə» sözündəki yerlik hal şəkilçisi onu «oynadılar» sözündən asılı edir"],
    ["Qardaşım *məktəbdən qayıtdı*.", "H", "«məktəbdən» sözündəki çıxışlıq hal şəkilçisi onu «qayıtdı» sözündən asılı edir"],
    ["Atam *bağa getdi*.", "H", "«bağa» sözündəki yönlük hal şəkilçisi onu «getdi» sözündən asılı edir"],
    ["Maestro *Türkiyədən qayıtmışdı*.", "H", "«Türkiyədən» sözündəki çıxışlıq hal şəkilçisi onu «qayıtmışdı» sözündən asılı edir (8-ci sinif, s. 45–46)"],
    ["Sahildə *dərs kitabı* unudulmuşdu.", "M", "«kitabı» sözündəki mənsubiyyət şəkilçisi «dərs» sözünü ona bağlayır"],
    ["*Ana dili* hər kəsə əzizdir.", "M", "«dili» sözündəki mənsubiyyət şəkilçisi «ana» sözünü ona bağlayır"],
    ["*Tarix dərsi* başladı.", "M", "«dərsi» sözündəki mənsubiyyət şəkilçisi «tarix» sözünü ona bağlayır"],
    ["Bu *ev işi* çətindir.", "M", "«işi» sözündəki mənsubiyyət şəkilçisi «ev» sözünü ona bağlayır"],
    ["*Bağ qapısı* bağlıdır.", "M", "«qapısı» sözündəki mənsubiyyət şəkilçisi «bağ» sözünü ona bağlayır"],
    ["*Lalə müəllimdir*.", "X", "«müəllimdir» sözündəki xəbərlik şəkilçisi onu mübtəda ilə bağlayır"],
    ["*Biz tələbəyik*.", "X", "«tələbəyik» sözündəki xəbərlik şəkilçisi onu mübtəda ilə bağlayır"],
    ["Bu *alma şirindir*.", "X", "«şirindir» sözündəki xəbərlik şəkilçisi onu mübtəda ilə bağlayır"],
    ["*Hava soyuqdur*.", "X", "«soyuqdur» sözündəki xəbərlik şəkilçisi onu mübtəda ilə bağlayır"],
  ];
  const SKT = SK.filter(e => e[1] !== "X");      // "tabesizlik/tabelilik" sualında mübtəda–xəbər cütü yoxdur (uzlaşma ilə qarışmasın)
  const SKN = { H: "ismin hal şəkilçisi", M: "mənsubiyyət şəkilçisi", X: "xəbərlik şəkilçisi" };

  // ---- uzlaşma: xəbər mübtəda ilə şəxsə və kəmiyyətə görə uzlaşır
  const PERS = ["Mən", "Sən", "O", "Biz", "Siz", "Onlar"];
  const PLOC = ["I şəxsin təkində", "II şəxsin təkində", "III şəxsin təkində", "I şəxsin cəmində", "II şəxsin cəmində", "III şəxsin cəmində"];
  const PNAME = ["I şəxsin təki", "II şəxsin təki", "III şəxsin təki", "I şəxsin cəmi", "II şəxsin cəmi", "III şəxsin cəmi"];
  const UV = [
    ["hər gün kitabxanaya", ["gedirəm", "gedirsən", "gedir", "gedirik", "gedirsiniz", "gedirlər"]],
    ["dünən parka", ["getdim", "getdin", "getdi", "getdik", "getdiniz", "getdilər"]],
    ["bu gün çox", ["çalışdım", "çalışdın", "çalışdı", "çalışdıq", "çalışdınız", "çalışdılar"]],
    ["hər gün kitab", ["oxuyuram", "oxuyursan", "oxuyur", "oxuyuruq", "oxuyursunuz", "oxuyurlar"]],
    ["sabah dərsə", ["gələcəyəm", "gələcəksən", "gələcək", "gələcəyik", "gələcəksiniz", "gələcəklər"]],
    ["dünən bu şeiri", ["əzbərlədim", "əzbərlədin", "əzbərlədi", "əzbərlədik", "əzbərlədiniz", "əzbərlədilər"]],
    ["", ["müəlliməm", "müəllimsən", "müəllimdir", "müəllimik", "müəllimsiniz", "müəllimdirlər"]],
    ["", ["şagirdəm", "şagirdsən", "şagirddir", "şagirdik", "şagirdsiniz", "şagirddirlər"]],
    ["", ["həkiməm", "həkimsən", "həkimdir", "həkimik", "həkimsiniz", "həkimdirlər"]],
  ];
  // III şəxsin təki ilə cəmi arasındakı "tək/cəm" çalarları qəsdən çıxarılıb: yalnız şəxs və aşkar kəmiyyət uyğunsuzluğu
  const uzPool = i => [0, 1, 2, 3, 4, 5].filter(j => j !== i && !(i === 5 && j === 2) && !(i === 2 && j === 5));
  const uzSent = (i, u, form) => PERS[i] + (i === 2 ? ", " : " ") + (u[0] ? u[0] + " " : "") + form + ".";
  const UZ_OK = [
    "Mən hər gün kitabxanaya gedirəm.", "Sən dünən parka getdin.", "Biz bu gün çox çalışdıq.", "Siz hər gün kitab oxuyursunuz.",
    "O, sabah bizə gələcək.", "Onlar dünən parka getdilər.", "Biz sabah kitabxanaya gedəcəyik.", "Sən bu şeiri əzbərlədin.",
    "Siz imtahana yaxşı hazırlaşmısınız.", "Mən bu şeiri əzbərlədim.", "Onlar bu gün çox çalışdılar.",
  ];
  const UZ_BAD = [
    "Mən hər gün kitabxanaya gedirsən.", "Biz dünən parka getdim.", "Sən bu gün çox çalışdıq.", "Siz hər gün kitab oxuyuruq.",
    "Mən bu şeiri əzbərlədin.", "Biz sabah kitabxanaya gedəcəksiniz.", "Onlar dünən parka getdim.", "Siz imtahana yaxşı hazırlaşmışıq.",
    "Sən hər gün kitabxanaya gedirik.", "Siz bu şeiri əzbərlədik.",
  ];

  // ---- var, yox, lazım, gərək, mümkün (7-ci sinif, 2-ci hissə, s. 59); ":X" — xəbər
  const VY = [
    ["Bu məsələnin çox asan həll_yolu var:X .", "var"],
    ["Hər bir işə məsuliyyətlə yanaşmaq lazımdır:X .", "lazım"],
    ["Daha sənə sözüm yox:X .", "yox"],
    ["Bu məsələni yalnız bir üsulla həll_etmək mümkündür:X .", "mümkün"],
    ["Yarışda qalib_gəlmək üçün bizə bircə xal lazımdır:X .", "lazım"],
    ["Hər qaranlıq gecənin bir işıqlı səhəri var:X .", "var"],
    ["Evdə heç kim yoxdur:X .", "yox"],
    ["Bağçada çoxlu gül var:X .", "var"],
    ["İmtahana hazırlaşmaq üçün çox vaxt lazımdır:X .", "lazım"],
    ["Bu işi tezliklə bitirmək gərəkdir:X .", "gərək"],
  ].map(([s, k]) => {
    const toks = s.split(" ").map(t => { const m = t.match(/^(.+):X$/); return { w: (m ? m[1] : t).replace(/_/g, " "), x: !!m }; });
    const plain = toks.map((t, i) => (i && LET.test(t.w) ? " " : "") + t.w).join("");
    return { toks, k, plain, x: toks.map((t, i) => t.x ? i : -1).filter(i => i >= 0), xw: toks.find(t => t.x).w };
  });
  // feili xəbərin inkarı və ismi xəbərin təsdiqi — "deyil" tapşırığının yanlış variantları
  const FI = ["Qardaşım bu filmi görmədi.", "Biz dərsə gecikmədik.", "Uşaq süd içmədi.", "Sən məktubu oxumadın.", "Mən bu kitabı almadım.", "Nənəm bağa getmədi."];
  // DEYIL: [cümlə, "deyil"dən əvvəlki söz, növü, xəbər]
  const DY = [
    ["Bu kitab mənim deyil.", "mənim", "əvəzlik", "mənim deyil"],
    ["Qarşılaşdığım problem mənim üçün yeni deyil.", "yeni", "sifət", "yeni deyil"],
    ["O, həkim deyil.", "həkim", "isim", "həkim deyil"],
    ["Bu iş çətin deyil.", "çətin", "sifət", "çətin deyil"],
    ["Mənim işim danışmaq deyil.", "danışmaq", "məsdər", "danışmaq deyil"],
    ["O, tez inciyən deyil.", "inciyən", "feili sifət", "inciyən deyil"],
  ];
  const DYN = ["isim", "sifət", "əvəzlik", "məsdər", "feili sifət"];

  // ---- feili xəbərin şəkli (7-ci sinif, 2-ci hissə, s. 59; 1-ci hissə, s. 47)
  const FS = [
    ["Onlar Vətən uğrunda *döyüşürdülər*.", "xəbər"],
    ["Fidan oxuduğu kitaba rəy *yazdı*.", "xəbər"],
    ["O da bizimlə səyahətə *getməlidir*.", "vacib"],
    ["Sabahkı tədbirə hamı *gəlməlidir*.", "vacib"],
    ["Təki gözəl günlər *görəsən*.", "arzu"],
    ["Kaş ki o da işinə məsuliyyətlə *yanaşa*.", "arzu"],
    ["Sabah dostumun ad gününə *gedəsiyəm*.", "lazım"],
    ["Gələn il əsgərliyə *gedəsisən*.", "lazım"],
    ["Bu barədə heç kəsə bir söz *demə*.", "əmr"],
    ["Sən də bizimlə *gəl*.", "əmr"],
    ["Nənəm bağda gül *əkdi*.", "xəbər"],
    ["Biz dünən teatra *getdik*.", "xəbər"],
    ["Uşaqlar, sakit *oturun*.", "əmr"],
    ["Kaş ki yaz tez *gələ*.", "arzu"],
    ["Biz bu işi tezliklə *bitirməliyik*.", "vacib"],
    ["Sabah xəstəxanaya *gedəsisən*.", "lazım"],
    ["Hər kəs vaxtında nahara *gəlməlidir*.", "vacib"],
    ["Qardaşım, pəncərəni *bağla*.", "əmr"],
    ["Sən bu kitabı *oxu*.", "əmr"],
    ["Nənəm gecə uşaqlara nağıl *danışdı*.", "xəbər"],
    ["Təki sən bu imtahandan yaxşı bal *toplayasan*.", "arzu"],
  ].map(([s, k]) => ({ s, k, w: s.match(/\*([^*]+)\*/)[1], plain: unstar(s) }));
  const FSN = ["xəbər", "əmr", "arzu", "lazım", "vacib"].map(k => k + " şəkli");
  const FSWHY = { "xəbər": "xəbər şəklidir: iş indi, əvvəl və ya sonra baş verir/verəcək, bildirilir", "əmr": "əmr şəklidir: tələb, xahiş, əmr bildirir", "arzu": "arzu şəklidir: istək, arzu bildirir", "lazım": "lazım şəklidir: hərəkətin lazım olduğunu bildirir (-ası, -əsi)", "vacib": "vacib şəklidir: hərəkətin vacib olduğunu bildirir (-malı, -məli)" };

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "elaqe", ad: "Sintaktik əlaqə", izah: "Tabesizlikdə sözlər bərabərhüquqludur (həmcins üzvlər, cümlələr); tabelilikdə biri digərindən asılıdır — çox vaxt hal, mənsubiyyət və ya xəbərlik şəkilçisi ilə.",
      gen() {
        const mode = R(3);
        if (mode === 0) { const e = pick(TS), o = ["tabesizlik əlaqəsi", "tabelilik əlaqəsi"];
          return { text: h("span", {}, "Fərqləndirilmiş sözlər (hissələr) arasında hansı sintaktik əlaqə var?", line(mark(e[0]))), choices: o, correct: 0, show: o[0], solution: "Fərqləndirilmiş sözlər " + e[1] + " → tabesizlik əlaqəsi." }; }
        if (mode === 1) { const e = pick(SKT), o = ["tabesizlik əlaqəsi", "tabelilik əlaqəsi"];
          return { text: h("span", {}, "Fərqləndirilmiş sözlər (hissələr) arasında hansı sintaktik əlaqə var?", line(mark(e[0]))), choices: o, correct: 1, show: o[1], solution: "Sözlərdən biri digərindən asılıdır: " + e[2] + " → tabelilik əlaqəsi." }; }
        const e = pick(SK), o = ["ismin hal şəkilçisi", "mənsubiyyət şəkilçisi", "xəbərlik şəkilçisi"], c = ["H", "M", "X"].indexOf(e[1]);
        return { text: h("span", {}, "Fərqləndirilmiş sözlər arasında tabelilik əlaqəsini hansı şəkilçi yaradır?", line(mark(e[0]))), choices: o, correct: c, show: o[c], solution: cap(e[2]) + "." };
      } },
    { id: "uzlasma", ad: "Uzlaşma", izah: "Xəbər mübtəda ilə şəxsə və kəmiyyətə görə uzlaşır: Mən — gedirəm, Biz — gedirik, Onlar — gedirlər.",
      gen() {
        const i = pick([0, 1, 2, 3, 4, 5]), u = pick(UV), f = u[1], wr = sample(uzPool(i), 4), ch = shuffle([i, ...wr]);
        return { text: h("span", {}, "Mübtədaya uyğun xəbər formasını seç:", line(uzSent(i, u, "____"))), choices: ch.map(j => f[j]), correct: ch.indexOf(i), show: f[i],
          solution: "Mübtəda «" + PERS[i].toLowerCase() + "» " + PLOC[i] + "dir, xəbər də " + PNAME[i] + " formasında olmalıdır: " + uzSent(i, u, f[i]) };
      } },
    { id: "esas", ad: "Cümlənin qrammatik əsası", izah: "Mübtəda: kim? nə? Xəbər: mübtəda haqqında hərəkət və ya hökm (nə etdi? necədir? nədir?). Mübtəda və xəbər cümlənin qrammatik əsasını təşkil edir.",
      gen() {
        const mode = R(4);
        if (mode === 3) {
          const e = pick(ES.filter(x => x.m.length <= 2 && x.x.length <= 2 && x.ws.length >= 4 && !x.toks.some(t => /\s/.test(t.w)))), ws = e.ws;
          const qrup = ["mübtəda", "xəbər", "digər sözlər"];
          return { text: "«" + e.plain + "» — sözləri cümlədəki rola görə qruplara ayır.", bol: { soz: ws.map(i => e.toks[i].w), qrup, duz: ws.map(i => e.m.includes(i) ? 0 : e.x.includes(i) ? 1 : 2) },
            show: "mübtəda: " + e.mw + "; xəbər: " + e.xw, solution: "Mübtəda — «" + e.mw + "» (kim? nə?), xəbər — «" + e.xw + "» (mübtəda haqqında " + (e.xv === "F" ? "hərəkət" : "hökm") + " bildirir). Qalan sözlər baş üzv deyil." };
        }
        const e = pick(ES1), soz = e.toks.map(t => t.w), mi = e.m[0], xi = e.x[0];
        const what = [["mübtədasına", [mi]], ["xəbərinə", [xi]], ["qrammatik əsasını təşkil edən iki sözə", [mi, xi].sort((a, b) => a - b)]][mode];
        const tail = (e.fl || "").includes("O") ? " Hərəkət «" + soz[mi] + "» sözünə yönəlib, amma cümlədə haqqında danışılan odur — nə? sualına cavab verir, ona görə mübtədadır." : "";
        return { text: "Cümlənin " + what[0] + " toxun.", sec: { soz, duz: what[1] }, show: what[1].map(i => soz[i]).join(", "),
          solution: "Mübtəda — «" + soz[mi] + "» (kim? nə?). Xəbər — «" + soz[xi] + "» (mübtəda haqqında " + (e.xv === "F" ? "hərəkət: " : "hökm: ") + wordSual(e) + "). Bu ikisi cümlənin qrammatik əsasıdır." + tail };
      } },
    { id: "ifade", ad: "Mübtədanın ifadə vasitəsi", izah: "Mübtəda isimlə, əvəzliklə, isimləşmiş sözlə, məsdər tərkibi və ya ismi birləşmə ilə ifadə oluna bilər.",
      gen() {
        const e = pick(ESMV), o = ["I", "E", "T", "D", "B"].map(k => MVL[k]);
        return { text: h("span", {}, "Cümlənin mübtədası nə ilə ifadə olunub?", line(withMark(e, e.m))), choices: o, correct: ["I", "E", "T", "D", "B"].indexOf(e.mv), show: MVL[e.mv],
          solution: "«" + e.mw + "» — " + MVSOL[e.mv] + "." };
      } },
    { id: "xeber", ad: "Feili və ismi xəbər", izah: "Feili xəbər hərəkət bildirir və feilin təsriflənən formaları ilə ifadə olunur; ismi xəbər hökm bildirir və xəbərlik şəkilçisi qəbul etmiş sözlərlə ifadə olunur.",
      gen() {
        if (R(2)) { const e = pick(ES), o = ["feili xəbər", "ismi xəbər"];
          return { text: h("span", {}, "Fərqləndirilmiş xəbər feili, yoxsa ismi xəbərdir?", line(withMark(e, e.x))), choices: o, correct: e.xv === "F" ? 0 : 1, show: XNOV[e.xv],
            solution: "«" + e.xw + "» — " + (e.xv === "F" ? "hərəkət bildirir, feilin təsriflənən formasıdır → feili xəbər." : "hökm bildirir, xəbərlik şəkilçisi qəbul edib → ismi xəbər.") + ((e.fl || "").includes("Fr") ? " Xəbər frazeoloji birləşmədir; yenə də " + XNOV[e.xv] + " sayılır." : "") }; }
        const e = pick(ES.filter(x => x.xs && !(x.fl || "").includes("Fr"))), k = ["Is", "Sf", "Sy", "Ev", "Zr", "Md"], o = k.map(c => XSN[c]);
        return { text: h("span", {}, "İsmi xəbər nə ilə ifadə olunub?", line(withMark(e, e.x))), choices: o, correct: k.indexOf(e.xs), show: XSN[e.xs],
          solution: "«" + e.xw + "» — " + XSN[e.xs] + " + xəbərlik şəkilçisi → ismi xəbər, " + XSN[e.xs] + " ilə ifadə olunub." };
      } },
    { id: "sekil", ad: "Feili xəbərin şəkli", izah: "Feili xəbər feilin müxtəlif şəkilləri ilə ifadə olunur: xəbər, əmr, arzu, lazım, vacib.",
      gen() {
        const f = pick(FS), ch = shuffle(FSN);
        return { text: h("span", {}, "Fərqləndirilmiş feili xəbər feilin hansı şəklindədir?", line(mark(f.s))), choices: ch, correct: ch.indexOf(f.k + " şəkli"), show: f.k + " şəkli", solution: "«" + f.w + "» — " + FSWHY[f.k] + "." };
      } },
    { id: "ozel", ad: "Var, yox, lazım, mümkün, deyil", izah: "Var, yox, lazım, gərək, mümkün sözləri suala cavab vermədən ismi xəbər olur. İsmi xəbərin inkarı «deyil» sözü ilədir.",
      gen() {
        const mode = R(4);
        if (mode === 0) { const v = pick(VY), soz = v.toks.map(t => t.w);
          return { text: "Cümlənin xəbərinə toxun.", sec: { soz, duz: v.x }, show: v.xw, solution: "«" + v.xw + "» — " + v.k + " sözü suala cavab vermir, amma ismi xəbər kimi işlənir." }; }
        if (mode === 1) { const v = pick(VY), w = sample(ES, 4), a = AEq("Cümlələrin hansında xəbər suala cavab vermədən (var, yox, lazım, mümkün tipli sözlə) ifadə olunub?", v.plain, w.map(e => e.plain), "");
          if (!a) return this.gen();
          return { ...a, solution: "«" + v.plain + "» — xəbər «" + v.xw + "»dir, ayrıca suala cavab vermir. Qalan cümlələrin xəbəri sual verməklə tapılır (nə etdi? necədir? nədir?)." }; }
        if (mode === 2) { const d = pick(DY), w = sample([...FI, ...ES.filter(e => e.xv === "I").map(e => e.plain)], 4), a = AEq("Cümlələrin hansında ismi xəbərin inkarı işlənib?", d[0], w, "");
          if (!a) return this.gen();
          return { ...a, solution: "«" + d[0] + "» — ismi xəbərin inkarı «deyil» sözü ilə düzəlir. Digərləri ya feili xəbərin inkarıdır (-ma, -mə), ya da ismi xəbərin təsdiqidir." }; }
        const d = pick(DY);
        return { text: h("span", {}, "«deyil» sözü hansı sözə qoşulub?", line(d[0].replace(d[1], "\u0000").split("\u0000").flatMap((p, i, arr) => i < arr.length - 1 ? [p, h("u", {}, h("b", {}, d[1]))] : [p]))), choices: DYN, correct: DYN.indexOf(d[2]), show: d[2],
          solution: "«deyil» «" + d[1] + "» sözünə qoşulub; «" + d[1] + "» — " + d[2] + ". Xəbər — «" + d[3] + "»: ismi xəbərin inkarıdır." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümlənin baş üzvlərini təhlil edib. Üç bəndin biri səhvdir — hansı?",
      gen() {
        const e = pick(ES1.filter(x => x.ws.length >= 3)), mi = e.m[0], xi = e.x[0], W = i => e.toks[i].w;
        const others = e.ws.filter(i => i !== mi && i !== xi);
        const cl = [
          { ok: "mübtəda — " + W(mi), bad: () => "mübtəda — " + W(pick([...others, xi])), why: "Mübtəda — «" + W(mi) + "» (kim? nə?)" },
          { ok: "xəbər — " + W(xi), bad: () => "xəbər — " + W(pick([...others, mi])), why: "Xəbər — «" + W(xi) + "» (mübtəda haqqında " + (e.xv === "F" ? "hərəkət" : "hökm") + ")" },
          { ok: "xəbər " + (e.xv === "F" ? "feili" : "ismi") + " xəbərdir", bad: () => "xəbər " + (e.xv === "F" ? "ismi" : "feili") + " xəbərdir", why: "Xəbər " + (e.xv === "F" ? "feili" : "ismi") + " xəbərdir: " + (e.xv === "F" ? "hərəkət bildirir" : "hökm bildirir, xəbərlik şəkilçisi var") },
        ];
        if ((e.mv === "I" || e.mv === "E") && !(e.fl || "").includes("Ty")) cl.push({ ok: "mübtəda " + (e.mv === "I" ? "isimlə" : "əvəzliklə") + " ifadə olunub", bad: () => "mübtəda " + (e.mv === "I" ? "əvəzliklə" : "isimlə") + " ifadə olunub", why: "Mübtəda " + (e.mv === "I" ? "isimlə" : "əvəzliklə") + " ifadə olunub" });
        const c3 = sample(cl, 3), k = R(3), ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "«" + e.plain + "» — şagirdin təhlili: " + c3.map((c, j) => (j + 1) + ") " + (j === k ? c.bad() : c.ok)).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd", solution: "Düzgün: " + c3[k].why + ". Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  function AEq(text, right, wrong, solution) { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; }
  const FIKIR_DUZ = [
    "Tabesizlik əlaqəsində olan sözlərin biri digərinə tabe olmur.",
    "Tabesizlik əlaqəsi bərabərhüquqlu sözlər, həmcins üzvlər və cümlələr arasında olur.",
    "Tabelilik əlaqəsində olan sözlərdən biri digərindən asılı olur.",
    "Tabelilik əlaqəsi, adətən, ismin hal, mənsubiyyət və xəbərlik şəkilçiləri vasitəsilə yaranır.",
    "Xəbər, adətən, mübtəda ilə şəxsə və kəmiyyətə görə uzlaşır.",
    "Mübtəda və xəbər cümlənin baş üzvləridir.",
    "Baş üzvlər cümlənin qrammatik əsasını təşkil edir.",
    "Mübtəda cümlədə haqqında danışılan şəxsi, varlığı bildirir.",
    "Mübtəda kim? nə? (bəzən də hara?) sualına cavab verir.",
    "Xəbər mübtədaya aid hərəkət və ya hökmü bildirir.",
    "İfadə vasitələrinə görə xəbər iki növə ayrılır: feili xəbər və ismi xəbər.",
    "Feili xəbər feilin təsriflənən formaları ilə ifadə olunur.",
    "İsmi xəbər hökm bildirir və, adətən, xəbərlik şəkilçisi qəbul etmiş sözlərlə ifadə olunur.",
    "İsmi xəbərin inkarını bildirmək üçün deyil sözündən istifadə edilir.",
    "Yox, var, lazım, gərək, mümkün sözləri suala cavab vermədən ismi xəbər kimi işlənə bilir.",
    "Məsdər tərkibi mübtəda ola bilər.",
    "Mübtəda müxtəlif söz və birləşmələrlə ifadə oluna bilər.",
  ];
  const FIKIR_SEHV = [
    "Tabesizlik əlaqəsində olan sözlərdən biri digərindən asılı olur.",
    "Tabelilik əlaqəsində olan sözlər bərabərhüquqludur.",
    "Tabelilik əlaqəsi yalnız cümlələr arasında olur.",
    "Tabesizlik əlaqəsi ismin hal şəkilçiləri vasitəsilə yaranır.",
    "Mübtəda cümlədə hərəkət və ya hökmü bildirir.",
    "Xəbər cümlədə haqqında danışılan şəxsi, varlığı bildirir.",
    "Mübtəda və xəbər cümlənin ikinci dərəcəli üzvləridir.",
    "İsmi xəbər feilin təsriflənən formaları ilə ifadə olunur.",
    "İsmi xəbərin inkarını bildirmək üçün -ma, -mə şəkilçisindən istifadə edilir.",
    "Var, yox, lazım, mümkün sözləri xəbər vəzifəsində işlənə bilməz.",
    "Mübtəda yalnız isimlə ifadə olunur.",
    "Xəbər mübtəda ilə yalnız şəxsə görə uzlaşır, kəmiyyətə görə uzlaşmır.",
    "Hərəkətin keçdiyi varlıq (obyekt) heç vaxt mübtəda ola bilməz.",
    "Məsdər tərkibi mübtəda ola bilməz.",
    "Xəbər həmişə feillə ifadə olunur.",
  ];
  // cümlə haqqında fikirlər (yalnız bir sözdən ibarət baş üzvlü cümlələr)
  const profil = e => {
    const mi = e.m[0], xi = e.x[0], W = i => e.toks[i].w, others = e.ws.filter(i => i !== mi && i !== xi);
    const ok = ["mübtədası «" + W(mi) + "» sözüdür", "xəbəri «" + W(xi) + "» sözüdür", "qrammatik əsasını «" + W(mi) + "» və «" + W(xi) + "» sözləri təşkil edir", "xəbəri " + XNOV[e.xv] + "dir"];
    const bad = ["mübtədası «" + W(xi) + "» sözüdür", "xəbəri «" + W(mi) + "» sözüdür", "xəbəri " + XNOV[e.xv === "F" ? "I" : "F"] + "dir"];
    if (others.length) { bad.push("mübtədası «" + W(pick(others)) + "» sözüdür"); bad.push("xəbəri «" + W(pick(others)) + "» sözüdür"); }
    if ((e.fl || "").includes("Ty")) {} else if (e.mv === "I") { ok.push("mübtədası isimlə ifadə olunub"); bad.push("mübtədası əvəzliklə ifadə olunub"); }
    else if (e.mv === "E") { ok.push("mübtədası əvəzliklə ifadə olunub"); bad.push("mübtədası isimlə ifadə olunub"); }
    return [ok, bad];
  };
  const SYN_MIX = () => sample([...ES.filter(e => e.xv === "I"), ...ES.filter(e => e.xv === "F")], 5);

  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. qrammatik əsas
    { tip: "qapali", gen: () => Oyun.again(() => {
      const e = pick(ES1.filter(x => x.ws.length >= 4)), mi = e.m[0], xi = e.x[0], W = i => e.toks[i].w;
      const pairs = []; for (let a = 0; a < e.ws.length; a++) for (let b = a + 1; b < e.ws.length; b++) pairs.push([e.ws[a], e.ws[b]]);
      const fm = p => W(p[0]) + " – " + W(p[1]), right = [mi, xi].sort((a, b) => a - b), wrong = sample(pairs.filter(p => fm(p) !== fm(right)), 4);
      return AEq(h("span", {}, "Cümlənin qrammatik əsasını müəyyən edin:", line(e.plain)), fm(right), wrong.map(fm), "Mübtəda — «" + W(mi) + "» (kim? nə?), xəbər — «" + W(xi) + "». Qrammatik əsas: " + fm(right) + ". Digər variantlarda baş üzv olmayan söz var.");
    }) },
    // 2. mübtədanın ifadə vasitəsi
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["E", "D", "B"]), NAME = { E: "əvəzliklə", D: "məsdər və ya məsdər tərkibi ilə", B: "ismi birləşmə ilə" };
      const right = pick(ESMV.filter(e => e.mv === t)), wrong = sample(ESMV.filter(e => e.mv !== t && e.mv !== "T"), 4);
      return AEq("Cümlələrin hansında mübtəda " + NAME[t] + " ifadə olunub?", right.plain, wrong.map(e => e.plain),
        "«" + right.plain + "» — mübtəda «" + right.mw + "» " + MVSOL[t] + ". Qalan cümlələrdə mübtəda başqa vasitə ilə ifadə olunub: " + wrong.map(e => "«" + e.mw + "» (" + MVL[e.mv].split(" (")[0] + ")").join(", ") + ".");
    }) },
    // 3. xəbərin növü
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["F", "I"]), right = pick(ES.filter(e => e.xv === t)), wrong = sample(ES.filter(e => e.xv !== t), 4);
      return AEq("Cümlələrin hansında xəbər " + (t === "F" ? "feili xəbərdir" : "ismi xəbərdir") + "?", right.plain, wrong.map(e => e.plain),
        "«" + right.plain + "» — xəbər «" + right.xw + "»: " + (t === "F" ? "hərəkət bildirir → feili xəbər." : "hökm bildirir, xəbərlik şəkilçisi qəbul edib → ismi xəbər.") + " Qalan cümlələrin xəbəri " + (t === "F" ? "ismi" : "feili") + " xəbərdir.");
    }) },
    // 4. uzlaşma pozulub
    { tip: "qapali", gen: () => Oyun.again(() => {
      const bad = pick(UZ_BAD);
      return AEq("Cümlələrin hansında mübtəda ilə xəbər arasında uzlaşma pozulub?", bad, sample(UZ_OK, 4), "«" + bad + "» — xəbər mübtəda ilə şəxsə və ya kəmiyyətə görə uyğun deyil. Qalan cümlələrdə xəbər mübtəda ilə şəxsə və kəmiyyətə görə uzlaşır.");
    }) },
    // 5. nömrə kombinasiyası: ismi xəbər
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = SYN_MIX(), right = five.map((e, i) => e.xv === "I" ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrin xəbəri ismi xəbərdir?", ...five.map((e, i) => h("span", { style: "display:block" }, (i + 1) + ". " + e.plain))), ...o, show: o.choices[o.correct],
        solution: five.map((e, i) => (i + 1) + ") «" + e.xw + "» — " + XNOV[e.xv]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 6. nömrə kombinasiyası: mübtəda əvəzlik, ismi birləşmə, məsdər tərkibi
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["E", "B", "D"]), NAME = { E: "əvəzliklə", B: "ismi birləşmə ilə", D: "məsdər və ya məsdər tərkibi ilə" }, five = sample(ESMV.filter(e => e.mv !== "T"), 5);
      const right = five.map((e, i) => e.mv === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə mübtəda " + NAME[t] + " ifadə olunub?", ...five.map((e, i) => h("span", { style: "display:block" }, (i + 1) + ". " + e.plain))), ...o, show: o.choices[o.correct],
        solution: five.map((e, i) => (i + 1) + ") «" + e.mw + "» — " + MVL[e.mv].split(" (")[0]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 7. var, yox, lazım, mümkün
    { tip: "qapali", gen: () => Oyun.again(() => {
      const v = pick(VY), w = sample(ES, 4);
      return AEq("Cümlələrin hansında xəbər suala cavab vermədən ismi xəbər kimi işlənib?", v.plain, w.map(e => e.plain),
        "«" + v.plain + "» — xəbər «" + v.xw + "»dir; ayrıca suala cavab vermir, amma ismi xəbər olur. Qalan cümlələrin xəbəri sual verməklə tapılır.");
    }) },
    // 8. deyil
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (R(2)) { const d = pick(DY), w = sample([...FI, ...ES.filter(e => e.xv === "I").map(e => e.plain)], 4);
        return AEq("Cümlələrin hansında ismi xəbərin inkarı işlənib?", d[0], w, "«" + d[0] + "» — xəbər «" + d[3] + "»: ismi xəbərin inkarı «deyil» sözü ilə düzəlir. Qalanları feili xəbərin inkarı (-ma, -mə) və ya ismi xəbərin təsdiqidir."); }
      const d = pick(DY);
      return AEq(h("span", {}, "«deyil» sözü hansı sözə qoşulub?", line(d[0].replace(d[1], "\u0000").split("\u0000").flatMap((p, i, a) => i < a.length - 1 ? [p, h("u", {}, h("b", {}, d[1]))] : [p]))), d[2], DYN.filter(x => x !== d[2]), "«deyil» «" + d[1] + "» sözünə qoşulub: «" + d[1] + "» — " + d[2] + ". Xəbər — «" + d[3] + "».");
    }) },
    // 9. fikir (doğru/səhv)
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (R(2)) {
        if (R(2)) { const bad = pick(FIKIR_SEHV); return AEq("Sintaktik əlaqələr və baş üzvlər haqqında səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
        const ok = pick(FIKIR_DUZ); return AEq("Sintaktik əlaqələr və baş üzvlər haqqında doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
      }
      const e = pick(ES1), [ok, bad] = profil(e), W = "«" + e.plain + "» cümləsi";
      if (R(2)) { const b = pick(bad); return AEq(h("span", {}, W + " ilə bağlı səhv fikri müəyyən edin."), b, sample(ok, 4), "Cümlədə mübtəda — «" + e.mw + "», xəbər — «" + e.xw + "» (" + XNOV[e.xv] + "). Səhv fikir: " + b + "."); }
      const g = pick(ok); return AEq(h("span", {}, W + " ilə bağlı doğru fikri müəyyən edin."), g, sample(bad, 4), "Cümlədə mübtəda — «" + e.mw + "», xəbər — «" + e.xw + "» (" + XNOV[e.xv] + "). Doğru fikir: " + g + ".");
    }) },
    // 10. nömrə kombinasiyası: tabesizlik / tabelilik
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["tabesizlik", "tabelilik"]), pool = [...TS.map(x => ({ s: x[0], t: "tabesizlik" })), ...SKT.map(x => ({ s: x[0], t: "tabelilik" }))], five = sample(pool, 5);
      const right = five.map((x, i) => x.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə fərqləndirilmiş sözlər arasında " + t + " əlaqəsi var?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", mark(x.s)))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.t).join("; ") + ". Cavab: " + combo(right) + ". Tabesizlikdə sözlər bərabərhüquqludur (həmcins üzvlər, cümlələr), tabelilikdə biri digərindən asılıdır." };
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: bankdakı hər fakt müstəqil sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "b" + (++yn), sual, cavab });
  const RULE = " — dərslik qaydasına görə (5–8-ci siniflər): mübtəda kim? nə? (bəzən də hara?) sualına cavab verir; xəbər mübtəda haqqında hərəkət və ya hökm bildirir.";
  const ALLMV = "(isim, əvəzlik, isimləşmiş söz, məsdər və ya məsdər tərkibi, ismi birləşmə)";
  ES.forEach(e => {
    addY("«" + e.plain + "» cümləsinin mübtədası hansı söz (söz birləşməsi)dir? Cavabı cümlədəki yazılışı ilə yaz." + RULE, e.mw);
    addY("«" + e.plain + "» cümləsinin xəbəri hansı söz (söz birləşməsi)dir? Cavabı cümlədəki yazılışı ilə yaz." + RULE, e.xw);
    addY("«" + e.plain + "» cümləsinin xəbəri feili, yoxsa ismi xəbərdir? (feili xəbər, ismi xəbər) — feili xəbər hərəkət bildirir, feilin təsriflənən formaları ilə; ismi xəbər hökm bildirir, xəbərlik şəkilçisi qəbul etmiş sözlərlə ifadə olunur.", XNOV[e.xv]);
    if (ESMV.includes(e)) addY("«" + e.plain + "» cümləsində mübtəda «" + e.mw + "» nə ilə ifadə olunub? " + ALLMV + " — «isimləşmiş söz»: sifət, say və ya feili sifət isim kimi işlənəndə.", MVL[e.mv].split(" (")[0]);
    if (e.xs) addY("«" + e.plain + "» cümləsində ismi xəbər «" + e.xw + "» hansı sözlə ifadə olunub? (isim, sifət, say, əvəzlik, zərf, məsdər) — xəbərlik şəkilçisi qəbul etmiş söz hansı nitq hissəsindəndir.", XSN[e.xs]);
    if ((e.fl || "").includes("O")) addY("«" + e.plain + "» cümləsində mübtəda olan «" + e.mw + "» sözü hərəkətin icraçısıdır, yoxsa hərəkətin keçdiyi varlıqdır (obyekt)? (icraçı, obyekt)", "obyekt");
    if ((e.fl || "").includes("Fr")) addY("«" + e.plain + "» cümləsinin xəbəri frazeoloji birləşmə ilə ifadə olunubmu? (bəli, xeyr)", "bəli");
  });
  TS.forEach(e => addY("«" + unstar(e[0]) + "» cümləsində fərqləndirilmiş (ulduzlar arası: " + [...e[0].matchAll(/\*([^*]+)\*/g)].map(m => m[1]).join(" ... ") + ") sözlər (hissələr) arasında hansı sintaktik əlaqə var? (tabesizlik, tabelilik) — tabesizlikdə sözlər bərabərhüquqludur, biri digərindən asılı deyil.", "tabesizlik"));
  SK.forEach(e => {
    if (e[1] !== "X") addY("«" + unstar(e[0]) + "» cümləsində fərqləndirilmiş (ulduzlar arası: " + e[0].match(/\*([^*]+)\*/)[1] + ") sözlər arasında hansı sintaktik əlaqə var? (tabesizlik, tabelilik) — tabelilikdə biri digərindən asılıdır.", "tabelilik");
    addY("Cümlədə «" + e[0].match(/\*([^*]+)\*/)[1] + "» sözləri arasında tabelilik əlaqəsini hansı şəkilçi yaradır? (ismin hal şəkilçisi, mənsubiyyət şəkilçisi, xəbərlik şəkilçisi) — cümlə: «" + unstar(e[0]) + "».", SKN[e[1]]);
  });
  UV.forEach(u => [0, 1, 2, 3, 4, 5].forEach(i => addY("«" + uzSent(i, u, "…") + "» — boşluğa mübtədaya uyğun (şəxsə və kəmiyyətə görə uzlaşan) xəbər formasını seç: " + [i, ...uzPool(i)].sort((a, b) => a - b).map(j => u[1][j]).join(", ") + ".", u[1][i])));
  UZ_OK.forEach(s => addY("«" + s + "» cümləsində xəbər mübtəda ilə şəxsə və kəmiyyətə görə uzlaşırmı? (bəli, xeyr)", "bəli"));
  UZ_BAD.forEach(s => addY("«" + s + "» cümləsində xəbər mübtəda ilə şəxsə və kəmiyyətə görə uzlaşırmı? (bəli, xeyr)", "xeyr"));
  VY.forEach(v => {
    addY("«" + v.plain + "» cümləsinin xəbəri hansı sözdür? (yalnız bir söz)", v.xw);
    addY("«" + v.plain + "» cümləsinin xəbəri ayrıca suala cavab verirmi, yoxsa suala cavab vermədən ismi xəbər kimi işlənir? (cavab verir, cavab vermir)", "cavab vermir");
  });
  DY.forEach(d => {
    addY("«" + d[0] + "» cümləsində «deyil» sözü hansı sözə qoşulub? (isim, sifət, əvəzlik, məsdər, feili sifət)", d[2]);
    addY("«" + d[0] + "» cümləsində xəbər nə ilə ifadə olunub? (feili xəbər, ismi xəbər)", "ismi xəbər");
  });
  FI.forEach(s => addY("«" + s + "» cümləsində ismi xəbərin inkarı («deyil» ilə) işlənibmi? (bəli, xeyr) — cümlənin xəbəri feili xəbərdir.", "xeyr"));
  FS.forEach(f => addY("«" + f.plain + "» cümləsində xəbər («" + f.w + "») feilin hansı şəklindədir? (xəbər şəkli, əmr şəkli, arzu şəkli, lazım şəkli, vacib şəkli) — lazım: -ası/-əsi; vacib: -malı/-məli; arzu: -a/-ə (kaş ki, təki ilə); əmr: tələb, xahiş.", f.k + " şəkli"));
  FIKIR_DUZ.forEach(f => addY("Sintaktik əlaqələr və baş üzvlər haqqında (5–8-ci sinif dərslikləri) deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => addY("Sintaktik əlaqələr və baş üzvlər haqqında (5–8-ci sinif dərslikləri) deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "səhv"));
  window.__yoxla = YOX;

  window.__levels = levels;
  window.__bank = { ES, TS, SK, UV, VY, DY, FI, FS, FIKIR_DUZ, FIKIR_SEHV, UZ_OK, UZ_BAD };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-bas-uzvler", title: "Sintaktik əlaqələr və baş üzvlər", fenn: "azdili", link: "dersler/az-bas-uzvler.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Əvvəl xəbəri tap, sonra ona kim? nə? sualını ver.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["elaqe", "uzlasma", "esas", "esas", "ifade", "xeber", "sekil", "ozel", "ozel", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-bas-uzvler.html")) b.push("dersler/az-bas-uzvler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
