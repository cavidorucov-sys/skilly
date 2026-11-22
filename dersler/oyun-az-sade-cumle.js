// Azərbaycan dili · Sadə cümlənin növləri — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 1-ci hissə (2024), s. 39 "Cümlə sonunda durğu işarələri" (nəqli, sual, əmr, nida);
// 5-ci sinif, 2-ci hissə, s. 104 (sadə və mürəkkəb cümlə); 8-ci sinif (2023), s. 154 (söz-cümlə), s. 155 (əmr, nida),
// s. 159 (müəyyən şəxsli), s. 162 (qeyri-müəyyən şəxsli), s. 165 (ümumi şəxsli), s. 168 (şəxssiz), s. 169 (adlıq);
// 9-cu sinif (2024), s. 64 ("xoşu gəlmirdi" — şəxssiz cümlə); 7-ci sinif (köməkçi), 1-ci hissə, s. 84 (sual, əmr, nida
// cümlələrinin yaranma yolları). Hər bank cümləsinin növü bir axis üzrə birmənalıdır; cümlə növü iki ayrı ölçü ilə
// verilir: (1) məqsəd və intonasiyaya görə (MB bankı), (2) baş üzvlərin iştirakına görə (BB bankı). Bir sualda ikisi
// qarışdırılmır. Bankda qəsdən olmayanlar: mürəkkəb cümlələr, hava haqqında cümlələr ("Hava soyuqdur"), tək sözlü əmr
// cümlələri ("Gəl.") yoxdur; məsdər + modal xəbərli (lazımdır, olar) və hava/zaman bildirən cümlələr mübahisəli olduğu üçün çıxarılıb: şəxssiz bankında yalnız "xoşu gəlmək" tipli cümlələr var (8-ci sinif s. 167, 169; 9-cu sinif s. 64). Atalar sözü kimi oxuna bilən və ya II şəxsin təkində olub müəyyən/ümumi şəxsli ilə qarışan cümlələr də bankda yoxdur.
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const tok = s => s.match(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu);
  const isP = t => !/[\p{L}\p{N}]/u.test(t);
  const plainT = toks => toks.map((t, i) => (i && !isP(t) ? "" : i ? " " : "") + t).join("");
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

  // ---- 1) məqsəd və intonasiyaya görə: N nəqli, S sual, E əmr, D nida.  [növ, cümlə, (sual üçün) yol, sual sözü, izah]
  // yol: i — yalnız intonasiya, e — sual ədatı, v — sual əvəzliyi
  const TN = { N: "nəqli cümlə", S: "sual cümləsi", E: "əmr cümləsi", D: "nida cümləsi" };
  const PRED_M = { N: "nəqli cümlədir", S: "sual cümləsidir", E: "əmr cümləsidir", D: "nida cümləsidir" };
  const NOT_M = { N: "nəqli cümlə deyil", S: "sual cümləsi deyil", E: "əmr cümləsi deyil", D: "nida cümləsi deyil" };
  const WHY_M = {
    N: "xəbər vermək məqsədi daşıyır, sonunda nöqtə qoyulur",
    S: "xəbər almaq məqsədi daşıyır, sonunda sual işarəsi qoyulur",
    E: "xahiş, göstəriş ifadə edir",
    D: "duyğu (heyranlıq, sevinc, təəccüb və s.) ifadə edir, sonunda nida işarəsi qoyulur",
  };
  const MB = [
    ["N", "Səmra ilə Aytən bir sinifdə oxuyurdular."],
    ["N", "Kitabxana saat beşə qədər açıqdır."],
    ["N", "Qatar səhər saat səkkizdə yola düşəcək."],
    ["N", "Babam bu kitabı mənə ad günümdə hədiyyə etmişdi."],
    ["N", "Nənəm bağda qırmızı güllər əkdi."],
    ["N", "Bakı Azərbaycanın paytaxtıdır."],
    ["N", "Dənizin sahilində külək əsirdi."],
    ["N", "Şagirdlər dərsdən sonra həyətdə oynadılar."],
    ["N", "Biz yay tətilini kənddə keçirdik."],
    ["N", "Aytən pianoda yaxşı çalırdı."],
    ["N", "Qardaşım hər səhər qaçışa çıxır."],
    ["E", "Sən şəkli sevə-sevə çək."],
    ["E", "Dilinə yalan söz gətirmə, oğlum."],
    ["E", "Qoy ucalsın haqqın səsi."],
    ["E", "Qoysana bir nəfəsimi dərim."],
    ["E", "Dərsini vaxtında hazırla."],
    ["E", "Pəncərəni bağla."],
    ["E", "Dəftərini mənə ver."],
    ["E", "Sabah tezdən məktəbə gəl."],
    ["E", "Qoy uşaqlar bir az dincəlsinlər."],
    ["S", "Babanın səsini eşitmirsiniz?", "i"],
    ["S", "Konsert xoşuna gəldi?", "i"],
    ["S", "Sən sabah bizə gəlirsən?", "i"],
    ["S", "Dərsləri artıq hazırlamısan?", "i"],
    ["S", "Qardaşın evdədir?", "i"],
    ["S", "Yağış dayanıb?", "i"],
    ["S", "Bəs babanın səsini eşitmirsiniz?", "e", "Bəs", "bəs"],
    ["S", "Dərsləri hazırladınmı?", "e", "hazırladınmı", "-mı"],
    ["S", "Sən bizimlə gələcəksənmi?", "e", "gələcəksənmi", "-mi"],
    ["S", "Məgər sən bu işi bilmirdin?", "e", "Məgər", "məgər"],
    ["S", "Bu kitabı oxumusanmı?", "e", "oxumusanmı", "-mı"],
    ["S", "Qardaşın evdədirmi?", "e", "evdədirmi", "-mi"],
    ["S", "Babanın səsini niyə eşitmirsiniz?", "v", "niyə"],
    ["S", "Dastanın Drezden nüsxəsi neçə boydan ibarətdir?", "v", "neçə"],
    ["S", "Kim bu şəkli çəkib?", "v", "Kim"],
    ["S", "Sən hara gedirsən?", "v", "hara"],
    ["S", "Sənin neçə qardaşın var?", "v", "neçə"],
    ["S", "Sən hansı kitabı oxuyursan?", "v", "hansı"],
    ["S", "Bu hədiyyə sənin xoşuna gəldi?", "i"],
    ["S", "Sən bunu özün çəkmisən?", "i"],
    ["S", "Qonaqlar artıq gəlib?", "i"],
    ["S", "Bəs sən bizimlə getmirsən?", "e", "Bəs", "bəs"],
    ["S", "Atan işdən qayıdıbmı?", "e", "qayıdıbmı", "-mı"],
    ["S", "Bu şəkli sən çəkmisənmi?", "e", "çəkmisənmi", "-mi"],
    ["S", "Məgər bu sənin kitabındır?", "e", "Məgər", "məgər"],
    ["S", "Dərsdən sonra kitabxanaya gedəcəksənmi?", "e", "gedəcəksənmi", "-mi"],
    ["S", "Qonaqlar haraya getdilər?", "v", "haraya"],
    ["S", "Bu kitabı kim yazıb?", "v", "kim"],
    ["S", "Sən neçə yaşındasan?", "v", "neçə"],
    ["S", "Sən necə düşünürsən?", "v", "necə"],
    ["S", "Hansı fənni daha çox sevirsən?", "v", "Hansı"],
    ["S", "Sən niyə gec gəldin?", "v", "niyə"],
    ["S", "Məktəb harada yerləşir?", "v", "harada"],
    ["S", "Bu tapşırığı sən yazmısanmı?", "e", "yazmısanmı", "-mı"],
    ["S", "Kitabları rəfə qoymusanmı?", "e", "qoymusanmı", "-mı"],
    ["S", "Dərsdən sonra hara gedəcəksən?", "v", "hara"],
    ["S", "Kitabı hansı rəfə qoydun?", "v", "hansı"],
    ["D", "Nə gözəl yaraşır Muğana ceyran!"],
    ["D", "Fikirləriniz necə maraqlıdır!"],
    ["D", "İnsanları tanımaq necə də çətindir!"],
    ["D", "Bu nə gözəl mənzərədir!"],
    ["D", "Nə qədər gözəl səhərdir!"],
    ["D", "Ura, biz birinci olduq!"],
    ["D", "Nə yaman soyuqdur bu gün!"],
    ["D", "Of, bu çanta ağırdır!"],
    ["D", "Vay, stəkan sındı!"],
    ["D", "Bəh-bəh, nə dadlı plovdur!"],
  ].map(([t, s, y, sw, ed]) => ({ t, s, y, sw, ed }));
  const byM = t => MB.filter(x => x.t === t);
  const YOLU = { i: "yalnız intonasiya ilə", e: "sual ədatı ilə", v: "sual əvəzliyi ilə" };
  const yolSol = x => x.y === "i" ? "Cümlədə nə sual ədatı, nə də sual əvəzliyi var — sual yalnız intonasiya ilə yaranıb."
    : x.y === "e" ? "“" + x.sw + "” — sual ədatıdır (" + x.ed + "), sual onunla yaranıb." : "“" + x.sw + "” — sual əvəzliyidir, sual onunla yaranıb.";
  const solM = x => "«" + x.s + "» — " + TN[x.t] + ": " + WHY_M[x.t] + ".";

  // ---- 2) baş üzvlərin iştirakına görə: M müəyyən şəxsli, Q qeyri-müəyyən şəxsli, U ümumi şəxsli, X şəxssiz, A adlıq.
  // [növ, cümlə, xəbər (şəxsi ilə), mübtəda / qeyd]
  const BN = { M: "müəyyən şəxsli cümlə", Q: "qeyri-müəyyən şəxsli cümlə", U: "ümumi şəxsli cümlə", X: "şəxssiz cümlə", A: "adlıq cümlə" };
  const BS = { M: "müəyyən şəxsli", Q: "qeyri-müəyyən şəxsli", U: "ümumi şəxsli", X: "şəxssiz", A: "adlıq" };
  const PRED_B = { M: "müəyyən şəxsli cümlədir", Q: "qeyri-müəyyən şəxsli cümlədir", U: "ümumi şəxsli cümlədir", X: "şəxssiz cümlədir", A: "adlıq cümlədir" };
  const NOT_B = { M: "müəyyən şəxsli cümlə deyil", Q: "qeyri-müəyyən şəxsli cümlə deyil", U: "ümumi şəxsli cümlə deyil", X: "şəxssiz cümlə deyil", A: "adlıq cümlə deyil" };
  const BB = [
    ["M", "Nərmin kitabxanadan yeni kitab götürdü.", "götürdü", "mübtəda: Nərmin"],
    ["M", "Uşaqlar həyətdə top oynayırdılar.", "oynayırdılar", "mübtəda: Uşaqlar"],
    ["M", "Müəllim şagirdlərə yeni mövzunu izah etdi.", "izah etdi", "mübtəda: Müəllim"],
    ["M", "Biz sabah ekskursiyaya gedirik.", "gedirik", "mübtəda: Biz"],
    ["M", "Siz bu işi tezliklə bitirərsiniz.", "bitirərsiniz", "mübtəda: Siz"],
    ["M", "Qardaşım rəsm çəkməyi sevir.", "sevir", "mübtəda: Qardaşım"],
    ["M", "Sabah muzeyə gedəcəyik.", "gedəcəyik", "mübtəda buraxılıb: xəbərdəki şəxs sonluğuna görə «biz» bərpa olunur"],
    ["M", "Bu kitabı dünən oxudum.", "oxudum", "mübtəda buraxılıb: xəbərdəki şəxs sonluğuna görə «mən» bərpa olunur"],
    ["M", "Səni stansiyada gözləyirəm.", "gözləyirəm", "mübtəda buraxılıb: xəbərdəki şəxs sonluğuna görə «mən» bərpa olunur"],
    ["M", "Yay tətilini kənddə keçirdik.", "keçirdik", "mübtəda buraxılıb: xəbərdəki şəxs sonluğuna görə «biz» bərpa olunur"],
    ["M", "Axşam dostlarımla parka getdim.", "getdim", "mübtəda buraxılıb: xəbərdəki şəxs sonluğuna görə «mən» bərpa olunur"],
    ["Q", "Küçəmizdə yeni körpü saldılar.", "saldılar"],
    ["Q", "Dünən poçtdan bağlama gətirdilər.", "gətirdilər"],
    ["Q", "Tamaşanın sonunda aktyorları və müəllifi alqışladılar.", "alqışladılar"],
    ["Q", "Qapını döydülər.", "döydülər"],
    ["Q", "Radioda hava proqnozunu verdilər.", "verdilər"],
    ["Q", "Dünən məni direktorun yanına çağırdılar.", "çağırdılar"],
    ["Q", "Şəhərin mərkəzində yeni muzey açdılar.", "açdılar"],
    ["Q", "Mənim velosipedimi həyətdən apardılar.", "apardılar"],
    ["Q", "Sanki nəfəs aldığı havaya da zəhər qatmışdılar.", "qatmışdılar"],
    ["Q", "Yeni tədris ili üçün dərsliklər çap etdilər.", "çap etdilər"],
    ["U", "Sözün doğrusunu zarafatla deyərlər.", "deyərlər (III şəxsin cəmi)"],
    ["U", "Keçənə güzəşt deyərlər.", "deyərlər (III şəxsin cəmi)"],
    ["U", "Cücəni payızda sayarlar.", "sayarlar (III şəxsin cəmi)"],
    ["U", "Gecə düşün, gündüz danış.", "düşün, danış (II şəxsin təki)"],
    ["U", "Yeddi ölç, bir biç.", "ölç, biç (II şəxsin təki)"],
    ["U", "Əvvəl düşün, sonra danış.", "düşün, danış (II şəxsin təki)"],
    ["U", "Az danış, çox dinlə.", "danış, dinlə (II şəxsin təki)"],
    ["X", "Onun skripkada çalmaqdan çox xoşu gələrdi.", "xoşu gələrdi"],
    ["X", "Atamın bu hədiyyədən çox xoşu gəldi.", "xoşu gəldi"],
    ["X", "Mənim bu filmdən heç xoşum gəlmədi.", "xoşum gəlmədi"],
    ["X", "Qara Qarayevin onun sonatasından çox xoşu gəlir.", "xoşu gəlir"],
    ["A", "Yay günü."],
    ["A", "Yol üstü."],
    ["A", "Ağac kölgəsi."],
    ["A", "Qış axşamı."],
    ["A", "Dəniz sahili."],
    ["A", "Payız gecəsi."],
    ["A", "Səhər çağı."],
    ["A", "Köhnə bağ."],
    ["A", "Kənd yolu."],
    ["A", "Dağ başı."],
  ].map(([t, s, xeb, mub]) => ({ t, s, xeb, mub }));
  const byB = t => BB.filter(x => x.t === t);
  const solB = x => {
    const a = "«" + x.s + "» — ";
    if (x.t === "M") return a + "müəyyən şəxsli cümlə: " + x.mub + "; xəbər: " + x.xeb + ".";
    if (x.t === "Q") return a + "qeyri-müəyyən şəxsli cümlə: mübtəda yoxdur, hərəkəti kimin etdiyi bilinmir; xəbər (" + x.xeb + ") III şəxsin cəmindədir.";
    if (x.t === "U") return a + "ümumi şəxsli cümlə: mübtəda yoxdur, hökm hamıya aiddir; xəbər: " + x.xeb + ".";
    if (x.t === "X") return a + "şəxssiz cümlə: mübtəda yoxdur və təsəvvür də olunmur; xəbər (" + x.xeb + ") III şəxsin təkindədir.";
    return a + "adlıq cümlə: yalnız əşyanın, hadisənin adı çəkilir, mövcudluğu haqqında məlumat verilir.";
  };

  // ---- 3) söz-cümlə: [əvvəlki sual/cümlə, söz-cümlə, ifadə vasitəsi]  M modal söz, N nida, D ədat
  const AD = { M: "modal söz", N: "nida", D: "ədat" };
  const SZ = [
    ["Sabah bizə gələrsən?", "Əlbəttə.", "M"],
    ["Bu kitabı oxumusan?", "Yəqin.", "M"],
    ["Bu gün yağış yağacaqmı?", "Bəlkə.", "M"],
    ["Bu qərar düzgündürmü?", "Şübhəsiz.", "M"],
    ["Yağış dayanıb?", "Deyəsən.", "M"],
    ["Dərsləri hazırlamısan?", "Bəli.", "D"],
    ["Sən bizimlə gələcəksən?", "Xeyr.", "D"],
    ["Dərsi öyrənmisən?", "Hə.", "D"],
    ["Qonaqlar evdədirlər?", "Yox.", "D"],
    ["Biz finala çıxdıq!", "Ura!", "N"],
    ["Sən müsabiqədə birinci oldun.", "Əhsən!", "N"],
    ["Stəkan əlimdən düşdü.", "Vay!", "N"],
    ["Bu çanta çox ağırdır.", "Of!", "N"],
    ["Nənəm bu gün plov bişirib.", "Bəh-bəh!", "N"],
  ].map(([q, w, k]) => ({ q, w, k }));
  const EXTRA = ["Mən səni gözləyəcəyəm.", "Sonra görüşərik.", "Bu çox yaxşıdır.", "Mən də belə düşünürəm.", "Vaxt çoxdur.", "Hamı hazırdır."];
  const FUNK = { M: "danışanın fikrə münasibətini bildirir", N: "hiss-həyəcan ifadə edir", D: "təsdiq və ya inkar bildirən cavab sözüdür: bəli, hə, yox, xeyr" };
  const solS = x => "«" + x.w.replace(/[.!]$/, "") + "» — bir sözdən ibarətdir, üzvlənmir, sual tələb etmir → söz-cümlə; ifadə vasitəsi: " + AD[x.k] + " (" + FUNK[x.k] + ").";

  // ---- qaydalar üzrə fikirlər (8-ci sinif s. 154–169; 7-ci sinif s. 84; 5-ci sinif s. 39, 104)
  const FIKIR_DUZ = [
    "Nəqli cümlə xəbər vermək məqsədi daşıyır, sonunda nöqtə qoyulur.",
    "Sual cümləsi xəbər almaq məqsədi daşıyır, sonunda sual işarəsi qoyulur.",
    "Əmr cümləsi xahiş, göstəriş ifadə edir.",
    "Nida cümləsi duyğu ifadə edir, sonunda nida işarəsi qoyulur.",
    "Sual cümlələri yalnız intonasiya ilə, sual ədatları ilə və ya sual əvəzlikləri ilə yaranır.",
    "Sual əvəzlikləri ilə yaranan sual cümləsi yeni informasiya verən konkret cavab tələb edir.",
    "İntonasiya və sual ədatı ilə yaranan sual cümlələrində fikrin təsdiq və ya inkarı soruşulur.",
    "Əmr cümlələrinin xəbəri, bir qayda olaraq, feilin əmr şəklində olur.",
    "Qoy, qoysana əmr ədatları I və III şəxsə aid feillə işlənərək əmr cümlələrinin yaranmasında iştirak edir.",
    "Nə, necə ədatları nida cümləsinin yaranmasında iştirak edir.",
    "Nida cümlələri intonasiya və nidaların köməyi ilə əmələ gəlir.",
    "Mübtəda və xəbəri olan cümlələr müəyyən şəxsli cümlələrdir.",
    "Müəyyən şəxsli cümlələrdə bəzən mübtəda olmur; xəbərdəki şəxs sonluğuna əsasən mübtədanı bərpa etmək olur.",
    "Qeyri-müəyyən şəxsli cümlənin mübtədası olmur, xəbəri III şəxsin cəmində olur.",
    "Qeyri-müəyyən şəxsli cümlələrdə hərəkət və hökm qeyri-müəyyən şəxsə aid olur.",
    "Ümumi şəxsli cümlənin mübtədası olmur, hərəkət və hökm hamıya aid olur.",
    "Ümumi şəxsli cümlələrin xəbəri II şəxsin təkində və III şəxsin cəmində olur.",
    "Atalar sözlərinin, məsəllərin, aforizmlərin əksəriyyəti ümumi şəxsli cümlələrlə ifadə olunur.",
    "Şəxssiz cümlənin mübtədası olmur və onun təsəvvür olunması da qeyri-mümkündür.",
    "Şəxssiz cümlənin xəbəri III şəxsin təkində olur.",
    "Şəxssiz cümlələrin xəbəri ismi və feili xəbərlərlə, frazeoloji birləşmələrlə ifadə olunur.",
    "Adlıq cümlə əşyanın, hadisənin adını çəkməklə onun mövcudluğu haqqında məlumat verir.",
    "Söz-cümlə bir sözdən ibarət olub üzvlənmir və sual tələb etmir.",
    "Söz-cümlələr modal söz, nida və ədatlarla ifadə olunur.",
    "Mürəkkəb cümlənin ən azı iki qrammatik əsası olur.",
  ];
  const FIKIR_SEHV = [
    "Əmr cümləsinin sonunda mütləq sual işarəsi qoyulur.",
    "Sual cümləsi xəbər vermək məqsədi daşıyır.",
    "Nəqli cümlənin sonunda nida işarəsi qoyulur.",
    "Nida cümləsi xahiş və göstəriş ifadə edir.",
    "Sual cümləsi yalnız sual ədatları ilə yaranır.",
    "Sual əvəzlikləri ilə yaranan sual cümləsinə bəli, xeyr ədatları ilə cavab vermək olur.",
    "Əmr cümlələrinin xəbəri, bir qayda olaraq, feilin xəbər şəklində olur.",
    "Nə, necə ədatları əmr cümləsinin yaranmasında iştirak edir.",
    "Müəyyən şəxsli cümlələrdə mübtəda mütləq ifadə olunmalıdır.",
    "Qeyri-müəyyən şəxsli cümlənin xəbəri III şəxsin təkində olur.",
    "Ümumi şəxsli cümlənin xəbəri I şəxsin təkində olur.",
    "Şəxssiz cümlənin xəbəri III şəxsin cəmində olur.",
    "Şəxssiz cümlədə mübtəda xəbərdəki şəxs sonluğuna əsasən bərpa olunur.",
    "Adlıq cümlədə hərəkətin icra olunduğu bildirilir.",
    "Söz-cümlə sual tələb edir.",
    "Söz-cümlə yalnız isimlə ifadə olunur.",
    "Atalar sözləri, əsasən, qeyri-müəyyən şəxsli cümlələrlə ifadə olunur.",
    "Mürəkkəb cümlənin bir qrammatik əsası olur.",
  ];
  // sətir (cümlə) haqqında fikirlər: hər növ üçün ≥4 doğru və ≥4 səhv; bütün növ cümlələri üçün doğrudur / səhvdir
  const PROF = {
    M: { ok: ["müəyyən şəxsli cümlədir", "mübtədası və xəbəri olan cümlədir", "mübtədası ifadə olunub və ya xəbərdəki şəxs sonluğuna görə bərpa olunur", "xəbəri var", "ümumi şəxsli cümlə deyil"],
      bad: ["qeyri-müəyyən şəxsli cümlədir", "ümumi şəxsli cümlədir", "şəxssiz cümlədir", "adlıq cümlədir", "mübtədası yoxdur və heç vaxt bərpa edilə bilməz", "xəbəri yoxdur"] },
    Q: { ok: ["qeyri-müəyyən şəxsli cümlədir", "mübtədası yoxdur", "xəbəri III şəxsin cəmindədir", "hərəkəti icra edən şəxs məlum deyil", "hərəkət qeyri-müəyyən şəxsə aiddir"],
      bad: ["müəyyən şəxsli cümlədir", "ümumi şəxsli cümlədir", "şəxssiz cümlədir", "adlıq cümlədir", "xəbəri III şəxsin təkindədir", "mübtədası var"] },
    U: { ok: ["ümumi şəxsli cümlədir", "mübtədası yoxdur", "hərəkət və hökm hamıya aiddir", "hərəkət konkret bir şəxsə aid deyil", "atalar sözləri və aforizmlər üçün xarakterikdir"],
      bad: ["müəyyən şəxsli cümlədir", "qeyri-müəyyən şəxsli cümlədir", "şəxssiz cümlədir", "adlıq cümlədir", "xəbəri I şəxsin təkindədir", "mübtədası ifadə olunub"] },
    X: { ok: ["şəxssiz cümlədir", "mübtədası yoxdur", "mübtədanın təsəvvür olunması qeyri-mümkündür", "xəbəri III şəxsin təkindədir"],
      bad: ["müəyyən şəxsli cümlədir", "qeyri-müəyyən şəxsli cümlədir", "ümumi şəxsli cümlədir", "adlıq cümlədir", "xəbəri III şəxsin cəmindədir", "mübtədası xəbərdəki şəxs sonluğuna görə bərpa olunur"] },
    A: { ok: ["adlıq cümlədir", "əşyanın, hadisənin adını çəkir", "onun mövcudluğu haqqında məlumat verir", "dramatik növdə yazılmış əsərlərdə daha çox işlənir"],
      bad: ["müəyyən şəxsli cümlədir", "qeyri-müəyyən şəxsli cümlədir", "ümumi şəxsli cümlədir", "şəxssiz cümlədir", "hərəkətin icra olunduğunu bildirir", "xəbəri III şəxsin cəmindədir"] },
  };

  // ======== oyun səviyyələri ========
  const OPT_M = ["nəqli cümlə", "sual cümləsi", "əmr cümləsi", "nida cümləsi"];
  const OPT_B = ["müəyyən şəxsli", "qeyri-müəyyən şəxsli", "ümumi şəxsli", "şəxssiz", "adlıq"];
  const levels = [
    { id: "novlar", ad: "Məqsəd və intonasiya", izah: "Nəqli cümlə xəbər verir, sual cümləsi xəbər alır, əmr cümləsi xahiş və göstəriş ifadə edir, nida cümləsi duyğu bildirir.",
      gen() {
        const t = pick(["N", "S", "E", "D"]), x = pick(byM(t)), k = "NSED".indexOf(t);
        return { text: h("span", {}, "Cümlənin məqsəd və intonasiyaya görə növünü müəyyən et:", line("«" + x.s + "»")), choices: OPT_M, correct: k, show: OPT_M[k], solution: solM(x) };
      } },
    { id: "yol", ad: "Sual cümləsi necə yaranıb", izah: "Üç yol: yalnız intonasiya, sual ədatı (mı, mi, bəs, məgər), sual əvəzliyi (kim, hara, niyə, neçə, hansı).",
      gen() {
        const x = pick(byM("S")), ys = ["i", "e", "v"], opts = ys.map(y => YOLU[y]);
        return { text: h("span", {}, "Sual cümləsi hansı yolla yaranıb?", line("«" + x.s + "»")), choices: opts, correct: ys.indexOf(x.y), show: YOLU[x.y], solution: yolSol(x) };
      } },
    { id: "sualso", ad: "Sualı yaradan söz", izah: "Sual ədatını və ya sual əvəzliyini tap və ona toxun.",
      gen() {
        const x = pick(byM("S").filter(z => z.y !== "i")), tk = tok(x.s), i = tk.indexOf(x.sw);
        return { text: "Cümlədə sualı yaradan sözə toxun.", sec: { soz: tk, duz: [i] }, show: x.sw, solution: yolSol(x) };
      } },
    { id: "bas", ad: "Baş üzvlərin iştirakına görə", izah: "Mübtəda və xəbər varsa (ya mübtəda şəxs sonluğundan bərpa olunursa) — müəyyən şəxsli. Mübtəda yoxdursa: kim bilinmir — qeyri-müəyyən, hamıya aiddir — ümumi, təsəvvür də olunmur — şəxssiz. Yalnız adı çəkilirsə — adlıq.",
      gen() {
        const t = pick([..."MQUXA"]), x = pick(byB(t)), k = "MQUXA".indexOf(t);
        return { text: h("span", {}, "Cümlə baş üzvlərin iştirakına görə hansı növdür?", line("«" + x.s + "»")), choices: OPT_B, correct: k, show: OPT_B[k], solution: solB(x) };
      } },
    { id: "ayir", ad: "Müəyyən, qeyri-müəyyən, ümumi", izah: "Mübtəda var və ya bərpa olunur — müəyyən. Mübtəda yoxdur, hərəkəti kim etdiyi bilinmir — qeyri-müəyyən. Mübtəda yoxdur, hökm hamıya aiddir — ümumi.",
      gen() {
        const t = pick([..."MQU"]), x = pick(byB(t)), opts = ["müəyyən şəxsli", "qeyri-müəyyən şəxsli", "ümumi şəxsli"], k = "MQU".indexOf(t);
        return { text: h("span", {}, "Cümlə hansı növdür?", line("«" + x.s + "»")), choices: opts, correct: k, show: opts[k], solution: solB(x) };
      } },
    { id: "bolgu", ad: "Bölgü: cümlə növləri", izah: "Cümlələri baş üzvlərin iştirakına görə qruplara ayır. Qrupların hamısı cümlələrdə olmaya bilər.",
      gen() {
        const ts = sample([..."MQUXA"], 3), cnt = [2, 2, 1], items = [];
        ts.forEach((t, i) => sample(byB(t), cnt[i]).forEach(x => items.push(x)));
        const ord = shuffle(items), here = new Set(ts), extra = sample([..."MQUXA"].filter(t => !here.has(t)), 1 + R(2));
        const tags = [..."MQUXA"].filter(t => here.has(t) || extra.includes(t));
        return { text: "Cümlələri baş üzvlərin iştirakına görə qruplara ayır.", bol: { soz: ord.map(x => x.s), qrup: tags.map(t => BS[t]), duz: ord.map(x => tags.indexOf(x.t)) },
          show: ord.map(x => x.s + " — " + BS[x.t]).join("; "), solution: ord.map(solB).join(" ") };
      } },
    { id: "sozc", ad: "Söz-cümlə", izah: "Söz-cümlə bir sözdən ibarətdir, üzvlənmir, sual tələb etmir. Modal söz, nida və ya ədatla ifadə olunur.",
      gen() {
        const x = pick(SZ);
        if (Math.random() < .5) {
          const tk = [...tok(x.q), ...tok(x.w), ...tok(pick(EXTRA))], at = tok(x.q).length;
          return { text: "Mətndə söz-cümləyə toxun.", sec: { soz: tk, duz: [at] }, show: tk[at], solution: solS(x) };
        }
        const opts = ["modal söz", "nida", "ədat", "bağlayıcı"], k = "MND".indexOf(x.k);
        return { text: h("span", {}, "Söz-cümlə hansı vasitə ilə ifadə olunub?", line(x.q + " — " + x.w)), choices: opts, correct: k, show: opts[k], solution: solS(x) };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird üç cümlənin növünü yazıb. Biri səhvdir — hansı?",
      gen() {
        const CB = { M: "Q", Q: "U", U: "Q", X: "M", A: "X" }, CM = { N: "D", S: "N", E: "N", D: "N" };
        const ord = ["1-ci", "2-ci", "3-cü"];
        if (Math.random() < .5) {
          const ts = sample([..."MQUXA"], 3), xs = ts.map(t => pick(byB(t))), k = R(3);
          const lab = ts.map((t, j) => j === k ? CB[t] : t);
          return { text: "Şagird cümlələrin baş üzvlərin iştirakına görə növünü belə təyin edib: " + xs.map((x, j) => (j + 1) + ") «" + x.s + "» — " + BS[lab[j]]).join("; ") + ". Hansı bənddə səhv var?",
            choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd", solution: solB(xs[k]) + " Digər iki bənd düzdür." };
        }
        const ts = sample([..."NSED"], 3), xs = ts.map(t => pick(byM(t))), k = R(3);
        const lab = ts.map((t, j) => j === k ? CM[t] : t);
        return { text: "Şagird cümlələrin məqsəd və intonasiyaya görə növünü belə təyin edib: " + xs.map((x, j) => (j + 1) + ") «" + x.s + "» — " + TN[lab[j]]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd", solution: solM(xs[k]) + " Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E) ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const numbered = list => list.map((s, i) => h("span", { style: "display:block" }, (i + 1) + ". " + s));
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. Hansı cümlə ... cümləsidir? (məqsəd və intonasiya)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["N", "S", "E", "D"]), right = pick(byM(t)), others = ["N", "S", "E", "D"].filter(x => x !== t);
      const wrong = [...others.map(x => pick(byM(x))), pick(MB.filter(x => x.t !== t))];
      return AEq("Hansı cümlə " + PRED_M[t] + "?", right.s, wrong.map(x => x.s),
        solM(right) + " Digərləri: " + wrong.map(x => "«" + x.s + "» — " + TN[x.t]).join("; ") + ".");
    }) },
    // 2. Hansı cümlə ... deyil?
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["N", "S", "E", "D"]), odd = pick(MB.filter(x => x.t !== t)), four = sample(byM(t), 4);
      return AEq("Hansı cümlə " + NOT_M[t] + "?", odd.s, four.map(x => x.s),
        solM(odd) + " Qalan dörd cümlənin hamısı " + TN[t] + ": " + four.map(x => "«" + x.s + "»").join(", ") + ".");
    }) },
    // 3. sual cümləsinin yaranma yolu
    { tip: "qapali", gen: () => Oyun.again(() => {
      const y = pick(["i", "e", "v"]), right = pick(MB.filter(x => x.t === "S" && x.y === y)), wrong = sample(MB.filter(x => x.t === "S" && x.y !== y), 4);
      return AEq("Hansı sual cümləsi " + YOLU[y] + " yaranıb?", right.s, wrong.map(x => x.s),
        yolSol(right) + " Digərləri: " + wrong.map(x => "«" + x.s + "» — " + YOLU[x.y]).join("; ") + ".");
    }) },
    // 4. nömrə kombinasiyası: məqsəd və intonasiya
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(MB, 5), t = pick([...new Set(five.map(x => x.t))]);
      const right = five.map((x, i) => x.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələr " + PRED_M[t] + "?", ...numbered(five.map(x => x.s))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + TN[x.t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 5. Hansı cümlə (baş üzvlərə görə) ...
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick([..."MQUXA"]), right = pick(byB(t)), others = [..."MQUXA"].filter(x => x !== t);
      const wrong = [...sample(others, 3).map(x => pick(byB(x))), pick(BB.filter(x => x.t !== t))];
      return AEq("Hansı cümlə " + PRED_B[t] + "?", right.s, wrong.map(x => x.s),
        solB(right) + " Digərləri: " + wrong.map(x => "«" + x.s + "» — " + BS[x.t]).join("; ") + ".");
    }) },
    // 6. biri növünə görə fərqlidir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [a, b] = sample([..."MQUXA"], 2), four = sample(byB(a), 4), odd = pick(byB(b));
      return AEq("Cümlələrin biri baş üzvlərin iştirakına görə fərqlidir:", odd.s, four.map(x => x.s),
        solB(odd) + " Qalan dörd cümlənin hamısı " + BN[a] + ": " + four.map(x => "«" + x.s + "»").join(", ") + ".");
    }) },
    // 7. nömrə kombinasiyası: baş üzvlərə görə
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(BB, 5), t = pick([...new Set(five.map(x => x.t))]);
      const right = five.map((x, i) => x.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələr " + PRED_B[t] + "?", ...numbered(five.map(x => x.s))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + BS[x.t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 8. söz-cümlə
    { tip: "qapali", gen: () => Oyun.again(() => {
      const k = pick([..."MND"]), right = pick(SZ.filter(x => x.k === k)), wrong = sample(SZ.filter(x => x.k !== k), 4);
      const ask = { M: "modal sözlə", N: "nidanın köməyi ilə", D: "ədatla" }[k];
      return AEq("Aşağıdakı söz-cümlələrdən hansı " + ask + " ifadə olunub?", right.w, wrong.map(x => x.w),
        solS(right) + " Digərləri: " + wrong.map(x => x.w.replace(/[.!]$/, "") + " — " + AD[x.k]).join("; ") + ".");
    }) },
    // 9. doğru / səhv fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("Sadə cümlənin növləri ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Sadə cümlənin növləri ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
    // 10. cümlə haqqında fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick([..."MQUXA"]), x = pick(byB(t)), p = PROF[t];
      const txt = n => "«" + x.s + "» cümləsi ilə bağlı " + n + " fikri müəyyən edin.";
      if (Math.random() < .5) { const bad = pick(p.bad); return AEq(txt("səhv"), bad, sample(p.ok, 4), solB(x) + " Səhv fikir: " + bad + "."); }
      const ok = pick(p.ok); return AEq(txt("doğru"), ok, sample(p.bad, 4), solB(x) + " Doğru fikir: " + ok + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex yoxlaması: bankdakı hər fakt müstəqil sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "y" + (++yn), sual, cavab });
  MB.forEach(x => {
    addY("«" + x.s + "» — cümlənin məqsəd və intonasiyaya görə növü hansıdır? (nəqli cümlə, sual cümləsi, əmr cümləsi, nida cümləsi)", TN[x.t]);
    if (x.t === "S") addY("«" + x.s + "» sual cümləsi hansı yolla yaranıb? (yalnız intonasiya ilə, sual ədatı ilə, sual əvəzliyi ilə)", YOLU[x.y]);
  });
  BB.forEach(x => addY("«" + x.s + "» — cümlə baş üzvlərin iştirakına görə hansı növdədir? (müəyyən şəxsli, qeyri-müəyyən şəxsli, ümumi şəxsli, şəxssiz, adlıq) — 8-ci sinif dərsliyinin təsnifatına görə: mübtəda və xəbəri olan (və ya mübtədası xəbərin şəxs sonluğundan bərpa olunan) cümlə müəyyən şəxslidir.", BS[x.t]));
  SZ.forEach(x => addY("Dialoqda: «" + x.q + "» — «" + x.w + "». Cavab kimi işlənən söz-cümlə hansı vasitə ilə ifadə olunub? (modal söz, nida, ədat)", AD[x.k]));
  FIKIR_DUZ.forEach(f => addY("Sadə cümlənin növləri haqqında (5, 7, 8-ci sinif dərslikləri) deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => addY("Sadə cümlənin növləri haqqında (5, 7, 8-ci sinif dərslikləri) deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "səhv"));
  Object.keys(PROF).forEach(t => {
    const x = byB(t)[0];
    PROF[t].ok.forEach(f => addY("«" + x.s + "» cümləsi haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — 8-ci sinif dərsliyinin təsnifatı (müəyyən, qeyri-müəyyən, ümumi şəxsli, şəxssiz, adlıq cümlə) əsasında.", "doğru"));
    PROF[t].bad.forEach(f => addY("«" + x.s + "» cümləsi haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — 8-ci sinif dərsliyinin təsnifatı (müəyyən, qeyri-müəyyən, ümumi şəxsli, şəxssiz, adlıq cümlə) əsasında.", "səhv"));
  });
  window.__yoxla = YOX;

  window.__levels = levels;
  window.__bank = { MB, BB, SZ, FIKIR_DUZ, FIKIR_SEHV, PROF };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-sade-cumle", title: "Sadə cümlənin növləri", fenn: "azdili", link: "dersler/az-sade-cumle.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya cümlələri qruplara ayırmaq. Cümlənin növünü iki ölçü ilə təyin et: məqsəd və intonasiyaya görə, baş üzvlərin iştirakına görə.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["novlar", "novlar", "yol", "sualso", "bas", "bas", "ayir", "bolgu", "sozc", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-sade-cumle.html")) b.push("dersler/az-sade-cumle.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
