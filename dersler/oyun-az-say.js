// Azərbaycan dili · Say — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024), s. 41–42 "Say" (miqdar saylarının növləri; sayların söz və rəqəmlə yazılışı),
// s. 55 (az, xeyli — say/zərf), s. 80 (isimləşmə); 6-cı sinif, 2-ci hissə (2025), s. 13 "Saylardan sonra isimlərin təkdə və ya cəmdə olması",
// s. 19 "Numerativ sözlər". Bankdakı hər cümlə, söz və fikir müstəqil yoxlanıb (Codex). Bankda qəsdən olmayanlar:
// cümlədə zərf kimi işlənə bilən "az, çox, xeyli, bir qədər, bir az" sözləri (yalnız ismə aid olduqları cümlələrdə var),
// "neçə" sual sözü, "bir" artikl kimi, 100-dən yuxarı sıra saylarının mürəkkəb halları.
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
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

  // ---- say növləri
  const TIP = { M: "müəyyən miqdar sayı", Q: "qeyri-müəyyən miqdar sayı", K: "kəsr sayı", S: "sıra sayı" };
  const TIPLER = Object.values(TIP).join(", ");
  const TIP_NE = { M: "konkret miqdar bildirir", Q: "dəqiq olmayan miqdar bildirir", K: "tamın hissəsini və ya tam və hissəni bildirir", S: "əşyanın sırasını bildirir" };

  // ---- say sözləri (cümlədən kənarda da birmənalı: az, çox, xeyli, bir qədər, bir az burada yoxdur)
  const WORDS = [
    ...["dörd", "yeddi", "iyirmi iki", "yüz iyirmi", "beş min", "263", "12", "otuz üç", "450"].map(w => ({ w, t: "M" })),
    ...["beş-altı", "10-15", "bir neçə", "onlarla", "minlərcə", "yüzlərlə", "bir-iki", "üç-dörd", "çoxlu", "bir sıra", "milyonlarla", "bir çox"].map(w => ({ w, t: "Q" })),
    ...["beşdə üç", "iki tam onda beş", "üçdə iki", "dörddə bir", "1/4", "5,3", "7/10", "0,37"].map(w => ({ w, t: "K" })),
    ...["onuncu", "beşinci", "12-ci", "doxsan beşinci", "yüz qırx birinci", "3-cü", "iyirmi birinci", "doqquzuncu"].map(w => ({ w, t: "S" })),
  ];

  // ---- cümlə bankı: "söz:T" — T = M, Q, K, S (say növü) ya da + (isimləşmiş say); "_" iki sözdən ibarət vahid; etiketsiz işarə — say deyil
  const PUNCT = /^[.,!?;:]$/;
  const parse = s => s.split(" ").map(t => { const m = t.match(/^(.+):([MQKS+])$/); return m ? { w: m[1].replace(/_/g, " "), t: m[2] } : { w: t.replace(/_/g, " "), t: null }; });
  const plain = s => s.map((x, i) => (i && !PUNCT.test(x.w) ? " " : "") + x.w).join("");
  const SAY = [
    "Kəşfiyyatçılar on:M gün mühasirədə qaldılar .",
    "Arzu çantasından iki:M qələm çıxardı .",
    "Kitabxanada yüz_iyirmi:M kitab var .",
    "Bu lüğətdə beş_min:M sözün izahı verilir .",
    "Məktəbimizdə 450:M şagird oxuyur .",
    "Dərsliyimiz 2:M hissədən ibarətdir .",
    "Sinfimizdə otuz_iki:M şagird var .",
    "Beş-altı:Q uşaq toplaşıb futbol oynayırdı .",
    "Minlərlə:Q igid vətən uğrunda döyüşə getdi .",
    "Teatr salonuna xeyli:Q tamaşaçı toplaşmışdı .",
    "Az:Q adam tapılar ki , bunu bilməsin .",
    "Çayda çoxlu:Q balıq üzürdü .",
    "Salona bir_neçə:Q jurnalist daxil oldu .",
    "Bu qənaətə bir_çox:Q alimlər gəlmişlər .",
    "Bir_sıra:Q məsələlər hələ də həllini tapmayıb .",
    "Çayıma bir_qədər:Q şəkər atdım .",
    "Mağazadan bir_az:Q çörək aldım .",
    "Meydana onlarla:Q insan toplaşmışdı .",
    "Şəhəri yüzlərlə:Q turist gəzdi .",
    "Bir-iki:Q söz deyib çıxdı .",
    "10-15:Q şagird tədbirə gəlmədi .",
    "Milyonlarla:Q insan bu xəbəri gözləyirdi .",
    "Dörd-beş:Q gün gözlədik .",
    "Nərmin dairənin dörddə_birini:K rənglədi .",
    "Səma konfetləri bölüşdürüb üçdə_bir:K hissəsini özünə götürdü .",
    "Çubuğun uzunluğu iki_tam_onda_beş:K metrdir .",
    "Qabın ikidə_biri:K su ilə doludur .",
    "Yolun beşdə_ikisi:K keçildi .",
    "Tortun dörddə_üçünü:K yedik .",
    "Mən ikinci:S mərtəbədə yaşayıram .",
    "Beşinci:S sinfin şagirdləri ekskursiyaya getdilər .",
    "Bu abidələr eramızdan əvvəl VII:S əsrdə mövcud olmuşdur .",
    "Adətən , altıncı:S gün pianino dərslərinə gedirəm .",
    "Oyunun ikinci:S hissəsində komandamız qol vurdu .",
    "Nigar 9-cu:S sinifdə oxuyur .",
    "XX:S əsr texnika əsridir .",
    "Şəhərə üçüncü:S dəfə gəlirəm .",
    "Komandamız yarışda on_birinci:S yeri tutdu .",
  ].map(parse);
  // isimləşmiş saylar (5-ci sinif, 2-ci hissə, s. 80: say hal, mənsubiyyət, cəm şəkilçisi qəbul edir, lakin say olaraq qalır)
  const ISIM = [
    "Aza:+ qane olmayan çoxdan:+ da qalar .",
    "Beşincilər:+ yarışda qalib gəldilər .",
    "Çoxları:+ bu xəbəri səbirsizliklə gözləyirdi .",
    "Üçü:+ evə getdi , ikisi:+ isə məktəbdə qaldı .",
    "Onların dördü:+ yarışa qatıldı .",
    "Birincilər:+ mükafat aldılar .",
    "Sinifdəki şagirdlərin beşi:+ əlaçıdır .",
    "İkincilərə:+ diplom verildi .",
    "Namizədlərin üçü:+ seçilmişdi .",
    "Çoxlarına:+ bu mövzu maraqlı gəldi .",
    "Sinifdəki şagirdlərin altısı:+ nümunəvidir .",
    "Üçüncülər:+ də mükafatlandırıldı .",
  ].map(parse);
  // isimləşmiş sözlər: [söz, cümlə, nitq hissəsi (qalır), izah] — 5-ci sinif, 2-ci hissə, s. 80 (4a, 4b, 4c)
  const KEPT = [
    ["Beşincilər", "Beşincilər yarışda qalib gəldilər.", "say", "sıra sayı, cəm şəkilçisi qəbul edib"],
    ["Çoxları", "Çoxları bu xəbəri səbirsizliklə gözləyirdi.", "say", "çox — qeyri-müəyyən say, mənsubiyyət şəkilçisi qəbul edib"],
    ["Aza", "Aza qane olmayan çoxdan da qalar.", "say", "az — say, yönlük hal şəkilçisi qəbul edib"],
    ["çoxdan", "Aza qane olmayan çoxdan da qalar.", "say", "çox — say, çıxışlıq hal şəkilçisi qəbul edib"],
    ["ikisi", "Üçü evə getdi, ikisi isə məktəbdə qaldı.", "say", "iki — say, mənsubiyyət şəkilçisi qəbul edib"],
    ["dördü", "Onların dördü yarışa qatıldı.", "say", "dörd — say, mənsubiyyət şəkilçisi qəbul edib"],
    ["Qocadan", "Qocadan demək, cavandan əmək.", "sifət", "qoca — sifət, çıxışlıq hal şəkilçisi qəbul edib"],
    ["cavandan", "Qocadan demək, cavandan əmək.", "sifət", "cavan — sifət, çıxışlıq hal şəkilçisi qəbul edib"],
    ["yaxşının", "Pis olmasa, yaxşının qədri bilinməz.", "sifət", "yaxşı — sifət, yiyəlik hal şəkilçisi qəbul edib"],
    ["Toxun", "Toxun acdan xəbəri olmaz.", "sifət", "tox — sifət, yiyəlik hal şəkilçisi qəbul edib"],
    ["acdan", "Toxun acdan xəbəri olmaz.", "sifət", "ac — sifət, çıxışlıq hal şəkilçisi qəbul edib"],
    ["Qaralarla", "Növbəti oyunda sən qaralarla oynayacaqsan.", "sifət", "qara — sifət, cəm şəkilçisi və bitişik yazılan ilə qoşması qəbul edib"],
    ["igidin", "İgidin adını eşit, üzünü görmə.", "sifət", "igid — sifət, yiyəlik hal şəkilçisi qəbul edib"],
    ["cəsurlar", "İkinci mərhələdə cəsurlar müxtəlif sınaqlardan keçdilər.", "sifət", "cəsur — sifət, cəm şəkilçisi qəbul edib"],
    ["Tənbələ", "Tənbələ iş buyur, o sənə nağıl danışsın.", "sifət", "tənbəl — sifət, yönlük hal şəkilçisi qəbul edib"],
  ];

  // ---- ordinal və rəqəm yazılışı
  const ONES = ["", "bir", "iki", "üç", "dörd", "beş", "altı", "yeddi", "səkkiz", "doqquz"];
  const TENS = ["", "on", "iyirmi", "otuz", "qırx", "əlli", "altmış", "yetmiş", "səksən", "doxsan"];
  const nw = n => { const p = [], y = Math.floor(n / 100), t = Math.floor(n % 100 / 10), o = n % 10; if (y) { if (y > 1) p.push(ONES[y]); p.push("yüz"); } if (t) p.push(TENS[t]); if (o) p.push(ONES[o]); return p; };
  const words = n => nw(n).join(" ");
  const ORD = { bir: "birinci", iki: "ikinci", üç: "üçüncü", dörd: "dördüncü", beş: "beşinci", altı: "altıncı", yeddi: "yeddinci", səkkiz: "səkkizinci", doqquz: "doqquzuncu",
    on: "onuncu", iyirmi: "iyirminci", otuz: "otuzuncu", qırx: "qırxıncı", əlli: "əllinci", altmış: "altmışıncı", yetmiş: "yetmişinci", səksən: "səksəninci", doxsan: "doxsanıncı", yüz: "yüzüncü" };
  const ordWord = n => { const p = nw(n); p[p.length - 1] = ORD[p[p.length - 1]]; return p.join(" "); };
  const SUF4 = ["ci", "cı", "cü", "cu"];
  const arabOrd = n => n + "-" + ordWord(n).slice(-2);
  const ORDN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 20, 21, 25, 30, 40, 45, 50, 60, 70, 80, 90, 100];
  const VOW = "aeıioöuüə";
  const roman = n => { let s = ""; for (const [v, r] of [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]) while (n >= v) { s += r; n -= v; } return s; };
  // sözlə sıra sayı: kökün sonuna dörd variantlı şəkilçi; hər sözün özünə yoxlama (yanlış cədvəl olmasın)
  function ordForms(n) {
    const p = nw(n), last = p[p.length - 1], right = ORD[last], stem = right.slice(0, last.length);
    if (stem !== last) throw new Error("ordinal table: " + last);
    const variants = VOW.includes(last.slice(-1)) ? ["nci", "ncı", "ncü", "ncu"] : ["inci", "ıncı", "üncü", "uncu"];
    const base = VOW.includes(last.slice(-1)) ? right.slice(0, -3) : last;
    const pre = p.slice(0, -1).concat(base).join(" ");
    const rightVar = right.slice(base.length);
    if (!variants.includes(rightVar)) throw new Error("ordinal suffix: " + right);
    return { right: ordWord(n), wrong: variants.filter(v => v !== rightVar).map(v => pre + v) };
  }
  ORDN.forEach(ordForms);
  // rəqəmlə yazılmış sıra sayı: düz + səhv variantlar (tam şəkilçi, defissiz, ahəngsiz)
  function arabOpts(n) {
    const ok = arabOrd(n), suf = ok.slice(-2), full = ordWord(n).slice(-4);
    return { ok, wrong: { tam: n + "-" + full, defissiz: n + suf, ahengsiz: n + "-" + pick(SUF4.filter(x => x !== suf)) } };
  }
  const NOUN_N = { sinif: [1, 11], mərtəbə: [1, 20], gün: [1, 30], yer: [1, 10], sıra: [1, 20] };

  // ---- kəsr
  const DEN = { 2: "ikidə", 3: "üçdə", 4: "dörddə", 5: "beşdə", 6: "altıda", 7: "yeddidə", 8: "səkkizdə", 9: "doqquzda", 10: "onda" };
  const flipDa = s => s.endsWith("də") ? s.slice(0, -2) + "da" : s.slice(0, -2) + "də";
  const fracW = (a, b) => DEN[b] + " " + ONES[a];
  function fracWrong(a, b) {
    const w = [ONES[a] + " " + DEN[b], words(b) + " " + ONES[a], flipDa(DEN[b]) + " " + ONES[a], "bir tam " + DEN[b] + " " + ONES[a]];
    if (a >= 2) w.push(DEN[a] + " " + words(b));
    return w;
  }
  function decW(whole, d) { const two = d.length === 2; return (whole ? words(whole) : "sıfır") + " tam " + (two ? "yüzdə " : "onda ") + words(+d); }
  function decWrong(whole, d) {
    const two = d.length === 2, W = whole ? words(whole) : "sıfır", ok = decW(whole, d);
    const w = [W + " tam " + (two ? "onda " : "yüzdə ") + words(+d), W + " tam " + words(+d) + (two ? " yüzdə" : " onda"), words(+d) + " tam " + (two ? "yüzdə " : "onda ") + W, W + " vergül " + words(+d)];
    if (whole) w.push(W + " " + (two ? "yüzdə " : "onda ") + words(+d));
    return w.filter(x => x !== ok);
  }
  const FRAC = []; for (let b = 3; b <= 10; b++) for (let a = 1; a < b; a++) if (a <= 9) FRAC.push([a, b]);
  const DEC = [[1, "2"], [5, "3"], [2, "5"], [0, "4"], [0, "7"], [11, "3"], [0, "25"], [1, "75"], [0, "37"], [1, "63"], [3, "48"], [7, "21"], [0, "81"], [4, "9"], [6, "17"], [2, "36"]];
  const decStr = (w, d) => w + "," + d;

  // ---- sayla işlənən isim (6-cı sinif, 2-ci hissə, s. 13)
  const QT = [ // təkdə
    ...["üç", "beş", "yeddi", "on", "on iki", "iyirmi", "otuz", "yüz", "12", "25"].map(t => ({ t, r: "T", why: "müəyyən miqdar sayından sonra isim təkdə olur" })),
    ...["az", "bir neçə", "xeyli", "beş-altı", "üç-dörd", "10-15", "bir-iki"].map(t => ({ t, r: "T", why: "digər qeyri-müəyyən miqdar saylarından sonra isim təkdə olur" })),
  ];
  const QT_MASS = [{ t: "bir qədər", r: "T", why: "digər qeyri-müəyyən miqdar saylarından sonra isim təkdə olur" }, { t: "bir az", r: "T", why: "digər qeyri-müəyyən miqdar saylarından sonra isim təkdə olur" }];
  const QC = ["bir sıra", "bir çox"].map(t => ({ t, r: "C", why: "«bir sıra» və «bir çox» saylarından sonra isim cəmdə işlənir" }));
  const QB = ["çox", "çoxlu", "yüzlərlə", "minlərcə"].map(t => ({ t, r: "B", why: "«çox, çoxlu, yüzlərlə, minlərcə» saylarından sonra isim həm təkdə, həm cəmdə ola bilər" }));
  const PEOPLE = [["şagird", "şagirdlər"], ["müəllim", "müəllimlər"], ["alim", "alimlər"], ["yazıçı", "yazıçılar"], ["tələbə", "tələbələr"], ["şair", "şairlər"], ["qonaq", "qonaqlar"], ["rəssam", "rəssamlar"], ["jurnalist", "jurnalistlər"]];
  const OBJ = [["kitab", "kitablar"], ["dəftər", "dəftərlər"], ["qələm", "qələmlər"], ["kompüter", "kompüterlər"], ["telefon", "telefonlar"]];
  const PLACE = [["abidə", "abidələr"], ["məktəb", "məktəblər"], ["muzey", "muzeylər"], ["park", "parklar"], ["körpü", "körpülər"], ["kitabxana", "kitabxanalar"]];
  const PROB = [["məsələ", "məsələlər"], ["problem", "problemlər"], ["sual", "suallar"]];
  const ANIM = [["quş", "quşlar"], ["ağac", "ağaclar"], ["uşaq", "uşaqlar"], ["ceyran", "ceyranlar"]];
  const FR = [
    { f: "Tədbirdə {Q} {N} iştirak etdi .", nouns: PEOPLE }, { f: "Mağazadan {Q} {N} aldıq .", nouns: OBJ }, { f: "Şəhərimizdə {Q} {N} var .", nouns: PLACE },
    { f: "Hələ {Q} {N} həll olunmayıb .", nouns: PROB }, { f: "Bağda {Q} {N} gördüm .", nouns: ANIM },
  ];
  const NOUNS = FR.flatMap((f, fi) => f.nouns.map(n => ({ fi, n })));
  // cümlə: söz siyahısı (token) + səhv işlənmiş sözün indeksi
  const tcSent = (fi, n, q, form) => FR[fi].f.split(" ").map(x => x === "{Q}" ? q : x === "{N}" ? n[form === "C" ? 1 : 0] : x);
  const okForm = (q, form) => q.r === "B" || (q.r === "T" && form === "T") || (q.r === "C" && form === "C");
  const FORMNAME = { T: "təkdə", C: "cəmdə", B: "həm təkdə, həm cəmdə" };
  const tcPick = (qs, wantOk) => { // [fi, noun, quant, form] — təsadüfi cümlə, doğru və ya səhv
    const nn = pick(NOUNS), q = pick(qs); let form;
    if (q.r === "B") form = pick(["T", "C"]); else form = wantOk ? (q.r === "T" ? "T" : "C") : (q.r === "T" ? "C" : "T");
    return { fi: nn.fi, n: nn.n, q, form };
  };
  const tcText = x => plain(tcSent(x.fi, x.n, x.q.t, x.form).map(w => ({ w })));
  const tcNote = x => "«" + x.q.t + " " + x.n[x.form === "C" ? 1 : 0] + "» — " + (okForm(x.q, x.form) ? "düzdür" : "səhvdir") + ": " + x.q.why;

  // ---- rəqəmlə yazılan saylara şəkilçi (6-cı sinif, 2-ci hissə, s. 79): [cümlə, sözlə forma, düz, səhvlər, izah]
  const SFX = [
    ["Almaların ___ götürdüm.", "üçünü", "3-nü", ["3-ünü", "3-ni", "3-ü"], "rəqəmlə yazılan sayda mənsubiyyət və hal şəkilçisi qoşulanda mənsubiyyət şəkilçisi ixtisar olunur"],
    ["Martın ___ kimi görüşəcəyik.", "ikisinə", "2-nə", ["2-sinə", "2-ə", "2-yə"], "mənsubiyyət və hal şəkilçisi qoşulanda mənsubiyyət şəkilçisi ixtisar olunur"],
    ["Tədbir ayın ___.", "səkkizindədir", "8-dədir", ["8-indədir", "8-ndədir", "8-də"], "mənsubiyyət və hal şəkilçisi qoşulanda mənsubiyyət şəkilçisi ixtisar olunur"],
    ["Bu gün ayın ___.", "on ikisidir", "12-sidir", ["12-sisidir", "12-dir", "12-ıdır"], "mənsubiyyət və xəbərlik şəkilçiləri qoşulanda hər iki şəkilçi yazılır"],
  ];

  // ---- numerativ sözlər (6-cı sinif, 2-ci hissə, s. 19): [söz, numerativ cümlə, isim cümlə, izah]
  const NUM = [
    ["top", "Bir *top* parçanı dəyər-dəyməzinə satdı.", "İdman mağazasından bir *top* aldıq.", "bir top parça", "oyun alətidir"],
    ["göz", "Kənddə iki *göz* otaqdan ibarət evimiz və bağçamız var idi.", "İki *göz* lazım idi ki, bu gözəlliyə tamaşa etsin.", "iki göz otaq", "görmə orqanıdır"],
    ["qaşıq", "Qoca çayına iki *qaşıq* zoğal mürəbbəsi əlavə edib qarışdırdı.", "Süfrədə iki *qaşıq* çatmırdı.", "iki qaşıq mürəbbə", "süfrə əşyasıdır"],
    ["stəkan", "Mən iki *stəkan* çay içdim.", "Rəfdəki *stəkan* yerə düşüb sındı.", "iki stəkan çay", "qabın özüdür"],
    ["maşın", "Həyətə iki *maşın* daş gətirdilər.", "Həyətdə dayanan *maşın* qonşumuzundur.", "iki maşın daş", "nəqliyyat vasitəsidir"],
    ["vedrə", "Bağbana beş *vedrə* su lazım idi.", "Boş *vedrə* qapının yanında idi.", "beş vedrə su", "qabın özüdür"],
    ["torba", "Anam bazardan iki *torba* kartof gətirdi.", "Köhnə *torba* yırtılmışdı.", "iki torba kartof", "əşyanın özüdür"],
    ["qutu", "Qonaqlara üç *qutu* şirniyyat bağışladılar.", "*Qutu* rəfin üstündə dayanırdı.", "üç qutu şirniyyat", "əşyanın özüdür"],
    ["səbət", "Tezliklə altı *səbət* alma yığdılar.", "Hörmə *səbət* masanın altında idi.", "altı səbət alma", "əşyanın özüdür"],
  ].map(([w, n, i, ph, note]) => ({ w, n, i, nWhy: "«" + ph + "» — sayla birlikdə «nə qədər?» sualına cavab verir, miqdar ölçüsü bildirir: «" + w + "» numerativ sözdür", iWhy: "«" + w + "» burada əşyanın özünü bildirir (" + note + "): isimdir" }));
  const starTok = (s, mark) => { // "*söz*" işarəsini tokenlərə çevir, işarələnmiş sözün indeksini qaytar
    const toks = s.replace(/([.,!?])/g, " $1").replace(/\*/g, "").split(/\s+/).filter(Boolean), w = s.match(/\*([^*]+)\*/)[1];
    return { toks, idx: toks.indexOf(w) };
  };
  const mark = s => { const p = s.split("*"); return h("span", {}, p[0], h("u", {}, h("b", {}, p[1])), p[2]); };
  const quote = s => s.replace(/\*([^*]+)\*/, "“$1”");
  const NUMSEL = [ // [say, isim, numerativ söz, səhv numerativ sözlər, izah]
    ["beş", "qoyun", "baş", ["nəfər", "litr", "kilometr"], "baş — ferma heyvanları ilə işlənir"],
    ["üç", "inək", "baş", ["nəfər", "dəst", "kilometr"], "baş — ferma heyvanları ilə işlənir"],
    ["dörd", "corab", "cüt", ["nəfər", "baş", "kilometr"], "dörd cüt corab — dərslikdəki nümunədir"],
    ["iki", "mebel", "dəst", ["nəfər", "baş", "kilometr"], "iki dəst mebel — dərslikdəki nümunədir"],
    ["bir", "çay", "stəkan", ["nəfər", "baş", "cüt"], "bir stəkan çay — dərslikdəki nümunədir"],
    ["beş", "un", "kiloqram", ["nəfər", "baş", "cüt"], "beş kiloqram un — ölçü vahidi numerativ kimi işlənir"],
    ["iki", "yol", "kilometr", ["nəfər", "baş", "cüt"], "iki kilometr yol — ölçü vahidi numerativ kimi işlənir"],
    ["üç", "adam", "nəfər", ["baş", "litr", "kilometr"], "nəfər — insan anlayışı ilə işlənir"],
    ["dörd", "boşqab", "ədəd", ["nəfər", "baş", "kilometr"], "ədəd — cansız varlıq bildirən isimlərlə işlənir"],
    ["bir", "kostyum", "dəst", ["nəfər", "baş", "kilometr"], "bir dəst kostyum — dərslikdəki nümunədir"],
  ];

  // ---- fikirlər (qayda): [mətn, mövzu, səhvdirsə izah]
  const TRUE = [
    ["Müəyyən miqdar sayları əşyanın konkret miqdarını bildirir.", "nv"],
    ["Qeyri-müəyyən miqdar sayları əşyanın dəqiq olmayan miqdarını bildirir.", "nv"],
    ["Kəsr sayları tamın hissəsini, ya da tam və hissəni bildirir.", "nv"],
    ["Qeyri-müəyyən miqdar sayları «nə qədər?» sualına cavab verir.", "nv"],
    ["Müəyyən miqdar sayından sonra gələn isim təkdə olur.", "tc"],
    ["«Bir sıra» və «bir çox» saylarından sonra gələn isim cəmdə işlənir.", "tc"],
    ["«Çoxlu» və «yüzlərlə» saylarından sonra gələn isim həm təkdə, həm də cəmdə ola bilər.", "tc"],
    ["«Az», «xeyli» və «bir neçə» saylarından sonra gələn isim təkdə olur.", "tc"],
    ["Sıra sayı ərəb rəqəmi ilə yazılanda şəkilçi ilə rəqəm arasında defis qoyulur.", "yz"],
    ["Sıra sayı Roma rəqəmi ilə yazılanda şəkilçi artırılmır.", "yz"],
    ["Sıra sayı sözlə yazılanda müəyyən miqdar sayına -ıncı⁴ şəkilçisi artırılır.", "yz"],
    ["Kəsr sayını sözlə yazarkən məxrəci bildirən sözə -da² şəkilçisi artırılır.", "yz"],
    ["Rəqəmlə yazılan kəsr sayında maili xətt və vergül işarələrindən istifadə olunur.", "yz"],
    ["«Milyonlarla» kimi qeyri-müəyyən saylar yalnız sözlə yazılır.", "yz"],
    ["Müəyyən miqdar sayı həm sözlə, həm rəqəmlə, həm də rəqəm və sözlə yazıla bilər.", "yz"],
    ["Numerativ söz sayla isim arasında işlənir.", "nm"],
    ["Ölçü vahidi bildirən bir çox sözlər numerativ söz kimi işlənə bilər.", "nm"],
    ["«Nəfər» numerativ sözü insan anlayışı bildirən isimlərlə işlənir.", "nm"],
    ["«Baş» numerativ sözü ferma heyvanları ilə işlənir.", "nm"],
    ["Say isimləşəndə hal, mənsubiyyət və cəm şəkilçiləri qəbul edə bilər.", "is"],
    ["İsimləşmiş say say olaraq qalır.", "is"],
  ];
  const FALSE = [
    ["Müəyyən miqdar sayından sonra gələn isim cəmdə işlənir.", "tc", "Müəyyən miqdar sayından sonra isim təkdə olur: beş şagird, on dəftər."],
    ["«Bir sıra» sayından sonra gələn isim təkdə olur.", "tc", "«Bir sıra» sayından sonra isim cəmdə işlənir: bir sıra məsələlər."],
    ["«Bir çox» sayından sonra gələn isim təkdə olur.", "tc", "«Bir çox» sayından sonra isim cəmdə işlənir: bir çox ölkələr."],
    ["«Az» və «xeyli» saylarından sonra gələn isim cəmdə olur.", "tc", "Digər qeyri-müəyyən saylardan sonra isim təkdə olur: az tapşırıq, xeyli iş."],
    ["«Beş-altı» sayından sonra gələn isim cəmdə olur.", "tc", "«Beş-altı» kimi saylardan sonra isim təkdə olur: beş-altı uşaq."],
    ["Roma rəqəmi ilə yazılan sıra sayına -cı⁴ şəkilçisi artırılır.", "yz", "Roma rəqəmləri ilə yazılan sıra sayına şəkilçi artırılmır: XX əsr."],
    ["Ərəb rəqəmi ilə yazılan sıra sayında şəkilçi defissiz, rəqəmə bitişik yazılır.", "yz", "Rəqəmlə şəkilçi arasında defis qoyulur: 4-cü."],
    ["Ərəb rəqəmi ilə yazılan sıra sayında -ıncı⁴ şəkilçisi tam yazılır.", "yz", "Şəkilçinin birinci hecası ixtisar olunur: 13-cü, 5-ci."],
    ["«Dörddə üç» kəsr sayı rəqəmlə 4/3 kimi yazılır.", "yz", "«Dörddə üç» rəqəmlə 3/4 kimi yazılır."],
    ["Qeyri-müəyyən saylar rəqəmlə yazıla bilməz.", "yz", "Bəziləri rəqəmlə də yazılır: dörd-beş → 4-5."],
    ["«Yüzlərlə» sayı 100-lərlə kimi yazıla bilər.", "yz", "«Yüzlərlə» kimi saylar yalnız sözlə yazılır."],
    ["Qeyri-müəyyən miqdar sayları əşyanın konkret miqdarını bildirir.", "nv", "Konkret miqdarı müəyyən miqdar sayları bildirir."],
    ["Kəsr sayı miqdar sayının növü deyil.", "nv", "Kəsr sayları miqdar saylarının üçüncü növüdür."],
    ["Numerativ sözlər yalnız sıra sayları ilə işlənir.", "nm", "Numerativ sözlər müəyyən miqdar sayları ilə işlənir: iki ədəd boşqab."],
    ["«Kilometr», «kiloqram» sözləri numerativ söz kimi işlənə bilməz.", "nm", "Ölçü vahidi bildirən sözlər numerativ söz kimi işlənə bilər: iki kilometr yol."],
    ["«Baş» numerativ sözü insan anlayışı bildirən isimlərlə işlənir.", "nm", "İnsan anlayışı ilə «nəfər» işlənir; «baş» ferma heyvanları ilə işlənir."],
    ["Say isimləşəndə isim olur.", "is", "İsimləşmiş say isim qrammatik xüsusiyyətlərini qəbul etsə də, say olaraq qalır."],
    ["İsimləşmiş say hal şəkilçisi qəbul edə bilməz.", "is", "İsimləşmiş say hal, mənsubiyyət, cəm şəkilçiləri qəbul edir."],
  ];

  // ---- sınaq cümləsi üçün köməkçi: göstərilən sözün altından xətt
  const markTok = (toks, i) => h("span", {}, ...toks.map((x, j) => [j && !PUNCT.test(x.w || x) ? " " : "", j === i ? h("u", {}, h("b", {}, x.w || x)) : (x.w || x)]));

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "novu", ad: "Say növləri", izah: "Sayları növünə görə ayır: müəyyən miqdar (konkret), qeyri-müəyyən miqdar (dəqiq deyil), kəsr (tamın hissəsi), sıra (neçənci).",
      gen() {
        let ws; for (;;) { ws = sample(WORDS, 6); const c = {}; ws.forEach(x => c[x.t] = (c[x.t] || 0) + 1); if (Object.keys(c).length >= 3 && Math.max(...Object.values(c)) <= 3) break; }
        const qrup = [TIP.M, TIP.Q, TIP.K, TIP.S], order = "MQKS";
        return { text: "Sayları növünə görə qruplara ayır.", bol: { soz: ws.map(x => x.w), qrup, duz: ws.map(x => order.indexOf(x.t)) },
          show: ws.map(x => x.w + " — " + TIP[x.t]).join("; "),
          solution: ws.map(x => x.w + " — " + TIP[x.t] + " (" + TIP_NE[x.t] + ")").join("; ") + "." };
      } },
    { id: "tap", ad: "Cümlədə say", izah: "Cümlədə sayları tap və növünü müəyyən et. Say hər zaman ismə aiddir: neçə? nə qədər? neçənci?",
      gen() {
        if (Math.random() < .5) {
          const a = pick(SAY), b = pick(SAY.filter(x => x !== a && x[0].w !== a[0].w));
          const s = [...a, ...b], duz = s.map((x, i) => x.t ? i : -1).filter(i => i >= 0);
          return { text: "Mətndəki sayların hamısına toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
            solution: duz.map(i => s[i].w + " — " + TIP[s[i].t]).join("; ") + "." };
        }
        const s = pick(SAY), i = s.findIndex(x => x.t), t = s[i].t, opts = Object.values(TIP);
        return { text: h("span", {}, "Fərqləndirilmiş say hansı növdür?", line(markTok(s, i))), choices: opts, correct: opts.indexOf(TIP[t]), show: TIP[t],
          solution: "“" + s[i].w + "” — " + TIP[t] + ": " + TIP_NE[t] + "." };
      } },
    { id: "yazilis", ad: "Sayların yazılışı", izah: "Sıra sayı: rəqəmlə -cı⁴ (defislə), Roma rəqəmi ilə şəkilçisiz. Kəsr: məxrəcə -da². Qeyri-müəyyən saylar yalnız sözlə, bəziləri rəqəmlə də.",
      gen() {
        const k = R(7);
        if (k === 6) { const o = pick(SFX), opts = [o[2], ...o[3]];
          return { text: "«" + o[0] + "» — boşluqdakı «" + o[1] + "» sözü rəqəmlə necə yazılır? (6-cı sinif dərsliyinin qaydasına görə: mənsubiyyət + hal şəkilçisi qoşulanda mənsubiyyət şəkilçisi yazıda ixtisar olunur)", choices: shuffle(opts), correct: -1, show: o[2], _ok: o[2], solution: o[1] + " → " + o[2] + ": " + o[4] + "." }; }
        if (k === 0) { const n = pick(ORDN), o = arabOpts(n), w = o.wrong, opts = [o.ok, w.tam, w.defissiz, w.ahengsiz];
          return { text: "«" + ordWord(n) + "» sıra sayı ərəb rəqəmi ilə necə yazılır?", choices: shuffle(opts), correct: -1, show: o.ok, _ok: o.ok,
            solution: "Şəkilçinin birinci hecası ixtisar olunur, rəqəmlə şəkilçi arasında defis qoyulur: " + o.ok + "." }; }
        if (k === 1) { const n = pick([4, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]), r = roman(n), opts = [r + " əsr", r + "-" + pick(SUF4) + " əsr", r + "-" + pick(SUF4) + " əsr", r + "-" + pick(["üncü", "inci", "ıncı"]) + " əsr"];
          if (new Set(opts).size < 4) return this.gen();
          return { text: "«" + ordWord(n) + " əsr» sıra sayı Roma rəqəmi ilə necə yazılır?", choices: shuffle(opts), correct: -1, show: r + " əsr", _ok: r + " əsr",
            solution: "Roma rəqəmləri ilə yazılan sıra sayına şəkilçi artırılmır: " + r + " əsr." }; }
        if (k === 2) { const n = pick(ORDN), f = ordForms(n), opts = [f.right, ...f.wrong];
          return { text: "Müəyyən miqdar sayına -ıncı⁴ şəkilçisi artırmaqla sıra sayı düzəldin: «" + words(n) + "».", choices: shuffle(opts), correct: -1, show: f.right, _ok: f.right,
            solution: "Şəkilçi sayın son saitinə uyğun (ahəng qanunu ilə) yazılır: " + f.right + "." }; }
        if (k === 3) { const [a, b] = pick(FRAC), ok = a + "/" + b, opts = [ok, b + "/" + a, a + "," + b, a + "-" + b];
          return { text: "«" + fracW(a, b) + "» kəsr sayı rəqəmlə necə yazılır?", choices: shuffle(opts), correct: -1, show: ok, _ok: ok,
            solution: "Məxrəc (aşağıdakı rəqəm) əvvəl deyilir: " + fracW(a, b) + " = " + ok + "." }; }
        if (k === 4) { const x = 2 + R(6), y = x + 1 + R(2), ok = x + "-" + y, opts = [ok, x + "/" + y, x + "," + y, String(x) + y];
          return { text: "«" + ONES[x] + "-" + ONES[y] + "» qeyri-müəyyən sayı rəqəmlə necə yazılır?", choices: shuffle(opts), correct: -1, show: ok, _ok: ok,
            solution: "Yan-yana iki say təxmini miqdar bildirir və defislə yazılır: " + ONES[x] + "-" + ONES[y] + " → " + ok + "." }; }
        const m = 2 + R(8), ok = m + " min", opts = [ok, m + "min", m + "-min", m + " 000 min"];
        return { text: "«" + ONES[m] + " min» sayının rəqəm və sözlə (qarışıq) yazılışı hansıdır?", choices: shuffle(opts), correct: -1, show: ok, _ok: ok,
          solution: "Müəyyən miqdar sayı həm rəqəm, həm söz iştirakı ilə yazıla bilər: " + ONES[m] + " min → " + ok + "." };
      } },
    { id: "kesr", ad: "Kəsr sayları", izah: "Sözlə yazarkən məxrəcə -da² artırılır: 3/4 — dörddə üç. Onluq kəsr: 5,3 — beş tam onda üç.",
      gen() {
        const k = R(4);
        if (k === 0 || k === 1) { const [a, b] = pick(FRAC), ok = fracW(a, b), opts = [ok, ...sample(fracWrong(a, b).filter(x => x !== ok), 3)];
          if (k === 0) return { text: "«" + a + "/" + b + "» kəsr sayı sözlə necə yazılır?", choices: shuffle(opts), correct: -1, show: ok, _ok: ok, solution: "Məxrəcə -da² artırılır və əvvəl deyilir: " + ok + "." };
          const dg = [a + "/" + b, b + "/" + a, a + "," + b, a + "-" + b];
          return { text: "«" + ok + "» kəsr sayı rəqəmlə necə yazılır?", choices: shuffle(dg), correct: -1, show: a + "/" + b, _ok: a + "/" + b, solution: ok + " = " + a + "/" + b + " (maili xətt)." }; }
        const [w, d] = pick(DEC), ok = decW(w, d), opts = [ok, ...sample(decWrong(w, d), 3)];
        if (k === 2) return { text: "«" + decStr(w, d) + "» kəsr sayı sözlə necə yazılır?", choices: shuffle(opts), correct: -1, show: ok, _ok: ok, solution: decStr(w, d) + " — " + ok + "." };
        const dg = [decStr(w, d), decStr(+d, w), w + "/" + d, w + "-" + d];
        return { text: "«" + ok + "» kəsr sayı rəqəmlə necə yazılır?", choices: shuffle(dg.filter((x, i) => dg.indexOf(x) === i).concat(["," + d]).slice(0, 4)), correct: -1, show: decStr(w, d), _ok: decStr(w, d), solution: ok + " = " + decStr(w, d) + " (vergül)." };
      } },
    { id: "tekcem", ad: "Sayla işlənən isim", izah: "Müəyyən saydan və çoxu qeyri-müəyyən saylardan sonra isim təkdə; «bir sıra», «bir çox»dan sonra cəmdə; çox, çoxlu, yüzlərlə, minlərcə — hər ikisi.",
      gen() {
        if (Math.random() < .5) {
          const q = pick([...QT, ...QT_MASS, ...QC, ...QB]), opts = ["təkdə", "cəmdə", "həm təkdə, həm cəmdə"];
          return { text: "Sayla işlənən isim: «" + q.t + " ___ (isim)». Bu saydan sonra isim hansı formada işlənir?", choices: opts, correct: opts.indexOf(FORMNAME[q.r === "B" ? "B" : q.r]), show: FORMNAME[q.r === "B" ? "B" : q.r],
            solution: "«" + q.t + "» — " + q.why + "." };
        }
        const x = tcPick([...QT, ...QC], false), s = tcSent(x.fi, x.n, x.q.t, x.form);
        const idx = s.indexOf(x.n[x.form === "C" ? 1 : 0]);
        return { text: "Cümlədə sayla işlənən isim səhv yazılıb. Həmin sözə toxun.", sec: { soz: s, duz: [idx] }, show: s[idx],
          solution: "«" + x.q.t + " " + s[idx] + "» səhvdir: " + x.q.why + ". Düzgünü: «" + x.q.t + " " + x.n[x.form === "C" ? 0 : 1] + "»." };
      } },
    { id: "numerativ", ad: "Numerativ sözlər", izah: "Numerativ söz sayla isim arasında işlənir və sayla birlikdə «nə qədər?» sualına cavab verir: iki stəkan çay, dörd cüt corab, beş kiloqram un.",
      gen() {
        const k = R(3);
        if (k === 0) { const o = pick(NUM), useN = Math.random() < .5, s = useN ? o.n : o.i, opts = ["isim", "numerativ söz", "sifət"];
          return { text: h("span", {}, "Fərqləndirilmiş söz bu cümlədə nə kimi işlənib?", line(mark(s))), choices: opts, correct: useN ? 1 : 0, show: useN ? "numerativ söz" : "isim",
            solution: (useN ? o.nWhy : o.iWhy) + "." }; }
        if (k === 1) { const o = pick(NUM), { toks, idx } = starTok(o.n);
          return { text: "Cümlədə numerativ sözə toxun.", sec: { soz: toks, duz: [idx] }, show: toks[idx], solution: o.nWhy + "." }; }
        const o = pick(NUMSEL), opts = shuffle([o[2], ...o[3]]);
        return { text: "Boşluğa uyğun numerativ sözü seç: " + o[0] + " ___ " + o[1] + ".", choices: opts, correct: opts.indexOf(o[2]), show: o[2], solution: "«" + o[0] + " " + o[2] + " " + o[1] + "» — " + o[4] + "." };
      } },
    { id: "isimlesme", ad: "Sayların isimləşməsi", izah: "Say isim kimi işlənə bilər (kim? nə? sualına cavab verir, hal, mənsubiyyət, cəm şəkilçiləri qəbul edir), lakin say olaraq qalır.",
      gen() {
        if (Math.random() < .5) { const s = pick(ISIM), duz = s.map((x, i) => x.t ? i : -1).filter(i => i >= 0);
          return { text: "Cümlədə isimləşmiş sayın hamısına toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
            solution: duz.map(i => "«" + s[i].w + "» — isimləşmiş say (ismin şəkilçisini qəbul edib)").join("; ") + "." }; }
        const o = pick(KEPT), opts = ["isim", "sifət", "say"];
        return { text: h("span", {}, "İsimləşmiş «" + o[0] + "» sözü hansı nitq hissəsi olaraq qalır?", line("«" + o[1] + "»")), choices: opts, correct: opts.indexOf(o[2]), show: o[2],
          solution: "«" + o[0] + "» — " + o[3] + ". İsimləşmə nitq hissəsini dəyişmir: " + o[2] + " olaraq qalır." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird say haqqında üç fikir yazıb. Biri səhvdir — hansı?",
      gen() {
        const bad = pick(FALSE), good = sample(TRUE.filter(x => x[1] !== bad[1]), 20), picked = []; const tags = new Set([bad[1]]);
        for (const g of good) { if (picked.length === 2) break; if (!tags.has(g[1])) { tags.add(g[1]); picked.push(g); } }
        while (picked.length < 2) { const g = pick(TRUE.filter(x => x[1] !== bad[1] && !picked.includes(x))); picked.push(g); }
        const st = shuffle([{ t: bad[0], bad: true, why: bad[2] }, ...picked.map(g => ({ t: g[0], bad: false }))]), k = st.findIndex(x => x.bad), ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "Şagird say haqqında üç fikir yazıb: " + st.map((x, j) => (j + 1) + ") " + x.t).join(" ") + " Hansı bənddə səhv var?", choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "Səhv fikir: «" + st[k].t + "» " + st[k].why + " Digər iki bənd düzdür." };
      } },
  ];
  // "choices" generatorlarında doğru cavabın yeri təsadüfi: shuffle-dan sonra indeksi tap
  levels.forEach(l => { const g = l.gen; l.gen = function () { const q = g.call(l); if (q._ok != null) { q.correct = q.choices.indexOf(q._ok); delete q._ok; } return q; }; });

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E) ========
  const TYPES5 = [TIP.M, TIP.Q, TIP.K, TIP.S, "numerativ söz"];
  const QSET = ["az", "xeyli", "bir qədər", "bir neçə", "bir sıra", "yüzlərlə", "onlarla", "minlərcə", "çoxlu", "beş-altı", "dörd-beş", "bir-iki", "bir çox", "bir az", "milyonlarla"];
  const NONQ = [
    ...["üç", "yeddi", "on iki", "yüz", "beş min", "25"].map(w => ({ w, t: "M" })), ...["ikinci", "altıncı", "doqquzuncu", "8-ci", "on üçüncü"].map(w => ({ w, t: "S" })),
    ...["üçdə bir", "beşdə iki", "iki tam onda beş", "dörddə üç"].map(w => ({ w, t: "K" })),
  ];
  const WORDS_BY = t => WORDS.filter(x => x.t === t);
  // yazılış nöqtələri (nömrə kombinasiyası və "səhvi tap"): { t: mətn, ok, why }
  // sıra sayı: ərəb və ya Roma rəqəmi ilə
  function ordItem(wantOk) {
    if (R(3) === 0) { const n = pick([4, 9, 14, 15, 19, 20, 21]), r = roman(n);
      return wantOk ? { t: r + " əsr", ok: true, why: "Roma rəqəmi ilə yazılan sıra sayına şəkilçi artırılmır" } : { t: r + "-" + pick(SUF4) + " əsr", ok: false, why: "Roma rəqəmi ilə yazılan sıra sayına şəkilçi artırılmır (" + r + " əsr)" }; }
    const noun = pick(Object.keys(NOUN_N)), n = pick(ORDN.filter(x => x >= NOUN_N[noun][0] && x <= NOUN_N[noun][1])), o = arabOpts(n);
    if (wantOk) return { t: o.ok + " " + noun, ok: true, why: "şəkilçinin birinci hecası ixtisar olunub, defis var" };
    const kind = pick(["tam", "defissiz", "ahengsiz"]), why = { tam: "şəkilçinin birinci hecası ixtisar olunmalıdır", defissiz: "rəqəmlə şəkilçi arasında defis qoyulmalıdır", ahengsiz: "şəkilçi ahəng qanunu ilə yazılmalıdır" }[kind];
    return { t: o.wrong[kind] + " " + noun, ok: false, why: why + " (" + o.ok + ")" };
  }
  function yzItem(wantOk) {
    const k = R(7) + 1;
    if (k === 1) return ordItem(wantOk);
    if (k === 2) { const [a, b] = pick(FRAC);
      return wantOk ? { t: fracW(a, b) + " — " + a + "/" + b, ok: true, why: "kəsr rəqəmlə maili xətt ilə yazılır, məxrəc aşağıda" } : { t: fracW(a, b) + " — " + b + "/" + a, ok: false, why: "məxrəc aşağıda yazılır: " + a + "/" + b }; }
    if (k === 3) { const x = 2 + R(7), y = x + 1;
      return wantOk ? { t: ONES[x] + "-" + ONES[y] + " — " + x + "-" + y, ok: true, why: "yan-yana iki say rəqəmlə də defislə yazılır" } : { t: ONES[x] + "-" + ONES[y] + " — " + x + "/" + y, ok: false, why: "qeyri-müəyyən say defislə yazılır (" + x + "-" + y + ")" }; }
    if (k === 4) { const m = 2 + R(8);
      return wantOk ? { t: ONES[m] + " min — " + m + " min", ok: true, why: "müəyyən miqdar sayı rəqəm və sözlə yazıla bilər" } : { t: ONES[m] + " min — " + m + "-min", ok: false, why: "düzgün yazılış: " + m + " min" }; }
    if (k === 5) { const q = pick(["yüzlərlə", "minlərcə", "milyonlarla", "onlarla"]), noun = pick(["şagird", "turist", "insan", "qonaq"]), dg = { yüzlərlə: "100-lərlə", minlərcə: "1000-lərcə", milyonlarla: "1000000-larla", onlarla: "10-larla" }[q];
      return wantOk ? { t: q + " " + noun, ok: true, why: "bu say yalnız sözlə yazılır" } : { t: dg + " " + noun, ok: false, why: "bu say yalnız sözlə yazılır (" + q + ")" }; }
    if (k === 6) { const [a, b] = pick(DEC.filter(x => x[1].length === 2)), s = decStr(a, b);
      return wantOk ? { t: decW(a, b) + " — " + s, ok: true, why: "onluq kəsr vergüllə yazılır" } : { t: decW(a, b) + " — " + a + "/" + b, ok: false, why: "onluq kəsr vergüllə yazılır (" + s + ")" }; }
    return ordItem(wantOk);
  }
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. sayla işlənən ismin yazılışında səhv (BSİ-2, 31)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const wrong = tcPick([...QT, ...QC], false), right = [1, 2, 3, 4].map(() => tcPick([...QT, ...QC, ...QB], true)), all = [wrong, ...right];
      if (new Set(all.map(tcText)).size < 5 || new Set(all.map(x => x.n[0])).size < 5) return null;
      return AEq("Hansı cümlədə sayla işlənən ismin yazılışında (təkdə və ya cəmdə işlənməsində) səhv yol verilib?", tcText(wrong), right.map(tcText),
        tcNote(wrong) + ". Qalanları düzdür: " + right.map(tcNote).join("; ") + ".");
    }) },
    // 2. qeyri-müəyyən miqdar saylarının sırası (BSİ-2, 36)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const trip = () => sample(QSET, 3), right = trip(), wrong = [0, 1, 2, 3].map(() => { const x = pick(NONQ); return [...sample(QSET.filter(y => !right.includes(y) || Math.random() < .3), 2), x.w]; });
      if (wrong.some(w => new Set(w).size < 3)) return null;
      const fmtt = a => shuffle(a).join(", ");
      return AEq("Qeyri-müəyyənlik bildirən miqdar saylarını müəyyən edin.", fmtt(right), wrong.map(fmtt),
        "Hamısı qeyri-müəyyən miqdar sayıdır: " + right.join(", ") + ". Digər sətirlərdə bir sayı qeyri-müəyyən deyil: " + wrong.map(w => { const x = NONQ.find(y => w.includes(y.w)); return x.w + " — " + TIP[x.t]; }).join("; ") + ".");
    }) },
    // 3. say növü
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const s = pick(SAY), i = s.findIndex(x => x.t), t = s[i].t;
        return AEq(h("span", {}, "Fərqləndirilmiş say hansı növə aiddir?", line(markTok(s, i))), TIP[t], TYPES5.filter(x => x !== TIP[t]), "“" + s[i].w + "” — " + TIP[t] + ": " + TIP_NE[t] + "."); }
      const [a, b] = sample([..."MQKS"], 2), four = sample(WORDS_BY(a), 4), odd = pick(WORDS_BY(b));
      return AEq("Növünə görə biri fərqlidir:", odd.w, four.map(x => x.w), "“" + odd.w + "” — " + TIP[b] + ". Qalanları " + TIP[a] + ": " + four.map(x => x.w).join(", ") + ".");
    }) },
    // 4. sıra sayının yazılışında səhv
    { tip: "qapali", gen: () => Oyun.again(() => {
      const wrong = ordItem(false), right = [1, 2, 3, 4].map(() => ordItem(true));
      return AEq("Hansı sözbirləşməsində sıra sayının yazılışında səhv var?", wrong.t, right.map(x => x.t), "«" + wrong.t + "» səhvdir: " + wrong.why + ". Qalanları düzdür: " + right.map(x => x.t + " (" + x.why + ")").join("; ") + ".");
    }) },
    // 5. nömrə kombinasiyası: düzgün yazılışlar
    { tip: "qapali", gen: () => Oyun.again(() => {
      const items = [1, 2, 3, 4, 5].map(() => yzItem(Math.random() < .5));
      if (new Set(items.map(x => x.t)).size < 5) return null;
      const right = items.map((x, i) => x.ok ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı yazılışlar düzgündür?", ...items.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". " + x.t))), ...o, show: o.choices[o.correct],
        solution: items.map((x, i) => (i + 1) + ") " + x.t + " — " + (x.ok ? "düzdür" : "səhvdir") + ": " + x.why).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 6. kəsr: rəqəmdən sözə
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const [a, b] = pick(FRAC), ok = fracW(a, b);
        return AEq("«" + a + "/" + b + "» kəsr sayının sözlə yazılışı hansıdır?", ok, sample(fracWrong(a, b).filter(x => x !== ok), 4), "Məxrəc (" + b + ") əvvəl deyilir və -da² şəkilçisi alır: " + ok + "."); }
      const [w, d] = pick(DEC), ok = decW(w, d), ww = decWrong(w, d);
      return AEq("«" + decStr(w, d) + "» kəsr sayının sözlə yazılışı hansıdır?", ok, sample(ww, 4), decStr(w, d) + " — " + ok + ": " + (d.length === 1 ? "onda" : "yüzdə") + " məxrəcdir.");
    }) },
    // 7. numerativ / isim
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(NUM, 5), useN = Math.random() < .5, first = five[0], others = five.slice(1);
      const f = (o, n) => quote(n ? o.n : o.i);
      return AEq(useN ? "Hansı cümlədə dırnaqda verilmiş söz numerativ söz kimi işlənib?" : "Hansı cümlədə dırnaqda verilmiş söz isim kimi işlənib?", f(first, useN), others.map(o => f(o, !useN)),
        (useN ? first.nWhy : first.iWhy) + ". Digər cümlələrdə dırnaqdakı sözlər " + (useN ? "isim kimi işlənib (əşyanın özünü bildirir)" : "numerativ sözdür (sayla birlikdə «nə qədər?» sualına cavab verir)") + ".");
    }) },
    // 8. nömrə kombinasiyası: sayla işlənən isim
    { tip: "qapali", gen: () => Oyun.again(() => {
      const xs = [1, 2, 3, 4, 5].map(() => tcPick([...QT, ...QC, ...QB], Math.random() < .5));
      if (new Set(xs.map(x => x.n[0])).size < 5) return null;
      const right = xs.map((x, i) => okForm(x.q, x.form) ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə sayla işlənən isim düzgün yazılıb?", ...xs.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". " + tcText(x)))), ...o, show: o.choices[o.correct],
        solution: xs.map((x, i) => (i + 1) + ") " + tcNote(x)).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 9. fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FALSE), good = sample(TRUE.filter(x => x[1] !== bad[1]), 4); return AEq("Say haqqında səhv fikri müəyyən edin.", bad[0], good.map(x => x[0]), "Səhvdir: " + bad[0] + " " + bad[2] + " Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(TRUE), bads = sample(FALSE.filter(x => x[1] !== ok[1]), 4); return AEq("Say haqqında doğru fikri müəyyən edin.", ok[0], bads.map(x => x[0]), "Doğrudur: " + ok[0] + " Qalan dörd fikir səhvdir.");
    }) },
    // 10. isimləşmiş say
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(ISIM), others = sample(SAY.filter(x => !x.some(y => y.t === "K")), 4);
      return AEq("Hansı cümlədə isimləşmiş say var?", plain(s), others.map(plain), "“" + s.filter(x => x.t).map(x => x.w).join("”, “") + "” — isimləşmiş say (ismin şəkilçisini qəbul edib, lakin say olaraq qalır). Qalan cümlələrdə saylar ismə aiddir və adi sayıdır: " + others.map(o => o.filter(x => x.t).map(x => x.w).join(", ")).join("; ") + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  window.__levels = levels;
  window.__bank = { WORDS, SAY, ISIM, KEPT, NUM, NUMSEL, TRUE, FALSE, QT, QC, QB, NOUNS };

  // ======== müstəqil yoxlama siyahısı (Codex): bankdakı hər fakt ========
  const Y = []; const addY = (id, sual, cavab) => Y.push({ id, sual, cavab });
  WORDS.forEach((x, i) => addY("soz" + (i + 1), "«" + x.w + "» hansı say növüdür? (" + TIPLER + ")", TIP[x.t]));
  [...SAY].forEach((s, i) => { const x = s.find(y => y.t); addY("cum" + (i + 1), "«" + plain(s) + "» cümləsində «" + x.w + "» sayı hansı növdür? (" + TIPLER + ")", TIP[x.t]); });
  [...QT, ...QT_MASS, ...QC, ...QB].forEach((q, i) => addY("tc" + (i + 1), "«" + q.t + " ___ (isim)» — bu saydan sonra gələn isim hansı formada işlənir? (təkdə, cəmdə, həm təkdə, həm cəmdə)", FORMNAME[q.r]));
  const QALL = [...QT, ...QC, ...QB];
  NOUNS.forEach((x, i) => { const q = QALL[(i * 5 + 3) % QALL.length], form = i % 2 ? "C" : "T"; addY("isim" + (i + 1), "«" + q.t + " " + x.n[form === "C" ? 1 : 0] + "» sözbirləşməsində isim sayla düzgün işlənibmi? (doğru, səhv)", okForm(q, form) ? "doğru" : "səhv"); });
  ORDN.forEach(n => addY("ord" + n, "«" + ordWord(n) + "» sıra sayını ərəb rəqəmi və şəkilçi ilə yazın (nümunə: dörd → 4-cü; yazılış: rəqəm, defis, şəkilçi).", arabOrd(n)));
  [4, 9, 14, 19, 21].forEach(n => addY("rom" + n, "«" + ordWord(n) + " əsr» sözbirləşməsini Roma rəqəmi ilə yazın (şəkilçi lazım olub-olmadığını özün müəyyən et).", roman(n) + " əsr"));
  [3, 7, 20, 90].forEach(n => addY("ordw" + n, "«" + words(n) + "» sayından -ıncı⁴ şəkilçisi ilə sıra sayını sözlə düzəldin.", ordWord(n)));
  FRAC.filter((x, i) => i % 3 === 0).forEach(([a, b]) => addY("kesr" + a + "_" + b, "«" + a + "/" + b + "» kəsr sayını sözlə yazın (nümunə: 1/4 → dörddə bir).", fracW(a, b)));
  DEC.forEach(([w, d]) => addY("dec" + w + "_" + d, "«" + decStr(w, d) + "» kəsr sayını sözlə yazın (nümunə: 5,3 → beş tam onda üç; 0,25 → sıfır tam yüzdə iyirmi beş).", decW(w, d)));
  SFX.forEach((o, i) => addY("sfx" + (i + 1), "«" + o[0] + "» — boşluqdakı «" + o[1] + "» sözü rəqəmlə şəkilçi ilə necə yazılır? (nümunə: üçdə → 3-də; 6-cı sinif dərsliyinin qaydasına görə: mənsubiyyət + hal şəkilçisi qoşulanda mənsubiyyət şəkilçisi yazıda ixtisar olunur)", o[2]));
  addY("min", "«üç min» sayının rəqəm və sözlə (qarışıq) yazılışı hansıdır? (3 min, 3-min, 3min)", "3 min");
  addY("def1", "«beş-altı» qeyri-müəyyən sayının rəqəmlə yazılışı hansıdır? (5-6, 5/6, 5,6)", "5-6");
  addY("def2", "«yüzlərlə» sayı rəqəmlə yazıla bilərmi? (bəli, xeyr)", "xeyr");
  NUM.forEach((o, i) => {
    addY("num" + (i + 1) + "a", "«" + o.n.replace(/\*/g, "") + "» cümləsində «" + o.w + "» sözü isim, yoxsa numerativ söz kimi işlənib? (isim, numerativ söz)", "numerativ söz");
    addY("num" + (i + 1) + "b", "«" + o.i.replace(/\*/g, "") + "» cümləsində «" + o.w + "» sözü isim, yoxsa numerativ söz kimi işlənib? (isim, numerativ söz)", "isim");
  });
  NUMSEL.forEach((o, i) => addY("ns" + (i + 1), "Boşluğa uyğun numerativ sözü seç: " + o[0] + " ___ " + o[1] + ". (" + shuffle([o[2], ...o[3]]).join(", ") + ")", o[2]));
  KEPT.forEach((o, i) => addY("kept" + (i + 1), "«" + o[1] + "» cümləsində isimləşmiş «" + o[0] + "» sözü hansı nitq hissəsi olaraq qalır? (isim, sifət, say)", o[2]));
  ISIM.forEach((s, i) => addY("isimcum" + (i + 1), "«" + plain(s) + "» cümləsində hansı sözlər isimləşmiş saydır? (hamısını sırası ilə, vergüllə yaz)", s.filter(x => x.t).map(x => x.w).join(", ")));
  TRUE.forEach((x, i) => addY("dogru" + (i + 1), "Fikir: «" + x[0] + "» (doğru, səhv)", "doğru"));
  FALSE.forEach((x, i) => addY("sehv" + (i + 1), "Fikir: «" + x[0] + "» (doğru, səhv)", "səhv"));
  window.__yoxla = Y;

  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-say", title: "Say", fenn: "azdili", link: "dersler/az-say.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər sözə sual ver: neçə? nə qədər? neçənci?",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["novu", "tap", "yazilis", "kesr", "tekcem", "tekcem", "numerativ", "numerativ", "isimlesme", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-say.html")) b.push("dersler/az-say.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
