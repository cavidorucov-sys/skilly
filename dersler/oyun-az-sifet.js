// Azərbaycan dili · Sifət — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024): s. 34–35 (sifət: əlamət və keyfiyyət, dərəcələr, "Sifətin yazılışı"),
// s. 55 (sifət–zərf omonimliyi), s. 80–81 (isimləşmə və sifətləşmə); 7-ci sinif (köməkçi mənbə): ən, daha, lap sifətin çoxaltma
// dərəcəsini yaradır. Suallar cümlə və söz banklarından qurulur: bankdakı hər söz cümlədəki işlənməsinə görə etiketlənib.
// Bankda qəsdən olmayanlar: feili sifət (yağan, işləməyən…), "var/yox", "idi/imiş", "bir", "çox", "az" kimi mübahisəli sözlər,
// kökü eyni olan isim–sifət ikiliyi (soyuq, isti kimi) və sifətin quruluşca növləri (proqramda sifət üçün yoxdur).
(function () {
  const h = Oyun.h;
  const AD = { I: "isim", S: "sifət", Y: "say", E: "əvəzlik", F: "feil", Z: "zərf", Q: "qoşma", B: "bağlayıcı" };
  const PRED = { I: "isimdir", S: "sifətdir", Y: "saydır", E: "əvəzlikdir", F: "feildir", Z: "zərfdir" };
  const PLD = { I: "isimlərdir", S: "sifətlərdir", Y: "saylardır", E: "əvəzliklərdir", F: "feillərdir" };
  // ümumi qrammatik məna (5-ci sinif dərsliyi, 1-ci hissə s. 27; 2-ci hissə s. 34, 41, 54; əvəzlik: proqram)
  const MEAN = { I: "əşya bildirir (kim? nə? hara?)", S: "əşyanın əlamətini, keyfiyyətini bildirir (necə? hansı?)", Y: "miqdar və ya sıra bildirir (neçə? nə qədər? neçənci?)",
    E: "əsas nitq hissələrinin yerində işlənir", F: "hərəkət bildirir (nə etdi? nə edir? …)" };
  const HALSUAL = { "adlıq": "kim? nə?", "yiyəlik": "kimin? nəyin?", "yönlük": "kimə? nəyə?", "təsirlik": "kimi? nəyi?", "yerlik": "kimdə? nədə?", "çıxışlıq": "kimdən? nədən?" };
  const HALLAR = Object.keys(HALSUAL);

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
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const cap = x => x[0].toLocaleUpperCase("az") + x.slice(1);

  // ---- cümlə bankı: "söz:ETİKET"; "_" iki sözdən ibarət bir vahiddir; etiketsiz işarə — durğu işarəsi.
  // I isim, S sifət, Y say, E əvəzlik, F feil, Z zərf, Q qoşma, B bağlayıcı.
  // Əlavə: "S~" isimləşmiş sifət (dərslik: sifət olaraq qalır), "I^" sifətləşmiş isim (dərslik: isim hesab olunur);
  // "=hal" — isimləşmiş sifətin halı.
  const BANK = [
    // sifət olan cümlələr
    "Sarı:S çiçək:I vazada:I durur:F .",
    "Hündür:S ağaclar:I bağı:I küləkdən:I qoruyur:F .",
    "Nənəm:I turş:S alçadan:I mürəbbə:I bişirdi:F .",
    "Səbirli:S müəllim:I qaydanı:I şagirdlərə:I izah_etdi:F .",
    "Ağıllı:S qız:I məsələni:I tez:Z həll_etdi:F .",
    "Dərin:S çaydan:I balıq:I tutdular:F .",
    "Qəmgin:S uşaq:I pəncərədən:I baxırdı:F .",
    "Yeni:S kitablar:I rəfə:I düzüldü:F .",
    "İki:Y yaşıl:S şar:I göyə:I uçdu:F .",
    "Sağlam:S uşaq:I tezdən:Z durdu:F .",
    "Mehriban:S qonşu:I bizə:E çiçək:I gətirdi:F .",
    "Qorxaq:S pişik:I stolun:I altına:I girdi:F .",
    "Cəsarətli:S oğlan:I uşağı:I sudan:I çıxartdı:F .",
    "Nazik:S buz:I çayı:I örtmüşdü:F .",
    "Yorğun:S sürücü:I yolda:I dayandı:F .",
    "Qara:S bulud:I şəhərin:I üstünü:I aldı:F .",
    "Göl:I dərindir:S .",
    "Bu:E çanta:I ağırdır:S .",
    "Biz:E uca:S dağa:I dırmandıq:F .",
    "Anam:I mənə:E isti:S çay:I gətirdi:F .",
    "Müəllim:I çətin:S tapşırığı:I lövhədə:I izah_etdi:F .",
    "Uşaqlar:I yumru:S daşı:I suya:I atdılar:F .",
    "Arıq:S uşaq:I qapıdan:I içəri:Z girdi:F .",
    "Dədəm:I nazik:S və:B uzun:S çubuq:I kəsdi:F .",
    "Gözəl:S və:B hündür:S ağac:I bağın:I ortasında:I bitmişdi:F .",
    "Ucuz:S paltarı:I mən:E aldım:F .",
    "Alma:I şirindir:S , amma:B limon:I turşdur:S .",
    "Qırmızı:S və:B sarı:S güllər:I açıldı:F .",
    "Biz:E dünən:Z üç:Y yeni:S kitab:I aldıq:F .",
    "Həyətimizdə:I iki:Y hündür:S ağac:I böyüyür:F .",
    "Atam:I mənim:E üçün:Q maraqlı:S kitab:I gətirdi:F .",
    "Dağın:I zirvəsindən:I gözəl:S mənzərə:I açıldı:F .",
    "Yaxşı:S iş:I hamıya:E xeyir:I gətirir:F .",
    "Doğru:S cavabları:I dəftərə:I yazdıq:F .",
    "Bərk:S daşlar:I yolu:I bağlamışdı:F .",
    "Qədim:S gümüş:I^ bilərzik:I muzeydə:I saxlanılır:F .",
    "Ev:I uca:S daş:I^ hasarla:I əhatə_olunmuşdur:F .",
    "Anam:I mənə:E isti:S yun:I^ corab:I toxudu:F .",
    "Qırmızı:S daş:I^ divar:I uzaqdan:Z görünürdü:F .",
    // sifəti olmayan cümlələr (sifətləşmiş isim, zərf, isim, feil…)
    "Həyətin:I dəmir:I^ darvazası:I yavaşca:Z açıldı:F .",
    "Anam:I mənə:E yun:I^ corab:I toxudu:F .",
    "Atam:I mənə:E dəri:I^ çanta:I aldı:F .",
    "Usta:I taxta:I^ qapı:I düzəltdi:F .",
    "Muzeydə:I gümüş:I^ bilərzik:I saxlanılır:F .",
    "Bu:E zavodda:I beton:I^ konstruksiyalar:I hazırlanır:F .",
    "Körpünü:I polad:I^ dayaqlar:I saxlayır:F .",
    "Nənəm:I ipək:I^ yaylıq:I bağladı:F .",
    "Qardaşım:I geri:Z döndü:F .",
    "Biz:E dünən:Z parka:I getdik:F .",
    "Lalə:I məktubu:I diqqətlə:Z oxudu:F .",
    "Külək:I bərk:Z əsirdi:F .",
    "Lalə:I ingiliscə:Z yaxşı:Z danışırdı:F .",
    "Natiq:I fikirlərini:I gözəl:Z ifadə_edirdi:F .",
    "Uşaq:I doğru:Z danışdı:F .",
    "Ceyran:I tez:Z qaçırdı:F .",
    "Atam:I hər:E gün:I işə:I tezdən:Z gedir:F .",
    "Mən:E ikinci:Y mərtəbədə:I yaşayıram:F .",
    // isimləşmiş sifətlər (dərslik s. 80: tox, ac, igid, cəsur, qara, pis, yaxşı; qoca, cavan, tənbəl)
    "Toxun:S~=yiyəlik acdan:S~=çıxışlıq xəbəri:I olmaz:F .",
    "İgidin:S~=yiyəlik adını:I eşit:F , üzünü:I görmə:F .",
    "Tənbələ:S~=yönlük iş:I buyur:F , o:E sənə:E nağıl:I danışsın:F .",
    "İkinci:Y mərhələdə:I cəsurlar:S~=adlıq müxtəlif:S sınaqlardan:I keçdilər:F .",
    "Növbəti:S oyunda:I sən:E qaralarla:S~ oynayacaqsan:F .",
    "Pis:S~=adlıq olmasa:F , yaxşının:S~=yiyəlik qədri:I bilinməz:F .",
    "Qocanı:S~=təsirlik hamı:E hörmətlə:Z qarşıladı:F .",
    "Həmişə:Z ağıllını:S~=təsirlik dinlə:F .",
    "Yaxşını:S~=təsirlik pisdən:S~=çıxışlıq ayır:F .",
    "Cavanlar:S~=adlıq stadiona:I yığışdılar:F .",
    "Qocalar:S~=adlıq bağda:I oturmuşdular:F .",
    "Qocaya:S~=yönlük yer:I verdilər:F .",
    "Qocadan:S~=çıxışlıq məsləhət:I istədik:F .",
    "Qocanın:S~=yiyəlik sözünü:I hamı:E dinlədi:F .",
    "Yaxşıda:S~=yerlik eyib:I axtarmazlar:F .",
  ].map(s => s.split(" ").map(t => { const m = t.match(/^(.+?):([A-Z])([~^]?)(?:=(.+))?$/); return m ? { w: m[1].replace(/_/g, " "), t: m[2], m: m[3], hal: m[4] || "" } : { w: t, t: null, m: "", hal: "" }; }));
  const words = s => s.filter(x => x.t);
  const plain = s => s.map((x, i) => (i && x.t ? " " : "") + x.w).join("");
  const has = (s, t) => s.some(x => x.t === t);
  const hasM = (s, m) => s.some(x => x.m === m);
  // fərqləndirilmiş söz qalın və altdan xətli
  const markIn = (s, k) => h("span", {}, plain(s.slice(0, k)) + (k ? " " : ""), h("u", {}, h("b", {}, s[k].w)), s.slice(k + 1).map(x => (x.t ? " " : "") + x.w).join(""));
  const FULL = BANK;
  const withS = FULL.filter(s => has(s, "S"));
  const noS = FULL.filter(s => !has(s, "S"));

  // ---- tək sözlər (cümlədən kənarda da nitq hissəsi birmənalıdır)
  const SOZ = {
    S: ["mehriban", "ağıllı", "səbirli", "hündür", "geniş", "ləzzətli", "cəsarətli", "dərin", "qəmgin", "yaşıl", "nazik", "qorxaq", "səliqəli", "uzun", "iri", "yumru", "arıq", "turş", "sağlam", "ağır", "yorğun"],
    I: ["kitab", "dəniz", "ağac", "məktəb", "şəhər", "qələm", "çiçək", "vətən", "dəftər", "pəncərə", "sərçə", "bulud"],
    Y: ["yeddi", "doqquz", "iyirmi", "otuz", "beşinci", "onuncu", "səkkizinci"],
    F: ["oxudu", "yazır", "qaçdı", "düşünür", "sevindi", "gülür", "danışdılar", "əkdik", "yazacaq", "oynayır"],
    E: ["mən", "biz", "onlar", "siz", "kim", "hamı", "kimsə"],
  };
  // sifətə oxşayan, amma isim olan mücərrəd sözlər (real sınaq 35: "vüqar")
  const ISIM_MUC = ["səbir", "ağıl", "cəsarət", "qürur", "ləyaqət", "qorxu", "sevinc", "dostluq", "mehribanlıq", "hündürlük"];

  function oddSet() {
    let four, odd, a, b;
    if (Math.random() < .5) { four = sample(SOZ.S, 4); a = "S"; b = pick(["I", "I", "Y", "F", "E"]); odd = b === "I" && Math.random() < .6 ? pick(ISIM_MUC) : pick(SOZ[b]); }
    else { a = pick(["I", "Y", "F", "E"]); four = sample(SOZ[a], 4); odd = pick(SOZ.S); b = "S"; }
    return { four, odd, a, b, sol: "“" + odd + "” — " + AD[b] + ": " + MEAN[b] + ". Qalanları " + PLD[a] + ": " + MEAN[a] + "." };
  }

  // ---- əlamət və keyfiyyət (5-ci sinif, 2-ci hissə, s. 34, sxem)
  const ALAM = [["sarı", "rəng"], ["yaşıl", "rəng"], ["boz", "rəng"], ["iri", "ölçü"], ["hündür", "ölçü"], ["geniş", "ölçü"], ["uzun", "ölçü"], ["yumru", "forma"], ["arıq", "zahiri görkəm"]];
  const KEYF = [["turş", "dad"], ["şirin", "dad"], ["səbirli", "xasiyyət"], ["mehriban", "xasiyyət"], ["qorxaq", "xasiyyət"], ["cəsarətli", "xasiyyət"], ["ağıllı", "intellekt"], ["sağlam", "hal, vəziyyət"], ["yorğun", "hal, vəziyyət"]];

  // ---- dərəcələr (5-ci sinif, 2-ci hissə, s. 34 tapşırıq 5d, 5e; s. 35 "Sifətin yazılışı"; 7-ci sinif: ən, daha, lap)
  const DERS = { adi: "adi dərəcə", az: "azaltma dərəcəsi", cox: "çoxaltma dərəcəsi" };
  const DERIZ = { adi: "keyfiyyət normal dərəcədədir", az: "keyfiyyət normadan azdır", cox: "keyfiyyət normadan çoxdur" };
  const DER = [
    ["turş", "adi"], ["şirin", "adi"], ["qara", "adi"], ["quru", "adi"], ["yaşıl", "adi"], ["ucuz", "adi"], ["gözəl", "adi"], ["ağıllı", "adi"], ["enli", "adi"], ["uca", "adi"], ["zəif", "adi"], ["saf", "adi"], ["boz", "adi"], ["dərin", "adi"], ["təmiz", "adi"],
    ["kəmşirin", "az", "şirin sifətinin azaltma dərəcəsi (kəm sözü ilə)"], ["turştəhər", "az", "turş sifətinin azaltma dərəcəsi (təhər sözü ilə)"],
    ["qupquru", "cox", "quru sifətinin çoxaltma dərəcəsi (p samiti ilə)"], ["masmavi", "cox", "mavi sifətinin çoxaltma dərəcəsi (s samiti ilə)"], ["tərtəmiz", "cox", "təmiz sifətinin çoxaltma dərəcəsi (r samiti ilə)"],
    ["yamyaşıl", "cox", "yaşıl sifətinin çoxaltma dərəcəsi (m samiti ilə)"], ["ağappaq", "cox", "ağ sifətinin çoxaltma dərəcəsi (p samiti ilə)"], ["qapqara", "cox", "qara sifətinin çoxaltma dərəcəsi (p samiti ilə)"],
    ["bomboz", "cox", "boz sifətinin çoxaltma dərəcəsi (m samiti ilə)"], ["dümağ", "cox", "ağ sifətinin çoxaltma dərəcəsi (düm hissəciyi ilə)"], ["tumturş", "cox", "turş sifətinin çoxaltma dərəcəsi"],
    ["çox dadlı", "cox", "çox sözü ilə"], ["ən ucuz", "cox", "ən sözü ilə"], ["daha gözəl", "cox", "daha sözü ilə"], ["lap yaxşı", "cox", "lap sözü ilə"], ["zil qara", "cox", "zil sözü ilə"], ["çox ağıllı", "cox", "çox sözü ilə"],
  ].map(([f, d, iz]) => ({ f, d, iz: iz || DERIZ[d] }));
  const derOf = d => DER.filter(x => x.d === d);
  const derSol = x => "“" + x.f + "” — " + DERS[x.d] + ": " + x.iz + (x.d === "adi" ? "" : ". " + cap(DERIZ[x.d])) + ".";

  // ---- yazılış (5-ci sinif, 2-ci hissə, s. 35): [hissələr, növ, qayda]
  const RUL = {
    mprs: "m, p, r, s samitlərinin köməyi ilə düzələn çoxaltma dərəcəsi bitişik yazılır",
    kdt: "kəm, təhər sözlərinin və düm hissəciyinin iştirakı ilə yaranan sifət bitişik yazılır",
    aci: "açıq, ala, tünd sözləri ilə düzələn dərəcəli sifət defislə yazılır",
    aci2: "açıq, tünd rəng bildirməyən sözə qoşulub mürəkkəb sifət yaradır, dərəcə bildirmir və bitişik yazılır",
    en: "tərkibində ən, daha, çox, lap, zil sözləri olan sifət ayrı yazılır",
  };
  const KIND = { b: "bitişik", d: "defislə", a: "ayrı" };
  const YAZ = [
    [["qup", "quru"], "b", "mprs"], [["mas", "mavi"], "b", "mprs"], [["tər", "təmiz"], "b", "mprs"], [["yam", "yaşıl"], "b", "mprs"], [["ağ", "appaq"], "b", "mprs"], [["qap", "qara"], "b", "mprs"], [["bom", "boz"], "b", "mprs"],
    [["düm", "ağ"], "b", "kdt"], [["kəm", "şirin"], "b", "kdt"], [["turş", "təhər"], "b", "kdt"],
    [["açıq", "fikirli"], "b", "aci2", 1], [["açıq", "qəlbli"], "b", "aci2", 1], [["açıq", "ürəkli"], "b", "aci2", 1], [["tünd", "xasiyyət"], "b", "aci2", 1],
    [["açıq", "sarı"], "d", "aci"], [["tünd", "göy"], "d", "aci"], [["ala", "yarımçıq"], "d", "aci"],
    [["ən", "ucuz"], "a", "en"], [["daha", "gözəl"], "a", "en"], [["çox", "ağıllı"], "a", "en"], [["lap", "yaxşı"], "a", "en"], [["zil", "qara"], "a", "en"], [["çox", "dadlı"], "a", "en"],
  ].map(([p, k, r, nw]) => ({ p, k, r, noWrong: !!nw, b: p.join(""), d: p.join("-"), a: p.join(" "), f: k === "b" ? p.join("") : k === "d" ? p.join("-") : p.join(" ") }));
  const wrongForms = x => ["b", "d", "a"].filter(k => k !== x.k).map(k => x[k]);
  const yazSol = x => "“" + x.f + "” — " + KIND[x.k] + " yazılır: " + RUL[x.r] + ".";

  // ---- eyni söz — fərqli nitq hissəsi: bankdakı cümlələrdən
  const ZLOOK = ["yaxşı", "gözəl", "doğru", "bərk", "tez", "tezdən", "yavaşca", "diqqətlə", "hörmətlə", "uzaqdan", "içəri", "geri"];
  const WHY = {
    S: "necə? hansı? — ismə aiddir, əlamət bildirir",
    "S~": "isimləşmiş sifət: kim? nə? sualına cavab verir, hal və ya cəm şəkilçisi qəbul edib, amma sifət olaraq qalır",
    "I^": "sifətləşmiş isim: necə? sualına cavab versə də, isim hesab olunur",
    Z: "necə? — feilə aiddir, hərəkətin tərzini bildirir",
  };
  const OMO = [];
  FULL.forEach(s => s.forEach((x, k) => {
    if (!x.t) return;
    const kind = x.t === "S" ? (x.m === "~" ? "S~" : "S") : x.m === "^" ? "I^" : x.t === "Z" && ZLOOK.includes(x.w.toLocaleLowerCase("az")) ? "Z" : null;
    if (kind) OMO.push({ s, k, kind, w: x.w, ad: kind === "I^" ? "I" : kind === "S~" ? "S" : kind });
  }));
  const omoOf = kinds => OMO.filter(o => kinds.includes(o.kind));
  const omoSol = o => "“" + o.w + "” — " + AD[o.ad] + ": " + WHY[o.kind] + ".";
  const NITQ5 = ["isim", "sifət", "say", "zərf", "feil"];

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "umumi", ad: "Ümumi qrammatik məna", izah: "Sifət əşyanın əlamətini, keyfiyyətini bildirir (necə? hansı?). Beş sözdən biri başqa nitq hissəsidir — hansı?",
      gen() { const o = oddSet(), ch = shuffle([...o.four, o.odd]); return { text: "Ümumi qrammatik mənasına görə biri fərqlidir:", choices: ch, correct: ch.indexOf(o.odd), show: o.odd, solution: o.sol }; } },
    { id: "tap", ad: "Cümlədə sifəti tap", izah: "Cümlədəki bütün sifətlərə toxun. Hər sözə sual ver: necə? hansı? Ismə aid olub əlamət bildirirsə — sifətdir. Diqqət: daş hasar, dəmir darvaza — isimdir.",
      gen() {
        const s = pick(withS), duz = s.map((x, i) => x.t === "S" ? i : -1).filter(i => i >= 0);
        const rest = words(s).filter(x => x.t !== "S").map(x => x.w + " — " + (x.m === "^" ? "sifətləşmiş isim, isim sayılır" : AD[x.t])).join(", ");
        return { text: "Cümlədəki bütün sifətlərə toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
          solution: "Sifətlər: " + duz.map(i => s[i].w + (s[i].m === "~" ? " (isimləşmiş sifət, sifət olaraq qalır)" : "")).join(", ") + " — əlamət, keyfiyyət bildirir (necə? hansı?). Qalanları: " + rest + "." };
      } },
    { id: "alamet", ad: "Əlamət və keyfiyyət", izah: "Rəng, ölçü, forma, zahiri görkəm — əlamətdir. Dad, xasiyyət, intellekt, hal-vəziyyət — keyfiyyətdir. Əşya adı sifət deyil.",
      gen() {
        const a = sample(ALAM, 3), k = sample(KEYF, 3), extra = R(2) ? [] : [pick(SOZ.I)];
        const all = shuffle([...a.map(x => ({ w: x[0], g: 0, n: x[1] })), ...k.map(x => ({ w: x[0], g: 1, n: x[1] })), ...extra.map(w => ({ w, g: 2 }))]);
        return { text: "Sözləri qruplara ayır.", bol: { soz: all.map(x => x.w), qrup: ["əlamət bildirir", "keyfiyyət bildirir", "sifət deyil (əşya adıdır)"], duz: all.map(x => x.g) },
          show: all.map(x => x.w + " — " + ["əlamət", "keyfiyyət", "sifət deyil"][x.g]).join("; "),
          solution: all.map(x => x.w + " — " + (x.g === 2 ? "isimdir, əşya bildirir" : x.n + " → " + (x.g ? "keyfiyyət" : "əlamət"))).join("; ") + "." };
      } },
    { id: "derece", ad: "Sifətin dərəcəsi", izah: "Adi dərəcə — keyfiyyət normaldır (turş). Azaltma — normadan azdır (turştəhər). Çoxaltma — normadan çoxdur (tumturş).",
      gen() {
        if (Math.random() < .55) {
          const x = pick(DER), ch = Object.values(DERS);
          return { text: "“" + x.f + "” sifəti hansı dərəcədədir?", choices: ch, correct: ch.indexOf(DERS[x.d]), show: DERS[x.d], solution: derSol(x) };
        }
        const arr = shuffle([...sample(derOf("adi"), 2), ...sample(derOf("az"), 2), ...sample(derOf("cox"), 2)].map(x => ({ x, g: ["adi", "az", "cox"].indexOf(x.d) })));
        if (R(2)) arr.splice(R(arr.length + 1), 0, { x: { f: pick(SOZ.I) }, g: 3 });
        return { text: "Sözləri dərəcələrinə görə qruplara ayır.", bol: { soz: arr.map(o => o.x.f), qrup: ["adi dərəcə", "azaltma dərəcəsi", "çoxaltma dərəcəsi", "sifət deyil"], duz: arr.map(o => o.g) },
          show: arr.map(o => o.x.f + " — " + (o.g === 3 ? "sifət deyil" : DERS[o.x.d])).join("; "),
          solution: arr.map(o => o.g === 3 ? "“" + o.x.f + "” — isimdir, sifət deyil" : derSol(o.x).slice(0, -1)).join("; ") + "." };
      } },
    { id: "yazilis", ad: "Dərəcəli sifətlərin yazılışı", izah: "m, p, r, s; kəm, təhər, düm — bitişik. Açıq, ala, tünd + rəng — defislə. Ən, daha, çox, lap, zil — ayrı.",
      gen() {
        if (Math.random() < .5) {
          const x = pick(YAZ.filter(y => !y.noWrong)), ch = shuffle([x.b, x.d, x.a]);
          return { text: "Sifətin düzgün yazılışını seç:", choices: ch, correct: ch.indexOf(x.f), show: x.f, solution: yazSol(x) };
        }
        const k = pick(["b", "d", "a"]), good = sample(YAZ.filter(y => y.k === k), 2 + R(2)), others = sample(YAZ.filter(y => y.k !== k), 6 - good.length);
        const all = shuffle([...good, ...others]), duz = all.map((y, i) => y.k === k ? i : -1).filter(i => i >= 0);
        return { text: cap(KIND[k]) + " yazılan sifətlərin hamısına toxun.", sec: { soz: all.map(y => y.f), duz }, show: duz.map(i => all[i].f).join(", "),
          solution: all.map(y => y.f + " — " + KIND[y.k]).join("; ") + ". Qayda: " + RUL[k === "b" ? "mprs" : k === "d" ? "aci" : "en"] + "." };
      } },
    { id: "omonim", ad: "Eyni söz — fərqli nitq hissəsi", izah: "Sifət ismə aiddir (hansı iş?), zərf feilə (necə danışdı?). Daş hasar — isim. İsimləşmiş sifət — yenə sifət.",
      gen() {
        const o = pick(omoOf([pick(["S", "Z", "I^", "S~"])])), ad = AD[o.ad];
        return { text: h("span", {}, "Fərqləndirilmiş söz hansı nitq hissəsidir?", line(markIn(o.s, o.k))), choices: NITQ5, correct: NITQ5.indexOf(ad), show: ad, solution: omoSol(o) };
      } },
    { id: "isimlesme", ad: "İsimləşmiş sifət", izah: "İsimləşmiş sifət kim? nə? sualına cavab verir, hal, mənsubiyyət, cəm şəkilçisi qəbul edir, amma sifət olaraq qalır.",
      gen() {
        if (Math.random() < .55) {
          const s = pick(FULL.filter(x => hasM(x, "~"))), duz = s.map((x, i) => x.m === "~" ? i : -1).filter(i => i >= 0);
          const adi = words(s).filter(x => x.t === "S" && x.m !== "~").map(x => x.w);
          return { text: "Cümlədəki isimləşmiş sifətlərin hamısına toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
            solution: duz.map(i => s[i].w + " — kim? nə? sualına cavab verir, isim kimi işlənib, amma sifət olaraq qalır").join("; ") + "." + (adi.length ? " " + cap(adi.join(", ")) + " — ismə aid olan adi sifətdir." : "") };
        }
        const o = pick(OMO.filter(x => x.s[x.k].hal)), hal = o.s[o.k].hal, opts = shuffle([hal, ...sample(HALLAR.filter(x => x !== hal), 4)]);
        return { text: h("span", {}, "Fərqləndirilmiş isimləşmiş sifət hansı haldadır?", line(markIn(o.s, o.k))), choices: opts, correct: opts.indexOf(hal), show: hal,
          solution: "“" + o.w + "” — " + HALSUAL[hal] + " sualına cavab verir: " + hal + " haldadır. İsimləşmiş sifət olaraq sifət qalır." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümlədə üç sözün nitq hissəsini yazıb. Biri səhvdir — hansı? Ən çox səhv: isimləşmiş sifəti isim, sifətləşmiş ismi sifət saymaq.",
      gen() {
        const CONF = { I: "sifət", S: "zərf", Y: "sifət", E: "isim", F: "isim", Z: "sifət", Q: "bağlayıcı", B: "qoşma" };
        let s, ws, three;
        do {
          s = pick(FULL.filter(x => words(x).length >= 3 && (hasM(x, "~") || hasM(x, "^") || has(x, "S"))));
          ws = words(s);
          const hot = ws.filter(x => x.t === "S" || x.m), first = pick(hot);
          three = [first, ...sample(ws.filter(x => x !== first), 2)];
        } while (new Set(three).size < 3);
        three.sort((a, b) => ws.indexOf(a) - ws.indexOf(b));
        const k = R(3), name = x => x.m === "~" || x.m === "^" ? (x.m === "~" ? "sifət" : "isim") : AD[x.t];
        const wrongName = x => x.m === "~" ? "isim" : x.m === "^" ? "sifət" : CONF[x.t];
        const lab = three.map((x, j) => j === k ? wrongName(x) : name(x)), ord = ["1-ci", "2-ci", "3-cü"], w = three[k];
        return { text: "«" + plain(s) + "» — şagirdin təhlili: " + three.map((x, j) => (j + 1) + ") " + x.w + " — " + lab[j]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "“" + w.w + "” " + lab[k] + " deyil, " + name(w) + (w.m === "~" ? " (isimləşmiş sifət sifət olaraq qalır)" : w.m === "^" ? " (sifətləşmiş isim isim hesab olunur)" : "") + ". Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E) ========
  const FIKIR_DUZ = [
    "Sifət əşyanın əlamətini və keyfiyyətini bildirir.",
    "Sifət necə? hansı? suallarından birinə cavab verir.",
    "Sifətin adi, azaltma və çoxaltma dərəcələri var.",
    "Adi dərəcədə keyfiyyət normal olur.",
    "Azaltma dərəcəsində keyfiyyət normadan az olur.",
    "Çoxaltma dərəcəsində keyfiyyət normadan çox olur.",
    "Çoxaltma dərəcəsi bəzən m, p, r, s samitlərinin köməyi ilə düzəlir.",
    "m, p, r, s samitlərinin köməyi ilə düzələn çoxaltma dərəcəli sifətlər bitişik yazılır.",
    "Kəm, təhər sözlərinin və düm hissəciyinin iştirakı ilə yaranan sifətlər bitişik yazılır.",
    "Açıq, ala, tünd sözləri ilə düzələn dərəcəli sifətlər defislə yazılır.",
    "Tərkibində ən, daha, çox, lap, zil sözləri olan sifətlər ayrı yazılır.",
    "Açıq, tünd sözləri rəng bildirməyən sözlərə qoşulduqda dərəcə əlaməti bildirmir və bitişik yazılır.",
    "İsimləşmiş sifət ismin qrammatik xüsusiyyətlərini qəbul etsə də, sifət olaraq qalır.",
    "İsimləşmiş sifət kim? nə? suallarına cavab verir.",
    "İsimləşmiş sifət hal, mənsubiyyət və cəm şəkilçiləri qəbul edir.",
    "Sifətləşmiş isim sifətin sualına cavab versə də, isim hesab olunur.",
    "Bəzi isimlər söz birləşməsi və cümlə daxilində varlığın əlamətini ifadə edə bilər.",
    "Zərf, əsasən, feilə aid olub hərəkəti müxtəlif cəhətdən izah edir.",
  ];
  const FIKIR_SEHV = [
    "Sifət əşyanın miqdarını bildirir.",
    "Sifətin yalnız iki dərəcəsi var.",
    "Azaltma dərəcəsində keyfiyyət normadan çox olur.",
    "Çoxaltma dərəcəsində keyfiyyət normadan az olur.",
    "Adi dərəcədə keyfiyyət normadan azdır.",
    "m, p, r, s samitlərinin köməyi ilə düzələn çoxaltma dərəcəli sifətlər defislə yazılır.",
    "Ən, daha, çox, lap, zil sözləri olan sifətlər bitişik yazılır.",
    "Kəm, təhər sözlərinin iştirakı ilə yaranan sifətlər ayrı yazılır.",
    "İsimləşmiş sifət isim sayılır.",
    "Sifətləşmiş isim sifət hesab olunur.",
    "İsimləşmiş sifət hal şəkilçisi qəbul edə bilməz.",
    "Sifət feilə aid olub hərəkəti izah edir.",
  ];
  // söz haqqında fikirlər: [söz, doğru fikirlər, səhv fikirlər]
  const PROFIL = [
    ["kəmşirin", ["sifətdir", "keyfiyyət bildirir", "azaltma dərəcəsindədir", "bitişik yazılır", "necə? sualına cavab verir"], ["çoxaltma dərəcəsindədir", "adi dərəcədədir", "defislə yazılır", "ayrı yazılır", "isimdir", "əlamət bildirir"]],
    ["qapqara", ["sifətdir", "əlamət (rəng) bildirir", "çoxaltma dərəcəsindədir", "bitişik yazılır", "necə? sualına cavab verir"], ["azaltma dərəcəsindədir", "adi dərəcədədir", "defislə yazılır", "ayrı yazılır", "isimdir", "keyfiyyət bildirir"]],
    ["tumturş", ["sifətdir", "keyfiyyət (dad) bildirir", "çoxaltma dərəcəsindədir", "keyfiyyət normadan çoxdur", "bitişik yazılır"], ["azaltma dərəcəsindədir", "adi dərəcədədir", "defislə yazılır", "ayrı yazılır", "əlamət bildirir", "isimdir"]],
    ["turştəhər", ["sifətdir", "keyfiyyət (dad) bildirir", "azaltma dərəcəsindədir", "keyfiyyət normadan azdır", "bitişik yazılır"], ["çoxaltma dərəcəsindədir", "adi dərəcədədir", "defislə yazılır", "ayrı yazılır", "əlamət bildirir", "isimdir"]],
    ["dümağ", ["sifətdir", "əlamət (rəng) bildirir", "çoxaltma dərəcəsindədir", "bitişik yazılır", "necə? sualına cavab verir"], ["azaltma dərəcəsindədir", "adi dərəcədədir", "defislə yazılır", "ayrı yazılır", "keyfiyyət bildirir", "isimdir"]],
    ["açıq-sarı", ["sifətdir", "əlamət (rəng) bildirir", "defislə yazılır", "necə? sualına cavab verir"], ["bitişik yazılır", "ayrı yazılır", "isimdir", "keyfiyyət bildirir", "zərfdir"]],
    ["ən ucuz", ["sifətdir", "çoxaltma dərəcəsindədir", "ayrı yazılır", "necə? hansı? sualına cavab verir"], ["bitişik yazılır", "defislə yazılır", "azaltma dərəcəsindədir", "adi dərəcədədir", "isimdir"]],
    ["açıqfikirli", ["sifətdir", "bitişik yazılır", "dərəcə əlaməti bildirmir", "keyfiyyət (xasiyyət) bildirir"], ["defislə yazılır", "ayrı yazılır", "çoxaltma dərəcəsindədir", "azaltma dərəcəsindədir", "isimdir"]],
  ];
  const omoLines = items => items.map((o, i) => h("span", { style: "display:block" }, (i + 1) + ". ", markIn(o.s, o.k)));
  const sentLines = (items, fn) => items.map((s, i) => h("span", { style: "display:block" }, (i + 1) + ". ", fn(s)));
  const fullPlain = s => plain(s);

  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. ümumi qrammatik məna (real sınaq 35)
    { tip: "qapali", gen: () => Oyun.again(() => { const o = oddSet(); return AEq("Ümumi qrammatik mənasına görə biri fərqlidir:", o.odd, o.four, o.sol); }) },
    // 2. cümlələrin birində sifət yoxdur (real sınaq 33)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const pool = Math.random() < .5 ? noS.filter(s => hasM(s, "^")) : noS, odd = pick(pool), reg = withS.filter(s => s.some(x => x.t === "S" && !x.m));
      const four = [...sample(reg, 3)]; const last = pick(withS.filter(s => !four.includes(s))); four.push(last);
      const note = hasM(odd, "^") ? " “" + odd.find(x => x.m === "^").w + "” sifətləşmiş isimdir — isim hesab olunur." : "";
      return AEq("Cümlələrin birində sifət yoxdur:", plain(odd), four.map(plain),
        "“" + plain(odd) + "” — sifət yoxdur (" + words(odd).map(w => w.w + " — " + AD[w.t]).join(", ") + ")." + note + " Digər cümlələrdə sifət: " + four.map(s => words(s).filter(w => w.t === "S").map(w => w.w).join(", ")).join("; ") + ".");
    }) },
    // 3. söz haqqında səhv / doğru fikir (real sınaq 28)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [w, duz, sehv] = pick(PROFIL);
      if (Math.random() < .7) { const bad = pick(sehv); return AEq("“" + cap(w) + "” sözü ilə bağlı səhv fikri müəyyən edin.", bad, sample(duz, 4), "“" + w + "”: " + duz.join("; ") + ". Səhv fikir: " + bad + "."); }
      const ok = pick(duz); return AEq("“" + cap(w) + "” sözü ilə bağlı doğru fikri müəyyən edin.", ok, sample(sehv, 4), "“" + w + "”: " + duz.join("; ") + ". Doğru fikir: " + ok + ".");
    }) },
    // 4. yazılışı səhv olan sifət
    { tip: "qapali", gen: () => Oyun.again(() => {
      const x = pick(YAZ.filter(y => !y.noWrong)), bad = pick(wrongForms(x)), four = sample(YAZ.filter(y => y !== x && y.f !== bad), 4);
      if (new Set(four.map(y => y.k)).size < 2) return null;
      return AEq("Hansı sifətin yazılışı səhvdir?", bad, four.map(y => y.f), "Səhv: “" + bad + "”. Düzgün yazılış — “" + x.f + "” (" + RUL[x.r] + "). Digər dörd sifət düzgün yazılıb.");
    }) },
    // 5. nömrə kombinasiyası: yazılış növü
    { tip: "qapali", gen: () => Oyun.again(() => {
      const k = pick(["b", "d", "a"]), five = sample(YAZ, 5), right = five.map((y, i) => y.k === k ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Nömrələnmiş sifətlərdən hansılar " + KIND[k] + " yazılır?", ...five.map((y, i) => h("span", { style: "display:block" }, (i + 1) + ". " + y.f))), ...o, show: o.choices[o.correct],
        solution: five.map((y, i) => (i + 1) + ") " + y.f + " — " + KIND[y.k]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 6. təsirlik hallı isimləşmiş sifət (real sınaq 32)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const isTes = s => s.some(x => x.m === "~" && x.hal === "təsirlik");
      const right = pick(FULL.filter(isTes));
      const others = FULL.filter(s => !isTes(s) && (hasM(s, "~") || has(s, "S")));
      const wrong = [...sample(others.filter(s => hasM(s, "~")), 1 + R(2))];
      wrong.push(...sample(others.filter(s => !hasM(s, "~") && !wrong.includes(s)), 4 - wrong.length));
      if (wrong.length !== 4) return null;
      const tw = right.filter(x => x.m === "~" && x.hal === "təsirlik").map(x => x.w).join(", ");
      return AEq("Təsirlik hallı isimləşmiş sifətin işləndiyi cümləni müəyyən edin:", plain(right), wrong.map(plain),
        "“" + tw + "” — isimləşmiş sifətdir, kimi? nəyi? sualına cavab verir, təsirlik haldadır. Digər cümlələrdə ya isimləşmiş sifət başqa haldadır (" + wrong.filter(s => hasM(s, "~")).map(s => s.filter(x => x.m === "~").map(x => x.w + " — " + x.hal).join(", ")).join("; ") + "), ya da sifət isimləşməyib.");
    }) },
    // 7. nömrə kombinasiyası: isimləşmiş sifət
    { tip: "qapali", gen: () => Oyun.again(() => {
      const nR = 1 + R(3), a = sample(omoOf(["S~"]), nR), b = sample(omoOf(["S", "I^", "Z"]), 5 - nR), five = shuffle([...a, ...b]);
      if (new Set(five.map(o => o.s)).size < 5) return null;
      const right = five.map((o, i) => o.kind === "S~" ? i + 1 : 0).filter(Boolean), o2 = comboChoices(right); if (!o2) return null;
      return { text: h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz isimləşmiş sifətdir?", ...omoLines(five)), ...o2, show: o2.choices[o2.correct],
        solution: five.map((o, i) => (i + 1) + ") " + o.w + " — " + AD[o.ad] + " (" + WHY[o.kind] + ")").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 8. dərəcə
    { tip: "qapali", gen: () => Oyun.again(() => {
      const d = pick(["cox", "cox", "az", "adi"]), x = pick(derOf(d)), others = DER.filter(y => y.d !== d), four = sample(others, 4);
      if (d === "az" && !four.some(y => y.d === "cox")) return null;
      return AEq("Hansı sifət " + (d === "adi" ? "adi dərəcədədir" : d === "az" ? "azaltma dərəcəsindədir" : "çoxaltma dərəcəsindədir") + "?", x.f, four.map(y => y.f),
        derSol(x) + " Qalanları: " + four.map(y => y.f + " — " + DERS[y.d]).join("; ") + ".");
    }) },
    // 9. qayda: doğru / səhv fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("Sifətlə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Sifətlə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
    // 10. nömrə kombinasiyası: fərqləndirilmiş söz sifətdir (sifət–zərf, sifətləşmiş isim, isimləşmiş sifət)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const nR = 1 + R(3), a = sample(omoOf(["S", "S~"]), nR), b = sample(omoOf(["Z", "I^"]), 5 - nR), five = shuffle([...a, ...b]);
      if (new Set(five.map(o => o.s)).size < 5 || new Set(five.map(o => o.w.toLocaleLowerCase("az"))).size < 4) return null;
      const right = five.map((o, i) => o.ad === "S" ? i + 1 : 0).filter(Boolean), o2 = comboChoices(right); if (!o2) return null;
      return { text: h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz sifətdir?", ...omoLines(five)), ...o2, show: o2.choices[o2.correct],
        solution: five.map((o, i) => (i + 1) + ") " + o.w + " — " + AD[o.ad] + " (" + WHY[o.kind] + ")").join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: bankdakı hər fakt müstəqil sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "s" + (++yn), sual, cavab });
  const NITQ = "(isim, sifət, say, əvəzlik, feil, zərf, qoşma, bağlayıcı)";
  BANK.forEach(s => s.forEach(x => {
    if (!x.t) return;
    addY("«" + plain(s) + "» cümləsində “" + x.w + "” sözü hansı nitq hissəsidir? " + NITQ + (x.m === "~" ? " (Dərslik qaydası: isimləşmiş sifət sifət olaraq qalır.)" : x.m === "^" ? " (Dərslik qaydası: sifətləşmiş isim isim hesab olunur.)" : ""), AD[x.t]);
    if (x.hal) addY("«" + plain(s) + "» cümləsində “" + x.w + "” sözü hansı haldadır? (adlıq, yiyəlik, yönlük, təsirlik, yerlik, çıxışlıq)", x.hal);
  }));
  DER.forEach(x => addY("“" + x.f + "” sifəti hansı dərəcədədir? (adi, azaltma, çoxaltma) — dərsliyə görə: adi — keyfiyyət normaldır, azaltma — normadan azdır, çoxaltma — normadan çoxdur.", x.d === "adi" ? "adi" : x.d === "az" ? "azaltma" : "çoxaltma"));
  YAZ.forEach(x => addY("Sifətin düzgün yazılışı hansıdır: 1) " + x.b + "; 2) " + x.d + "; 3) " + x.a + " (5-ci sinif dərsliyinin qaydasına görə)", x.f));
  ALAM.forEach(x => addY("“" + x[0] + "” sifəti rəng, ölçü, forma, zahiri görkəm (əlamət) yoxsa dad, xasiyyət, intellekt, hal-vəziyyət (keyfiyyət) bildirir? (əlamət, keyfiyyət)", "əlamət"));
  KEYF.forEach(x => addY("“" + x[0] + "” sifəti rəng, ölçü, forma, zahiri görkəm (əlamət) yoxsa dad, xasiyyət, intellekt, hal-vəziyyət (keyfiyyət) bildirir? (əlamət, keyfiyyət)", "keyfiyyət"));
  ["S", "I", "Y", "F", "E"].forEach(t => SOZ[t].forEach(w => addY("“" + w + "” — ümumi qrammatik mənasına görə hansı nitq hissəsidir? (isim, sifət, say, əvəzlik, feil)", AD[t])));
  ISIM_MUC.forEach(w => addY("“" + w + "” — ümumi qrammatik mənasına görə hansı nitq hissəsidir? (isim, sifət, say, əvəzlik, feil)", "isim"));
  PROFIL.forEach(([w, duz, sehv]) => { duz.forEach(f => addY("“" + w + "” sözü haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — sifətin dərəcələri və yazılışı üzrə 5-ci sinif dərsliyinin qaydasına görə.", "doğru")); sehv.forEach(f => addY("“" + w + "” sözü haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — sifətin dərəcələri və yazılışı üzrə 5-ci sinif dərsliyinin qaydasına görə.", "səhv")); });
  FIKIR_DUZ.forEach(f => addY("Sifət, onun dərəcələri, yazılışı, isimləşmə və sifətləşmə haqqında (5-ci sinif dərsliyi) deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => addY("Sifət, onun dərəcələri, yazılışı, isimləşmə və sifətləşmə haqqında (5-ci sinif dərsliyi) deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "səhv"));
  window.__yoxla = YOX;

  window.__levels = levels;
  window.__bank = { BANK, SOZ, OMO, DER, YAZ, PROFIL, FIKIR_DUZ, FIKIR_SEHV, AD };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-sifet", title: "Sifət", fenn: "azdili", link: "dersler/az-sifet.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər sözə sual ver: necə? hansı? Sifətləşmiş isim isimdir, isimləşmiş sifət sifətdir.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["umumi", "tap", "tap", "alamet", "derece", "yazilis", "omonim", "isimlesme", "isimlesme", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-sifet.html")) b.push("dersler/az-sifet.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
