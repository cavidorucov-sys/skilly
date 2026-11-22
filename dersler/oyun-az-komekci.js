// Azərbaycan dili · Köməkçi nitq hissələri; sözün morfoloji təhlili — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024), s. 10–11 (əsas və köməkçi nitq hissələri); 6-cı sinif, 1-ci hissə (2025),
// s. 81 (qoşma və onun yazılışı), s. 87 (qoşmanın qrammatik sinonimliyi və omonimliyi), s. 92–93 (bağlayıcı); 6-cı sinif, 2-ci hissə,
// s. 72 (-la şəkilçisinin funksiyaları); 7-ci sinif (köməkçi mənbə), 1-ci hissə, s. 11 (ədat), s. 14–15 (ədat və bağlayıcıların omonimliyi),
// s. 18 (modal sözlər), s. 26 (ara sözlər — yalnız modal sözlə əlaqəsi), s. 27 (təkrar), s. 68 (ayrı yazılan mürəkkəb sözlər), s. 76–77 (nida);
// 7-ci sinif, 2-ci hissə, s. 12 (morfem, morfologiya), s. 21, 78, 85 (köməkçi nitq hissələri, morfoloji tərkib). Suallar bankdan qurulur:
// bankdakı hər cümlə, söz və qayda yoxlanıb (window.__yoxla). Bankda qəsdən olmayanlar: ara sözlərin ətraflı qaydası (19-cu mövzu), mürəkkəb cümlədə
// bağlayıcıdan əvvəl vergül (21-ci mövzu), "idi/imiş/isə", "çox", "bir" və mübahisəli sözlər.
(function () {
  const h = Oyun.h;
  const AD = { I: "isim", S: "sifət", Y: "say", E: "əvəzlik", F: "feil", Z: "zərf", Q: "qoşma", B: "bağlayıcı", D: "ədat", M: "modal söz", N: "nida" };
  const PRED = { I: "isimdir", S: "sifətdir", Y: "saydır", E: "əvəzlikdir", F: "feildir", Z: "zərfdir", Q: "qoşmadır", B: "bağlayıcıdır", D: "ədatdır", M: "modal sözdür", N: "nidadır" };
  const KOM = "QBDMN";
  const isKom = t => KOM.includes(t);
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const plainS = s => s.replace(/\*/g, "");
  // *…* ilə işarələnmiş hissələr qalın və altdan xətli göstərilir
  const mark = s => h("span", {}, ...s.split("*").map((p, i) => i % 2 ? h("u", {}, h("b", {}, p)) : p));
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const SUP = "¹²³⁴⁵⁶⁷";
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }
  // doğru etiketə yaxın (səhv sayıla bilməyən) etiketləri çıxarıb 4 səhv variant seç
  const wrongs = (right, pool, groups, n = 4) => sample(pool.filter(x => x !== right && !(groups || []).some(g => g.includes(right) && g.includes(x))), n);
  const mc = (right, pool, groups, n = 4) => { const w = wrongs(right, pool, groups, n - 1), o = shuffle([right, ...w]); return { choices: o, correct: o.indexOf(right) }; };
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };

  // ---- cümlə bankı: "söz:ETİKET"; "_" iki sözdən ibarət bir vahiddir; etiketsiz işarə — durğu işarəsi.
  // I isim, S sifət, Y say, E əvəzlik, F feil, Z zərf, Q qoşma, B bağlayıcı, D ədat, M modal söz, N nida.
  const BANK = [
    "Su:I buz:I kimi:Q soyuqdur:S .",
    "Uşaqlar:I quş:I kimi:Q sevinirdilər:F .",
    "Atam:I məni:E dayanacağa:I qədər:Q ötürdü:F .",
    "Bu:E hədiyyəni:I sənin:E üçün:Q aldım:F .",
    "Avtobus:I şəhərə:I tərəf:Q döndü:F .",
    "Tamaşadan:I əvvəl:Q hər_kəs:E öz:E yerini:I tutdu:F .",
    "Xoş:S söhbətdən:I sonra:Q əhvalımız:I yaxşılaşdı:F .",
    "Sizdən:E başqa:Q hamı:E gəlmişdi:F .",
    "Müəllim:I yeni:S dərslik:I barədə:Q danışdı:F .",
    "Mən:E qardaşım:I ilə:Q gələcəyəm:F .",
    "Rəfiqəmdən:I ötrü:Q narahatam:S .",
    "Uşaq:I səkiyə:I doğru:Q qaçdı:F .",
    "Hava:I soyuqdur:S , amma:B biz:E üşümürük:F .",
    "Boğazım:I göynəyirdi:F , ona_görə_də:B dərman:I içdim:F .",
    "Biz:E yorulduq:F , lakin:B dincəlmədik:F .",
    "Qardaşım:I və:B mən:E sinifdə:I oxuyuruq:F .",
    "Əgər:B sən:E gəlsən:F , biz:E sevinərik:F .",
    "Biz:E tələsdik:F , çünki:B dərs:I başlayırdı:F .",
    "Həm:B müəllimlər:I , həm_də:B şagirdlər:I tədbiri:I izləyirdilər:F .",
    "Mən:E bilirəm:F ki:B , sən:E haqlısan:S .",
    "Madam_ki:B hamı:E razıdır:S , iclasa:I başlayaq:F .",
    "İndi_ki:B hava:I yaxşıdır:S , gəzintiyə:I çıxaq:F .",
    "Ya:B sən:E get:F , ya_da:B mən:E gedim:F .",
    "Nə:B uşaqlar:I , nə_də:B qızlar:I zaldan:I çıxdılar:F .",
    "Əli:I və:B Sənan:I dostdurlar:I .",
    "Məhz:D sən:E bu:E sualın:I cavabını:I bilirsən:F .",
    "Axı:D mən:E səni:E çoxdan:Z gözləyirəm:F .",
    "Təkcə:D sənə:E güvənirəm:F .",
    "Biz:E yalnız:D sənə:E güvənirik:F .",
    "Bu:E kitab:I daha:D maraqlıdır:S .",
    "Qoy:D uşaqlar:I oynasınlar:F !",
    "Əlbəttə:M , sən:E bu:E işi:I bacararsan:F .",
    "Bəlkə:M , qonaqlar:I sabah:Z gələcəklər:F .",
    "Deyəsən:M , o:E bizi:E tanımadı:F .",
    "Nəhayət:M , qonaqlar:I gəldilər:F .",
    "Beləliklə:M , yarış:I bitdi:F .",
    "Məncə:M , bu:E məsələ:I çətindir:S .",
    "Heyif_ki:M , qonaqlar:I tezdən:Z getdilər:F .",
    "Sanki:M sən:E məni:E tanımırsan:F .",
    "Fikrimcə:M , bu:E sual:I çətindir:S .",
    "Təbii_ki:M , biz:E gələcəyik:F .",
    "Ay:N uşaqlar:I , içəri:Z keçin:F !",
    "Bəh-bəh:N , bu:E alma:I şirindir:S !",
    "Of:N , bu:E çanta:I ağırdır:S !",
    "Ura:N , biz:E qazandıq:F !",
    "Vay:N , stəkan:I sındı:F !",
    "Əhsən:N , sən:E yaxşı:Z oxudun:F !",
    "Əlbəttə:M , mən:E sənin:E üçün:Q sevindim:F .",
    "Ura:N , Səbinə:I və:B Lalə:I məktəbə:I getdilər:F !",
    "Axı:D mən:E sənin:E üçün:Q darıxıram:F .",
    "Nəhayət:M , qonaqlar:I gəldilər:F , amma:B yağış:I başladı:F .",
    "Əlbəttə:M , Əli:I və:B Vüqar:I sənin:E üçün:Q gələcəklər:F .",
    "Məhz:D sənin:E üçün:Q Əli:I və:B Lalə:I gəldilər:F .",
    "Of:N , axı:D mən:E sənə:E demişdim:F !",
    "Əlbəttə:M , biz:E yalnız:D sənin:E üçün:Q gəlirik:F .",
  ].map(s => s.split(" ").map(t => { const m = t.match(/^(.+):([A-Z])$/); return m ? { w: m[1].replace(/_/g, " "), t: m[2] } : { w: t, t: null }; }));
  const words = s => s.filter(x => x.t);
  const plain = s => s.map((x, i) => (i && x.t ? " " : "") + x.w).join("");
  const has = (s, t) => s.some(x => x.t === t);
  const kinds = s => [...new Set(words(s).filter(x => isKom(x.t)).map(x => x.t))];
  const FUNK = { Q: "sözlərə qoşularaq məna çaları yaradır", B: "sözlər, cümlə üzvləri və cümlələr arasında əlaqə yaradır", D: "sözün və ya cümlənin təsir gücünü artırır",
    M: "danışanın fikrə münasibətini bildirir", N: "hiss-həyəcan ifadə edir" };
  const lexSol = s => words(s).filter(x => isKom(x.t)).map(x => x.w + " — " + AD[x.t]).join("; ");

  // ---- qoşma: məna çaları (6-cı sinif, 1-ci hissə, s. 81, 87)
  const QM = ["bənzətmə", "istiqamət", "zaman", "məsafə", "səbəb-məqsəd", "birgəlik", "fərqləndirmə", "aidlik"];
  const QMG = [["istiqamət", "məsafə", "zaman"], ["səbəb-məqsəd", "aidlik"]];
  const QOS = [
    ["Su buz *kimi* soyuqdur.", "bənzətmə"], ["Uşaqlar quş *kimi* sevinirdilər.", "bənzətmə"],
    ["Səhərə *qədər* külək ara vermədi.", "zaman"], ["Axşama *qədər* işimizi bitirərik.", "zaman"],
    ["Biz evə *kimi* piyada getdik.", "məsafə"], ["Atam məni dayanacağa *qədər* ötürdü.", "məsafə"],
    ["Babamdan *ötrü* çox darıxıram.", "səbəb-məqsəd"], ["Bu hədiyyəni sənin *üçün* aldım.", "səbəb-məqsəd"],
    ["Avtobus şəhərə *tərəf* döndü.", "istiqamət"], ["Meşəyə *doğru* uzanan cığır kolların arasından keçirdi.", "istiqamət"],
    ["Tamaşadan *əvvəl* hər kəs öz yerini tutdu.", "zaman"], ["Xoş söhbətdən *sonra* əhvalımız xeyli yaxşılaşdı.", "zaman"],
    ["Müəllim yeni dərslik *barədə* məlumat verdi.", "aidlik"], ["O, 44 günlük müharibə *haqqında* danışdı.", "aidlik"],
    ["Sizdən *başqa* hamı gəlmişdi.", "fərqləndirmə"], ["Dostumdan *başqa* heç kimə güvənmirəm.", "fərqləndirmə"],
    ["Biz müəllim *ilə* gəzintiyə çıxdıq.", "birgəlik"], ["Mən qardaşım *ilə* gələcəyəm.", "birgəlik"],
  ].map(([s, m]) => ({ s, m, w: s.match(/\*([^*]+)\*/)[1] }));
  // qoşmanın yazılışı: ok — düzgün, bad — səhv (ikihecalı qoşmanı bitişik, birhecalı qoşmanı ayrı yazmaq)
  const ORFQ = [
    { ok: "Bu hədiyyəni sənin üçün aldım.", bad: "Bu hədiyyəni səninüçün aldım.", k: "ayrı" },
    { ok: "Rəfiqəmdən ötrü narahatam.", bad: "Rəfiqəmdənötrü narahatam.", k: "ayrı" },
    { ok: "Tamaşadan əvvəl hər kəs öz yerini tutdu.", bad: "Tamaşadanəvvəl hər kəs öz yerini tutdu.", k: "ayrı" },
    { ok: "Uşaqlar quş kimi sevinirdilər.", bad: "Uşaqlar quşkimi sevinirdilər.", k: "ayrı" },
    { ok: "Sizdən başqa hamı gəlmişdi.", bad: "Sizdənbaşqa hamı gəlmişdi.", k: "ayrı" },
    { ok: "Atam məni dayanacağa qədər ötürdü.", bad: "Atam məni dayanacağaqədər ötürdü.", k: "ayrı" },
    { ok: "Axşamadək işimizi bitirərik.", bad: "Axşama dək işimizi bitirərik.", k: "bitişik" },
    { ok: "Səhərəcən yağış yağdı.", bad: "Səhərə cən yağış yağdı.", k: "bitişik" },
    { ok: "Bu günəcən heç kim etiraz etmədi.", bad: "Bu günə cən heç kim etiraz etmədi.", k: "bitişik" },
    { ok: "Sənintək bacısı olan çox xoşbəxtdir.", bad: null, k: "bitişik" },
    { ok: "Mən qardaşım ilə gələcəyəm.", bad: null, k: "ilə" },
    { ok: "Mən qardaşımla gələcəyəm.", bad: null, k: "ilə" },
  ];
  // qoşmanın qrammatik sinonimliyi (6-cı sinif, 1-ci hissə, s. 87)
  const QSIN = [["evədək", "evə qədər"], ["uşaq kimi", "uşaqtək"], ["səndən ötrü", "sənin üçün"], ["dərslik barədə", "dərslik haqqında"],
    ["sizdən başqa", "sizdən savayı"], ["tamaşadan əvvəl", "tamaşadan qabaq"], ["axşamacan", "axşama qədər"]];

  // ---- bağlayıcı (6-cı sinif, 1-ci hissə, s. 92; 7-ci sinif, 1-ci hissə, s. 68)
  const BM = ["birləşdirmə", "qarşılaşdırma", "səbəb", "şərt", "bölüşdürmə", "aydınlaşdırma", "iştirak", "inkarlıq", "güzəşt"];
  const BMG = [["birləşdirmə", "iştirak"], ["qarşılaşdırma", "güzəşt"], ["şərt", "səbəb"]];
  const BAG = [
    ["Hava soyuq idi, *amma* biz üşümürdük.", "qarşılaşdırma"], ["Axşam vaxtı şəhərdə sıxlıq olur, *ona görə də* evə tez getdik.", "səbəb"],
    ["Gözlənilən qonaqlar gəldilər *və* tədbir açıq elan olundu.", "birləşdirmə"], ["Murad *və* Vüqar altıncı sinifdə oxuyurlar.", "birləşdirmə"],
    ["Boğazım göynəyirdi, *ona görə də* dərman içdim.", "səbəb"], ["*Əgər* istəsən, görüşə birlikdə gedərik.", "şərt"],
    ["Uşaq *gah* bizə baxıb gülür, *gah da* ağlayırdı.", "bölüşdürmə"], ["Yorulmuşduq, *lakin* heç kim evə getmək istəmirdi.", "qarşılaşdırma"],
    ["*Hərçənd* qohum idik, gec-gec görüşürdük.", "güzəşt"], ["Sinfimiz, *yəni* VI c sinfi hamının rəğbətini qazandı.", "aydınlaşdırma"],
    ["*Həm* müəllimlər, *həm də* şagirdlər tədbiri maraqla izləyirdilər.", "iştirak"], ["*Ya* hamı bu işdən imtina etsin, *ya da* əl-ələ verib tez bitirməyə çalışaq.", "bölüşdürmə"],
    ["O başa düşdü *ki*, müəlliminin etimadını doğrultmalıdır.", "aydınlaşdırma"], ["*İndi ki* bizimlə getmək istəyirsən, onda tezdən hazır ol!", "şərt"],
    ["*Nə* uşaqlar, *nə də* böyüklər zalı tərk etmək istəyirdilər.", "inkarlıq"], ["Heç kim dillənmirdi, *çünki* onun söhbəti çox maraqlı idi.", "səbəb"],
  ].map(([s, m]) => ({ s, m }));
  // mürəkkəb bağlayıcılar ayrı yazılır
  const MB = [
    { ok: "Hava pozuldu, ona görə də biz evdə qaldıq.", bad: "Hava pozuldu, ona görədə biz evdə qaldıq." },
    { ok: "Madam ki hamı razıdır, iclasa başlayaq.", bad: "Madamki hamı razıdır, iclasa başlayaq." },
    { ok: "İndi ki hava yaxşıdır, gəzintiyə çıxaq.", bad: null },
    { ok: "Bu kitab maraqlıdır, həm də faydalıdır.", bad: "Bu kitab maraqlıdır, həmdə faydalıdır." },
    { ok: "Sinfimiz, yəni VI c sinfi hamının rəğbətini qazandı.", bad: "Sinfimiz, yəniki VI c sinfi hamının rəğbətini qazandı." },
  ];

  // ---- ədat (7-ci sinif, 1-ci hissə, s. 11; 5-ci sinif, 2-ci hissə, s. 11)
  const EM = ["qüvvətləndirmə", "sual", "əmr", "məhdudlaşdırma", "dəqiqləşdirmə", "arzu"];
  const EMG = [["qüvvətləndirmə", "dəqiqləşdirmə", "məhdudlaşdırma"], ["əmr", "arzu"], ["sual", "qüvvətləndirmə"]];
  const ED = [
    ["Bu kitab *daha* maraqlıdır.", "qüvvətləndirmə"], ["*Bəs* niyə danışmırsan?", "sual"], ["*Qoy* hamının üzü gülsün!", "əmr"],
    ["Biz *yalnız* sənə güvənirik.", "məhdudlaşdırma"], ["*Təkcə* sənə güvənirəm.", "məhdudlaşdırma"], ["Biz *məhz* belə layihələrə üstünlük veririk.", "dəqiqləşdirmə"],
    ["*Barı* uğurlarımız bol olsun.", "arzu"], ["Unutma *ha*, sübhdən yola çıxırıq.", "əmr"],
  ].map(([s, m]) => ({ s, m, w: s.match(/\*([^*]+)\*/)[1] }));
  const ORFE = [
    { ok: "Məsələni yerindəcə həll etdik.", bad: "Məsələni yerində cə həll etdik." },
    { ok: "Bilirsinizmi, biz Qori seminariyasında təzə şöbə açmışıq.", bad: "Bilirsiniz mi, biz Qori seminariyasında təzə şöbə açmışıq." },
    { ok: "Gözünü açıb bir ətrafına baxsana.", bad: "Gözünü açıb bir ətrafına bax sana." },
    { ok: "Şuşaya da mı avtobusla gedirsiniz?", bad: "Şuşaya damı avtobusla gedirsiniz?" },
    { ok: "Hələ də mi ona inanırsınız?", bad: "Hələ dəmi ona inanırsınız?" },
  ];

  // ---- modal söz (7-ci sinif, 1-ci hissə, s. 18, 26)
  const MM = ["əminlik", "güman, şübhə", "bənzətmə, müqayisə", "təəssüf", "nəticə, ümumiləşdirmə", "fikrin mənbəyi", "sıra, ardıcıllıq", "əvvəlki fikirlə əlaqə"];
  const MMG = [["nəticə, ümumiləşdirmə", "sıra, ardıcıllıq", "əvvəlki fikirlə əlaqə"], ["güman, şübhə", "bənzətmə, müqayisə"], ["fikrin mənbəyi", "güman, şübhə"]];
  const MOD = [
    ["*Əlbəttə*, mənə verdiyin kitab çox maraqlıdır.", "əminlik"], ["Artıq gecdir, *bəlkə*, oyunu saxlayaq?", "güman, şübhə"],
    ["*Sanki* bütün bu deyilənlərdən xəbərsizsən.", "bənzətmə, müqayisə"], ["*Əfsus ki*, bu qaydalara əməl olunmur.", "təəssüf"],
    ["*Beləliklə*, Vaqif Mustafazadə muğamı cazla sintez elədi.", "nəticə, ümumiləşdirmə"], ["*Fikrimcə*, igid gərək ehtiyatı əldən verməsin.", "fikrin mənbəyi"],
    ["*Deyəsən*, bütün uşaqlar gəzintiyə çıxacaqlar.", "güman, şübhə"], ["*Şübhəsiz*, elmli olan güclü olar.", "əminlik"],
    ["İnsanlar, *heyif ki*, şəhərin təmizliyinə riayət etmirlər.", "təəssüf"], ["*Təbii ki*, onun bu davranışı hamının təəccübünə səbəb oldu.", "əminlik"],
    ["*Xülasə*, bu təklifi hamı yekdilliklə bəyəndi.", "nəticə, ümumiləşdirmə"], ["*Məncə*, belə həssas məsələyə səbirlə yanaşmaq lazımdır.", "fikrin mənbəyi"],
    ["Bu sözdən sonra *elə bil* qurbağa gölünə daş atdılar.", "bənzətmə, müqayisə"], ["*Üstəlik*, o dövrdə ordumuz da olduqca zəif idi.", "əvvəlki fikirlə əlaqə"],
    ["*Əvvəla*, adam hər şeydən inciməz, *ikincisi*, onun fikrində həqiqət var.", "sıra, ardıcıllıq"],
  ].map(([s, m]) => ({ s, m }));

  // ---- nida (7-ci sinif, 1-ci hissə, s. 76–77)
  const NM = ["sevinc", "qorxu, narahatlıq", "istehza, kinayə", "təəssüf, peşmanlıq", "heyranlıq", "qəm, kədər, nisgil"];
  const NMG = [["təəssüf, peşmanlıq", "qəm, kədər, nisgil"], ["sevinc", "heyranlıq"]];
  const NID = [
    ["*Vay*! Bu uşaq hara yoxa çıxdı!", "qorxu, narahatlıq"], ["*Ay-hay*, buna çətin iş deyirsiniz?!", "istehza, kinayə"], ["*Ay can, ay can*, axşam gəzməyə gedirik!", "sevinc"],
    ["*Ah*, o xoşbəxt günlər indi mənə yuxu kimi gəlir!", "qəm, kədər, nisgil"], ["*Ah*, bilsəydim, heç gəlməzdim!", "təəssüf, peşmanlıq"],
    ["*Ah*, bu yerlərin necə də gözəl havası var!", "heyranlıq"],
  ].map(([s, m]) => ({ s, m }));

  // ---- durğu işarələri: ok — düzgün, bad — səhv (təsdiq-inkar ədatı, modal söz, ki, nida)
  const VER = [
    { ok: "Bəli, çox çalışmısınız.", bad: "Bəli çox çalışmısınız." }, { ok: "Xeyr, mən gəlmirəm.", bad: "Xeyr mən gəlmirəm." },
    { ok: "Hə, razıyam.", bad: "Hə razıyam." }, { ok: "Yox, bu otağa girmək olmaz.", bad: "Yox bu otağa girmək olmaz." },
    { ok: "Əlbəttə, mənə verdiyin kitab çox maraqlıdır.", bad: "Əlbəttə mənə verdiyin kitab çox maraqlıdır." },
    { ok: "Beləliklə, konfrans uğurla başa çatdı.", bad: "Beləliklə konfrans uğurla başa çatdı." },
    { ok: "Deyəsən, bütün uşaqlar gəzintiyə çıxacaqlar.", bad: "Deyəsən bütün uşaqlar gəzintiyə çıxacaqlar." },
    { ok: "Əfsus ki, bu qaydalara əməl olunmur.", bad: "Əfsus ki bu qaydalara əməl olunmur." },
    { ok: "O başa düşürdü ki, müəlliminin etimadını doğrultmalıdır.", bad: "O başa düşürdü ki müəlliminin etimadını doğrultmalıdır." },
    { ok: "Yağış yenicə kəsmişdi ki, külək başladı.", bad: "Yağış yenicə kəsmişdi ki külək başladı." },
    { ok: "Sən ki həmişə onu tərifləyirdin.", bad: "Sən ki, həmişə onu tərifləyirdin." },
    { ok: "Sinoptiklərin proqnozunu dinləməmişdin ki?", bad: "Sinoptiklərin proqnozunu dinləməmişdin, ki?" },
    { ok: "Vay, stəkan sındı!", bad: "Vay stəkan sındı!" }, { ok: "Bəh-bəh, bu alma şirindir!", bad: "Bəh-bəh bu alma şirindir!" },
    { ok: "Bəli, mən razıyam.", bad: "Bəli mən razıyam." }, { ok: "Xeyr, o gəlmədi.", bad: "Xeyr o gəlmədi." }, { ok: "Hə, mən oxudum.", bad: "Hə mən oxudum." },
    { ok: "Nəhayət, qonaqlar gəldilər.", bad: "Nəhayət qonaqlar gəldilər." }, { ok: "Bəlkə, qonaqlar sabah gələcəklər.", bad: "Bəlkə qonaqlar sabah gələcəklər." },
    { ok: "Şübhəsiz, elmli olan güclü olar.", bad: "Şübhəsiz elmli olan güclü olar." }, { ok: "Heyif ki, qonaqlar tezdən getdilər.", bad: "Heyif ki qonaqlar tezdən getdilər." },
    { ok: "Mən bilirəm ki, sən haqlısan.", bad: "Mən bilirəm ki sən haqlısan." }, { ok: "Mən ki sənə güvənirəm.", bad: "Mən ki, sənə güvənirəm." },
    { ok: "Ura, biz qazandıq!", bad: "Ura biz qazandıq!" }, { ok: "Of, bu çanta ağırdır!", bad: "Of bu çanta ağırdır!" },
  ];

  // ---- omonimlik: əsas ↔ köməkçi nitq hissələri və köməkçilərin bir-biri ilə (6-cı sinif, 1-ci hissə, s. 87; 7-ci sinif, 1-ci hissə, s. 15, 77; 2-ci hissə, s. 78)
  const OMO = [
    ["*Doğru* sözə zaval yoxdur.", "S", "necə söz? — ismə aiddir, əlamət bildirir"],
    ["O, topun dalınca səkiyə *doğru* qaçdı.", "Q", "“səkiyə” sözünə qoşulub istiqamət çaları yaradır; ayrılıqda suala cavab vermir"],
    ["Sizdən *başqa* hamı gəlmişdi.", "Q", "“sizdən” sözünə qoşulub fərqləndirmə çaları yaradır; ayrılıqda suala cavab vermir"],
    ["Bu *başqa* məsələdir.", "S", "necə məsələ? — ismə aiddir, əlamət bildirir"],
    ["Tamaşadan *əvvəl* hər kəs öz yerini tutdu.", "Q", "“tamaşadan” sözünə qoşulub zaman çaları yaradır"],
    ["*Əvvəl* nahar et, sonra həyətə düşərsən.", "Z", "nə vaxt? — feilə aiddir"],
    ["Xoş söhbətdən *sonra* əhvalımız xeyli yaxşılaşdı.", "Q", "“söhbətdən” sözünə qoşulub zaman çaları yaradır"],
    ["Əvvəl nahar et, *sonra* həyətə düşərsən.", "Z", "nə vaxt? — feilə aiddir"],
    ["Biz təmiz havada evə *sarı* piyada gedirdik.", "Q", "“evə” sözünə qoşulub istiqamət çaları yaradır"],
    ["Yaşıl *sarı* yarpaqlar bir-birinə qarışmışdı.", "S", "necə yarpaqlar? — ismə aiddir, əlamət bildirir"],
    ["Sən danışdıqca mən *də* yavaş-yavaş olanları xatırlayıram.", "B", "iştirak məzmunu ifadə edir"],
    ["Niyə susursan, danış *da*!", "D", "cümlənin sonunda fikri qüvvətləndirir"],
    ["Sən *də* gəlsən, səyahətimiz daha maraqlı olar.", "B", "iştirak məzmunu ifadə edir"],
    ["Mən elə onu deyəcəkdim *də*!", "D", "cümlənin sonunda fikri qüvvətləndirir"],
    ["Mən eşitmişəm *ki*, Çində qırx ilə bir çini qab düzəldirlər.", "B", "cümlələr arasında əlaqə yaradır"],
    ["Uşaq deyilsən *ki*.", "D", "cümləyə emosionallıq gətirir"],
    ["O bilirdi *ki*, anası narahatdır.", "B", "cümlələr arasında əlaqə yaradır"],
    ["Burada təəccüblü nə var *ki*?!", "D", "cümləyə emosionallıq və sual məzmunu gətirir"],
    ["Yağış yenicə kəsmişdi *ki*, külək başladı.", "B", "cümlələr arasında əlaqə yaradır"],
    ["Sən *ki* həmişə onu tərifləyirdin.", "D", "cümləyə emosionallıq gətirir"],
    ["Gərək açıq-aşkar *deyəsən*, bir də belə səhv etməsin.", "F", "“sən deyirsən” mənasında hərəkət bildirir"],
    ["*Deyəsən*, bu məsələdə onunla razılaşan olmayacaq.", "M", "güman bildirir, danışanın fikrə münasibətidir"],
    ["Həqiqəti öyrənmək üçün *qoy* araşdırsın.", "D", "əmr mənasını gücləndirir"],
    ["Bu sənədi stolun üstünə *qoy* və dərhal qayıt.", "F", "nə et? — hərəkət bildirir"],
    ["*Vay*, nə yaman qəzəblə baxır!", "N", "hiss-həyəcan ifadə edir"],
    ["*Vayda* da, toyda da əskik olmaz.", "I", "nədə? — yerlik halda isim"],
    ["*Aman*, uşağın qızdırması var!", "N", "hiss-həyəcan ifadə edir"],
    ["Ondan *aman* gözləmə.", "I", "nəyi? — təsirlik halda isim (rəhm)"],
    ["*Ah*, bu yerlərin necə də gözəl havası var!", "N", "hiss-həyəcan ifadə edir"],
    ["*Ahına* anan qurban, ay bala!", "I", "“ah” sözü burada hal şəkilçisi qəbul edib, isimdir"],
  ].map(([s, t, why]) => ({ s, t, why, w: s.match(/\*([^*]+)\*/)[1] }));
  const OMOP = ["isim", "sifət", "zərf", "feil", "qoşma", "bağlayıcı", "ədat", "modal söz", "nida"];
  const OMOT = { I: "isim", S: "sifət", Z: "zərf", F: "feil", Q: "qoşma", B: "bağlayıcı", D: "ədat", M: "modal söz", N: "nida" };

  // ---- bağlayıcı və ədatın şəkilçidən fərqi (7-ci sinif, 1-ci hissə, s. 11, 15; 6-cı sinif, 2-ci hissə, s. 72)
  // t: B bağlayıcı (ayrı), D ədat (ayrı), DB ədat (bitişik), S şəkilçi (bitişik)
  const SEKT = { B: "bağlayıcıdır, ayrı yazılır", D: "ədatdır, ayrı yazılır", DB: "ədatdır, sözə bitişik yazılır", S: "şəkilçidir, sözə bitişik yazılır" };
  const SEK = [
    ["O bilirdi *ki*, anası narahatdır.", "ki", "B"], ["Mən eşitmişəm *ki*, Çində qırx ilə bir çini qab düzəldirlər.", "ki", "B"],
    ["Sən *ki* həmişə onu tərifləyirdin.", "ki", "D"], ["Burada təəccüblü nə var *ki*?!", "ki", "D"],
    ["*Dünənki* imtahanda iştirak edirdin?", "ki", "S"], ["*İndiki* uşaqlar kitabı az oxuyur.", "ki", "S"],
    ["Sən *də* gəlsən, səyahətimiz daha maraqlı olar.", "də", "B"], ["Niyə susursan, danış *da*!", "da", "D"],
    ["*Müsabiqədə* iştirak edən şagirdlər çox məsuliyyətlidirlər.", "də", "S"],
    ["Məsələni *yerindəcə* həll etdik.", "cə", "DB"], ["*Bilirsinizmi*, biz Qori seminariyasında təzə şöbə açmışıq.", "mi", "DB"],
    ["Gözünü açıb bir ətrafına *baxsana*.", "sana", "DB"], ["Şuşaya da *mı* avtobusla gedirsiniz?", "mı", "D"],
  ].map(([s, part, t]) => ({ s, part, t, w: s.match(/\*([^*]+)\*/)[1] }));
  // -la (-lə): 6-cı sinif, 2-ci hissə, s. 72
  const LA = [["Gülayla Sevda rəfiqədirlər.", "Gülayla", "ilə bağlayıcısının şəkilçiləşmiş formasıdır"], ["Bahar filmə həyəcanla baxırdı.", "həyəcanla", "isimdən zərf düzəldib"],
    ["Biz Gəncəyə qatarla getdik.", "qatarla", "qoşmanın şəkilçiləşmiş formasıdır"]];
  const LAP = ["ilə bağlayıcısının şəkilçiləşmiş formasıdır", "isimdən zərf düzəldib", "qoşmanın şəkilçiləşmiş formasıdır"];

  // ---- köməkçi nitq hissələrinin sinonimliyi
  const SIN2 = [["amma", "lakin"], ["heyif ki", "təəssüf ki"], ["axır ki", "nəhayət"], ["elə bil", "sanki"], ["məncə", "zənnimcə"], ["əvvəla", "birincisi"], ["yalnız", "təkcə"]];
  const SIN2P = ["şübhəsiz", "əlbəttə", "beləliklə", "bəlkə", "çünki", "və", "əgər", "məhz", "axı", "təbii ki", "madam ki", "üstəlik"];

  // ---- morfoloji təhlil (5-ci sinif, 2-ci hissə, s. 10; 7-ci sinif, 2-ci hissə, s. 12, 21, 85)
  const POS = { isim: "isimdir", sifət: "sifətdir", say: "saydır", əvəzlik: "əvəzlikdir", feil: "feildir", zərf: "zərfdir", qoşma: "qoşmadır", bağlayıcı: "bağlayıcıdır", ədat: "ədatdır", "modal söz": "modal sözdür", nida: "nidadır" };
  const MP = {
    hal: ["adlıq haldadır", "yiyəlik haldadır", "yönlük haldadır", "təsirlik haldadır", "yerlik haldadır", "çıxışlıq haldadır"],
    say: ["təkdədir", "cəmdədir"],
    mens: ["I şəxsin təkinə aid mənsubiyyət şəkilçisi qəbul edib", "II şəxsin təkinə aid mənsubiyyət şəkilçisi qəbul edib", "III şəxsin təkinə aid mənsubiyyət şəkilçisi qəbul edib", "I şəxsin cəminə aid mənsubiyyət şəkilçisi qəbul edib"],
    sex: ["I şəxsin təkindədir", "II şəxsin təkindədir", "III şəxsin təkindədir", "I şəxsin cəmindədir", "II şəxsin cəmindədir", "III şəxsin cəmindədir"],
    zam: ["keçmiş zamandadır", "indiki zamandadır", "gələcək zamandadır"],
    nov: ["sıra sayıdır", "miqdar sayıdır"],
    der: ["adi dərəcədədir", "azaltma dərəcəsindədir", "çoxaltma dərəcəsindədir"],
    sexe: ["I şəxsin təkidir", "II şəxsin təkidir", "III şəxsin təkidir", "I şəxsin cəmidir", "II şəxsin cəmidir", "III şəxsin cəmidir"],
    aid: ["feilə aiddir", "ismə aiddir"],
    nhs: ["köməkçi nitq hissəsidir", "əsas nitq hissəsidir"],
    mena: ["yalnız qrammatik mənası var", "həm leksik, həm qrammatik mənası var"],
  };
  const KM = [["nhs", "köməkçi nitq hissəsidir"], ["mena", "yalnız qrammatik mənası var"]];
  const MORF = [
    ["Şagirdlər *məktəbə* getdilər.", "isim", [["hal", "yönlük haldadır"], ["say", "təkdədir"]]],
    ["*Uşaqlardan* biri qapını döydü.", "isim", [["hal", "çıxışlıq haldadır"], ["say", "cəmdədir"]]],
    ["Bu *evlərdə* uşaqlar yaşayır.", "isim", [["hal", "yerlik haldadır"], ["say", "cəmdədir"]]],
    ["Bu *kitabım* mənim üçün əzizdir.", "isim", [["say", "təkdədir"], ["mens", "I şəxsin təkinə aid mənsubiyyət şəkilçisi qəbul edib"]]],
    ["Dünən məktub *yazdım*.", "feil", [["sex", "I şəxsin təkindədir"], ["zam", "keçmiş zamandadır"]]],
    ["Onlar sabah məktub *yazacaqlar*.", "feil", [["sex", "III şəxsin cəmindədir"], ["zam", "gələcək zamandadır"]]],
    ["Sən hər gün bizə *gəlirsən*.", "feil", [["sex", "II şəxsin təkindədir"], ["zam", "indiki zamandadır"]]],
    ["Biz dünən filmə *baxdıq*.", "feil", [["sex", "I şəxsin cəmindədir"], ["zam", "keçmiş zamandadır"]]],
    ["Mən *üçüncü* mərtəbədə yaşayıram.", "say", [["nov", "sıra sayıdır"]]],
    ["*Siz* bizi gözləyin.", "əvəzlik", [["sexe", "II şəxsin cəmidir"]]],
    ["*Qapqara* buludlar göyü örtdü.", "sifət", [["der", "çoxaltma dərəcəsindədir"]]],
    ["Uşaq *sürətlə* qaçdı.", "zərf", [["aid", "feilə aiddir"]]],
    ["Atam mənim *üçün* kitab gətirdi.", "qoşma", KM], ["Qardaşım *və* mən gəzintiyə çıxdıq.", "bağlayıcı", KM],
    ["*Axı* mən səni çoxdan gözləyirəm.", "ədat", KM], ["*Əlbəttə*, sən bu işi bacararsan.", "modal söz", KM], ["*Of*, bu çanta ağırdır!", "nida", KM],
  ].map(([s, pos, f]) => ({ s, pos, f, w: s.match(/\*([^*]+)\*/)[1] }));
  const KEYAD = { hal: "hal", say: "təkdə, yoxsa cəmdə", mens: "mənsubiyyət şəkilçisi (hansı şəxsə aid)", sex: "şəxs və say", zam: "zaman (keçmiş, indiki, gələcək)", nov: "say növü (miqdar, sıra)", der: "sifət dərəcəsi", sexe: "şəxs və say", aid: "aid olduğu söz (feil, isim)", nhs: "əsas, yoxsa köməkçi nitq hissəsi", mena: "mənası (leksik, qrammatik)" };
  const mText = it => [POS[it.pos], ...it.f.map(x => x[1])].join(", ");
  function mVariants(it) {
    const v = [];
    Object.keys(POS).filter(p => p !== it.pos && (isKomPos(it.pos) === isKomPos(p) || !isKomPos(it.pos))).forEach(p => v.push([POS[p], ...it.f.map(x => x[1])].join(", ")));
    it.f.forEach(([k, val], i) => MP[k].filter(x => x !== val).forEach(alt => { const a = it.f.map(x => x[1]); a[i] = alt; v.push([POS[it.pos], ...a].join(", ")); }));
    return v;
  }
  function isKomPos(p) { return ["qoşma", "bağlayıcı", "ədat", "modal söz", "nida"].includes(p); }
  // morfoloji tərkib
  const PT = { n: ["cəm şəkilçisi", "mənsubiyyət şəkilçisi", "yönlük hal şəkilçisi", "çıxışlıq hal şəkilçisi", "yerlik hal şəkilçisi", "yiyəlik hal şəkilçisi", "təsirlik hal şəkilçisi", "“ilə” qoşmasının ixtisarı"],
    v: ["keçmiş zaman şəkilçisi", "indiki zaman şəkilçisi", "gələcək zaman şəkilçisi", "şəxs şəkilçisi"] };
  const WP = [
    ["uşaqlardan", "n", ["cəm şəkilçisi", "çıxışlıq hal şəkilçisi"]], ["evlərdə", "n", ["cəm şəkilçisi", "yerlik hal şəkilçisi"]],
    ["şagirdlərə", "n", ["cəm şəkilçisi", "yönlük hal şəkilçisi"]], ["kitablarımız", "n", ["cəm şəkilçisi", "mənsubiyyət şəkilçisi"]],
    ["məktəbimizdən", "n", ["mənsubiyyət şəkilçisi", "çıxışlıq hal şəkilçisi"]],
    ["yazdım", "v", ["keçmiş zaman şəkilçisi", "şəxs şəkilçisi"]], ["gəlirsən", "v", ["indiki zaman şəkilçisi", "şəxs şəkilçisi"]],
  ].map(([w, c, p]) => ({ w, c, p }));
  const wpText = p => ["söz kökü", ...p].join(" + ");
  function wpVariants(it) {
    const v = [];
    it.p.forEach((x, i) => PT[it.c].filter(y => y !== x && !it.p.includes(y)).forEach(y => { const a = it.p.slice(); a[i] = y; v.push(wpText(a)); }));
    return v;
  }

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "qosma", ad: "Qoşma", izah: "Qoşma sözə qoşularaq məna çaları yaradır; iki və daha çox hecalı qoşma ayrı, birhecalı qoşma bitişik yazılır; bəzi qoşmalar bir-birini əvəz edə bilir.",
      gen() {
        const r = R(10);
        if (r < 4) {
          const o = pick(QOS), m = mc(o.m, QM, QMG, 4);
          return { text: h("span", {}, "Fərqləndirilmiş qoşma hansı məna çalarını bildirir?", line(mark(o.s))), ...m, show: o.m, solution: "“" + o.w + "” — " + o.m + " çaları yaradır. Qoşma qoşulduğu söz birləşməsində məna çalarını müəyyən edir." };
        }
        if (r < 7) {
          const bads = ORFQ.filter(x => x.bad), b = pick(bads), okk = sample(ORFQ.filter(x => x !== b), 3), o = shuffle([b.bad, ...okk.map(x => x.ok)]);
          return { text: "Hansı cümlədə qoşmanın yazılışında səhv var?", choices: o, correct: o.indexOf(b.bad), show: b.bad,
            solution: "Düzgün yazılış: " + b.ok + " İki və daha çox hecalı qoşma ayrı yazılır, birhecalı qoşma (-dək, -tək, -cən) sözə bitişik yazılır." };
        }
        const p = pick(QSIN), sw = R(2), a = p[sw], b = p[1 - sw], others = QSIN.filter(x => x !== p).map(x => pick(x));
        const o = shuffle([b, ...sample(others, 3)]);
        return { text: h("span", {}, "Fərqləndirilmiş ifadənin qrammatik sinonimi hansıdır?", line(h("u", {}, h("b", {}, a)))), choices: o, correct: o.indexOf(b), show: b,
          solution: "“" + a + "” və “" + b + "” eyni məna çalarını yaradır, cümlədə bir-birini əvəz edir — qoşmanın qrammatik sinonimliyi." };
      } },
    { id: "baglayici", ad: "Bağlayıcı", izah: "Bağlayıcı sözlər və cümlələr arasında əlaqə yaradır. Əlaqənin mənasını (birləşdirmə, qarşılaşdırma, səbəb…) və mürəkkəb bağlayıcıların ayrı yazılışını yoxla.",
      gen() {
        if (R(10) < 7) {
          const o = pick(BAG), m = mc(o.m, BM, BMG, 4);
          return { text: h("span", {}, "Fərqləndirilmiş bağlayıcı hansı məna əlaqəsi yaradır?", line(mark(o.s))), ...m, show: o.m, solution: "Bu bağlayıcı " + o.m + " əlaqəsi yaradır." };
        }
        const b = pick(MB.filter(x => x.bad)), okk = sample(MB.filter(x => x !== b), 3), o = shuffle([b.bad, ...okk.map(x => x.ok)]);
        return { text: "Hansı cümlədə mürəkkəb bağlayıcının yazılışında səhv var?", choices: o, correct: o.indexOf(b.bad), show: b.bad,
          solution: "Düzgün yazılış: " + b.ok + " Mürəkkəb bağlayıcılar (yəni ki, madam ki, həm də, ona görə də…) ayrı yazılır." };
      } },
    { id: "edat", ad: "Ədat, modal söz, nida", izah: "Ədat təsir gücünü artırır; modal söz danışanın münasibətini bildirir; nida hiss-həyəcan ifadə edir. Məna çalarına və yazılışa bax.",
      gen() {
        const r = R(10);
        if (r < 3) { const o = pick(ED), m = mc(o.m, EM, EMG, 4); return { text: h("span", {}, "Fərqləndirilmiş ədat hansı mənanı bildirir?", line(mark(o.s))), ...m, show: o.m, solution: "“" + o.w + "” — " + o.m + " mənası yaradan ədatdır." }; }
        if (r < 5) { const o = pick(MOD), m = mc(o.m, MM, MMG, 4); return { text: h("span", {}, "Fərqləndirilmiş modal söz hansı mənanı bildirir?", line(mark(o.s))), ...m, show: o.m, solution: "Modal söz danışanın fikrə münasibətini bildirir: " + o.m + "." }; }
        if (r < 7) { const o = pick(NID), m = mc(o.m, NM, NMG, 4); return { text: h("span", {}, "Fərqləndirilmiş nida hansı hissi bildirir?", line(mark(o.s))), ...m, show: o.m, solution: "Bu nida " + o.m + " ifadə edir. Nidanın hissi kontekstdən asılıdır." }; }
        const b = pick(ORFE), okk = sample(ORFE.filter(x => x !== b), 3), o = shuffle([b.bad, ...okk.map(x => x.ok)]);
        return { text: "Hansı cümlədə ədatın yazılışında səhv var?", choices: o, correct: o.indexOf(b.bad), show: b.bad,
          solution: "Düzgün yazılış: " + b.ok + " -ca (-cə), -mı (-mi, -mu, -mü), -sana (-sənə) ədatları sözə bitişik yazılır; -mı ədatı da, də bağlayıcısından sonra ayrı yazılır." };
      } },
    { id: "vergul", ad: "Durğu işarələri", izah: "Təsdiq-inkar ədatından (bəli, xeyr, hə, yox), modal sözdən və ki bağlayıcısından sonra vergül qoyulur; ki ədatından sonra qoyulmur; nidadan sonra vergül və ya nida işarəsi olur.",
      gen() {
        const b = pick(VER), okk = sample(VER.filter(x => x !== b), 3), o = shuffle([b.bad, ...okk.map(x => x.ok)]);
        return { text: "Hansı cümlədə durğu işarəsi səhv işlədilib?", choices: o, correct: o.indexOf(b.bad), show: b.bad, solution: "Düzgün: " + b.ok + " Qayda: təsdiq-inkar ədatları, modal sözlər cümlədə vergüllə ayrılır; ki bağlayıcısından sonra vergül qoyulur, ki ədatından sonra qoyulmur; nidadan sonra vergül və ya nida işarəsi olur." };
      } },
    { id: "tap", ad: "Köməkçi sözləri tap", izah: "Köməkçi nitq hissələri ayrılıqda suala cavab vermir. Cümlədə qoşmanı, bağlayıcını, ədatı, modal sözü və nidanı ayırd et.",
      gen() {
        const r = R(3);
        if (r === 0) {
          const t = pick([...KOM]), s = pick(BANK.filter(x => has(x, t))), duz = s.map((x, i) => x.t === t ? i : -1).filter(i => i >= 0);
          return { text: "Cümlədə " + AD[t] + " olan bütün sözlərə toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
            solution: duz.map(i => s[i].w).join(", ") + " — " + AD[t] + ": " + FUNK[t] + ". Köməkçi nitq hissələri: " + lexSol(s) + "." };
        }
        if (r === 1) {
          const s = pick(BANK.filter(x => kinds(x).length >= 2)), ws = words(s), here = kinds(s), extra = sample([...KOM].filter(t => !here.includes(t)), 1 + R(2));
          const tags = [...KOM].filter(t => here.includes(t) || extra.includes(t)), qrup = ["əsas nitq hissəsi", ...tags.map(t => AD[t])];
          return { text: "«" + plain(s) + "» — sözləri qruplara ayır.", bol: { soz: ws.map(w => w.w), qrup, duz: ws.map(w => isKom(w.t) ? tags.indexOf(w.t) + 1 : 0) },
            show: lexSol(s) + "; qalanları əsas nitq hissələri", solution: lexSol(s) + ". Qalan sözlər əsas nitq hissələridir — suala cavab verir." };
        }
        const s = pick(BANK), i = pick(s.map((x, j) => x.t && isKom(x.t) ? j : -1).filter(j => j >= 0)), opts = [..."QBDMN"].map(t => AD[t]), t = s[i].t;
        return { text: h("span", {}, "Fərqləndirilmiş söz hansı köməkçi nitq hissəsidir?", line(...s.map((x, j) => [j && x.t ? " " : "", j === i ? h("u", {}, h("b", {}, x.w)) : x.w]))),
          choices: opts, correct: opts.indexOf(AD[t]), show: AD[t], solution: "“" + s[i].w + "” — " + AD[t] + ": " + FUNK[t] + "." };
      } },
    { id: "omonim", ad: "Omonimlik və şəkilçidən fərq", izah: "Eyni söz cümlədə fərqli nitq hissəsi ola bilər (doğru, əvvəl, da, ki, deyəsən, qoy…). Sual ver, məna və aid olduğu sözə bax. ki, da, mı, la bəzən şəkilçidir.",
      gen() {
        const r = R(10);
        if (r < 5) { const o = pick(OMO), m = mc(AD[o.t], OMOP, [], 5); return { text: h("span", {}, "Fərqləndirilmiş söz hansı nitq hissəsidir?", line(mark(o.s))), ...m, show: AD[o.t], solution: "“" + o.w + "” burada " + AD[o.t] + ": " + o.why + "." }; }
        if (r < 9) {
          const o = pick(SEK), ch = Object.keys(SEKT).map(k => SEKT[k]);
          return { text: h("span", {}, "Fərqləndirilmiş ifadədəki «" + o.part + "» nədir və necə yazılır?", line(mark(o.s))), choices: ch, correct: Object.keys(SEKT).indexOf(o.t), show: SEKT[o.t],
            solution: "Burada «" + o.part + "» " + SEKT[o.t] + "." };
        }
        const o = pick(LA);
        return { text: h("span", {}, "«" + o[1] + "» sözündəki -la (-lə) nə iş görür?", line(o[0])), choices: LAP, correct: LAP.indexOf(o[2]), show: o[2], solution: "-la (-lə): " + o[2] + "." };
      } },
    { id: "morf", ad: "Morfoloji təhlil", izah: "Sözün morfoloji təhlili: nitq hissəsi, kök və şəkilçilər, şəkilçilərin qrammatik mənası. Köməkçi nitq hissəsində yalnız növ və qrammatik məna.",
      gen() {
        if (R(10) < 6) {
          const it = pick(MORF), right = mText(it), w = sample(mVariants(it), 3), o = shuffle([right, ...w]);
          return { text: h("span", {}, "Fərqləndirilmiş sözün morfoloji təhlili hansıdır?", line(mark(it.s))), choices: o, correct: o.indexOf(right), show: right, solution: "“" + it.w + "” — " + right + "." };
        }
        const it = pick(WP), right = wpText(it.p), w = sample(wpVariants(it), 3), o = shuffle([right, ...w]);
        return { text: "«" + it.w + "» sözünün morfoloji tərkibi hansıdır?", choices: o, correct: o.indexOf(right), show: right, solution: "“" + it.w + "” — " + right + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümlədə üç sözün nitq hissəsini yazıb. Biri səhvdir — hansı?",
      gen() {
        const CONF = { I: "S", S: "Z", Y: "S", E: "I", F: "I", Z: "S", Q: "B", B: "Q", D: "M", M: "D", N: "D" };
        const s = pick(BANK.filter(x => words(x).length >= 3 && kinds(x).length)), ws = words(s), kom = pick(ws.filter(x => isKom(x.t))), rest = sample(ws.filter(x => x !== kom), 2);
        const three = [kom, ...rest].sort((a, b) => s.indexOf(a) - s.indexOf(b)), k = R(3), lab = three.map((w, j) => j === k ? CONF[w.t] : w.t), ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "«" + plain(s) + "» — şagirdin təhlili: " + three.map((w, j) => (j + 1) + ") " + w.w + " — " + AD[lab[j]]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd", solution: "“" + three[k].w + "” " + AD[lab[k]] + " deyil, " + PRED[three[k].t] + ". Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E) ========
  const FIKIR_DUZ = [
    "Qoşma ismin adlıq, yiyəlik, yönlük, çıxışlıq hallarında olan sözlərə qoşularaq müəyyən məna çaları yaradır.",
    "İki və daha artıq hecadan ibarət qoşmalar qoşulduğu sözdən ayrı yazılır.",
    "Birhecalı qoşmalar sözə bitişik yazılır.",
    "İlə qoşması həm ayrı, həm də sözə bitişik yazıla bilər.",
    "Qoşmaların bir-birini əvəz etməsi qrammatik sinonimlik adlanır.",
    "Köməkçi nitq hissələrinin leksik mənası olmadığına görə onların sinonimliyi və omonimliyi qrammatik sinonimlik və omonimlik adlanır.",
    "Bağlayıcı cümlənin komponentləri arasında əlaqə yaradan köməkçi nitq hissəsidir.",
    "Müstəqil ki bağlayıcısından sonra vergül qoyulur (madam ki, indi ki istisnadır: vergül tabe hissənin sonunda olur).",
    "Ki ədatından sonra vergül qoyulmur.",
    "Ki həm də leksik şəkilçidir və sözə bitişik yazılır.",
    "Da, də kontekstdən asılı olaraq həm bağlayıcı, həm də ədat kimi işlənir.",
    "Da, də həm də yerlik hal şəkilçisidir və sözə bitişik yazılır.",
    "Ədat sözün və cümlənin təsir gücünü artırır, cümləyə emosionallıq gətirir.",
    "Təsdiq və inkar bildirən bəli, xeyr, hə, yox ədatları cümlədə vergüllə ayrılır.",
    "-mı ədatı da, də bağlayıcısından sonra ayrı yazılır.",
    "Modal söz danışanın fikrə münasibətini bildirir.",
    "Dildə olan bütün modal sözlər cümlədə ara söz funksiyasını yerinə yetirir.",
    "Nida hiss-həyəcan ifadə edir.",
    "Bəzi nidaların ifadə etdiyi hiss kontekstdən asılı olaraq dəyişə bilir.",
    "Nida cümləyə hiss, həyəcan qatdığından onun iştirak etdiyi cümlələr çox zaman nida cümləsi olur və sonunda nida işarəsi qoyulur.",
    "Yəni ki, madam ki, həm də kimi bağlayıcılar ayrı yazılır.",
    "Morfologiya nitq hissələrindən, sözlərin tərkibindən və dəyişmə qaydalarından bəhs edən dilçilik bölməsidir.",
  ];
  const FIKIR_SEHV = [
    "Bütün qoşmalar qoşulduğu sözdən ayrı yazılır.",
    "İki hecadan ibarət qoşmalar sözə bitişik yazılır.",
    "Qoşma ismin yalnız adlıq halında olan sözlərə qoşulur.",
    "Bağlayıcı yalnız sözlər arasında əlaqə yaradır, cümlələr arasında yaratmır.",
    "Ki ədatından sonra vergül qoyulur.",
    "Müstəqil ki bağlayıcısından sonra vergül qoyulmur.",
    "Da, də həmişə bağlayıcıdır.",
    "-mı ədatı həmişə sözdən ayrı yazılır.",
    "Bəli, xeyr, hə, yox ədatlarından sonra vergül qoyulmur.",
    "Modal söz ayrılıqda suala cavab verir.",
    "Qoşma, bağlayıcı, ədat, modal söz və nida əsas nitq hissələridir.",
    "Qoşmanın yalnız leksik mənası var.",
    "Köməkçi nitq hissələrinin sinonimliyi leksik sinonimlik adlanır.",
    "Ki həmişə ədatdır.",
    "Yəni ki, madam ki kimi mürəkkəb bağlayıcılar bitişik yazılır.",
    "Nida köməkçi nitq hissəsi deyil, əsas nitq hissəsidir.",
  ];
  // söz haqqında fikirlər: [söz, doğru fikirlər, səhv fikirlər]
  const PROFIL = [
    ["üçün", ["qoşmadır", "köməkçi nitq hissəsidir", "yalnız qrammatik mənası var", "sözə qoşularaq məna çaları yaradır", "ayrılıqda suala cavab vermir"], ["bağlayıcıdır", "əsas nitq hissəsidir", "leksik mənası var", "hiss-həyəcan bildirir", "təsir gücünü artırır"]],
    ["amma", ["bağlayıcıdır", "köməkçi nitq hissəsidir", "cümlələr arasında əlaqə yaradır", "yalnız qrammatik mənası var", "ayrılıqda suala cavab vermir"], ["qoşmadır", "əsas nitq hissəsidir", "leksik mənası var", "danışanın fikrə münasibətini bildirir", "cümlə üzvü olur"]],
    ["məhz", ["ədatdır", "köməkçi nitq hissəsidir", "dəqiqləşdirmə mənası yaradır", "yalnız qrammatik mənası var", "ayrılıqda suala cavab vermir"], ["modal sözdür", "əsas nitq hissəsidir", "leksik mənası var", "hiss-həyəcan bildirir", "sözlərə qoşularaq məna çaları yaradır"]],
    ["əlbəttə", ["modal sözdür", "köməkçi nitq hissəsidir", "danışanın fikrə münasibətini bildirir", "əminlik bildirir", "ayrılıqda suala cavab vermir"], ["ədatdır", "əsas nitq hissəsidir", "leksik mənası var", "nidadır", "hal şəkilçisi qəbul edir"]],
    ["of", ["nidadır", "köməkçi nitq hissəsidir", "hiss-həyəcan ifadə edir", "yalnız qrammatik mənası var", "ayrılıqda suala cavab vermir"], ["modal sözdür", "ədatdır", "əsas nitq hissəsidir", "sözlərə qoşularaq məna çaları yaradır", "leksik mənası var"]],
  ];
    const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .6) { const o = pick(QOS); return AEq(h("span", {}, "Fərqləndirilmiş qoşma hansı məna çalarını bildirir?", line(mark(o.s))), o.m, wrongs(o.m, QM, QMG), "“" + o.w + "” — " + o.m + " çaları yaradan qoşmadır. Qalan variantlar başqa məna çalarlarıdır."); }
      const p = pick(QSIN), sw = R(2), a = p[sw], b = p[1 - sw], others = QSIN.filter(x => x !== p).map(x => pick(x));
      return AEq(h("span", {}, "Fərqləndirilmiş ifadənin qrammatik sinonimi hansıdır?", line(h("u", {}, h("b", {}, a)))), b, sample(others, 4), "“" + a + "” və “" + b + "” eyni məna çalarını yaradır, cümlədə bir-birini əvəz edir. Qalan ifadələr başqa sözlərlə işlənir.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const b = pick(ORFQ.filter(x => x.bad)), okk = sample(ORFQ.filter(x => x !== b), 4);
      return AEq("Cümlələrin birində qoşmanın yazılışında səhvə yol verilib:", b.bad, okk.map(x => x.ok), "Səhv: “" + b.bad + "” Düzgün: “" + b.ok + "” İki və daha çox hecalı qoşma ayrı, birhecalı qoşma (-dək, -tək, -cən) bitişik yazılır. Qalan cümlələr düzgündür.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .75) { const o = pick(BAG); return AEq(h("span", {}, "Fərqləndirilmiş bağlayıcı hansı məna əlaqəsi yaradır?", line(mark(o.s))), o.m, wrongs(o.m, BM, BMG), "Bu bağlayıcı " + o.m + " əlaqəsi yaradır."); }
      const b = pick(MB.filter(x => x.bad)), okk = sample(MB.filter(x => x !== b), 4);
      return AEq("Cümlələrin birində mürəkkəb bağlayıcının yazılışında səhvə yol verilib:", b.bad, okk.map(x => x.ok), "Səhv: “" + b.bad + "” Düzgün: “" + b.ok + "” Mürəkkəb bağlayıcılar ayrı yazılır.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const pool = SEK.filter(x => x.t === "B" || x.t === "D"), t = pick(["B", "D"]), five = sample(pool, 5);
      const right = five.map((o, i) => o.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4 || new Set(five.map(o => o.s)).size < 5) return null;
      const o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz " + (t === "B" ? "bağlayıcıdır?" : "ədatdır?"), ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", mark(x.s))));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((x, i) => (i + 1) + ") «" + x.w + "» — " + (x.t === "B" ? "bağlayıcı" : "ədat")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const b = pick(VER), okk = sample(VER.filter(x => x !== b), 4);
      return AEq("Cümlələrin birində durğu işarəsi səhv işlədilib:", b.bad, okk.map(x => x.ok), "Səhv: “" + b.bad + "” Düzgün: “" + b.ok + "” Təsdiq-inkar ədatları və modal sözlər vergüllə ayrılır; ki bağlayıcısından sonra vergül qoyulur, ki ədatından sonra qoyulmur; nidadan sonra vergül və ya nida işarəsi olur. Qalan cümlələr düzgündür.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const b = pick(ORFE), okk = sample(ORFE.filter(x => x !== b), 4);
      return AEq("Cümlələrin birində ədatın yazılışında səhvə yol verilib:", b.bad, okk.map(x => x.ok), "Səhv: “" + b.bad + "” Düzgün: “" + b.ok + "” -ca (-cə), -mı (-mi, -mu, -mü), -sana (-sənə) ədatları sözə bitişik yazılır; -mı ədatı da, də bağlayıcısından sonra ayrı yazılır.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const o = pick(MOD); return AEq(h("span", {}, "Fərqləndirilmiş modal söz hansı mənanı bildirir?", line(mark(o.s))), o.m, wrongs(o.m, MM, MMG), "Modal söz danışanın fikrə münasibətini bildirir: " + o.m + "."); }
      const o = pick(NID); return AEq(h("span", {}, "Fərqləndirilmiş nida hansı hissi bildirir?", line(mark(o.s))), o.m, wrongs(o.m, NM, NMG), "Bu nida " + o.m + " ifadə edir. Nidanın hissi kontekstdən asılıdır.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const o = pick(OMO); return AEq(h("span", {}, "Fərqləndirilmiş söz hansı nitq hissəsidir?", line(mark(o.s))), AD[o.t], wrongs(AD[o.t], OMOP, []), "“" + o.w + "” burada " + AD[o.t] + ": " + o.why + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["Q", "S"]), five = sample(OMO, 5);
      if (new Set(five.map(o => o.s)).size < 5) return null;
      const right = five.map((o, i) => (t === "Q" ? o.t === "Q" : o.t !== "Q") ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, t === "Q" ? "Hansı cümlələrdə fərqləndirilmiş söz qoşmadır?" : "Hansı cümlələrdə fərqləndirilmiş söz qoşma deyil?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", mark(x.s))));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((x, i) => (i + 1) + ") «" + x.w + "» — " + AD[x.t] + " (" + x.why + ")").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const r = Math.random();
      if (r < .45) { const it = pick(MORF), right = mText(it), w = sample(mVariants(it), 4); return AEq(h("span", {}, "Fərqləndirilmiş sözün morfoloji təhlili hansıdır?", line(mark(it.s))), right, w, "“" + it.w + "” — " + right + ". Qalan variantlarda bir xüsusiyyət səhvdir."); }
      if (r < .75) { const it = pick(WP), right = wpText(it.p), w = sample(wpVariants(it), 4); return AEq("«" + it.w + "» sözünün morfoloji tərkibi hansıdır?", right, w, "“" + it.w + "” — " + right + ". Qalan variantlarda bir şəkilçinin adı səhvdir."); }
      if (r < .87) { const [w, duz, sehv] = pick(PROFIL), bad = pick(sehv); return AEq("“" + w + "” sözü ilə bağlı səhv fikri müəyyən edin.", bad, sample(duz, 4), "“" + w + "”: " + duz.join(", ") + ". Səhv fikir: " + bad + "."); }
      if (r < .94) { const bad = pick(FIKIR_SEHV); return AEq("Köməkçi nitq hissələri ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Köməkçi nitq hissələri ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: bankdakı hər fakt müstəqil sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "k" + (++yn), sual, cavab });
  const NITQ = "(isim, sifət, say, əvəzlik, feil, zərf, qoşma, bağlayıcı, ədat, modal söz, nida)";
  BANK.forEach(s => words(s).forEach(x => addY("«" + plain(s) + "» cümləsində “" + x.w + "” sözü hansı nitq hissəsidir? " + NITQ + " — dərsliyə görə: qoşma, bağlayıcı, ədat, modal söz, nida köməkçi nitq hissələridir.", AD[x.t])));
  QOS.forEach(o => addY("«" + plainS(o.s) + "» cümləsində “" + o.w + "” qoşması hansı məna çalarını bildirir? (" + QM.join(", ") + ")", o.m));
  ORFQ.forEach(o => { addY("«" + o.ok + "» cümləsində qoşmanın yazılışı düzgündürmü? (doğru, səhv) — dərsliyə görə: iki və daha çox hecalı qoşma ayrı, birhecalı qoşma (-dək, -tək, -cən) bitişik yazılır; ilə həm ayrı, həm bitişik.", "doğru"); if (o.bad) addY("«" + o.bad + "» cümləsində qoşmanın yazılışı düzgündürmü? (doğru, səhv) — dərsliyə görə: iki və daha çox hecalı qoşma ayrı, birhecalı qoşma (-dək, -tək, -cən) bitişik yazılır.", "səhv"); });
  QSIN.forEach(p => addY("«" + p[0] + "» və «" + p[1] + "» eyni məna çalarını yaradan qoşmalı ifadələr olub bir-birini əvəz edə bilirmi? (bəli, xeyr)", "bəli"));
  BAG.forEach(o => addY("«" + plainS(o.s) + "» cümləsində fərqləndirilmiş bağlayıcı hansı məna əlaqəsi yaradır? (" + BM.join(", ") + ") — dərsliyə görə.", o.m));
  MB.forEach(o => { addY("«" + o.ok + "» cümləsində mürəkkəb bağlayıcının yazılışı düzgündürmü? (doğru, səhv) — dərsliyə görə: yəni ki, madam ki, həm də, ona görə də ayrı yazılır.", "doğru"); if (o.bad) addY("«" + o.bad + "» cümləsində mürəkkəb bağlayıcının yazılışı düzgündürmü? (doğru, səhv) — dərsliyə görə: yəni ki, madam ki, həm də, ona görə də ayrı yazılır.", "səhv"); });
  ED.forEach(o => addY("«" + plainS(o.s) + "» cümləsində “" + o.w + "” ədatı hansı mənanı yaradır? (" + EM.join(", ") + ") — dərsliyə görə.", o.m));
  ORFE.forEach(o => { addY("«" + o.ok + "» cümləsində ədatın yazılışı düzgündürmü? (doğru, səhv) — dərsliyə görə: -ca (-cə), -mı (-mi, -mu, -mü), -sana (-sənə) bitişik; -mı ədatı da, də bağlayıcısından sonra ayrı yazılır.", "doğru"); addY("«" + o.bad + "» cümləsində ədatın yazılışı düzgündürmü? (doğru, səhv) — dərsliyə görə: -ca (-cə), -mı (-mi, -mu, -mü), -sana (-sənə) bitişik; -mı ədatı da, də bağlayıcısından sonra ayrı yazılır.", "səhv"); });
  MOD.forEach(o => addY("«" + plainS(o.s) + "» cümləsində fərqləndirilmiş modal söz hansı mənanı bildirir? (" + MM.join("; ") + ") — dərsliyə görə.", o.m));
  NID.forEach(o => addY("«" + plainS(o.s) + "» cümləsində fərqləndirilmiş nida hansı hissi bildirir? (" + NM.join("; ") + ") — dərsliyə görə.", o.m));
  VER.forEach(o => { addY("«" + o.ok + "» cümləsində durğu işarələri düzgündürmü? (doğru, səhv) — dərsliyə görə: təsdiq-inkar ədatından və modal sözdən sonra vergül; ki bağlayıcısından sonra vergül, ki ədatından sonra vergül yox; nidadan sonra vergül və ya nida işarəsi.", "doğru"); addY("«" + o.bad + "» cümləsində durğu işarələri düzgündürmü? (doğru, səhv) — dərsliyə görə: təsdiq-inkar ədatından və modal sözdən sonra vergül; ki bağlayıcısından sonra vergül, ki ədatından sonra vergül yox; nidadan sonra vergül və ya nida işarəsi.", "səhv"); });
  OMO.forEach(o => addY("«" + plainS(o.s) + "» cümləsində “" + o.w + "” sözü hansı nitq hissəsidir? (isim, sifət, zərf, feil, qoşma, bağlayıcı, ədat, modal söz, nida) — nitq hissəsi cümlədəki işlənməyə görə müəyyən olunur.", OMOT[o.t]));
  SEK.forEach(o => addY("«" + plainS(o.s) + "» cümləsində fərqləndirilmiş ifadədəki «" + o.part + "» nədir və necə yazılır? (bağlayıcıdır, ayrı yazılır; ədatdır, ayrı yazılır; ədatdır, sözə bitişik yazılır; şəkilçidir, sözə bitişik yazılır)", SEKT[o.t]));
  LA.forEach(o => addY("«" + o[0] + "» cümləsində “" + o[1] + "” sözündəki -la (-lə) nə iş görür? (" + LAP.join("; ") + ")", o[2]));
  SIN2.forEach(p => addY("«" + p[0] + "» və «" + p[1] + "» köməkçi sözləri mənaca yaxındırmı və cümlədə bir-birini əvəz edə bilirmi? (bəli, xeyr)", "bəli"));
  MORF.forEach(it => addY("«" + plainS(it.s) + "» cümləsində “" + it.w + "” sözünün morfoloji təhlili hansıdır? Yalnız bunları yaz (vergüllə, qısa): nitq hissəsi" + (it.f.length ? ", " + it.f.map(x => KEYAD[x[0]]).join(", ") : "") + ". Başqa xüsusiyyət (sadə/düzəltmə, təsirli/təsirsiz, məlum növ, təsdiq, şəxs əvəzliyi, adlıq hal və s.) yazma.", mText(it)));
  WP.forEach(it => addY("“" + it.w + "” sözünün morfoloji tərkibi hansıdır? Cavabı bu formada yaz: «söz kökü + … şəkilçisi + … şəkilçisi» (şəkilçinin adı: cəm, mənsubiyyət, hal (hansı hal), zaman, şəxs). Kökün özünü və şəxsin/zamanın növünü yazma.", wpText(it.p)));
  FIKIR_DUZ.forEach(f => addY("Köməkçi nitq hissələri və morfologiya haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — 5-ci, 6-cı və 7-ci sinif dərsliklərinin qaydasına görə.", "doğru"));
  FIKIR_SEHV.forEach(f => addY("Köməkçi nitq hissələri haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — 5-ci, 6-cı və 7-ci sinif dərsliklərinin qaydasına görə.", "səhv"));
  PROFIL.forEach(([w, duz, sehv]) => { duz.forEach(f => addY("“" + w + "” sözü haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — “" + w + "” sözü yuxarıdakı köməkçi nitq hissələri üzrə dərslik qaydasına görə nümunə cümlədə işlənib.", "doğru")); sehv.forEach(f => addY("“" + w + "” sözü haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — “" + w + "” sözü köməkçi nitq hissələri üzrə dərslik qaydasına görə.", "səhv")); });
  window.__yoxla = YOX;

  window.__levels = levels;
  window.__bank = { BANK, QOS, ORFQ, QSIN, BAG, MB, ED, ORFE, MOD, NID, VER, OMO, SEK, LA, SIN2, MORF, WP, PROFIL, FIKIR_DUZ, FIKIR_SEHV, AD };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-komekci", title: "Köməkçi nitq hissələri; sözün morfoloji təhlili", fenn: "azdili", link: "dersler/az-komekci.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Köməkçi sözü cümlədəki işlənməsinə, məna çalarına və yazılışına görə müəyyən et.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qosma", "qosma", "baglayici", "edat", "vergul", "tap", "omonim", "omonim", "morf", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-komekci.html")) b.push("dersler/az-komekci.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
