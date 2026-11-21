// Azərbaycan dili · Nitq hissələri; leksik və qrammatik məna — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 1-ci hissə (2024), s. 27 "Leksik və qrammatik məna"; 2-ci hissə (2024),
// s. 10–11 "Əsas və köməkçi nitq hissələri", s. 49, 54–55 (zərf; zərflə omonim sözlər), s. 80–81 (isimləşmə, sifətləşmə);
// 6-cı sinif, 1-ci hissə (2025), s. 87 (qoşma ilə omonim sözlər). Suallar cümlə bankından qurulur: bankdakı hər söz
// cümlədəki işlənməsinə görə etiketlənib və müstəqil yoxlanıb (Codex). Bankda qəsdən olmayanlar: feili sifət, feili
// bağlama, məsdər, "var/yox", "idi/imiş" və mübahisəli sözlər (çox, bir, da/də, ki) — onlar sonrakı mövzulardadır.
(function () {
  const h = Oyun.h;
  const AD = { I: "isim", S: "sifət", Y: "say", E: "əvəzlik", F: "feil", Z: "zərf", Q: "qoşma", B: "bağlayıcı", D: "ədat", M: "modal söz", N: "nida" };
  const PRED = { I: "isimdir", S: "sifətdir", Y: "saydır", E: "əvəzlikdir", F: "feildir", Z: "zərfdir", Q: "qoşmadır", B: "bağlayıcıdır", D: "ədatdır", M: "modal sözdür", N: "nidadır" };
  const PLD = { I: "isimlərdir", S: "sifətlərdir", Y: "saylardır", E: "əvəzliklərdir", F: "feillərdir", Z: "zərflərdir" };
  const PL_DAT = { I: "isimlərə", S: "sifətlərə", Y: "saylara", E: "əvəzliklərə", F: "feillərə", Z: "zərflərə" };
  const PL = { I: "isimlər", S: "sifətlər", Y: "saylar", E: "əvəzliklər", F: "feillər", Z: "zərflər" };
  // ümumi qrammatik məna (5-ci sinif dərsliyi: 1-ci hissə s. 27; 2-ci hissə s. 10, 34, 41, 54; proqram: əvəzlik)
  const MEAN = { I: "əşya bildirir (kim? nə? hara?)", S: "əşyanın əlamətini, keyfiyyətini bildirir (necə? hansı?)", Y: "miqdar və ya sıra bildirir (neçə? nə qədər? neçənci?)",
    E: "əsas nitq hissələrinin yerində işlənir", F: "hərəkət bildirir (nə etdi? nə edir? …)", Z: "hərəkəti müxtəlif cəhətdən izah edir (necə? nə vaxt? harada? nə qədər?)" };
  const ESAS = "ISYEFZ", KOM = "QBDMN";
  const isKom = t => KOM.includes(t);

  // ---- cümlə bankı: "söz:ETİKET"; "_" iki sözdən ibarət bir vahiddir; etiketsiz işarə — durğu işarəsi.
  // x = əsas nitq hissəsi (növü bu tapşırıqlarda soruşulmur) — dərslikdən götürülmüş köməkçi nümunələri üçün.
  const BANK = [
    "Kiçik:S uşaq:I parka:I tez:Z qaçdı:F .",
    "Biz:E dünən:Z üç:Y yeni:S kitab:I aldıq:F .",
    "Nənəm:I bağda:I qırmızı:S güllər:I əkdi:F .",
    "Əlbəttə:M , sən:E bu:E işi:I bacararsan:F .",
    "Ay:N uşaqlar:I , içəri:Z keçin:F !",
    "Bəh-bəh:N , bu:E alma:I şirindir:S !",
    "Səbinə:I və:B Lalə:I məktəbə:I getdilər:F .",
    "Yağış:I yağırdı:F , amma:B biz:E evə:I qayıtmadıq:F .",
    "Dərsdən:I sonra:Q şagirdlər:I həyətdə:I oynadılar:F .",
    "Atam:I mənim:E üçün:Q maraqlı:S kitab:I gətirdi:F .",
    "Uşaqlar:I quş:I kimi:Q sevinirdilər:F .",
    "Məhz:D sən:E bu:E sualın:I cavabını:I bilirsən:F .",
    "Hətta:D kiçik:S qardaşım:I üç:Y şeir:I əzbərlədi:F .",
    "Bəlkə:M , qonaqlar:I sabah:Z gələcəklər:F .",
    "Həyətimizdə:I iki:Y hündür:S ağac:I böyüyür:F .",
    "Beşinci:Y sinfin:I şagirdləri:I ekskursiyaya:I getdilər:F .",
    "Qatar:I stansiyaya:I yavaş-yavaş:Z yaxınlaşırdı:F .",
    "Of:N , bu:E çanta:I ağırdır:S !",
    "Lalə:I ingiliscə:Z yaxşı:Z danışırdı:F .",
    "Sürəyya:I həmişə:Z az:Z danışardı:F .",
    "Zala:I az:Y tamaşaçı:I gəlmişdi:F .",
    "Teatr:I salonuna:I xeyli:Y tamaşaçı:I toplaşmışdı:F .",
    "Mən:E bu:E sual:I haqqında:Q xeyli:Z düşündüm:F .",
    "Biz:E həyəcanla:Z səhəri:I gözləyirdik:F .",
    "Dağın:I zirvəsindən:I gözəl:S mənzərə:I açıldı:F .",
    "Natiq:I fikirlərini:I gözəl:Z ifadə_edirdi:F .",
    "Gecə:Z şəhərə:I çatdıq:F .",
    "Doğru:S cavabları:I dəftərə:I yazdıq:F .",
    "Uşaq:I səkiyə:I doğru:Q qaçdı:F .",
    "Əli:I və:B Sənan:I dostdurlar:I .",
    "Yağış:I şəhərə:I qədər:Q kəsmədi:F .",
    "Nəhayət:M , qonaqlar:I gəldilər:F .",
    "Deyəsən:M , o:E bizi:E tanımadı:F .",
    "Axı:D mən:E səni:E çoxdan:Z gözləyirəm:F .",
    "Ura:N , biz:E qazandıq:F !",
    "Vay:N , stəkan:I sındı:F !",
    "Atam:I hər:E gün:I tezdən:Z durur:F .",
    "Bütün:E şagirdlər:I imtahana:I hazırlaşırlar:F .",
    "Kimsə:E qapını:I döyür:F .",
    "Meyvələri:I öz:E bağımızdan:I dərmişəm:F .",
    "Kim:E bu:E şəkli:I çəkib:F ?",
    "Bu:E yerlərin:I təbiəti:I gözəldir:S .",
    "Onlar:E evə:I gec:Z qayıtdılar:F .",
    "Ceyran:I cəld:Z qaçırdı:F .",
    "Qardaşım:I geri:Z döndü:F .",
    "Çayda:I çoxlu:Y balıq:I üzürdü:F .",
    "Mən:E ikinci:Y mərtəbədə:I yaşayıram:F .",
    "Lalə:I məktubu:I diqqətlə:Z oxudu:F .",
    "Külək:I bərk:Z əsirdi:F .",
    "Bərk:S daşlar:I yolu:I bağlamışdı:F .",
    "Biz:E tələsdik:F , çünki:B dərs:I başlayırdı:F .",
    "Məktəbə:I səkkiz:Y yeni:S kompüter:I gətirdilər:F .",
    "O:E , sakitcə:Z otağa:I girdi:F .",
    "Kitabı:I oxudum:F , lakin:B məzmununu:I unutdum:F .",
    "Bu:E yay:I biz:E dənizə:I gedəcəyik:F .",
    "Əhsən:N , sən:E yaxşı:Z oxudun:F !",
    // dərslikdən (5-ci sinif, 2-ci hissə, s. 11): yalnız köməkçi sözlər etiketlənib
    "Biz:x evə:x kimi:Q piyada:x getdik:x .",
    "Qardaşım:x və:B mən:x gəzintiyə:x çıxmaq:x istədik:x , amma:B yağış:x imkan:x vermədi:x .",
    "Təkcə:D sənə:x güvənirəm:x , axı:D sən:x mənim:x ən:D etibarlı:x dostumsan:x .",
    "Ay:N oğul:x , böyük:x hünər:x göstərdin:x , əhsən:N !",
  ].map(s => s.split(" ").map(t => { const m = t.match(/^(.+):([A-Zx])$/); return m ? { w: m[1].replace(/_/g, " "), t: m[2] } : { w: t, t: null }; }));
  const FULL = BANK.filter(s => s.every(x => x.t !== "x")); // hər sözü etiketli cümlələr
  const words = s => s.filter(x => x.t);
  const plain = s => s.map((x, i) => (i && x.t ? " " : "") + x.w).join("");
  const has = (s, t) => s.some(x => t === "K" ? x.t && isKom(x.t) : x.t === t);

  // ---- tək sözlər (cümlədən kənarda da nitq hissəsi birmənalıdır)
  const SOZ = {
    I: ["kitab", "dəniz", "ağac", "məktəb", "şəhər", "sevinc", "dostluq", "qələm", "çiçək", "vətən", "dəftər", "pəncərə", "sərçə", "bulud"],
    S: ["mehriban", "ağıllı", "səbirli", "hündür", "geniş", "ləzzətli", "cəsarətli", "dərin", "qəmgin", "yaşıl", "nazik", "qorxaq", "səliqəli"],
    Y: ["yeddi", "doqquz", "iyirmi", "yüz", "beşinci", "onuncu", "üçdə bir", "beş-altı", "minlərcə", "bir neçə"],
    F: ["oxudu", "yazır", "qaçdı", "düşünür", "sevindi", "getmədi", "gülür", "danışdılar", "əkdik", "yazacaq", "oynayır"],
    Z: ["tez", "gec", "yavaş-yavaş", "içəri", "geri", "irəli", "dünən", "həmişə", "çoxdan", "ucadan", "tezdən", "sakitcə"],
    E: ["mən", "biz", "onlar", "siz", "kim", "hamı", "kimsə", "həmin", "bütün", "öz"],
    Q: ["üçün", "haqqında", "ilə"], B: ["və", "amma", "lakin", "çünki", "yaxud"], D: ["axı", "hətta", "məhz", "məgər"],
    M: ["əlbəttə", "bəlkə", "deyəsən"], N: ["of", "vay", "ura", "əhsən", "bəh-bəh"],
  };
  const KOM_SOZ = [...KOM].flatMap(t => SOZ[t].map(w => ({ w, t })));
  // two classes for "biri fərqlidir": not sifət with zərf — many adjectives also work as adverbs (mehriban danışmaq)
  const pair = () => { for (;;) { const [a, b] = sample([..."ISYFZ"], 2); if (!(a + b === "SZ" || a + b === "ZS")) return [a, b]; } };

  // ---- eyni söz — fərqli nitq hissəsi (dərslik nümunələri; *söz* fərqləndirilmiş sözdür)
  const OMO = [
    ["*Yaxşı* iş üz ağardar.", "S", "hansı iş? — ismə aiddir"],
    ["Lalə ingiliscə *yaxşı* danışırdı.", "Z", "necə danışırdı? — feilə aiddir"],
    ["*Az* adam tapılar ki, bunu bilməsin.", "Y", "nə qədər adam? — ismə aiddir, miqdar bildirir"],
    ["Sürəyya həmişə *az* danışardı.", "Z", "nə qədər danışardı? — feilə aiddir"],
    ["Biz həyəcanla *səhəri* gözləyirdik.", "I", "nəyi? — təsirlik halda isim"],
    ["*Səhər* hava soyuq idi.", "Z", "nə vaxt? — zaman bildirir"],
    ["Qarşımızda *gözəl* mənzərə açıldı.", "S", "necə mənzərə? — ismə aiddir"],
    ["Natiq fikirlərini *gözəl* ifadə edirdi.", "Z", "necə ifadə edirdi? — feilə aiddir"],
    ["*Gecə* şəhərə çatdıq.", "Z", "nə vaxt çatdıq? — feilə aiddir"],
    ["Yayda *gecə* gündüzdən qısa olur.", "I", "nə? — haqqında danışılan əşyadır"],
    ["*Doğru* cavabları seçib dəftərinizə yazın.", "S", "hansı cavabları? — ismə aiddir"],
    ["Hamıdan *doğru* danışmağı xahiş edirəm.", "Z", "necə danışmağı? — hərəkətə aiddir"],
    ["O, topun dalınca səkiyə *doğru* qaçdı.", "Q", "yönlük haldakı sözə qoşulub istiqamət çaları yaradır; ayrılıqda suala cavab vermir"],
    ["Bu məsələni həll etmək üçün *xeyli* düşündüm.", "Z", "nə qədər düşündüm? — feilə aiddir"],
    ["Teatr salonunda *xeyli* tamaşaçı var idi.", "Y", "nə qədər tamaşaçı? — ismə aiddir, qeyri-müəyyən miqdar"],
    ["Kuryerin gətirdiyi *bağlama* müdirə çatmalı idi.", "I", "nə? — əşya bildirir"],
    ["Qızım, pəncərələri *bağlama*.", "F", "nə etmə? — hərəkət (inkar)"],
    ["Bu *çəkmə* çox bahalıdır.", "I", "nə? — əşya (ayaqqabı)"],
    ["Çalış xətləri əyri *çəkmə*.", "F", "nə etmə? — hərəkət (inkar)"],
    ["*Əvvəl* nahar et, sonra həyətə düşərsən.", "Z", "nə vaxt? — feilə aiddir"],
    ["Tamaşadan *əvvəl* hər kəs öz yerini tutdu.", "Q", "çıxışlıq haldakı sözə qoşulub zaman çaları yaradır"],
    ["Xoş söhbətdən *sonra* əhvalımız xeyli yaxşılaşdı.", "Q", "çıxışlıq haldakı sözə qoşulub zaman çaları yaradır"],
    ["Külək *bərk* əsirdi.", "Z", "necə əsirdi? — feilə aiddir"],
    ["*Bərk* daşlar yolu bağlamışdı.", "S", "necə daşlar? — ismə aiddir"],
    ["Ev uca *daş* hasarla əhatə olunmuşdur.", "I", "sifətləşmiş isim: necə hasar? sualına cavab versə də, isim hesab olunur"],
    ["Bu *qızıl* saatdan cəmi 50 ədəd istehsal olunub.", "I", "sifətləşmiş isim: əlamət bildirsə də, isim hesab olunur"],
    ["*Qocadan* demək, cavandan əmək.", "S", "isimləşmiş sifət: kimdən? sualına cavab verir, hal şəkilçisi qəbul edib, amma sifət olaraq qalır"],
    ["*Beşincilər* yarışda qalib gəldilər.", "Y", "isimləşmiş say: kimlər? sualına cavab verir, cəm şəkilçisi qəbul edib, amma say olaraq qalır"],
    ["Pis olmasa, *yaxşının* qədri bilinməz.", "S", "isimləşmiş sifət: nəyin? sualına cavab verir, amma sifət olaraq qalır"],
  ].map(([s, t, why]) => ({ s, t, why, w: s.match(/\*([^*]+)\*/)[1] }));
  // fərqləndirilmiş söz qalın və altdan xətli
  const mark = s => { const p = s.split("*"); return h("span", {}, p[0], h("u", {}, h("b", {}, p[1])), p[2]); };
  // the sentence of a question on its own line, as on the exam sheet
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);

  // ---- köməkçi nitq hissələrinin funksiyası (5-ci sinif, 2-ci hissə, s. 11)
  const FUNK = { Q: "sözlərə qoşularaq məna çaları yaradır", B: "sözlər və ya cümlələr arasında əlaqə yaradır", D: "sözün və ya cümlənin təsir gücünü artırır",
    M: "danışanın fikrə münasibətini bildirir", N: "hiss-həyəcan ifadə edir" };

  // ---- köməkçi
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const SUP = "¹²³⁴⁵⁶⁷";
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  // A–E variantı üçün "nömrə kombinasiyası": düz alt çoxluq + 4 başqa (1–4 elementli) alt çoxluq
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }
  const lexSol = s => words(s).filter(x => isKom(x.t)).map(x => x.w + " — " + AD[x.t]).join("; ");

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "leksik", ad: "Leksik və qrammatik məna", izah: "Hər sözü qrupuna ayır: əsas nitq hissələrinin həm leksik, həm qrammatik mənası var; köməkçilərin yalnız qrammatik mənası.",
      gen() {
        const s = pick(BANK.filter(x => has(x, "K") && words(x).filter(w => !isKom(w.t)).length >= 2));
        let ws = words(s);
        if (ws.length > 7) { const k = ws.filter(w => isKom(w.t)), e = ws.filter(w => !isKom(w.t)); ws = [...sample(k, Math.min(k.length, 3)), ...sample(e, 7 - Math.min(k.length, 3))]; ws.sort((a, b) => s.indexOf(a) - s.indexOf(b)); }
        const qrup = ["həm leksik, həm qrammatik", "yalnız qrammatik"];
        return { text: "«" + plain(s) + "» — sözləri mənasına görə qruplara ayır.", bol: { soz: ws.map(w => w.w), qrup, duz: ws.map(w => isKom(w.t) ? 1 : 0) },
          show: "yalnız qrammatik: " + ws.filter(w => isKom(w.t)).map(w => w.w).join(", ") + "; qalanları həm leksik, həm qrammatik",
          solution: "Köməkçi nitq hissələrinin yalnız qrammatik mənası var: " + lexSol(s) + ". Qalan sözlər əsas nitq hissələridir — həm leksik, həm qrammatik mənası var." };
      } },
    { id: "sualsiz", ad: "Suala cavab verməyən sözlər", izah: "Köməkçi nitq hissələri ayrılıqda heç bir suala cavab vermir. Onların hamısına toxun.",
      gen() {
        const s = pick(BANK.filter(x => has(x, "K")));
        const duz = s.map((x, i) => x.t && isKom(x.t) ? i : -1).filter(i => i >= 0);
        return { text: "Ayrılıqda heç bir suala cavab verməyən sözlərin hamısına toxun.", sec: { soz: s.map(x => x.w), duz },
          show: duz.map(i => s[i].w).join(", "), solution: lexSol(s) + ". Bunlar köməkçi nitq hissələridir: sual vermək olmur, cümlə üzvü olmur." };
      } },
    { id: "tap", ad: "Nitq hissəsini tap", izah: "Cümlədə göstərilən nitq hissəsinə aid bütün sözlərə toxun. Sual ver: söz hansı suala cavab verir, nəyə aiddir?",
      gen() {
        const t = pick([..."ISYEFZ"]), s = pick(FULL.filter(x => has(x, t)));
        const duz = s.map((x, i) => x.t === t ? i : -1).filter(i => i >= 0);
        return { text: "Cümlədəki bütün " + PL_DAT[t] + " toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
          solution: PL[t][0].toUpperCase() + PL[t].slice(1) + ": " + duz.map(i => s[i].w).join(", ") + " (" + MEAN[t] + "). Qalanları: " + words(s).filter(x => x.t !== t).map(x => x.w + " — " + AD[x.t]).join(", ") + "." };
      } },
    { id: "umumi", ad: "Ümumi qrammatik məna", izah: "Beş sözdən biri ümumi qrammatik mənasına görə fərqlidir: əşya, əlamət, miqdar, hərəkət, hərəkətin izahı…",
      gen() {
        const [a, b] = pair(), four = sample(SOZ[a], 4), odd = pick(SOZ[b]);
        const ch = shuffle([...four, odd]);
        return { text: "Ümumi qrammatik mənasına görə biri fərqlidir:", choices: ch, correct: ch.indexOf(odd), show: odd,
          solution: "“" + odd + "” — " + AD[b] + ", " + MEAN[b] + ". Qalanları " + PLD[a] + ": " + MEAN[a] + "." };
      } },
    { id: "bolgu", ad: "Bölgü: nitq hissələri", izah: "Cümlədəki sözləri nitq hissələrinə ayır. Hər söz üçün sual ver.",
      gen() {
        const s = pick(FULL.filter(x => new Set(words(x).map(w => w.t)).size >= 3)), ws = words(s);
        // the groups present plus one or two that are not, so the last word is never decided by elimination
        const here = new Set(ws.map(w => w.t)), extra = sample([...ESAS].filter(t => !here.has(t)), 1 + R(2));
        const tags = [...ESAS, ...KOM].filter(t => here.has(t) || extra.includes(t)), qrup = tags.map(t => AD[t]);
        return { text: "«" + plain(s) + "» — sözləri nitq hissələrinə ayır.", bol: { soz: ws.map(w => w.w), qrup, duz: ws.map(w => tags.indexOf(w.t)) },
          show: ws.map(w => w.w + " — " + AD[w.t]).join("; "), solution: ws.map(w => w.w + " — " + AD[w.t]).join("; ") + "." };
      } },
    { id: "omonim", ad: "Eyni söz — fərqli nitq hissəsi", izah: "Nitq hissəsini cümlədəki işlənmə müəyyən edir: sual ver, mənasına və aid olduğu sözə bax. Əlamət bildirib ismə aiddirsə — sifət, hərəkəti izah edirsə — zərf; daş hasar — yenə isim.",
      gen() {
        const o = pick(OMO), opts = ["isim", "sifət", "say", "zərf", o.t === "Q" ? "qoşma" : "feil"];
        return { text: h("span", {}, "Fərqləndirilmiş söz hansı nitq hissəsidir?", line(mark(o.s))), choices: opts, correct: opts.indexOf(AD[o.t]), show: AD[o.t],
          solution: "“" + o.w + "” burada " + AD[o.t] + ": " + o.why + "." };
      } },
    { id: "komekci", ad: "Köməkçi nitq hissəsinin növü", izah: "Qoşma — məna çaları; bağlayıcı — əlaqə; ədat — təsir gücü; modal söz — danışanın münasibəti; nida — hiss-həyəcan.",
      gen() {
        const s = pick(BANK.filter(x => has(x, "K"))), i = pick(s.map((x, j) => x.t && isKom(x.t) ? j : -1).filter(j => j >= 0));
        const opts = [..."QBDMN"].map(t => AD[t]), t = s[i].t;
        const txt = h("span", {}, "Fərqləndirilmiş söz hansı köməkçi nitq hissəsidir?", line(...s.map((x, j) => [j && x.t ? " " : "", j === i ? h("u", {}, h("b", {}, x.w)) : x.w])));
        return { text: txt, choices: opts, correct: opts.indexOf(AD[t]), show: AD[t], solution: "“" + s[i].w + "” — " + AD[t] + ": " + FUNK[t] + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümlədə üç sözün nitq hissəsini yazıb. Biri səhvdir — hansı?",
      gen() {
        const CONF = { I: "S", S: "Z", Y: "S", E: "I", F: "I", Z: "S", Q: "B", B: "Q", D: "M", M: "D", N: "D" };
        const s = pick(FULL.filter(x => words(x).length >= 3)), ws = sample(words(s), 3).sort((a, b) => s.indexOf(a) - s.indexOf(b)), k = R(3);
        const lab = ws.map((w, j) => j === k ? CONF[w.t] : w.t);
        const ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "«" + plain(s) + "» — şagirdin təhlili: " + ws.map((w, j) => (j + 1) + ") " + w.w + " — " + AD[lab[j]]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "“" + ws[k].w + "” " + AD[lab[k]] + " deyil, " + PRED[ws[k].t] + ". Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const FIKIR_DUZ = [
    "Əsas nitq hissələrinin həm leksik, həm də qrammatik mənası var.",
    "Köməkçi nitq hissələrinin yalnız qrammatik mənası var.",
    "Köməkçi nitq hissələri ayrılıqda suala cavab vermir.",
    "Sözün ifadə etdiyi anlayış onun leksik mənasıdır.",
    "Sözün hansı nitq hissəsinə aid olması onun qrammatik mənasına aiddir.",
    "Əsas nitq hissələri cümlə üzvü olur.",
    "Əsas nitq hissələri şəkilçi qəbul edir.",
    "Zərf, əsasən, feilə aid olur və onu müxtəlif cəhətdən izah edir.",
    "Qoşma sözlərə qoşularaq müəyyən məna çaları yaradır.",
    "Bağlayıcı həm sözlər, həm də cümlələr arasında əlaqə yaradır.",
    "Ədat sözlərin və ya cümlənin təsir gücünü artırır.",
    "Modal sözlər danışanın fikrə münasibətini bildirir.",
    "Nida hiss-həyəcan ifadə edir.",
  ];
  const FIKIR_SEHV = [
    "Köməkçi nitq hissələrinin həm leksik, həm də qrammatik mənası var.",
    "Modal sözlər əsas nitq hissəsidir.",
    "Zərf köməkçi nitq hissəsidir.",
    "Əvəzlik köməkçi nitq hissəsidir.",
    "Say köməkçi nitq hissəsidir.",
    "Bağlayıcı ayrılıqda suala cavab verir.",
    "Nida əsas nitq hissəsidir.",
    "Qoşmanın leksik mənası var.",
    "Əsas nitq hissələrinin yalnız leksik mənası var.",
    "Köməkçi nitq hissələri cümlə üzvü olur.",
  ];
  // söz haqqında fikirlər: [söz, doğru fikirlər, səhv fikirlər] (5-ci sinif, 1-ci hissə, s. 27 nümunələri və 2-ci hissə, s. 10–11)
  const PROFIL = [
    ["şamdan", ["leksik mənası: şam qoymaq üçün altlıq", "isimdir", "təkdədir", "ümumi isimdir", "konkret isimdir", "düzəltmə sözdür"], ["xüsusi isimdir", "cəmdədir", "mücərrəd isimdir", "sadə sözdür", "yalnız qrammatik mənası var"]],
    ["yazdım", ["feildir", "hərəkət bildirir", "keçmiş zamandadır", "I şəxsin təkindədir", "həm leksik, həm qrammatik mənası var"], ["gələcək zamandadır", "II şəxsin cəmindədir", "əşya bildirir", "yalnız qrammatik mənası var", "köməkçi nitq hissəsidir"]],
    ["qapqara", ["sifətdir", "çoxaltma dərəcəsindədir", "əlamət bildirir", "bitişik yazılır", "həm leksik, həm qrammatik mənası var"], ["azaltma dərəcəsindədir", "defislə yazılır", "zərfdir", "hərəkət bildirir", "yalnız qrammatik mənası var"]],
    ["siz", ["əvəzlikdir", "II şəxsin cəmidir", "əsas nitq hissəsidir", "şəxs əvəzliyidir", "ismin yerində işlənir"], ["I şəxsin cəmidir", "köməkçi nitq hissəsidir", "işarə əvəzliyidir", "sualı yoxdur", "yalnız qrammatik mənası var"]],
    ["üçüncü", ["saydır", "varlığın sırasını bildirir", "neçənci? sualına cavab verir", "əsas nitq hissəsidir", "həm leksik, həm qrammatik mənası var"], ["sifətdir", "hərəkət bildirir", "köməkçi nitq hissəsidir", "yalnız qrammatik mənası var", "kəsr sayıdır"]],
    ["fikirdən", ["isimdir", "çıxışlıq haldadır", "nədən? sualına cavab verir", "əsas nitq hissəsidir", "həm leksik, həm qrammatik mənası var"], ["yönlük haldadır", "feildir", "köməkçi nitq hissəsidir", "yalnız qrammatik mənası var", "sifətdir"]],
    ["və", ["bağlayıcıdır", "köməkçi nitq hissəsidir", "yalnız qrammatik mənası var", "ayrılıqda suala cavab vermir", "sözlər və cümlələr arasında əlaqə yaradır"], ["leksik mənası var", "əsas nitq hissəsidir", "cümlə üzvü olur", "qoşmadır", "hiss-həyəcan bildirir"]],
    ["əlbəttə", ["modal sözdür", "köməkçi nitq hissəsidir", "danışanın fikrə münasibətini bildirir", "yalnız qrammatik mənası var", "ayrılıqda suala cavab vermir"], ["ədatdır", "əsas nitq hissəsidir", "leksik mənası var", "cümlə üzvü olur", "nidadır"]],
  ];

  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) {
        const odd = pick(KOM_SOZ), four = [..."ISYFZE"].sort(() => Math.random() - .5).slice(0, 4).map(t => pick(SOZ[t]));
        return AEq("Hansı sözün leksik mənası yoxdur?", odd.w, four, "“" + odd.w + "” — " + AD[odd.t] + ", köməkçi nitq hissəsidir: yalnız qrammatik mənası var. Qalanları əsas nitq hissələridir.");
      }
      const t = pick([..."ISYFZ"]), one = pick(SOZ[t]), four = sample(KOM_SOZ, 4);
      return AEq("Hansı sözün həm leksik, həm də qrammatik mənası var?", one, four.map(x => x.w), "“" + one + "” — " + AD[t] + " (əsas nitq hissəsi). Qalanları köməkçi: " + four.map(x => x.w + " — " + AD[x.t]).join(", ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(BANK.filter(x => words(x).filter(w => isKom(w.t)).length === 1 && words(x).filter(w => !isKom(w.t)).length >= 4)), ws = words(s);
      const k = ws.find(w => isKom(w.t)), e = sample(ws.filter(w => !isKom(w.t)), 4);
      return AEq(h("span", {}, "Cümlədə hansı söz ayrılıqda heç bir suala cavab vermir?", line(plain(s))), k.w, e.map(w => w.w), "“" + k.w + "” — " + AD[k.t] + " (köməkçi nitq hissəsi): " + FUNK[k.t] + ". Qalan sözlər əsas nitq hissələridir, suala cavab verir.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [a, b] = pair(), four = sample(SOZ[a], 4), odd = pick(SOZ[b]);
      return AEq("Ümumi qrammatik mənasına görə biri fərqlidir:", odd, four, "“" + odd + "” — " + AD[b] + ", " + MEAN[b] + ". Qalanları " + PLD[a] + ": " + MEAN[a] + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick([..."SYZEQ"]), withT = FULL.filter(x => has(x, t)), noT = FULL.filter(x => !has(x, t));
      const four = sample(withT, 4), odd = pick(noT);
      const name = AD[t];
      return AEq("Cümlələrin birində " + name + " yoxdur:", plain(odd), four.map(plain),
        "“" + plain(odd) + "” — burada " + name + " yoxdur (" + words(odd).map(w => w.w + " — " + AD[w.t]).join(", ") + "). Digər cümlələrdə " + name + ": " + four.map(s => words(s).filter(w => w.t === t).map(w => w.w).join(", ")).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(FULL.filter(x => words(x).length >= 5)), ws = words(s);
      const five = sample(ws, 5).sort((a, b) => s.indexOf(a) - s.indexOf(b));
      const kinds = ["K", ...new Set(five.map(w => w.t).filter(t => !isKom(t)))], t = pick(kinds);
      const fit = w => t === "K" ? isKom(w.t) : w.t === t;
      const right = five.map((w, i) => fit(w) ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      const num = s.map(x => { const j = five.indexOf(x); return (s.indexOf(x) && x.t ? " " : "") + x.w + (j >= 0 ? SUP[j] : ""); }).join("");
      const ask = t === "K" ? "köməkçi nitq hissəsidir" : PRED[t];
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansılar " + ask + "?", line(num)), ...o, show: o.choices[o.correct],
        solution: five.map((w, i) => (i + 1) + ") " + w.w + " — " + AD[w.t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick([..."SZI"]), five = sample(OMO, 5);
      if (new Set(five.map(o => o.w.toLocaleLowerCase("az"))).size < 4) return null;
      const right = five.map((o, i) => o.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz " + PRED[t] + "?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", mark(x.s))));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + AD[x.t] + " (" + x.why + ")").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const o = pick(OMO), opts = ["isim", "sifət", "say", "zərf", o.t === "Q" ? "qoşma" : "feil"].filter(x => x !== AD[o.t]);
      return AEq(h("span", {}, "Fərqləndirilmiş söz hansı nitq hissəsidir?", line(mark(o.s))), AD[o.t], opts, "“" + o.w + "” — " + AD[o.t] + ": " + o.why + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(BANK.filter(x => has(x, "K"))), i = pick(s.map((x, j) => x.t && isKom(x.t) ? j : -1).filter(j => j >= 0)), t = s[i].t;
      const txt = h("span", {}, "Fərqləndirilmiş söz hansı köməkçi nitq hissəsidir?", line(...s.map((x, j) => [j && x.t ? " " : "", j === i ? h("u", {}, h("b", {}, x.w)) : x.w])));
      return AEq(txt, AD[t], [..."QBDMN"].filter(x => x !== t).map(x => AD[x]), "“" + s[i].w + "” — " + AD[t] + ": " + FUNK[t] + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("Nitq hissələri ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Nitq hissələri ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [w, duz, sehv] = pick(PROFIL);
      if (Math.random() < .5) { const bad = pick(sehv); return AEq("“" + w + "” sözü ilə bağlı səhv fikri müəyyən edin.", bad, sample(duz, 4), "“" + w + "”: " + duz.join(", ") + ". Səhv fikir: " + bad + "."); }
      const ok = pick(duz); return AEq("“" + w + "” sözü ilə bağlı doğru fikri müəyyən edin.", ok, sample(sehv, 4), "“" + w + "”: " + duz.join(", ") + ". Doğru fikir: " + ok + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  window.__levels = levels;
  window.__bank = { BANK, SOZ, OMO, FIKIR_DUZ, FIKIR_SEHV, PROFIL, AD };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-nitq-hisseleri", title: "Nitq hissələri; leksik və qrammatik məna", fenn: "azdili", link: "dersler/az-nitq-hisseleri.html",
      tesadufi: "cümlələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər sözü cümlədəki işlənməsinə görə müəyyən et.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["leksik", "sualsiz", "tap", "tap", "umumi", "bolgu", "omonim", "omonim", "komekci", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-nitq-hisseleri.html")) b.push("dersler/az-nitq-hisseleri.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
