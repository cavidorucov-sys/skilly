// Azərbaycan dili · Feil I: forma və zaman — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024), s. 10 (əsas nitq hissələri, feilin sualı "nə etdik?"), s. 48 (feilin zamana və şəxsə
// görə dəyişməsi, bitişdirici samit), s. 49 (feilin inkar forması; düzəltmə feillər 5ə; mürəkkəb feillər 5f, 5g); 5-ci sinif, 1-ci hissə (2024),
// s. 49 (sözün quruluşca növləri: sadə, düzəltmə, mürəkkəb); 6-cı sinif, 2-ci hissə (2025), s. 62 (zaman və şəxs şəkilçiləri, "d" tapşırığı);
// 7-ci sinif, 1-ci hissə, s. 68 (ayrı yazılan mürəkkəb feillər, "Diqqət et") və 2-ci hissə, s. 43 (silib-süpürmək, yazıb-yaratmaq, cəlb etmək) —
// 7-ci sinif köməkçi mənbədir. Cümlələrdə hər feil zamanına, şəxsinə, zaman şəkilçisinə, təsdiq/inkar formasına və (müəyyən olduqda)
// quruluşuna görə etiketlənib. Bankda qəsdən olmayanlar: feilin şəkilləri (əmr, arzu, vacib, lazım, şərt, xəbər şəkli), idi/imiş/isə, "-mışdı"
// kimi mürəkkəb zamanlar, məlum/məchul və digər qrammatik növlər (yazıldı, sevindi, salamlaşdı, tikdirdi), məsdər, feili sifət, feili bağlama,
// tək işlənəndə birmənalı olmayan formalar (III şəxsin təkində -acaq², tək -ıb⁴, -mış⁴) və "-ar²" formaları yalnız "sabah" kimi zaman sözü ilə.
(function () {
  const h = Oyun.h;
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
  const cap = s => s[0].toLocaleUpperCase("az") + s.slice(1);

  // ---- adlar
  const ZAD = { i: "indiki zaman", k: "keçmiş zaman", g: "gələcək zaman" };
  const PAD = { "1t": "I şəxsin təki", "2t": "II şəxsin təki", "3t": "III şəxsin təki", "1c": "I şəxsin cəmi", "2c": "II şəxsin cəmi", "3c": "III şəxsin cəmi" };
  const PKEYS = ["1t", "2t", "3t", "1c", "2c", "3c"];
  const SFX = { ir: "-ır⁴", di: "-dı⁴", mis: "-mış⁴", ib: "-ıb⁴", acaq: "-acaq²", ar: "-ar²" };
  const SFX_ZAMAN = { ir: "i", di: "k", mis: "k", ib: "k", acaq: "g", ar: "g" };
  const SUAL = { i: "nə edir?", k: "nə etdi?", g: "nə edəcək?" };
  const QAD = { S: "sadə feil", D: "düzəltmə feil", M: "mürəkkəb feil", H: "mürəkkəb feil" };
  const loc = pad => pad.replace(/təki$/, "təkində").replace(/cəmi$/, "cəmində");
  const ZS = { i: "-ır⁴", k: "-dı⁴", g: "-acaq²" };
  const cellTxt = (z, p) => ZAD[z] + "da (" + ZS[z] + " ilə), " + loc(PAD[p]);
  const ZAD_LIST = "(indiki zaman, keçmiş zaman, gələcək zaman)";
  const PAD_LIST = "(I şəxsin təki, II şəxsin təki, III şəxsin təki, I şəxsin cəmi, II şəxsin cəmi, III şəxsin cəmi)";
  const SFX_LIST = "(-ır⁴, -dı⁴, -mış⁴, -ıb⁴, -acaq², -ar²)";

  // ---- feil formalarının düzəldilməsi (5-ci sinif, 2-ci hissə, s. 48–49): kök + (inkar -ma²) + zaman şəkilçisi + şəxs şəkilçisi
  const isV = ch => "aıoueəiöü".includes(ch);
  const lastV = w => { for (let i = w.length - 1; i >= 0; i--) if (isV(w[i])) return w[i]; return "a"; };
  const H4 = { a: "ı", ı: "ı", o: "u", u: "u", e: "i", ə: "i", i: "i", ö: "ü", ü: "ü" };
  const h4 = w => H4[lastV(w)];
  const back = w => "aıou".includes(lastV(w));
  // k — kök; v — saitlə başlayan şəkilçidən əvvəl kökün forması (get → ged-)
  const VERBS = [{ k: "yaz" }, { k: "oxu" }, { k: "gəl" }, { k: "get", v: "ged" }, { k: "gör" }, { k: "al" }, { k: "ver" }, { k: "bil" }, { k: "qaç" }, { k: "bax" }, { k: "aç" }, { k: "dur" }];
  function form(vb, z, p, neg) {
    const k = vb.k, vs = vb.v || vb.k, ve = isV(k[k.length - 1]), ma = back(k) ? "ma" : "mə";
    let base;
    if (z === "i") base = neg ? k + "m" + h4(k) + "r" : vs + (ve ? "y" : "") + h4(vs) + "r";
    else if (z === "k") base = neg ? k + ma + "d" + h4(ma) : k + "d" + h4(k);
    else base = neg ? k + ma + "y" + (back(ma) ? "acaq" : "əcək") : vs + (ve ? "y" : "") + (back(vs) ? "acaq" : "əcək");
    const bk = back(base), v4 = h4(base);
    if (z === "g") {
      const cut = base.slice(0, -1), mut = bk ? "ğ" : "y";
      return { "1t": cut + mut + (bk ? "am" : "əm"), "2t": base + (bk ? "san" : "sən"), "3t": base, "1c": cut + mut + v4 + (bk ? "q" : "k"), "2c": base + "s" + v4 + "n" + v4 + "z", "3c": base + (bk ? "lar" : "lər") }[p];
    }
    if (z === "i") return { "1t": base + (bk ? "am" : "əm"), "2t": base + (bk ? "san" : "sən"), "3t": base, "1c": base + v4 + (bk ? "q" : "k"), "2c": base + "s" + v4 + "n" + v4 + "z", "3c": base + (bk ? "lar" : "lər") }[p];
    return { "1t": base + "m", "2t": base + "n", "3t": base, "1c": base + (bk ? "q" : "k"), "2c": base + "n" + v4 + "z", "3c": base + (bk ? "lar" : "lər") }[p];
  }
  // tək işlənəndə birmənalı olan formalar: III şəxsin təkində -acaq² (yazacaq, gələcək) tək-tək verilmir
  const ALONE_OK = (z, p) => !(z === "g" && p === "3t");
  const POOL = [];
  VERBS.forEach(vb => ["i", "k", "g"].forEach(z => PKEYS.forEach(p => [false, true].forEach(neg => { if (ALONE_OK(z, p)) POOL.push({ w: form(vb, z, p, neg), v: vb.k, z, p, neg }); }))));
  const poolBy = (f) => POOL.filter(f);
  // verilmiş kök və xana üçün 4 yanlış xana: eyni xananın təsdiq/inkarı, başqa şəxs, başqa zaman
  function wrongCells(vb, z, p, neg, kind) {
    const out = [], add = (z2, p2, n2) => { if (!(z2 === z && p2 === p && n2 === neg) && ALONE_OK(z2, p2) !== false) out.push([z2, p2, n2]); };
    const oz = ["i", "k", "g"].filter(x => x !== z), op = PKEYS.filter(x => x !== p);
    if (kind === "neg") { add(z, p, !neg); sample(op, 2).forEach(q => add(z, q, neg)); sample(oz, 1).forEach(q => add(q, p, neg)); }
    else if (kind === "sexs") { sample(op, 3).forEach(q => add(z, q, neg)); add(pick(oz), p, neg); }
    else { sample(oz, 2).forEach(q => add(q, p, neg)); sample(op, 2).forEach(q => add(z, q, neg)); }
    return out.filter(c => ALONE_OK(c[0], c[1]));
  }

  // ---- cümlə bankı. Token: "söz" (feil deyil) və ya "söz:F:zaman:şəxs:şəkilçi:+/-:quruluş". "_" — bir vahid olan iki söz (mürəkkəb feil);
  // quruluş: S sadə, D düzəltmə, M ayrı yazılan mürəkkəb feil, H tərəfləri defislə yazılan mürəkkəb feil, _ — göstərilmir.
  const RAW = [
    // indiki zaman
    "Qardaşım hər gün səhər tezdən durur:F:i:3t:ir:+:S .",
    "Biz indi dərs oxuyuruq:F:i:1c:ir:+:S .",
    "Sən niyə belə tez qaçırsan:F:i:2t:ir:+:S ?",
    "Uşaqlar məktəbin həyətində ağac əkirlər:F:i:3c:ir:+:S .",
    "Sənan dərsini yaxşı bilir:F:i:3t:ir:+:S .",
    "Siz bu şəkli görürsünüz:F:i:2c:ir:+:S .",
    "Mən hər gün bağda gəzirəm:F:i:1t:ir:+:S .",
    "Anam hamıya çay verir:F:i:3t:ir:+:S .",
    "Qonşular bu gün bizə gəlirlər:F:i:3c:ir:+:S .",
    "Mən bu sualın cavabını bilmirəm:F:i:1t:ir:-:S .",
    "Nənəm heç vaxt tez yatmır:F:i:3t:ir:-:S .",
    "Biz televizora baxmırıq:F:i:1c:ir:-:S .",
    "Onlar bizi görmürlər:F:i:3c:ir:-:S .",
    "Uşaqlar idman zalında basketbol oynayırlar:F:i:3c:ir:+:_ .",
    "Siz dərslərinizi yazırsınız:F:i:2c:ir:+:S .",
    "Sən bu işi bilmirsən:F:i:2t:ir:-:S .",
    // keçmiş zaman: -dı⁴
    "Dünən biz meşəyə getdik:F:k:1c:di:+:S .",
    "Sən bu şeiri harada oxudun:F:k:2t:di:+:S ?",
    "Uşaqlar sinifdə yazdılar:F:k:3c:di:+:S .",
    "Mən dünən kitabxanadan iki kitab aldım:F:k:1t:di:+:S .",
    "Siz dünən nə gördünüz:F:k:2c:di:+:S ?",
    "Qonaqlar axşam getdilər:F:k:3c:di:+:S .",
    "Mən sənin məktubunu almadım:F:k:1t:di:-:S .",
    "Onlar bizi gözləmədilər:F:k:3c:di:-:_ .",
    "Sən bu sözü bilmədin:F:k:2t:di:-:S .",
    "Siz divar qəzeti hazırladınız:F:k:2c:di:+:_ ?",
    "Həkim ona dərman verdi:F:k:3t:di:+:S .",
    "Məmməd evə gəldi:F:k:3t:di:+:S .",
    "Atam çay içdi:F:k:3t:di:+:S .",
    // keçmiş zaman: -mış⁴
    "Burada nərgiz əkmişəm:F:k:1t:mis:+:S .",
    "Mən dərslərimi çoxdan hazırlamışam:F:k:1t:mis:+:_ .",
    "Sən bu mövzuları artıq öyrənmişsən:F:k:2t:mis:+:_ .",
    "Mən bu kitabı artıq oxumuşam:F:k:1t:mis:+:S .",
    "Sən çoxdan buraya gəlmişsən:F:k:2t:mis:+:S .",
    "Biz bu qaydanı çoxdan bilmişik:F:k:1c:mis:+:S .",
    "Mən bu şəkli heç görməmişəm:F:k:1t:mis:-:S .",
    "Bu şəkli məşhur rəssam çəkmişdir:F:k:3t:mis:+:S .",
    // keçmiş zaman: -ıb⁴
    "Bu ağacı babam əkib:F:k:3t:ib:+:S .",
    "Bu şəkli kim çəkib:F:k:3t:ib:+:S ?",
    "Qardaşım hələ evə gəlməyib:F:k:3t:ib:-:S .",
    // gələcək zaman: -acaq²
    "Sabah biz muzeyə gedəcəyik:F:g:1c:acaq:+:S .",
    "Mən sabah yeni kitablar alacağam:F:g:1t:acaq:+:S .",
    "Qonaqlar saat beşdə gələcəklər:F:g:3c:acaq:+:S .",
    "Sabah yağış yağacaq:F:g:3t:acaq:+:S .",
    "Siz sabah bizə gələcəksiniz:F:g:2c:acaq:+:S .",
    "Mən sabah evdə qalmayacağam:F:g:1t:acaq:-:S .",
    "Onlar sabah məktəbə gəlməyəcəklər:F:g:3c:acaq:-:S .",
    "Sən o kitabı oxumayacaqsan:F:g:2t:acaq:-:S .",
    "Çox vacib məsələ haqqında danışacağıq:F:g:1c:acaq:+:_ .",
    "Səyahətə nə vaxt çıxacaqsınız:F:g:2c:acaq:+:S ?",
    // gələcək zaman: -ar² (yalnız "sabah" kimi zaman sözü ilə)
    "Sabah yeni kitabları rəflərə düzərəm:F:g:1t:ar:+:_ .",
    "Sabah sənin yanına gələrəm:F:g:1t:ar:+:S .",
    "Sabah siz bizə gələrsiniz:F:g:2c:ar:+:S .",
    "Biz bu işi sabah görərik:F:g:1c:ar:+:S .",
    "Mən sabah ora getmərəm:F:g:1t:ar:-:S .",
    // mürəkkəb feillər: ayrı yazılan (kömək etmək, şad olmaq, peyda olmaq — 7-ci sinif s. 68; bəxş etmək, cəzb etmək — "Diqqət et")
    "Müəllim şagirdlərə kömək_etdi:F:k:3t:di:+:M .",
    "Mən sizdən xahiş_edirəm:F:i:1t:ir:+:M .",
    "Hamı bu xəbərə şad_oldu:F:k:3t:di:+:M .",
    "Yağış gəzintiyə mane_oldu:F:k:3t:di:+:M .",
    "Qardaşım bu məsələni həll_etdi:F:k:3t:di:+:M .",
    "Müəllim bu sözü lövhədə qeyd_etdi:F:k:3t:di:+:M .",
    "Şagird qaydanın mənasını dərk_etdi:F:k:3t:di:+:M .",
    "Şair xalqa gözəl şeirlər bəxş_etdi:F:k:3t:di:+:M .",
    "Dostlar bu məsələ üstündə mübahisə_etdilər:F:k:3c:di:+:M .",
    "Qəfildən qapıda bir adam peyda_oldu:F:k:3t:di:+:M .",
    "Bu hadisə hamının diqqətini cəlb_etdi:F:k:3t:di:+:M .",
    "Müəllim yeni qaydanı izah_etdi:F:k:3t:di:+:M .",
    "Biz sənə kömək_etməyəcəyik:F:g:1c:acaq:-:M .",
    "Sən sabah onlara kömək_edəcəksən:F:g:2t:acaq:+:M .",
    "Qonşular uşaqlara göz-qulaq_oldular:F:k:3c:di:+:M .",
    // mürəkkəb feillər: tərəfləri defislə yazılan
    "Uşaqlar bütün gün küçələri gəzib-dolaşdılar:F:k:3c:di:+:H .",
    "Nənəm hər gün otaqları silib-süpürür:F:i:3t:ir:+:H .",
    "Usta parçanı diqqətlə ölçüb-biçdi:F:k:3t:di:+:H .",
    "Gənc şair ömrü boyu yazıb-yaratdı:F:k:3t:di:+:H .",
    // düzəltmə feillər (5-ci sinif, 2-ci hissə, s. 49, 5ə: duzla-, çoxal-, bozar-, uzaqlaş-)
    "Anam xiyarı duzladı:F:k:3t:di:+:D .",
    "Yazda çayın suyu çoxaldı:F:k:3t:di:+:D .",
    "Göy üzü bozardı:F:k:3t:di:+:D .",
    "Qonaqlar bizdən uzaqlaşdılar:F:k:3c:di:+:D .",
    "Havanın temperaturu azaldı:F:k:3t:di:+:D .",
    "Qız süfrəni təmizlədi:F:k:3t:di:+:D .",
    "Gecə hava qaraldı:F:k:3t:di:+:D .",
    "Şəhər gözəlləşdi:F:k:3t:di:+:D .",
    "Atam zavodda işləyir:F:i:3t:ir:+:D .",
    // iki feilli cümlələr (təsdiq və inkar yan-yana)
    "Mən kitabı aldım:F:k:1t:di:+:S , amma oxumadım:F:k:1t:di:-:S .",
    "Qardaşım gəlir:F:i:3t:ir:+:S , lakin bacım gəlmir:F:i:3t:ir:-:S .",
    "Biz meşəyə getdik:F:k:1c:di:+:S , onlar getmədilər:F:k:3c:di:-:S .",
    "Sən bilirsən:F:i:2t:ir:+:S , mən bilmirəm:F:i:1t:ir:-:S .",
    "Sabah yağış yağacaq:F:g:3t:acaq:+:S , amma biz evdə qalmayacağıq:F:g:1c:acaq:-:S .",
  ];
  const parseTok = t => {
    const m = t.split(":");
    if (m[1] === "F") return { w: m[0].replace(/_/g, " "), f: true, z: m[2], p: m[3], sfx: m[4], neg: m[5] === "-", q: m[6] === "_" ? null : m[6] };
    return { w: t.replace(/_/g, " "), f: false, punct: !/\p{L}/u.test(t) };
  };
  const BANK = RAW.map(s => s.split(" ").map(parseTok));
  const feils = s => s.filter(x => x.f);
  const ONE = BANK.filter(s => feils(s).length === 1);
  const plain = s => s.map((x, i) => (i && !x.punct ? " " : "") + x.w).join("");
  const markSent = (s, k) => h("span", {}, ...s.map((x, i) => [i && !x.punct ? " " : "", x.f && (k == null || x === k) ? h("u", {}, h("b", {}, x.w)) : x.w]));
  const feilOf = s => feils(s)[0];

  // ---- feil olmayan sözlər (hər biri yalnız öz nitq hissəsidir)
  const NONF = {
    "isim": ["kitab", "dəniz", "ağac", "məktəb", "şəhər", "qələm", "çiçək", "dəftər", "pəncərə", "bulud", "stəkan", "meşə"],
    "sifət": ["mehriban", "hündür", "geniş", "yaşıl", "nazik", "səliqəli", "ağıllı", "kövrək"],
    "zərf": ["tez", "gec", "içəri", "geri", "həmişə", "sakitcə", "cəld"],
    "say": ["yeddi", "doqquz", "iyirmi", "yüz", "beşinci", "onuncu"],
  };
  const NONF_ALL = Object.entries(NONF).flatMap(([t, a]) => a.map(w => ({ w, t })));

  // ---- fikirlər (dərslik qaydaları)
  const FIKIR_DUZ = [
    "Feil əşyanın hərəkətini bildirir.",
    "Feil əsas nitq hissəsidir.",
    "Feilə zaman şəkilçiləri artırmaqla hərəkətin hansı zamanda baş verdiyi bildirilir.",
    "İndiki zaman -ır⁴ şəkilçisi ilə düzəlir.",
    "Keçmiş zamanı bildirmək üçün -dı⁴, -mış⁴, -ıb⁴ şəkilçilərindən istifadə olunur.",
    "Gələcək zamanın şəkilçiləri ikivariantlı şəkilçilərdir.",
    "Feillərə şəxs şəkilçiləri hərəkətin hansı şəxs tərəfindən icra olunduğunu bildirmək üçün artırılır.",
    "Şəxs şəkilçiləri sözə zaman şəkilçilərindən sonra qoşulur.",
    "Hərəkətin icra olunmadığını bildirmək üçün feilə -ma² şəkilçisi artırılır.",
    "Feil -ır⁴, -ar² şəkilçiləri ilə işlənəndə -ma² şəkilçisinin saiti düşür.",
    "Saitlə bitən sözlə saitlə başlayan şəkilçi arasında işlənən y samiti bitişdirici samit adlanır.",
    "Düzəltmə feil kökə leksik şəkilçi artırmaqla yaranır.",
    "Mürəkkəb feil iki və ya daha artıq sözün birləşməsindən yaranır.",
    "Ayrı yazılan mürəkkəb sözlərə feillər də daxildir.",
    "“Etmək”, “olmaq” sözləri ilə işlənən bəzi mürəkkəb feillərdə əsas söz ayrılıqda işlənə bilmir.",
  ];
  const FIKIR_SEHV = [
    "Hərəkətin icra olunmadığını bildirmək üçün feilə -dı⁴ şəkilçisi artırılır.",
    "-ır⁴ şəkilçisi gələcək zaman bildirir.",
    "-acaq² şəkilçisi keçmiş zaman bildirir.",
    "-mış⁴ şəkilçisi indiki zaman bildirir.",
    "Şəxs şəkilçiləri sözə zaman şəkilçilərindən əvvəl qoşulur.",
    "Feil şəxsə görə dəyişmir.",
    "Feil -ır⁴ şəkilçisi ilə işlənəndə -ma² şəkilçisinin saiti saxlanılır.",
    "Bitişdirici samit saitlə bitən sözlə saitlə başlayan şəkilçi arasında deyil, iki samit arasında işlənir.",
    "Feil əşyanın əlamətini bildirir.",
    "Feil köməkçi nitq hissəsidir.",
    "Mürəkkəb feillər həmişə bitişik yazılır.",
    "Düzəltmə feil yalnız kökdən və zaman şəkilçisindən ibarətdir.",
    "Sadə feil iki sözdən ibarət olur.",
    "Gələcək zamanın şəkilçiləri dördvariantlı şəkilçilərdir.",
  ];
  // söz haqqında fikirlər: [feil, doğru fikirlər, səhv fikirlər]
  const PROFIL = [
    ["yazıram", ["feildir", "indiki zamandadır", "I şəxsin təkindədir", "təsdiq formasındadır", "-ır⁴ şəkilçisi ilə düzəlib", "sadə feildir"], ["keçmiş zamandadır", "gələcək zamandadır", "II şəxsin təkindədir", "inkar formasındadır", "mürəkkəb feildir"]],
    ["oxudum", ["feildir", "keçmiş zamandadır", "I şəxsin təkindədir", "təsdiq formasındadır", "-dı⁴ şəkilçisi ilə düzəlib", "sadə feildir"], ["indiki zamandadır", "gələcək zamandadır", "I şəxsin cəmindədir", "inkar formasındadır", "düzəltmə feildir"]],
    ["gedəcəksən", ["feildir", "gələcək zamandadır", "II şəxsin təkindədir", "təsdiq formasındadır", "-acaq² şəkilçisi ilə düzəlib", "sadə feildir"], ["keçmiş zamandadır", "indiki zamandadır", "I şəxsin təkindədir", "inkar formasındadır", "mürəkkəb feildir"]],
    ["bilmədim", ["feildir", "keçmiş zamandadır", "I şəxsin təkindədir", "inkar formasındadır", "tərkibində -ma² şəkilçisi var", "sadə feildir"], ["təsdiq formasındadır", "gələcək zamandadır", "II şəxsin təkindədir", "indiki zamandadır", "mürəkkəb feildir"]],
    ["bilmirsiniz", ["feildir", "indiki zamandadır", "II şəxsin cəmindədir", "inkar formasındadır", "-ma² şəkilçisinin saiti düşüb", "sadə feildir"], ["keçmiş zamandadır", "təsdiq formasındadır", "II şəxsin təkindədir", "gələcək zamandadır", "III şəxsin cəmindədir"]],
    ["deyəcəyik", ["feildir", "gələcək zamandadır", "I şəxsin cəmindədir", "tərkibində bitişdirici samit var", "təsdiq formasındadır", "sadə feildir"], ["keçmiş zamandadır", "indiki zamandadır", "II şəxsin cəmindədir", "inkar formasındadır", "tərkibində bitişdirici samit yoxdur"]],
    ["vurdular", ["feildir", "keçmiş zamandadır", "III şəxsin cəmindədir", "təsdiq formasındadır", "-dı⁴ şəkilçisi ilə düzəlib", "sadə feildir"], ["indiki zamandadır", "gələcək zamandadır", "I şəxsin cəmindədir", "inkar formasındadır", "II şəxsin cəmindədir"]],
    ["çoxaldı", ["feildir", "düzəltmə feildir", "keçmiş zamandadır", "III şəxsin təkindədir", "kökü “çox” sözüdür", "tərkibində leksik şəkilçi var"], ["sadə feildir", "mürəkkəb feildir", "indiki zamandadır", "gələcək zamandadır", "inkar formasındadır"]],
    ["kömək etdim", ["feildir", "mürəkkəb feildir", "ayrı yazılır", "keçmiş zamandadır", "I şəxsin təkindədir", "təsdiq formasındadır"], ["sadə feildir", "düzəltmə feildir", "bitişik yazılır", "defislə yazılır", "gələcək zamandadır"]],
    ["silib-süpürürlər", ["feildir", "mürəkkəb feildir", "defislə yazılır", "indiki zamandadır", "III şəxsin cəmindədir", "təsdiq formasındadır"], ["ayrı yazılır", "bitişik yazılır", "keçmiş zamandadır", "sadə feildir", "inkar formasındadır"]],
    ["gəlmişəm", ["feildir", "keçmiş zamandadır", "I şəxsin təkindədir", "-mış⁴ şəkilçisi ilə düzəlib", "təsdiq formasındadır", "sadə feildir"], ["indiki zamandadır", "gələcək zamandadır", "II şəxsin təkindədir", "-ır⁴ şəkilçisi ilə düzəlib", "inkar formasındadır"]],
  ];

  // ---- mürəkkəb feillərin yazılışı: [cümlə (___), düzgün, yanlışlar, növ]  növ: a — ayrı, h — defislə (-ıb⁴ tərəfi), m — göz-qulaq olmaq (defis + ayrı)
  const YAZ = [
    ["Müəllim şagirdlərə ___.", "kömək etdi", ["köməketdi", "kömək-etdi"], "a"],
    ["Hamı bu xəbərə ___.", "şad oldu", ["şadoldu", "şad-oldu"], "a"],
    ["Qardaşım bu məsələni ___.", "həll etdi", ["həlletdi", "həll-etdi"], "a"],
    ["Yağış gəzintiyə ___.", "mane oldu", ["maneoldu", "mane-oldu"], "a"],
    ["Müəllim bu sözü lövhədə ___.", "qeyd etdi", ["qeydetdi", "qeyd-etdi"], "a"],
    ["Şagird qaydanın mənasını ___.", "dərk etdi", ["dərketdi", "dərk-etdi"], "a"],
    ["Şair xalqa gözəl şeirlər ___.", "bəxş etdi", ["bəxşetdi", "bəxş-etdi"], "a"],
    ["Qəfildən qapıda bir adam ___.", "peyda oldu", ["peydaoldu", "peyda-oldu"], "a"],
    ["Bu hadisə hamının diqqətini ___.", "cəlb etdi", ["cəlbetdi", "cəlb-etdi"], "a"],
    ["Müəllim yeni qaydanı ___.", "izah etdi", ["izahetdi", "izah-etdi"], "a"],
    ["Mən sizdən ___.", "xahiş edirəm", ["xahişedirəm", "xahiş-edirəm"], "a"],
    ["Dostlar bu məsələ üstündə ___.", "mübahisə etdilər", ["mübahisəetdilər", "mübahisə-etdilər"], "a"],
    ["Nənəm hər gün otaqları ___.", "silib-süpürür", ["silib süpürür", "silibsüpürür"], "h"],
    ["Uşaqlar bütün gün küçələri ___.", "gəzib-dolaşdılar", ["gəzib dolaşdılar", "gəzibdolaşdılar"], "h"],
    ["Usta parçanı diqqətlə ___.", "ölçüb-biçdi", ["ölçüb biçdi", "ölçübbiçdi"], "h"],
    ["Gənc şair ömrü boyu ___.", "yazıb-yaratdı", ["yazıb yaratdı", "yazıbyaratdı"], "h"],
    ["Qonşular uşaqlara ___.", "göz-qulaq oldular", ["göz qulaq oldular", "gözqulaq oldular", "göz-qulaq-oldular"], "m"],
  ];
  const YAZ_FULL = YAZ.map(([s, r, w, k]) => ({ r, w, k, s: s.replace("___", r), sw: w.map(x => s.replace("___", x)), blank: s }));
  const BIRL = { a: ["kömək etmək", "şad olmaq", "həll etmək", "mane olmaq", "qeyd etmək", "dərk etmək", "bəxş etmək", "peyda olmaq", "cəlb etmək", "izah etmək", "xahiş etmək", "mübahisə etmək"],
    h: ["silib-süpürmək", "gəzib-dolaşmaq", "ölçüb-biçmək", "yazıb-yaratmaq"] };
  // düzəltmə feillər: sözün hissələri (5-ci sinif, 1-ci hissə, s. 49; 2-ci hissə, s. 49)
  const DEC = { "duzladı": "duz + -la (leksik şəkilçi) + -dı", "çoxaldı": "çox + -al (leksik şəkilçi) + -dı", "bozardı": "boz + -ar (leksik şəkilçi) + -dı", "uzaqlaşdılar": "uzaq + -laş (leksik şəkilçi) + -dı + -lar",
    "azaldı": "az + -al (leksik şəkilçi) + -dı", "təmizlədi": "təmiz + -lə (leksik şəkilçi) + -di", "qaraldı": "qara + -l (leksik şəkilçi) + -dı", "gözəlləşdi": "gözəl + -ləş (leksik şəkilçi) + -di", "işləyir": "iş + -lə (leksik şəkilçi) + -y + -ir" };

  const explainZ = f => "“" + f.w + "” — " + SFX[f.sfx] + " şəkilçisi " + (SFX_ZAMAN[f.sfx] === "i" ? "indiki" : SFX_ZAMAN[f.sfx] === "k" ? "keçmiş" : "gələcək") + " zaman bildirir" + (f.neg ? " (inkar: -ma²)" : "") + "; deməli " + ZAD[f.z] + ".";
  const explainP = f => "“" + f.w + "” — " + PAD[f.p] + ". Şəxs şəkilçisi zaman şəkilçisindən sonra gəlir" + (f.p === "3t" ? (f.sfx === "mis" ? "; -mış⁴ ilə III şəxsin təkində -dir gəlir" : "; bu forma ilə III şəxsin təkində əlavə şəxs şəkilçisi işlənmir") : "") + ".";

  // ---- oyun səviyyələri
  const levels = [
    { id: "hereket", ad: "Feil: hərəkət bildirən söz", izah: "Feil hərəkət bildirir: nə edir? nə etdi? nə edəcək? Cümlədə bütün feillərə toxun; mürəkkəb feil bir vahiddir.",
      gen() {
        if (R(10) < 6) {
          const s = pick(BANK), fs = feils(s), duz = s.map((x, i) => x.f ? i : -1).filter(i => i >= 0);
          return { text: "Cümlədəki bütün feillərə toxun.", sec: { soz: s.map(x => x.w), duz }, show: fs.map(x => x.w).join(", "),
            solution: fs.map(x => "“" + x.w + "” — " + SUAL[x.z] + " hərəkət bildirir").join("; ") + ". Qalan sözlər hərəkət bildirmir." };
        }
        const o = pick(NONF_ALL), four = sample(POOL.filter(x => !x.neg), 4);
        if (new Set(four.map(x => x.w)).size < 4) return null;
        const ch = shuffle([...four.map(x => x.w), o.w]);
        return { text: "Ümumi qrammatik mənasına görə biri fərqlidir:", choices: ch, correct: ch.indexOf(o.w), show: o.w,
          solution: "“" + o.w + "” — " + o.t + ", hərəkət bildirmir. Qalan dördü hərəkət bildirir, feildir: " + four.map(x => x.w).join(", ") + "." };
      } },
    { id: "tesdiq", ad: "Təsdiq və inkar forması", izah: "Hərəkətin icra olunmadığını bildirmək üçün feilə -ma² şəkilçisi artırılır. -ır⁴ və -ar² şəkilçiləri ilə işlənəndə -ma²-nın saiti düşür: bilir / bilmir.",
      gen() {
        const m = R(3);
        if (m === 0) {
          const ws = sample(POOL, 5), non = R(10) < 7 ? [pick(NONF_ALL)] : [];
          if (new Set(ws.map(x => x.w)).size < 5 || new Set(ws.map(x => x.neg)).size < 2) return null;
          const items = shuffle([...ws.map(x => ({ w: x.w, g: x.neg ? 1 : 0 })), ...non.map(x => ({ w: x.w, g: 2 }))]);
          const qrup = ["təsdiq forması", "inkar forması", "feil deyil"];
          return { text: "Sözləri qruplara ayır.", bol: { soz: items.map(x => x.w), qrup, duz: items.map(x => x.g) },
            show: items.map(x => x.w + " → " + qrup[x.g]).join("; "), solution: items.map(x => "“" + x.w + "” — " + (x.g === 2 ? "feil deyil" : x.g ? "inkar forması (-ma²)" : "təsdiq forması")).join("; ") + "." };
        }
        if (m === 1) {
          const s = pick(BANK.filter(x => feils(x).length === 2 && feils(x).some(f => f.neg) && feils(x).some(f => !f.neg))), fs = feils(s);
          return { text: "Cümlədə inkar formasında olan feilə toxun.", sec: { soz: s.map(x => x.w), duz: s.map((x, i) => x.f && x.neg ? i : -1).filter(i => i >= 0) },
            show: fs.filter(f => f.neg).map(f => f.w).join(", "), solution: fs.map(f => "“" + f.w + "” — " + (f.neg ? "inkar forması (-ma²)" : "təsdiq forması")).join("; ") + "." };
        }
        const vb = pick(VERBS), z = pick(["i", "k", "g"]), p = pick(PKEYS), right = form(vb, z, p, true);
        const wr = wrongCells(vb, z, p, true, "neg").map(c => form(vb, ...c)), ch = [...new Set(wr)].filter(x => x !== right).slice(0, 4);
        if (ch.length < 4) return null;
        const all = shuffle([right, ...ch]);
        return { text: "«" + vb.k + "-» feilinin " + cellTxt(z, p) + " inkar formasını seç.", choices: all, correct: all.indexOf(right), show: right,
          solution: "İnkar üçün kökə -ma² artırılır, sonra zaman şəkilçisi, sonda şəxs şəkilçisi gəlir: " + right + (z === "i" ? " (-ır⁴ ilə işlənəndə -ma²-nın saiti düşür)" : "") + "." };
      } },
    { id: "zaman", ad: "Feilin zamanı", izah: "İndiki zaman -ır⁴; keçmiş zaman -dı⁴, -mış⁴, -ıb⁴; gələcək zaman -acaq², -ar². Zaman şəkilçisi şəxs şəkilçisindən əvvəl gəlir.",
      gen() {
        const m = R(3);
        if (m === 0) {
          const s = pick(ONE), f = feilOf(s), opts = Object.values(ZAD);
          return { text: h("span", {}, "Fərqləndirilmiş feil hansı zamandadır?", line(markSent(s))), choices: opts, correct: opts.indexOf(ZAD[f.z]), show: ZAD[f.z], solution: explainZ(f) };
        }
        if (m === 1) {
          const s = pick(ONE), f = feilOf(s), opts = Object.values(SFX);
          return { text: h("span", {}, "Fərqləndirilmiş feildə zaman şəkilçisi hansıdır?", line(markSent(s))), choices: opts, correct: opts.indexOf(SFX[f.sfx]), show: SFX[f.sfx], solution: explainZ(f) };
        }
        const vb = pick(VERBS), z = pick(["i", "k", "g"]), p = pick(PKEYS), neg = R(2) === 1, right = form(vb, z, p, neg);
        const ch = [...new Set(wrongCells(vb, z, p, neg, "zaman").map(c => form(vb, ...c)))].filter(x => x !== right).slice(0, 4);
        if (ch.length < 4) return null;
        const all = shuffle([right, ...ch]);
        return { text: "«" + vb.k + "-» feilinin " + cellTxt(z, p) + " " + (neg ? "inkar" : "təsdiq") + " formasını seç.", choices: all, correct: all.indexOf(right), show: right,
          solution: "Kökə " + (neg ? "-ma² (inkar), " : "") + "zaman şəkilçisi (" + SFX[z === "i" ? "ir" : z === "k" ? "di" : "acaq"] + "), sonra şəxs şəkilçisi artırılır: " + right + "." };
      } },
    { id: "sexs", ad: "Feilin şəxsi", izah: "Şəxs şəkilçiləri hərəkətin hansı şəxs tərəfindən icra olunduğunu bildirir və zaman şəkilçisindən sonra qoşulur: yazıram, oxudum, gedəcəksən, vurdular.",
      gen() {
        if (R(2)) {
          const s = pick(ONE), f = feilOf(s), opts = PKEYS.map(k => PAD[k]);
          return { text: h("span", {}, "Fərqləndirilmiş feil hansı şəxsə aiddir?", line(markSent(s))), choices: opts, correct: opts.indexOf(PAD[f.p]), show: PAD[f.p], solution: explainP(f) };
        }
        const vb = pick(VERBS), z = pick(["i", "k", "g"]), p = pick(PKEYS), neg = R(4) === 0, right = form(vb, z, p, neg);
        const ch = [...new Set(wrongCells(vb, z, p, neg, "sexs").map(c => form(vb, ...c)))].filter(x => x !== right).slice(0, 4);
        if (ch.length < 4) return null;
        const all = shuffle([right, ...ch]);
        return { text: "«" + vb.k + "-» feilinin " + cellTxt(z, p) + " " + (neg ? "inkar" : "təsdiq") + " formasını seç.", choices: all, correct: all.indexOf(right), show: right,
          solution: "Zaman şəkilçisindən sonra " + PAD[p] + " şəkilçisi artırılır: " + right + "." };
      } },
    { id: "bolgu", ad: "Bölgü: zaman və şəxs", izah: "Feilləri zamana və ya şəxsə görə qruplara ayır. Feil olmayan söz də ola bilər.",
      gen() {
        const byZ = R(2) === 0, ws = sample(POOL, 5);
        if (new Set(ws.map(x => x.w)).size < 5) return null;
        if (byZ && new Set(ws.map(x => x.z)).size < 2) return null;
        if (!byZ && new Set(ws.map(x => x.p[0])).size < 2) return null;
        const non = R(10) < 7 ? [pick(NONF_ALL)] : [];
        const qrup = byZ ? [...Object.values(ZAD), "feil deyil"] : ["I şəxs", "II şəxs", "III şəxs", "feil deyil"];
        const items = shuffle([...ws.map(x => ({ w: x.w, g: byZ ? ["i", "k", "g"].indexOf(x.z) : +x.p[0] - 1, x })), ...non.map(x => ({ w: x.w, g: 3 }))]);
        return { text: byZ ? "Sözləri zamana görə qruplara ayır." : "Sözləri şəxsə görə qruplara ayır (təkdə və cəmdə fərq qoyma).", bol: { soz: items.map(x => x.w), qrup, duz: items.map(x => x.g) },
          show: items.map(x => x.w + " → " + qrup[x.g]).join("; "),
          solution: items.map(x => "“" + x.w + "” — " + (x.x ? (byZ ? ZAD[x.x.z] : PAD[x.x.p]) : "feil deyil")).join("; ") + "." };
      } },
    { id: "qurulus", ad: "Sadə, düzəltmə, mürəkkəb feil", izah: "Sadə feil — kök və qrammatik şəkilçilərdən; düzəltmə feil — kökə leksik şəkilçi artırılıb; mürəkkəb feil — iki və daha artıq sözün birləşməsindən.",
      gen() {
        const s = pick(ONE.filter(x => feilOf(x).q)), f = feilOf(s), opts = ["sadə feil", "düzəltmə feil", "mürəkkəb feil"], ans = QAD[f.q];
        const why = f.q === "S" ? "kök və qrammatik (zaman, şəxs) şəkilçilərindən ibarətdir, leksik şəkilçi yoxdur" : f.q === "D" ? "kökə leksik şəkilçi artırılıb: " + (DEC[f.w] || "") : f.q === "H" ? "iki feildən ibarətdir: " + f.w.replace("-", " + ") : "iki sözdən ibarətdir: " + f.w.replace(" ", " + ");
        return { text: h("span", {}, "Fərqləndirilmiş feil quruluşca hansı növdür?", line(markSent(s))), choices: opts, correct: opts.indexOf(ans), show: ans, solution: "“" + f.w + "” — " + why + "; deməli " + ans + "dir." };
      } },
    { id: "yazilis", ad: "Mürəkkəb feillərin yazılışı", izah: "Çoxu ayrı yazılır (kömək etmək, şad olmaq). Birinci tərəfi -ıb⁴ şəkilçisi qəbul etmiş iki feildən düzələnlər defislə yazılır (silib-süpürmək). Dərslik: bəxş etmək, cəzb etmək kimi feillərdə əsas söz ayrılıqda işlənmir.",
      gen() {
        const m = R(3);
        if (m === 0) {
          const y = pick(YAZ_FULL), ch = shuffle([y.r, ...y.w]);
          return { text: "«" + y.blank + "» cümləsinin boşluğuna düzgün yazılmış mürəkkəb feili seç.", choices: ch, correct: ch.indexOf(y.r), show: y.r,
            solution: "Düzgün yazılış: " + y.r + (y.k === "a" ? " (ayrı yazılan mürəkkəb feil)" : y.k === "h" ? " (tərəfləri defislə yazılan mürəkkəb feil)" : " (“göz-qulaq” defislə, “olmaq” ayrı yazılır)") + "." };
        }
        if (m === 1) {
          const r = pick(BIRL.h), ch = shuffle([r, ...sample(BIRL.a, 3)]);
          return { text: "Hansı mürəkkəb feilin tərəfləri defislə yazılır?", choices: ch, correct: ch.indexOf(r), show: r, solution: "“" + r + "” — iki feildən ibarətdir, tərəfləri defislə yazılır. Qalanları ayrı yazılan mürəkkəb feillərdir." };
        }
        const r = pick(BIRL.a), ch = shuffle([r, ...sample(BIRL.h, 3)]);
        return { text: "Hansı mürəkkəb feil ayrı yazılır?", choices: ch, correct: ch.indexOf(r), show: r, solution: "“" + r + "” — ayrı yazılan mürəkkəb feildir. Qalanlarının tərəfləri defislə yazılır." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird feilin zamanını, şəxsini və üçüncü əlamətini yazıb. Biri səhvdir — hansı?",
      gen() {
        const s = pick(ONE), f = feilOf(s), k = R(3);
        const z = k === 0 ? pick(["i", "k", "g"].filter(x => x !== f.z)) : f.z, p = k === 1 ? pick(PKEYS.filter(x => x !== f.p)) : f.p;
        const useNeg = R(2) === 0;
        let third, thirdOk;
        if (useNeg) { third = "forması: " + (k === 2 ? (f.neg ? "təsdiq" : "inkar") : (f.neg ? "inkar" : "təsdiq")); }
        else { const wrongS = Object.keys(SFX).filter(x => x !== f.sfx && !(f.sfx === "acaq" && x === "ar") && !(f.sfx === "ar" && x === "acaq")); third = "zaman şəkilçisi: " + SFX[k === 2 ? pick(wrongS) : f.sfx]; }
        const ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "«" + plain(s) + "» — şagirdin «" + f.w + "» feili üzrə təhlili: 1) zamanı: " + ZAD[z] + "; 2) şəxsi: " + PAD[p] + "; 3) " + third + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: [explainZ(f), explainP(f), "Düzgün: " + (useNeg ? (f.neg ? "inkar" : "təsdiq") + " forması" : SFX[f.sfx] + " şəkilçisi") + "."][k] + " Digər iki bənd düzdür." };
      } },
  ];
  levels.forEach(l => { const g = l.gen; l.gen = function () { for (let i = 0; i < 200; i++) { const q = g.call(l); if (q) return q; } throw new Error("no valid problem: " + l.id); }; });

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const FORMLAR = (n, f) => sample(POOL.filter(f || (() => true)), n);
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. qayda: doğru / səhv fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const m = R(4);
      if (m === 0) { const bad = pick(FIKIR_SEHV); return AEq("Feillə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      if (m === 1) { const ok = pick(FIKIR_DUZ); return AEq("Feillə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir."); }
      const [w, duz, sehv] = pick(PROFIL);
      if (m === 2) { const bad = pick(sehv); return AEq("“" + w + "” feili ilə bağlı səhv fikri müəyyən edin.", bad, sample(duz, 4), "“" + w + "”: " + duz.join(", ") + ". Səhv fikir: " + bad + "."); }
      const ok = pick(duz); return AEq("“" + w + "” feili ilə bağlı doğru fikri müəyyən edin.", ok, sample(sehv, 4), "“" + w + "”: " + duz.join(", ") + ". Doğru fikir: " + ok + ".");
    }) },
    // 2. ümumi qrammatik məna: biri fərqlidir (feil / feil deyil)
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (R(2)) { const o = pick(NONF_ALL), four = FORMLAR(4, x => !x.neg).map(x => x.w); return AEq("Ümumi qrammatik mənasına görə biri fərqlidir:", o.w, four, "“" + o.w + "” — " + o.t + ", hərəkət bildirmir. Qalan dördü hərəkət bildirən feillərdir: " + four.join(", ") + "."); }
      const f = FORMLAR(1, x => !x.neg)[0], t = pick(Object.keys(NONF)), four = sample(NONF[t], 4);
      return AEq("Ümumi qrammatik mənasına görə biri fərqlidir:", f.w, four, "“" + f.w + "” — feildir, hərəkət bildirir. Qalan dördü " + t + ": " + four.join(", ") + ".");
    }) },
    // 3. inkar / təsdiq forması
    { tip: "qapali", gen: () => Oyun.again(() => {
      const wantNeg = R(2) === 0, a = ONE.filter(s => feilOf(s).neg), b = ONE.filter(s => !feilOf(s).neg);
      const odd = pick(wantNeg ? a : b), four = sample(wantNeg ? b : a, 4);
      const lab = s => feilOf(s).w + " — " + (feilOf(s).neg ? "inkar" : "təsdiq");
      return AEq(wantNeg ? "Cümlələrin birində feil inkar formasındadır. Həmin cümləni müəyyən edin." : "Cümlələrin birində feil təsdiq formasındadır, qalanlarında inkar formasındadır. Həmin cümləni müəyyən edin.", plain(odd), four.map(plain),
        "“" + lab(odd) + "”" + (wantNeg ? " (-ma² şəkilçisi var)" : "") + ". Qalanları: " + four.map(lab).join("; ") + ".");
    }) },
    // 4. zaman
    { tip: "qapali", gen: () => Oyun.again(() => {
      const z = pick(["i", "k", "g"]), odd = pick(ONE.filter(s => feilOf(s).z === z)), four = sample(ONE.filter(s => feilOf(s).z !== z), 4);
      if (four.filter(s => feilOf(s).z === "i").length > 3) return null;
      const lab = s => feilOf(s).w + " — " + ZAD[feilOf(s).z];
      return AEq("Hansı cümlədə feil " + ZAD[z] + "dadır?", plain(odd), four.map(plain), "“" + lab(odd) + "” (" + SFX[feilOf(odd).sfx] + "). Qalanları: " + four.map(lab).join("; ") + ".");
    }) },
    // 5. şəxs
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ps = sample(PKEYS, 5), p = pick(ps), fs = ps.map(q => pick(POOL.filter(x => x.p === q && !x.neg)));
      if (new Set(fs.map(x => x.w)).size < 5) return null;
      const right = fs[ps.indexOf(p)], wr = fs.filter(x => x !== right);
      return AEq("Feillərdən hansı " + loc(PAD[p]) + "dir?", right.w, wr.map(x => x.w), fs.map(x => "“" + x.w + "” — " + PAD[x.p]).join("; ") + ". Cavab: “" + right.w + "”.");
    }) },
    // 6. zaman və şəxs təhlili
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(ONE), f = feilOf(s), cell = (z, p) => ZAD[z] + ", " + PAD[p];
      const all = []; ["i", "k", "g"].forEach(z => PKEYS.forEach(p => { if (!(z === f.z && p === f.p)) all.push(cell(z, p)); }));
      return AEq(h("span", {}, "Fərqləndirilmiş feilin zamanı və şəxsi hansı variantda düzgün göstərilib?", line(markSent(s))), cell(f.z, f.p), sample(all, 4), explainZ(f) + " " + explainP(f));
    }) },
    // 7. nömrə kombinasiyası: zaman
    { tip: "qapali", gen: () => Oyun.again(() => {
      const z = pick(["i", "k", "g"]), five = sample(POOL, 5);
      if (new Set(five.map(x => x.w)).size < 5) return null;
      const right = five.map((x, i) => x.z === z ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş feillərdən hansılar " + ZAD[z] + "dadır?", line(five.map((x, i) => x.w + SUP[i]).join(", "))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + ZAD[x.z]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 8. nömrə kombinasiyası: inkar
    { tip: "qapali", gen: () => Oyun.again(() => {
      const wantNeg = R(3) > 0, five = sample(ONE, 5);
      const right = five.map((s, i) => feilOf(s).neg === wantNeg ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə feil " + (wantNeg ? "inkar" : "təsdiq") + " formasındadır?", ...five.map((s, i) => h("span", { style: "display:block" }, (i + 1) + ". ", plain(s)))), ...o, show: o.choices[o.correct],
        solution: five.map((s, i) => (i + 1) + ") " + feilOf(s).w + " — " + (feilOf(s).neg ? "inkar" : "təsdiq")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 9. quruluşca növ
    { tip: "qapali", gen: () => Oyun.again(() => {
      const pool = ONE.filter(s => feilOf(s).q), by = t => pool.filter(s => (t === "M" ? ["M", "H"].includes(feilOf(s).q) : feilOf(s).q === t));
      const t = pick(["S", "D", "M"]), odd = pick(by(t)), others = shuffle(pool.filter(s => !by(t).includes(s))).slice(0, 4);
      const nm = { S: "sadə", D: "düzəltmə", M: "mürəkkəb" }[t], lab = s => feilOf(s).w + " — " + QAD[feilOf(s).q].replace(" feil", "");
      return AEq("Hansı cümlədə feil quruluşca " + nm + "dir?", plain(odd), others.map(plain), "“" + lab(odd) + "”. Qalanları: " + others.map(lab).join("; ") + ".");
    }) },
    // 10. yazılış
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(YAZ_FULL, 5);
      if (R(2)) { const odd = five[0], wr = five.slice(1).map(y => pick(y.sw));
        return AEq("Hansı cümlədə mürəkkəb feil düzgün yazılıb?", odd.s, wr, "Düzgün: “" + odd.r + "”. Qalan cümlələrdə mürəkkəb feil səhv yazılıb: düzgün yazılışlar — " + five.slice(1).map(y => y.r).join(", ") + "."); }
      const odd = five[0], right = five.slice(1).map(y => y.s);
      return AEq("Cümlələrin birində mürəkkəb feil səhv yazılıb. Həmin cümləni müəyyən edin.", pick(odd.sw), right, "Düzgün yazılış: “" + odd.r + "”. Qalan cümlələrdə düzgündür.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== müstəqil yoxlama siyahısı (Codex cavabsız həll edəcək) ========
  const Y = [];
  let n = 0; const add = (sual, cavab) => Y.push({ id: "q" + (++n), sual, cavab });
  const FORMA = "(təsdiq, inkar)";
  BANK.forEach(s => feils(s).forEach(f => {
    const base = "«" + plain(s) + "» cümləsində «" + f.w + "» feili";
    add(base + " hansı zamandadır? " + ZAD_LIST, ZAD[f.z]);
    add(base + " hansı şəxsə və kəmiyyətə aiddir? " + PAD_LIST, PAD[f.p]);
    add(base + " təsdiq, yoxsa inkar formasındadır? " + FORMA, f.neg ? "inkar" : "təsdiq");
    if (!["ir", "di"].includes(f.sfx)) add(base + ": zaman şəkilçisi hansıdır? " + SFX_LIST, SFX[f.sfx]);
    if (f.q) add(base + " quruluşca hansı növdür? (sadə feil, düzəltmə feil, mürəkkəb feil)", QAD[f.q]);
  }));
  YAZ_FULL.forEach(y => add("«" + y.blank + "» cümləsinin boşluğuna uyğun gələn düzgün yazılış hansıdır? " + shuffle([y.r, ...y.w]).join(" / "), y.r));
  add("«and-aman etmək» mürəkkəb feilinin düzgün yazılışı hansıdır? and-aman etmək / andaman etmək / and aman etmək / and-amanetmək", "and-aman etmək");
  add("«göz-qulaq olmaq» mürəkkəb feilinin düzgün yazılışı hansıdır? göz-qulaq olmaq / gözqulaq olmaq / göz qulaq olmaq / göz-qulaqolmaq", "göz-qulaq olmaq");
  ["xahiş", "nail", "and-aman", "cəhd", "mane", "muğayat", "mübahisə", "göz-qulaq"].forEach(w => add("«" + w + "» sözünə mürəkkəb feil düzəltmək üçün «etmək», yoxsa «olmaq» artırılır? (etmək, olmaq)", ["xahiş", "and-aman", "cəhd", "mübahisə"].includes(w) ? "etmək" : "olmaq"));
  // forma düzəltmə (generator yoxlanır)
  VERBS.forEach((vb, i) => { for (let j = 0; j < 4; j++) { const z = ["i", "k", "g"][(i + j) % 3], p = PKEYS[(i * 2 + j * 3) % 6], neg = (i + j) % 3 === 1;
    add("«" + vb.k + "-» feil kökündən " + cellTxt(z, p) + " " + (neg ? "inkar" : "təsdiq") + " formasını yazın (zaman şəkilçisi, sonra şəxs şəkilçisi; inkar üçün -ma²).", form(vb, z, p, neg)); } });
  [["bilir", "bilmir", "indiki zaman, III şəxsin təki"], ["bilərəm", "bilmərəm", "gələcək zaman, I şəxsin təki"], ["aldım", "almadım", "keçmiş zaman, I şəxsin təki"], ["bildim", "bilmədim", "keçmiş zaman, I şəxsin təki"], ["gəlirəm", "gəlmirəm", "indiki zaman, I şəxsin təki"],
    ["yazacaqsan", "yazmayacaqsan", "gələcək zaman, II şəxsin təki"], ["oxudu", "oxumadı", "keçmiş zaman, III şəxsin təki"], ["görürsünüz", "görmürsünüz", "indiki zaman, II şəxsin cəmi"], ["gedəcəyik", "getməyəcəyik", "gələcək zaman, I şəxsin cəmi"],
    ["qaçırlar", "qaçmırlar", "indiki zaman, III şəxsin cəmi"], ["verdilər", "vermədilər", "keçmiş zaman, III şəxsin cəmi"], ["açacağam", "açmayacağam", "gələcək zaman, I şəxsin təki"]]
    .forEach(([a, b, c]) => add("«" + a + "» feilinin inkar formasını yazın (" + c + ").", b));
  [["oxuyacaq", "y"], ["deyir", "y"], ["istəyir", "y"], ["oxuyacağam", "y"]].forEach(([w, c]) => add("«" + w + "» feilində saitlə bitən kök ilə saitlə başlayan şəkilçi arasında hansı bitişdirici samit işlənib?", c));
  [["gəlir", "gəlmir"], ["bilir", "bilmir"], ["bilərəm", "bilmərəm"]].forEach(([a, b]) => add("«" + a + " → " + b + "» inkar formasında -ma² şəkilçisinin saiti saxlanılırmı? (saxlanılır, düşür)", "düşür"));
  [["aldım", "almadım"], ["bildim", "bilmədim"]].forEach(([a, b]) => add("«" + a + " → " + b + "» inkar formasında -ma² şəkilçisinin saiti saxlanılırmı? (saxlanılır, düşür)", "saxlanılır"));
  ["ir", "di", "mis", "ib", "acaq", "ar"].forEach(k => add(SFX[k] + " şəkilçisi hansı zamanı bildirir? " + ZAD_LIST + " (dərslikdə -ar² gələcək zamanın şəkilçisi kimi verilir)", ZAD[SFX_ZAMAN[k]]));
  add("Feillərə şəxs şəkilçiləri zaman şəkilçilərindən əvvəl, yoxsa sonra qoşulur? (əvvəl, sonra)", "sonra");
  add("Dərslikdə gələcək zamanın şəkilçiləri hansı variantlı şəkilçilər kimi verilib? (ikivariantlı, dördvariantlı)", "ikivariantlı");
  FIKIR_DUZ.forEach(f => add("Fikir doğrudurmu (Azərbaycan dili qaydasına görə)? «" + f + "» (doğru/səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => add("Fikir doğrudurmu (Azərbaycan dili qaydasına görə)? «" + f + "» (doğru/səhv)", "səhv"));
  PROFIL.forEach(([w, duz, sehv]) => { duz.forEach(f => add("«" + w + "» feili haqqında fikir doğrudurmu? «" + f + "» (doğru/səhv)", "doğru")); sehv.forEach(f => add("«" + w + "» feili haqqında fikir doğrudurmu? «" + f + "» (doğru/səhv)", "səhv")); });
  Object.entries(NONF).forEach(([t, a]) => a.forEach(w => add("«" + w + "» sözü hərəkət bildirən feildirmi? (bəli, xeyr)", "xeyr")));
  Object.entries(DEC).forEach(([w, d]) => add("«" + w + "» feili quruluşca sadə, düzəltmə, yoxsa mürəkkəbdir? Hissələrə ayrılışı: " + d, "düzəltmə"));
  window.__yoxla = Y;

  window.__levels = levels;
  window.__bank = { BANK, VERBS, POOL, NONF, FIKIR_DUZ, FIKIR_SEHV, PROFIL, YAZ, DEC, form };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-feil-1", title: "Feil I: forma və zaman", fenn: "azdili", link: "dersler/az-feil-1.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Feilin zamanını, şəxsini, təsdiq və ya inkar formasını, quruluşunu cümlədəki işlənməsinə görə müəyyən et.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hereket", "tesdiq", "tesdiq", "zaman", "zaman", "sexs", "bolgu", "qurulus", "yazilis", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-feil-1.html")) b.push("dersler/az-feil-1.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
