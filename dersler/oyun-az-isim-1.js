// Azərbaycan dili · İsim I: növləri, tək və cəm, toplu isim — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024), s. 16–17 (isim; cəm; toplu isimlər — "Yadda saxla" s. 17;
// tapşırıqlar 5c, 6a, 6b, 6c, 6ç, 6d), s. 81 (sifətləşmiş isim isim hesab olunur); 5-ci sinif, 1-ci hissə (2024), s. 53
// (iki cür yazılan şəkilçilər: kitab+lar, təyyarə+lər); 6-cı sinif, 1-ci hissə (2025), s. 45 (şəxs, yer, ölkə, əsər, bayram
// adları), s. 90 (-izm: mücərrəd mənalı sözlər); 7-ci sinif, 2-ci hissə, s. 12 (yaxşılıq — mücərrəd isim).
// Konkret/mücərrəd və ümumi/xüsusi isimlərin tərifi 5–7-ci sinif dərsliklərində ayrıca "Yadda saxla" kimi verilməyib; tərif
// proqramın terminlərinə görə yazılıb və bank yalnız birmənalı sözlərdən qurulub (bax: menbe/az-isim-1.md).
// Suallar cümlə bankından qurulur: bankdakı hər isim cümlədəki işlənməsinə görə etiketlənib ("söz:ETİKET").
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const LETTER = /[\p{L}\d]/u;
  const SUP = "¹²³⁴⁵⁶⁷";
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const combo = arr => arr.length === 1 ? "yalnız " + arr[0] : arr.join(", ");
  function comboChoices(right, n = 5) {
    const all = [];
    for (let m = 1; m < (1 << n) - 1; m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1); if (s.length <= 4) all.push(s); }
    const key = s => s.join(",");
    const wrong = sample(all.filter(s => key(s) !== key(right)), 4);
    return Oyun.ae(combo(right), wrong.map(combo), x => x);
  }
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };

  // ---- cümlə bankı. Etiket: K konkret isim, M mücərrəd isim (yalnız K/M-li cümlələrdə), X xüsusi isim, T toplu isim,
  // U ümumi isim (konkret/mücərrəd soruşulmur); "+" — cəm şəkilçisi (-lar, -lər) qəbul edib. Etiketsiz söz isim deyil.
  // Kütlə: "insan kütləsi" (insanların çoxluğu) — T; "cismin kütləsi" (fiziki xüsusiyyət) — U, toplu isim deyil.
  const RAW = [
    // konkret və mücərrəd isimlər (yalnız K/M)
    "Uşağın:K gözlərində:K+ sevinc:M görünürdü .",
    "Biz dostluğu:M dəyərli sayırıq .",
    "Qardaşım:K cəsarət:M göstərdi .",
    "Müəllim:K şagirdlərin:K+ biliyini:M yoxladı .",
    "Sədaqət:M insanı:K ucaldır .",
    "Bu kitabda:K qəhrəmanlıqdan:M danışılır .",
    "Həqiqəti:M bütün insanlar:K+ bilməlidir .",
    "Quşlar:K+ ağacın:K budağına:K qonmuşdular .",
    "Qorxu:M bəzən adamı:K dayandırır .",
    "Həkim:K uşağa:K diqqət:M göstərdi .",
    "Nənəm:K bizə mehribanlıq:M öyrədir .",
    "Çayın:K sahilində:K balıqçılar:K+ oturmuşdular .",
    "Sülh:M və əmin-amanlıq:M bütün insanlar:K+ üçün vacibdir .",
    "Ana:K övladına:K sevgi:M ilə baxırdı .",
    "Bağda:K iri güllər:K+ açmışdı .",
    "Dənizdə:K gəmilər:K+ üzürdü .",
    "Pişik:K divanda:K yatmışdı .",
    "Şagird:K qələmi:K masaya:K qoydu .",
    "Bu kitabın:K qəhrəmanı:K böyük xoşbəxtlik:M tapdı .",
    "Səbir:M və bilik:M insanı:K gücləndirir .",
    "Uşaqlar:K+ həyətdə:K top:K oynayırdılar .",
    "Həyətdə:K hündür ağaclar:K+ böyüyür .",
    "Müəllim:K şagirdlərdən:K+ səbir:M gözləyir .",
    "Həkim:K uşaqlara:K sağlamlıq:M arzulayır .",
    "Uşaqlar:K+ müəllimlərə:K+ hörmət:M göstərirlər .",
    "Dostum:K həmişə həqiqəti:M deyir .",
    "Hakim:K ədaləti:M qorudu .",
    "Alpinist:K qorxunu:M yendi .",
    "Bağban:K bağda:K zəhmət:M çəkir .",
    "Dənizçilər:K+ sülhü:M istəyirlər .",
    "Qonaqlar:K+ evimizdə:K mehribanlıq:M gördülər .",
    // xüsusi və ümumi isimlər
    "Səbinə:X kitabı:U Rəşada:X verdi .",
    "Kür:X Xəzərə:X tökülür .",
    "Əli:X Gəncədən:X kitab:U gətirdi .",
    "Sənan:X Lənkəranda:X yaşayır .",
    "Tural:X Şəkidən:X dəftər:U gətirdi .",
    "Araz:X Kürə:X qovuşur .",
    "Nizami:X şeirlər:U+ yazırdı .",
    "Füzuli:X qəzəllər:U+ yazırdı .",
    "Kitabı:U Səbinənin:X masasından:U götürdüm .",
    "Müəllim:U Orxanı:X lövhəyə:U çağırdı .",
    "Samir:X Naxçıvandan:X nar:U gətirdi .",
    "Kənan:X Bakıya:X gəldi .",
    "Orxan:X Gəncədə:X dostları:U+ ilə görüşdü .",
    "Gəmilər:U+ Xəzərdə:X üzür .",
    "Azərbaycanda:X xalçalar:U+ toxunur .",
    "Bakıda:X yeni körpülər:U+ tikilib .",
    "Rəşad:X şəkil:U çəkir .",
    "Rəşad:X Şəkiyə:X getdi .",
    "Səbinə:X Naxçıvanda:X yaşayır .",
    "Tural:X Kürün:X sahilində:U oturdu .",
    "Orxan:X Azərbaycana:X qayıtdı .",
    "Füzuli:X Bağdadda:X yaşayırdı .",
    "Kənan:X dəftəri:U Sənana:X verdi .",
    "Samir:X Lənkərandan:X şəkillər:U+ gətirdi .",
    "Nizami:X Gəncədə:X doğulub .",
    "Şagirdlər:U+ Bakıya:X gəldilər .",
    "Müəllim:U Tural:X ilə danışdı .",
    // toplu isimlər
    "Çoban:U sürünü:T yaylağa:U apardı .",
    "İlxıda:T bir-birindən gözəl atlar:U+ var idi .",
    "El:T bir olsa , dağ:U oynadar yerindən:U .",
    "Camaat:T meydana:U toplaşdı .",
    "Ordu:T sərhədi:U qoruyur .",
    "Əhali:T yeni qəsəbəyə:U köçdü .",
    "Xalq:T öz tarixini:U unutmur .",
    "Qoşunun:T komandiri:U əmr:U verdi .",
    "Naxırı:T çoban:U otlağa:U apardı .",
    "Meydanda:U böyük insan:U kütləsi:T toplaşmışdı .",
    "Xalqlar:T+ sülhü:U sevir .",
    "Sürü:T dərəyə:U enirdi .",
    "Qoşun:T sərhəddə:U dayandı .",
    "Ordu:T vətəni:U qoruyur .",
    "Əhali:T quyudan:U su:U daşıyır .",
    "Camaat:T yolu:U keçdi .",
    "Naxır:T otlaqda:U otlayırdı .",
    "Sürüyə:T çoban:U baxır .",
    "İlxı:T çöldə:U otlayır .",
    "Ordunun:T sərkərdəsi:U fərman:U verdi .",
    "Xalqın:T səsi:U eşidildi .",
    "Camaatın:T sevinci:U böyük idi .",
    "Əhalinin:T sayı:U artır .",
    "Küçədə:U insan:U kütləsi:T görünürdü .",
    // tələ: "kütlə" fiziki xüsusiyyət mənasında toplu isim deyil
    "Cismin:U kütləsi:U tərəzidə:U ölçülür .",
  ];
  function parse(str) {
    return str.split(" ").map(t => { const m = t.match(/^(.+):([KMUXT])(\+?)$/); return m ? { w: m[1], t: m[2], pl: !!m[3] } : { w: t, t: null, pl: false }; });
  }
  const SENT = RAW.map(parse);
  const plain = s => s.map((x, i) => (i && LETTER.test(x.w) ? " " : "") + x.w).join("");
  const nouns = s => s.filter(x => x.t);
  const has = (s, t) => s.some(x => x.t === t);
  const hasPl = s => s.some(x => x.pl);
  const idx = (s, f) => s.map((x, i) => x.t && f(x) ? i : -1).filter(i => i >= 0);
  const names = (s, f) => nouns(s).filter(f).map(x => x.w);
  const KM = SENT.filter(s => nouns(s).every(x => x.t === "K" || x.t === "M"));
  const XU = SENT.filter(s => has(s, "X") && nouns(s).every(x => x.t === "X" || x.t === "U"));
  const TU = SENT.filter(s => has(s, "T") && nouns(s).every(x => x.t === "T" || x.t === "U"));
  const TRAP = SENT.find(s => plain(s).startsWith("Cismin kütləsi"));
  const NOT_T = SENT.filter(s => !has(s, "T"));
  const NO_X = SENT.filter(s => !has(s, "X"));
  const LAB = { K: "konkret isim", M: "mücərrəd isim", U: "ümumi isim", X: "xüsusi isim", T: "toplu isim" };
  const lab = x => LAB[x.t] + (x.pl ? ", cəm şəkilçisi qəbul edib" : "");
  const nounSol = s => nouns(s).map(x => x.w + " — " + lab(x)).join("; ");

  // ---- söz bankları (hamısı birmənalı)
  const KW = ["kitab", "ağac", "qələm", "dəniz", "çiçək", "dağ", "pəncərə", "balıq", "bulud", "sərçə", "çanta", "stol", "dəftər", "qapı", "daş", "stəkan", "pişik", "maşın"];
  const MW = ["sevinc", "dostluq", "sədaqət", "səadət", "məsuliyyət", "qorxu", "bilik", "həqiqət", "cəsarət", "ədalət", "sülh", "xoşbəxtlik", "mehribanlıq", "qəhrəmanlıq", "yaxşılıq", "sevgi", "kədər", "hörmət", "səbir", "eqoizm", "realizm", "kapitalizm"];
  const SIF = ["mehriban", "ağıllı", "səbirli", "hündür", "geniş", "qorxaq", "səliqəli", "nazik", "dərin", "cəsarətli"];
  const XW = ["Bakı", "Gəncə", "Şəki", "Lənkəran", "Naxçıvan", "Kür", "Xəzər", "Azərbaycan", "Səbinə", "Tural", "Orxan", "Samir", "Kənan", "Nizami", "Füzuli"];
  const UW = ["şəhər", "çay", "dəniz", "dağ", "ölkə", "şagird", "müəllim", "kitab", "bayram", "uşaq", "həkim", "qəzet"];
  const CAP = ["Çiçək", "Bahar", "Damla", "Nərgiz", "Mirvari", "Sevinc", "Arzu", "Sədaqət"];   // 5-ci sinif, 2-ci hissə, s. 16, 5c
  const NOCAP = ["Səbinə", "Tural", "Orxan", "Samir", "Kənan"];
  const TW = ["camaat", "ordu", "xalq", "əhali", "sürü", "naxır", "ilxı", "qoşun"];
  const SW = ["kitab", "şagird", "çanta", "qələm", "dibçək", "həkim", "usta", "mahnı", "dəftər", "pişik", "ceyran"]; // 6ç: kitab/şagird/çanta; usta/mahnı/həkim; qələm/dibçək
  const HARM = ["kitab", "dəftər", "ağac", "çiçək", "qələm", "qapı", "göl", "dağ", "şagird", "uşaq", "otaq", "müəllim", "quş", "balıq", "ev", "gül", "yol", "söz", "göz", "stol", "pişik", "bülbül", "qəzet", "kəpənək", "böcək", "yarpaq"];
  // cəm şəkilçisi son saitə görə (5-ci sinif, 1-ci hissə, s. 53): qalın sait (a, ı, o, u) — -lar; incə (ə, e, i, ö, ü) — -lər
  const lastV = w => { const m = w.match(/[aıouəeiöü](?=[^aıouəeiöü]*$)/); return m ? m[0] : ""; };
  const thick = w => "aıou".includes(lastV(w));
  const plur = w => w + (thick(w) ? "lar" : "lər");
  const wrongPlur = w => w + (thick(w) ? "lər" : "lar");
  const SGL = ["kitab", "dəftər", "ağac", "çiçək", "qələm", "qapı", "dağ", "şagird", "uşaq", "quş", "balıq", "ev", "gül", "yol", "pişik", "çanta", "həkim", "ceyran"];
  const PW = SGL.map(plur);

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "mucerred", ad: "Mücərrəd isimlər", izah: "Mücərrəd isim hiss, keyfiyyət, hal və anlayışın adıdır — maddi varlığı yoxdur (sevinc, dostluq). Konkret isim maddi varlığı olan, duyğu üzvləri ilə qavranılan varlığın adıdır (kitab, ağac, külək).",
      gen() {
        const s = pick(KM.filter(x => has(x, "M"))), duz = idx(s, x => x.t === "M");
        return { text: "Cümlədəki mücərrəd isimlərə toxun.", sec: { soz: s.map(x => x.w), duz }, show: names(s, x => x.t === "M").join(", "),
          solution: "Mücərrəd isimlər: " + names(s, x => x.t === "M").join(", ") + " (hiss, keyfiyyət, hal, anlayış adı). " + (names(s, x => x.t === "K").length ? "Konkret isimlər: " + names(s, x => x.t === "K").join(", ") + " (maddi varlıq, duyğu üzvləri ilə qavranılır)." : "Cümlədə konkret isim yoxdur.") };
      } },
    { id: "kmbol", ad: "Bölgü: konkret, mücərrəd, sifət", izah: "Hər sözü qrupuna ayır. Diqqət: “gözəllik” isimdir, “gözəl” sifətdir; sifət əlamət bildirir (necə?).",
      gen() {
        const k = sample(KW, 2 + R(2)), m = sample(MW, 2 + R(2)), f = pick(SIF);
        const items = shuffle([...k.map(w => [w, "konkret isim"]), ...m.map(w => [w, "mücərrəd isim"]), [f, "sifət"]]);
        const decoy = pick(["xüsusi isim", "feil", "say"]);
        const qrup = shuffle(["konkret isim", "mücərrəd isim", "sifət", decoy]);
        return { text: "Sözləri qruplara ayır.", bol: { soz: items.map(x => x[0]), qrup, duz: items.map(x => qrup.indexOf(x[1])) },
          show: items.map(x => x[0] + " — " + x[1]).join("; "), solution: items.map(x => x[0] + " — " + x[1]).join("; ") + ". Konkret isim maddi varlığın adıdır; mücərrəd isim hiss, keyfiyyət, anlayış adıdır; sifət “necə?” sualına cavab verir." };
      } },
    { id: "xususi", ad: "Xüsusi isimlər", izah: "Xüsusi isim tək bir şəxsin, yerin, ölkənin adıdır və böyük hərflə yazılır. Cümlənin əvvəlindəki böyük hərf xüsusi isim demək deyil.",
      gen() {
        const s = pick(XU), duz = idx(s, x => x.t === "X");
        return { text: "Cümlədəki xüsusi isimlərə toxun.", sec: { soz: s.map(x => x.w), duz }, show: names(s, x => x.t === "X").join(", "),
          solution: "Xüsusi isimlər: " + names(s, x => x.t === "X").join(", ") + " (konkret şəxs və ya yer adı). " + (names(s, x => x.t === "U").length ? "Ümumi isimlər: " + names(s, x => x.t === "U").join(", ") + "." : "") };
      } },
    { id: "umxus", ad: "Ümumi və xüsusi isim", izah: "Ümumi isim eyni cinsdən olan əşyaların ortaq adıdır (şəhər), xüsusi isim tək birinin adıdır (Bakı). Bəzi adlar kiçik hərflə yazılsa, ümumi isim olur (Çiçək — çiçək).",
      gen() {
        const m = R(3);
        if (m === 0) { const odd = pick(UW), four = sample(XW, 4), ch = shuffle([...four, odd]);
          return { text: "İsim növünə görə biri fərqlidir:", choices: ch, correct: ch.indexOf(odd), show: odd, solution: "“" + odd + "” — ümumi isim (eyni cinsdən olan əşyaların ortaq adı). Qalanları xüsusi isimdir: tək bir şəhərin, çayın, ölkənin və ya şəxsin adı." }; }
        if (m === 1) { const odd = pick(XW), four = sample(UW, 4), ch = shuffle([...four, odd]);
          return { text: "İsim növünə görə biri fərqlidir:", choices: ch, correct: ch.indexOf(odd), show: odd, solution: "“" + odd + "” — xüsusi isim (tək bir şəxsin və ya yerin adı, böyük hərflə). Qalanları ümumi isimdir." }; }
        const right = pick(CAP), ch = shuffle([right, ...sample(NOCAP, 4)]);
        return { text: "Hansı xüsusi ismin ilk hərfi kiçik yazılsa, ümumi isim kimi qəbul edilə bilər?", choices: ch, correct: ch.indexOf(right), show: right,
          solution: "“" + right + "” — kiçik hərflə (“" + right.toLocaleLowerCase("az") + "”) ümumi isimdir. Qalanları yalnız ad kimi işlənir." };
      } },
    { id: "cem", ad: "Tək və cəm", izah: "Cəm şəkilçisi -lar, -lər sözün son saitinə görə yazılır: qalın sait — -lar (kitablar), incə sait — -lər (dəftərlər). Feildəki -lar, -lər ismin cəmi deyil.",
      gen() {
        if (Math.random() < .6) {
          const s = pick(SENT.filter(hasPl)), duz = idx(s, x => x.pl);
          return { text: "Cəm şəkilçisi qəbul etmiş isimlərə toxun.", sec: { soz: s.map(x => x.w), duz }, show: names(s, x => x.pl).join(", "),
            solution: "Cəm şəkilçisi (-lar, -lər) qəbul etmiş isimlər: " + names(s, x => x.pl).join(", ") + ". Digər isimlər tək formadadır; feildəki -lar, -lər ismin cəmi deyil." };
        }
        const w = sample(HARM, 4), right = plur(w[0]), wrong = w.slice(1).map(wrongPlur), ch = shuffle([right, ...wrong]);
        return { text: "Cəm şəkilçisi düzgün yazılmış sözü seç:", choices: ch, correct: ch.indexOf(right), show: right,
          solution: "“" + w[0] + "” sözünün son saiti " + (thick(w[0]) ? "qalındır" : "incədir") + ", ona -" + (thick(w[0]) ? "lar" : "lər") + " artırılır: " + right + "." };
      } },
    { id: "toplu", ad: "Cümlədə toplu isim", izah: "Toplu isim cəm şəkilçisi qəbul etmədən çoxluq bildirir: camaat, ordu, xalq, əhali. Cümlədəki sözlərdən hansı çoxluğu şəkilçisiz bildirir?",
      gen() {
        const s = pick(TU), duz = idx(s, x => x.t === "T");
        return { text: "Cümlədəki toplu ismə toxun.", sec: { soz: s.map(x => x.w), duz }, show: names(s, x => x.t === "T").join(", "),
          solution: "Toplu isim: " + names(s, x => x.t === "T").join(", ") + " — cəm şəkilçisi olmadan çoxluq bildirir. Qalan isimlər toplu deyil: " + names(s, x => x.t !== "T").join(", ") + "." };
      } },
    { id: "toplusec", ad: "Toplu isim, yoxsa yox", izah: "Toplu isim şəkilçisiz çoxluq bildirir (ordu). Cəm isim şəkilçi ilə (şagirdlər). Çoxluq mənası olmayan söz toplu deyil: “cismin kütləsi” — fiziki xüsusiyyətdir.",
      gen: () => Oyun.again(() => {
        const m = R(3);
        if (m === 0) { const right = pick(TW), ch = shuffle([right, ...sample(PW, 4)]);
          return { text: "Cəm şəkilçisi qəbul etmədən çoxluq bildirən isim hansıdır?", choices: ch, correct: ch.indexOf(right), show: right,
            solution: "“" + right + "” — toplu isim: şəkilçisiz çoxluq bildirir. Qalanları cəm şəkilçisi (-lar, -lər) ilə çoxluq bildirir." }; }
        if (m === 1) { const right = pick(SW), ch = shuffle([right, ...sample(TW, 4)]);
          return { text: "Hansı söz toplu isim deyil?", choices: ch, correct: ch.indexOf(right), show: right,
            solution: "“" + right + "” — bir əşyanın adıdır. Qalanları cəm şəkilçisi olmadan çoxluq bildirir — toplu isimdir." }; }
        const useTrap = Math.random() < .5, noT = useTrap ? TRAP : pick(NOT_T.filter(x => x !== TRAP));
        let four = sample(TU, 4);
        if (useTrap && !four.some(x => has(x, "T") && x.some(y => y.w === "kütləsi"))) four[0] = pick(TU.filter(x => x.some(y => y.w === "kütləsi")));
        if (new Set(four).size < 4) four = sample(TU, 4);
        const ch = shuffle([noT, ...four]).map(plain), right = plain(noT);
        if (new Set(ch).size !== 5) return null;
        return { text: "Cümlələrin birində toplu isim işlənməyib:", choices: ch, correct: ch.indexOf(right), show: right,
          solution: "“" + right + "” cümləsində toplu isim yoxdur" + (useTrap ? " (“kütlə” burada cismin fiziki xüsusiyyətidir, çoxluq deyil)" : "") + ". Digər cümlələrdə toplu isim var: " + four.map(x => names(x, y => y.t === "T").join(", ")).join("; ") + "." };
      }) },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümlədə üç ismin növünü və ya tək/cəmliyini yazıb. Biri səhvdir — hansı?",
      gen: () => Oyun.again(() => {
        const s = pick(SENT.filter(x => nouns(x).length >= 3)), ns = sample(nouns(s), 3).sort((a, b) => s.indexOf(a) - s.indexOf(b)), k = R(3);
        const WRONG = { K: "mücərrəd isim", M: "konkret isim", U: "xüsusi isim", X: "ümumi isim" };
        const kind = ns.map(x => x.t !== "T" && Math.random() < .35 ? "num" : "tip");
        const truth = (x, kd) => kd === "num" ? (x.pl ? "cəm şəkilçisi qəbul edib" : "tək formada işlənib") : LAB[x.t];
        const wrong = (x, kd) => kd === "num" ? (x.pl ? "tək formada işlənib" : "cəm şəkilçisi qəbul edib") : x.t === "T" ? (x.pl ? null : "cəm şəkilçisi qəbul edib") : WRONG[x.t];
        const cl = ns.map((x, j) => j === k ? wrong(x, kind[j]) : truth(x, kind[j]));
        if (cl.some(c => !c)) return null;
        const ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "«" + plain(s) + "» — şagirdin təhlili: " + ns.map((x, j) => (j + 1) + ") " + x.w + " — " + cl[j]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "“" + ns[k].w + "” — " + truth(ns[k], kind[k]) + ", “" + cl[k] + "” deyil. Digər iki bənd düzdür." };
      }) },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E) ========
  const FIKIR_DUZ = [
    "Toplu isimlər cəm şəkilçisi qəbul etmədən çoxluq bildirir.",
    "Toplu isimlərə də cəm şəkilçisi artırmaq olar.",
    "“Camaat” və “əhali” sözləri cəm şəkilçisi qəbul etmir.",
    "Camaat insanların çoxluğunu bildirən toplu isimdir.",
    "Ordu hərbçilərin çoxluğunu bildirən toplu isimdir.",
    "Cəm şəkilçisi -lar, -lər sözün son saitinin qalın və ya incə olmasına görə iki cür yazılır.",
    "Sifətləşmiş isim (daş hasar) isim hesab olunur.",
    "Xüsusi isimlər böyük hərflə yazılır.",
    "Bəzi xüsusi isimlər kiçik hərflə yazılanda ümumi isim kimi qəbul edilə bilər.",
    "Mücərrəd isim hiss, keyfiyyət, hal və anlayışın adıdır (maddi varlığı yoxdur).",
    "Konkret isim maddi varlığı olan, duyğu üzvləri ilə qavranılan varlığın adıdır.",
    "“Yaxşılıq” sözü sifətə şəkilçi qoşulmaqla yaranmış mücərrəd isimdir.",
  ];
  const FIKIR_SEHV = [
    "Toplu isimlər yalnız cəm şəkilçisi ilə çoxluq bildirir.",
    "Toplu isimlərə cəm şəkilçisi heç vaxt artırmaq olmaz.",
    "“Camaat” sözünə cəm şəkilçisi artırmaq olar.",
    "“Əhali” sözü cəm şəkilçisi qəbul edir.",
    "“Şagirdlər” sözü toplu isimdir.",
    "Mücərrəd isimlər maddi varlığı olan əşyaların adıdır.",
    "Xüsusi isimlər eyni cinsdən olan əşyaların hamısının ortaq adıdır.",
    "Ümumi isimlər həmişə böyük hərflə yazılır.",
    "Sifətləşmiş isim (dəmir darvaza) sifət hesab olunur.",
    "Cəm şəkilçisi sözün son saitindən asılı olmayaraq həmişə eyni cür yazılır.",
    "“Ordu” sözü cəm şəkilçisi ilə çoxluq bildirən cəm isimdir.",
    "Cümlənin əvvəlində böyük hərflə yazılan isim həmişə xüsusi isimdir.",
  ];
  // söz haqqında fikirlər: [söz, doğru fikirlər, səhv fikirlər]
  const PROFIL = [
    ["camaat", ["toplu isimdir", "insanların çoxluğunu bildirir", "cəm şəkilçisi qəbul etmir", "cəm şəkilçisi olmadan çoxluq bildirir"], ["cəm şəkilçisi qəbul edən isimdir", "xüsusi isimdir", "toplu isim deyil", "heyvanların çoxluğunu bildirir"]],
    ["əhali", ["toplu isimdir", "cəm şəkilçisi qəbul etmir", "cəm şəkilçisi olmadan çoxluq bildirir"], ["cəm şəkilçisi qəbul edir", "xüsusi isimdir", "cəmdə işlənmiş isimdir", "mücərrəd isimdir"]],
    ["ordu", ["toplu isimdir", "hərbçilərin çoxluğunu bildirir", "cəm şəkilçisi olmadan çoxluq bildirir"], ["cəm şəkilçisi qəbul etmiş isimdir", "xüsusi isimdir", "heyvanların çoxluğunu bildirir"]],
    ["xalq", ["toplu isimdir", "cəm şəkilçisi qəbul edə bilər (xalqlar)", "cəm şəkilçisi olmadan çoxluq bildirir"], ["cəm şəkilçisi heç vaxt qəbul etmir", "xüsusi isimdir", "mücərrəd isimdir"]],
    ["sürü", ["toplu isimdir", "heyvanların çoxluğunu bildirir", "cəm şəkilçisi olmadan çoxluq bildirir"], ["xüsusi isimdir", "cəmdə işlənmiş isimdir", "mücərrəd isimdir"]],
    ["Bakı", ["xüsusi isimdir", "böyük hərflə yazılır", "yer adıdır", "tək bir şəhərin adıdır"], ["ümumi isimdir", "mücərrəd isimdir", "toplu isimdir", "cəm şəkilçisi qəbul edib"]],
    ["sevinc", ["mücərrəd isimdir", "isimdir", "hiss adıdır"], ["konkret isimdir", "xüsusi isimdir", "toplu isimdir", "sifətdir"]],
    ["dostluq", ["mücərrəd isimdir", "isimdir", "münasibət anlayışının adıdır"], ["konkret isimdir", "sifətdir", "toplu isimdir", "xüsusi isimdir"]],
    ["kitablar", ["cəmdə işlənmiş isimdir", "cəm şəkilçisi qəbul edib", "konkret isimdir"], ["toplu isimdir", "mücərrəd isimdir", "xüsusi isimdir", "tək formada işlənib"]],
  ];

  const sol3 = s => "“" + plain(s) + "” — " + nounSol(s) + ".";
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    { tip: "qapali", gen: () => Oyun.again(() => {
      const odd = Math.random() < .5 ? "M" : "K", pool = odd === "M" ? [MW, KW] : [KW, MW], right = pick(pool[0]), four = sample(pool[1], 4);
      const o = odd === "M" ? ["mücərrəd", "konkret"] : ["konkret", "mücərrəd"];
      return AEq("Konkret və mücərrəd isimlərə görə biri fərqlidir:", right, four, "“" + right + "” — " + o[0] + " isimdir. Qalanları " + o[1] + " isimdir.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const noM = pick(KM.filter(x => !has(x, "M"))), four = sample(KM.filter(x => has(x, "M")), 4);
      return AEq("Cümlələrin birində mücərrəd isim işlənməyib:", plain(noM), four.map(plain), "“" + plain(noM) + "” cümləsində yalnız konkret isimlər var (" + names(noM, x => true).join(", ") + "). Digər cümlələrdə mücərrəd isim: " + four.map(x => names(x, y => y.t === "M").join(", ")).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const noX = pick(NO_X), four = sample(SENT.filter(x => has(x, "X")), 4);
      return AEq("Cümlələrin birində xüsusi isim işlənməyib:", plain(noX), four.map(plain), "“" + plain(noX) + "” cümləsindəki isimlər ümumidir (" + names(noX, x => true).join(", ") + "); cümlənin əvvəlindəki böyük hərf xüsusi isim demək deyil. Digər cümlələrdə xüsusi isim: " + four.map(x => names(x, y => y.t === "X").join(", ")).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const m = 1 + R(3), five = shuffle([...sample(MW, m), ...sample(KW, 5 - m)]), right = five.map((w, i) => MW.includes(w) ? i + 1 : 0).filter(Boolean);
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansılar mücərrəd isimdir?", ...five.map((w, i) => line((i + 1) + ". " + w))), ...o, show: o.choices[o.correct],
        solution: five.map((w, i) => (i + 1) + ") " + w + " — " + (MW.includes(w) ? "mücərrəd" : "konkret") + " isim").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const p = 1 + R(3), ws = sample(SGL, 5), isP = shuffle([...Array(p).fill(true), ...Array(5 - p).fill(false)]);
      const five = ws.map((w, i) => isP[i] ? plur(w) : w), right = isP.map((v, i) => v ? i + 1 : 0).filter(Boolean);
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansıları cəm şəkilçisi qəbul edib?", ...five.map((w, i) => line((i + 1) + ". " + w))), ...o, show: o.choices[o.correct],
        solution: five.map((w, i) => (i + 1) + ") " + w + " — " + (isP[i] ? "cəm (" + ws[i] + " + " + (thick(ws[i]) ? "lar" : "lər") + ")" : "tək")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = 1 + R(3), five = shuffle([...sample(TW, t), ...sample([...PW, ...SW], 5 - t)]), right = five.map((w, i) => TW.includes(w) ? i + 1 : 0).filter(Boolean);
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş sözlərdən hansılar toplu isimdir?", ...five.map((w, i) => line((i + 1) + ". " + w))), ...o, show: o.choices[o.correct],
        solution: five.map((w, i) => (i + 1) + ") " + w + " — " + (TW.includes(w) ? "toplu isim (şəkilçisiz çoxluq)" : PW.includes(w) ? "cəm isim (-lar, -lər ilə)" : "bir əşyanın adı")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const useTrap = Math.random() < .5, noT = useTrap ? TRAP : pick(NOT_T.filter(x => x !== TRAP));
      let four = sample(TU, 4);
      if (useTrap && !four.some(x => x.some(y => y.w === "kütləsi"))) four[0] = pick(TU.filter(x => x.some(y => y.w === "kütləsi")));
      if (new Set(four).size < 4) return null;
      return AEq("Tərkibində toplu isim işlənməyən cümləni seçin.", plain(noT), four.map(plain), "“" + plain(noT) + "” cümləsində toplu isim yoxdur" + (useTrap ? ": “kütlə” burada cismin fiziki xüsusiyyətidir, çoxluq bildirmir" : "") + ". Digər cümlələrdə toplu isim: " + four.map(x => names(x, y => y.t === "T").join(", ")).join("; ") + ".");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = 1 + R(3), five = shuffle([...sample(TU, t), ...sample(NOT_T, 5 - t)]);
      if (new Set(five).size < 5) return null;
      const right = five.map((s, i) => has(s, "T") ? i + 1 : 0).filter(Boolean), o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə toplu isim işlənib?", ...five.map((s, i) => line((i + 1) + ". " + plain(s)))), ...o, show: o.choices[o.correct],
        solution: five.map((s, i) => (i + 1) + ") " + (has(s, "T") ? "toplu isim: " + names(s, x => x.t === "T").join(", ") : "toplu isim yoxdur")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("İsimlə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki və ya dərsdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("İsimlə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [w, duz, sehv] = pick(PROFIL);
      if (Math.random() < .5) { const bad = pick(sehv); return AEq("“" + w + "” sözü ilə bağlı səhv fikri müəyyən edin.", bad, sample(duz, 4), "“" + w + "”: " + duz.join("; ") + ". Səhv fikir: " + bad + "."); }
      const ok = pick(duz); return AEq("“" + w + "” sözü ilə bağlı doğru fikri müəyyən edin.", ok, sample(sehv, 4), "“" + w + "”: " + duz.join("; ") + ". Doğru fikir: " + ok + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün müstəqil yoxlama bəndləri: bankdakı hər element ========
  const Y = []; let yn = 0;
  const addY = (kind, sual, cavab) => Y.push({ id: kind + (++yn), sual, cavab });
  const SIRA = " Cavabı sözlərlə, cümlədəki sıra ilə, vergüllə yaz; yoxdursa «yoxdur» yaz.";
  const DEF = { M: "mücərrəd isim (hiss, keyfiyyət, hal, anlayış adı)", K: "konkret isim (maddi varlığı olan, duyğu üzvləri ilə qavranılan varlığın adı)" };
  const chunks = (a, n) => a.reduce((r, x, i) => (i % n ? r[r.length - 1].push(x) : r.push([x]), r), []);
  const num = (arr, f) => arr.map((x, i) => (i + 1) + ") " + x).join("  ");
  const ask = (s, x, q, opts, ans) => addY("S", "«" + plain(s) + "» cümləsində «" + x.w + "» sözü " + q + " (" + opts.join(", ") + ")", ans);
  SENT.forEach(s => {
    nouns(s).forEach(x => {
      if (KM.includes(s)) ask(s, x, "konkret, yoxsa mücərrəd isimdir? (konkret isim — maddi varlığı olan, duyğu üzvləri ilə qavranılan varlığın adı)".replace(/ \(.*$/, ""), ["konkret", "mücərrəd"], x.t === "M" ? "mücərrəd" : "konkret");
      if (XU.includes(s)) ask(s, x, "xüsusi, yoxsa ümumi isimdir?", ["xüsusi", "ümumi"], x.t === "X" ? "xüsusi" : "ümumi");
      if (TU.includes(s) || s === TRAP) ask(s, x, "toplu isimdir, yoxsa toplu isim deyil? (toplu isim — cəm şəkilçisi qəbul etmədən çoxluq bildirən isim)".replace(/ \(.*$/, ""), ["toplu", "toplu deyil"], x.t === "T" ? "toplu" : "toplu deyil");
      if (hasPl(s)) ask(s, x, "cəm şəkilçisi (-lar, -lər) qəbul edib, yoxsa tək formadadır?", ["cəm", "tək"], x.pl ? "cəm" : "tək");
    });
    if (KM.includes(s) || XU.includes(s)) addY("S", "«" + plain(s) + "» cümləsində toplu isim (cəm şəkilçisi qəbul etmədən çoxluq bildirən isim) işlənibmi? (var, yoxdur)", "yoxdur");
  });
  const W = (w, q, opts, ans) => addY("W", "«" + w + "» sözü " + q + " (" + opts.join(", ") + ")", ans);
  [...KW, ...MW].forEach(w => W(w, "konkret, yoxsa mücərrəd isimdir? (konkret isim — maddi varlığı olan, duyğu üzvləri ilə qavranılan varlığın adı; mücərrəd isim — hiss, keyfiyyət, hal, anlayış adı)".replace(/ \(.*$/, ""), ["konkret", "mücərrəd"], MW.includes(w) ? "mücərrəd" : "konkret"));
  [...XW, ...UW].forEach(w => W(w, "xüsusi, yoxsa ümumi isimdir?", ["xüsusi", "ümumi"], XW.includes(w) ? "xüsusi" : "ümumi"));
  [...SIF, ...sample(MW, 4), "gözəllik", "gözəl"].forEach(w => W(w, "sifətdir, yoxsa isim?", ["sifət", "isim"], SIF.includes(w) || w === "gözəl" ? "sifət" : "isim"));
  [...CAP, ...NOCAP].forEach(w => W(w, "adı kiçik hərflə yazılanda da isim kimi (bitki, hiss, təbiət hadisəsi, qiymətli daş və s. adı) işlənirmi?", ["bəli", "xeyr"], CAP.includes(w) ? "bəli" : "xeyr"));
  [...TW, ...SW, ...PW].forEach(w => W(w, "toplu isimdirmi? (toplu isim — cəm şəkilçisi qəbul etmədən çoxluq bildirən isim)".replace(/ \(.*$/, ""), ["bəli", "xeyr"], TW.includes(w) ? "bəli" : "xeyr"));
  HARM.forEach(w => W(w, "sözünün cəm formasını yaz (yalnız cəm şəkilçisi; başqa şəkilçi yox).".replace(/ \(.*$/, ""), ["cavab: bir söz"], plur(w)));
  chunks([...FIKIR_DUZ.map(x => [x, true]), ...FIKIR_SEHV.map(x => [x, false])].sort((a, b) => a[0] < b[0] ? -1 : 1), 6).forEach(c =>
    addY("F", "İsim haqqında aşağıdakı fikirlərdən hansıları doğrudur? " + num(c.map(x => x[0])) + " Cavabı nömrələrlə, artan sırada, vergüllə yaz (məs.: 1,3).", c.map((x, i) => x[1] ? i + 1 : 0).filter(Boolean).join(",")));
  PROFIL.forEach(([w, duz, sehv]) => {
    const all = [...duz.map(x => [x, true]), ...sehv.map(x => [x, false])].sort((a, b) => a[0] < b[0] ? -1 : 1);
    addY("P", "“" + w + "” sözü haqqında aşağıdakı fikirlərdən hansıları doğrudur? " + num(all.map(x => x[0])) + " Cavabı nömrələrlə, artan sırada, vergüllə yaz (məs.: 1,3).", all.map((x, i) => x[1] ? i + 1 : 0).filter(Boolean).join(","));
  });
  window.__yoxla = Y;

  window.__levels = levels;
  window.__bank = { SENT, KW, MW, SIF, XW, UW, CAP, NOCAP, TW, SW, HARM, FIKIR_DUZ, FIKIR_SEHV, PROFIL };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-isim-1", title: "İsim I: növləri, tək və cəm, toplu isim", fenn: "azdili", link: "dersler/az-isim-1.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər ismə cümlədəki mənasına görə bax.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["mucerred", "kmbol", "xususi", "umxus", "cem", "cem", "toplu", "toplusec", "toplusec", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-isim-1.html")) b.push("dersler/az-isim-1.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
