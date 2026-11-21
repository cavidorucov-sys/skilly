// Azərbaycan dili · Feil II: şəkillər; idi, imiş, isə — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: 7-ci sinif (köməkçi mənbə), 2-ci hissə, s. 35 (əmr, vacib), s. 40 (lazım, arzu), s. 46 (şərt, xəbər), s. 47 (təkrar);
// 6-cı sinif, 2-ci hissə (2025), s. 62 (xəbər vəzifəsində feillərin deyilişi və yazılışı); 5-ci sinif, 2-ci hissə (2024), s. 48–49
// (zaman, şəxs); 8-ci sinif (2023), s. 128 (idi, imiş, isə köməkçi sözləri — hissəciklər); 9-cu sinif (2024), s. 91 (isə sözündən
// əvvəl və sonra vergül qoyulmur). Suallar cümlə və söz bankından qurulur; bankdakı hər feil forması etiketlənib. Bankda qəsdən
// olmayanlar: təsriflənməyən formalar (feili sifət, feili bağlama, məsdər), məlum/məchul növlər, feilin zamanlarının incəlikləri
// (10-cu, 12-ci, 13-cü mövzular), "-ar" geniş zaman formaları, "kaş/qoy" olmadan I şəxsin cəmində -ək/-aq (əmr, yoxsa arzu?),
// "görəsən" (modal sözlə omonim), "gəlin" (isimlə omonim), idi/imiş-in feilə qoşulmuş forması (gəlirdi, gəlirmiş).
(function () {
  const h = Oyun.h;
  // ---- ad lüğətləri
  const MN = { X: "xəbər şəkli", A: "əmr şəkli", V: "vacib şəkli", L: "lazım şəkli", Z: "arzu şəkli", S: "şərt şəkli" };
  const MNLOC = { X: "xəbər şəklində", A: "əmr şəklində", V: "vacib şəklində", L: "lazım şəklində", Z: "arzu şəklində", S: "şərt şəklində" };
  const MNBE = { X: "xəbər şəklindədir", A: "əmr şəklindədir", V: "vacib şəklindədir", L: "lazım şəklindədir", Z: "arzu şəklindədir", S: "şərt şəklindədir" };
  const TN = { k: "keçmiş zaman", i: "indiki zaman", g: "gələcək zaman" };
  const PN = { 1: "I şəxsin təki", 2: "II şəxsin təki", 3: "III şəxsin təki", 4: "I şəxsin cəmi", 5: "II şəxsin cəmi", 6: "III şəxsin cəmi" };
  const ALLM = ["X", "A", "V", "L", "Z", "S"];
  // hər şəklin qısa izahı (7-ci sinif, 2-ci hissə, s. 35, 40, 46)
  const EXPL = {
    X: "xəbər şəkli: feilin kökünə zaman və şəxs şəkilçiləri artırılır",
    A: "əmr şəkli: əmr, xahiş, nəsihət bildirir; II şəxsin təkində şəxs şəkilçisi olmur (qoy, bax, di, ha ədatları ilə də işlənir)",
    V: "vacib şəkli: kökə -malı² və şəxs şəkilçisi artırılır, hərəkətin vacibliyini bildirir",
    L: "lazım şəkli: kökə -ası² və şəxs şəkilçisi artırılır, hərəkətin lazım olduğunu bildirir",
    Z: "arzu şəkli: kökə -a² və şəxs şəkilçisi artırılır (kaş, gərək, təki, barı ədatları ilə də işlənir), arzu bildirir",
    S: "şərt şəkli: kökə -sa² və şəxs şəkilçisi artırılır (əgər, hərgah ilə də işlənir), şərt bildirir",
  };

  // ---- köməkçi
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
  const row = (...k) => h("span", { style: "display:block" }, ...k);

  // ---- cümlə bankı: "söz:KOD"; "_" iki sözdən ibarət bir vahiddir; etiketsiz söz — feil (və ya köməkçi söz) deyil; durğu işarəsi ayrı sözdür.
  // KOD: feil üçün şəkil hərfi (A əmr, V vacib, L lazım, Z arzu, S şərt, Xk/Xi/Xg xəbər: keçmiş/indiki/gələcək) + şəxs (1–6: I təki, II təki,
  // III təki, I cəmi, II cəmi, III cəmi) + "-" (inkar); köməkçi söz üçün ID (idi), IM (imiş), IS (isə).
  const PUNCT = /^[.,!?;]$/;
  function tok(t) {
    if (PUNCT.test(t)) return { w: t, p: true };
    const m = t.match(/^(.+):(.+)$/);
    if (!m) return { w: t.replace(/_/g, " ") };
    const w = m[1].replace(/_/g, " "), c = m[2];
    if (c === "ID" || c === "IM" || c === "IS") return { w, hs: c };
    const k = c.match(/^([AVLZS]|X[kig])([1-6])(-?)$/);
    if (!k) throw new Error("pis kod: " + t);
    return { w, m: k[1][0], t: k[1][1] || null, pe: +k[2], neg: !!k[3] };
  }
  const parseBank = a => a.map(s => s.split(" ").map(tok));
  const FE = parseBank([
    // xəbər şəkli
    "Uşaqlar həyətdə oynayırlar:Xi6 .",
    "Mən dünən kitabı oxudum:Xk1 .",
    "Biz sabah kəndə gedəcəyik:Xg4 .",
    "Sən bu mövzuları artıq öyrənmişsən:Xk2 .",
    "Siz həmişə vaxtında gəlirsiniz:Xi5 .",
    "O hər gün səhər tezdən durur:Xi3 .",
    "Qonaqlar axşam çatacaqlar:Xg6 .",
    "Mən o filmə baxmayacağam:Xg1- .",
    "Bu ağacı babam əkib:Xk3 .",
    "Biz səhər erkən qalxmadıq:Xk4- .",
    "Sən nə vaxt çıxacaqsan:Xg2 ?",
    "Şagirdlər tapşırığı yazdılar:Xk6 .",
    "Qardaşım hər gün velosipedlə məktəbə gedir:Xi3 .",
    "Siz indi hara gedirsiniz:Xi5 ?",
    "Biz bu il yeni kitablar aldıq:Xk4 .",
    "Mən səni gözləyirəm:Xi1 .",
    "Onlar sabah Bakıya qayıdacaqlar:Xg6 .",
    // əmr şəkli
    "Sabah dərsə vaxtında çatın:A5 .",
    "Yalan danışma:A2- , həmişə düzünü de:A2 .",
    "Qoy ön sıralarda dursun:A3 .",
    "Başını el içində həmişə uca görüm:A1 .",
    "Qoy həmişə günəş olsun:A3 !",
    "Di tez olun:A5 , gecikirik:Xi4 .",
    "Qoy uşaqlar rahat oxusunlar:A6 .",
    "Sakit , təmkinlə , asta-asta danışın:A5 .",
    "Qoy sabah erkən çıxaq:A4 .",
    "Uşaqlar , həyətyanı sahəni təmizləyin:A5 .",
    "Dostlarını unutma:A2- .",
    "Tapşırığı diqqətlə oxuyun:A5 .",
    // vacib şəkli
    "Sən bu qaydaları əzbərləməlisən:V2 .",
    "Mən sabah dərsə vaxtında gəlməliyəm:V1 .",
    "Biz bu işi birlikdə görməliyik:V4 .",
    "Siz tapşırığı bu gün bitirməlisiniz:V5 .",
    "O da bizimlə səyahətə getməlidir:V3 .",
    "Onlar bu qaydaları təkrarlamalıdırlar:V6 .",
    "Biz bu sırada dayanmalı_deyilik:V4- , bura onların yeridir .",
    "Vətənin bir qarış torpağını da düşmənə verməməliyik:V4- .",
    "Sən belə danışmamalısan:V2- .",
    // lazım şəkli
    "Onlar sabah teatra gedəsidirlər:L6 .",
    "Hərəmiz bir mövzu haqqında danışasıyıq:L4 .",
    "Gələn il sən əsgərliyə gedəsisən:L2 .",
    "Mən ata yurdundan gedəsi_deyiləm:L1- .",
    "Biz bu yaxınlarda Şuşaya gedəsiyik:L4 .",
    "Atam bu həftə işə çıxasıdır:L3 .",
    // arzu şəkli
    "Dost-düşmən yanında üzüağ olasan:Z2 .",
    "Övladlarının xoş gününü görəsən:Z2 .",
    "Kaş biz də kinoteatra gedək:Z4 .",
    "Kaş səyahətə birgə gedək:Z4 .",
    "Gərək tez-tez görüşək:Z4 .",
    "Həmişə toy-bayram içində olasan:Z2 .",
    "Kaş sən də bizimlə gələsən:Z2 .",
    "Barı siz də bu mənzərəni görəsiniz:Z5 .",
    "Təki gözəl günlər görəsən:Z2 .",
    "Bədnəzərdən uzaq olasan:Z2 .",
    "Kaş mən də səninlə gedəm:Z1 .",
    // şərt şəkli
    "Əgər mübarizə aparsan:S2 , mütləq qalib gələcəksən:Xg2 .",
    "Yağış yağsa:S3 , biz evdə qalacağıq:Xg4 .",
    "Əgər sən gəlsən:S2 , birlikdə oxuyacağıq:Xg4 .",
    "Siz bu tapşırığı vaxtında bitirsəniz:S5 , nəticə əla olacaq:Xg3 .",
    "Mən hazırlaşsam:S1 , imtahandan keçəcəyəm:Xg1 .",
    "Onlar vaxtında çıxsalar:S6 , qatara çatacaqlar:Xg6 .",
    "Hava yaxşı olsa:S3 , biz gəzintiyə çıxacağıq:Xg4 .",
    "Biz tələsməsək:S4- , dərsə gecikəcəyik:Xg4 .",
    "Əgər dərsə hazırlaşmasan:S2- , pis qiymət alacaqsan:Xg2 .",
    "Gün çıxsa:S3 , hava isinəcək:Xg3 .",
    "Əgər çalışsaq:S4 , uğur qazanacağıq:Xg4 .",
    "Əgər çatsaq:S4 , səni görəcəyik:Xg4 .",
    // iki şəkil bir cümlədə
    "Sən kitabı oxu:A2 , mən yazıram:Xi1 .",
    "Siz tapşırığı bitirin:A5 , biz də yoxlayacağıq:Xg4 .",
    "Mən vaxtında çatmalıyam:V1 , çünki dərs başlayır:Xi3 .",
    "Biz bu yolla getməliyik:V4 , yoxsa gecikəcəyik:Xg4 .",
    "Atam gələsidir:L3 , sən çay hazırla:A2 .",
    "Kaş sən də bizimlə gələsən:Z2 , mən çox sevinəcəyəm:Xg1 .",
    "Biz sabah gedəsiyik:L4 , hazırlaşın:A5 .",
    "Mən vaxtında çatmalıyam:V1 , sən də tələs:A2 .",
    "Sən sabah gəlməlisən:V2 , yoxsa dərsə gecikəcəksən:Xg2 .",
    "Hava yaxşı olsa:S3 , biz gedəsiyik:L4 .",
  ]);
  // ---- idi, imiş, isə köməkçi sözləri olan cümlələr (7-ci sinif, 2-ci hissə, s. 56, 58; 6-cı sinif, 2-ci hissə, s. 58; 9-cu sinif, s. 14, 91, 116)
  const HB = parseBank([
    "Dünən hava çox soyuq idi:ID .",
    "Bu kitab mənim üçün çox maraqlı idi:ID .",
    "Sinif şagirdlərlə dolu idi:ID .",
    "Çayın suyu çox dərin idi:ID .",
    "Camaat hələ bundan xəbərsiz idi:ID .",
    "Hamı çox sevincli idi:ID .",
    "Sən demə , bu almaz Nadir şahın xəzinəsinə aid üç dəyərli daşdan biri imiş:IM .",
    "Köməkçinin dediyinə görə , bu , Qacarlar nəslindən bir iranlı imiş:IM .",
    "Eşitdim:Xk1 ki , qonşumuz məşhur rəssam imiş:IM .",
    "Deyirlər , bu çay çox dərin imiş:IM .",
    "Sən demə , o , çox mehriban adam imiş:IM .",
    "Mən evdə qaldım:Xk1 , qardaşım isə:IS məktəbə getdi:Xk3 .",
    "Yayda hava isti olur:Xi3 , qışda isə:IS soyuq olur:Xi3 .",
    "Əli riyaziyyatı sevir:Xi3 , Leyla isə:IS ədəbiyyatı sevir:Xi3 .",
    "Şəxsiyyəti valideyn , ruhu isə:IS müəllim tərbiyə_edir:Xi3 .",
    "Sənətin qayası gözəllik , əxlaqın qayası isə:IS yaxşılıqdır .",
    "Qardaş bu gün gəlmədi:Xk3- , bacı isə:IS gəldi:Xk3 .",
    "Cavanlıq müdrikliyi mənimsəmək , qocalıq isə:IS bu müdrikliyi tətbiq etmək dövrüdür .",
    "Ata işə getdi:Xk3 , ana isə:IS evdə qaldı:Xk3 .",
    "Bakıda hava günəşlidir , Şəkidə isə:IS yağış yağır:Xi3 .",
    "Əli şeir oxudu:Xk3 , Leyla isə:IS rəsm_çəkdi:Xk3 .",
    "Biz dənizə getdik:Xk4 , onlar isə:IS dağa getdilər:Xk6 .",
    "Atam çay içir:Xi3 , anam isə:IS qəzet oxuyur:Xi3 .",
    "Mən tarixi sevirəm:Xi1 , sən isə:IS coğrafiyanı sevirsən:Xi2 .",
    "Böyük qardaşım həkimdir , kiçik qardaşım isə:IS müəllimdir .",
    "Yayda biz dənizdə olduq:Xk4 , qışda isə:IS evdə qaldıq:Xk4 .",
    "Bu kitab maraqlıdır , o kitab isə:IS darıxdırıcıdır .",
    "Çay dərindir , göl isə:IS dayazdır .",
    "Mən dərsə hazırlaşdım:Xk1 , qardaşım isə:IS televizora baxdı:Xk3 .",
    "Müəllim izah_etdi:Xk3 , şagirdlər isə:IS dinlədilər:Xk6 .",
    "Gündüz küçələr səs-küylü olur:Xi3 , gecə isə:IS sakit olur:Xi3 .",
    "Mənim otağım kiçikdir , bacımın otağı isə:IS genişdir .",
    "Alma şirindir , limon isə:IS turşdur .",
    "Qış soyuq keçdi:Xk3 , bahar isə:IS tez gəldi:Xk3 .",
    "Əmim Bakıda yaşayır:Xi3 , dayım isə:IS Gəncədə yaşayır:Xi3 .",
    "Dünən yağış yağdı:Xk3 , bu gün isə:IS günəş çıxıb:Xk3 .",
    "Nənəm nağıl danışdı:Xk3 , babam isə:IS şeir oxudu:Xk3 .",
  ]);
  const ALLS = [...FE, ...HB];
  const words = s => s.filter(x => !x.p);
  const verbs = s => s.filter(x => x.m);
  const plain = s => s.map((x, i) => (i && !x.p ? " " : "") + x.w).join("");
  const hasM = (s, m) => s.some(x => x.m === m);
  const hasH = (s, c) => s.some(x => x.hs === c);
  const mark = (s, i) => h("span", {}, ...s.map((x, j) => [j && !x.p ? " " : "", j === i ? h("u", {}, h("b", {}, x.w)) : x.w]));

  // ---- tək feil formaları (cümlədən kənarda da şəkli birmənalıdır): "forma:kod"; xəbərdə kod = zaman hərfi + şəxs
  const SOZ_RAW = {
    A: ["oxusun:3", "yazsın:3", "dayansın:3", "gətirsinlər:6", "çalışsınlar:6", "danışın:5", "gətirin:5", "oxuyun:5", "dayanın:5", "görüm:1", "oxuyum:1", "çıxsın:3"],
    V: ["oxumalıyam:1", "yazmalısan:2", "getməlidir:3", "gəlməliyik:4", "bitirməlisiniz:5", "çalışmalıdırlar:6", "danışmamalıyam:1-", "baxmamalıyıq:4-", "yoxlamalısan:2", "öyrənməlisiniz:5"],
    L: ["oxuyasıyam:1", "yazasısan:2", "gedəsidir:3", "gələsiyik:4", "görəsisiniz:5", "çıxasıdırlar:6", "danışasıyam:1", "baxasısınız:5", "oxuyasıdır:3", "görəsisən:2"],
    Z: ["olasan:2", "gələsən:2", "oxuyasan:2", "soruşam:1", "biləsən:2", "görəsiniz:5", "gedəm:1", "çatasan:2", "soruşasınız:5"],
    S: ["oxusam:1", "yazsan:2", "gəlsə:3", "görsək:4", "bitirsəniz:5", "çıxsalar:6", "gecikməsək:4-", "baxmasan:2-", "çalışsam:1", "düzəlsə:3"],
    X: ["oxudum:k1", "yazırsan:i2", "gedəcəyik:g4", "yazacaqsınız:g5", "oxuyur:i3", "yazdılar:k6", "gəlmişəm:k1", "danışırıq:i4", "bitirdi:k3", "çalışırlar:i6", "güldüm:k1", "anlayır:i3", "gələcəyik:g4", "baxmadım:k1-", "çıxacaqsan:g2"],
  };
  const SOZ = {};
  for (const m of ALLM) SOZ[m] = SOZ_RAW[m].map(s => {
    const [w, c] = s.split(":"), k = m === "X" ? c.match(/^([kig])([1-6])(-?)$/) : c.match(/^()([1-6])(-?)$/);
    return { w, m, t: k[1] || null, pe: +k[2], neg: !!k[3] };
  });
  const ALLW = ALLM.flatMap(m => SOZ[m]);

  // ---- yazılış və tələffüz (6-cı sinif, 2-ci hissə, s. 62): [cümlə [transkripsiya], düzgün yazılış, transkripsiya, 2 səhv yazılış, qayda]
  const R_ACAQ = "-acaq² şəkilçisi I şəxsin təkinə aid olanda tələffüz yazılışdan fərqlənir: yazılışı -acağam/-əcəyəm, tələffüzü [-acam/-əcəm]";
  const R_SINIZ = "-sınız⁴ şəkilçisi tələffüzdə [-sız] olur, yazılışı isə -sınız⁴ (-siniz, -sunuz, -sünüz)";
  const R_LAR = "-ır⁴, -ar² şəkilçilərindən sonra III şəxsin cəmi (-lar²) tələffüzdə [-llar/-llər] olur, yazılışı isə -ırlar/-arlar";
  const TS = [
    ["Xalçanı yun və ipək saplardan [toxuyullar].", "toxuyurlar", "toxuyullar", ["toxuyurlər", "toxuyıllar"], R_LAR],
    ["Mən o filmə [baxmıyacam].", "baxmayacağam", "baxmıyacam", ["baxmayacaqam", "baxmayacam"], R_ACAQ],
    ["Siz həmişə tapşırıqları yerinə [yetirirsiz].", "yetirirsiniz", "yetirirsiz", ["yetirirsünüz", "yetirirsiniş"], R_SINIZ],
    ["Baharda qaranquşlar doğma yurdlarına geri [dönüllər].", "dönürlər", "dönüllər", ["dönirlər", "dönürlar"], R_LAR],
    ["Uşaqlar, dərslərə ciddi [hazırraşarsız].", "hazırlaşarsınız", "hazırraşarsız", ["hazırlaşarsız", "hazırlaşarsunuz"], R_SINIZ],
    ["Sabah rəfiqəmlə görüşüb söhbət [edəcəm].", "edəcəyəm", "edəcəm", ["edəcəgəm", "edəcəyem"], R_ACAQ],
    ["Mən bu mətni sabah [yazacam].", "yazacağam", "yazacam", ["yazacaqam", "yazaçağam"], R_ACAQ],
    ["Siz hər gün mənə [yazarsız].", "yazarsınız", "yazarsız", ["yazarsınuz", "yazarsıniz"], R_SINIZ],
    ["Onlar məktubu sabah [yazallar].", "yazarlar", "yazallar", ["yazarlər", "yazarlır"], R_LAR],
    ["Mən sabah ona düzünü [deyəcəm].", "deyəcəyəm", "deyəcəm", ["deyəcəyam", "deyəcəgəm"], R_ACAQ],
    ["Siz həmişə düzünü [deyirsiz].", "deyirsiniz", "deyirsiz", ["deyirsünüz", "deyirsiniş"], R_SINIZ],
  ].map(([s, ok, tr, d, rule]) => ({ s, ok, tr, d, rule }));
  const BADS = [["yazacam", "yazacağam"], ["deyəcəm", "deyəcəyəm"], ["edəcəm", "edəcəyəm"], ["baxmıyacam", "baxmayacağam"], ["alacam", "alacağam"], ["deyirsiz", "deyirsiniz"],
    ["yazarsız", "yazarsınız"], ["yetirirsiz", "yetirirsiniz"], ["çəkərsiz", "çəkərsiniz"], ["hazırraşarsız", "hazırlaşarsınız"], ["toxuyullar", "toxuyurlar"],
    ["dönüllər", "dönürlər"], ["yazallar", "yazarlar"], ["danışallar", "danışarlar"], ["düşünüllər", "düşünürlər"]];
  const OKF = [...BADS.map(b => b[1]), "çəkmişik", "çəkdilər", "çəkəcəklər", "aldım", "alıram", "almışam", "danışıb", "danışarıq", "danışacaq", "düşünərik", "düşünür", "düşünmüşəm"];

  // ---- vergül: isə-li cümlələrdə (tək vergül) düzgün və səhv variantlar (9-cu sinif, s. 91)
  const ISE = HB.filter(s => hasH(s, "IS") && s.filter(x => x.w === ",").length === 1);
  function commaVariants(s) {
    const ii = s.findIndex(x => x.hs === "IS"), ci = s.findIndex(x => x.w === ",");
    const T = a => plain(a);
    const noC = s.filter((x, i) => i !== ci);                         // əsas vergülsüz
    const iiN = noC.findIndex(x => x.hs === "IS");
    const before = [...noC.slice(0, iiN), { w: ",", p: true }, ...noC.slice(iiN)];          // vergül isə-dən əvvəl
    const after = [...s.slice(0, ii + 1), { w: ",", p: true }, ...s.slice(ii + 1)];          // əsas vergül + isə-dən sonra
    const both = [...noC.slice(0, iiN), { w: ",", p: true }, noC[iiN], { w: ",", p: true }, ...noC.slice(iiN + 1)]; // isə-nin hər iki yanında
    return { right: T(s), wrong: [{ t: T(before), why: "vergül isə-dən əvvəl qoyulub" }, { t: T(after), why: "vergül isə-dən sonra da qoyulub" },
      { t: T(noC), why: "tərəflər arasında vergül yoxdur" }, { t: T(both), why: "vergül isə-nin hər iki yanındadır" }] };
  }

  // ---- fikirlər (7-ci sinif, 2-ci hissə, s. 35, 40, 46; 8-ci sinif, s. 128; 9-cu sinif, s. 91; 6-cı sinif, 2-ci hissə, s. 62)
  const FIKIR_DUZ = [
    "Əmr şəkli əmr, xahiş, nəsihət, tövsiyə bildirir.",
    "Əmr şəklinin II şəxsin təkində şəxs şəkilçisi olmur.",
    "Əmr şəkli, adətən, qoy, bax, di, ha ədatları ilə işlənir.",
    "Vacib şəkli hərəkətin icrasının vacibliyini bildirir.",
    "Vacib şəkli feilin kökünə -malı² və şəxs şəkilçisini artırmaqla düzəlir.",
    "Vacib şəklinin inkarı -ma² şəkilçisi və ya deyil sözü ilə yaranır.",
    "Lazım şəkli feilin kökünə -ası² və şəxs şəkilçilərini artırmaqla düzəlir.",
    "Lazım şəklinin inkar forması yalnız «deyil» sözünün köməyi ilə düzəlir.",
    "Arzu şəkli feilin kökünə -a² və şəxs şəkilçilərini artırmaqla düzəlir.",
    "Arzu şəkli çox vaxt kaş, gərək, təki, barı ədatları ilə işlənir.",
    "Şərt şəkli feilin kökünə -sa² və şəxs şəkilçilərini artırmaqla düzəlir.",
    "Şərt şəkli çox zaman əgər, hərgah bağlayıcıları ilə işlənir.",
    "Xəbər şəkli feilin kökünə zaman və şəxs şəkilçilərini artırmaqla düzəlir.",
    "Feilin arzu və əmr şəkilləri I şəxsin cəmində forma etibarilə eynidir.",
    "İdi və imiş ayrıca yazılan köməkçi sözlərdir (hissəciklərdir).",
    "Qarşılaşdırma bildirən isə-yə görə vergül qoyulmur: nə ondan əvvəl, nə də sonra.",
    "Qarşılaşdırma bildirən isə ayrıca yazılan sözdür, feilin sonundakı -sa² şəkilçisi deyil.",
    "Şərt mənalı isə (-sə) qoşulduğu hissədən sonra vergül qoyulur: «Bilirsənsə, cavab ver».",
    "Yazacağam feilinin tələffüzü [yazacam] kimidir.",
  ];
  const FIKIR_SEHV = [
    "Əmr şəklinin II şəxsin təkində şəxs şəkilçisi işlənir.",
    "Vacib şəkli feilin kökünə -ası² şəkilçisi artırmaqla düzəlir.",
    "Lazım şəkli feilin kökünə -malı² şəkilçisi artırmaqla düzəlir.",
    "Lazım şəklinin inkarı -ma² şəkilçisi ilə düzəlir.",
    "Arzu şəkli feilin kökünə -sa² şəkilçisi artırmaqla düzəlir.",
    "Şərt şəkli feilin kökünə -a² şəkilçisi artırmaqla düzəlir.",
    "Xəbər şəkli yalnız şəxs şəkilçisi ilə düzəlir.",
    "Feilin arzu və əmr şəkilləri I şəxsin cəmində forma etibarilə fərqlidir.",
    "Əmr şəkli yalnız kaş, gərək, təki, barı ədatları ilə işlənir.",
    "Arzu şəkli yalnız qoy, bax, di, ha ədatları ilə işlənir.",
    "Qarşılaşdırma bildirən isə sözündən sonra vergül qoyulur.",
    "Yazarsınız feilinin tələffüzü [yazarsınız] kimidir.",
  ];
  // söz haqqında fikirlər: [söz, doğru fikirlər, səhv fikirlər]
  const PROFIL = [
    ["oxumalıyam", ["vacib şəklindədir", "I şəxsin təkindədir", "kökünə -malı² şəkilçisi artırılıb", "təsdiqdədir", "hərəkətin vacibliyini bildirir"], ["lazım şəklindədir", "II şəxsin təkindədir", "şərt şəklindədir", "inkardadır", "arzu bildirir"]],
    ["gedəsisən", ["lazım şəklindədir", "II şəxsin təkindədir", "kökünə -ası² şəkilçisi artırılıb", "təsdiqdədir", "hərəkətin lazım olduğunu bildirir"], ["vacib şəklindədir", "I şəxsin təkindədir", "arzu şəklindədir", "inkardadır", "şərt bildirir"]],
    ["soruşasan", ["arzu şəklindədir", "II şəxsin təkindədir", "kökünə -a² şəkilçisi artırılıb", "təsdiqdədir", "arzu bildirir"], ["lazım şəklindədir", "I şəxsin təkindədir", "vacib şəklindədir", "inkardadır", "hərəkətin vacibliyini bildirir"]],
    ["çalışsam", ["şərt şəklindədir", "I şəxsin təkindədir", "kökünə -sa² şəkilçisi artırılıb", "təsdiqdədir", "əgər sözü ilə işlənə bilər"], ["əmr şəklindədir", "II şəxsin təkindədir", "xəbər şəklindədir", "inkardadır", "hərəkətin vacibliyini bildirir"]],
    ["gətirsinlər", ["əmr şəklindədir", "III şəxsin cəmindədir", "təsdiqdədir", "qoy ədatı ilə işlənə bilər", "kökünə -sın⁴ və -lar² şəkilçiləri artırılıb"], ["şərt şəklindədir", "I şəxsin cəmindədir", "vacib şəklindədir", "inkardadır", "kökünə -malı² şəkilçisi artırılıb"]],
    ["yazdılar", ["xəbər şəklindədir", "keçmiş zamandadır", "III şəxsin cəmindədir", "təsdiqdədir", "kökünə zaman və şəxs şəkilçiləri artırılıb"], ["əmr şəklindədir", "gələcək zamandadır", "II şəxsin cəmindədir", "inkardadır", "şərt şəklindədir"]],
  ];

  // ---- etiketlər
  const labT = (t, pe, neg) => TN[t] + ", " + PN[pe] + (neg ? ", inkar" : "");
  const sameNum = p => (p <= 3 ? [1, 2, 3] : [4, 5, 6]).filter(x => x !== p);
  const otherNum = p => (p <= 3 ? p + 3 : p - 3);
  const wrongT = (v, n = 4) => {
    const ts = ["k", "i", "g"].filter(t => t !== v.t), p2 = pick(sameNum(v.pe));
    return [labT(ts[0], v.pe, v.neg), labT(ts[1], v.pe, v.neg), labT(v.t, p2, v.neg), labT(v.t, otherNum(v.pe), v.neg), labT(ts[0], p2, v.neg)].slice(0, n);
  };
  const kz = w => /(mış|miş|muş|müş)/.test(w) ? "-mış⁴" : /(ıb|ib|ub|üb)$/.test(w) ? "-ıb⁴" : "-dı⁴";
  const KOMEK = ["idi köməkçi sözü", "imiş köməkçi sözü", "isə (qarşılaşdırma bildirən köməkçi söz)", "keçmiş zaman şəkilçisi qəbul etmiş feil", "şərt şəkilçisi qəbul etmiş feil"];
  const HS_AD = { ID: "idi", IM: "imiş", IS: "isə" };
  // fərqləndirilmiş tokenin nə olduğu: 0..4 (KOMEK-in indeksi)
  const kindOf = x => x.hs === "ID" ? 0 : x.hs === "IM" ? 1 : x.hs === "IS" ? 2 : x.m === "X" && x.t === "k" ? 3 : x.m === "S" ? 4 : -1;
  function whyKomek(x) {
    if (x.hs === "ID") return "«idi» ayrıca yazılan köməkçi sözdür (hissəcik): feilə qoşulan keçmiş zaman şəkilçisi deyil";
    if (x.hs === "IM") return "«imiş» ayrıca yazılan köməkçi sözdür (hissəcik): feilə qoşulan -mış⁴ şəkilçisi deyil";
    if (x.hs === "IS") return "«isə» qarşılaşdırma bildirən, ayrıca yazılan köməkçi sözdür: şərt şəkilçisi -sa² deyil, feilin kökünə qoşulmur, şəxsə görə dəyişmir";
    if (x.m === "X") return "«" + x.w + "» feilinin sonunda keçmiş zaman şəkilçisi (" + kz(x.w) + ") və şəxs şəkilçisi var; ayrıca söz deyil";
    return "«" + x.w + "» feilinin kökünə -sa² (şərt) şəkilçisi və şəxs şəkilçisi artırılıb; şəkilçi feilin içindədir";
  }
  const kinds = x => KOMEK[kindOf(x)];

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "xeber", ad: "Xəbər şəkli: zaman və şəxs", izah: "Xəbər şəklində feilin kökünə zaman şəkilçisi, sonra şəxs şəkilçisi artırılır. Fərqləndirilmiş feilin zamanını və şəxsini müəyyən et.",
      gen() {
        const s = pick(FE.filter(x => verbs(x).some(v => v.m === "X"))), v = pick(verbs(s).filter(x => x.m === "X")), i = s.indexOf(v);
        const right = labT(v.t, v.pe, v.neg), opts = shuffle([right, ...sample(wrongT(v), 3)]);
        return { text: h("span", {}, "Fərqləndirilmiş feil hansı zamanda və hansı şəxsdədir?", line(mark(s, i))), choices: opts, correct: opts.indexOf(right), show: right,
          solution: "«" + v.w + "» — xəbər şəkli: " + TN[v.t] + " şəkilçisi və şəxs şəkilçisi var → " + right + "." };
      } },
    { id: "yazilis", ad: "Yazılış və tələffüz", izah: "Bəzi şəxs və zaman şəkilçilərinin deyilişi yazılışdan fərqlənir: yazacağam [yazacam], deyirsiniz [deyirsiz], yazarlar [yazallar]. Yazanda şəkilçi tam yazılır.",
      gen() {
        if (Math.random() < .55) {
          const e = pick(TS), right = e.ok, opts = shuffle([e.ok, e.tr, ...e.d]);
          return { text: h("span", {}, "Transkripsiyada verilmiş feilin düzgün yazılışı hansıdır?", line(e.s)), choices: opts, correct: opts.indexOf(right), show: right,
            solution: "Düzgün yazılış: " + e.ok + " (tələffüzü [" + e.tr + "]). " + e.rule + "." };
        }
        const [bad, corr] = pick(BADS), four = sample(OKF.filter(x => x !== corr), 3), opts = shuffle([bad, ...four]);
        return { text: "Dörd feildən biri orfoqrafik normalara uyğun deyil:", choices: opts, correct: opts.indexOf(bad), show: bad,
          solution: "«" + bad + "» tələffüzə uyğun yazılıb. Düzgün yazılış: " + corr + ". Qalan feillər düzgün yazılıb." };
      } },
    { id: "sekil", ad: "Feilin şəklini tap", izah: "Şəkilçiyə bax: -malı² — vacib, -ası² — lazım, -a² — arzu, -sa² — şərt, kök və ya -sın⁴, -ın⁴ — əmr, zaman + şəxs şəkilçisi — xəbər. Kaş, gərək, təki, barı — arzu; qoy, di — əmr.",
      gen() {
        const s = pick(FE), v = pick(verbs(s)), i = s.indexOf(v), opts = ALLM.map(m => MN[m]);
        return { text: h("span", {}, "Fərqləndirilmiş feil hansı şəkildədir?", line(mark(s, i))), choices: opts, correct: ALLM.indexOf(v.m), show: MN[v.m],
          solution: "«" + v.w + "» — " + EXPL[v.m] + " → " + PN[v.pe] + (v.neg ? ", inkar" : "") + "." };
      } },
    { id: "tap", ad: "Şəkli olan feilə toxun", izah: "Cümlədə iki feil var, şəkilləri fərqlidir. Soruşulan şəkildə olan feilə toxun.",
      gen() {
        const s = pick(FE.filter(x => uniq(verbs(x).map(v => v.m)).length >= 2)), m = pick(uniq(verbs(s).map(v => v.m)));
        const duz = s.map((x, i) => x.m === m ? i : -1).filter(i => i >= 0);
        return { text: "Cümlədə " + MNLOC[m] + " olan feilə toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
          solution: duz.map(i => "«" + s[i].w + "» — " + EXPL[m]).join("; ") + ". Digər feil: " + verbs(s).filter(v => v.m !== m).map(v => v.w + " — " + MN[v.m]).join(", ") + "." };
      } },
    { id: "bolgu", ad: "Bölgü: feilin şəkilləri", izah: "Feil formalarını şəkillərinə görə qruplara ayır. Şəkilçiyə bax.",
      gen() {
        const ms = sample(ALLM, 3), extra = sample(ALLM.filter(m => !ms.includes(m)), 1 + R(2)), qm = shuffle([...ms, ...extra]);
        const items = shuffle(ms.flatMap(m => sample(SOZ[m], 2)));
        return { text: "Feil formalarını şəkillərinə görə qruplara ayır.", bol: { soz: items.map(x => x.w), qrup: qm.map(m => MN[m]), duz: items.map(x => qm.indexOf(x.m)) },
          show: items.map(x => x.w + " — " + MN[x.m]).join("; "), solution: items.map(x => x.w + " — " + MN[x.m]).join("; ") + "." };
      } },
    { id: "hissecik", ad: "İdi, imiş, isə və şəkilçilər", izah: "İdi, imiş, isə ayrıca yazılan köməkçi sözlərdir (isə burada qarşılaşdırma bildirir). Keçmiş zaman şəkilçisi (-dı⁴, -mış⁴, -ıb⁴) və şərt şəkilçisi (-sa²) isə feilin içindədir.",
      gen() {
        const t = pick([0, 1, 2, 3, 4]);
        const pool = t <= 2 ? HB.filter(s => hasH(s, ["ID", "IM", "IS"][t])) : t === 3 ? ALLS.filter(s => s.some(x => x.m === "X" && x.t === "k")) : FE.filter(s => hasM(s, "S"));
        const s = pick(pool), i = s.findIndex(x => kindOf(x) === t), x = s[i];
        return { text: h("span", {}, "Fərqləndirilmiş söz hansıdır?", line(mark(s, i))), choices: KOMEK, correct: t, show: KOMEK[t], solution: whyKomek(x) + "." };
      } },
    { id: "vergul", ad: "İsə və vergül", izah: "Qarşılaşdırma bildirən isə-dən nə əvvəl, nə də sonra vergül qoyulmur. Vergül cümlənin tərəfləri arasında, isə-nin aid olduğu sözlərdən əvvəl qoyulur.",
      gen() {
        const s = pick(ISE), c = commaVariants(s), w = sample(c.wrong, 3), opts = shuffle([c.right, ...w.map(x => x.t)]);
        return { text: "Hansı cümlədə durğu işarəsi düzgün qoyulub?", choices: opts, correct: opts.indexOf(c.right), show: c.right,
          solution: "Düzgün: " + c.right + " Qarşılaşdırma bildirən isə-dən nə əvvəl, nə də sonra vergül qoyulmur; vergül tərəflər arasındadır. Səhvlər: " + w.map(x => x.why).join("; ") + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird üç feilin şəklini yazıb. Biri səhvdir — hansı?",
      gen() {
        const CONF = { A: "şərt", V: "lazım", L: "arzu", Z: "lazım", S: "əmr", X: "vacib" };
        const ms = sample(ALLM, 3), ws = ms.map(m => pick(SOZ[m])), k = R(3), ord = ["1-ci", "2-ci", "3-cü"];
        const lab = ws.map((w, j) => j === k ? CONF[w.m] + " şəkli" : MN[w.m]);
        return { text: "Şagirdin təhlili: " + ws.map((w, j) => (j + 1) + ") " + w.w + " — " + lab[j]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "«" + ws[k].w + "» " + lab[k] + " deyil, " + MN[ws[k].m] + ": " + EXPL[ws[k].m] + ". Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const numLines = (arr, f) => arr.map((x, i) => row((i + 1) + ". ", f(x)));
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. hansı feil … şəklindədir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const m = pick(["A", "V", "L", "Z", "S"]), ok = pick(SOZ[m]), others = sample(ALLM.filter(x => x !== m), 4).map(x => pick(SOZ[x]));
      return AEq("Hansı feil " + MNBE[m] + "?", ok.w, others.map(x => x.w), "«" + ok.w + "» — " + EXPL[m] + ". Digərləri: " + others.map(x => x.w + " — " + MN[x.m]).join(", ") + ".");
    }) },
    // 2. biri fərqlidir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [a, b] = sample(ALLM, 2), four = sample(SOZ[a], 4), odd = pick(SOZ[b]);
      return AEq("Feilin şəklinə görə biri fərqlidir:", odd.w, four.map(x => x.w), "«" + odd.w + "» — " + MN[b] + ". Qalan dördü " + MN[a] + "ndədir: " + four.map(x => x.w).join(", ") + ".");
    }) },
    // 3. nömrə kombinasiyası: söz siyahısı
    { tip: "qapali", gen: () => Oyun.again(() => {
      const m = pick(["A", "V", "L", "Z", "S"]), k = 1 + R(3), five = shuffle([...sample(SOZ[m], k), ...sample(ALLW.filter(x => x.m !== m), 5 - k)]);
      const right = five.map((x, i) => x.m === m ? i + 1 : 0).filter(Boolean), o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş feillərdən hansılar " + MNBE[m] + "?", ...numLines(five, x => x.w)), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + MN[x.m]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 4. cümlələrin birində … şəkli işlənib
    { tip: "qapali", gen: () => Oyun.again(() => {
      const m = pick(["A", "V", "L", "Z", "S"]), withM = pick(FE.filter(s => hasM(s, m))), noM = sample(FE.filter(s => !hasM(s, m)), 4);
      return AEq("Cümlələrin birində feil " + MNLOC[m] + " işlənib:", plain(withM), noM.map(plain),
        "«" + plain(withM) + "» — " + verbs(withM).map(v => v.w + " — " + MN[v.m]).join(", ") + ". Digər cümlələrdə " + MN[m] + " yoxdur.");
    }) },
    // 5. nömrə kombinasiyası: cümlələrdə fərqləndirilmiş feil
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(FE, 5).map(s => { const v = pick(verbs(s)); return { s, v, i: s.indexOf(v) }; });
      const m = pick(uniq(five.map(x => x.v.m))), right = five.map((x, i) => x.v.m === m ? i + 1 : 0).filter(Boolean);
      if (right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə fərqləndirilmiş feil " + MNBE[m] + "?", ...numLines(five, x => mark(x.s, x.i))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.v.w + " — " + MN[x.v.m]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 6. xəbər şəkli: zaman və şəxs
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(FE.filter(x => verbs(x).some(v => v.m === "X"))), v = pick(verbs(s).filter(x => x.m === "X")), i = s.indexOf(v), right = labT(v.t, v.pe, v.neg);
      return AEq(h("span", {}, "Fərqləndirilmiş feil hansı zamanda və hansı şəxsdədir?", line(mark(s, i))), right, wrongT(v, 4),
        "«" + v.w + "» — xəbər şəkli: " + right + ". Zaman şəkilçisi feilin kökündən sonra, şəxs şəkilçisi ondan sonra gəlir.");
    }) },
    // 7. yazılış
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) {
        const [bad, corr] = pick(BADS);
        return AEq("Aşağıdakı feillərdən biri orfoqrafik normalara uyğun deyil:", bad, sample(OKF.filter(x => x !== corr), 4), "«" + bad + "» tələffüzə uyğun yazılıb; düzgün yazılış: " + corr + ". Qalan feillər düzgün yazılıb.");
      }
      const e = pick(TS);
      return AEq(h("span", {}, "Transkripsiyada verilmiş feilin düzgün yazılışı hansıdır?", line(e.s)), e.ok, [e.tr, ...e.d, pick(OKF.filter(x => x !== e.ok))], "Düzgün yazılış: " + e.ok + " (tələffüzü [" + e.tr + "]). " + e.rule + ".");
    }) },
    // 8. idi / imiş / isə
    { tip: "qapali", gen: () => Oyun.again(() => {
      const c = pick(["ID", "IM", "IS"]), ok = pick(HB.filter(s => hasH(s, c))), bad = sample([...HB.filter(s => !hasH(s, c)), ...FE.filter(s => s.some(x => x.m === "X" && x.t === "k" || x.m === "S"))], 4);
      return AEq("Hansı cümlədə " + (c === "IS" ? "qarşılaşdırma bildirən isə" : HS_AD[c]) + " köməkçi sözü işlənib?", plain(ok), bad.map(plain),
        "«" + plain(ok) + "» — «" + HS_AD[c] + "» ayrıca yazılan köməkçi sözdür. Digər cümlələrdə ya başqa köməkçi söz, ya da feilin içində keçmiş zaman və ya şərt şəkilçisi var.");
    }) },
    // 9. vergül
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(ISE), c = commaVariants(s);
      return AEq("Hansı cümlədə durğu işarəsi düzgün qoyulub?", c.right, c.wrong.map(x => x.t), "Düzgün: " + c.right + " Qarşılaşdırma bildirən isə-dən nə əvvəl, nə də sonra vergül qoyulmur. Səhvlər: " + c.wrong.map(x => x.why).join("; ") + ".");
    }) },
    // 10. fikirlər
    { tip: "qapali", gen: () => Oyun.again(() => {
      const r = Math.random();
      if (r < .35) { const bad = pick(FIKIR_SEHV); return AEq("Feilin şəkilləri ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir doğrudur."); }
      if (r < .6) { const ok = pick(FIKIR_DUZ); return AEq("Feilin şəkilləri ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir." + (/^Şərt mənalı isə/.test(ok) ? " Bu fikir dərslikdə yoxdur, DİM proqramındandır." : "")); }
      const [w, duz, sehv] = pick(PROFIL);
      if (r < .8) { const bad = pick(sehv); return AEq("“" + w + "” feili ilə bağlı səhv fikri müəyyən edin.", bad, sample(duz, 4), "“" + w + "”: " + duz.join(", ") + ". Səhv fikir: " + bad + "."); }
      const ok = pick(duz); return AEq("“" + w + "” feili ilə bağlı doğru fikri müəyyən edin.", ok, sample(sehv, 4), "“" + w + "”: " + duz.join(", ") + ". Doğru fikir: " + ok + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün müstəqil yoxlama bəndləri: bankdakı hər element ========
  const Y = []; let yn = 0;
  const addY = (kind, sual, cavab) => Y.push({ id: kind + (++yn), sual, cavab });
  const FORMAT = " Cavabı «şəkil; [zaman;] şəxs; təsdiq/inkar» formatında yaz.";
  const OPT = " (şəkil: xəbər şəkli, əmr şəkli, vacib şəkli, lazım şəkli, arzu şəkli, şərt şəkli; xəbər şəklində zaman: indiki zaman, keçmiş zaman, gələcək zaman; şəxs: I, II, III şəxsin təki və ya cəmi)";
  const RULE = " Dərslik qaydası: arzu şəkli kaş, gərək, təki, barı ədatları ilə işlənir, əmr şəkli qoy, bax, di, ha ədatları ilə işlənir; I şəxsin cəmində -ək/-aq forması eynidir, ədatlara görə seçilir.";
  const ans = v => MN[v.m] + "; " + (v.m === "X" ? TN[v.t] + "; " : "") + PN[v.pe] + "; " + (v.neg ? "inkar" : "təsdiq");
  const needRule = (s, v) => v.pe === 4 && (v.m === "A" || v.m === "Z") || s.some(x => ["kaş", "gərək", "təki", "barı", "qoy", "di", "Qoy", "Kaş", "Gərək", "Təki", "Barı", "Di"].includes(x.w));
  FE.forEach(s => verbs(s).forEach(v => addY("F", "«" + plain(s) + "» cümləsində «" + v.w + "» feilinin şəklini, şəxsini və təsdiq/inkar olduğunu müəyyən edin" + OPT + "." + FORMAT + (needRule(s, v) ? RULE : ""), ans(v))));
  ALLW.forEach(v => addY("W", "«" + v.w + "» feil forması (cümlədən kənarda) hansı şəkildədir, hansı şəxsdədir, təsdiq, yoxsa inkardadır" + OPT + "." + FORMAT, ans(v)));
  TS.forEach(e => {
    addY("T", "Cümlədə transkripsiya ilə verilmiş feilin orfoqrafiyaya uyğun yazılışı nədir? " + e.s, e.ok);
    addY("T", "«" + e.tr + "» yazılışı orfoqrafik normalara uyğundurmu? (bəli, xeyr)", "xeyr");
  });
  OKF.forEach(w => addY("T", "«" + w + "» feil forması orfoqrafik normalara uyğun yazılıbmı? (bəli, xeyr)", "bəli"));
  const KOMQ = " (idi köməkçi sözü, imiş köməkçi sözü, isə (qarşılaşdırma bildirən köməkçi söz), keçmiş zaman şəkilçisi qəbul etmiş feil, şərt şəkilçisi qəbul etmiş feil)";
  uniq([...ALLS]).forEach(s => s.forEach((x, i) => { if (kindOf(x) >= 0 && (hasH(s, "ID") || hasH(s, "IM") || hasH(s, "IS") || x.m === "S" || x.m === "X" && x.t === "k")) addY("H", "«" + plain(s) + "» cümləsində «" + x.w + "» sözü hansıdır?" + KOMQ, KOMEK[kindOf(x)]); }));
  ISE.forEach(s => { const c = commaVariants(s); addY("V", "İsə sözünün qoşulduğu hissəni tərəflərdən ayıran vergül düzgün qoyulubmu? Cümlə: «" + c.right + "» (bəli, xeyr)", "bəli");
    c.wrong.forEach(w => addY("V", "İsə sözünün qoşulduğu hissəni tərəflərdən ayıran vergül düzgün qoyulubmu? Cümlə: «" + w.t + "» (bəli, xeyr)", "xeyr")); });
  FIKIR_DUZ.forEach(f => addY("P", "Bu fikir doğrudurmu? «" + f + "» (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => addY("P", "Bu fikir doğrudurmu? «" + f + "» (doğru, səhv)", "səhv"));
  PROFIL.forEach(([w, duz, sehv]) => { duz.forEach(f => addY("R", "«" + w + "» feil forması haqqında bu fikir doğrudurmu? «" + f + "» (doğru, səhv)", "doğru"));
    sehv.forEach(f => addY("R", "«" + w + "» feil forması haqqında bu fikir doğrudurmu? «" + f + "» (doğru, səhv)", "səhv")); });
  window.__yoxla = Y;

  window.__levels = levels;
  window.__bank = { FE, HB, SOZ, TS, BADS, OKF, FIKIR_DUZ, FIKIR_SEHV, PROFIL, MN };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-feil-2", title: "Feil II: şəkillər; idi, imiş, isə", fenn: "azdili", link: "dersler/az-feil-2.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə feilə toxunmaq və ya feilləri qruplara ayırmaq. Şəkilçiyə bax: hansı şəkil olduğunu o göstərir.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["xeber", "yazilis", "sekil", "sekil", "tap", "bolgu", "hissecik", "hissecik", "vergul", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-feil-2.html")) b.push("dersler/az-feil-2.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
