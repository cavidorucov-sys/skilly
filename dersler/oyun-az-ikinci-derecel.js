// Azərbaycan dili · İkinci dərəcəli üzvlər (tamamlıq, təyin, zərflik) — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 8-ci sinif (2023), s. 77 (tamamlıq), s. 80 (təyin), s. 90–91 (zərflik, tərzi-hərəkət), s. 95 (zaman),
// s. 96 (yer), s. 101 (miqdar/kəmiyyət), s. 104 (səbəb, məqsəd); 6-cı sinif, 2-ci hissə (2025), s. 23 (tamamlıq), s. 40 (təyin),
// s. 45 (zərflik), s. 48 (söz birləşmələri cümlə üzvü kimi); 5-ci sinif, 2-ci hissə (2024), s. 100–101 (cümlə üzvləri).
// Cümlə bankındakı hər sözün cümlə üzvü etiketlənib və müstəqil yoxlanıb. Bankda qəsdən olmayanlar: -la/-lə şəkilçili
// (tamamlıq/zərflik qarışığı) cümlələr, "isim + üçün", yer və tamamlıq arasında qalan sözlər, mürəkkəb feillər (xidmət etmək...),
// homogen üzvlər, ara sözlər. Baş üzvlər (mübtəda, xəbər) 17-ci mövzudadır — burada yalnız etiket kimi göstərilir.
(function () {
  const h = Oyun.h;
  // etiketlər: M mübtəda, X xəbər, T tamamlıq, Y təyin; zərflik növləri: A tərzi-hərəkət, B zaman, C yer, D kəmiyyət, E səbəb, F məqsəd
  const UZ = { M: "mübtəda", X: "xəbər", T: "tamamlıq", Y: "təyin", A: "tərzi-hərəkət zərfliyi", B: "zaman zərfliyi", C: "yer zərfliyi", D: "kəmiyyət zərfliyi", E: "səbəb zərfliyi", F: "məqsəd zərfliyi" };
  const isZ = k => "ABCDEF".includes(k);
  const CO = k => isZ(k) ? "Z" : k;                     // iri qrup: M X T Y Z
  const CN = { M: "mübtəda", X: "xəbər", T: "tamamlıq", Y: "təyin", Z: "zərflik" };
  const CORDER = ["M", "X", "T", "Y", "Z"];
  const CDAT = { T: "tamamlıqlara", Y: "təyinlərə", Z: "zərfliklərə" };
  // hər üzvün mənası və sualı (8-ci sinif s. 77, 80, 90–104; 6-cı sinif s. 23, 40, 45)
  const WHY = {
    M: "haqqında danışılan şəxsi, varlığı bildirir (kim? nə?); baş üzvdür",
    X: "mübtədaya aid hərəkət və ya hökmü bildirir; baş üzvdür",
    T: "ismin yönlük, təsirlik, yerlik və ya çıxışlıq halında olub əşya və obyekt bildirir (kimə? nəyi? nəyə? kimdən? nədən?; şəkilçisiz — nə?)",
    Y: "isimlə ifadə olunan üzvü izah edir və necə? hansı? neçə? nə qədər? neçənci? suallarından birinə cavab verir",
    A: "hərəkətin tərzini bildirir (necə? nə cür?) və feili xəbərə aiddir",
    B: "hərəkətin zamanını bildirir (nə zaman? nə vaxt? haçan?) və feili xəbərə aiddir",
    C: "hərəkətin yerini bildirir (haraya? harada? haradan?) və feili xəbərə aiddir",
    D: "hərəkətin miqdarını (dərəcəsini) bildirir (nə qədər?) və feili xəbərə aiddir",
    E: "hərəkətin səbəbini bildirir (niyə? nə səbəbə? nə üçün?); xəbərdəki hərəkət onun nəticəsidir",
    F: "hərəkətin məqsədini bildirir (niyə? nə məqsədlə?); məsdər + üçün ilə ifadə olunur",
  };
  const NOV = ["A", "B", "C", "D", "E", "F"];

  // ---- cümlə bankı: "söz:ETİKET"; "_" bir üzv olan söz birləşməsidir; etiketsiz işarə — durğu işarəsi.
  const BANK = [
    "Gülər:M qələmi:T dostuna:T uzatdı:X .",
    "O:M sakitcə:A işığı:T yandırdı:X .",
    "Qardaşım:M qapını:T örtdü:X .",
    "Müəllim:M şagirdlərə:T yeni:Y mövzunu:T anlatdı:X .",
    "Atam:M mənə:T maraqlı:Y kitab:T gətirdi:X .",
    "Nənəm:M bağda:C qırmızı:Y güllər:T əkdi:X .",
    "Biz:M dünən:B üç:Y yeni:Y kitab:T aldıq:X .",
    "Sən:M yaxşını:T pisdən:T ayır:X .",
    "Səlim:M oxumağı:T uşaqlıqda:B öyrənmişdi:X .",
    "Sevinc:M ulduzların_sayrışmasını:T izləyirdi:X .",
    "Hamı:M divardan_asılmış:Y xəritəyə:T baxırdı:X .",
    "Bağban:M ağacların_gövdəsini:T ağardırdı:X .",
    "Müəllim:M şagirdlərin_cavabını:T dinlədi:X .",
    "Anam:M mətbəxdə:C şorba:T bişirir:X .",
    "Aygün:M məktubu:T dostuna:T göndərdi:X .",
    "Çoban:M qoyunları:T dağda:C otardı:X .",
    "Şagirdlər:M müəllimi:T həyətdə:C gözləyirdilər:X .",
    "Usta:M divarı:T yavaş-yavaş:A hördü:X .",
    "Müəllim:M bizi:T çağırdı:X .",
    "Bağban:M ağacları:T səhər:B suladı:X .",
    "Ovçu:M tüfəngi:T meşədə:C gizlətdi:X .",
    "Bütün:Y şagirdlər:M imtahana:T hazırlaşırlar:X .",
    "Mən:M səni:T çoxdan:B gözləyirəm:X .",
    "Anam:M şirin:Y alma:T yudu:X .",
    "Uşaqlar:M iki:Y hündür:Y ağac:T gördülər:X .",
    "Qonşumuz:M beş:Y alma:T gətirdi:X .",
    "Yağışlı:Y hava:M əkinçiləri:T sevindirdi:X .",
    "Axşamkı:Y konsert:M maraqlı_idi:X .",
    "Oxuduğum:Y kitab:M maraqlı_idi:X .",
    "Üç:Y idmançı:M qızıl:Y medal:T qazandı:X .",
    "Çayda:C kiçik:Y qayıqlar:M üzürdü:X .",
    "Sahildə:C sərin:Y külək:M əsirdi:X .",
    "Yaşıl:Y yarpaqlar:M bağda:C tökülürdü:X .",
    "Biz:M gözəl:Y parkda:C gəzdik:X .",
    "Mən:M bu:Y kitabı:T oxudum:X .",
    "Hər:Y şagird:M öz:Y dəftərini:T götürdü:X .",
    "Xalam:M yeni:Y mənzilə:C köçdü:X .",
    "Salona:C xeyli:Y tamaşaçı:M gəldi:X .",
    "Şagirdlər:M imtahanlara:T ciddi:A hazırlaşırlar:X .",
    "Ceyran:M cəld:A qaçırdı:X .",
    "Qatar:M yavaş-yavaş:A getdi:X .",
    "O:M düşünmədən:A qaçdı:X .",
    "Lalə:M yaxşı:A oxuyur:X .",
    "Külək:M bərk:A əsirdi:X .",
    "Uşaqlar:M gülə-gülə:A oynayırdılar:X .",
    "Sabah:B hava:M isti_olacaq:X .",
    "Dünən:B biz:M kitabxanaya:C getdik:X .",
    "Qonaqlar:M səhər:B gəldilər:X .",
    "Atam:M tezdən:B durdu:X .",
    "Yayda:B uşaqlar:M dənizə:C getdilər:X .",
    "Biz:M bu_gün:B xeyli:D işlədik:X .",
    "Gecə:B biz:M şəhərə:C çatdıq:X .",
    "Dərsdən_sonra:B şagirdlər:M həyətdə:C oynadılar:X .",
    "Dostlar:M irəli:C getdilər:X .",
    "Qardaşım:M geri:C döndü:X .",
    "Biz:M parkda:C gəzdik:X .",
    "Quşlar:M cənuba:C uçdular:X .",
    "Uşaqlar:M yuxarı:C qalxdılar:X .",
    "Müəllim:M içəri:C keçdi:X .",
    "Şagirdlər:M məktəbdən:C qayıtdılar:X .",
    "Nənəm:M Gəncə_şəhərində:C yaşayır:X .",
    "Uşaq:M xeyli:D böyüdü:X .",
    "Sürəyya:M həmişə:B az:D danışardı:X .",
    "Hava:M bir_qədər:D soyudu:X .",
    "Mən:M xeyli:D düşündüm:X .",
    "Uşaq:M qorxduğu_üçün:E ağladı:X .",
    "Nərmin:M yorulduğu_üçün:E yatdı:X .",
    "Şagird:M sevindiyi_üçün:E gülümsədi:X .",
    "Qonşu:M xəstələndiyi_üçün:E evdə:C qaldı:X .",
    "Uşaqlar:M çimmək_üçün:F çaya:C getdilər:X .",
    "Atam:M kitab_almaq_üçün:F mağazaya:C getdi:X .",
    "Şagirdlər:M öyrənmək_üçün:F oxuyurlar:X .",
    "Qonşu:M dincəlmək_üçün:F kəndə:C getdi:X .",
    "Anam:M səhər:B bazara:C getdi:X .",
    "Mən:M sabah:B Bakıya:C gedəcəyəm:X .",
  ].map(s => s.split(" ").map(t => { const m = t.match(/^(.+):([MXTYABCDEF])$/); return m ? { w: m[1].replace(/_/g, " "), t: m[2] } : { w: t, t: null }; }));
  const words = s => s.filter(x => x.t);
  const plain = s => s.map((x, i) => (i && x.t ? " " : "") + x.w).join("");
  const sameK = (x, k) => x.t && (k === "Z" ? isZ(x.t) : x.t === k);
  const has = (s, k) => s.some(x => sameK(x, k));

  // ---- eyni söz, fərqli nitq hissəsi və cümlə üzvü: [cümlə (*söz*), nitq hissəsi, üzv, 3 səhv "nitq hissəsi — üzv" variantı]
  const NZ = [
    ["Dostlar *irəli* getdilər.", "zərf", "C", ["sifət — təyin", "zərf — tamamlıq", "feil — xəbər"]],
    ["Biz *dünən* kitabxanaya getdik.", "zərf", "B", ["isim — tamamlıq", "zərf — mübtəda", "sifət — təyin"]],
    ["Şagirdlər imtahanlara *ciddi* hazırlaşırlar.", "zərf", "A", ["sifət — təyin", "isim — tamamlıq", "zərf — yer zərfliyi"]],
    ["Mən *xeyli* düşündüm.", "zərf", "D", ["say — təyin", "isim — tamamlıq", "zərf — yer zərfliyi"]],
    ["Salona *xeyli* tamaşaçı gəldi.", "say", "Y", ["zərf — kəmiyyət zərfliyi", "isim — tamamlıq", "sifət — təyin"]],
    ["*Yaxşı* şagird dərsi öyrənir.", "sifət", "Y", ["zərf — tərzi-hərəkət zərfliyi", "isim — tamamlıq", "sifət — tamamlıq"]],
    ["Şagird dərsi *yaxşı* öyrənir.", "zərf", "A", ["sifət — təyin", "zərf — təyin", "isim — mübtəda"]],
    ["*Bütün* şagirdlər imtahana hazırlaşırlar.", "əvəzlik", "Y", ["sifət — təyin", "say — təyin", "əvəzlik — mübtəda"]],
    ["Qardaşım *qapını* örtdü.", "isim", "T", ["isim — təyin", "sifət — tamamlıq", "isim — yer zərfliyi"]],
    ["Müəllim *bizi* çağırdı.", "əvəzlik", "T", ["isim — tamamlıq", "əvəzlik — təyin", "əvəzlik — mübtəda"]],
    ["Biz *parkda* gəzdik.", "isim", "C", ["zərf — yer zərfliyi", "isim — tamamlıq", "isim — təyin"]],
    ["*Səhər* hava soyuq idi.", "zərf", "B", ["isim — tamamlıq", "isim — mübtəda", "zərf — yer zərfliyi"]],
    ["Biz *səhəri* gözləyirdik.", "isim", "T", ["zərf — zaman zərfliyi", "isim — təyin", "sifət — tamamlıq"]],
    ["O *düşünmədən* qaçdı.", "feili bağlama", "A", ["zərf — tərzi-hərəkət zərfliyi", "sifət — təyin", "isim — tamamlıq"]],
    ["Uşaqlar *yuxarı* qalxdılar.", "zərf", "C", ["sifət — təyin", "zərf — tamamlıq", "feil — xəbər"]],
    ["Qardaşım *geri* döndü.", "zərf", "C", ["sifət — təyin", "isim — tamamlıq", "zərf — zaman zərfliyi"]],
    ["Atam *tezdən* durdu.", "zərf", "B", ["isim — tamamlıq", "sifət — təyin", "zərf — yer zərfliyi"]],
    ["Mən səni *çoxdan* gözləyirəm.", "zərf", "B", ["isim — tamamlıq", "zərf — yer zərfliyi", "sifət — təyin"]],
    ["Sürəyya həmişə *az* danışardı.", "zərf", "D", ["say — təyin", "isim — tamamlıq", "zərf — zaman zərfliyi"]],
    ["Külək *bərk* əsirdi.", "zərf", "A", ["sifət — təyin", "isim — tamamlıq", "zərf — təyin"]],
    ["*Bərk* daşlar yolu bağlamışdı.", "sifət", "Y", ["zərf — tərzi-hərəkət zərfliyi", "isim — mübtəda", "sifət — tamamlıq"]],
    ["Mən *bu* kitabı oxudum.", "əvəzlik", "Y", ["sifət — təyin", "isim — mübtəda", "əvəzlik — tamamlıq"]],
    ["Anam *şorba* bişirir.", "isim", "T", ["isim — təyin", "sifət — tamamlıq", "isim — zaman zərfliyi"]],
  ].map(([s, pos, k, wr]) => ({ s, pos, k, wr, w: s.match(/\*([^*]+)\*/)[1] }));
  const POSNOTE = {
    "zərf": "zərf nitq hissəsidir; cümlədə hərəkəti izah edən üzv olur",
    "sifət": "sifət nitq hissəsidir",
    "say": "say nitq hissəsidir",
    "isim": "isim nitq hissəsidir",
    "əvəzlik": "əvəzlik nitq hissəsidir",
    "feili bağlama": "feili bağlamadır (zərf deyil); cümlədə zərflik olur",
  };
  const nzWhy = o => "“" + o.w + "” — " + o.pos + " (nitq hissəsi), " + UZ[o.k] + " (cümlə üzvü): " + WHY[o.k] + ".";
  // fərqləndirilmiş söz qalın və altdan xətli
  const mark = s => { const p = s.split("*"); return h("span", {}, p[0], h("u", {}, h("b", {}, p[1])), p[2]); };
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const hl = (s, i) => s.map((x, j) => [j && x.t ? " " : "", j === i ? h("u", {}, h("b", {}, x.w)) : x.w]);

  // ---- ifadə vasitələri: [cümlə (*üzv*), üzv, vasitə]; hər cümlədə həmin üzvdən yalnız biri var
  const EX_T = [
    ["Qardaşım *qapını* örtdü.", "isim"], ["Müəllim *bizi* çağırdı.", "əvəzlik"], ["Sən *yaxşını* seç.", "isimləşmiş sifət"],
    ["Səlim *oxumağı* uşaqlıqda öyrənmişdi.", "məsdər"], ["Sevinc *ulduzların sayrışmasını* izləyirdi.", "ismi birləşmə"],
    ["Qardaşım *çantanı* götürdü.", "isim"], ["Atam *bizi* gözləyirdi.", "əvəzlik"], ["Ali *oxumağı* sevir.", "məsdər"], ["Bağban *ağacların gövdəsini* ağardırdı.", "ismi birləşmə"], ["Anam *mənə* baxdı.", "əvəzlik"],
  ];
  const EX_Y = [
    ["*Axşamkı* konsert maraqlı idi.", "sifət"], ["Qonşumuz *beş* alma gətirdi.", "say"], ["*Oxuduğum* kitab maraqlı idi.", "feili sifət"],
    ["*Bütün* şagirdlər imtahana hazırlaşırlar.", "əvəzlik"], ["Hamı *divardan asılmış* xəritəyə baxırdı.", "feili sifət tərkibi"],
    ["Çayda *kiçik* qayıqlar üzürdü.", "sifət"], ["*Aldığım* kitab maraqlı idi.", "feili sifət"], ["Biz *göyə uçan* quşlara baxdıq.", "feili sifət tərkibi"], ["Uşaqlar *iki* ağac əkdilər.", "say"], ["*Hər* şagird dəftərini götürdü.", "əvəzlik"],
  ];
  const EX_Z = [
    ["Şagirdlər imtahanlara *ciddi* hazırlaşırlar.", "zərf", "A"], ["O *düşünmədən* qaçdı.", "feili bağlama", "A"], ["Biz *parkda* gəzdik.", "məkan bildirən isim", "C"],
    ["Nənəm *Gəncə şəhərində* yaşayır.", "ismi birləşmə", "C"], ["Uşaq *qorxduğu üçün* ağladı.", "feili sifət + üçün", "E"], ["Şagirdlər *öyrənmək üçün* oxuyurlar.", "məsdər + üçün", "F"],
    ["Ceyran *cəld* qaçırdı.", "zərf", "A"], ["Qonaqlar *səhər* gəldilər.", "zərf", "B"], ["Uşaqlar *gülə-gülə* oynayırdılar.", "feili bağlama", "A"], ["Şagirdlər *məktəbdən* qayıtdılar.", "məkan bildirən isim", "C"],
    ["Nərmin *yorulduğu üçün* yatdı.", "feili sifət + üçün", "E"], ["Qardaşım *dincəlmək üçün* oturdu.", "məsdər + üçün", "F"], ["Biz *Bakı şəhərində* yaşayırıq.", "ismi birləşmə", "C"],
  ];
  const EXOPT = { T: ["isim", "əvəzlik", "isimləşmiş sifət", "məsdər", "ismi birləşmə"], Y: ["sifət", "say", "feili sifət", "əvəzlik", "feili sifət tərkibi", "isim"],
    Z: ["zərf", "feili bağlama", "məkan bildirən isim", "ismi birləşmə", "feili sifət + üçün", "məsdər + üçün"] };
  const EXALL = [...EX_T.map(([s, v]) => ({ s, v, k: "T" })), ...EX_Y.map(([s, v]) => ({ s, v, k: "Y" })), ...EX_Z.map(([s, v, z]) => ({ s, v, k: "Z", z }))]
    .map(o => ({ ...o, w: o.s.match(/\*([^*]+)\*/)[1], plain: o.s.replace(/\*/g, "") }));
  const EXNAME = { T: "tamamlıq", Y: "təyin", Z: "zərflik" };

  // ---- söz birləşməsi cümlə üzvü kimi (6-cı sinif, 2-ci hissə, s. 48; 5-ci sinif, 2-ci hissə, s. 101)
  const PH = [
    ["Hamı *divardan asılmış* xəritəyə baxırdı.", "Y", "feili birləşmə"],
    ["Sevinc *ulduzların sayrışmasını* izləyirdi.", "T", "ismi birləşmə"],
    ["*Maşının sürəti* azalırdı.", "M", "ismi birləşmə"],
    ["Uşaqlar nağıla *qulaq asırdılar*.", "X", "frazeoloji birləşmə"],
    ["*Arifin bacısı* kitabxanaya getdi.", "M", "ismi birləşmə"],
    ["Müəllim *şagirdlərin cavabını* dinlədi.", "T", "ismi birləşmə"],
    ["*Vətəni qorumaq* borcumuzdur.", "M", "məsdər tərkibi"],
    ["Atam *kitab almaq üçün* mağazaya getdi.", "F", "məsdər tərkibi + üçün"],
    ["*Qonaqları qarşılamaq* mənə tapşırılmışdı.", "M", "məsdər tərkibi"],
    ["Uşaq *qorxduğu üçün* ağladı.", "E", "feili sifət + üçün"],
    ["Nənəm *Gəncə şəhərində* yaşayır.", "C", "ismi birləşmə"],
    ["Bağban *ağacların gövdəsini* ağardırdı.", "T", "ismi birləşmə"],
    ["Anam *mətbəx pəncərəsini* açdı.", "T", "ismi birləşmə"],
    ["*Dərsin mövzusu* maraqlı idi.", "M", "ismi birləşmə"],
    ["*Çayın suyu* soyuq idi.", "M", "ismi birləşmə"],
    ["Şagirdlər *şəhər parkında* gəzdilər.", "C", "ismi birləşmə"],
    ["Qardaşım *su içmək üçün* mətbəxə getdi.", "F", "məsdər tərkibi + üçün"],
    ["Nərmin *yorulduğu üçün* yatdı.", "E", "feili sifət + üçün"],
    ["*Kitab oxumaq* faydalıdır.", "M", "məsdər tərkibi"],
    ["Şagirdlər müəllimin sözünə *qulaq asdılar*.", "X", "frazeoloji birləşmə"],
    ["Biz *dərsin mövzusunu* yazdıq.", "T", "ismi birləşmə"],
    ["Qardaşım *dəniz sahilində* gəzirdi.", "C", "ismi birləşmə"],
    ["*Dəniz sahili* gözəl idi.", "M", "ismi birləşmə"],
  ].map(([s, k, v]) => ({ s, k, v, w: s.match(/\*([^*]+)\*/)[1], plain: s.replace(/\*/g, "") }));

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
  const tagged = s => s.map((x, i) => x.t ? i : -1).filter(i => i >= 0);
  const kinds = s => new Set(words(s).map(x => CO(x.t)));
  const second = s => words(s).filter(x => "TYABCDEF".includes(x.t));
  const analysis = s => words(s).map(x => x.w + " — " + UZ[x.t]).join("; ");

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "tap", ad: "Üzvü tap", izah: "Cümlədə göstərilən ikinci dərəcəli üzvə aid bütün sözlərə toxun. Sual ver: söz kimə? nəyi? hansı? necə? nə zaman? sualına cavab verirmi, nəyə aiddir?",
      gen() {
        const k = pick(["T", "Y", "Z"]), s = pick(BANK.filter(x => has(x, k)));
        const duz = tagged(s).filter(i => sameK(s[i], k));
        return { text: "Cümlədəki bütün " + CDAT[k] + " toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
          solution: CN[k][0].toUpperCase() + CN[k].slice(1) + ": " + duz.map(i => s[i].w + " (" + UZ[s[i].t] + ")").join(", ") + ". Cümlənin təhlili: " + analysis(s) + "." };
      } },
    { id: "uzv", ad: "Cümlə üzvü", izah: "Fərqləndirilmiş sözün sualına və aid olduğu sözə bax: kimə? nəyi? — tamamlıq; hansı? neçə? — təyin (isimlə ifadə olunan üzvə aiddir); necə? nə zaman? haraya? nə qədər? niyə? — zərflik (əsasən feili xəbərə, bəzən ismi xəbərə aiddir).",
      gen() {
        const s = pick(BANK), i = pick(tagged(s)), k = s[i].t, c = CO(k);
        const opts = CORDER.map(x => CN[x]);
        return { text: h("span", {}, "Fərqləndirilmiş söz (və ya söz birləşməsi) cümlənin hansı üzvüdür?", line(...hl(s, i))), choices: opts, correct: CORDER.indexOf(c), show: CN[c],
          solution: "“" + s[i].w + "” — " + UZ[k] + ": " + WHY[k] + ". Cümlənin təhlili: " + analysis(s) + "." };
      } },
    { id: "bolgu", ad: "Bölgü: cümlə üzvləri", izah: "Cümlənin hər sözünü (və ya söz birləşməsini) üzvünə görə qrupa ayır.",
      gen() {
        const s = pick(BANK.filter(x => kinds(x).size >= 3)), ws = words(s), qrup = CORDER.map(x => CN[x]);
        return { text: "«" + plain(s) + "» — sözləri cümlə üzvlərinə ayır.", bol: { soz: ws.map(w => w.w), qrup, duz: ws.map(w => CORDER.indexOf(CO(w.t))) },
          show: ws.map(w => w.w + " — " + CN[CO(w.t)]).join("; "), solution: analysis(s) + "." };
      } },
    { id: "nov", ad: "Zərfliyin mənaca növü", izah: "Tərzi-hərəkət — necə? nə cür?; zaman — nə zaman? nə vaxt?; yer — haraya? harada? haradan?; kəmiyyət — nə qədər?; səbəb — niyə? nə üçün? (zərflikdəki iş səbəbdir, xəbər nəticədir); məqsəd — nə məqsədlə? (məsdər + üçün).",
      gen() {
        const s = pick(BANK.filter(x => second(x).some(w => isZ(w.t)))), zs = tagged(s).filter(i => isZ(s[i].t)), i = pick(zs), k = s[i].t;
        const opts = NOV.map(x => UZ[x].replace(" zərfliyi", ""));
        return { text: h("span", {}, "Fərqləndirilmiş zərfliyin mənaca növü hansıdır?", line(...hl(s, i))), choices: opts, correct: NOV.indexOf(k), show: opts[NOV.indexOf(k)],
          solution: "“" + s[i].w + "” — " + UZ[k] + ": " + WHY[k] + "." };
      } },
    { id: "zerf", ad: "Zərf, yoxsa zərflik?", izah: "Zərf — nitq hissəsidir, zərflik — cümlə üzvüdür. Eyni söz hər ikisi ola bilər, amma zərflik zərfdən başqa sözlərlə də ifadə olunur. Nitq hissəsi cümlədəki işlənməyə görə müəyyən edilir.",
      gen() {
        const o = pick(NZ), right = o.pos + " — " + UZ[o.k], ch = shuffle([right, ...o.wr]);
        return { text: h("span", {}, "Fərqləndirilmiş söz nitq hissəsi və cümlə üzvü kimi nədir?", line(mark(o.s))), choices: ch, correct: ch.indexOf(right), show: right,
          solution: nzWhy(o) };
      } },
    { id: "ifade", ad: "İfadə vasitəsi", izah: "Tamamlıq — isim və ya isimləşmiş sözlər, əvəzlik, söz birləşməsi; təyin — sifət, say, feili sifət, əvəzlik, isim, söz birləşməsi; zərflik — zərf, feili bağlama, məkan bildirən isim, söz birləşməsi, qoşmalı feili sifət və məsdər.",
      gen() {
        const o = pick(EXALL), opts = shuffle([o.v, ...sample(EXOPT[o.k].filter(x => x !== o.v), 3)]);
        return { text: h("span", {}, "Fərqləndirilmiş " + EXNAME[o.k] + " nə ilə ifadə olunub?", line(mark(o.s))), choices: opts, correct: opts.indexOf(o.v), show: o.v,
          solution: "“" + o.w + "” — " + EXNAME[o.k] + ", ifadə vasitəsi: " + o.v + "." };
      } },
    { id: "birlesme", ad: "Söz birləşməsi — üzv", izah: "Söz birləşməsi (o cümlədən frazeoloji birləşmə) bütövlükdə cümlənin bir üzvü ola bilər. Bütün birləşməyə bir sual ver.",
      gen() {
        const o = pick(PH), c = CO(o.k), opts = CORDER.map(x => CN[x]);
        return { text: h("span", {}, "Fərqləndirilmiş söz birləşməsi cümlənin hansı üzvüdür?", line(mark(o.s))), choices: opts, correct: CORDER.indexOf(c), show: CN[c],
          solution: "“" + o.w + "” — " + o.v + ", bütövlükdə cümlənin bir üzvüdür: " + UZ[o.k] + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümlədə üç üzvü təhlil edib. Biri səhvdir — hansı?",
      gen() {
        const WRONG = { M: "tamamlıq", X: "zərflik", T: "təyin", Y: "zərflik", A: "zaman zərfliyi", B: "tərzi-hərəkət zərfliyi", C: "zaman zərfliyi", D: "yer zərfliyi", E: "məqsəd zərfliyi", F: "səbəb zərfliyi" };
        const s = pick(BANK.filter(x => words(x).length >= 4)), ws = sample(words(s), 3).sort((a, b) => s.indexOf(a) - s.indexOf(b)), k = R(3);
        const lab = ws.map((w, j) => j === k ? WRONG[w.t] : UZ[w.t]), ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "«" + plain(s) + "» — şagirdin təhlili: " + ws.map((w, j) => (j + 1) + ") " + w.w + " — " + lab[j]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "“" + ws[k].w + "” " + lab[k] + " deyil, " + UZ[ws[k].t] + ": " + WHY[ws[k].t] + ". Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const FIKIR_DUZ = [
    "Tamamlıq cümlənin ikinci dərəcəli üzvüdür.",
    "Tamamlıq ismin yönlük, təsirlik, yerlik və çıxışlıq hallarında olub əşya və obyekt anlayışı bildirir.",
    "Tamamlıq kimə? nəyi? nəyə? kimdən? nədən? suallarından birinə cavab verir.",
    "Tamamlıq isimlə və ya isimləşmiş başqa nitq hissələri ilə ifadə olunur.",
    "Söz birləşməsi bütövlükdə cümlənin bir üzvü ola bilər.",
    "Təyin necə? hansı? neçə? nə qədər? neçənci? suallarından birinə cavab verir.",
    "Təyin cümlədə isim və isimləşmiş sözlərlə ifadə olunan üzvləri izah edir.",
    "Feili sifət cümlədə təyin ola bilər.",
    "Təyin bütün cümlə üzvlərinə aid ola bilər.",
    "Zərflik, əsasən, feili xəbərə aid olur və onu müxtəlif cəhətdən izah edir.",
    "Zərflik bəzən ismi xəbərə də aid ola bilər.",
    "Zərflik hərəkətin tərzini, zamanını, yerini, miqdarını, səbəbini və məqsədini bildirir.",
    "Zərfliyin mənaca altı növü var: tərzi-hərəkət, zaman, yer, kəmiyyət, səbəb və məqsəd zərfliyi.",
    "Tərzi-hərəkət zərfliyi necə? nə cür? suallarından birinə cavab verir.",
    "Zaman zərfliyi nə zaman? nə vaxt? haçan? suallarından birinə cavab verir.",
    "Yer zərfliyi haraya? harada? haradan? suallarından birinə cavab verir.",
    "Kəmiyyət zərfliyi işin, hərəkətin nə qədər icra olunduğunu bildirir.",
    "Səbəb zərfliyindəki iş və hərəkət səbəbi, xəbərdəki iş və hərəkət onun nəticəsini bildirir.",
    "Məqsəd zərfliyi üçün, ötrü qoşmalı məsdər və məsdər tərkibləri ilə ifadə oluna bilər.",
    "Zərf nitq hissəsidir, zərflik isə cümlə üzvüdür.",
    "Feili bağlama cümlədə tərzi-hərəkət zərfliyi ola bilər.",
  ];
  const FIKIR_SEHV = [
    "Tamamlıq cümlənin baş üzvüdür.",
    "Təyin yalnız feilə aid olur.",
    "Zərflik yalnız ismə aid olur.",
    "Yer zərfliyi nə zaman? sualına cavab verir.",
    "Zaman zərfliyi haraya? sualına cavab verir.",
    "Səbəb zərfliyi nə məqsədlə? sualına cavab verir.",
    "Tərzi-hərəkət zərfliyi hansı? sualına cavab verir.",
    "Təyin cümlədə hərəkətin tərzini bildirir.",
    "Zərflik nitq hissəsidir, zərf isə cümlə üzvüdür.",
    "Yalnız zərflə ifadə olunan söz zərflik ola bilər.",
    "Yalnız isim tamamlıq ola bilər, başqa nitq hissəsi tamamlıq olmur.",
    "Səbəb zərfliyindəki iş və hərəkət nəticəni, xəbərdəki iş və hərəkət səbəbi bildirir.",
    "Kəmiyyət zərfliyi haraya? sualına cavab verir.",
    "Məqsəd zərfliyi yalnız -dığı⁴ şəkilçili feili sifətlə ifadə olunur.",
    "Söz birləşməsi cümlə üzvü ola bilməz, yalnız tək söz cümlə üzvü olur.",
  ];

  const noKind = (c, nm) => () => Oyun.again(() => {
    const four = sample(BANK.filter(x => has(x, c)), 4), odd = pick(BANK.filter(x => !has(x, c)));
    return AEq("Cümlələrin birində " + nm + " yoxdur:", plain(odd), four.map(plain),
      "“" + plain(odd) + "” — burada " + nm + " yoxdur (" + analysis(odd) + "). Digər cümlələrdə " + nm + ": " + four.map(s => words(s).filter(w => sameK(w, c)).map(w => w.w).join(", ")).join("; ") + ".");
  });

  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    { tip: "qapali", gen: noKind("T", "tamamlıq") },
    { tip: "qapali", gen: noKind("Y", "təyin") },
    { tip: "qapali", gen: noKind("Z", "zərflik") },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(BANK), i = pick(tagged(s)), c = CO(s[i].t);
      const txt = h("span", {}, "Fərqləndirilmiş söz (və ya söz birləşməsi) cümlənin hansı üzvüdür?", line(...hl(s, i)));
      return AEq(txt, CN[c], CORDER.filter(x => x !== c).map(x => CN[x]), "“" + s[i].w + "” — " + UZ[s[i].t] + ": " + WHY[s[i].t] + ". Təhlil: " + analysis(s) + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const c = pick(["Z", "Y", "T"]), five = sample(NZ, 5);
      if (new Set(five.map(o => o.w.toLocaleLowerCase("az"))).size < 4) return null;
      const right = five.map((o, i) => CO(o.k) === c ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz " + ({ T: "tamamlıqdır", Y: "təyindir", Z: "zərflikdir" })[c] + "?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", mark(x.s))));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + x.pos + ", " + UZ[x.k]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(BANK.filter(x => second(x).some(w => isZ(w.t)))), i = pick(tagged(s).filter(j => isZ(s[j].t))), k = s[i].t;
      const nm = x => UZ[x].replace(" zərfliyi", "");
      const txt = h("span", {}, "Fərqləndirilmiş zərfliyin mənaca növü hansıdır?", line(...hl(s, i)));
      return AEq(txt, nm(k), sample(NOV.filter(x => x !== k), 4).map(nm), "“" + s[i].w + "” — " + UZ[k] + ": " + WHY[k] + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const k = pick(NOV), name = UZ[k], one = pick(BANK.filter(x => x.some(w => w.t === k))), four = sample(BANK.filter(x => !x.some(w => w.t === k)), 4);
      return AEq("Cümlələrin hansında " + name + " var?", plain(one), four.map(plain), "“" + plain(one) + "” — " + words(one).filter(w => w.t === k).map(w => w.w).join(", ") + " " + name + "dir. Digər cümlələrdə " + name + " yoxdur: " + four.map(s => analysis(s)).join(" | ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const c = pick(["T", "Y", "Z"]), pool = EXALL.filter(x => x.k === c), one = pick(pool), four = sample(pool.filter(x => x.v !== one.v), 4);
      if (four.length < 4) return null;
      return AEq("Hansı cümlədə " + EXNAME[c] + " " + ({ "isim": "isimlə", "əvəzlik": "əvəzliklə", "isimləşmiş sifət": "isimləşmiş sifətlə", "məsdər": "məsdərlə", "ismi birləşmə": "ismi birləşmə ilə", "sifət": "sifətlə", "say": "sayla", "feili sifət": "feili sifətlə", "feili sifət tərkibi": "feili sifət tərkibi ilə", "zərf": "zərflə", "feili bağlama": "feili bağlama ilə", "məkan bildirən isim": "məkan bildirən isimlə", "feili sifət + üçün": "üçün qoşmalı feili sifətlə", "məsdər + üçün": "üçün qoşmalı məsdərlə" })[one.v] + " ifadə olunub?",
        one.plain, four.map(x => x.plain), "“" + one.w + "” — " + EXNAME[c] + ", ifadə vasitəsi: " + one.v + ". Digərləri: " + four.map(x => x.w + " — " + x.v).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(BANK.filter(x => words(x).length >= 5)), ws = words(s), five = sample(ws, 5).sort((a, b) => s.indexOf(a) - s.indexOf(b));
      const c = pick([...new Set(five.map(w => CO(w.t)))].filter(x => "TYZ".includes(x)));
      if (!c) return null;
      const right = five.map((w, i) => CO(w.t) === c ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      const num = s.map(x => { const j = five.indexOf(x); return (s.indexOf(x) && x.t ? " " : "") + x.w + (j >= 0 ? SUP[j] : ""); }).join("");
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansılar " + ({ T: "tamamlıqdır", Y: "təyindir", Z: "zərflikdir" })[c] + "?", line(num)), ...o, show: o.choices[o.correct],
        solution: five.map((w, i) => (i + 1) + ") " + w.w + " — " + UZ[w.t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("İkinci dərəcəli üzvlərlə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("İkinci dərəcəli üzvlərlə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: bankdakı hər fakt müstəqil sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "i" + (++yn), sual, cavab });
  const ALL = "(mübtəda, xəbər, tamamlıq, təyin, tərzi-hərəkət zərfliyi, zaman zərfliyi, yer zərfliyi, kəmiyyət zərfliyi, səbəb zərfliyi, məqsəd zərfliyi)";
  const RULE = " — dərsliyə görə: tamamlıq — kimə? nəyi? (obyekt); təyin — necə? hansı? neçə? (isimlə ifadə olunan üzvə aiddir); zərflik əsasən feili xəbərə (bəzən ismi xəbərə) aiddir: tərzi-hərəkət — necə?, zaman — nə zaman?, yer — haraya? harada? haradan?, kəmiyyət — nə qədər?, səbəb — niyə? (xəbər nəticədir), məqsəd — nə məqsədlə?";
  BANK.forEach(s => {
    const m = words(s).filter(x => x.t === "M"), x = words(s).filter(y => y.t === "X");
    addY("«" + plain(s) + "» cümləsinin baş üzvləri (mübtəda və xəbər) hansılardır? Cavabı «mübtəda; xəbər» kimi yaz.", m.map(a => a.w).join(" ") + "; " + x.map(a => a.w).join(" "));
    second(s).forEach(w => addY("«" + plain(s) + "» cümləsində “" + w.w + "” sözü (söz birləşməsi) cümlənin hansı üzvüdür? " + ALL + RULE, UZ[w.t]));
  });
  NZ.forEach(o => {
    addY("«" + o.s.replace(/\*/g, "") + "» cümləsində “" + o.w + "” sözü hansı nitq hissəsidir? (isim, sifət, say, əvəzlik, feil, zərf, feili bağlama; isimləşmiş söz öz əsas nitq hissəsi ilə adlanır)", o.pos);
    addY("«" + o.s.replace(/\*/g, "") + "» cümləsində “" + o.w + "” sözü cümlənin hansı üzvüdür? " + ALL + RULE, UZ[o.k]);
    o.wr.forEach(v => addY("«" + o.s.replace(/\*/g, "") + "» cümləsində “" + o.w + "” sözü haqqında deyilir: «" + v + "» (nitq hissəsi — cümlə üzvü). Bu təhlil doğrudurmu? (doğru, səhv)", "səhv"));
  });
  EXALL.forEach(o => addY("«" + o.plain + "» cümləsində " + EXNAME[o.k] + " olan “" + o.w + "” nə ilə ifadə olunub? (" + EXOPT[o.k].join(", ") + ") — dərsliyə görə: tamamlıq — isim və isimləşmiş sözlər, əvəzlik, söz birləşməsi; təyin — sifət, say, feili sifət (tərkibi), əvəzlik; zərflik — zərf, feili bağlama, məkan bildirən isim, ismi birləşmə, qoşmalı feili sifət və məsdər.", o.v));
  PH.forEach(o => {
    addY("«" + o.plain + "» cümləsində “" + o.w + "” söz birləşməsi bütövlükdə cümlənin hansı üzvüdür? " + ALL, UZ[o.k]);
  });
  FIKIR_DUZ.forEach(f => addY("Cümlənin ikinci dərəcəli üzvləri haqqında deyilir: «" + f + "». Bu fikir dərslik qaydasına görə doğrudurmu? (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => addY("Cümlənin ikinci dərəcəli üzvləri haqqında deyilir: «" + f + "». Bu fikir dərslik qaydasına görə doğrudurmu? (doğru, səhv)", "səhv"));
  window.__yoxla = YOX;

  window.__levels = levels;
  window.__bank = { BANK, NZ, EXALL, PH, FIKIR_DUZ, FIKIR_SEHV, UZ };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-ikinci-derecel", title: "İkinci dərəcəli üzvlər", fenn: "azdili", link: "dersler/az-ikinci-derecel.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər üzvün sualına və aid olduğu sözə bax.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tap", "tap", "uzv", "uzv", "bolgu", "nov", "zerf", "ifade", "birlesme", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-ikinci-derecel.html")) b.push("dersler/az-ikinci-derecel.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
