// Azərbaycan dili · Feil III: qrammatik məna növləri — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: hərəkətin subyekti və obyekti — "Azərbaycan dili" 6-cı sinif, 2-ci hissə (2025), s. 28 "Dil qaydaları" və s. 35 "Yadda saxla".
// DİKKƏT: məlum, məchul, şəxssiz, qayıdış, qarşılıq-birgəlik və icbar növlərinin qaydası 5–9-cu sinif dərsliklərində TAPILMADI
// (səhifələr gözlə və OCR ilə yoxlanıb). Bu növlər proqramın terminləri və ən birmənalı nümunələrlə verilir — bax menbe/az-feil-3.md.
// Bankdakı hər feil kontekstdə birmənalıdır: eyni şəkilçili (-ıl⁴, -ın⁴, -ış⁴, -dır⁴) mübahisəli feillər (hazırlandı, bəzəndi, danışdı,
// başladı, vuruldu, açıldı …) və xəbərlik -dır⁴ qəsdən bankda yoxdur. Kontekstsiz tək feillər (WORDS) yalnız birmənalı feillərdir:
// yazıldı, tikildi, çəkildi, durulur, darandı kimi kontekstdən asılı feillər yalnız cümlədə (SENT) verilir.
(function () {
  const h = Oyun.h;
  const NOV = { M: "məlum", C: "məchul", S: "şəxssiz", Q: "qayıdış", B: "qarşılıq-birgəlik", I: "icbar" };
  const TYPES = Object.keys(NOV), NOVS = TYPES.map(t => NOV[t]);
  const SECIM = "(məlum, məchul, şəxssiz, qayıdış, qarşılıq-birgəlik, icbar)";
  const WHY = {
    M: "feildə növ şəkilçisi yoxdur, icraçı bəllidir və hərəkəti özü edir",
    C: "hərəkət obyektin üzərində icra olunur, obyekt mübtəda olur, icraçı bildirilmir (-ıl⁴, -ın⁴, -n)",
    S: "icraçı ümumidir, cümlədə mübtəda yoxdur, feil təsirsizdir (-ıl⁴, -ın⁴)",
    Q: "hərəkət icraçının özünə qayıdır (-ın⁴, -n)",
    B: "hərəkət bir neçə icraçı arasında qarşılıqlı və ya birgə icra olunur (-ış⁴, -ş)",
    I: "icraçı hərəkəti özü yox, başqasına etdirir (-dır⁴, -t)",
  };
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const cap = s => s[0].toUpperCase() + s.slice(1);

  // ---- hərəkətin subyekti və obyekti (6-cı sinif, 2-ci hissə, s. 28, 35): [cümlə, subyekt, obyekt, feil]
  const SO = [
    ["Nigar məktub yazdı.", "Nigar", "məktub", "yazdı"],
    ["Usta evi tikdi.", "Usta", "evi", "tikdi"],
    ["Rəssam şəkil çəkdi.", "Rəssam", "şəkil", "çəkdi"],
    ["Atam bağda ağac əkdi.", "Atam", "ağac", "əkdi"],
    ["Aynur dərsi oxudu.", "Aynur", "dərsi", "oxudu"],
    ["Qardaşım qabı yudu.", "Qardaşım", "qabı", "yudu"],
    ["Gülnar kitab oxuyur.", "Gülnar", "kitab", "oxuyur"],
    ["Nənəm nağıl danışır.", "Nənəm", "nağıl", "danışır"],
    ["Kombayn taxıl biçir.", "Kombayn", "taxıl", "biçir"],
    ["Biz xalça toxuyuruq.", "Biz", "xalça", "toxuyuruq"],
    ["Müəllim pəncərəni açdı.", "Müəllim", "pəncərəni", "açdı"],
  ].map(([s, sub, obj, v]) => ({ s, sub, obj, v }));

  // ---- cümlə bankı: [növ, cümlə, feil, kök-şəkilçi bölgüsü]; feil cümlədə bir dəfə işlənir
  const SENT_RAW = [
    // məlum: dərslikdəki subyekt–obyekt cümlələri (danışır istisna) + keçidsiz feil
    ["M", "Nigar məktub yazdı.", "yazdı", "yaz-dı"], ["M", "Usta evi tikdi.", "tikdi", "tik-di"], ["M", "Rəssam şəkil çəkdi.", "çəkdi", "çək-di"],
    ["M", "Atam bağda ağac əkdi.", "əkdi", "ək-di"], ["M", "Aynur dərsi oxudu.", "oxudu", "oxu-du"], ["M", "Qardaşım qabı yudu.", "yudu", "yu-du"],
    ["M", "Gülnar kitab oxuyur.", "oxuyur", "oxu-y-ur"], ["M", "Kombayn taxıl biçir.", "biçir", "biç-ir"], ["M", "Biz xalça toxuyuruq.", "toxuyuruq", "toxu-y-uruq"],
    ["M", "Müəllim pəncərəni açdı.", "açdı", "aç-dı"], ["M", "Qonaqlar axşam gəldilər.", "gəldilər", "gəl-di-lər"],
    // məchul
    ["C", "Dünən məktub yazıldı.", "yazıldı", "yaz-ıl-dı"], ["C", "Bağda ağaclar əkildi.", "əkildi", "ək-il-di"], ["C", "Şəhərdə yeni körpü tikildi.", "tikildi", "tik-il-di"],
    ["C", "Divara şəkil çəkildi.", "çəkildi", "çək-il-di"], ["C", "Yeni şeir ucadan oxundu.", "oxundu", "oxu-n-du"], ["C", "Qab təmiz yuyuldu.", "yuyuldu", "yu-y-ul-du"],
    ["C", "Bayramda qonaqlar mehribanlıqla qarşılandı.", "qarşılandı", "qarşıla-n-dı"], ["C", "Poçtla məktub göndərildi.", "göndərildi", "göndər-il-di"],
    ["C", "İtmiş çanta tapıldı.", "tapıldı", "tap-ıl-dı"], ["C", "Sənədlər dünən imzalandı.", "imzalandı", "imzala-n-dı"], ["C", "Oğru tutuldu.", "tutuldu", "tut-ul-du"],
    // şəxssiz (obyekt tələb etməyən feildən)
    ["S", "Səhər tezdən durulur.", "durulur", "dur-ul-ur"], ["S", "Bu otaqda yatılır.", "yatılır", "yat-ıl-ır"], ["S", "Oraya piyada gedilir.", "gedilir", "ged-il-ir"],
    ["S", "Yayda kəndə hər həftə gəlinir.", "gəlinir", "gəl-in-ir"], ["S", "Axşam evə qayıdıldı.", "qayıdıldı", "qayıd-ıl-dı"], ["S", "Bağda oturulur.", "oturulur", "otur-ul-ur"],
    ["S", "Səhər tezdən yola çıxıldı.", "çıxıldı", "çıx-ıl-dı"],
    // qayıdış
    ["Q", "Uşaq tələsik geyindi.", "geyindi", "gey-in-di"], ["Q", "Nigar güzgü qarşısında darandı.", "darandı", "dara-n-dı"], ["Q", "Bəxtiyar soyuq suyla yuyundu.", "yuyundu", "yu-y-un-du"],
    ["Q", "Oğlan tələsik soyundu.", "soyundu", "soy-un-du"], ["Q", "Aynur səhər tez yuyunur.", "yuyunur", "yu-y-un-ur"],
    // qarşılıq-birgəlik
    ["B", "Dostlar küçədə görüşdülər.", "görüşdülər", "gör-üş-dü-lər"], ["B", "İki qardaş sevinclə qucaqlaşdılar.", "qucaqlaşdılar", "qucaqla-ş-dı-lar"],
    ["B", "Qonşular bayram günü öpüşdülər.", "öpüşdülər", "öp-üş-dü-lər"], ["B", "Pəhləvanlar meydanda vuruşdular.", "vuruşdular", "vur-uş-du-lar"],
    ["B", "İki şair illərlə yazışdılar.", "yazışdılar", "yaz-ış-dı-lar"], ["B", "Qonşular küçədə salamlaşdılar.", "salamlaşdılar", "salamla-ş-dı-lar"],
    // icbar
    ["I", "Atam bağda ağac əkdirdi.", "əkdirdi", "ək-dir-di"], ["I", "Müəllim şagirdə şeir oxutdu.", "oxutdu", "oxu-t-du"], ["I", "Anam xalça toxutdu.", "toxutdu", "toxu-t-du"],
    ["I", "Sahibkar şəhərdə ev tikdirdi.", "tikdirdi", "tik-dir-di"], ["I", "Atam maşını yudurdu.", "yudurdu", "yu-dur-du"], ["I", "Rəhbər məktubu yazdırdı.", "yazdırdı", "yaz-dır-dı"],
    ["I", "Nənəm rəssama portret çəkdirdi.", "çəkdirdi", "çək-dir-di"], ["I", "Atam divarları boyatdı.", "boyatdı", "boya-t-dı"],
  ];
  const tokens = s => s.match(/[\p{L}]+|[^\s\p{L}]/gu);
  const SENT = SENT_RAW.map(([t, s, v, m]) => ({ t, s, v, m }));
  SENT.forEach(x => { if (tokens(x.s).filter(w => w === x.v).length !== 1) throw new Error("feil cümlədə bir dəfə deyil: " + x.s); });
  const byT = {}; TYPES.forEach(t => { byT[t] = SENT.filter(x => x.t === t); });
  const markVerb = (s, v) => { const pre = s.slice(0, s.indexOf(v)), post = s.slice(s.indexOf(v) + v.length); return h("span", {}, pre, h("u", {}, h("b", {}, v)), post); };
  const markWord = (s, w) => { const k = s.indexOf(w); return h("span", {}, s.slice(0, k), h("u", {}, h("b", {}, w)), s.slice(k + w.length)); };
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const solS = x => "“" + x.v + "” (" + x.m + ") — " + NOV[x.t] + " növ: " + WHY[x.t] + ".";

  // ---- tək feillər (kontekstsiz də növü birmənalıdır)
  const WORDS = {
    M: ["yazdı", "tikdi", "çəkdi", "əkdi", "oxudu", "yudu", "gördü", "açdı", "daradı", "qucaqladı", "öpdü", "gəldi", "getdi", "oxuyur", "yazır"],
    C: ["əkildi", "yuyuldu", "tapıldı", "göndərildi", "qarşılandı", "imzalandı", "öpüldü"],
    S: ["yatılır", "gedilir", "gəlinir", "qayıdıldı", "oturulur", "çıxıldı"],
    Q: ["geyindi", "yuyundu", "soyundu", "geyinir", "soyunur", "yuyunur"],
    B: ["görüşdülər", "öpüşdülər", "vuruşdular", "qucaqlaşdılar", "yazışdılar", "salamlaşdılar"],
    I: ["yazdırdı", "tikdirdi", "əkdirdi", "çəkdirdi", "oxutdu", "toxutdu", "yudurdu", "boyatdı"],
  };
  const ALLW = TYPES.flatMap(t => WORDS[t].map(w => ({ w, t })));
  const typeOfWord = w => ALLW.find(x => x.w === w).t;
  // eyni kökdən düzələn feillər
  const FAM = [
    ["yaz-", { M: "yazdı", I: "yazdırdı", B: "yazışdılar" }],
    ["yu-", { M: "yudu", C: "yuyuldu", Q: "yuyundu", I: "yudurdu" }],
    ["tik-", { M: "tikdi", I: "tikdirdi" }],
    ["ək-", { M: "əkdi", C: "əkildi", I: "əkdirdi" }],
    ["oxu-", { M: "oxudu", I: "oxutdu" }],
    ["çək-", { M: "çəkdi", I: "çəkdirdi" }],
    ["gör-", { M: "gördü", B: "görüşdülər" }],
    ["öp-", { M: "öpdü", C: "öpüldü", B: "öpüşdülər" }],
  ];
  FAM.forEach(([k, o]) => Object.entries(o).forEach(([t, w]) => { if (typeOfWord(w) !== t) throw new Error("ailə növü uyğun deyil: " + w); }));

  // ---- növlərin təsviri (dərsdəki qayda sözləri)
  const DESC = {
    M: ["Hərəkətin icraçısı bəllidir və hərəkəti özü yerinə yetirir; feildə növ şəkilçisi olmur.", "Feildə növ şəkilçisi yoxdur, icraçı hərəkəti özü yerinə yetirir.", "Mübtəda hərəkəti özü icra edir və feildə növ şəkilçisi yoxdur.", "Hərəkəti bəlli icraçı yerinə yetirir, feil heç bir növ şəkilçisi qəbul etməyib."],
    C: ["Hərəkət obyektin üzərində icra olunur, obyekt mübtəda olur, icraçı bildirilmir.", "Cümlənin mübtədası hərəkəti icra etmir, hərəkət onun üzərində aparılır, icraçı bildirilmir.", "Mübtəda hərəkətin obyektidir, icraçı isə cümlədə göstərilmir.", "Təsirli feildən düzəlir: mübtəda hərəkətin icra olunduğu varlığı bildirir, icraçı bildirilmir."],
    S: ["Hərəkətin icraçısı qrammatik cəhətdən göstərilmir, cümlədə mübtəda yoxdur; feil yalnız III şəxsin təkində işlənir.", "Cümlədə mübtəda olmur, icraçı ümumidir (hamı, hər kəs).", "Hərəkət heç bir konkret şəxsə aid deyil, cümlədə mübtəda yoxdur, feil III şəxsin təkində işlənir.", "Hər kəs üçün ümumi hərəkət bildirir; cümlədə mübtəda olmur, kim? sualı verilmir."],
    Q: ["Hərəkət icraçının özünə qayıdır: icraçı həm işi görür, həm də onun obyektidir.", "İcraçı işi öz üzərində icra edir.", "Subyekt və obyekt eyni şəxsdir.", "İcraçı hərəkəti özünə yönəldir."],
    B: ["Hərəkət iki və ya daha çox icraçı arasında qarşılıqlı icra olunur.", "Bir neçə icraçı hərəkəti birlikdə yerinə yetirir və feildə -ış⁴ şəkilçisi olur.", "İki və ya daha çox icraçının bir-birinə qarşı və ya birlikdə gördüyü iş.", "İcraçılar bir-birinə qarşı eyni hərəkəti edirlər."],
    I: ["İcraçı hərəkəti özü yox, başqasına etdirir.", "Hərəkəti başqası görür, icraçı isə ona bunu etdirir.", "Hərəkəti icra edən başqasıdır, onu yönəldən isə cümlənin subyektidir.", "İcraçı başqasına hərəkəti yerinə yetirtdirir."],
  };

  // ---- A–E üçün nömrə kombinasiyası
  const SUP = "¹²³⁴⁵⁶⁷";
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "subyekt", ad: "Subyekt və obyekt", izah: "Məlum növlü cümlədə hərəkətin icraçısı subyekt (mübtəda), hərəkətin yönəldiyi varlıq obyektdir (tamamlıq). Soruşulan sözə toxun.",
      gen() {
        const x = pick(SO), askSub = R(2) === 0, soz = tokens(x.s), w = askSub ? x.sub : x.obj;
        return { text: askSub ? "Hərəkətin icraçısını (subyekti) bildirən sözə toxun." : "Hərəkətin obyektini bildirən sözə toxun.", sec: { soz, duz: [soz.indexOf(w)] }, show: w,
          solution: "«" + x.s + "» — " + x.sub + ": hərəkətin icraçısı (subyekt, mübtəda); " + x.obj + ": hərəkətin obyekti (tamamlıq); " + x.v + ": hərəkət." };
      } },
    { id: "nov", ad: "Feilin növünü müəyyən et", izah: "Əvvəl feildə növ şəkilçisi var, yoxsa yox? Sonra bax: icraçı işi özü görür, özünə, başqasına etdirir; hərəkət mübtədanın üzərindədir; yoxsa mübtəda yoxdur və icraçı ümumidir?",
      gen() {
        const t = pick(TYPES), x = pick(byT[t]);
        return { text: h("span", {}, "Fərqləndirilmiş feil hansı qrammatik məna növündədir?", line(markVerb(x.s, x.v))), choices: NOVS.slice(), correct: TYPES.indexOf(t), show: NOV[t], solution: solS(x) };
      } },
    { id: "tarif", ad: "Növü təsvirinə görə tap", izah: "Hər növün öz mənası var: icraçı kimdir, hərəkət kimin üzərindədir? Təsvirə uyğun növü seç.",
      gen() {
        const t = pick(TYPES), d = pick(DESC[t]);
        return { text: "«" + d + "» — bu təsvir feilin hansı qrammatik məna növünə aiddir?", choices: NOVS.slice(), correct: TYPES.indexOf(t), show: NOV[t],
          solution: cap(NOV[t]) + " növ: " + WHY[t] + "." };
      } },
    { id: "ail", ad: "Eyni kökdən — fərqli növ", izah: "Kök eynidir, şəkilçi fərqlidir. Şəkilçiyə və mənaya görə hər feilin növünü seç.",
      gen() {
        const [k, o] = pick(FAM), have = Object.keys(o), extra = sample(TYPES.filter(t => !have.includes(t)), 1 + R(2));
        const tags = TYPES.filter(t => have.includes(t) || extra.includes(t)), ws = shuffle(have);
        return { text: "«" + k + "» kökündən düzələn feilləri növlərinə ayır.", bol: { soz: ws.map(t => o[t]), qrup: tags.map(t => NOV[t]), duz: ws.map(t => tags.indexOf(t)) },
          show: ws.map(t => o[t] + " — " + NOV[t]).join("; "), solution: ws.map(t => o[t] + " — " + NOV[t]).join("; ") + "." };
      } },
    { id: "metn", ad: "Mətndə feilə toxun", izah: "Üç cümlədə üç müxtəlif növdə feil var. Soruşulan növdəki feilə toxun.",
      gen() {
        const ts = sample(TYPES, 3), ss = ts.map(t => pick(byT[t])), X = pick(ts);
        const soz = ss.flatMap(x => tokens(x.s)), starts = []; let pos = 0; ss.forEach(x => { starts.push(pos); pos += tokens(x.s).length; });
        const idx = ss.findIndex(x => x.t === X), i = starts[idx] + tokens(ss[idx].s).indexOf(ss[idx].v);
        return { text: "Mətndə " + NOV[X] + " növdə olan feilə toxun.", sec: { soz, duz: [i] }, show: ss[idx].v, solution: ss.map(solS).join(" ") };
      } },
    { id: "cumle", ad: "Hansı cümlədə?", izah: "Hər cümlədəki feilin növünü ayrıca müəyyən et, sonra soruşulan növü seç.",
      gen() {
        const X = pick(TYPES), others = sample(TYPES.filter(t => t !== X), 3), opts = shuffle([pick(byT[X]), ...others.map(t => pick(byT[t]))]);
        return { text: "Hansı cümlədə feil " + NOV[X] + " növdədir?", choices: opts.map(x => x.s), correct: opts.findIndex(x => x.t === X), show: opts.find(x => x.t === X).s,
          solution: opts.map(x => "«" + x.s + "» — “" + x.v + "”: " + NOV[x.t]).join("; ") + "." };
      } },
    { id: "soz", ad: "Hansı feil?", izah: "Feilin kökünü və şəkilçisini ayır, sonra növü müəyyən et.",
      gen() {
        const X = pick(TYPES), others = sample(TYPES.filter(t => t !== X), 3), opts = shuffle([X, ...others].map(t => pick(WORDS[t])));
        return { text: "Hansı feil " + NOV[X] + " növdədir?", choices: opts, correct: opts.findIndex(w => typeOfWord(w) === X), show: opts.find(w => typeOfWord(w) === X),
          solution: opts.map(w => w + " — " + NOV[typeOfWord(w)]).join("; ") + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird üç cümlədə feilin növünü yazıb. Biri səhvdir — hansı?",
      gen() {
        const CONF = { M: "I", C: "S", S: "C", Q: "B", B: "Q", I: "M" };
        const xs = sample(SENT, 3), k = R(3), lab = xs.map((x, j) => j === k ? CONF[x.t] : x.t), ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "Şagirdin təhlili: " + xs.map((x, j) => (j + 1) + ") «" + x.s + "» — “" + x.v + "” " + NOV[lab[j]] + " növdədir").join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "“" + xs[k].v + "” " + NOV[lab[k]] + " deyil, " + NOV[xs[k].t] + " növdədir: " + WHY[xs[k].t] + ". Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const FIKIR_DUZ = [
    "Məlum növdə hərəkətin icraçısı bəlli olur və hərəkəti özü yerinə yetirir.",
    "Məlum növün xüsusi şəkilçisi yoxdur.",
    "Məchul növdə hərəkət obyektin üzərində icra olunur.",
    "Məchul növdə hərəkətin icraçısı bildirilmir.",
    "Məchul növün əsas şəkilçiləri -ıl⁴, -ın⁴ və -n-dir.",
    "Məchul növdə mübtəda hərəkətin obyektini bildirir.",
    "Şəxssiz növdə hərəkətin icraçısı ümumidir.",
    "Şəxssiz növdə cümlədə mübtəda olmur.",
    "Şəxssiz növdə feil yalnız III şəxsin təkində işlənir.",
    "Qayıdış növdə hərəkət icraçının özünə qayıdır.",
    "Qayıdış növün əsas şəkilçiləri -ın⁴ və -n-dir.",
    "Qarşılıq-birgəlik növ adətən -ış⁴ (saitdən sonra -ş) şəkilçisi ilə düzəlir.",
    "Qarşılıq-birgəlik növdə hərəkət iki və ya daha çox icraçı arasında icra olunur.",
    "İcbar növdə icraçı hərəkəti başqasına etdirir.",
    "İcbar növün əsas şəkilçiləri -dır⁴ və -t-dir.",
    "Hərəkətin icraçısını bildirən söz subyekt adlanır.",
    "Məlum növlü cümlədə subyekt mübtəda rolunda olur.",
    "Hərəkət obyekt üzərində icra olunur.",
    "Məlum növlü cümlədə obyekti bildirən söz tamamlıq vəzifəsində çıxış edir.",
    "Feilin altı qrammatik məna növü var.",
  ];
  const FIKIR_SEHV = [
    "Məlum növdə feil həmişə -ıl⁴ növ şəkilçisi qəbul edir.",
    "Məchul növdə icraçı hərəkəti başqasına etdirir.",
    "Məchul növdə cümlədə mübtəda olmur.",
    "Qayıdış növün əsas şəkilçiləri -dır⁴ və -t-dir.",
    "İcbar növdə hərəkət icraçının özünə qayıdır.",
    "Qarşılıq-birgəlik növdə hərəkətin icraçısı həmişə bir nəfərdir.",
    "Şəxssiz növdə hərəkətin icraçısı konkret bir şəxsdir.",
    "Məlum növlü cümlədə subyekt tamamlıq rolunda olur.",
    "Obyekt hərəkətin icraçısını bildirir.",
    "Məlum növdə hərəkətin icraçısı bildirilmir.",
    "İcbar növün əsas şəkilçisi -ış⁴-dir.",
    "Qayıdış növün əsas şəkilçisi -ış⁴-dir.",
    "Şəxssiz növdə feil hər üç şəxsdə işlənir.",
    "Feilin qrammatik məna növü onun zamanını bildirir.",
  ];
  // söz haqqında fikirlər: [feil, doğru fikirlər, səhv fikirlər]
  const PROFIL = [
    ["tapıldı", ["məchul növdədir", "hərəkət obyektin üzərində icra olunur", "icraçı bildirilməyib"], ["qayıdış növdədir", "icbar növdədir", "məlum növdədir", "hərəkəti icraçı başqasına etdirir"]],
    ["geyindi", ["qayıdış növdədir", "hərəkət icraçının özünə qayıdır"], ["məchul növdədir", "icbar növdədir", "qarşılıq-birgəlik növdədir", "hərəkəti başqası icra edir"]],
    ["görüşdülər", ["qarşılıq-birgəlik növdədir", "hərəkət iki və ya daha çox icraçı arasında icra olunur"], ["icbar növdədir", "məlum növdədir", "qayıdış növdədir", "hərəkəti icraçı başqasına etdirir"]],
    ["yazdırdı", ["icbar növdədir", "icraçı hərəkəti başqasına etdirir"], ["məlum növdədir", "məchul növdədir", "qayıdış növdədir", "hərəkət icraçının özünə qayıdır"]],
    ["gedilir", ["şəxssiz növdədir", "icraçı ümumidir", "cümlədə mübtəda olmur"], ["məchul növdədir", "qayıdış növdədir", "icbar növdədir", "hərəkət obyektin üzərində icra olunur"]],
    ["yazdı", ["məlum növdədir", "icraçı bəllidir", "növ şəkilçisi yoxdur"], ["məchul növdədir", "icbar növdədir", "qayıdış növdədir", "hərəkət obyektin üzərində icra olunur, icraçı bildirilmir"]],
  ];
  const sentNums = five => five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", x));

  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. hansı cümlədə feil … növdədir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const X = pick(TYPES), good = pick(byT[X]), bad = sample(TYPES.filter(t => t !== X), 4).map(t => pick(byT[t]));
      return AEq("Hansı cümlədə feil " + NOV[X] + " növdədir?", good.s, bad.map(x => x.s), "“" + good.v + "” (" + good.m + ") — " + NOV[X] + ": " + WHY[X] + ". Digər cümlələrdə: " + bad.map(x => "“" + x.v + "” — " + NOV[x.t]).join(", ") + ".");
    }) },
    // 2. feilin növünə görə biri fərqlidir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [a, b] = sample(TYPES, 2), four = sample(WORDS[a], 4), odd = pick(WORDS[b]);
      return AEq("Feilin qrammatik məna növünə görə biri fərqlidir:", odd, four, "“" + odd + "” — " + NOV[b] + " növdədir. Qalan dördü " + NOV[a] + " növdədir: " + four.join(", ") + ".");
    }) },
    // 3. hansı feil … növdədir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const X = pick(TYPES), good = pick(WORDS[X]), bad = sample(ALLW.filter(x => x.t !== X), 4);
      return AEq("Hansı feil " + NOV[X] + " növdədir?", good, bad.map(x => x.w), "“" + good + "” — " + NOV[X] + ". Qalanları: " + bad.map(x => x.w + " — " + NOV[x.t]).join(", ") + ".");
    }) },
    // 4. nömrələnmiş feillər — kombinasiya
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(ALLW, 5), t = pick(TYPES), right = five.map((x, i) => x.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş feillərdən hansıları " + NOV[t] + " növdədir?", sentNums(five.map(x => x.w))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + NOV[x.t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 5. nömrələnmiş cümlələr — kombinasiya
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(SENT, 5), t = pick(TYPES), right = five.map((x, i) => x.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə fərqləndirilmiş feil " + NOV[t] + " növdədir?", sentNums(five.map(x => markVerb(x.s, x.v)))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.v + " — " + NOV[x.t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 6. subyekt/obyekt — kombinasiya
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(SO, 5).map(x => ({ x, o: R(2) === 0 })), askObj = R(2) === 0;
      const right = five.map((y, i) => y.o === askObj ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə altından xətt çəkilmiş söz " + (askObj ? "hərəkətin obyektini" : "hərəkətin icraçısını (subyekti)") + " bildirir?", sentNums(five.map(y => markWord(y.x.s, y.o ? y.x.obj : y.x.sub)))),
        ...o, show: o.choices[o.correct], solution: five.map((y, i) => (i + 1) + ") " + (y.o ? y.x.obj + " — obyekt" : y.x.sub + " — subyekt")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 7. üç feil — düzgün göstərilmiş növlər
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ts = sample(TYPES, 3), ws = ts.map(t => pick(WORDS[t])), fmt = labs => ws.map((w, i) => w + " — " + NOV[labs[i]]).join(", ");
      const rightS = fmt(ts), wrong = new Set();
      for (let n = 0; n < 60 && wrong.size < 4; n++) { const labs = ts.map(t => R(3) ? t : pick(TYPES.filter(u => u !== t))); const s = fmt(labs); if (s !== rightS) wrong.add(s); }
      return AEq("Feillərin növləri düzgün göstərilmiş cərgəni müəyyən edin.", rightS, [...wrong], ws.map((w, i) => w + " — " + NOV[ts[i]]).join("; ") + ".");
    }) },
    // 8. doğru / səhv fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (R(2) === 0) { const bad = pick(FIKIR_SEHV); return AEq("Feilin qrammatik məna növləri ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir doğrudur."); }
      const ok = pick(FIKIR_DUZ); return AEq("Feilin qrammatik məna növləri ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
    // 9. söz haqqında fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [w, duz, sehv] = pick(PROFIL), ok = pick(duz);
      return AEq("“" + w + "” feili ilə bağlı doğru fikri müəyyən edin.", ok, sample(sehv, 4), "“" + w + "”: " + duz.join("; ") + ". Doğru fikir: " + ok + ".");
    }) },
    // 10. eyni kökdən düzələn feillərdən hansı … növdədir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [k, o] = pick(FAM), X = pick(Object.keys(o)), same = Object.entries(o).filter(([t]) => t !== X).map(([, w]) => w);
      const fill = sample(ALLW.filter(x => x.t !== X && !same.includes(x.w)), 4 - same.length).map(x => x.w);
      if (same.length > 4) return null;
      return AEq("Aşağıdakı feillərdən hansı «" + k + "» kökündən düzəlib və " + NOV[X] + " növdədir?", o[X], [...same, ...fill].slice(0, 4), Object.entries(o).map(([t, w]) => w + " — " + NOV[t]).join("; ") + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: bankdakı hər fakt müstəqil sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "s" + (++yn), sual, cavab });
  SENT.forEach(x => addY("«" + x.s + "» cümləsində “" + x.v + "” feili hansı qrammatik məna növündədir? " + SECIM, NOV[x.t]));
  SO.forEach(x => {
    addY("«" + x.s + "» cümləsində hərəkətin icraçısını (subyekti) bildirən söz hansıdır?", x.sub);
    addY("«" + x.s + "» cümləsində hərəkətin obyektini bildirən söz hansıdır?", x.obj);
  });
  ALLW.forEach(x => addY("“" + x.w + "” feili (kontekstsiz, şəkilçisinə və mənasına görə) hansı qrammatik məna növündədir? " + SECIM, NOV[x.t]));
  TYPES.forEach(t => DESC[t].forEach(d => addY("«" + d + "» — bu təsvir feilin hansı qrammatik məna növünə aiddir? " + SECIM, NOV[t])));
  PROFIL.forEach(([w, duz, sehv]) => {
    duz.forEach(f => addY("“" + w + "” feili haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "doğru"));
    sehv.forEach(f => addY("“" + w + "” feili haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "səhv"));
  });
  FIKIR_DUZ.forEach(f => addY("Feilin qrammatik məna növləri (məlum, məchul, şəxssiz, qayıdış, qarşılıq-birgəlik, icbar) və hərəkətin subyekti, obyekti haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => addY("Feilin qrammatik məna növləri (məlum, məchul, şəxssiz, qayıdış, qarşılıq-birgəlik, icbar) və hərəkətin subyekti, obyekti haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "səhv"));
  window.__yoxla = YOX;

  window.__levels = levels;
  window.__bank = { SENT, SO, WORDS, FAM, DESC, FIKIR_DUZ, FIKIR_SEHV, PROFIL, NOV };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-feil-3", title: "Feil III: qrammatik məna növləri", fenn: "azdili", link: "dersler/az-feil-3.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya feilləri növlərinə ayırmaq. Əvvəl feildə növ şəkilçisi var-yoxdur, sonra icraçıya və mübtədaya bax.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["subyekt", "nov", "nov", "tarif", "ail", "metn", "cumle", "soz", "sehv", "cumle"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-feil-3.html")) b.push("dersler/az-feil-3.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
