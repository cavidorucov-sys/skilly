// Azərbaycan dili · Həmcins üzvlər, əlavə, ara söz, xitab, söz sırası — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 8-ci sinif (2023): s. 107 (cümlədə söz sırası), s. 112 (əlavələr), s. 120 (həmcins üzvlər), s. 124–125 (ümumiləşdirici
// sözlər), s. 128 (həmcins üzvlərdə ixtisar), s. 136, 144 (xitab), s. 148 (ara söz); 6-cı sinif, 2-ci hissə (2025), s. 57 (məntiqi vurğu, inversiya),
// 1-ci hissə s. 92 (bağlayıcı növləri); 7-ci sinif (köməkçi mənbə): 1-ci hissə s. 26 (modal söz və ara söz), 2-ci hissə s. 65 (mübtəda və xitab), s. 70 (həmcins
// üzvlər, ixtisar). Bankdakı hər cümlənin durğu işarələri qaydaya görə yeganə düzgün variantdır; səhv variantlar həmin cümlədən avtomatik qurulur
// (işarə atılır, dəyişdirilir, əlavə vergül qoyulur). Bankda qəsdən olmayanlar: mürəkkəb cümlə, "ki" ilə budaq cümlə, dırnaq, düz nitq, "ey" nidalı xitab.
(function () {
  const h = Oyun.h;
  const R = n => Math.floor(Math.random() * n);
  const pick = a => a[R(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);

  // ---- cümlə bankı: boşluqla ayrılmış vahidlər; "söz:t" — etiketli söz; "_" iki sözdən ibarət bir vahiddir; etiketsiz işarə — durğu işarəsi.
  // etiketlər: h həmcins üzv, u ümumiləşdirici söz, l əlavə, x xitab, m mübtəda, a ara söz, s ixtisar edilmiş üzv, v xəbər, t təyin
  const NS = /^[,.;:!?…]+$/;
  const S = str => str.split(" ").map(t => { const m = t.match(/^(.+):([a-z])$/); return m ? { w: m[1].replace(/_/g, " "), t: m[2] } : { w: t.replace(/_/g, " "), t: null }; });
  const plain = ts => ts.map((x, i) => (i && !NS.test(x.w) ? " " : "") + x.w).join("");
  // fərqləndirilmiş söz qalın və altdan xətli; ardıcıl işarələnmiş sözlər bir yerdə
  const nodes = (ts, pred) => {
    const out = []; let i = 0;
    while (i < ts.length) {
      const sp = i && !NS.test(ts[i].w) ? " " : "";
      if (pred(ts[i], i)) { let j = i, txt = ""; while (j < ts.length && pred(ts[j], j)) { txt += (j > i ? " " : "") + ts[j].w; j++; } out.push(sp, h("u", {}, h("b", {}, txt))); i = j; }
      else { out.push(sp + ts[i].w); i++; }
    }
    return out;
  };
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const idxOf = (ts, t) => ts.map((x, i) => x.t === t ? i : -1).filter(i => i >= 0);
  const wordsOf = (ts, t) => ts.filter(x => x.t === t).map(x => x.w);
  const phrasesOf = (ts, t) => { const o = []; ts.forEach((x, i) => { if (x.t === t) { if (i && ts[i - 1].t === t) o[o.length - 1] += " " + x.w; else o.push(x.w); } }); return o; };
  const up = s => s.charAt(0).toLocaleUpperCase("az") + s.slice(1);

  // ======== 1. həmcins üzvlər (8-ci sinif s. 120; 7-ci sinif s. 70; 6-cı sinif s. 92) ========
  const RULE_HEM = "Həmcins üzvlər sadalama intonasiyası ilə bağlananda aralarında vergül qoyulur; «və» ilə bağlanan sonuncu üzvdən əvvəl vergül qoyulmur (dərslikdəki nümunələrdə belədir)";
  const BAGAD = { int: "yalnız sadalama intonasiyası (vergül)", ve: "«və» bağlayıcısı", hem: "«həm … həm də» bağlayıcıları", ne: "«nə … nə də» bağlayıcıları", ya: "«ya … ya da» bağlayıcıları" };
  const BAGIZ = { int: "Üzvləri sadalama intonasiyası bağlayır; yazıda aralarında vergül qoyulur.", ve: "Üzvləri «və» bağlayıcısı bağlayır.", hem: "Üzvləri «həm … həm də» bağlayıcıları bağlayır (iştirak).", ne: "Üzvləri «nə … nə də» bağlayıcıları bağlayır (inkarlıq).", ya: "Üzvləri «ya … ya da» bağlayıcıları bağlayır (bölüşdürmə)." };
  const HEM = [
    ["Həyətdə uşaqlar oynayır:h , gülür:h və əylənirlər:h .", "xəbər", null],
    ["Yaşıl otların arasından qırmızı:h , sarı:h , ağ:h güllər boylanır .", "təyin", "int"],
    ["Yolun hər iki tərəfində ağaclar:h , kollar:h əkilmişdi .", "mübtəda", "int"],
    ["Nənəm toyuqları:h , cücələri:h hinə saldı .", "tamamlıq", "int"],
    ["Yaşıl:h , sarı:h yarpaqlar bir-birinə qarışmışdı .", "təyin", "int"],
    ["Şərəf:h və ləyaqət:h ruhun bəzəyidir .", "mübtəda", "ve"],
    ["Səbinə:h və Lalə:h məktəbə getdilər .", "mübtəda", "ve"],
    ["Ana bazardan alma:h , armud:h , nar:h və heyva:h aldı .", "tamamlıq", null],
    ["Maşın sürətlə:h , səssizcə:h yaxınlaşdı .", "zərflik", "int"],
    ["Qonşumuz mehriban:h , qayğıkeş:h , səxavətli:h insandır .", "təyin", "int"],
    ["Həm müəllimlər:h , həm də şagirdlər:h tədbiri maraqla izləyirdilər .", "mübtəda", "hem"],
    ["Nə uşaqlar:h , nə də böyüklər:h zalı tərk_etmək istəyirdilər .", "mübtəda", "ne"],
    ["Ya Elnur:h , ya da Tural:h növbətçi olacaq .", "mübtəda", "ya"],
    ["Dərsdən sonra uşaqlar futbol:h , voleybol:h və şahmat:h oynadılar .", "tamamlıq", null],
    ["Çayda balıqlar:h , qurbağalar:h və tısbağalar:h yaşayır .", "mübtəda", null],
    ["Qızlar çəməndəki gülləri dərir:h , çələng hörürlər:h .", "xəbər", null],
    ["Gözəl:h və mehriban:h qız hamının sevgisini qazandı .", "təyin", "ve"],
  ].map(([s, uzv, bag]) => ({ ts: S(s), uzv, bag, cat: "hem", rule: RULE_HEM }));
  // həmcins üzv olmayan, amma vergüllü və ya tireli cümlələr
  const NOHEM = [
    ["Qızım, pəncərəni bağla.", "vergül xitabı ayırır"],
    ["Əlbəttə, sən bu işi bacararsan.", "vergül ara sözü ayırır"],
    ["Mən dərsdən sonra evə getdim.", "bütün üzvlər müxtəlif suallara cavab verir"],
    ["Bakı Azərbaycanın paytaxtıdır.", "cümlədə sadalama yoxdur"],
    ["Uşaqlar həyətdə oynayırdılar.", "eyni suala cavab verən iki üzv yoxdur"],
    ["Sabah yağış yağacaq.", "eyni suala cavab verən iki üzv yoxdur"],
    ["Atam – təcrübəli həkim bu xəstəxanada işləyir.", "tire əlavəni ayırır, «təcrübəli həkim» atam sözünü izah edir"],
    ["Müəllim lövhəyə cümlə yazdı.", "eyni suala cavab verən iki üzv yoxdur"],
    ["Böyük ehtimalla, sabah qar yağacaq.", "vergül ara sözü ayırır"],
    ["Çinar ağacı yaşıl yarpaqlarını tökdü.", "eyni suala cavab verən iki üzv yoxdur"],
  ].map(([s, why]) => ({ ts: S(s), why }));

  // ======== 2. həmcins üzvlərdə ixtisar (8-ci sinif s. 128; 7-ci sinif s. 70) ========
  const KIND = { q: "qoşma", h: "hal şəkilçisi", m: "mənsubiyyət şəkilçisi", i: "«idi» köməkçi sözü", c: "bir neçə şəkilçi (cəm, mənsubiyyət, hal)", x: "xəbərin şəxs şəkilçisi" };
  const IXT = [
    ["Uşaq kitab:s , dəftər:s və qələmlərini çantasına yığdı .", "c", "kitablarını, dəftərlərini və qələmlərini"],
    ["Sən də qardaşın:s , bacın kimi yaxşı oxumalısan .", "q", "qardaşın kimi, bacın kimi"],
    ["Şəhidlərimiz Vətən:s , xalq üçün candan keçiblər .", "q", "Vətən üçün, xalq üçün"],
    ["Elm cahil:s və nadanlara qonaq getməz .", "c", "cahillərə və nadanlara"],
    ["Qızlar çəməndəki gülləri dərir:s , çələng hörürlər .", "x", "dərirlər, hörürlər"],
    ["Rayonun ən uzaq kəndlərinə:s , yaylaq yerlərinə qədər yol çəkilib .", "q", "kəndlərinə qədər, yerlərinə qədər"],
    ["Qonaqlar Bakı:s və Gəncəyə gəlmişdilər .", "h", "Bakıya və Gəncəyə"],
    ["Ata:s və anam bizi gözləyirdi .", "m", "atam və anam"],
    ["Hava soyuq:s , küləkli idi .", "i", "soyuq idi, küləkli idi"],
    ["Yol uzun:s və yorucu idi .", "i", "uzun idi və yorucu idi"],
  ].map(([s, kind, full]) => ({ ts: S(s), kind, full }));
  const NOIXT = [
    "Uşaq kitabını , dəftərini və qələmini çantasına yığdı .",
    "Atam səhər işə , bazara və poçta getdi .",
    "Sən də qardaşın kimi , bacın kimi yaxşı oxumalısan .",
    "Şagirdlər bağda , həyətdə və küçədə oynayırdılar .",
    "Qızlar çəməndəki gülləri dərirlər , çələng hörürlər .",
    "Şəhidlərimiz Vətən üçün , xalq üçün candan keçiblər .",
    "Nənəm alma , armud və heyva yığdı .",
  ].map(s => ({ ts: S(s) }));

  // ======== 3. ümumiləşdirici sözlər (8-ci sinif s. 124–125) ========
  const UMUM = [
    ["Qızlar:u : Nigar:h , Xanım:h , Röya:h və Nəzrin:h həvəslə bayram şənliyinə hazırlaşırdılar .", "b"],
    ["Meyvələr:u : alma:h , armud:h , heyva:h və nar:h bağda yetişmişdi .", "b"],
    ["Hər:u tərəf:u : dağ:h , dərə:h , təpələr:h ağ qarla örtülmüşdü .", "b"],
    ["Fənlər:u : riyaziyyat:h , fizika:h , kimya:h və biologiya:h cədvəldə yazılmışdı .", "b"],
    ["Nigar:h , Xanım:h , Röya:h və Nəzrin:h – bunların:u hamısı:u bayram şənliyinə hazırlaşırdı .", "a"],
    ["Bakı:h , Gəncə:h , Sumqayıt:h , Mingəçevir:h – bunların:u hamısı:u Azərbaycanın böyük şəhərləridir .", "a"],
    ["Qələm:h , dəftər:h , kitab:h – hər:u şey:u çantada idi .", "a"],
    ["Alma:h , armud:h , heyva:h , nar:h – bir:a sözlə:a , bütün:u meyvələr:u bağda yetişmişdi .", "s"],
    ["Dərman:u bitkiləri:u , yəni : itburnu:h , çaytikanı:h , çobanyastığı:h , zəncirotu:h respublikamızın müxtəlif bölgələrində bitir .", "y"],
    ["Meyvələr:u , məsələn : alma:h , armud:h və heyva:h bağda yetişmişdi .", "y"],
  ].map(([s, pos]) => ({ ts: S(s), pos, cat: "umum", rule: pos === "b" ? "Ümumiləşdirici söz həmcins üzvlərdən əvvəl gəldikdə ondan sonra qoşa nöqtə qoyulur"
    : pos === "a" ? "Ümumiləşdirici söz həmcins üzvlərdən sonra gəldikdə ondan əvvəl tire işarəsi qoyulur"
    : pos === "s" ? "Ümumiləşdirici sözdən əvvəl ara söz (bir sözlə) işlənərsə, ara sözdən əvvəl tire, sonra vergül qoyulur"
    : "Ümumiləşdirici sözdən sonra «yəni», «məsələn» bağlayıcıları işlənərsə, bağlayıcıdan əvvəl vergül, sonra qoşa nöqtə qoyulur" }));

  // ======== 4. əlavələr (8-ci sinif s. 112) ========
  const AID = ["mübtəda", "tamamlıq", "zərflik", "təyin", "xəbər"];
  const RULE_EL = "Əlavə aid olduğu üzvdən, əsasən, tire (–) işarəsi ilə ayrılır";
  const RULE_ELY = "Cümlə üzvü ilə onun əlavəsi arasında «yəni» bağlayıcısı işlənərsə, bağlayıcıdan əvvəl vergül qoyulur";
  const ELAVE = [
    ["Birdən Səid dünyada hamıdan çox sevdiyi varlığı – anasını:l gördü .", "tamamlıq", 0],
    ["İlk teatr qədim Yunanıstanda – bu:l mədəniyyət:l beşiyində:l yaranmışdır .", "zərflik", 0],
    ["Hava olmadığına görə Yerin peykində – Ayda:l səs yayılmır .", "zərflik", 0],
    ["Mirzə Fətəli Axundzadə – ilk:l dramaturqumuz:l əlifba islahatı uğrunda mübarizə_aparmışdır .", "mübtəda", 0],
    ["Anam bazardan ən çox sevdiyim meyvəni – şaftalını:l aldı .", "tamamlıq", 0],
    ["Biz yay tətilini Qəbələdə – Azərbaycanın:l gözəl:l guşəsində:l keçirdik .", "zərflik", 0],
    ["Atam – təcrübəli:l həkim:l bu xəstəxanada işləyir .", "mübtəda", 0],
    ["Nizami Gəncəvi – böyük:l Azərbaycan:l şairi:l beş poema yazmışdır .", "mübtəda", 0],
    ["Hava olmadığına görə Yerin peykində , yəni Ayda:l səs yayılmır .", "zərflik", 1],
    ["Qatar səhər tezdən , yəni saat:l altıda:l yola_düşdü .", "zərflik", 1],
  ].map(([s, aid, yeni]) => ({ ts: S(s), aid, yeni, cat: "elave", rule: yeni ? RULE_ELY : RULE_EL }));
  // eyni sözlər: əlavə (aid olduğu üzvdən sonra) və təyin (aid olduğu üzvdən əvvəl) — 8-ci sinif s. 113, tapşırıq 11
  const TP = [
    ["Nizami Gəncəvi – böyük:l Azərbaycan:l şairi:l beş poema yazmışdır .", "Böyük:t Azərbaycan:t şairi:t Nizami Gəncəvi beş poema yazmışdır ."],
    ["Atam – təcrübəli:l həkim:l bu xəstəxanada işləyir .", "Təcrübəli:t həkim:t atam bu xəstəxanada işləyir ."],
    ["Mirzə Fətəli Axundzadə – ilk:l dramaturqumuz:l əlifba islahatı uğrunda mübarizə_aparmışdır .", "İlk:t dramaturqumuz:t Mirzə Fətəli Axundzadə əlifba islahatı uğrunda mübarizə_aparmışdır ."],
  ].map(([a, t]) => ({ a: S(a), t: S(t) }));

  // ======== 5. xitab (7-ci sinif s. 65; 8-ci sinif s. 136, 144) ========
  const RX = { s: "Xitab cümlənin əvvəlində işlənib adi intonasiya ilə deyilirsə, ondan sonra vergül qoyulur", m: "Xitab cümlənin ortasında gələrsə, hər iki tərəfdən vergül qoyulur", e: "Xitab cümlənin sonunda gəldikdə ondan əvvəl vergül, sonra cümlənin məqsədinə uyğun işarə (nöqtə, sual, nida) qoyulur" };
  // kind: x xitab / m mübtəda (işarələnmiş söz); pos: s əvvəl, m orta, e son; dz — durğusuz da birmənalıdır
  const XM = [
    ["Dostum:x , bu gün də səndən kömək gözləyirəm .", "x", "s", 1],
    ["Dostum:m həmişə mənə kömək_edir .", "m", "", 1],
    ["Nənə:x , süfrəni hazırla .", "x", "s", 1],
    ["Nənə:m süfrəni hazırladı .", "m", "", 1],
    ["Qardaşım:x , sabah bizə gəl .", "x", "s", 1],
    ["Qardaşım:m sabah bizə gələcək .", "m", "", 1],
    ["Oğul:x , sözlərimə yaxşı qulaq_as .", "x", "s", 1],
    ["Müəllim:x , mən dərsi başa_düşdüm .", "x", "s", 1],
    ["Müəllim:m lövhəyə cümlə yazdı .", "m", "", 1],
    ["Mən bilirəm , Gülgəz:x , sənin bu işdən xəbərin yoxdur .", "x", "m", 0, 1],
    ["Bayrağına canım qurban , Azərbaycan:x !", "x", "e", 0],
    ["Sən , Elnur:x , bu işi bacararsan .", "x", "m", 0],
    ["Elnur:m sabah bizə gələcək .", "m", "", 1],
    ["Elnur:x , sabah bizə gəl .", "x", "s", 1],
    ["Dağlar:x , sizi çox sevirəm .", "x", "s", 0],
    ["Sabah bizə gələrsən , Nərgiz:x ?", "x", "e", 0],
    ["Sənə nə oldu , oğlum:x ?", "x", "e", 0],
    ["Qızım:x , pəncərəni bağla .", "x", "s", 1],
    ["Qızım:m pəncərəni bağladı .", "m", "", 1],
  ].map(([s, kind, pos, dz, noP]) => ({ ts: S(s), kind, pos, dz: !!dz, noP: !!noP, cat: "xitab", rule: RX[pos] }));
  // xitab + ara söz + mübtəda bir cümlədə
  const XA = [
    ["Əlbəttə:a , Samir:x , sən:m haqlısan .", "m", 1],
    ["Gülnarə:x , bəlkə:a , sən:m də gələrsən ?", "m", 1],
    ["Nərgiz:x , deyəsən:a , yağış:m yağacaq .", "m", 1],
    ["Şübhəsiz:a , Elnur:x , sən:m bunu bacararsan .", "m", 1],
    ["Oğlum:x , atalar:a demişkən:a , sözün düzünü zarafatla deyərlər .", "", 0],
    ["Qardaşım:x , böyük:a ehtimalla:a , sabah qar yağacaq .", "", 0],
  ].map(([s, m, bol]) => ({ ts: S(s), bol: !!bol, cat: "xa", rule: "Xitab də, ara söz də vergüllə ayrılır; cümlənin ortasında hər iki tərəfdən vergül qoyulur" }));

  // ======== 6. ara sözlər (7-ci sinif s. 26; 8-ci sinif s. 148) ========
  const RA = { s: "Ara söz cümlənin əvvəlində işlənərsə, ondan sonra vergül qoyulur", m: "Ara söz cümlənin ortasında gələrsə, hər iki tərəfdən vergül qoyulur", e: "Ara söz cümlənin sonunda gələrsə, ondan əvvəl vergül, sonra cümlənin məqsədinə uyğun işarə qoyulur" };
  const ARA = [
    ["Bəlkə:a , elə Füzulinin , Nizaminin zərrəsiyik ?", "s"],
    ["Axır:a ki:a , istəyinə nail oldun .", "s"],
    ["Sənin dediklərini də , sözsüz:a , düşünməyə dəyər .", "m"],
    ["İşlər tez yekunlaşarmı , görəsən:a ?", "e"],
    ["Təzə xəstəxana , sən:a demə:a , artıq pasiyentlərini qəbul edir .", "m"],
    ["Böyük:a ehtimalla:a , sabah qar yağacaq .", "s"],
    ["Yoldan geri qayıtmaq , bəzi:a inanclara:a görə:a , yaxşı əlamət deyil .", "m"],
    ["Atalar:a demişkən:a , sözün düzünü zarafatla deyərlər .", "s"],
    ["Əlqərəz:a , söhbəti burada bitirək .", "s"],
    ["Deməli:a , sizin planlarınızdan xəbərimiz yox idi .", "s"],
    ["Təəssüf:a ki:a , yağışa görə evdən çıxmaq mümkün olmadı .", "s"],
    ["Şübhəsiz:a , bu işi vaxtında bitirəcəyik .", "s"],
    ["Deyəsən:a , yağış yağacaq .", "s"],
  ].map(([s, pos]) => ({ ts: S(s), pos, cat: "ara", rule: RA[pos] }));
  // bənzətmə bildirən "sanki, elə bil, guya" vergüllə ayrılmır (7-ci sinif s. 26: istisna)
  const SANKI = { ts: S("Sanki buradan bir fırtına keçmişdi ."), pos: "", cat: "sanki", rule: "Bənzətmə bildirən «sanki», «elə bil», «guya» sözləri istisnadır: vergüllə ayrılmır" };
  // ara sözün mənası (7-ci sinif s. 26, tapşırıq 4c: əminlik; güman, şübhə; fikrin mənbəyi; sıra, ardıcıllıq; təəssüf; nəticə; bənzətmə)
  const MEANS = ["əminlik", "güman və ya şübhə", "fikrin mənbəyi", "sıra, ardıcıllıq", "təəssüf", "nəticə", "bənzətmə"];
  const ARAM = [
    ["Şübhəsiz, bu işi vaxtında bitirəcəyik.", "Şübhəsiz", 0], ["Əlbəttə, sən bunu bacararsan.", "Əlbəttə", 0],
    ["Deyəsən, yağış yağacaq.", "Deyəsən", 1], ["Böyük ehtimalla, sabah qar yağacaq.", "Böyük ehtimalla", 1], ["Görünür, o bizi tanımadı.", "Görünür", 1],
    ["Atalar demişkən, sözün düzünü zarafatla deyərlər.", "Atalar demişkən", 2], ["Yoldan geri qayıtmaq, bəzi inanclara görə, yaxşı əlamət deyil.", "Bəzi inanclara görə", 2],
    ["Birincisi, getməyin mənası yoxdur.", "Birincisi", 3], ["Təəssüf ki, yağışa görə evdən çıxmaq mümkün olmadı.", "Təəssüf ki", 4],
    ["Deməli, sizin planlarınızdan xəbərimiz yox idi.", "Deməli", 5], ["Sanki buradan bir fırtına keçmişdi.", "Sanki", 6],
  ].map(([s, w, k]) => ({ s, w, k }));

  // ======== 7. söz sırası (8-ci sinif s. 107; 6-cı sinif s. 57) ========
  // n — normal sıra, p — pozulmuş sıra (v — xəbər)
  const SIRA = [
    ["Uşaqlar səhər məktəbə getdilər:v .", "Getdilər:v uşaqlar səhər məktəbə ."],
    ["Nənəm bağdan alma dərdi:v .", "Nənəm dərdi:v bağdan alma ."],
    ["Biz axşam sahildə gəzdik:v .", "Biz gəzdik:v axşam sahildə ."],
    ["Güclü külək ağacları əyirdi:v .", "Əyirdi:v ağacları güclü külək ."],
    ["Anam səhər çörək bişirdi:v .", "Bişirdi:v anam səhər çörək ."],
    ["Xəzər qaşını qürurla çatmışdır:v .", "Qürurla çatmışdır:v qaşını Xəzər ."],
    ["Həyat əzəldən bir dastana bənzər:v .", "Həyat bir dastana bənzər:v əzəldən ."],
    ["Şagirdlər dərsdən sonra futbol oynadılar:v .", "Oynadılar:v şagirdlər dərsdən sonra futbol ."],
  ].map(([n, p]) => ({ n: S(n), p: S(p) }));

  // ======== durğu işarəsi: bütün kateqoriyalar üçün düzgün cümlə və ondan qurulan səhv variantlar ========
  function variants(ts, cat) {
    const v = [], seen = new Set([plain(ts)]);
    const add = a => { const p = plain(a); if (!seen.has(p)) { seen.add(p); v.push(p); } };
    const inner = ts.map((x, i) => !x.t && /^[,:;–]$/.test(x.w) ? i : -1).filter(i => i >= 0);
    const del = i => ts.filter((_, j) => j !== i);
    const rep = (i, w) => ts.map((x, j) => j === i ? { w, t: null } : x);
    const first = inner[0], last = inner[inner.length - 1];
    if (cat === "hem") {
      add(del(first)); add(rep(first, ":"));
      const ve = ts.findIndex((x, i) => x.w === "və" && i && ts[i - 1].w !== ",");
      if (ve > 0) add([...ts.slice(0, ve), { w: ",", t: null }, ...ts.slice(ve)]);
      const hs = idxOf(ts, "h"), lh = hs[hs.length - 1];
      if (lh < ts.length - 2 && !NS.test(ts[lh + 1].w)) add([...ts.slice(0, lh + 1), { w: ",", t: null }, ...ts.slice(lh + 1)]);
      if (inner.length > 1) add(del(last));
    } else if (cat === "umum") {
      const m = ts.findIndex(x => x.w === ":" || x.w === "–");
      // əvvəldə gələn ümumiləşdirici sözdə (b, y) «–» və «,» qoyulması əlavə/həmcins mübtəda kimi yozula bilər — səhv variant kimi verilmir
      const pre = ts[m].w === ":";
      if (!pre) { add(rep(m, ":")); if (!ts.some(x => x.w === "sözlə")) add(rep(m, ",")); add(del(m)); }
      else if (!ts.some(x => x.w === "məsələn" || x.w === "yəni")) add(del(m));
      const c = ts.findIndex((x, i) => x.w === "," && i && ts[i - 1].w === "sözlə");
      if (c > 0) add(del(c));
      add(rep(m, ";"));
    } else if (cat === "elave") {
      const m = ts.findIndex((x, i) => x.w === "–" || (x.w === "," && ts[i + 1] && ts[i + 1].w === "yəni"));
      add(del(m)); add(rep(m, ":")); add(rep(m, ";"));
    } else if (cat === "sanki") {
      add([ts[0], { w: ",", t: null }, ...ts.slice(1)]);
    } else { // xitab, ara söz, ikisi birlikdə
      add(del(first)); add(rep(first, ":"));
      if (inner.length > 1) add(del(last));
      else if (ts[first + 2] && !NS.test(ts[first + 2].w)) add([...ts.slice(0, first), ts[first + 1], { w: ",", t: null }, ...ts.slice(first + 2)]);
      add(rep(first, ";"));
    }
    return v.slice(0, 3);
  }
  // durğu bankı: hər element yeganə düzgün durğuya malikdir (mübtəda olan xitab cümlələri bura daxil deyil)
  const PUNCT = [...HEM, ...UMUM, ...ELAVE, ...XM.filter(x => x.kind === "x" && !x.noP), ...XA, ...ARA, SANKI];
  PUNCT.forEach(it => { it.good = plain(it.ts); it.W = variants(it.ts, it.cat); });
  const PUNCT_BY = cat => PUNCT.filter(x => cat.includes(x.cat));

  // ---- qayda sualları (A–E-yə və səviyyələrə): [sual, düz, [səhv variantlar]]
  const RQ = [
    ["Cümlədə xəbər, adətən, harada gəlir?", "cümlənin sonunda", ["cümlənin əvvəlində", "mübtədadan əvvəl", "tamamlıqdan əvvəl", "zərfliklə təyin arasında"]],
    ["Təyin təyin etdiyi üzvə nisbətən harada gəlir?", "həmişə onun əvvəlində", ["həmişə ondan sonra", "cümlənin sonunda", "xəbərdən sonra", "cümlənin əvvəlində"]],
    ["Tamamlıq və zərflik, adətən, xəbərə nisbətən harada gəlir?", "xəbərdən əvvəl", ["xəbərdən sonra", "mübtədadan əvvəl", "cümlənin sonunda", "təyindən sonra"]],
    ["Cümlədə söz sırasının pozulması necə adlanır?", "inversiya", ["məntiqi vurğu", "ixtisar", "uzlaşma", "ümumiləşdirmə"]],
    ["Söz sırasının pozulmasına daha çox harada rast gəlinir?", "şeirlərdə və canlı danışıq dilində", ["rəsmi sənədlərdə", "dərsliklərdə", "elmi məqalələrdə", "qanunlarda"]],
    ["Diqqəti müəyyən sözə yönəltmək üçün onu digərlərinə nisbətən yüksək tonla tələffüz etməyə nə deyilir?", "məntiqi vurğu", ["inversiya", "ixtisar", "sadalama intonasiyası", "uzlaşma"]],
    ["Adi söz sırasında məntiqi vurğulu söz, adətən, cümlədə harada gəlir?", "xəbərdən əvvəl", ["xəbərdən sonra", "yalnız cümlənin əvvəlində", "yalnız cümlənin ortasında", "mübtədadan sonra"]],
    ["Xitab yüksək intonasiya ilə deyildikdə ondan sonra hansı işarə qoyulur?", "nida işarəsi", ["vergül", "qoşa nöqtə", "tire", "nöqtəli vergül"]],
    ["Xitab cümlənin ortasında işlənərsə, durğu işarəsi necə qoyulur?", "hər iki tərəfdən vergül", ["yalnız əvvəldən vergül", "hər iki tərəfdən tire", "yalnız sonradan vergül", "heç bir işarə qoyulmur"]],
    ["Ara söz cümlənin sonunda işlənərsə, ondan əvvəl hansı işarə qoyulur?", "vergül", ["tire", "qoşa nöqtə", "nida işarəsi", "nöqtəli vergül"]],
    ["Ümumiləşdirici söz həmcins üzvlərdən əvvəl gəldikdə ondan sonra hansı işarə qoyulur?", "qoşa nöqtə", ["tire", "vergül", "nöqtəli vergül", "nida işarəsi"]],
    ["Ümumiləşdirici söz həmcins üzvlərdən sonra gəldikdə ondan əvvəl hansı işarə qoyulur?", "tire", ["qoşa nöqtə", "vergül", "nöqtəli vergül", "nida işarəsi"]],
    ["Əlavə aid olduğu üzvdən, əsasən, hansı işarə ilə ayrılır?", "tire", ["qoşa nöqtə", "vergül", "nöqtəli vergül", "nida işarəsi"]],
    ["Əlavə ilə onun aid olduğu üzv arasında «yəni» işlənərsə, «yəni»dən əvvəl hansı işarə qoyulur?", "vergül", ["tire", "qoşa nöqtə", "nida işarəsi", "nöqtəli vergül"]],
    ["Bənzətmə bildirən və vergüllə ayrılmayan (istisna) söz hansıdır?", "sanki", ["əlbəttə", "şübhəsiz", "deyəsən", "görəsən"]],
    ["Həmcins üzvlərdə təkrar olunan şəkilçi və qoşmalar necə işlənir?", "sonuncu üzvdə saxlanılmaqla ixtisar edilə bilər", ["hər üzvdə mütləq təkrar olunmalıdır", "ilk üzvdə saxlanılmaqla ixtisar edilir", "heç vaxt ixtisar edilmir", "yalnız qoşma ixtisar edilir"]],
  ];

  // ---- fikirlər: doğru / səhv (dərslikdəki qaydalar)
  const FIKIR_DUZ = [
    "Həmcins üzvlər eyni suala cavab verir və eyni cümlə üzvü olur.",
    "Həmcins üzvlər arasında tabesizlik əlaqəsi olur.",
    "Həmcins üzvlər sadalama intonasiyası və ya tabesizlik bağlayıcıları vasitəsilə bir-birinə bağlanır.",
    "Bütün cümlə üzvləri həmcins ola bilər.",
    "Həmcins üzvlərdə qrammatik şəkilçilər sonuncu üzvdə saxlanılmaqla ixtisar edilir.",
    "Həmcins üzvlərdə qoşmalar da ixtisar oluna bilər.",
    "Ümumiləşdirici söz həmcins üzvlərdən həm əvvəl, həm də sonra işlənir.",
    "Ümumiləşdirici söz həmcins üzvlərdən əvvəl gəldikdə ondan sonra qoşa nöqtə qoyulur.",
    "Ümumiləşdirici söz həmcins üzvlərdən sonra gəldikdə ondan əvvəl tire qoyulur.",
    "Əlavə aid olduğu cümlə üzvündən sonra gəlir.",
    "Əlavə özündən əvvəlki üzvü aydınlaşdırır və dəqiqləşdirir.",
    "Əlavə söz və söz birləşməsi ilə ifadə oluna bilər.",
    "Əlavə aid olduğu üzvdən, əsasən, tire işarəsi ilə ayrılır.",
    "Bütün cümlə üzvlərinin həm əlavəsi, həm də həmcinsliyi ola bilər.",
    "Xitab cümlədə müraciət olunan şəxsi və ya əşyanı bildirir.",
    "Xitab cümlə üzvü olmur.",
    "Xitab, əsasən, adlıq halda olan isim, isimləşən söz və ismi birləşmə ilə ifadə olunur.",
    "Xitab cümlənin ortasında işlənərsə, hər iki tərəfdən vergül qoyulur.",
    "Xitab cümlənin sonunda işlənərsə, ondan əvvəl vergül qoyulur.",
    "Xitablarla həm canlıya, həm də cansıza müraciət etmək olar.",
    "Xitab yüksək intonasiya ilə deyildikdə ondan sonra nida işarəsi qoyulur.",
    "Ara söz danışanın ifadə etdiyi fikrə münasibətini bildirir.",
    "Ara söz cümlə üzvü rolunda çıxış etmir.",
    "Ara söz cümlənin əvvəlində işlənərsə, ondan sonra vergül qoyulur.",
    "Ara söz cümlənin ortasında işlənərsə, hər iki tərəfdən vergül qoyulur.",
    "Dildə olan bütün modal sözlər cümlədə ara söz funksiyasını yerinə yetirir.",
    "Ara sözlər söz, söz birləşməsi və cümlə şəklində ola bilər.",
    "Bənzətmə bildirən «sanki», «elə bil», «guya» sözləri vergüllə ayrılmır.",
    "Mübtəda, adətən, cümlənin əvvəlində, xəbər cümlənin sonunda gəlir.",
    "Təyin həmişə təyin etdiyi üzvün əvvəlində gəlir.",
    "Tamamlıq və zərflik, adətən, xəbərdən əvvəl gəlir.",
    "Cümlədə söz sırasının pozulması inversiya adlanır.",
    "Söz sırasının pozulmasına şeirlərdə daha çox rast gəlinir.",
  ];
  const FIKIR_SEHV = [
    "Həmcins üzvlər arasında tabelilik əlaqəsi olur.",
    "Yalnız mübtəda həmcins ola bilər.",
    "Həmcins üzvlərdə şəkilçi və qoşma heç vaxt ixtisar oluna bilməz.",
    "Ümumiləşdirici söz yalnız həmcins üzvlərdən sonra işlənir.",
    "Ümumiləşdirici söz həmcins üzvlərdən əvvəl gəldikdə ondan sonra tire qoyulur.",
    "Ümumiləşdirici söz həmcins üzvlərdən sonra gəldikdə ondan əvvəl qoşa nöqtə qoyulur.",
    "Əlavə aid olduğu üzvdən əvvəl gəlir.",
    "Əlavə yalnız mübtədaya aid ola bilər.",
    "Əlavə yalnız söz birləşməsi ilə ifadə olunur.",
    "Xitab cümlə üzvüdür.",
    "Xitab xəbərlə şəxsə və kəmiyyətə görə uzlaşır.",
    "Xitab yalnız insana müraciəti bildirir.",
    "Xitab cümlənin sonunda işlənərsə, ondan əvvəl qoşa nöqtə qoyulur.",
    "Xitabdan sonra həmişə nida işarəsi qoyulur.",
    "Ara söz cümlədə müraciət ediləni bildirir.",
    "Ara söz cümlə üzvü rolunda çıxış edir.",
    "Ara sözlər yalnız söz şəklində olur.",
    "Bütün ara sözlər modal sözdür.",
    "Xəbər, adətən, cümlənin əvvəlində gəlir.",
    "Təyin təyin etdiyi üzvdən sonra gəlir.",
    "Tamamlıq və zərflik, adətən, xəbərdən sonra gəlir.",
    "Söz sırasının pozulmasına nəsr əsərlərində şeirlərdən daha çox rast gəlinir.",
  ];

  // ---- "Səhvi tap" üçün: şagirdin izahında düz və səhv bəndlər
  const SEHV = [
    ["Əlbəttə, Samir, sən haqlısan.",
      ["«Əlbəttə» ara sözdür.", "«Samir» xitabdır.", "«sən» mübtədadır.", "«Samir» ismin adlıq halındadır."],
      ["«Samir» mübtədadır.", "«Əlbəttə» xitabdır.", "«sən» xitabdır.", "«haqlısan» xitabdır."]],
    ["Alma, armud, heyva və nar – bunların hamısı payızda yetişir.",
      ["«alma, armud, heyva, nar» həmcins üzvlərdir.", "«bunların hamısı» ümumiləşdirici sözdür.", "Tire ümumiləşdirici sözdən əvvəl qoyulub, çünki o həmcins üzvlərdən sonra gəlir."],
      ["«bunların hamısı» həmcins üzvdür.", "Ümumiləşdirici söz həmcins üzvlərdən əvvəl gəlir.", "Burada tire əvəzinə qoşa nöqtə qoyulmalıdır."]],
    ["Meyvələr: alma, armud, heyva və nar bağda yetişmişdi.",
      ["«Meyvələr» ümumiləşdirici sözdür.", "Qoşa nöqtə ümumiləşdirici sözdən sonra qoyulub, çünki o həmcins üzvlərdən əvvəl gəlir.", "«alma, armud, heyva, nar» həmcins üzvlərdir."],
      ["«Meyvələr» əlavədir.", "«bağda» ümumiləşdirici sözdür.", "«yetişmişdi» həmcins üzvdür."]],
    ["Dostum, bu gün də səndən kömək gözləyirəm.",
      ["«Dostum» xitabdır.", "«Dostum» xəbərlə uzlaşmır, çünki xəbər birinci şəxsdədir.", "Vergül xitabı cümlənin qalan hissəsindən ayırır."],
      ["«Dostum» mübtədadır.", "«Dostum» əlavədir.", "«Dostum» ara sözdür."]],
    ["Mirzə Fətəli Axundzadə – ilk dramaturqumuz əlifba islahatı uğrunda mübarizə aparmışdır.",
      ["«Mirzə Fətəli Axundzadə» mübtədadır.", "«ilk dramaturqumuz» mübtədanın əlavəsidir.", "Əlavə aid olduğu üzvdən tire ilə ayrılıb."],
      ["«ilk dramaturqumuz» ümumiləşdirici sözdür.", "«ilk dramaturqumuz» xitabdır.", "«Mirzə Fətəli Axundzadə» əlavədir."]],
    ["Hava olmadığına görə Yerin peykində, yəni Ayda səs yayılmır.",
      ["«Ayda» əlavədir.", "«yəni» bağlayıcısından əvvəl vergül qoyulub.", "«Ayda» «Yerin peykində» sözünü dəqiqləşdirir."],
      ["«Ayda» xitabdır.", "Burada «yəni»dən əvvəl tire qoyulmalıdır.", "«Ayda» mübtədadır."]],
    ["Gülnarə, bəlkə, sən də gələrsən?",
      ["«Gülnarə» xitabdır.", "«bəlkə» ara sözdür.", "«sən» mübtədadır."],
      ["«Gülnarə» mübtədadır.", "«bəlkə» xitabdır.", "«sən» ara sözdür."]],
    ["Sən də qardaşın, bacın kimi yaxşı oxumalısan.",
      ["«qardaşın» sözündən sonra «kimi» qoşması ixtisar edilib.", "«qardaşın, bacın» həmcins üzvlərdir.", "İxtisar edilən söz sonuncu üzvdə saxlanılıb."],
      ["Burada «kimi» ixtisar edilməyib, çünki hər iki üzvdə var.", "«bacın» sözündən hal şəkilçisi ixtisar edilib.", "«kimi» həmcins üzvdür."]],
    ["Qürurla çatmışdır qaşını Xəzər.",
      ["Cümlədə söz sırası pozulub, çünki xəbər cümlənin sonunda deyil.", "Söz sırasının pozulması inversiya adlanır.", "Belə hal şeirlərdə daha çox rast gəlinir."],
      ["Cümlədə söz sırası pozulmayıb.", "«Xəzər» cümlənin əvvəlindədir.", "«çatmışdır» mübtədadır."]],
    ["Uşaq kitab, dəftər və qələmlərini çantasına yığdı.",
      ["«kitab, dəftər» sözlərindən şəkilçilər ixtisar edilib.", "«kitab, dəftər, qələmlərini» həmcins üzvlərdir.", "Şəkilçilər sonuncu üzvdə saxlanılıb."],
      ["«qələmlərini» sözündən şəkilçilər ixtisar edilib.", "«çantasına» həmcins üzvdür.", "«yığdı» ümumiləşdirici sözdür."]],
  ].map(([s, t, f]) => ({ s, t, f }));

  // ---- köməkçi
  const mk = (text, right, wrong, solution) => { const ch = shuffle([right, ...wrong]); return { text, choices: ch, correct: ch.indexOf(right), show: right, solution }; };
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
  const sentQ = (ask, ts) => h("span", {}, ask, line(plain(ts)));
  // bir cümlə seçib durğusunu pozur: [düz cümlə, səhv cümlə, element]
  const badOf = it => pick(it.W);
  const whyP = (it, bad) => "«" + bad + "» — səhvdir. Düzgünü: «" + it.good + "». Qayda: " + it.rule + ".";
  // "durğusu düzgün olan cümləni seç": düz bir cümlə + digər üç elementdən pozulmuş cümlə
  function punctRight(pool) {
    const it = pick(pool), others = sample(pool.filter(x => x !== it && x.W.length), 3);
    if (others.length < 3) return null;
    const bads = others.map(badOf);
    return mk("Hansı cümlədə durğu işarələri düzgün qoyulub?", it.good, bads,
      "«" + it.good + "» — düzgündür. Qayda: " + it.rule + ". Qalan variantlarda durğu səhvdir: " + others.map((o, i) => "«" + bads[i] + "» (düzgünü: «" + o.good + "»)").join("; ") + ".");
  }
  const SAYMAP = x => x;

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "hemcins", ad: "Həmcins üzvlər", izah: "Həmcins üzvlər eyni suala cavab verir və eyni cümlə üzvü olur. Üzvləri bağlayıcıdan və vergüldən ayır: yalnız üzvlərə toxun.",
      gen() {
        const r = Math.random(), it = pick(HEM);
        if (r < .45) {
          const duz = idxOf(it.ts, "h");
          return { text: "Cümlədəki həmcins üzvlərin hamısına toxun (bağlayıcıya yox, üzvə).", sec: { soz: it.ts.map(x => x.w), duz }, show: duz.map(i => it.ts[i].w).join(", "),
            solution: "Həmcins üzvlər: " + wordsOf(it.ts, "h").join(", ") + " — eyni suala cavab verir və eyni cümlə üzvüdür (" + it.uzv + "). " + (it.bag ? BAGIZ[it.bag] : "Üzvlər sadalama intonasiyası və bağlayıcı ilə bağlanıb.") };
        }
        if (r < .7) {
          const b = pick(HEM.filter(x => x.bag)), keys = ["int", "ve", "hem", "ne", "ya"];
          return mk(sentQ("Cümlədə həmcins üzvləri hansı vasitə bağlayır?", b.ts), BAGAD[b.bag], keys.filter(k => k !== b.bag).map(k => BAGAD[k]),
            BAGIZ[b.bag] + " Həmcins üzvlər: " + wordsOf(b.ts, "h").join(", ") + ".");
        }
        const o = ["mübtəda", "xəbər", "təyin", "tamamlıq", "zərflik"];
        return mk(h("span", {}, "Fərqləndirilmiş həmcins üzvlər hansı cümlə üzvüdür?", line(...nodes(it.ts, x => x.t === "h"))), it.uzv, o.filter(x => x !== it.uzv),
          "Həmcins üzvlər: " + wordsOf(it.ts, "h").join(", ") + " — " + it.uzv + ". Bütün cümlə üzvləri həmcins ola bilər.");
      } },
    { id: "ixtisar", ad: "İxtisar", izah: "Həmcins üzvlərdə təkrar olunan şəkilçi, qoşma və ya «idi» sonuncu üzvdə saxlanılır, qalanlarında buraxılır. Hər üzvü tam halda yoxla.",
      gen() {
        const r = Math.random();
        if (r < .4) {
          const it = pick(IXT), duz = idxOf(it.ts, "s");
          return { text: "Hansı üzvlərdən şəkilçi, qoşma və ya «idi» ixtisar edilib (sonuncu üzvdə saxlanılıb)? Onlara toxun.", sec: { soz: it.ts.map(x => x.w), duz }, show: duz.map(i => it.ts[i].w).join(", "),
            solution: "Tam forma: " + it.full + ". Təkrar olunan hissə sonuncu üzvdə saxlanılıb, qalanlarından ixtisar edilib." };
        }
        if (r < .7) {
          const it = pick(IXT.filter(x => "qhmi".includes(x.kind))), ks = ["q", "h", "m", "i"];
          return mk(sentQ("Cümlədə həmcins üzvlərdə nə ixtisar edilib?", it.ts), KIND[it.kind], [...ks.filter(k => k !== it.kind).map(k => KIND[k]), "cəm şəkilçisi"].slice(0, 4),
            "Tam forma: " + it.full + ". İxtisar edilən: " + KIND[it.kind] + ".");
        }
        const it = pick(IXT), four = sample(NOIXT, 3);
        return mk("Cümlələrin hansında həmcins üzvlərdə ixtisar var?", plain(it.ts), four.map(x => plain(x.ts)),
          "«" + plain(it.ts) + "» — ixtisar var (tam forma: " + it.full + "). Qalan cümlələrdə hər üzv şəkilçisini, qoşmasını tam saxlayıb.");
      } },
    { id: "umumi", ad: "Ümumiləşdirici sözlər", izah: "Ümumiləşdirici söz həmcins üzvlərin hamısını ümumiləşdirir. Həmcinslərdən əvvəl gələndə ondan sonra qoşa nöqtə, sonra gələndə ondan əvvəl tire qoyulur.",
      gen() {
        const r = Math.random(), it = pick(UMUM);
        if (r < .35) {
          const duz = idxOf(it.ts, "u");
          return { text: "Həmcins üzvləri ümumiləşdirən söz və ya ifadəyə toxun.", sec: { soz: it.ts.map(x => x.w), duz }, show: duz.map(i => it.ts[i].w).join(" "),
            solution: "Ümumiləşdirici söz: «" + phrasesOf(it.ts, "u").join(" ") + "» — həmcins üzvlərin (" + wordsOf(it.ts, "h").join(", ") + ") hamısına aiddir. " + it.rule + "." };
        }
        if (r < .7) {
          const m = it.ts.findIndex(x => it.pos === "b" || it.pos === "y" ? x.w === ":" : x.w === "–"), ts = it.ts.map((x, i) => i === m ? { w: "___", t: null } : x);
          const right = it.ts[m].w === ":" ? "qoşa nöqtə" : "tire";
          return mk(h("span", {}, "Boşluğa hansı işarə qoyulmalıdır?", line(plain(ts))), right, (right === "tire" ? ["qoşa nöqtə", "nöqtə", "nida işarəsi", "nöqtəli vergül"] : ["nöqtə", "nida işarəsi", "nöqtəli vergül", "üç nöqtə"]),
            "«" + it.good + "». " + it.rule + ".");
        }
        return punctRight(PUNCT_BY(["umum"]));
      } },
    { id: "elave", ad: "Əlavələr", izah: "Əlavə aid olduğu üzvdən sonra gəlir, onu aydınlaşdırır və dəqiqləşdirir; tire ilə ayrılır («yəni» olanda vergül). Təyin isə aid olduğu üzvdən əvvəl gəlir.",
      gen() {
        const r = Math.random(), it = pick(ELAVE);
        if (r < .3) {
          const duz = idxOf(it.ts, "l");
          return { text: "Cümlədəki əlavəyə toxun (əlavə sözün hamısına).", sec: { soz: it.ts.map(x => x.w), duz }, show: duz.map(i => it.ts[i].w).join(" "),
            solution: "Əlavə: «" + phrasesOf(it.ts, "l").join(" ") + "» — özündən əvvəlki üzvü aydınlaşdırır. " + it.rule + "." };
        }
        if (r < .5) {
          return mk(h("span", {}, "Fərqləndirilmiş əlavə hansı cümlə üzvünə aiddir?", line(...nodes(it.ts, x => x.t === "l"))), it.aid, AID.filter(x => x !== it.aid).slice(0, 4),
            "Əlavə «" + phrasesOf(it.ts, "l").join(" ") + "» — " + it.aid + " olan üzvü izah edir (" + it.aid + "ın əlavəsi). Əlavələr bütün cümlə üzvlərinə aid ola bilər.");
        }
        if (r < .75) {
          const p = pick(TP), isA = Math.random() < .5, ts = isA ? p.a : p.t, tg = isA ? "l" : "t";
          const right = isA ? "əlavə" : "təyin";
          return mk(h("span", {}, "Fərqləndirilmiş söz birləşməsi əlavədir, yoxsa təyin?", line(...nodes(ts, x => x.t === tg))), right, ["əlavə", "təyin", "xitab", "həmcins üzv"].filter(x => x !== right),
            isA ? "Aid olduğu üzvdən sonra gəlir, tire ilə ayrılıb və onu izah edir — əlavə." : "Aid olduğu üzvdən əvvəl gəlir və onun əlamətini bildirir — təyin.");
        }
        return punctRight(PUNCT_BY(["elave", "umum"]));
      } },
    { id: "xitab", ad: "Xitab və mübtəda", izah: "Xitab müraciət edilənin adıdır: cümlə üzvü deyil, xəbərlə uzlaşmır, vergüllə ayrılır. Mübtəda isə xəbərlə uzlaşır. Ara söz fikrə münasibət bildirir.",
      gen() {
        const r = Math.random();
        if (r < .25) {
          const it = pick([...XM.filter(x => x.kind === "x"), ...XA]), duz = idxOf(it.ts, "x");
          return { text: "Cümlədə müraciət ediləni bildirən sözə (xitaba) toxun.", sec: { soz: it.ts.map(x => x.w), duz }, show: duz.map(i => it.ts[i].w).join(", "),
            solution: "Xitab: «" + wordsOf(it.ts, "x").join(", ") + "» — müraciət ediləni bildirir, cümlə üzvü deyil, vergüllə ayrılır." };
        }
        if (r < .6) {
          const it = pick(XM), noP = it.dz && Math.random() < .5, ts = noP ? it.ts.filter(x => x.t || !/^[,]$/.test(x.w)) : it.ts, right = it.kind === "x" ? "xitab" : "mübtəda";
          return mk(h("span", {}, "Fərqləndirilmiş söz xitabdır, yoxsa mübtəda?", line(...nodes(ts, x => x.t === it.kind))), right, ["xitab", "mübtəda", "ara söz", "əlavə"].filter(x => x !== right),
            it.kind === "x" ? "«" + wordsOf(it.ts, "x")[0] + "» müraciət ediləni bildirir; xəbərlə uzlaşmır və heç bir suala cavab vermir — xitab." : "«" + wordsOf(it.ts, "m")[0] + "» xəbərlə uzlaşır (xəbər «kim?» sualına bu sözlə cavab verir) — mübtəda.");
        }
        if (r < .85) {
          const it = pick(XA.filter(x => x.bol)), ts = it.ts, ph = ["x", "a", "m"].map(t => phrasesOf(ts, t)[0]);
          const here = ["xitab", "ara söz", "mübtəda"], extra = sample(["əlavə", "həmcins üzv", "ümumiləşdirici söz"], 1 + R(2)), qrup = shuffle([...here, ...extra]);
          const soz = shuffle(ph), ad = w => here[ph.indexOf(w)];
          return { text: "«" + plain(ts) + "» — verilmiş sözləri qruplara ayır.", bol: { soz, qrup, duz: soz.map(w => qrup.indexOf(ad(w))) },
            show: ph.map(w => w + " — " + ad(w)).join("; "), solution: ph.map(w => w + " — " + ad(w)).join("; ") + ". Xitab müraciət ediləni, ara söz fikrə münasibəti bildirir; mübtəda xəbərlə uzlaşır." };
        }
        return punctRight(PUNCT_BY(["xitab", "xa"]));
      } },
    { id: "ara", ad: "Ara sözlər", izah: "Ara söz danışanın fikrə münasibətini bildirir, cümlə üzvü deyil və vergüllə ayrılır. «Sanki», «elə bil», «guya» istisnadır.",
      gen() {
        const r = Math.random();
        if (r < .3) {
          const it = pick([...ARA, ...XA]), duz = idxOf(it.ts, "a");
          return { text: "Cümlədəki ara sözə toxun (ara söz birləşmə də ola bilər).", sec: { soz: it.ts.map(x => x.w), duz }, show: duz.map(i => it.ts[i].w).join(" "),
            solution: "Ara söz: «" + phrasesOf(it.ts, "a").join(" ") + "» — danışanın fikrə münasibətini bildirir, cümlə üzvü deyil, vergüllə ayrılır." };
        }
        if (r < .55) {
          const a = pick(ARAM), right = MEANS[a.k];
          return mk(h("span", {}, "Fərqləndirilmiş ara söz danışanın fikrə hansı münasibətini bildirir?", line(...(() => { const i = a.s.toLocaleLowerCase("az").indexOf(a.w.toLocaleLowerCase("az")); return [a.s.slice(0, i), h("u", {}, h("b", {}, a.s.slice(i, i + a.w.length))), a.s.slice(i + a.w.length)]; })())), right,
            sample(MEANS.filter(x => x !== right), 4), "«" + a.w + "» — " + right + " bildirən ara sözdür.");
        }
        if (r < .65) {
          return mk("Hansı ara söz vergüllə ayrılmır (istisnadır)?", "sanki", ["əlbəttə", "şübhəsiz", "deyəsən", "görünür"], "Bənzətmə bildirən «sanki», «elə bil», «guya» sözləri vergüllə ayrılmır: Sanki buradan bir fırtına keçmişdi.");
        }
        return punctRight(PUNCT_BY(["ara", "xa", "sanki"]));
      } },
    { id: "sira", ad: "Söz sırası", izah: "Mübtəda, adətən, əvvəldə; xəbər sonda; tamamlıq və zərflik xəbərdən əvvəl; təyin təyin etdiyi üzvdən əvvəl gəlir. Şeirdə və danışıqda bu sıra pozula bilir (inversiya).",
      gen() {
        const r = Math.random();
        if (r < .35) {
          const ps = sample(SIRA, 4), bad = ps[0];
          return mk("Hansı cümlədə söz sırası pozulub?", plain(bad.p), ps.slice(1).map(x => plain(x.n)),
            "«" + plain(bad.p) + "» — xəbər cümlənin sonunda deyil, söz sırası pozulub (inversiya). Normal sıra: «" + plain(bad.n) + "». Qalan cümlələrdə xəbər sonda, tamamlıq və zərflik xəbərdən əvvəldir.");
        }
        if (r < .6) {
          const it = pick(SIRA), v = idxOf(it.p, "v");
          return { text: h("span", {}, "Bu cümlədə söz sırası pozulub. Yerini dəyişən xəbərə toxun.", line(plain(it.p))), sec: { soz: it.p.map(x => x.w), duz: v }, show: it.p[v[0]].w,
            solution: "Xəbər «" + it.p[v[0]].w + "» cümlənin sonunda deyil. Normal sıra: «" + plain(it.n) + "»." };
        }
        const q = pick(RQ.slice(0, 7));
        return mk(q[0], q[1], q[2], "Qayda: " + q[1] + ".");
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümləni təhlil edib üç bənd yazıb. Biri səhvdir — hansı?",
      gen() {
        const it = pick(SEHV), items = shuffle([...sample(it.t, 2).map(c => ({ c, ok: 1 })), { c: pick(it.f), ok: 0 }]), k = items.findIndex(x => !x.ok);
        const ord = ["1-ci bənd", "2-ci bənd", "3-cü bənd"];
        return { text: "«" + it.s + "» — şagirdin təhlili: " + items.map((x, i) => (i + 1) + ") " + x.c).join(" ") + " Hansı bənddə səhv var?",
          choices: ord, correct: k, show: ord[k], solution: "Səhv bənd: «" + items[k].c + "» Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AID_WORD = it => it.uzv;
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. həmcins üzv yoxdur
    { tip: "qapali", gen: () => Oyun.again(() => {
      const four = sample(HEM, 4), odd = pick(NOHEM);
      return AEq("Cümlələrin hansında həmcins üzvlər yoxdur?", plain(odd.ts), four.map(x => plain(x.ts)),
        "«" + plain(odd.ts) + "» — həmcins üzv yoxdur: " + odd.why + ". Digər cümlələrdə həmcins üzvlər: " + four.map(x => wordsOf(x.ts, "h").join(", ")).join("; ") + ".");
    }) },
    // 2. durğu səhv olan
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(PUNCT.filter(x => x.W.length), 5), bad = five[0], b = badOf(bad);
      return AEq("Cümlələrin hansında durğu işarəsi səhv işlədilib?", b, five.slice(1).map(x => x.good), whyP(bad, b) + " Qalan dörd cümlədə durğu düzgündür.");
    }) },
    // 3. xitab nömrə kombinasiyası
    { tip: "qapali", gen: () => Oyun.again(() => {
      const pool = [...XM, ...XA], five = sample(pool, 5);
      const tg = five.map(it => it.cat === "xa" ? pick(["x", "a", "m"].filter(t => idxOf(it.ts, t).length)) : it.kind);
      const right = five.map((it, i) => tg[i] === "x" ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz xitabdır?", ...five.map((it, i) => h("span", { style: "display:block" }, (i + 1) + ". ", ...nodes(it.ts, x => x.t === tg[i]))));
      const nm = { x: "xitab", m: "mübtəda", a: "ara söz" };
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((it, i) => (i + 1) + ") " + phrasesOf(it.ts, tg[i])[0] + " — " + nm[tg[i]]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 4. durğu düzgün nömrə kombinasiyası
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(PUNCT.filter(x => x.W.length), 5), ok = five.map(() => Math.random() < .5), bads = five.map(it => badOf(it));
      const right = ok.map((v, i) => v ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı cümlələrdə durğu işarələri düzgün qoyulub?", ...five.map((it, i) => h("span", { style: "display:block" }, (i + 1) + ". " + (ok[i] ? it.good : bads[i]))));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((it, i) => (i + 1) + ") " + (ok[i] ? "düzgündür" : "səhvdir; düzgünü: «" + it.good + "»")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 5. ara söz yoxdur (xitab, əlavə və həmcinslərdəki vergül tələ kimi)
    { tip: "qapali", gen: () => Oyun.again(() => {
      const four = sample([...ARA, ...XA], 4), odd = pick([...HEM, ...XM.filter(x => x.kind === "x"), ...ELAVE.filter(x => !x.yeni), ...UMUM.filter(x => x.pos === "b" || x.pos === "a")]);
      return AEq("Cümlələrin hansında ara söz yoxdur?", plain(odd.ts), four.map(x => plain(x.ts)),
        "«" + plain(odd.ts) + "» — ara söz yoxdur: burada vergül (ya tire) " + (odd.cat === "hem" ? "həmcins üzvləri" : odd.cat === "xitab" ? "xitabı" : odd.cat === "elave" ? "əlavəni" : "ümumiləşdirici sözü") + " ayırır. Digər cümlələrdə ara söz: " + four.map(x => phrasesOf(x.ts, "a").join(", ")).join("; ") + ".");
    }) },
    // 6. əlavə var
    { tip: "qapali", gen: () => Oyun.again(() => {
      const one = pick(ELAVE.filter(x => !x.yeni)), four = sample([...HEM, ...XM.filter(x => x.kind === "x"), ...ARA, ...UMUM.filter(x => x.pos === "a")], 4);
      return AEq("Cümlələrin hansında əlavə var?", plain(one.ts), four.map(x => plain(x.ts)),
        "«" + plain(one.ts) + "» — əlavə: «" + phrasesOf(one.ts, "l").join(" ") + "» (" + one.aid + " əlavəsi), tire ilə ayrılıb. Digər cümlələrdə əlavə yoxdur (vergül həmcinsləri, xitabı, ara sözü ayırır; ümumiləşdirici sözdən əvvəl tire qoyulur).");
    }) },
    // 7. ümumiləşdirici söz
    { tip: "qapali", gen: () => Oyun.again(() => {
      const bef = Math.random() < .5, U = UMUM.filter(x => bef ? x.pos === "b" : x.pos === "a"), V = UMUM.filter(x => bef ? x.pos === "a" : x.pos === "b");
      const one = pick(U), four = sample([...V, ...HEM], 4);
      return AEq("Cümlələrin hansında ümumiləşdirici söz həmcins üzvlərdən " + (bef ? "əvvəl" : "sonra") + " gəlir?", plain(one.ts), four.map(x => plain(x.ts)),
        "«" + plain(one.ts) + "» — ümumiləşdirici söz «" + phrasesOf(one.ts, "u").join(" ") + "» həmcins üzvlərdən " + (bef ? "əvvəl" : "sonra") + " gəlir (" + (bef ? "ondan sonra qoşa nöqtə" : "ondan əvvəl tire") + "). Qalan cümlələrdə belə deyil.");
    }) },
    // 8. ixtisar
    { tip: "qapali", gen: () => Oyun.again(() => {
      const it = pick(IXT), four = sample(NOIXT, 4);
      return AEq("Cümlələrin hansında həmcins üzvlərdə ixtisar var?", plain(it.ts), four.map(x => plain(x.ts)),
        "«" + plain(it.ts) + "» — ixtisar var (tam forma: " + it.full + "). Qalan cümlələrdə şəkilçi, qoşma tam saxlanılıb.");
    }) },
    // 9. söz sırası
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ps = sample(SIRA, 5), bad = ps[0];
      return AEq("Cümlələrin hansında söz sırası pozulub?", plain(bad.p), ps.slice(1).map(x => plain(x.n)),
        "«" + plain(bad.p) + "» — xəbər sonda deyil, söz sırası pozulub. Normal sıra: «" + plain(bad.n) + "». Qalan cümlələrdə xəbər sonda, tamamlıq və zərflik xəbərdən əvvəldir.");
    }) },
    // 10. fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("Həmcins üzvlər, əlavə, ara söz, xitab və söz sırası ilə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: «" + bad + "» Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Həmcins üzvlər, əlavə, ara söz, xitab və söz sırası ilə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: «" + ok + "» Qalan dörd fikir səhvdir.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== __yoxla: bankdakı hər fakt ayrıca sual kimi (cavabsız yoxlanılır) ========
  const Y = []; let yn = 0;
  const yq = (sual, cavab) => Y.push({ id: "y" + (++yn), sual, cavab });
  const DS = "(doğru / səhv)";
  PUNCT.forEach(it => {
    yq("«" + it.good + "» cümləsində durğu işarələri düzgün qoyulubmu? " + DS, "doğru");
    it.W.forEach(w => yq("«" + w + "» cümləsində durğu işarələri düzgün qoyulubmu? " + DS, "səhv"));
  });
  const UZ = "(mübtəda, xəbər, təyin, tamamlıq, zərflik)";
  HEM.forEach(it => {
    yq("«" + plain(it.ts) + "» — cümlədəki həmcins üzvləri yaz (cavabı vergüllə ayıraraq, cümlədəki sıra ilə yaz; bağlayıcıları yazma).", wordsOf(it.ts, "h").join(", "));
    yq("«" + plain(it.ts) + "» — həmcins üzvlər (" + wordsOf(it.ts, "h").join(", ") + ") hansı cümlə üzvüdür? " + UZ, it.uzv);
    if (it.bag) yq("«" + plain(it.ts) + "» — həmcins üzvləri hansı vasitə bağlayır? (variantlardan birini olduğu kimi yaz: yalnız sadalama intonasiyası; və; həm … həm də; nə … nə də; ya … ya da)", BAGAD[it.bag].replace(" bağlayıcısı", "").replace(" bağlayıcıları", "").replace("yalnız sadalama intonasiyası (vergül)", "yalnız sadalama intonasiyası").replace(/[«»]/g, ""));
  });
  NOHEM.forEach(it => yq("«" + plain(it.ts) + "» cümləsində həmcins üzvlər varmı? (var / yoxdur)", "yoxdur"));
  IXT.forEach(it => {
    yq("«" + plain(it.ts) + "» — həmcins üzvlərdən hansılarında şəkilçi, qoşma və ya «idi» ixtisar edilib (sonuncu üzvdə saxlanılıb)? Həmin sözləri yaz.", wordsOf(it.ts, "s").join(", "));
    if ("qhmi".includes(it.kind)) yq("«" + plain(it.ts) + "» — həmcins üzvlərdə nə ixtisar edilib? (qoşma, hal şəkilçisi, mənsubiyyət şəkilçisi, «idi» köməkçi sözü, cəm şəkilçisi)", KIND[it.kind].replace("«idi» köməkçi sözü", "«idi» köməkçi sözü"));
  });
  NOIXT.forEach(it => yq("«" + plain(it.ts) + "» cümləsində həmcins üzvlərdə ixtisar varmı? (var / yoxdur)", "yoxdur"));
  UMUM.forEach(it => {
    yq("«" + plain(it.ts) + "» — həmcins üzvləri ümumiləşdirən söz və ya ifadəni yaz.", phrasesOf(it.ts, "u").join(" "));
    yq("«" + plain(it.ts) + "» — ümumiləşdirici söz həmcins üzvlərdən əvvəl gəlir, yoxsa sonra? (əvvəl / sonra)", it.pos === "b" || it.pos === "y" ? "əvvəl" : "sonra");
  });
  ELAVE.forEach(it => {
    yq("«" + plain(it.ts) + "» — cümlədəki əlavəni yaz (aid olduğu üzvdən sonra gələn izahedici söz və ifadə).", phrasesOf(it.ts, "l").join(" "));
    yq("«" + plain(it.ts) + "» — əlavə hansı cümlə üzvünə aiddir? " + UZ, it.aid);
  });
  TP.forEach(p => {
    yq("«" + plain(p.a) + "» cümləsində «" + phrasesOf(p.a, "l").join(" ") + "» əlavədir, yoxsa təyin? (əlavə / təyin)", "əlavə");
    yq("«" + plain(p.t) + "» cümləsində «" + phrasesOf(p.t, "t").join(" ") + "» əlavədir, yoxsa təyin? (əlavə / təyin)", "təyin");
  });
  XM.forEach(it => yq("«" + plain(it.ts) + "» — «" + wordsOf(it.ts, it.kind)[0] + "» sözü xitabdır, yoxsa mübtəda? (xitab / mübtəda)", it.kind === "x" ? "xitab" : "mübtəda"));
  XM.filter(x => x.dz).forEach(it => yq("«" + plain(it.ts.filter(x => x.t || x.w !== ",")) + "» (vergülsüz yazılıb) — «" + wordsOf(it.ts, it.kind)[0] + "» sözü xitabdır, yoxsa mübtəda? (xitab / mübtəda)", it.kind === "x" ? "xitab" : "mübtəda"));
  XA.forEach(it => {
    yq("«" + plain(it.ts) + "» — xitabı yaz.", wordsOf(it.ts, "x").join(" "));
    yq("«" + plain(it.ts) + "» — ara sözü yaz.", phrasesOf(it.ts, "a").join(" "));
    if (it.bol) yq("«" + plain(it.ts) + "» — mübtədanı yaz.", wordsOf(it.ts, "m").join(" "));
  });
  ARA.forEach(it => yq("«" + plain(it.ts) + "» — ara sözü yaz (söz birləşməsi ola bilər).", phrasesOf(it.ts, "a").join(" ")));
  ARAM.forEach(a => yq("«" + a.s + "» cümləsində «" + a.w + "» ara sözü danışanın fikrə hansı münasibətini bildirir? (" + MEANS.join("; ") + ")", MEANS[a.k]));
  SIRA.forEach(p => {
    yq("«" + plain(p.n) + "» cümləsində söz sırası pozulubmu? (pozulub / pozulmayıb)", "pozulmayıb");
    yq("«" + plain(p.p) + "» cümləsində söz sırası pozulubmu? (pozulub / pozulmayıb)", "pozulub");
  });
  SEHV.forEach(it => { it.t.forEach(c => yq("«" + it.s + "» cümləsi haqqında fikir: " + c + " (doğru / səhv)", "doğru")); it.f.forEach(c => yq("«" + it.s + "» cümləsi haqqında fikir: " + c + " (doğru / səhv)", "səhv")); });
  FIKIR_DUZ.forEach(f => yq("Qayda: «" + f + "» " + DS, "doğru"));
  FIKIR_SEHV.forEach(f => yq("Qayda: «" + f + "» " + DS, "səhv"));
  RQ.forEach(q => yq(q[0] + " (" + shuffle([q[1], ...q[2]]).join("; ") + ")", q[1]));
  window.__yoxla = Y;

  window.__levels = levels;
  window.__bank = { HEM, NOHEM, IXT, NOIXT, UMUM, ELAVE, TP, XM, XA, ARA, ARAM, SIRA, SEHV, FIKIR_DUZ, FIKIR_SEHV, RQ, PUNCT };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-hemcins", title: "Həmcins üzvlər, əlavə, ara söz, xitab, söz sırası", fenn: "azdili", link: "dersler/az-hemcins.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər cümlədə durğu işarəsinin səbəbini düşün.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hemcins", "ixtisar", "umumi", "elave", "elave", "xitab", "xitab", "ara", "sira", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-hemcins.html")) b.push("dersler/az-hemcins.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
