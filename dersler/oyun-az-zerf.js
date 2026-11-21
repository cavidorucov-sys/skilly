// Azərbaycan dili · Zərf — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024): s. 54 (zərf, məna növləri), s. 55 (zərfin digər nitq hissələri ilə ortaq
// xüsusiyyətləri, quruluşca növləri); 6-cı sinif, 1-ci hissə (2025): s. 50 (eyni sözün təkrarı ilə yaranan mürəkkəb sözlər);
// 6-cı sinif, 2-ci hissə (2025): s. 72 ("-la" şəkilçisinin funksiyaları). Köməkçi mənbə — 7-ci sinif: 1-ci hissə s. 62–63, 68
// (mürəkkəb zərflərin yazılışı), 2-ci hissə s. 28 (yer zərfi). Bankdakı hər söz cümlədəki işlənməsinə görə etiketlənib.
// Bankda qəsdən olmayanlar: tez/yavaş/bərk kimi məna növü mübahisəli zərflər (məna növü soruşulmur), ora/bura (əvəzliklə qarışır),
// zərflik (cümlə üzvü — 18-ci mövzu), feili bağlama (qaça-qaça), "-ca/-cə" qaydası (dərslikdə ayrıca qayda kimi verilməyib).
(function () {
  const h = Oyun.h;
  const AD = { I: "isim", S: "sifət", Y: "say", Z: "zərf", F: "feil" };
  const MN = { T: "tərzi-hərəkət zərfi", Z: "zaman zərfi", Y: "yer zərfi", K: "kəmiyyət zərfi" };
  const MP = { T: "tərzi-hərəkət zərfidir", Z: "zaman zərfidir", Y: "yer zərfidir", K: "kəmiyyət zərfidir" };
  const MSUAL = { T: "necə? nə cür?", Z: "nə vaxt? nə zaman?", Y: "haraya? harada? haradan?", K: "nə qədər?" };
  const QN = { S: "sadə zərf", D: "düzəltmə zərf", M: "mürəkkəb zərf" };
  const QP = { S: "sadə zərfdir", D: "düzəltmə zərfdir", M: "mürəkkəb zərfdir" };
  const YN = { bit: "bitişik", def: "defislə", ayr: "ayrı" };

  // ---- köməkçi
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
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const low = x => x.toLocaleLowerCase("az");
  const PUNCT = /^[.,!?]$/;

  // ---- cümlə bankı. *söz* — sualın hədəfi olan zərf, ~söz~ — cümlədəki başqa zərf; "_" iki sözdən ibarət bir vahiddir.
  // [cümlə, sual, məna (T/Z/Y/K), quruluş (S/D/M), yazılış (bit/def/ayr), başqa zərflərin izahı]
  const ZB_RAW = [
    ["Ceyran *cəld* qaçırdı.", "necə qaçırdı?", "T", "S"],
    ["Lalə məktubu *diqqətlə* oxudu.", "necə oxudu?", "T", "D"],
    ["Biz *həvəslə* işlədik.", "necə işlədik?", "T", "D"],
    ["Bahar filmə *həyəcanla* baxırdı.", "necə baxırdı?", "T", "D"],
    ["Uşaqlar *sevinclə* qaçdılar.", "necə qaçdılar?", "T", "D"],
    ["Babam gənclik illərini *həsrətlə* xatırlayırdı.", "necə xatırlayırdı?", "T", "D"],
    ["Oxucular yazıçının yeni əsərlərini *səbirsizliklə* gözləyirdilər.", "necə gözləyirdilər?", "T", "D"],
    ["Şagird mətni *ucadan* oxudu.", "necə oxudu?", "T", "D"],
    ["Qonağı *dostyana* qarşıladılar.", "necə qarşıladılar?", "T", "D"],
    ["O, otağa *sakitcə* girdi.", "necə girdi?", "T", null],
    ["Qatar stansiyaya *yavaş-yavaş* yaxınlaşırdı.", "necə yaxınlaşırdı?", "T", "M", "def"],
    ["Sabir baba *asta-asta* ~üzüyuxarı~ qalxırdı.", "necə qalxırdı?", "T", "M", "def", ["üzüyuxarı — bu da zərfdir (mürəkkəb zərf)"]],
    ["Küçəyə *başdan-başa* asfalt döşənmişdi.", "necə döşənmişdi?", "T", "M", "def"],
    ["Qonaqlar *gec* gəldilər.", "nə vaxt gəldilər?", "Z", "S"],
    ["Biz *dünən* üç yeni kitab aldıq.", "nə vaxt aldıq?", "Z", null],
    ["Qonaqlar *sabah* gələcəklər.", "nə vaxt gələcəklər?", "Z", null],
    ["*Səhər* hava soyuq idi.", "nə vaxt?", "Z", "S"],
    ["Atam *tezdən* işə getdi.", "nə vaxt getdi?", "Z", null],
    ["Mən səni *çoxdan* gözləyirəm.", "nə vaxtdan gözləyirəm?", "Z", null],
    ["Biz *indi* dərs oxuyuruq.", "nə vaxt oxuyuruq?", "Z", "S"],
    ["*Gec-tez* bu məsələni hamı biləcək.", "nə vaxt biləcək?", "Z", "M", "def"],
    ["*Bu_gün* Tarix muzeyinə ekskursiyaya gedəcəyik.", "nə vaxt gedəcəyik?", "Z", "M", "ayr"],
    ["Qonaqlar *içəri* keçdilər.", "haraya keçdilər?", "Y", "S"],
    ["Qardaşım *geri* döndü.", "haraya döndü?", "Y", "S"],
    ["Alpinistlər *yuxarı* qalxdılar.", "haraya qalxdılar?", "Y", "S"],
    ["Dəstə *irəli* getdi.", "haraya getdi?", "Y", "S"],
    ["Uşaq *aşağı* düşdü.", "haraya düşdü?", "Y", "S"],
    ["Çamadanlar *yuxarıya* qaldırıldı.", "haraya qaldırıldı?", "Y", null],
    ["O, pəncərədən boylanıb *içəriyə* nəzər saldı.", "haraya nəzər saldı?", "Y", null],
    ["Şəhər *çox* dəyişmişdi.", "nə qədər dəyişmişdi?", "K", "S"],
    ["Mən bu sual haqqında *xeyli* düşündüm.", "nə qədər düşündüm?", "K", null],
    ["Sürəyya ~həmişə~ *az* danışardı.", "nə qədər danışardı?", "K", "S", null, ["həmişə — nə vaxt? (zaman zərfi)"]],
    ["Şagird dərsi *az-maz* anladı.", "nə qədər anladı?", "K", "M", "def"],
    ["Onlar *üzbəüz* oturmuşdular.", null, null, "M", "bit"],
    ["Alpinistlər *üzüyuxarı* dırmaşırdılar.", null, null, "M", "bit"],
    ["Sabir baba ~asta-asta~ *üzüyuxarı* qalxırdı.", null, null, "M", "bit", ["asta-asta — necə? (tərzi-hərəkət zərfi)"]],
    ["Qapı *taybatay* açıldı.", null, null, "M", "bit"],
    ["Şəhər *günbəgün* gözəlləşirdi.", null, null, "M", "bit"],
    ["Qiymətlər *aybaay* artdı.", null, null, "M", "bit"],
    ["Polis casusu *addımbaaddım* izləyirdi.", null, null, "M", "bit"],
    ["Şəhərin əhalisi *ilbəil* artdı.", null, null, "M", "bit"],
    ["Hava *tez-tez* dəyişirdi.", null, null, "M", "def"],
    ["*Hər_an* yağış başlaya bilər.", null, null, "M", "ayr"],
    ["Biz bu filmə *bir_dəfə* baxmışıq.", null, null, "M", "ayr"],
    ["Qonaqlar *bir_qədər* gözlədilər.", null, null, "M", "ayr"],
  ];
  const ZB = ZB_RAW.map(([raw, sual, m, q, y, ex]) => {
    const toks = raw.replace(/([.,!?])/g, " $1").split(/\s+/).filter(Boolean).map(t => {
      const mm = t.match(/^([*~])(.+)\1$/);
      return mm ? { w: mm[2].replace(/_/g, " "), t: mm[1] === "*" ? "T" : "E" } : { w: t.replace(/_/g, " "), t: null };
    });
    const tg = toks.find(x => x.t === "T");
    return { toks, plain: plainOf(toks), w: low(tg.w), tw: tg.w, sual, m, q, y, ex: ex || [] };
  });
  function plainOf(toks, blank) { return toks.map((x, i) => (i && !PUNCT.test(x.w) ? " " : "") + (blank && x.t === "T" ? "…" : x.w)).join(""); }
  const hasM = ZB.filter(e => e.m), hasQ = ZB.filter(e => e.q);
  const mark = e => h("span", {}, ...e.toks.map((x, i) => [i && !PUNCT.test(x.w) ? " " : "", x.t === "T" ? h("u", {}, h("b", {}, x.w)) : x.w]));

  // quruluş: sözün tərkibi
  const PARTS = {
    "diqqətlə": "diqqət + -lə", "həvəslə": "həvəs + -lə", "həyəcanla": "həyəcan + -la", "sevinclə": "sevinc + -lə", "həsrətlə": "həsrət + -lə",
    "səbirsizliklə": "səbir + -siz + -lik + -lə", "məhəbbətlə": "məhəbbət + -lə", "ucadan": "uca + -dan", "dostyana": "dost + -yana",
    "başdan-başa": "başdan + başa", "üzbəüz": "üz + bə + üz", "bu gün": "bu + gün", "asta-asta": "asta + asta", "tez-tez": "tez + tez",
    "gec-tez": "gec + tez", "az-maz": "az + maz", "yavaş-yavaş": "yavaş + yavaş", "taybatay": "tay + ba + tay", "üzüyuxarı": "üzü + yuxarı",
    "aybaay": "ay + ba + ay", "günbəgün": "gün + bə + gün", "addımbaaddım": "addım + ba + addım", "ilbəil": "il + bə + il",
    "hər an": "hər + an", "bir dəfə": "bir + dəfə", "bir qədər": "bir + qədər",
  };
  const quruSol = (w, q) => q === "S" ? "“" + w + "” bir kökdən ibarətdir — sadə zərf." : q === "D" ? "“" + w + "” = " + PARTS[w] + ": kök və leksik şəkilçi — düzəltmə zərf." : "“" + w + "” = " + PARTS[w] + ": iki sözün birləşməsindən yaranıb — mürəkkəb zərf.";

  // ---- tək sözlər (zərf kimi; məna növü və quruluşu birmənalı)
  const MW = {
    T: ["cəld", "ucadan", "yavaş-yavaş", "sevinclə", "diqqətlə", "dostyana", "həvəslə", "həyəcanla", "asta-asta"],
    Z: ["gec", "dünən", "sabah", "tezdən", "çoxdan", "indi", "gec-tez", "bu gün"],
    Y: ["içəri", "geri", "irəli", "yuxarı", "aşağı"],
    K: ["xeyli", "az-maz", "çox"],
  };
  const QW = {
    S: ["irəli", "aşağı", "geri", "içəri", "yuxarı", "gec", "cəld", "indi"],
    D: ["dostyana", "ucadan", "həvəslə", "həyəcanla", "həsrətlə", "sevinclə", "diqqətlə", "məhəbbətlə", "səbirsizliklə"],
    M: ["başdan-başa", "üzbəüz", "bu gün", "asta-asta", "tez-tez", "gec-tez", "az-maz", "yavaş-yavaş", "taybatay", "üzüyuxarı", "aybaay", "günbəgün", "hər an", "bir dəfə", "bir qədər", "ilbəil"],
  };
  // yazılış: [hissələr, növ, cümlələr (… — zərfin yeri), qayda]
  const R_TEK = "eyni sözün təkrarı ilə yaranan mürəkkəb zərf, adətən, defislə yazılır";
  const R_SEK = "təkrar olunan sözün tərəfləri qrammatik şəkilçi ilə işlənir — defislə yazılır";
  const R_BA = "təkrar olunan sözün arasında ba/bə bitişdiricisi var — bitişik yazılır";
  const R_DER = "dərslikdə belə yazılıb";
  const R_AYR = "ayrı yazılan mürəkkəb zərflərdəndir";
  const YAZ = [
    [["üz", "bə", "üz"], "bit", ["Onlar … oturmuşdular.", "Qonşular … yaşayırlar."], R_BA],
    [["üzü", "yuxarı"], "bit", ["Alpinistlər … dırmaşırdılar.", "Sabir baba asta-asta … qalxırdı."], R_DER],
    [["tay", "ba", "tay"], "bit", ["Qapı … açıldı."], R_BA],
    [["ay", "ba", "ay"], "bit", ["Qiymətlər … artdı."], R_BA],
    [["gün", "bə", "gün"], "bit", ["Şəhər … gözəlləşirdi."], R_BA],
    [["addım", "ba", "addım"], "bit", ["Polis casusu … izləyirdi."], R_BA],
    [["il", "bə", "il"], "bit", ["Şəhərin əhalisi … artdı."], R_BA],
    [["tez", "tez"], "def", ["Hava … dəyişirdi.", "Qonaqlarımız bizə … gəlir."], R_TEK],
    [["asta", "asta"], "def", ["Sabir baba … üzüyuxarı qalxırdı.", "Nənə … pilləkənə qalxdı."], R_TEK],
    [["yavaş", "yavaş"], "def", ["Qatar stansiyaya … yaxınlaşırdı.", "Nənəm … yeriyirdi."], R_TEK],
    [["gec", "tez"], "def", ["… bu məsələni hamı biləcək.", "… hər kəs həqiqəti biləcək."], R_DER],
    [["az", "maz"], "def", ["Şagird dərsi … anladı.", "O, ingilis dilini … bilir."], R_DER],
    [["başdan", "başa"], "def", ["Küçəyə … asfalt döşənmişdi.", "Zalın döşəməsi … xalça ilə örtülmüşdü."], R_SEK],
    [["hər", "an"], "ayr", ["… yağış başlaya bilər.", "Həkimlər … köməyə hazır idilər."], R_AYR],
    [["bir", "dəfə"], "ayr", ["Biz bu filmə … baxmışıq.", "Mən bu şəhərdə … olmuşam."], R_AYR],
    [["bir", "qədər"], "ayr", ["Qonaqlar … gözlədilər."], R_AYR],
  ].map(([p, k, ss, rule]) => ({ p, k, ss, rule, f: spell(p, k) }));
  function spell(p, k) { return k === "bit" ? p.join("") : k === "def" ? p.join("-") : p.join(" "); }
  const YAZ_OF = w => YAZ.find(x => x.f === w);

  // ---- eyni söz — fərqli nitq hissəsi (dərslik: 5-ci sinif, 2-ci hissə, s. 55)
  const OMO = [
    ["*Yaxşı* iş üz ağardar.", "S", "hansı iş? — ismə aiddir"],
    ["Lalə ingiliscə *yaxşı* danışırdı.", "Z", "necə danışırdı? — feilə aiddir"],
    ["*Yaxşı* dost çətində tanınar.", "S", "hansı dost? — ismə aiddir"],
    ["Nigar şəkil çəkməyi *yaxşı* bacarır.", "Z", "necə bacarır? — feilə aiddir"],
    ["Qarşımızda *gözəl* mənzərə açıldı.", "S", "necə mənzərə? — ismə aiddir"],
    ["Natiq fikirlərini *gözəl* ifadə edirdi.", "Z", "necə ifadə edirdi? — feilə aiddir"],
    ["*Gözəl* hava şagirdləri bağa çağırdı.", "S", "necə hava? — ismə aiddir"],
    ["Bülbül *gözəl* oxuyurdu.", "Z", "necə oxuyurdu? — feilə aiddir"],
    ["*Doğru* cavabları seçib dəftərinizə yazın.", "S", "hansı cavabları? — ismə aiddir"],
    ["Hamıdan *doğru* danışmağı xahiş edirəm.", "Z", "necə danışmağı? — hərəkətə aiddir"],
    ["Şagirdin *doğru* cavabı müəllimi sevindirdi.", "S", "hansı cavabı? — ismə aiddir"],
    ["Nigar həmişə *doğru* danışır.", "Z", "necə danışır? — feilə aiddir"],
    ["*Az* adam tapılar ki, bunu bilməsin.", "Y", "nə qədər adam? — ismə aiddir, miqdar bildirir"],
    ["Sürəyya həmişə *az* danışardı.", "Z", "nə qədər danışardı? — feilə aiddir"],
    ["Bağda *az* uşaq var idi.", "Y", "nə qədər uşaq? — ismə aiddir, miqdar bildirir"],
    ["Atam *az* yeyir.", "Z", "nə qədər yeyir? — feilə aiddir"],
    ["Teatr salonunda *xeyli* tamaşaçı var idi.", "Y", "nə qədər tamaşaçı? — ismə aiddir, miqdar bildirir"],
    ["Bu məsələni həll etmək üçün *xeyli* düşündüm.", "Z", "nə qədər düşündüm? — feilə aiddir"],
    ["Qonaqlar *xeyli* yemək hazırlamışdılar.", "Y", "nə qədər yemək? — ismə aiddir, miqdar bildirir"],
    ["Biz parkda *xeyli* gəzdik.", "Z", "nə qədər gəzdik? — feilə aiddir"],
    ["Biz həyəcanla *səhəri* gözləyirdik.", "I", "nəyi? — təsirlik halda isim"],
    ["*Səhər* hava soyuq idi.", "Z", "nə vaxt? — zaman bildirir"],
    ["*Səhər* açıldı.", "I", "nə? — əşya bildirir"],
    ["Atam *səhər* işə getdi.", "Z", "nə vaxt getdi? — feilə aiddir"],
    ["*Gecə* şəhərə çatdıq.", "Z", "nə vaxt çatdıq? — feilə aiddir"],
    ["Yayda *gecə* gündüzdən qısa olur.", "I", "nə? — əşya bildirir"],
    ["*Gecə* sakit idi.", "I", "nə? — əşya bildirir"],
    ["Biz *gecə* yola düşdük.", "Z", "nə vaxt düşdük? — feilə aiddir"],
    ["Külək *bərk* əsirdi.", "Z", "necə əsirdi? — feilə aiddir"],
    ["*Bərk* daşlar yolu bağlamışdı.", "S", "necə daşlar? — ismə aiddir"],
  ].map(([s, t, why]) => ({ s, t, why, w: s.match(/\*([^*]+)\*/)[1], plain: s.replace(/\*/g, "") }));
  const markS = s => { const p = s.split("*"); return h("span", {}, p[0], h("u", {}, h("b", {}, p[1])), p[2]); };

  // ---- yer zərfi, yoxsa isim (7-ci sinif, 2-ci hissə, s. 28)
  const YER = [
    ["Qonaqlar *içəri* keçdilər.", "Z", "haraya? — yön bildirir, hal şəkilçisi yoxdur"],
    ["Qardaşım *geri* döndü.", "Z", "haraya? — yön bildirir"],
    ["Alpinistlər *yuxarı* qalxdılar.", "Z", "haraya? — yön bildirir"],
    ["Dəstə *irəli* getdi.", "Z", "haraya? — yön bildirir"],
    ["Uşaq *aşağı* düşdü.", "Z", "haraya? — yön bildirir"],
    ["Çamadanlar *yuxarıya* qaldırıldı.", "Z", "haraya? — yön bildirir; yer zərfi yönlük hal şəkilçisi də qəbul edə bilər"],
    ["O, pəncərədən boylanıb *içəriyə* nəzər saldı.", "Z", "haraya? — yön bildirir; yer zərfi yönlük hal şəkilçisi də qəbul edə bilər"],
    ["Şagirdlər sıraya düzülüb *irəli* addımladılar.", "Z", "haraya? — yön bildirir"],
    ["Biz eyvandan *aşağı* boylandıq.", "Z", "haraya? — yön bildirir"],
    ["Yeni texnologiyalardan istifadə edə bilməsək, *irəli* gedə bilmərik.", "Z", "haraya? — yön bildirir"],
    ["Alpinistlər *yuxarı* dırmaşdılar.", "Z", "haraya? — yön bildirir"],
    ["Qonaqlar *otağa* keçdilər.", "I", "haraya? — konkret məkan adıdır, yönlük haldadır"],
    ["Qardaşım *evə* döndü.", "I", "haraya? — konkret məkan adıdır, yönlük haldadır"],
    ["Alpinistlər *zirvəyə* qalxdılar.", "I", "haraya? — konkret məkan adıdır, yönlük haldadır"],
    ["Dəstə *kəndə* getdi.", "I", "haraya? — konkret məkan adıdır, yönlük haldadır"],
    ["Uşaq *həyətə* düşdü.", "I", "haraya? — konkret məkan adıdır, yönlük haldadır"],
    ["Çamadanlar *çardağa* qaldırıldı.", "I", "haraya? — konkret məkan adıdır, yönlük haldadır"],
    ["Biz təyyarə ilə *Tbilisiyə* getdik.", "I", "haraya? — yer adıdır, yönlük haldadır"],
    ["Nümayəndə heyəti növbəti *rayona* yola düşdü.", "I", "haraya? — yer adıdır, yönlük haldadır"],
    ["Biz *Bağdadda* dayandıq.", "I", "harada? — yer adıdır, yerlik haldadır"],
    ["Uşaqlar *bağda* oynayırdılar.", "I", "harada? — konkret məkan adıdır, yerlik haldadır"],
    ["Quşlar *ağacdan* uçdu.", "I", "haradan? — konkret əşya adıdır, çıxışlıq haldadır"],
    ["Maşın *şəhərdən* çıxdı.", "I", "haradan? — yer adıdır, çıxışlıq haldadır"],
    ["Qoyunlar *yamacda* otlayırdı.", "I", "harada? — konkret məkan adıdır, yerlik haldadır"],
  ].map(([s, t, why]) => ({ s, t, why, w: s.match(/\*([^*]+)\*/)[1], plain: s.replace(/\*/g, "") }));

  // ---- "-la": bağlayıcı, qoşma, yoxsa zərf düzəldən şəkilçi (6-cı sinif, 2-ci hissə, s. 72)
  // [cümlə, növ (Z/Q/B), izah]
  const LA = [
    ["Bahar filmə *həyəcanla* baxırdı.", "Z", "həyəcan (mücərrəd isim) + -la: necə baxırdı?"],
    ["Biz *həvəslə* işlədik.", "Z", "həvəs (mücərrəd isim) + -lə: necə işlədik?"],
    ["Uşaqlar *sevinclə* qaçdılar.", "Z", "sevinc (mücərrəd isim) + -lə: necə qaçdılar?"],
    ["Ana oğlunu *məhəbbətlə* qucaqladı.", "Z", "məhəbbət (mücərrəd isim) + -lə: necə qucaqladı?"],
    ["Lalə məktubu *diqqətlə* oxudu.", "Z", "diqqət (mücərrəd isim) + -lə: necə oxudu?"],
    ["Nənəm nəvəsini *həsrətlə* gözləyirdi.", "Z", "həsrət (mücərrəd isim) + -lə: necə gözləyirdi?"],
    ["Müəllim şagirdi *səbirlə* dinlədi.", "Z", "səbir (mücərrəd isim) + -lə: necə dinlədi?"],
    ["Qonaqlar bizi *hörmətlə* qarşıladılar.", "Z", "hörmət (mücərrəd isim) + -lə: necə qarşıladılar?"],
    ["Tələbə sualı *cəsarətlə* cavablandırdı.", "Z", "cəsarət (mücərrəd isim) + -lə: necə cavablandırdı?"],
    ["Oxucular yeni əsəri *səbirsizliklə* gözləyirdilər.", "Z", "səbirsizlik (mücərrəd isim) + -lə: necə gözləyirdilər?"],
    ["Uşaq *təəccüblə* ətrafa baxdı.", "Z", "təəccüb (mücərrəd isim) + -lə: necə baxdı?"],
    ["Biz Gəncəyə *qatarla* getdik.", "Q", "ilə qoşmasının ixtisar forması: vasitə bildirir (nə ilə getdik?)"],
    ["O, *qələmlə* işarə etdi.", "Q", "ilə qoşmasının ixtisar forması: vasitə bildirir (nə ilə işarə etdi?)"],
    ["Əli çörəyi *bıçaqla* kəsdi.", "Q", "ilə qoşmasının ixtisar forması: vasitə bildirir (nə ilə kəsdi?)"],
    ["Mən dünən *Nigarla* görüşdüm.", "Q", "ilə qoşmasının ixtisar forması: birgəlik bildirir (kim ilə görüşdüm?)"],
    ["Qardaşım məktəbə *velosipedlə* gedir.", "Q", "ilə qoşmasının ixtisar forması: vasitə bildirir (nə ilə gedir?)"],
    ["Atam işə *avtobusla* gedir.", "Q", "ilə qoşmasının ixtisar forması: vasitə bildirir (nə ilə gedir?)"],
    ["*Gülayla* Sevda rəfiqədirlər.", "B", "və bağlayıcısını əvəz edir (Gülay və Sevda)"],
    ["*Atamla* anam səfərdən qayıtdılar.", "B", "və bağlayıcısını əvəz edir (atam və anam)"],
    ["*Qardaşımla* mən parka getdik.", "B", "və bağlayıcısını əvəz edir (qardaşım və mən)"],
    ["*Kitabla* dəftər çantadadır.", "B", "və bağlayıcısını əvəz edir (kitab və dəftər)"],
  ].map(([s, t, why]) => ({ s, t, why, w: s.match(/\*([^*]+)\*/)[1], plain: s.replace(/\*/g, "") }));
  const LA_CH = { B: "ilə bağlayıcısının şəkilçiləşmiş forması", Q: "ilə qoşmasının şəkilçiləşmiş forması", Z: "isimdən zərf düzəldir" };

  // ---- zərf olmayan cümlələr (heç bir sözü zərf deyil)
  const NZ = [
    "Qardaşım yeni kitab aldı.", "Anam bazardan meyvə gətirdi.", "Şagirdlər mətni oxudular.", "Müəllim şagirdlərə tapşırıq verdi.",
    "Nənəm bizə maraqlı nağıl danışdı.", "Qonşumuzun maşını yeni idi.", "Hündür ağaclar günəşi gizlədirdi.", "Atam mənə qiymətli kitab verdi.",
    "Balaca qız gül toplayırdı.", "Şagirdlər yeni mövzunu öyrəndilər.", "Anamın bişirdiyi çörək ləzzətli idi.",
  ];

  // ---- fikirlər
  const FIKIR_DUZ = [
    "Zərf cümlədə, əsasən, feilə aid olub onu müxtəlif cəhətdən izah edir.",
    "Zərfin mənaca dörd növü var: tərzi-hərəkət, zaman, yer və kəmiyyət zərfləri.",
    "Tərzi-hərəkət zərfi hərəkətin necə icra olunduğunu bildirir.",
    "Zaman zərfi hərəkətin icra olunduğu vaxtı bildirir.",
    "Yer zərfi hərəkətin icra olunduğu yeri bildirir.",
    "Kəmiyyət zərfi hərəkətin kəmiyyətini bildirir və nə qədər? sualına cavab verir.",
    "Zərf quruluşca sadə, düzəltmə və mürəkkəb olur.",
    "Sadə zərflər yalnız bir kökdən ibarət olur.",
    "Düzəltmə zərflər kökdən və leksik şəkilçidən ibarət olur.",
    "Mürəkkəb zərflər iki sözün birləşməsindən yaranır.",
    "Bəzi sözlər cümlədəki yerindən asılı olaraq həm zərf, həm də başqa nitq hissəsi kimi işlənə bilir.",
    "-la (-lə) şəkilçisi əsasən mücərrəd isimlərə qoşularaq zərf düzəldir.",
    "Eyni sözün təkrarı ilə yaranan mürəkkəb zərflər, adətən, defislə yazılır.",
    "Yer zərflərinin mənasında nisbilik var.",
    "Bəzi yer zərfləri (irəli, içəri, yuxarı) hərəkətin yönünü bildirir və adətən yönlük hal şəkilçisi olmadan işlənir.",
    "Təkrar olunan sözlər arasına ba, bə bitişdiricisi artırılmaqla yaranan mürəkkəb zərflər bitişik yazılır.",
    "Hər an, bu gün, bir dəfə, bir qədər ayrı yazılan mürəkkəb zərflərdir.",
  ];
  const FIKIR_SEHV = [
    "Zərf cümlədə, əsasən, ismə aid olub onu izah edir.",
    "Zərfin mənaca beş növü var.",
    "Zaman zərfi haraya? sualına cavab verir.",
    "Yer zərfi nə vaxt? sualına cavab verir.",
    "Kəmiyyət zərfi necə? sualına cavab verir.",
    "Tərzi-hərəkət zərfi hərəkətin kəmiyyətini bildirir.",
    "Sadə zərflər kökdən və leksik şəkilçidən ibarət olur.",
    "Düzəltmə zərflər iki sözün birləşməsindən yaranır.",
    "Mürəkkəb zərflər yalnız bir kökdən ibarət olur.",
    "Bütün mürəkkəb zərflər bitişik yazılır.",
    "Hər an və bir qədər mürəkkəb zərfləri defislə yazılır.",
    "Sözün zərf olması cümlədəki işlənməsindən asılı deyil.",
    "Zərf köməkçi nitq hissəsidir.",
    "-la (-lə) şəkilçisi həmişə zərf düzəldir.",
    "Yer zərfləri yalnız yönlük hal şəkilçisi ilə işlənir.",
    "Eyni sözün təkrarı ilə yaranan mürəkkəb zərflər ayrı yazılır.",
  ];
  // söz haqqında fikirlər: [söz, doğru, səhv]
  const PROFIL = [
    ["irəli", ["zərfdir", "yer zərfidir", "sadə zərfdir", "haraya? sualına cavab verir", "bir kökdən ibarətdir"], ["düzəltmə zərfdir", "zaman zərfidir", "mürəkkəb zərfdir", "nə vaxt? sualına cavab verir", "kəmiyyət zərfidir"]],
    ["dostyana", ["zərfdir", "düzəltmə zərfdir", "kökdən və leksik şəkilçidən ibarətdir", "tərzi-hərəkət zərfidir", "bitişik yazılır"], ["sadə zərfdir", "mürəkkəb zərfdir", "kəmiyyət zərfidir", "defislə yazılır", "iki sözün birləşməsindən yaranıb"]],
    ["başdan-başa", ["zərfdir", "mürəkkəb zərfdir", "iki sözün birləşməsindən yaranıb", "defislə yazılır", "tərzi-hərəkət zərfidir"], ["düzəltmə zərfdir", "sadə zərfdir", "bitişik yazılır", "ayrı yazılır", "zaman zərfidir"]],
    ["bu gün", ["zərfdir", "mürəkkəb zərfdir", "ayrı yazılır", "zaman zərfidir", "nə vaxt? sualına cavab verir"], ["düzəltmə zərfdir", "sadə zərfdir", "defislə yazılır", "yer zərfidir", "kəmiyyət zərfidir"]],
    ["gec-tez", ["zərfdir", "mürəkkəb zərfdir", "defislə yazılır", "zaman zərfidir", "nə vaxt? sualına cavab verir"], ["sadə zərfdir", "düzəltmə zərfdir", "bitişik yazılır", "ayrı yazılır", "yer zərfidir"]],
    ["az-maz", ["zərfdir", "mürəkkəb zərfdir", "defislə yazılır", "kəmiyyət zərfidir", "nə qədər? sualına cavab verir"], ["sadə zərfdir", "düzəltmə zərfdir", "bitişik yazılır", "ayrı yazılır", "tərzi-hərəkət zərfidir"]],
    ["həvəslə", ["zərfdir", "düzəltmə zərfdir", "həvəs sözündən -lə şəkilçisi ilə düzəlib", "tərzi-hərəkət zərfidir", "necə? sualına cavab verir"], ["sadə zərfdir", "mürəkkəb zərfdir", "yer zərfidir", "kəmiyyət zərfidir", "qoşmadır"]],
    ["üzbəüz", ["zərfdir", "mürəkkəb zərfdir", "bitişik yazılır", "iki sözün birləşməsindən yaranıb", "kökdən və leksik şəkilçidən ibarət deyil"], ["sadə zərfdir", "düzəltmə zərfdir", "defislə yazılır", "ayrı yazılır", "bir kökdən ibarətdir"]],
    ["ucadan", ["zərfdir", "düzəltmə zərfdir", "kökdən və leksik şəkilçidən ibarətdir", "bitişik yazılır", "tərzi-hərəkət zərfidir"], ["sadə zərfdir", "mürəkkəb zərfdir", "defislə yazılır", "yer zərfidir", "iki sözün birləşməsindən yaranıb"]],
    ["yavaş-yavaş", ["zərfdir", "mürəkkəb zərfdir", "eyni sözün təkrarı ilə yaranıb", "defislə yazılır", "tərzi-hərəkət zərfidir"], ["sadə zərfdir", "düzəltmə zərfdir", "bitişik yazılır", "ayrı yazılır", "zaman zərfidir"]],
  ];

  // ======== oyun səviyyələri ========
  const mnText = (e, q) => h("span", {}, q, line(mark(e)));
  const levels = [
    { id: "tap", ad: "Zərfi tap", izah: "Cümlədəki bütün zərflərə toxun. Hərəkətin necə, nə vaxt, haraya, nə qədər olduğunu bildirən sözləri axtar: zərf feilə aiddir.",
      gen() {
        const e = pick(ZB), duz = e.toks.map((x, i) => x.t ? i : -1).filter(i => i >= 0);
        const ts = e.toks.filter(x => x.t);
        return { text: "Cümlədəki bütün zərflərə toxun.", sec: { soz: e.toks.map(x => x.w), duz }, show: ts.map(x => x.w).join(", "),
          solution: "“" + e.w + "” zərfdir" + (e.sual ? " (" + e.sual + ")" : "") + ", feilə aiddir." + (e.ex.length ? " " + e.ex.join("; ") + "." : "") + " Qalan sözlər başqa nitq hissələridir." };
      } },
    { id: "mena", ad: "Məna növü", izah: "Tərzi-hərəkət: necə? nə cür? · zaman: nə vaxt? · yer: haraya? harada? haradan? · kəmiyyət: nə qədər?",
      gen() {
        const e = pick(hasM), opts = Object.values(MN);
        return { text: mnText(e, "Fərqləndirilmiş zərf hansı məna növünə aiddir?"), choices: opts, correct: opts.indexOf(MN[e.m]), show: MN[e.m],
          solution: "“" + e.w + "” — " + e.sual + " Bu, " + MN[e.m] + " (" + MSUAL[e.m] + ")." };
      } },
    { id: "bolgu", ad: "Bölgü: məna növləri", izah: "Zərfləri məna növünə görə qruplara ayır. Hər söz üçün sual ver: necə? nə vaxt? haraya? nə qədər?",
      gen() {
        const keys = Object.keys(MW), g = 2 + R(2), here = sample(keys, g), ws = [];
        here.forEach(k => { const n = Math.min(MW[k].length, 2 + R(2)); sample(MW[k], n).forEach(w => ws.push([w, k])); });
        const list = shuffle(ws), qrup = keys.map(k => MN[k]);
        return { text: "Bu zərfləri məna növünə görə qruplara ayır.", bol: { soz: list.map(x => x[0]), qrup, duz: list.map(x => keys.indexOf(x[1])) },
          show: list.map(x => x[0] + " — " + MN[x[1]]).join("; "), solution: list.map(x => x[0] + " — " + MN[x[1]] + " (" + MSUAL[x[1]] + ")").join("; ") + "." };
      } },
    { id: "yer", ad: "Yer zərfi, yoxsa isim", izah: "“Haraya? harada? haradan?” sualına cavab verən hər söz yer zərfi deyil. Yer zərfi yeri və ya yönü bildirir (içəri, geri, yuxarı yönü bildirir); məkan adı (otaq, ev, rayon) isimdir.",
      gen() {
        const o = pick(YER), opts = ["isim", "yer zərfi", "sifət"], r = o.t === "Z" ? "yer zərfi" : "isim";
        return { text: h("span", {}, "Fərqləndirilmiş söz isimdir, yoxsa yer zərfi?", line(markS(o.s))), choices: opts, correct: opts.indexOf(r), show: r,
          solution: "“" + o.w + "” — " + o.why + ". Deməli, " + r + "." };
      } },
    { id: "qurulus", ad: "Quruluşca növü", izah: "Sadə — bir kök; düzəltmə — kök və leksik şəkilçi; mürəkkəb — iki sözün birləşməsi.",
      gen() {
        const e = pick(hasQ), opts = Object.values(QN);
        return { text: h("span", {}, "Cümlədə fərqləndirilmiş zərf quruluşca hansıdır?", line(mark(e))), choices: opts, correct: opts.indexOf(QN[e.q]), show: QN[e.q], solution: quruSol(e.w, e.q) };
      } },
    { id: "la", ad: "“-la” şəkilçisi", izah: "-la (-lə) üç iş görür: bağlayıcı (və yerinə), qoşma (vasitə, birgəlik) və ya mücərrəd isimdən zərf düzəldir (necə?).",
      gen() {
        const o = pick(LA), opts = [LA_CH.B, LA_CH.Q, LA_CH.Z];
        return { text: h("span", {}, "Fərqləndirilmiş sözdəki -la (-lə) şəkilçisinin funksiyasını müəyyən et.", line(markS(o.s))), choices: opts, correct: opts.indexOf(LA_CH[o.t]), show: LA_CH[o.t],
          solution: "“" + o.w + "” — " + o.why + ". Deməli, " + LA_CH[o.t] + "." };
      } },
    { id: "yazilis", ad: "Mürəkkəb zərfin yazılışı", izah: "Təkrar — defislə (tez-tez, başdan-başa); ba/bə ilə — bitişik (aybaay, günbəgün); hər an, bir dəfə, bir qədər — ayrı.",
      gen() {
        const x = pick(YAZ), s = pick(x.ss), opts = shuffle(["bit", "def", "ayr"].map(k => spell(x.p, k)));
        return { text: h("span", {}, "Nöqtənin yerinə mürəkkəb zərfi düzgün yazılışı ilə seç:", line("«" + s + "»")), choices: opts, correct: opts.indexOf(x.f), show: x.f,
          solution: "Düzgün yazılış: " + x.f + " (" + YN[x.k] + "): " + x.rule + "." };
      } },
    { id: "omonim", ad: "Eyni söz — fərqli nitq hissəsi", izah: "Nitq hissəsini cümlədəki işlənmə müəyyən edir. Feilə aiddirsə və hərəkəti izah edirsə — zərf; ismə aiddirsə — sifət və ya say.",
      gen() {
        const o = pick(OMO), opts = ["isim", "sifət", "say", "zərf", "feil"];
        return { text: h("span", {}, "Fərqləndirilmiş söz hansı nitq hissəsidir?", line(markS(o.s))), choices: opts, correct: opts.indexOf(AD[o.t]), show: AD[o.t],
          solution: "“" + o.w + "” burada " + AD[o.t] + ": " + o.why + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird zərfin üç cəhətini yazıb: nitq hissəsini, məna növünü, quruluşunu. Biri səhvdir — hansı?",
      gen() {
        const e = pick(ZB.filter(x => x.m && x.q)), k = R(3);
        const wrongNH = pick(["feildir", "əvəzlikdir"]), wrongM = pick(Object.keys(MP).filter(x => x !== e.m)), wrongQ = pick(Object.keys(QP).filter(x => x !== e.q));
        const st = [k === 0 ? wrongNH : "zərfdir", k === 1 ? MP[wrongM] : MP[e.m], k === 2 ? QP[wrongQ] : QP[e.q]];
        const right = ["zərfdir", MP[e.m], QP[e.q]], ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "«" + e.plain + "» — şagirdin təhlili: " + st.map((x, i) => (i + 1) + ") “" + e.w + "” " + x).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "Düzü: “" + e.w + "” " + right[k] + " (" + (k === 0 ? "feilə aiddir: " + e.sual : k === 1 ? e.sual : quruSol(e.w, e.q)) + "). Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E) ========
  const NOMER = (arr) => line(...arr.map((w, i) => h("span", { style: "display:block" }, (i + 1) + ". " + w)));
  const zerfSual = { T: "necə?", Z: "nə vaxt?", Y: "haraya?", K: "nə qədər?" };
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. fərqləndirilmiş zərf hansı suala cavab verir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const e = pick(hasM.filter(x => x.m !== "K")), wrong = Object.keys(zerfSual).filter(k => k !== e.m).map(k => zerfSual[k]).concat("kim?");
      return AEq(h("span", {}, "Cümlədə fərqləndirilmiş zərf hansı suala cavab verir?", line(mark(e))), zerfSual[e.m], wrong,
        "“" + e.w + "” — " + e.sual + " Deməli, " + MN[e.m] + ": " + MSUAL[e.m] + " Başqa variantlar digər zərf növlərinin və ya isim sualıdır.");
    }) },
    // 2. cümlələrin birində zərf yoxdur
    { tip: "qapali", gen: () => Oyun.again(() => {
      const four = sample(ZB, 4), odd = pick(NZ);
      return AEq("Cümlələrin birində zərf işlənməyib:", odd, four.map(e => e.plain), "“" + odd + "” — burada zərf yoxdur (hər söz isim, sifət, feil və s.-dir). Digər cümlələrdə zərf: " + four.map(e => e.w).join(", ") + ".");
    }) },
    // 3. məna növünə görə biri fərqlidir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ks = Object.keys(MW), a = pick(["T", "Z", "Y"]), b = pick(ks.filter(k => k !== a)), four = sample(MW[a], 4), odd = pick(MW[b]);
      return AEq("Zərflərdən biri məna növünə görə fərqlidir:", odd, four, "“" + odd + "” — " + MN[b] + " (" + MSUAL[b] + "). Qalanları " + MN[a] + " növündədir (" + MSUAL[a] + ").");
    }) },
    // 4. quruluşca biri fərqlidir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ks = ["S", "D", "M"], a = pick(ks), b = pick(ks.filter(k => k !== a)), four = sample(QW[a], 4), odd = pick(QW[b]);
      const why = (w, k) => w + " — " + (k === "S" ? "bir kök" : PARTS[w]);
      return AEq("Zərflərdən biri quruluşca fərqlidir:", odd, four, "“" + odd + "” — " + QN[b] + " (" + (b === "S" ? "bir kök" : PARTS[odd]) + "). Qalanları " + QN[a] + ": " + four.map(w => why(w, a)).join("; ") + ".");
    }) },
    // 5. nömrə kombinasiyası: mürəkkəb zərflər
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["M", "D", "S"]), n = 1 + R(3), a = sample(QW[t], n), other = Object.keys(QW).filter(k => k !== t), b = [];
      while (a.length + b.length < 5) { const k = pick(other), w = pick(QW[k]); if (![...a, ...b.map(x => x[0])].includes(w)) b.push([w, k]); }
      const five = shuffle([...a.map(w => [w, t]), ...b]);
      const right = five.map((x, i) => x[1] === t ? i + 1 : 0).filter(Boolean), o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş zərflərdən hansıları " + QP[t] + "?", NOMER(five.map(x => x[0]))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x[0] + " — " + QN[x[1]]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 6. düzgün yazılmış zərf
    { tip: "qapali", gen: () => Oyun.again(() => {
      const items = sample(YAZ, 5), r = items[0], wrong = items.slice(1).map(x => spell(x.p, pick(["bit", "def", "ayr"].filter(k => k !== x.k))));
      return AEq("Düzgün yazılmış zərfi müəyyən edin:", r.f, wrong, "“" + r.f + "” düzgündür: " + r.rule + ". Səhv variantlar: " + items.slice(1).map((x, i) => wrong[i] + " (düzü: " + x.f + ")").join("; ") + ".");
    }) },
    // 7. yer zərfi, yoxsa isim
    { tip: "qapali", gen: () => Oyun.again(() => {
      const Zs = YER.filter(o => o.t === "Z"), Is = YER.filter(o => o.t === "I");
      if (Math.random() < .5) { const z = pick(Zs), four = sample(Is, 4); return AEq("Cümlələrin birində yer zərfi işlənib:", z.plain, four.map(o => o.plain), "“" + z.w + "” — yer zərfidir: " + z.why + ". Digər cümlələrdə haraya? harada? haradan? sualına cavab verən sözlər isimdir: " + four.map(o => o.w).join(", ") + "."); }
      const i = pick(Is), four = sample(Zs, 4); return AEq("Cümlələrin birində yer zərfi işlənməyib:", i.plain, four.map(o => o.plain), "“" + i.w + "” — " + i.why + ", isimdir; zərf deyil. Digər cümlələrdə yer zərfi: " + four.map(o => o.w).join(", ") + ".");
    }) },
    // 8. nömrə kombinasiyası: zərf olan cümlələr (omonimlik)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(OMO, 5);
      if (new Set(five.map(o => low(o.w))).size < 4) return null;
      const right = five.map((o, i) => o.t === "Z" ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o2 = comboChoices(right); if (!o2) return null;
      return { text: h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz zərfdir?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", markS(x.s)))), ...o2, show: o2.choices[o2.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + AD[x.t] + " (" + x.why + ")").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 9. -la
    { tip: "qapali", gen: () => Oyun.again(() => {
      const Zs = LA.filter(o => o.t === "Z"), Os = LA.filter(o => o.t !== "Z");
      if (Math.random() < .5) { const z = pick(Zs), four = sample(Os, 4); return AEq("Cümlələrin birində -la (-lə) şəkilçisi zərf düzəldir:", z.plain, four.map(o => o.plain), "“" + z.w + "” — " + z.why + " Digər cümlələrdə -la (-lə) ilə qoşmasının və ya ilə bağlayıcısının şəkilçiləşmiş formasıdır: " + four.map(o => o.w).join(", ") + "."); }
      const o = pick(Os), four = sample(Zs, 4); return AEq("Cümlələrin birində -la (-lə) şəkilçisi zərf düzəltmir:", o.plain, four.map(x => x.plain), "“" + o.w + "” — " + o.why + ". Digər cümlələrdə mücərrəd isimdən zərf düzəlib: " + four.map(x => x.w).join(", ") + ".");
    }) },
    // 10. fikirlər / söz haqqında
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) {
        if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("Zərf haqqında səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
        const ok = pick(FIKIR_DUZ); return AEq("Zərf haqqında doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
      }
      const [w, duz, sehv] = pick(PROFIL);
      if (Math.random() < .5) { const bad = pick(sehv); return AEq("“" + w + "” zərfi ilə bağlı səhv fikri müəyyən edin.", bad, sample(duz, 4), "“" + w + "”: " + duz.join(", ") + ". Səhv fikir: " + bad + "."); }
      const ok = pick(duz); return AEq("“" + w + "” zərfi ilə bağlı doğru fikri müəyyən edin.", ok, sample(sehv, 4), "“" + w + "”: " + duz.join(", ") + ". Doğru fikir: " + ok + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: bankdakı hər fakt müstəqil sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "z" + (++yn), sual, cavab });
  const NITQ = "(isim, sifət, say, əvəzlik, feil, zərf, qoşma, bağlayıcı)";
  const MV = "(tərzi-hərəkət, zaman, yer, kəmiyyət)", QV = "(sadə, düzəltmə, mürəkkəb)";
  ZB.forEach(e => {
    addY("«" + e.plain + "» cümləsində “" + e.w + "” sözü hansı nitq hissəsidir? " + NITQ, "zərf");
    if (e.m) addY("«" + e.plain + "» cümləsində “" + e.w + "” zərfi hansı məna növünə aiddir? " + MV + " — dərsliyə görə: tərzi-hərəkət — necə? nə cür?; zaman — nə vaxt? nə zaman?; yer — haraya? harada? haradan?; kəmiyyət — nə qədər?", e.m === "T" ? "tərzi-hərəkət" : e.m === "Z" ? "zaman" : e.m === "Y" ? "yer" : "kəmiyyət");
    if (e.q) addY("«" + e.plain + "» cümləsində zərf olan “" + e.w + "” sözü quruluşca hansıdır? " + QV + " — dərsliyə görə: sadə — yalnız bir kök; düzəltmə — kök və leksik şəkilçi; mürəkkəb — iki sözün birləşməsi.", e.q === "S" ? "sadə" : e.q === "D" ? "düzəltmə" : "mürəkkəb");
    e.toks.filter(x => x.t === "E").forEach(x => addY("«" + e.plain + "» cümləsində “" + x.w + "” sözü hansı nitq hissəsidir? " + NITQ, "zərf"));
  });
  OMO.forEach(o => addY("«" + o.plain + "» cümləsində “" + o.w + "” sözü hansı nitq hissəsidir? (isim, sifət, say, zərf, feil) — nitq hissəsi cümlədəki işlənməyə görə müəyyən olunur.", AD[o.t]));
  YER.forEach(o => addY("«" + o.plain + "» cümləsində “" + o.w + "” sözü isimdir, yoxsa yer zərfidir? (isim, yer zərfi) — dərsliyə görə: yer zərfi yeri və ya yönü bildirir (içəri, geri, yuxarı yönü bildirir), məkan adı isimdir.", o.t === "Z" ? "yer zərfi" : "isim"));
  LA.forEach(o => addY("«" + o.plain + "» cümləsində “" + o.w + "” sözündəki -la (-lə) şəkilçisi nə iş görür? (ilə bağlayıcısının şəkilçiləşmiş forması, ilə qoşmasının şəkilçiləşmiş forması, isimdən zərf düzəldir) — dərsliyə görə: zərf düzəltmə əsasən mücərrəd isimlərə qoşularaq olur.", LA_CH[o.t]));
  NZ.forEach(s => addY("«" + s + "» cümləsində zərf işlənibmi? (bəli, xeyr)", "xeyr"));
  Object.keys(MW).forEach(k => MW[k].forEach(w => addY("“" + w + "” zərfi (zərf kimi işləndikdə) hansı məna növünə aiddir? " + MV + " — dərsliyə görə: tərzi-hərəkət — necə? nə cür?; zaman — nə vaxt? nə zaman?; yer — haraya? harada? haradan?; kəmiyyət — nə qədər?", k === "T" ? "tərzi-hərəkət" : k === "Z" ? "zaman" : k === "Y" ? "yer" : "kəmiyyət")));
  Object.keys(QW).forEach(k => QW[k].forEach(w => addY("“" + w + "” sözü zərf kimi işləndikdə quruluşca hansıdır? " + QV + " — dərsliyə görə: sadə — yalnız bir kök; düzəltmə — kök və leksik şəkilçi; mürəkkəb — iki sözün birləşməsi.", k === "S" ? "sadə" : k === "D" ? "düzəltmə" : "mürəkkəb")));
  YAZ.forEach(x => addY("Mürəkkəb zərfin düzgün yazılışı hansıdır: 1) " + spell(x.p, "bit") + "; 2) " + spell(x.p, "def") + "; 3) " + spell(x.p, "ayr") + " (5-ci, 6-cı və 7-ci sinif dərsliklərinin qaydasına görə)", x.f));
  PROFIL.forEach(([w, duz, sehv]) => { duz.forEach(f => addY("“" + w + "” zərfi haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — zərfin quruluşca və məna növləri, yazılışı üzrə dərslik qaydasına görə.", "doğru")); sehv.forEach(f => addY("“" + w + "” zərfi haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — zərfin quruluşca və məna növləri, yazılışı üzrə dərslik qaydasına görə.", "səhv")); });
  FIKIR_DUZ.forEach(f => addY("Zərf haqqında (dərsliklərə görə) deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => addY("Zərf haqqında (dərsliklərə görə) deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "səhv"));
  window.__yoxla = YOX;

  window.__levels = levels;
  window.__bank = { ZB, MW, QW, YAZ, OMO, YER, LA, NZ, FIKIR_DUZ, FIKIR_SEHV, PROFIL, AD };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-zerf", title: "Zərf", fenn: "azdili", link: "dersler/az-zerf.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Zərf feilə aiddir: necə? nə vaxt? haraya? nə qədər? Sözün nitq hissəsini cümlədəki işlənməsi müəyyən edir.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tap", "mena", "bolgu", "yer", "qurulus", "la", "yazilis", "omonim", "omonim", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-zerf.html")) b.push("dersler/az-zerf.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
