// Azərbaycan dili · Leksika: həqiqi və məcazi məna, çoxmənalı sözlər, omonimlər, sinonimlər, antonimlər,
// frazeoloji birləşmələr, terminlər — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 1-ci hissə (2024), s. 31 (həqiqi və məcazi məna), s. 35 (çoxmənalı sözlər, omonimlər),
// s. 67 (sinonimlər və antonimlər), s. 75 (lüğətdən istifadə); 2-ci hissə (2024), s. 94–95 (frazeoloji birləşmələr);
// 6-cı sinif, 1-ci hissə (2025), s. 41 ("dairə" çoxmənalı sözdür), s. 70 (çörək ilə frazeoloji birləşmələr);
// 2-ci hissə (2025), s. 33 (termin). Suallar əl ilə yoxlanmış banklardan qurulur. Bankda qəsdən olmayanlar: nitq hissəsi
// baxımından omonimlik (bərk, gecə, az — əvvəlki mövzu), mənası mübahisəli çoxmənalı/omonim sözlər (boy, yad, al, üz-sifət).
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  // A–E variantı üçün "nömrə kombinasiyası": düz alt çoxluq + 4 başqa (1–4 elementli) alt çoxluq
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }
  const SUBS = (() => { const all = []; for (let m = 1; m < 31; m++) { const s = []; for (let i = 0; i < 5; i++) if (m & (1 << i)) s.push(i + 1); all.push(s); } return all; })();
  // *söz* — fərqləndirilmiş söz
  const wordOf = s => s.match(/\*([^*]+)\*/)[1];
  const guil = s => s.replace(/\*([^*]+)\*/, "«$1»");
  const mark = s => { const p = s.split("*"); return h("span", {}, p[0], h("u", {}, h("b", {}, p[1])), p[2]); };
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const nl = (...k) => h("span", { style: "display:block" }, ...k);
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };

  // ======== BANK 1. Həqiqi və məcazi məna (5-ci sinif, 1-ci hissə, s. 31 və s. 28) ========
  // hər söz üçün cüt: [cümlə, ifadə, səbəb]; h — həqiqi, m — məcazi
  const HM = [
    { k: "acı", h: ["Mən *acı* bibəri xoşlayıram.", "acı bibər", "dad bildirir"], m: ["*Acı* söz qəlbə toxunur.", "acı söz", "dad deyil, sözün adamı incitməsidir"] },
    { k: "soyuq", h: ["*Soyuq* su dişlərimizi göynədirdi.", "soyuq su", "suyun temperaturunu bildirir"], m: ["Dostlar arasında *soyuq* münasibət yaranmışdı.", "soyuq münasibət", "temperatur deyil, münasibətin səmimi olmamasıdır"] },
    { k: "qara", h: ["*Qara* karandaşın ucu qırılmışdı.", "qara karandaş", "rəngi bildirir"], m: ["*Qara* günlər keçmişdə qaldı.", "qara günlər", "rəng deyil, ağır, çətin günlərdir"] },
    { k: "şirin", h: ["Nənəm *şirin* çay süzdü.", "şirin çay", "dad bildirir"], m: ["Onlar *şirin* söhbət edirdilər.", "şirin söhbət", "dad deyil, xoş, ürəyəyatan deməkdir"] },
    { k: "şit", h: ["*Şit* yağ yeməyin dadını pozdu.", "şit yağ", "duzu olmayan deməkdir"], m: ["Onun *şit* zarafatı heç kəsi güldürmədi.", "şit zarafat", "dad deyil, maraqsız deməkdir"] },
    { k: "dəmir", h: ["*Dəmir* qapı möhkəm bağlanmışdı.", "dəmir qapı", "metalı bildirir"], m: ["Onun *dəmir* iradəsi var.", "dəmir iradə", "metal deyil, möhkəm, güclü deməkdir"] },
    { k: "bürümək", h: ["Ana körpəsini yorğana *bürüdü*.", "yorğana bürüdü", "bükdü, sardı"], m: ["Qəlbimi fərəh *bürüdü*.", "fərəh bürüdü", "bükmək deyil, hissin insanı öz təsiri altına almasıdır"] },
    { k: "yatmaq", h: ["Ana səhərə yaxın *yatdı*.", "ana yatdı", "insan yuxuya getdi"], m: ["Külək səhərə yaxın *yatdı*.", "külək yatdı", "külək yatmır, səngidi"] },
    { k: "oyanmaq", h: ["Körpə yavaş-yavaş *oyandı*.", "körpə oyandı", "yuxudan ayıldı"], m: ["Təbiət yavaş-yavaş *oyandı*.", "təbiət oyandı", "təbiət yatmır, canlanmağa başladı"] },
    { k: "döymək", h: ["Qonşu qapını *döydü*.", "qonşu qapını döydü", "əli ilə qapıya vurdu"], m: ["Qış qapını *döydü*.", "qış qapını döydü", "qışın yaxınlaşdığını bildirir"] },
    { k: "boylanmaq", h: ["Uşaq pəncərədən *boylandı*.", "uşaq boylandı", "adam baş uzadıb baxdı"], m: ["Günəş pəncərədən *boylandı*.", "günəş boylandı", "günəş baxmır, görünməyə başladı"] },
    { k: "yağış", h: ["Dünən güclü *yağış* yağdı.", "güclü yağış", "hava hadisəsidir"], m: ["Aramsız güllə *yağışı* altında irəlilədik.", "güllə yağışı", "yağış deyil, çoxlu güllənin atılmasıdır"] },
    { k: "möhkəm", h: ["Bu *möhkəm* divarı sındırmaq çətindir.", "möhkəm divar", "bərk, davamlı deməkdir"], m: ["Onlar arasında *möhkəm* dostluq yarandı.", "möhkəm dostluq", "dostluğun etibarlı olmasıdır"] },
    { k: "isti", h: ["*İsti* çay bədənimi qızdırdı.", "isti çay", "temperaturu bildirir"], m: ["Qonaqları *isti* münasibətlə qarşıladılar.", "isti münasibət", "temperatur deyil, səmimi münasibətdir"] },
    { k: "yumşaq", h: ["Mən *yumşaq* yorğan aldım.", "yumşaq yorğan", "əl vuranda yumşaq olan əşyadır"], m: ["O, *yumşaq* xasiyyətli adamdır.", "yumşaq xasiyyət", "xasiyyətin mülayim olmasıdır"] },
    { k: "dərin", h: ["Quyu çox *dərin* idi.", "dərin quyu", "aşağıya doğru uzunluğu bildirir"], m: ["O, *dərin* fikir söylədi.", "dərin fikir", "məzmunlu, əhatəli deməkdir"] },
  ];
  const TN = { H: "həqiqi", M: "məcazi" };
  const HMI = HM.flatMap(e => [{ k: e.k, t: "H", s: e.h[0], p: e.h[1], why: e.h[2] }, { k: e.k, t: "M", s: e.m[0], p: e.m[1], why: e.m[2] }]);
  const hmItem = (e, t) => { const x = t === "M" ? e.m : e.h; return { k: e.k, t, s: x[0], p: x[1], why: x[2] }; };

  // ======== BANK 2. Çoxmənalı sözün mənası kontekstdə (5-ci sinif, 1-ci hissə, s. 35, 75; 6-cı sinif, 1-ci hissə, s. 41) ========
  const KON = [
    { w: "dairə", izah: ["çevrənin daxilində qalan yuvarlaq sahə", "yaşayış məntəqəsinə daxil olan sahə, ərazi", "eyni fəaliyyətlə məşğul olanların qrupu, mühit", "bir şeyin yayıldığı və təsir etdiyi sahə"],
      ex: [["Çevrənin bütün nöqtələri *dairənin* mərkəzi nöqtəsindən eyni məsafədə yerləşir.", 0], ["Şəhər *dairəsindən* kənara çıxmaq qadağan olunub.", 1], ["Bu əsər ədəbi *dairələrdə* böyük səs-küyə səbəb oldu.", 2], ["Bu məsələ onun səlahiyyət *dairəsinə* daxil deyil.", 3]] },
    { w: "ayaq", izah: ["yeriməyə xidmət edən bədən üzvü", "çayın, kəndin, küçənin və s.-nin aşağı tərəfi"],
      ex: [["Uşaq *ayağını* suya saldı.", 0], ["Kəndin *ayağında* kiçik bir çay axır.", 1]] },
    { w: "addım", izah: ["yeriyərkən ayağın qaldırılıb irəli atılması", "nəyə isə nail olmaq üçün edilmiş hərəkət, təşəbbüs"],
      ex: [["Uşaq anasına doğru bir *addım* atdı.", 0], ["Bu çox təhlükəli *addım* idi.", 1]] },
    { w: "burun", izah: ["insanın və heyvanın iy bilmə orqanı", "gəminin ön tərəfi", "ayaqqabının ön tərəfi"],
      ex: [["Oğlanın *burnu* soyuqdan qızarmışdı.", 0], ["Gəminin *burnu* dalğaları yarırdı.", 1], ["Ayaqqabının *burnu* çirklənmişdi.", 2]] },
    { w: "ağız", izah: ["yemək qəbul edən və danışmağa xidmət edən üzv", "bir şeyin giriş hissəsi"],
      ex: [["Ana körpənin *ağzını* sildi.", 0], ["Qapının *ağzını* ot basmışdı.", 1]] },
    { w: "göz", izah: ["insanın görmə orqanı", "suyun çıxdığı yer", "əşya qoymaq üçün bölmə"],
      ex: [["Qızın *gözü* yaşardı.", 0], ["Bulağın *gözündən* dupduru su axırdı.", 1], ["Dəftərini dolabın *gözünə* qoydu.", 2]] },
    { w: "yol", izah: ["getmək üçün hazırlanmış zolaq", "insanın keçdiyi həyat gedişi"],
      ex: [["Piyada *yolu* keçdi.", 0], ["Onun həyat *yolu* maraqlı olub.", 1]] },
    { w: "üz", izah: ["başın ön hissəsi", "suyun, yerin və s.-nin üst səthi"],
      ex: [["Körpənin *üzü* gülürdü.", 0], ["Çayın *üzü* gecədən donmuşdu.", 1]] },
    { w: "ətək", izah: ["dağın aşağı hissəsi", "paltarın aşağı kənarı"],
      ex: [["Dağın *ətəyi* gül-çiçəklə dolu idi.", 0], ["Paltarın *ətəyi* kola ilişdi.", 1]] },
  ];
  // mənası heç bir sözə yaxın olmayan əlavə izahlar (variantı 4-ə çatdırmaq üçün)
  const FILL = ["yazı yazmaq üçün istifadə olunan alət", "içmək üçün qab", "yay fəslinin ilk ayı", "təhsil müəssisəsi", "ağacın yeməli məhsulu", "dərs cədvəli"];

  // ======== BANK 3. Omonimlər və çoxmənalı sözlər (5-ci sinif, 1-ci hissə, s. 35; 6-cı sinif, 1-ci hissə, s. 41) ========
  // a — iki-üç məna (qısa ifadə); tip: omonim — mənalar arasında yaxınlıq yoxdur; coxm — yaxınlıq var
  const OM = [
    { w: "top", tip: "omonim", a: ["yaylım atəşi açılan top", "futbol topu"] },
    { w: "bağ", tip: "omonim", a: ["meyvə bağı", "ayaqqabı bağı"] },
    { w: "əqrəb", tip: "omonim", a: ["zəhərli həşərat", "saatın əqrəbi"] },
    { w: "mürəkkəb", tip: "omonim", a: ["mürəkkəb quruluş", "yazı mürəkkəbi"] },
    { w: "göz", tip: "coxm", a: ["insanın gözü", "bulağın gözü", "dolabın gözü"] },
    { w: "burun", tip: "coxm", a: ["insanın burnu", "gəminin burnu", "ayaqqabının burnu"] },
    { w: "ağız", tip: "coxm", a: ["körpənin ağzı", "qapının ağzı"] },
    { w: "yol", tip: "coxm", a: ["piyada yolu", "həyat yolu"] },
    { w: "üz", tip: "coxm", a: ["körpənin üzü", "çayın üzü"] },
    { w: "ətək", tip: "coxm", a: ["dağın ətəyi", "paltarın ətəyi"] },
    { w: "ayaq", tip: "coxm", a: ["uşağın ayağı", "kəndin ayağı"] },
    { w: "addım", tip: "coxm", a: ["irəli atılan addım", "təhlükəli addım"] },
    { w: "dairə", tip: "coxm", a: ["dairənin sahəsi", "ədəbi dairə"] },
  ];
  const TIPAD = { omonim: "omonim", coxm: "çoxmənalı söz" };
  const two = e => e.a.length > 2 ? sample(e.a, 2) : e.a.slice();
  const pairTxt = e => two(e).join(" – ");

  // ======== BANK 4. Sinonimlər (5-ci sinif, 1-ci hissə, s. 67; 2-ci hissə, s. 33) ========
  // tag eyni olan qruplar bir-birinin yanlış variantı kimi verilmir (mənaca yaxın görünməsin)
  const SIN = [
    { w: ["gözəl", "göyçək"], tag: "gor" }, { w: ["boy-buxunlu", "qamətli"], tag: "gor" }, { w: ["bacarıqsız", "qabiliyyətsiz"] }, { w: ["acıq", "hirs"] },
    { w: ["əliaçıq", "səxavətli", "comərd"] }, { w: ["düşünmək", "fikirləşmək"] }, { w: ["tez", "cəld"] }, { w: ["qəm", "kədər"] },
    { w: ["kömək", "yardım"] }, { w: ["cəsarətli", "igid"] }, { w: ["yaz", "bahar"] }, { w: ["sevinc", "şadlıq"] },
    { w: ["şagird", "məktəbli"] }, { w: ["vətən", "yurd"] }, { w: ["döyüş", "savaş"] }, { w: ["məşhur", "tanınmış"] },
  ].map((g, i) => ({ ...g, tag: g.tag || "s" + i }));
  const sinPairs = SIN.flatMap(g => g.w.flatMap((a, i) => g.w.slice(i + 1).map(b => [a, b])));

  // ======== BANK 5. Antonimlər (5-ci sinif, 1-ci hissə, s. 67) ========
  const ANT = [
    [["gecə"], ["gündüz"]], [["dost"], ["düşmən"]], [["əvvəl"], ["sonra"]], [["igid", "cəsarətli"], ["qorxaq"]], [["duzlu"], ["şit"]],
    [["getmək"], ["gəlmək"]], [["çox"], ["az"]], [["uzaq"], ["yaxın"]], [["geniş"], ["dar"]], [["böyük"], ["kiçik"]], [["gülmək"], ["ağlamaq"]], [["isti"], ["soyuq"]],
  ];
  // mənaca yaxın sahələr: eyni sahədən olan sözlər bir-birinin yanlış variantı kimi verilmir
  const CL = { gecə: "t", gündüz: "t", əvvəl: "t", sonra: "t", geniş: "z", dar: "z", böyük: "z", kiçik: "z", uzaq: "z", yaxın: "z", çox: "z", az: "z", gülmək: "e", ağlamaq: "e", isti: "e", soyuq: "e" };
  // şəkilçi ilə əmələ gələn əksmənalı sözlər antonim sayılmır (5-ci sinif, 1-ci hissə, s. 67)
  const DER = [["duzlu", "duzsuz"], ["getmək", "getməmək"], ["cəsarətli", "cəsarətsiz"], ["insaflı", "insafsız"]];
  const derOf = w => DER.filter(p => p[0] === w).map(p => p[1]);
  const antPairs = ANT.flatMap(([a, b]) => a.flatMap(x => b.map(y => [x, y])));
  const UNREL = [["kitab", "dəniz"], ["ağac", "cəld"], ["qələm", "yaz"], ["pəncərə", "kömək"]];

  // ======== BANK 6. Frazeoloji birləşmələr (5-ci sinif, 2-ci hissə, s. 94–95; 6-cı sinif, 1-ci hissə, s. 70) ========
  const FRAZ = [
    ["ürəyinə xal düşmək", "şübhələnmək"], ["bir göz qırpımında", "tez, cəld"], ["aydan arı, sudan duru", "tərtəmiz"], ["qulaq asmaq", "dinləmək"],
    ["başına dolanmaq", "əzizləmək"], ["əl qaldırmaq", "vurmaq"], ["əl tutmaq", "kömək etmək"], ["ələ almaq", "öz tərəfinə çəkmək"],
    ["gözü yolda qalmaq", "gözləmək"], ["göz qoymaq", "nəzarət etmək"], ["gözü kəlləsinə çıxmaq", "təəccüblənmək"], ["gözünün acısını almaq", "mürgüləmək"],
    ["çörək kəsmək", "dostluq etmək"], ["çörəyi daşdan çıxarmaq", "çox çətinliklə pul qazanmaq"], ["əli çörəyə çatmaq", "güzaranı yaxşılaşmaq"],
    ["çörəyi çörəkçiyə vermək", "işi işbilənə tapşırmaq"], ["çörəyə əl basmaq", "and içmək"],
  ];
  // kontekstsiz də birmənalı frazeoloji birləşmələr (digərləri sərbəst birləşmə kimi də oxuna bilər)
  const SAFE = FRAZ.filter(f => ["ürəyinə xal düşmək", "bir göz qırpımında", "aydan arı, sudan duru", "qulaq asmaq", "gözü kəlləsinə çıxmaq", "gözünün acısını almaq"].includes(f[0]));
  // sərbəst söz birləşmələri (frazeoloji deyil)
  const FREE = ["paltar asmaq", "kitab oxumaq", "çay dəmləmək", "gül əkmək", "su içmək", "çörək bişirmək", "ev tikmək", "şəkil çəkmək"];
  // eyni ifadə: həqiqi və frazeoloji işlənmə; ilk cümlə həqiqi, ikinci frazeoloji
  const FPAIR = [
    { p: "yola düşmək", a: "Uşağın atdığı top *yola düşdü*.", b: "Qonağımız şəhərə *yola düşdü*." },
    { p: "başına dolanmaq", a: "Arı uşağın *başına dolandı*.", b: "Nənə nəvəsinin *başına dolanır*, onu əzizləyirdi." },
    { p: "əl qaldırmaq", a: "Şagird cavab vermək üçün *əlini qaldırdı*.", b: "O, heç vaxt uşağa *əl qaldırmazdı*, onu vurmazdı." },
    { p: "ələ almaq", a: "Qapıçı topu *ələ aldı*.", b: "Yeni müəllim sinfi tezliklə *ələ aldı*, şagirdləri öz tərəfinə çəkdi." },
  ];

  // ======== BANK 7. Terminlər (6-cı sinif, 2-ci hissə, s. 33) ========
  const TERM = {
    "tibb": ["pasiyent", "cərrahiyyə", "diaqnoz", "allergiya"],
    "coğrafiya": ["okean", "körfəz", "qabarma", "yarımada", "qitə"],
    "hüquq": ["prokuror", "ittiham", "məhkəmə", "müttəhim"],
    "riyaziyyat": ["üçbucaq", "kəsr", "tənlik", "bucaq"],
  };
  const termList = Object.entries(TERM).flatMap(([s, ws]) => ws.map(w => ({ w, s })));

  // ======== BANK 8. Qaydalar haqqında fikirlər ========
  const FIKIR_DUZ = [
    "Sözün ilkin mənası onun həqiqi mənasıdır.",
    "Sözün sonradan yaranan mənası məcazi mənadır.",
    "Sözün həqiqi və məcazi mənaları arasında müəyyən əlamətə görə yaxınlıq olur.",
    "Çoxmənalı sözün mənaları arasında yaxınlıq olur.",
    "Omonimlərin mənaları arasında yaxınlıq olmur.",
    "Omonimlər eyni cür deyilən və yazılan sözlərdir.",
    "Sinonimlər fikri dəqiq ifadə etməyə və nitqdə lazımsız təkrarların qarşısını almağa kömək edir.",
    "Antonimlərdən müəyyən fikri daha qabarıq, təsirli çatdırmaq üçün istifadə edilir.",
    "Şəkilçilərin köməyi ilə eyni kökdən əmələ gələn əksmənalı sözlər antonim hesab edilmir.",
    "Bəzi sinonimlər cümlədə bir-birini əvəz edə bilmir.",
    "Frazeoloji birləşmənin tərkibindəki sözlər öz həqiqi mənasından uzaqlaşır.",
    "Frazeoloji birləşmə bütövlükdə bir leksik məna bildirir.",
    "Frazeoloji birləşmələrin əksəriyyəti hərəkət bildirir.",
    "Bəzi söz birləşmələri həm həqiqi, həm də məcazi mənada işlənə bilər.",
    "Frazeoloji birləşmələrin də sinonimliyi və antonimliyi var.",
    "Termin müəyyən elm sahəsinə, ixtisas və peşəyə aid sözdür.",
    "Lüğətdə sözlər əlifba sırası ilə düzülür.",
    "Çoxmənalı sözün mənaları lüğətdə bir maddədə nömrələnir.",
    "Omonimlər lüğətdə ayrı maddələrdə (əqrəb¹, əqrəb²) verilir.",
  ];
  const FIKIR_SEHV = [
    "Sözün sonradan yaranan mənası həqiqi mənadır.",
    "Sözün ilkin mənası məcazi mənadır.",
    "Çoxmənalı sözün mənaları arasında heç bir yaxınlıq olmur.",
    "Omonimlərin mənaları arasında yaxınlıq olur.",
    "Sözün həqiqi və məcazi mənaları arasında heç bir bağlılıq olmur.",
    "Eyni kökdən şəkilçi ilə əmələ gələn əksmənalı sözlər (insaflı – insafsız) antonim hesab olunur.",
    "Frazeoloji birləşmənin tərkibindəki sözlər həmişə öz həqiqi mənasını saxlayır.",
    "Frazeoloji birləşmələrin sinonimi və antonimi olmur.",
    "Bütün sinonimlər cümlədə bir-birini əvəz edə bilir.",
    "Dairə sözü omonimdir.",
    "Termin yalnız ədəbi əsərlərdə işlənən sözdür.",
    "Omonimlər lüğətdə bir maddədə 1., 2. kimi nömrələnir.",
    "Frazeoloji birləşmələrin çoxunu bir sözlə əvəz etmək olmaz.",
  ];

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "hm", ad: "Həqiqi və məcazi məna", izah: "Sözün ilkin mənası həqiqi, sonradan yaranan mənası məcazi mənadır. Hər ifadədə sözün əvvəlcə ilkin mənasını düşün.",
      gen() {
        for (;;) {
          const t = R(2) ? "M" : "H", es = sample(HM, 5).map(e => hmItem(e, R(2) ? "M" : "H"));
          const duz = es.map((x, i) => x.t === t ? i : -1).filter(i => i >= 0);
          if (duz.length < 1 || duz.length > 3) continue;
          return { text: "Sözün " + TN[t] + " mənada işləndiyi ifadələrin hamısına toxun.", sec: { soz: es.map(x => x.p), duz }, show: duz.map(i => es[i].p).join(", "),
            solution: es.map(x => x.p + " — " + TN[x.t] + " (" + x.why + ")").join("; ") + "." };
        }
      } },
    { id: "kontekst", ad: "Sözün mənası kontekstdə", izah: "Çoxmənalı sözün hansı mənada işləndiyini cümlə göstərir. Əvvəl cümləni oxu, sonra izahı seç.",
      gen() {
        const e = pick(KON), x = pick(e.ex), opts = shuffle([...e.izah, ...sample(FILL, 4 - e.izah.length)]);
        return { text: h("span", {}, "Cümlədə fərqləndirilmiş «" + wordOf(x[0]) + "» sözü hansı mənada işlənmişdir?", line(mark(x[0]))), choices: opts, correct: opts.indexOf(e.izah[x[1]]), show: e.izah[x[1]],
          solution: "“" + e.w + "” çoxmənalı sözdür. Bu cümlədə mənası: " + e.izah[x[1]] + "." };
      } },
    { id: "omonim", ad: "Omonim, yoxsa çoxmənalı", izah: "Mənaları arasında yaxınlıq varsa — çoxmənalı söz; yaxınlıq yoxdursa — omonim. Üçüncü qrup bu cümlələrdə heç kəsə aid deyil.",
      gen() {
        const no = 1 + R(3), pool = [...sample(OM.filter(x => x.tip === "omonim"), no), ...sample(OM.filter(x => x.tip === "coxm"), 6 - no)];
        const es = shuffle(pool), qrup = ["omonim", "çoxmənalı söz", "frazeoloji birləşmə"];
        return { text: "Hər sözü qrupuna ayır.", bol: { soz: es.map(e => e.w + ": " + pairTxt(e)), qrup, duz: es.map(e => e.tip === "omonim" ? 0 : 1) },
          show: es.map(e => e.w + " — " + TIPAD[e.tip]).join("; "),
          solution: es.map(e => e.w + " (" + e.a.join(" – ") + ") — " + TIPAD[e.tip] + (e.tip === "omonim" ? ": mənalar arasında yaxınlıq yoxdur" : ": mənalar arasında yaxınlıq var")).join("; ") + "." };
      } },
    { id: "sinonim", ad: "Sinonim", izah: "Sinonimlər mənaca yaxın sözlərdir. Tərs mənalı və ya heç bağlı olmayan sözləri ayır.",
      gen() {
        const g = pick(SIN), w = pick(g.w), right = pick(g.w.filter(x => x !== w));
        const bad = sample(SIN.filter(x => x.tag !== g.tag).flatMap(x => x.w), 3);
        const opts = shuffle([right, ...bad]);
        return { text: "“" + w + "” sözünün sinonimini seç.", choices: opts, correct: opts.indexOf(right), show: right,
          solution: "“" + w + "” və “" + right + "” mənaca yaxındır — sinonimdir. Digər variantlar başqa mənalı sözlərdir." };
      } },
    { id: "antonim", ad: "Antonim", izah: "Antonimlər əks mənalı sözlərdir. Şəkilçi ilə eyni kökdən düzələn əksmənalı söz (duzlu – duzsuz) antonim sayılmır.",
      gen() {
        if (R(2)) {
          const [A, B] = pick(ANT), sw = R(2), S = sw ? B : A, O = sw ? A : B, w = pick(S), right = pick(O);
          const syn = SIN.filter(g => g.w.includes(w)).flatMap(g => g.w.filter(x => x !== w));
          const bad = [...derOf(w), ...sample(syn, 1)];
          const pool = ANT.flatMap(([a, b]) => [...a, ...b]).filter(x => !S.includes(x) && !O.includes(x) && !bad.includes(x) && (!CL[x] || CL[x] !== CL[w]));
          const opts = shuffle([right, ...bad, ...sample(pool, 3 - bad.length)]);
          return { text: "“" + w + "” sözünün antonimini seç.", choices: opts, correct: opts.indexOf(right), show: right,
            solution: "“" + w + "” – “" + right + "” əks mənalı sözlərdir (antonim)." + (derOf(w).length ? " “" + derOf(w)[0] + "” şəkilçi ilə eyni kökdən düzəlib, antonim sayılmır." : "") };
        }
        const [a, b] = pick(antPairs), mk = p => p[0] + " – " + p[1];
        const bad = [...sample(DER, 2), pick(sinPairs)], opts = shuffle([mk([a, b]), ...bad.map(mk)]);
        return { text: "Antonim söz cütünü seç.", choices: opts, correct: opts.indexOf(mk([a, b])), show: mk([a, b]),
          solution: mk([a, b]) + " — əks mənalıdır. " + bad.slice(0, 2).map(mk).join(", ") + " — eyni kökdən şəkilçi ilə düzəlib, antonim deyil; " + mk(bad[2]) + " — mənaca yaxındır (sinonim)." };
      } },
    { id: "frazeo", ad: "Frazeoloji birləşmələr", izah: "Frazeoloji birləşmədə sözlər öz həqiqi mənasından uzaqlaşır, birləşmə bütövlükdə bir leksik məna bildirir. Çoxunu bir sözlə əvəz etmək olur.",
      gen() {
        const v = R(3);
        if (v === 0) {
          const f = pick(FRAZ), opts = shuffle([f[1], ...sample(FRAZ.filter(x => x !== f).map(x => x[1]), 3)]);
          return { text: "“" + f[0] + "” frazeoloji birləşməsinin mənası nədir?", choices: opts, correct: opts.indexOf(f[1]), show: f[1], solution: "“" + f[0] + "” — " + f[1] + ". Bu birləşmə bütövlükdə bir məna bildirir." };
        }
        if (v === 1) {
          const f = pick(SAFE), opts = shuffle([f[0], ...sample(FREE, 3)]);
          return { text: "Hansı ifadə frazeoloji birləşmədir?", choices: opts, correct: opts.indexOf(f[0]), show: f[0],
            solution: "“" + f[0] + "” — frazeoloji birləşmədir (" + f[1] + "). Qalanları sərbəst söz birləşmələridir: hər söz öz mənasındadır." };
        }
        const p = pick(FPAIR), sw = R(2), s1 = sw ? p.b : p.a, s2 = sw ? p.a : p.b, opts = ["yalnız 1-ci cümlədə", "yalnız 2-ci cümlədə", "hər iki cümlədə", "heç birində"];
        return { text: h("span", {}, "“" + p.p + "” ifadəsi hansı cümlədə frazeoloji birləşmə kimi işlənmişdir?", nl("1. ", mark(s1)), nl("2. ", mark(s2))), choices: opts, correct: sw ? 0 : 1, show: opts[sw ? 0 : 1],
          solution: "“" + p.p + "” bir cümlədə həqiqi mənasında işlənib, o birində bütövlükdə yeni mənada — frazeoloji birləşmə kimi." };
      } },
    { id: "termin", ad: "Terminlər", izah: "Termin müəyyən elm sahəsinə, ixtisas və peşəyə aid sözdür. Hər sözü sahəsinə ayır. Bütün sahələr hər cümlədə iştirak etməyə bilər.",
      gen() {
        const sh = sample(Object.keys(TERM), 3), cnt = pick([[2, 2, 2], [3, 2, 1], [1, 2, 3], [2, 3, 1], [3, 1, 2], [1, 3, 2]]);
        const items = shuffle(sh.flatMap((s, i) => sample(TERM[s], cnt[i]).map(w => ({ w, s })))), qrup = shuffle([...Object.keys(TERM)]);
        return { text: "Hər sözü aid olduğu sahənin termini kimi qruplara ayır.", bol: { soz: items.map(x => x.w), qrup, duz: items.map(x => qrup.indexOf(x.s)) },
          show: items.map(x => x.w + " — " + x.s).join("; "), solution: items.map(x => x.w + " — " + x.s + " termini").join("; ") + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird üç söz və ya ifadə haqqında təhlil yazıb. Birində səhv var — hansında?",
      gen() {
        const kinds = [
          () => { const e = pick(HM), t = R(2) ? "M" : "H", x = hmItem(e, t); return { stem: "“" + x.p + "” ifadəsində söz", ok: TN[t] + " mənada işlənib", bad: TN[t === "H" ? "M" : "H"] + " mənada işlənib" }; },
          () => { const e = pick(OM); return { stem: "“" + e.w + "” sözü (" + pairTxt(e) + ")", ok: TIPAD[e.tip], bad: TIPAD[e.tip === "omonim" ? "coxm" : "omonim"] }; },
          () => { const c = pick(["s", "a", "n"]), p = c === "s" ? pick(sinPairs) : c === "a" ? pick(antPairs) : pick([...DER, ...UNREL]);
            const L = { s: "sinonimdir", a: "antonimdir", n: "nə sinonimdir, nə antonim" }; return { stem: "“" + p[0] + " – " + p[1] + "” cütü", ok: L[c], bad: L[pick(["s", "a", "n"].filter(x => x !== c))] }; },
          () => { const f = pick(FRAZ), g = pick(FRAZ.filter(x => x !== f)); return { stem: "“" + f[0] + "” frazeoloji birləşməsi", ok: "“" + f[1] + "” deməkdir", bad: "“" + g[1] + "” deməkdir" }; },
          () => { const t = pick(termList), o = pick(Object.keys(TERM).filter(s => s !== t.s)); return { stem: "“" + t.w + "” sözü", ok: t.s + " termini", bad: o + " termini" }; },
        ];
        const ks = sample(kinds, 3).map(f => f()), k = R(3), ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "Şagirdin təhlili: " + ks.map((x, j) => (j + 1) + ") " + x.stem + " — " + (j === k ? x.bad : x.ok)).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd", solution: ks[k].stem + " — " + ks[k].ok + ", “" + ks[k].bad + "” yox. Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const hmFive = () => sample(HM, 5).map(e => hmItem(e, R(2) ? "M" : "H"));
  const SUP = "¹²³⁴⁵";
  const markN = (s, n) => { const p = s.split("*"); return h("span", {}, p[0], h("u", {}, h("b", {}, p[1])), n, p[2]); };
  const numbered = it => it.map((x, i) => nl((i + 1) + ". ", markN(x.s, SUP[i])));
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. nömrələnmiş ifadələr: həqiqi / məcazi uyğunluğu (BSİ-2, 41-ci sual kimi)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const it = hmFive(), right = it.map((x, i) => x.t === "H" ? i + 1 : 0).filter(Boolean);
      if (right.length < 1 || right.length > 4) return null;
      const fmt = s => s.join(", ") + " – həqiqi; " + [1, 2, 3, 4, 5].filter(i => !s.includes(i)).join(", ") + " – məcazi";
      const o = Oyun.ae(right, sample(SUBS.filter(s => s.join() !== right.join()), 4), fmt); if (!o) return null;
      return { text: h("span", {}, "Üzərində rəqəm yazılmış sözlərlə bağlı uyğunluğu müəyyən edin.", ...numbered(it)), ...o, show: o.choices[o.correct],
        solution: it.map((x, i) => (i + 1) + ") " + wordOf(x.s) + " — " + TN[x.t] + " (" + x.why + ")").join("; ") + "." };
    }) },
    // 2. hansı cümlələrdə məcazi (həqiqi) mənada
    { tip: "qapali", gen: () => Oyun.again(() => {
      const it = hmFive(), t = R(2) ? "M" : "H", right = it.map((x, i) => x.t === t ? i + 1 : 0).filter(Boolean);
      if (right.length < 1 || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz " + TN[t] + " mənada işlənmişdir?", ...numbered(it)), ...o, show: o.choices[o.correct],
        solution: it.map((x, i) => (i + 1) + ") " + wordOf(x.s) + " — " + TN[x.t] + " (" + x.why + ")").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 3. cümlələrin birində söz fərqli mənada
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = R(2) ? "M" : "H", o = t === "M" ? "H" : "M", es = sample(HM, 5), odd = hmItem(es[0], t), four = es.slice(1).map(e => hmItem(e, o));
      return AEq("Cümlələrin birində fərqləndirilmiş söz " + TN[t] + " mənada işlənmişdir:", guil(odd.s), four.map(x => guil(x.s)),
        "“" + wordOf(odd.s) + "” — " + TN[t] + " (" + odd.why + "). Qalan cümlələrdə söz " + TN[o] + " mənadadır: " + four.map(x => wordOf(x.s) + " — " + x.why).join("; ") + ".");
    }) },
    // 4. omonim cütü (qalanları çoxmənalı)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const odd = pick(OM.filter(x => x.tip === "omonim")), four = sample(OM.filter(x => x.tip === "coxm"), 4);
      return AEq("Cütlərin birində fərqləndirilmiş söz omonimdir, qalanlarında çoxmənalı sözdür. Omonimi müəyyən edin.", pairTxt(odd), four.map(pairTxt),
        "“" + odd.w + "” — omonim: mənalar (" + odd.a.join(" – ") + ") arasında yaxınlıq yoxdur. Qalanları çoxmənalı sözlərdir: " + four.map(e => e.w).join(", ") + " — mənaları arasında yaxınlıq var.");
    }) },
    // 5. çoxmənalı söz cütü (qalanları omonim)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const odd = pick(OM.filter(x => x.tip === "coxm")), four = OM.filter(x => x.tip === "omonim");
      return AEq("Cütlərin birində fərqləndirilmiş söz çoxmənalıdır, qalanlarında omonimdir. Çoxmənalı sözü müəyyən edin.", pairTxt(odd), four.map(pairTxt),
        "“" + odd.w + "” — çoxmənalı söz: mənalar (" + odd.a.join(" – ") + ") arasında yaxınlıq var. Qalanları omonimdir: " + four.map(e => e.w).join(", ") + " — mənaları arasında yaxınlıq yoxdur.");
    }) },
    // 6. sinonim
    { tip: "qapali", gen: () => Oyun.again(() => {
      const g = pick(SIN), w = pick(g.w), right = pick(g.w.filter(x => x !== w)), bad = sample(SIN.filter(x => x.tag !== g.tag).flatMap(x => x.w), 4);
      return AEq("“" + w + "” sözünün sinonimini müəyyən edin.", right, bad, "“" + w + "” və “" + right + "” mənaca yaxın sözlərdir — sinonimdir. Digər sözlər başqa mənalıdır.");
    }) },
    // 7. antonim cütü
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [a, b] = pick(antPairs), mk = p => p[0] + " – " + p[1], bad = [...sample(DER, 3), pick(sinPairs)];
      return AEq("Aşağıdakı söz cütlərindən hansı antonimdir?", mk([a, b]), bad.map(mk),
        mk([a, b]) + " — əks mənalıdır. " + bad.slice(0, 3).map(mk).join(", ") + " — eyni kökdən şəkilçi ilə düzəlib, antonim sayılmır; " + mk(bad[3]) + " — sinonimdir.");
    }) },
    // 8. frazeoloji birləşmə
    { tip: "qapali", gen: () => Oyun.again(() => {
      const f = pick(SAFE), g = pick(FRAZ);
      if (R(2)) return AEq("“" + g[0] + "” frazeoloji birləşməsinin mənasını müəyyən edin.", g[1], sample(FRAZ.filter(x => x !== g).map(x => x[1]), 4), "“" + g[0] + "” — " + g[1] + ". Frazeoloji birləşmə bütövlükdə bir leksik məna bildirir.");
      return AEq("Hansı ifadə frazeoloji birləşmədir?", f[0], sample(FREE, 4), "“" + f[0] + "” — frazeoloji birləşmədir (" + f[1] + "). Qalanları sərbəst söz birləşmələridir: hər söz öz həqiqi mənasındadır.");
    }) },
    // 9. terminlər (nömrə kombinasiyası)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const sa = pick(Object.keys(TERM)), k = 1 + R(3);
      const own = sample(TERM[sa], k).map(w => ({ w, s: sa })), other = sample(termList.filter(x => x.s !== sa), 5 - k), five = shuffle([...own, ...other]);
      const right = five.map((x, i) => x.s === sa ? i + 1 : 0).filter(Boolean), o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansılar " + sa + " termini hesab olunur?", line(five.map((x, i) => (i + 1) + ". " + x.w).join("   "))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + x.s + " termini").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 10. leksikaya aid fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (R(2)) { const bad = pick(FIKIR_SEHV); return AEq("Leksika ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Leksika ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: hər fakt müstəqil sual kimi ========
  const Y = []; let yn = 0;
  const y = (sual, cavab) => Y.push({ id: "y" + (++yn), sual, cavab });
  HMI.forEach(x => {
    y("Cümlə: " + guil(x.s) + " — «" + wordOf(x.s) + "» sözü bu cümlədə həqiqi, yoxsa məcazi mənada işlənib? (həqiqi, məcazi)", TN[x.t]);
    y("“" + x.p + "” ifadəsi həqiqi, yoxsa məcazi mənada işlənib? (həqiqi, məcazi)", TN[x.t]);
  });
  KON.forEach(e => e.ex.forEach(x => y("Cümlə: " + guil(x[0]) + " — «" + wordOf(x[0]) + "» sözü bu cümlədə hansı mənadadır? Variantlar: " + e.izah.map((z, i) => (i + 1) + ") " + z).join("; ") + ".", e.izah[x[1]])));
  OM.forEach(e => y("“" + e.w + "” sözünün" + (e.w === "üz" ? " (isim kimi)" : "") + " mənaları: " + e.a.map((z, i) => (i + 1) + ") " + z).join("; ") + ". Bu söz omonimdir, yoxsa çoxmənalı sözdür? (omonim, çoxmənalı söz)", TIPAD[e.tip]));
  sinPairs.forEach(p => y("“" + p[0] + "” və “" + p[1] + "” sözləri sinonimdir, antonimdir, yoxsa nə sinonimdir, nə antonim? (sinonim, antonim, nə biri)", "sinonim"));
  antPairs.forEach(p => y("“" + p[0] + "” və “" + p[1] + "” sözləri sinonimdir, antonimdir, yoxsa nə sinonimdir, nə antonim? (sinonim, antonim, nə biri)", "antonim"));
  DER.forEach(p => y("“" + p[0] + "” və “" + p[1] + "” sözləri eyni kökdən şəkilçi ilə düzəlib. Bu cüt antonim sayılırmı? (antonim sayılır, antonim sayılmır)", "antonim sayılmır"));
  UNREL.forEach(p => y("“" + p[0] + "” və “" + p[1] + "” sözləri sinonimdir, antonimdir, yoxsa nə sinonimdir, nə antonim? (sinonim, antonim, nə biri)", "nə biri"));
  FRAZ.forEach((f, i) => y("“" + f[0] + "” frazeoloji birləşməsinin mənası hansıdır? Variantlar: " + shuffle([f[1], ...[1, 2, 3].map(k => FRAZ[(i + 4 * k) % FRAZ.length][1])]).map((z, j) => (j + 1) + ") " + z).join("; ") + ".", f[1]));
  SAFE.forEach(f => y("“" + f[0] + "” frazeoloji birləşmədirmi, yoxsa sərbəst söz birləşməsidir? (frazeoloji birləşmə, sərbəst söz birləşməsi)", "frazeoloji birləşmə"));
  FPAIR.forEach(p => { y("Cümlə: " + guil(p.a) + " — “" + p.p + "” ifadəsi bu cümlədə frazeoloji birləşmə kimi, yoxsa həqiqi mənada işlənib? (frazeoloji birləşmə, həqiqi mənada)", "həqiqi mənada");
    y("Cümlə: " + guil(p.b) + " — “" + p.p + "” ifadəsi bu cümlədə frazeoloji birləşmə kimi, yoxsa həqiqi mənada işlənib? (frazeoloji birləşmə, həqiqi mənada)", "frazeoloji birləşmə"); });
  termList.forEach(x => y("“" + x.w + "” sözü hansı sahənin terminidir? (tibb, coğrafiya, hüquq, riyaziyyat)", x.s));
  FIKIR_DUZ.forEach(f => y("Fikir doğrudurmu: “" + f + "” (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => y("Fikir doğrudurmu: “" + f + "” (doğru, səhv)", "səhv"));
  window.__yoxla = Y;

  window.__levels = levels;
  window.__bank = { HM, KON, OM, SIN, ANT, DER, FRAZ, FREE, FPAIR, TERM, FIKIR_DUZ, FIKIR_SEHV };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-leksika", title: "Leksika: məna, omonim, sinonim, antonim, frazeologizm", fenn: "azdili", link: "dersler/az-leksika.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər sözü cümlədəki mənasına görə müəyyən et.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hm", "hm", "kontekst", "omonim", "omonim", "sinonim", "antonim", "frazeo", "termin", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-leksika.html")) b.push("dersler/az-leksika.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
