// Azərbaycan dili · Söz birləşməsi; mürəkkəb adlar — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024), s. 88–89 (söz birləşməsi; asılı və əsas tərəf); 6-cı sinif, 1-ci hissə (2025),
// s. 45 (mürəkkəb adlar: şəxs və yer adları), s. 67 (ismi və feili birləşmələr; sadə və mürəkkəb birləşmələr); 8-ci sinif, 1-ci hissə (2023),
// s. 12 (söz birləşməsi), s. 16 (mürəkkəb adlar: bütün sözləri böyük), s. 21 (asılı və əsas tərəf; ismi və feili birləşmələr),
// s. 28 (birinci söz böyük; mirzə, hacı, şah və s.); köməkçi mənbə — 7-ci sinif, 2-ci hissə, s. 43, 50 (sadə və mürəkkəb birləşmələr; məsdər,
// feili sifət, feili bağlama tərkibləri), 7-ci sinif, 1-ci hissə, s. 92 (bayram adı). Bankdakı hər birləşmə və ad dərslikdəki nümunədən
// götürülüb və ya dərslik qaydası ilə eyni üsulla qurulub; hər element müstəqil yoxlanıb (Codex). Bankda qəsdən olmayanlar: frazeoloji
// birləşmələr (7-ci mövzu), I/II/III növ təyini birləşməsi (dərslikdə yoxdur), mürəkkəb feil əsas tərəf olan nümunələr (toxunma tapşırığında).
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const UP = w => w.charAt(0).toLocaleUpperCase("az") + w.slice(1);
  const LO = w => w.charAt(0).toLocaleLowerCase("az") + w.slice(1);
  const isUp = w => w.charAt(0) === UP(w).charAt(0) && w.charAt(0) !== LO(w).charAt(0);
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
  const numbered = arr => arr.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". " + x));

  // ============ 1. söz birləşmələri ============
  // "birləşmə|KOD": I ismi, M məsdər tərkibi, S feili sifət tərkibi, B feili bağlama tərkibi.
  // "!M" / "!S" — asılı tərəf məsdər / feili sifətdir, amma əsas tərəf isimdir (birləşmə ismidir).
  // "*" — mürəkkəb feil var: toxunma və asılı tərəf tapşırıqlarında verilmir.
  const KIND = { I: "ismi birləşmə", M: "məsdər tərkibi", S: "feili sifət tərkibi", B: "feili bağlama tərkibi" };
  const TRAPW = { M: "məsdərdir", S: "feili sifətdir" };
  const PH = [
    // ismi (5-ci sinif s. 88–89; 6-cı sinif s. 67; 8-ci sinif s. 21)
    "baharın gəlişi|I", "uşaq ədəbiyyatı|I", "səfər təəssüratı|I", "çalınan musiqi|I!S", "çalışqan şagird|I", "maraqlı kitab|I", "Bakı gecələri|I",
    "açıq söhbət|I", "acı bibər|I", "son dayanacaq|I", "oxumaq həvəsi|I!M", "həyətin qapısı|I", "qiymətli hədiyyə|I", "babamdan yadigar|I",
    "qocaya hörmət|I", "sərin hava|I", "vətənə məhəbbət|I", "sinif rəhbəri|I", "üç alma|I", "bu küçə|I", "dərilmiş meyvə|I!S", "uşaqların kiçiyi|I",
    "şagirdlərin hamısı|I", "uşaqların beşi|I", "güclü yağış|I", "qızıl medal|I", "günəş işığı|I", "dəvə karvanı|I", "abadlaşan küçələr|I!S",
    "geniş park|I", "futbol topu|I", "muzeydəki xalça|I", "məktəbimizin beşinci sinif şagirdi|I", "qabdakı qırmızı alma|I", "mədəni irs|I", "Şərq dünyası|I",
    // məsdər tərkibi
    "vicdanla yaşamaq|M", "sahildə gəzmək|M", "səyahətə getmək|M", "tar çalmaq|M", "seminariyada oxumaq|M", "ağır idman daşlarını qaldırmaq|M",
    "şeir oxumaq|M", "hamını düşünmək|M", "el qeyrəti çəkmək|M",
    // feili sifət tərkibi
    "el qeyrəti çəkən|S", "şeir oxuyan|S", "hamını düşünən|S", "yorğun görünən|S", "növbədə gözləyən|S", "seminariyada oxuyan|S", "xaricdən gəlmiş|S",
    "meşədən qayıdan|S", "vicdanla yaşayan|S",
    // feili bağlama tərkibi
    "yağış yağanda|B", "meşədən qayıdanda|B", "evdən qayıdanda|B", "kəndə çatanda|B", "seminariyada oxuyanda|B", "bina tikdirərək|B",
    "günəş dağların arxasında gizlənəndə|B", "sahildə gəzəndə|B", "vicdanla yaşayanda|B", "ulduzları seyr edərkən|B*", "ədalətlə həll etdikdə|B*",
  ].map(s => {
    const [t, c] = s.split("|"), m = c.match(/^([ISMB])(?:!([MS]))?(\*)?$/), ws = t.split(" ");
    return { t, ws, k: m[1], trap: m[2] || "", cmp: !!m[3], as: ws.slice(0, -1), es: m[3] ? ws.slice(-2).join(" ") : ws[ws.length - 1] };
  });
  const PHS = PH.filter(p => !p.cmp);          // əsas tərəfi bir sözdür
  const PH3 = PHS.filter(p => p.ws.length >= 3); // asılı tərəfi bir neçə sözdür
  const FEILI = PH.filter(p => p.k !== "I");
  const ISMI = PH.filter(p => p.k === "I");
  const kindExplain = p => {
    const e = "«" + p.es + "»";
    if (p.k === "I") return "Əsas tərəf " + e + " feilin təsriflənməyən forması deyil, adla ifadə olunub → ismi birləşmə." + (p.trap ? " Asılı tərəfdəki «" + p.ws[0] + "» " + TRAPW[p.trap] + ", amma birləşmənin növü əsas tərəfə görə müəyyən olunur." : "");
    if (p.k === "M") return "Əsas tərəf " + e + " məsdərdir → məsdər tərkibi (feili birləşmə).";
    if (p.k === "S") return "Əsas tərəf " + e + " feili sifətdir → feili sifət tərkibi (feili birləşmə).";
    return "Əsas tərəf " + e + " feili bağlamadır → feili bağlama tərkibi (feili birləşmə).";
  };
  // söz birləşməsi olmayanlar (7-ci sinif s. 43; 8-ci sinif s. 12: köməkçi nitq hissələri söz birləşməsi yarada bilməz)
  const NOT = [
    ["kəndə sarı", "«sarı» qoşmadır: köməkçi nitq hissəsi söz birləşməsi yarada bilməz (qoşmalı isimdir)."],
    ["lap böyük", "«lap» ədatdır; «lap böyük» çoxaltma dərəcəli sifətdir, söz birləşməsi deyil."],
    ["cəlb etmək", "«etmək» köməkçi feildir; «cəlb etmək» mürəkkəb feildir, söz birləşməsi deyil."],
    ["bir qədər", "«bir qədər» mürəkkəb saydır, söz birləşməsi deyil."],
    ["sənin üçün", "«üçün» qoşmadır; müstəqil söz yalnız birdir («sənin»), söz birləşməsi yoxdur."],
  ].map(([t, why]) => ({ t, why }));
  // söz birləşməsi / mürəkkəb söz / cümlə (5-ci sinif s. 88; durğu işarəsi qoyulmur — dərslikdəki kimi)
  const TIPB = {
    B: ["futbol topu", "muzeydəki xalça", "qabdakı qırmızı alma", "günəş işığı", "dəvə karvanı", "abadlaşan küçələr", "geniş park", "boş qab", "sərin hava", "açıq söhbət", "maraqlı kitab"],
    M: ["rəngbərəng", "daşkəsən", "incəsənət", "üçbucaq", "boşqab"],
    C: ["hava istidir", "quş səsi gəlir", "kəndə çatdıq", "otaq genişdir", "ev haradadır", "top qapıdan keçdi", "peşəkar sənətkardır", "hansı dadlıdır"],
  };
  const TIPAD = { B: "söz birləşməsi", M: "mürəkkəb söz", C: "cümlə" };
  const TIPWHY = {
    B: "iki müstəqil sözün birləşməsidir, mənanı konkretləşdirir; bitmiş fikir bildirmir",
    M: "bir sözdür (mürəkkəb söz): hissələri birləşib tək leksik məna verir",
    C: "bitmiş fikir bildirir",
  };

  // ============ 2. mürəkkəb adlar ============
  // "növ|ad": ad — ad, soyad, ata adı; olke — ölkə, muxtar respublika; idare — idarə və təşkilat; ger — dəniz, çay, şəhər, kənd… sözü olan;
  // tit — mirzə, hacı, şah, bəy… sözü olan; dir — cənubi, şərqi, aşağı, orta, uzaq… sözü olan.
  const TIT = ["mirzə", "hacı", "şeyx", "seyid", "şah", "soltan", "sultan", "ağa", "bəy", "bəyim", "xan", "xanım", "xatun"];
  const LOWK = ["oğlu", "qızı", "adına"];
  const DIRK = ["cənubi", "şərqi", "aşağı", "orta", "uzaq", "yuxarı"];
  const NAMES = [
    "ad|Şahbazlı Lətifə Uğur qızı", "ad|Aydan Camallı", "ad|Səttar Bəhlulzadə", "ad|Səməd Vurğun", "ad|Nizami Gəncəvi", "ad|Süleyman Rüstəm", "ad|Quliyev Əli Həsən oğlu",
    "olke|Azərbaycan Respublikası", "olke|Birləşmiş Ərəb Əmirlikləri", "olke|Naxçıvan Muxtar Respublikası",
    "idare|Azərbaycan Respublikası Prezident Administrasiyası", "idare|Uşaqların Xilası Təşkilatı", "idare|M.Maqomayev adına Azərbaycan Dövlət Filarmoniyası",
    "idare|Azərbaycan Respublikası Nazirlər Kabineti",
    "ger|Sakit okean", "ger|Xəzər dənizi", "ger|Kür çayı", "ger|Qara dəniz", "ger|Muğan düzü", "ger|Araz çayı", "ger|Kiçik Qafqaz dağları", "ger|Novruz bayramı",
    "ger|Xudafərin körpüsü", "ger|Atlantik okeanı", "ger|Nargin adası", "ger|Tiflis şəhəri", "ger|Salahlı kəndi",
    "tit|Mirzə Fətəli", "tit|Hacı Qara", "tit|Şeyx Nəsrullah", "tit|Seyid Əzim", "tit|Şah İsmayıl", "tit|Soltan Mahmud", "tit|Abbas mirzə", "tit|Nadir şah",
    "tit|Abbasqulu ağa", "tit|Fətəli xan", "tit|Heyran xanım", "tit|Ağa Məhəmməd şah Qacar", "tit|Qasım bəy Zakir", "tit|Mirzə Fətəli Axundov",
    "tit|Abbasqulu ağa Bakıxanov", "tit|Şeyx Məhəmməd Xiyabani", "tit|Sultan Süleyman Qanuni", "tit|Həsən bəy Zərdabi", "tit|Şah Abbas",
    "dir|Cənubi Amerika", "dir|Orta Asiya", "dir|Uzaq Şərq", "dir|Aşağı Quşçu", "dir|Yuxarı Salahlı", "dir|Cənubi Koreya", "dir|Aşağı Əskipara",
  ].map(s => {
    const [k, t] = s.split("|"), ws = t.split(" ");
    const cl = ws.map((w, i) => w.includes(".") ? "f" : LOWK.includes(LO(w)) ? "l" : k === "ger" && i === ws.length - 1 ? "g" : k === "tit" && TIT.includes(LO(w)) ? (i === 0 ? "t1" : "t2") : k === "dir" && DIRK.includes(LO(w)) ? "d" : "c");
    return { k, t, ws, cl };
  });
  const WHYC = {
    ad: "Ad, soyad və ata adı böyük hərflə başlayır (oğlu, qızı kiçik yazılır).",
    olke: "Ölkə, muxtar respublika və vilayət adlarında bütün sözlər böyük hərflə başlayır.",
    idare: "İdarə və təşkilat adlarında bütün sözlər böyük hərflə başlayır (adına kiçik yazılır).",
    ger: "Adın özü (Xəzər, Kür, Kiçik Qafqaz…) böyük hərflə başlayır; dəniz, çay, dağ, şəhər, kənd, bayram və s. sözlər kiçik yazılır.",
    tit: "Titul sözü olmayan hissə (ad, soyad) böyük hərflə başlayır.",
    dir: "Yer adının özü böyük hərflə başlayır.",
  };
  const WHY = { g: "dəniz, çay, dağ, şəhər, kənd, körpü, ada, bayram və s. sözlər kiçik hərflə yazılır.", l: "oğlu, qızı, adına sözləri kiçik hərflə yazılır.",
    t1: "Addan əvvəl gələn titul (mirzə, hacı, şeyx, şah, bəy, ağa…) böyük hərflə yazılır.", t2: "Addan sonra və ya ortada gələn titul (mirzə, şah, bəy, ağa, xan…) kiçik hərflə yazılır.",
    d: "cənubi, şərqi, aşağı, orta, uzaq kimi sözlər yer adının tərkibində böyük hərflə yazılır." };
  const whyOf = (n, i) => n.cl[i] === "c" ? WHYC[n.k] : WHY[n.cl[i]];
  const flat = n => n.ws.map((w, i) => n.cl[i] === "f" ? -1 : i).filter(i => i >= 0);
  const flipTok = w => isUp(w) ? LO(w) : UP(w);
  const applyFlip = (n, idx) => n.ws.map((w, i) => idx.includes(i) ? flipTok(w) : w).join(" ");
  const flipWhy = (n, idx) => idx.map(i => "«" + flipTok(n.ws[i]) + "» — " + whyOf(n, i)).join(" ");
  // bir sözün (və ya iki sözün) hərf böyüklüyünü pozmaqla səhv variantlar
  function variants(n) {
    const f = flat(n), out = [];
    f.forEach(i => out.push([i]));
    f.forEach((i, a) => f.slice(a + 1).forEach(j => out.push([i, j])));
    return out;
  }

  const singles = n => flat(n).map(i => [i]);
  const FRAME = ["Bu kitab _ haqqındadır.", "Biz dünən _ haqqında oxuduq.", "Müəllim _ haqqında maraqlı məlumat verdi.", "Şagirdlər _ barədə referat hazırladılar.", "Sinifdə _ haqqında söhbət getdi."];
  const sentence = (n, idx, fr) => fr.replace("_", idx ? applyFlip(n, idx) : n.t);

  // ============ 3. fikirlər (dərslik qaydaları) ============
  const FIKIR_BIR_DUZ = [
    "Söz birləşməsi iki və daha artıq müstəqil sözün məna və qrammatik cəhətdən birləşməsindən yaranır.",
    "Müstəqil söz dedikdə əsas nitq hissələri nəzərdə tutulur.",
    "Qoşma, bağlayıcı və ədat söz birləşməsinin tərkibində iştirak edə bilər, amma söz birləşməsi yarada bilməz.",
    "Söz birləşməsi anlayışı daha konkret ifadə edir.",
    "Söz birləşməsinin asılı tərəfi əsas sözdən əvvəl gəlir və onu müxtəlif cəhətdən izah edir.",
    "Asılı tərəf bir neçə sözdən ibarət ola bilər.",
    "Söz birləşməsində əsas tərəf tabe edən, asılı tərəf tabe olandır.",
    "Əsas tərəfi adlarla ifadə olunan söz birləşmələrinə ismi birləşmələr deyilir.",
    "İsmi birləşmənin əsas tərəfi isim, sifət, say, əvəzlik və ya zərflə ifadə olunur.",
    "Əsas tərəfi feilin təsriflənməyən formaları ilə ifadə olunan söz birləşmələrinə feili birləşmələr deyilir.",
    "Feilin təsriflənməyən formaları məsdər, feili sifət və feili bağlamadır.",
    "Əsas tərəfi məsdərlə ifadə olunan feili birləşmə məsdər tərkibi adlanır.",
    "Əsas tərəfi feili sifətlə ifadə olunan feili birləşmə feili sifət tərkibi adlanır.",
    "Əsas tərəfi feili bağlama ilə ifadə olunan feili birləşmə feili bağlama tərkibi adlanır.",
    "Tərkiblər əsas tərəfin adı ilə adlanır.",
    "Cümlə anlayışla bağlı bitmiş fikir bildirir.",
    "«Boş qab» söz birləşməsidir, «boşqab» isə mürəkkəb sözdür.",
    "«Çalınan musiqi» ismi birləşmədir.",
    "«Oxumaq həvəsi» ismi birləşmədir.",
  ];
  const FIKIR_BIR_SEHV = [
    "Qoşma, bağlayıcı və ədat söz birləşməsi yarada bilər.",
    "Söz birləşməsi bir sözdən ibarət olur.",
    "Söz birləşməsinin asılı tərəfi əsas sözdən sonra gəlir.",
    "Söz birləşməsində əsas tərəf tabe olan, asılı tərəf tabe edəndir.",
    "Asılı tərəf həmişə yalnız bir sözdən ibarət olur.",
    "İsmi birləşmənin əsas tərəfi yalnız isimlə ifadə olunur.",
    "Feili birləşmənin əsas tərəfi feilin təsriflənən formaları ilə ifadə olunur.",
    "Əsas tərəfi məsdərlə ifadə olunan feili birləşmə feili bağlama tərkibi adlanır.",
    "Əsas tərəfi feili sifətlə ifadə olunan feili birləşmə məsdər tərkibi adlanır.",
    "Tərkiblər asılı tərəfin adı ilə adlanır.",
    "Söz birləşməsi bitmiş fikir bildirir.",
    "«Çalınan musiqi» feili birləşmədir, çünki asılı tərəf feili sifətdir.",
    "«Oxumaq həvəsi» məsdər tərkibidir, çünki asılı tərəf məsdərdir.",
    "«Sənin üçün» ismi birləşmədir.",
  ];
  const FIKIR_AD_DUZ = [
    "Söz birləşməsi şəklində olan adlara mürəkkəb adlar deyilir.",
    "Şəxs, yer, ölkə, əsər və bayram adları mürəkkəb ad şəklində ola bilər.",
    "Ölkələrin, muxtar respublikaların və vilayətlərin adlarında bütün sözlər böyük hərflə başlayır.",
    "İdarə və təşkilat adlarının tərkibində işlənən adına sözü kiçik hərflə yazılır.",
    "Ata adının tərkibində işlənən oğlu və qızı sözləri kiçik hərflə yazılır.",
    "Tərkibində şəhər, kənd, küçə, meydan, okean, dəniz, çay, körpü, dağ sözləri olan mürəkkəb adlarda adın özü böyük, bu məkan sözü kiçik hərflə yazılır.",
    "Mirzə, hacı, şeyx, seyid, şah, soltan, ağa, bəy, xan sözləri addan əvvəl gəldikdə böyük hərflə yazılır.",
    "Mirzə, hacı, şeyx, seyid, şah, soltan, ağa, bəy, xan sözləri addan sonra gəldikdə kiçik hərflə yazılır.",
    "Cənubi, şərqi, aşağı, orta, uzaq kimi sözlər bəzi yer adlarının tərkibində böyük hərflə yazılır.",
    "Ad, soyad və ata adından ibarət mürəkkəb adlarda ad və soyad böyük hərflə başlayır.",
    "«Novruz bayramı» adında «bayramı» sözü kiçik hərflə yazılır.",
  ];
  const FIKIR_AD_SEHV = [
    "Ölkə adlarında yalnız birinci söz böyük hərflə yazılır.",
    "İdarə və təşkilat adlarında yalnız birinci söz böyük hərflə yazılır.",
    "Şəhər, kənd, çay, dəniz sözləri mürəkkəb adın tərkibində böyük hərflə yazılır.",
    "Addan sonra gələn xan, bəy, ağa sözləri böyük hərflə yazılır.",
    "Mirzə, hacı, şah sözləri addan əvvəl gəldikdə kiçik hərflə yazılır.",
    "Oğlu və qızı sözləri ata adının tərkibində böyük hərflə yazılır.",
    "Adına sözü idarə adının tərkibində böyük hərflə yazılır.",
    "Cənubi, şərqi, aşağı, orta, uzaq kimi sözlər yer adlarının tərkibində kiçik hərflə yazılır.",
    "Mürəkkəb adlar yalnız şəxs adlarından ibarətdir.",
    "Mürəkkəb adın tərkibindəki sözlər bitişik yazılır.",
  ];

  // ======== oyun səviyyələri ========
  const KINDS4 = ["ismi birləşmə", "məsdər tərkibi", "feili sifət tərkibi", "feili bağlama tərkibi"];
  const levels = [
    { id: "tip", ad: "Söz birləşməsi, mürəkkəb söz, cümlə", izah: "Söz birləşməsi iki və daha artıq müstəqil sözdən ibarətdir və bitmiş fikir bildirmir. Mürəkkəb söz bir sözdür. Cümlə bitmiş fikir bildirir.",
      gen() {
        const k = pick(["B", "B", "M", "C"]), w = pick(TIPB[k]), opts = ["söz birləşməsi", "mürəkkəb söz", "cümlə"];
        return { text: h("span", {}, "Aşağıdakı vahid hansıdır?", line("«" + w + "»")), choices: opts, correct: opts.indexOf(TIPAD[k]), show: TIPAD[k],
          solution: "«" + w + "» — " + TIPAD[k] + ": " + TIPWHY[k] + "." };
      } },
    { id: "taraf", ad: "Asılı və əsas tərəf", izah: "Asılı tərəf əsas sözdən əvvəl gəlir və onu izah edir. Əsas tərəf tabe edən sözdür — birləşmənin sonunda dayanır. Asılı tərəf bir neçə sözdən ibarət ola bilər.",
      gen() {
        const p = pick(PHS), e = Math.random() < .5, n = p.ws.length;
        const duz = e ? [n - 1] : p.ws.map((_, i) => i).slice(0, n - 1);
        return { text: "«" + p.t + "» birləşməsində " + (e ? "əsas tərəfə" : "asılı tərəfin hamısına") + " toxun.", sec: { soz: p.ws, duz }, show: duz.map(i => p.ws[i]).join(" "),
          solution: "Əsas tərəf — «" + p.es + "» (tabe edən söz). Asılı tərəf — «" + p.as.join(" ") + "» (əsas sözdən əvvəl gəlir, onu izah edir)." };
      } },
    { id: "ismifeili", ad: "İsmi və feili birləşmə", izah: "Növü əsas tərəf müəyyən edir: əsas tərəf adla ifadə olunubsa — ismi; feilin təsriflənməyən forması ilə (məsdər, feili sifət, feili bağlama) — feili birləşmə. Köməkçi nitq hissəsi birləşmə yarada bilməz.",
      gen() {
        const opts = ["ismi birləşmə", "feili birləşmə", "söz birləşməsi deyil"];
        if (Math.random() < .2) { const n = pick(NOT); return { text: h("span", {}, "Bu vahid hansıdır?", line("«" + n.t + "»")), choices: opts, correct: 2, show: opts[2], solution: n.why }; }
        const p = pick(PH), a = p.k === "I" ? 0 : 1;
        return { text: h("span", {}, "Birləşmə hansı növdəndir?", line("«" + p.t + "»")), choices: opts, correct: a, show: opts[a],
          solution: kindExplain(p) };
      } },
    { id: "feilinov", ad: "Məsdər, feili sifət, feili bağlama tərkibi", izah: "Tərkib əsas tərəfin adı ilə adlanır. Əsas tərəf məsdərdirsə — məsdər tərkibi, feili sifətdirsə — feili sifət tərkibi, feili bağlamadırsa — feili bağlama tərkibi. Əsas tərəf isimdirsə, birləşmə ismidir.",
      gen() {
        const p = Math.random() < .25 ? pick(ISMI.filter(x => x.trap)) : pick(PH);
        return { text: h("span", {}, "Birləşmənin növünü müəyyən et:", line("«" + p.t + "»")), choices: KINDS4, correct: KINDS4.indexOf(KIND[p.k]), show: KIND[p.k], solution: kindExplain(p) };
      } },
    { id: "yazduz", ad: "Mürəkkəb adın yazılışı", izah: "Ad, soyad, ölkə, idarə adlarında bütün sözlər böyük (oğlu, qızı, adına kiçik); dəniz, çay, şəhər, kənd, dağ… sözü olan adlarda adın özü böyük, bu söz kiçik; mirzə, hacı, şah… addan əvvəl böyük, sonra kiçik.",
      gen() {
        const n = pick(NAMES), vs = sample(variants(n), 3), opts = shuffle([n.t, ...vs.map(v => applyFlip(n, v))]);
        return { text: "Hansı mürəkkəb adın yazılışı düzgündür?", choices: opts, correct: opts.indexOf(n.t), show: n.t,
          solution: "Düzgün: «" + n.t + "». " + vs.map(v => "«" + applyFlip(n, v) + "» səhvdir: " + flipWhy(n, v)).join(" ") };
      } },
    { id: "yazbol", ad: "Bölgü: mürəkkəb adların qaydası", izah: "Adı yazılış qaydasına görə qrupa ayır: titulsuz ad və ölkə, idarə adları; sonunda dəniz, çay, şəhər, kənd… sözü olan adlar; titul sözü (mirzə, hacı, şah, bəy…) olan adlar.",
      gen() {
        const G = [NAMES.filter(n => ["ad", "olke", "idare"].includes(n.k)), NAMES.filter(n => n.k === "ger" && n.t !== "Novruz bayramı"), NAMES.filter(n => n.k === "tit")];
        const gs = Math.random() < .4 ? sample([0, 1, 2], 2) : [0, 1, 2], per = gs.length === 2 ? 3 : 2;
        const items = shuffle(gs.flatMap(g => sample(G[g], per).map(n => ({ n, g }))));
        const qrup = ["titulsuz ad və soyad, ölkə, idarə və təşkilat adları", "sonunda dəniz, çay, şəhər, kənd və s. sözü olan adlar", "tərkibində mirzə, hacı, şah, bəy və s. titul sözü olan adlar", "yalnız ikinci söz böyük yazılan adlar"];
        const LAB = ["ad / ölkə / idarə adı", "adın özü böyük, məkan sözü kiçik", "titul sözü olan ad"];
        return { text: "Mürəkkəb adları qaydasına görə qruplara ayır.", bol: { soz: items.map(x => x.n.t), qrup, duz: items.map(x => x.g) },
          show: items.map(x => x.n.t + " — " + LAB[x.g]).join("; "), solution: items.map(x => x.n.t + " — " + LAB[x.g]).join("; ") + "." };
      } },
    { id: "yazsec", ad: "Cümlədə səhv yazılmış söz", izah: "Cümlədəki mürəkkəb adda bir söz səhv yazılıb. Hərf böyüklüyünə bax: hansı söz böyük, hansı kiçik hərflə yazılmalıdır?",
      gen() {
        const n = pick(NAMES), f = pick(flat(n)), fr = pick(FRAME);
        const pre = fr.slice(0, fr.indexOf("_")).trim().split(" "), post = fr.slice(fr.indexOf("_") + 1).replace(/\.$/, "").trim().split(" ").filter(Boolean);
        const soz = [...pre, ...applyFlip(n, [f]).split(" "), ...post, "."], at = pre.length + f;
        return { text: "Cümlədə mürəkkəb adın səhv yazılmış sözünə toxun.", sec: { soz, duz: [at] }, show: soz[at],
          solution: "Düzgün: «" + n.t + "». «" + soz[at] + "» səhvdir: " + whyOf(n, f) };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird üç birləşmənin növünü yazıb. Biri səhvdir — hansı? Növü əsas tərəfə görə müəyyən et.",
      gen() {
        const ps = sample(PHS, 3), k = R(3);
        const lab = ps.map((p, j) => { if (j !== k) return KIND[p.k]; return p.trap ? KIND[p.trap] : pick(Object.values(KIND).filter(x => x !== KIND[p.k])); });
        const ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "Şagirdin təhlili: " + ps.map((p, j) => (j + 1) + ") «" + p.t + "» — " + lab[j]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd", solution: "«" + ps[k].t + "» — " + KIND[ps[k].k] + ". " + kindExplain(ps[k]) + " Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const OFEL = { M: "məsdərlə", S: "feili sifətlə", B: "feili bağlama ilə" };
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. söz birləşməsi hansıdır
    { tip: "qapali", gen: () => Oyun.again(() => {
      const p = pick(PHS), ms = pick(TIPB.M), cu = pick(TIPB.C), nt = sample(NOT, 2);
      return AEq("Hansı söz birləşməsidir?", p.t, [ms, cu, nt[0].t, nt[1].t],
        "«" + p.t + "» — söz birləşməsi: iki və daha artıq müstəqil söz. «" + ms + "» — mürəkkəb söz; «" + cu + "» — cümlə; «" + nt[0].t + "» və «" + nt[1].t + "» — köməkçi nitq hissəsi iştirak etdiyindən (və ya mürəkkəb feil, mürəkkəb say olduğundan) söz birləşməsi deyil.");
    }) },
    // 2. əsas tərəfi məsdərlə / feili sifətlə / feili bağlama ilə ifadə olunan birləşmə
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick([..."MSB"]), right = pick(PHS.filter(p => p.k === t));
      const traps = ISMI.filter(p => p.trap === t), others = [..."MSB"].filter(x => x !== t).map(x => pick(PHS.filter(p => p.k === x)));
      const ism = sample(ISMI.filter(p => !p.trap), 2), wrong = [...(traps.length ? [pick(traps)] : []), ...others, ...ism].slice(0, 4);
      if (wrong.length < 4) return null;
      return AEq("Hansı birləşmənin əsas tərəfi " + OFEL[t] + " ifadə olunub?", right.t, wrong.map(p => p.t),
        "«" + right.t + "» — " + kindExplain(right) + " Qalanları: " + wrong.map(p => "«" + p.t + "» — " + KIND[p.k]).join("; ") + ".");
    }) },
    // 3. nömrə kombinasiyası: ismi / feili
    { tip: "qapali", gen: () => Oyun.again(() => {
      const isIsmi = Math.random() < .5, kk = 1 + R(3);
      const yes = sample(isIsmi ? PHS.filter(p => p.k === "I") : PHS.filter(p => p.k !== "I"), kk), no = sample(isIsmi ? PHS.filter(p => p.k !== "I") : PHS.filter(p => p.k === "I"), 5 - kk);
      const five = shuffle([...yes, ...no]); if (new Set(five.map(p => p.t)).size < 5) return null;
      const right = five.map((p, i) => yes.includes(p) ? i + 1 : 0).filter(Boolean), o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Nömrələnmiş birləşmələrdən hansıları " + (isIsmi ? "ismi" : "feili") + " birləşmədir?", ...numbered(five.map(p => p.t)));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((p, i) => (i + 1) + ") " + p.t + " — " + (p.k === "I" ? "ismi" : "feili") + " (" + KIND[p.k] + ")").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 4. asılı tərəf
    { tip: "qapali", gen: () => Oyun.again(() => {
      const p = pick(PH3), n = p.ws.length, right = p.ws.slice(0, n - 1).join(" ");
      const cand = [];
      for (let l = 1; l <= n; l++) if (l !== n - 1) cand.push(p.ws.slice(0, l).join(" "));
      cand.push(p.ws[n - 1]); cand.push(p.ws[0] + " " + p.ws[n - 1]);
      const wrong = sample([...new Set(cand)].filter(x => x !== right), 4); if (wrong.length < 4) return null;
      return AEq("«" + p.t + "» birləşməsinin asılı tərəfi hansıdır?", right, wrong, "Əsas tərəf — «" + p.es + "» (birləşmənin sonunda dayanır, tabe edən söz). Asılı tərəf əsas sözdən əvvəl gəlir və onu izah edir: «" + right + "».");
    }) },
    // 5. nömrə kombinasiyası: məsdər / feili sifət / feili bağlama
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick([..."MSB"]), kk = 1 + R(3);
      const yes = sample(PHS.filter(p => p.k === t), kk), no = sample(PHS.filter(p => p.k !== t), 5 - kk);
      const five = shuffle([...yes, ...no]); if (new Set(five.map(p => p.t)).size < 5) return null;
      const right = five.map((p, i) => yes.includes(p) ? i + 1 : 0).filter(Boolean), o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Nömrələnmiş birləşmələrdən hansılarının əsas tərəfi " + OFEL[t] + " ifadə olunub?", ...numbered(five.map(p => p.t)));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((p, i) => (i + 1) + ") " + p.t + " — " + KIND[p.k]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 6. düzgün yazılış
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ns = sample(NAMES, 5), right = ns[0], ws = ns.slice(1).map(n => ({ n, v: pick(singles(n)) }));
      return AEq("Hansı mürəkkəb adın yazılışı düzgündür?", right.t, ws.map(x => applyFlip(x.n, x.v)),
        "Düzgün: «" + right.t + "». Səhvlər: " + ws.map(x => "«" + applyFlip(x.n, x.v) + "» (düz: " + x.n.t + ") — " + flipWhy(x.n, x.v)).join(" "));
    }) },
    // 7. səhv yazılış
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ns = sample(NAMES, 5), bad = ns[0], v = pick(singles(bad));
      return AEq("Mürəkkəb adların hansında orfoqrafik səhv var?", applyFlip(bad, v), ns.slice(1).map(n => n.t),
        "Səhv: «" + applyFlip(bad, v) + "» (düz: " + bad.t + ") — " + flipWhy(bad, v) + " Qalan dörd ad düzgün yazılıb.");
    }) },
    // 8. nömrə kombinasiyası: cümlələrdə yazılış
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ns = sample(NAMES, 5), frs = shuffle(FRAME), kk = 1 + R(4), okIdx = sample([0, 1, 2, 3, 4], kk).sort((a, b) => a - b);
      const info = ns.map((n, i) => { const ok = okIdx.includes(i), v = ok ? null : pick(singles(n)); return { n, ok, v, s: sentence(n, v, frs[i]) }; });
      const right = okIdx.map(i => i + 1), o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı cümlələrdə mürəkkəb adın yazılışı düzgündür?", ...numbered(info.map(x => x.s)));
      return { text: txt, ...o, show: o.choices[o.correct],
        solution: info.map((x, i) => (i + 1) + ") " + (x.ok ? "düzgündür" : "səhvdir: düz «" + x.n.t + "» — " + flipWhy(x.n, x.v))).join(" ") + " Cavab: " + combo(right) + "." };
    }) },
    // 9. söz birləşməsi haqqında fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_BIR_SEHV); return AEq("Söz birləşməsi ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_BIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_BIR_DUZ); return AEq("Söz birləşməsi ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_BIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
    // 10. mürəkkəb adlar haqqında fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_AD_SEHV); return AEq("Mürəkkəb adların yazılışı ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_AD_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_AD_DUZ); return AEq("Mürəkkəb adların yazılışı ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_AD_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== müstəqil yoxlama bəndləri (Codex cavabsız həll edir) ========
  const Y = [], add = (id, sual, cavab) => Y.push({ id, sual, cavab: String(cavab) });
  const chunk = (arr, n) => arr.reduce((r, x, i) => (i % n ? r[r.length - 1].push(x) : r.push([x]), r), []);
  const KDESC = "növ: ismi birləşmə, məsdər tərkibi, feili sifət tərkibi, feili bağlama tərkibi";
  // birləşmələr: əsas tərəf və növ (asılı tərəf — əsas tərəfdən əvvəlki bütün sözlər)
  chunk(PHS, 3).forEach((g, i) => add("bir-" + (i + 1), "Hər söz birləşməsinin əsas tərəfini (birləşmənin sonunda dayanan, tabe edən söz) və növünü müəyyən et (" + KDESC + "; növ əsas tərəfin ifadə vasitəsinə görə seçilir). " +
    g.map((p, j) => (j + 1) + ") «" + p.t + "»").join(" ") + " Cavabı əsas/növ formasında yaz, üç cavabı «;» ilə ayır.", g.map(p => p.es + "/" + KIND[p.k]).join(";")));
  PH.filter(p => p.cmp).forEach(p => add("bir-cmp-" + p.t.replace(/ /g, "_"), "«" + p.t + "» söz birləşməsinin növü hansıdır (" + KDESC + ")? Əsas tərəf mürəkkəb feilin sonuncu hissəsini də əhatə edir.", KIND[p.k]));
  chunk(PH3, 3).forEach((g, i) => add("asili-" + (i + 1), "Hər söz birləşməsinin asılı tərəfini yaz (əsas sözdən əvvəlki hissə). " + g.map((p, j) => (j + 1) + ") «" + p.t + "»").join(" ") + " Cavabı «;» ilə ayır.", g.map(p => p.as.join(" ")).join(";")));
  // birləşmə olub-olmaması
  add("deyil-1", "Hər vahid söz birləşməsidirmi (bəli/xeyr)? " + NOT.slice(0, 3).map((n, j) => (j + 1) + ") «" + n.t + "»").join(" ") + " 4) «futbol topu» Cavabı «/» ilə ayır.", "xeyr/xeyr/xeyr/bəli");
  add("deyil-2", "Hər vahid söz birləşməsidirmi (bəli/xeyr)? " + NOT.slice(3).map((n, j) => (j + 1) + ") «" + n.t + "»").join(" ") + " 3) «qocaya hörmət» Cavabı «/» ilə ayır.", "xeyr/xeyr/bəli");
  // söz birləşməsi / mürəkkəb söz / cümlə
  const TV = [...TIPB.B.map(w => [w, "söz birləşməsi"]), ...TIPB.M.map(w => [w, "mürəkkəb söz"]), ...TIPB.C.map(w => [w, "cümlə"])];
  chunk(shuffle(TV), 4).forEach((g, i) => add("tip-" + (i + 1), "Hər vahid söz birləşməsidir, mürəkkəb sözdür, yoxsa cümlə? (Durğu işarələri qoyulmayıb.) " + g.map(([w], j) => (j + 1) + ") «" + w + "»").join(" ") + " Cavabı «/» ilə ayır.", g.map(x => x[1]).join("/")));
  // mürəkkəb adlar: iki yazılışdan düzgünü
  chunk(NAMES, 3).forEach((g, i) => add("ad-" + (i + 1), "Mürəkkəb adın hansı yazılışı düzgündür (dərslik qaydalarına görə: ad, soyad, ölkə, idarə adlarının hər sözü böyük, oğlu / qızı / adına kiçik; dəniz, çay, şəhər, kənd, dağ və s. sözü olan adlarda adın özü böyük, bu söz kiçik; mirzə, hacı, şah, bəy, xan və s. addan əvvəl böyük, sonra kiçik; cənubi, aşağı, orta, uzaq kimi sözlər böyük)? " +
    g.map((n, j) => { const v = applyFlip(n, variants(n)[0]), first = (i + j) % 2 === 0; return (j + 1) + ") 1. " + (first ? n.t : v) + " 2. " + (first ? v : n.t); }).join("; ") + ". Cavabı «/» ilə ayır (1 və ya 2).",
    g.map((n, j) => ((i + j) % 2 === 0 ? "1" : "2")).join("/")));
  // fikirlər
  const FX = [...FIKIR_BIR_DUZ.map(x => [x, "doğru"]), ...FIKIR_BIR_SEHV.map(x => [x, "səhv"]), ...FIKIR_AD_DUZ.map(x => [x, "doğru"]), ...FIKIR_AD_SEHV.map(x => [x, "səhv"])];
  chunk(shuffle(FX), 3).forEach((g, i) => add("fikir-" + (i + 1), "Hər fikir Azərbaycan dili dərsliklərinin (söz birləşməsi; mürəkkəb adların yazılışı) qaydasına görə doğrudurmu? " + g.map(([x], j) => (j + 1) + ") " + x).join(" ") + " Cavabı «/» ilə ayır (doğru/səhv).", g.map(x => x[1]).join("/")));
  window.__yoxla = Y;

  window.__levels = levels;
  window.__bank = { PH, NOT, TIPB, NAMES, FIKIR_BIR_DUZ, FIKIR_BIR_SEHV, FIKIR_AD_DUZ, FIKIR_AD_SEHV };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-soz-birlesmesi", title: "Söz birləşməsi; mürəkkəb adlar", fenn: "azdili", link: "dersler/az-soz-birlesmesi.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, sözə toxunmaq və ya sözləri qruplara ayırmaq. Birləşmənin növünü əsas tərəfə görə, adın yazılışını qaydaya görə müəyyən et.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tip", "taraf", "ismifeili", "feilinov", "feilinov", "yazduz", "yazbol", "yazsec", "yazsec", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-soz-birlesmesi.html")) b.push("dersler/az-soz-birlesmesi.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
