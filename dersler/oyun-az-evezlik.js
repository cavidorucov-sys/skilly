// Azərbaycan dili · Əvəzlik — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024), s. 10 (əsas nitq hissələri; "biz — şəxs əvəzliyidir, ismi əvəz edir"),
// s. 27 (şəxs şəkilçiləri), s. 74–75 (əvəzliyin məna növləri: "Yadda saxla" — qeyri-müəyyən və təyini əvəzliklər; tapşırıqlar 4a–4f);
// 6-cı sinif, 2-ci hissə (2025), s. 84 ("O" və "bu" əvəzliklərindən sonra vergül: "Yadda saxla" və tapşırıqlar 4b, 4c, 4ç).
// Rəsmi proqram: əvəzliyin mənaca növləri; şəxs əvəzlikləri (I, II, III şəxsin təki və cəmi); işarə, sual, qeyri-müəyyən, təyini əvəzliklər.
// Bank qaydaları: hər cümlədə əvəzliklər etiketlənib, etiketsiz söz əvəzlik deyil. Bankda qəsdən olmayanlar: "kimi" (qoşma ilə omonim),
// "hər kəs, hərə, hər şey, bəzi, bir şey, heç bir, özü" (növü dərslikdə göstərilməyib), "belə, elə, həmin", "nə vaxt, nə qədər" (iki sözlü),
// mübtəda/təyin vəzifəsi vergüllə ayrılmadan ikimənalı oxunan "o/bu" cümlələri.
(function () {
  const h = Oyun.h;
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

  // ---- əvəzlik növləri
  const TIP = { S: "şəxs", I: "işarə", U: "sual", Q: "qeyri-müəyyən", T: "təyini" };
  const NAME = { S: "şəxs əvəzliyi", I: "işarə əvəzliyi", U: "sual əvəzliyi", Q: "qeyri-müəyyən əvəzlik", T: "təyini əvəzlik" };
  const TIPLER = "şəxs, işarə, sual, qeyri-müəyyən, təyini";
  const KEYS = ["S", "I", "U", "Q", "T"];
  const WHY = {
    S: "şəxs əvəzliyidir, ismi (şəxsin adını) əvəz edir",
    I: "işarə əvəzliyidir, nəyə işarə etdiyini göstərir",
    U: "sual əvəzliyidir, sual cümləsi yaradır",
    Q: "qeyri-müəyyən əvəzlikdir, qeyri-müəyyən varlığı bildirir və kim? nə? suallarına cavab verir",
    T: "təyini əvəzlikdir, ismə aid olub onu ümumi şəkildə təyin edir və necə? hansı? suallarına cavab verir",
  };

  // ---- cümlə bankı: "söz:ETİKET" (S şəxs, I işarə, U sual, Q qeyri-müəyyən, T təyini); "_" iki sözdən ibarət bir vahiddir;
  // etiketsiz söz əvəzlik deyil; durğu işarəsi ayrıca elementdir.
  const PUNCT = /^[.,!?;:]+$/;
  const BANK = [
    "Mən:S sabah kitabxanaya gedəcəyəm .",
    "Sən:S nə:U oxuyursan ?",
    "Biz:S bütün:T dərslərə yaxşı hazırlaşmalıyıq .",
    "Kim:U bu:I şəkli çəkib ?",
    "Onlar:S evə gec qayıtdılar .",
    "Kimsə:Q qapını döyür .",
    "Hamı:Q bu:I fikirlə razılaşdı .",
    "Onun:S təklifini heç_kim:Q dəstəkləmədi .",
    "Mən:S hər:T gün tezdən dururam .",
    "Meyvələri öz:T bağımızdan dərmişəm .",
    "Hər:T otaqda təzə mebel vardı .",
    "İçəridə kimsə:Q var .",
    "Bu:I yerlərin təbiəti gözəldir .",
    "Dünən birisi:Q məktəbin divarına elan vurub .",
    "O:S , rəfdən kitab götürdü .",
    "Bu:I sənin:S şəxsi fikrindir ?",
    "Atam bu:I xəbəri eşidəndə çox sevinəcək .",
    "O:I sinfin şagirdləri çalışqan və bacarıqlıdırlar .",
    "Sən:S hansı:U kitabı oxuyursan ?",
    "Sinifdə neçə:U şagird var ?",
    "Sən:S kimə:U zəng_edəcəksən ?",
    "Mən:S heç_nə:Q başa_düşmədim .",
    "Heç_kəs:Q bu:I xəbəri bilmirdi .",
    "Bütün:T şagirdlər imtahana hazırlaşırlar .",
    "Biri:Q pəncərəni açdı .",
    "Əli onlara:S kitab verdi .",
    "Ayla o:I kitabı mənə:S verdi .",
    "Filan:T şagird dərsə gəlməyib .",
    "Bu:I çanta mənim:S qardaşımındır .",
    "Nə:U baş_verdi ?",
    "Siz:S bizə:S kömək_edəcəksiniz ?",
    "Kim:U gəlib ?",
    "Hamı:Q öz:T yerini tutdu .",
    "O:S , dünən Bakıya getdi .",
    "Mən:S o:I kitabı oxumuşam .",
    "Kimsə:Q bizi:S çağırdı .",
    "Siz:S hansı:U fənni sevirsiniz ?",
    "Əli bu:I kitabı sənə:S verdi .",
    "Onlar:S nəyi:U gözləyirlər ?",
    "O:S hər:T gün kitabxanaya gedir .",
    "Sən:S bu:I kitabı kimə:U verdin ?",
    "Biz:S hamı:Q ilə görüşdük .",
    "Kimsə:Q mənə:S zəng_etdi .",
    "Hansı:U şagird öz:T dəftərini unudub ?",
    "Heç_kim:Q bu:I sualın cavabını bilmir .",
    "Siz:S bütün:T kitabları oxumusunuz .",
    "Mənə:S nə:U lazımdır ?",
  ].map(s => s.split(" ").map(t => { const m = t.match(/^(.+):([SIUQT])$/); const w = m ? m[1] : t; return { w: w.replace(/_/g, " "), t: m ? m[2] : null, p: PUNCT.test(t) }; }));
  const prons = s => s.filter(x => x.t);
  const hasT = (s, t) => s.some(x => x.t === t);
  const NO_O = BANK.filter(x => !x.some(y => y.w.toLowerCase() === "o")); // «o»-nun növü (şəxs/işarə) dərslikdə qayda ilə verilməyib: növ soruşan suallarda belə cümlələr yoxdur
  const idxs = (s, f) => s.map((x, i) => f(x) ? i : -1).filter(i => i >= 0);
  const plain = s => s.map((x, i) => (i && !x.p ? " " : "") + x.w).join("");
  const markSent = (s, k) => h("span", {}, ...s.map((x, i) => [i && !x.p ? " " : "", i === k ? h("u", {}, h("b", {}, x.w)) : x.w]));
  const typesOf = s => KEYS.filter(t => hasT(s, t));
  const listP = s => prons(s).map(x => x.w + " — " + TIP[x.t]).join("; ");

  // ---- tək sözlər (cümlədən kənarda da növü birmənalıdır; "o" burada yoxdur, çünki həm şəxs, həm işarə ola bilər)
  const SOZ = {
    S: ["mən", "sən", "biz", "siz", "onlar"],
    I: ["bu"],
    U: ["kim", "hansı"],
    Q: ["kimsə", "hamı", "heç kim", "heç nə", "heç kəs"],
    T: ["öz", "hər", "bütün", "filan"],
  };
  const EVP = KEYS.flatMap(t => SOZ[t].map(w => ({ w, t })));
  // əvəzlik olmayan sözlər (isim, sifət, say, feil, zərf, köməkçi)
  const NON = [["kitab", "isim"], ["pəncərə", "isim"], ["şagird", "isim"], ["dəftər", "isim"], ["ağac", "isim"],
    ["gözəl", "sifət"], ["hündür", "sifət"], ["mehriban", "sifət"], ["ağıllı", "sifət"],
    ["beş", "say"], ["iyirmi", "say"], ["üçüncü", "say"], ["yüz", "say"],
    ["oxudu", "feil"], ["gəlir", "feil"], ["yazacaq", "feil"], ["qaçdı", "feil"],
    ["tez", "zərf"], ["gec", "zərf"], ["içəri", "zərf"], ["geri", "zərf"],
    ["və", "bağlayıcı"], ["üçün", "qoşma"], ["ilə", "qoşma"], ["amma", "bağlayıcı"], ["hətta", "ədat"]];

  // ---- əvəzlik nəyin yerində işlənib (isim: kim? nə?; sifət: hansı?; say: neçə?); *söz* fərqləndirilmiş sözdür
  const YER = [
    ["*Kim* bu şəkli çəkib?", "isim", "kim? — şəxsi soruşur, ismin yerində işlənir"],
    ["*Mən* sabah kitabxanaya gedəcəyəm.", "isim", "kim? — danışanın adının (ismin) yerində işlənir"],
    ["*Hamı* bu fikirlə razılaşdı.", "isim", "kim? — şəxslərin yerində işlənir"],
    ["*Nə* baş verdi?", "isim", "nə? — hadisənin adının (ismin) yerində işlənir"],
    ["Dünən *birisi* məktəbin divarına elan vurub.", "isim", "kim? — şəxsin yerində işlənir"],
    ["*Onlar* evə gec qayıtdılar.", "isim", "kimlər? — şəxslərin adlarının yerində işlənir"],
    ["*Kimsə* qapını döyür.", "isim", "kim? — şəxsin yerində işlənir"],
    ["*Heç kim* təklifi dəstəkləmədi.", "isim", "kim? — şəxsin yerində işlənir"],
    ["Sən *hansı* kitabı oxuyursan?", "sifət", "hansı kitab? — ismə aiddir, sifətin sualı (hansı?) ilə işlənir"],
    ["*Hansı* şagird dərsə gəlməyib?", "sifət", "hansı şagird? — ismə aiddir, sifətin sualı (hansı?) ilə işlənir"],
    ["Siz *hansı* fənni sevirsiniz?", "sifət", "hansı fənni? — ismə aiddir, sifətin sualı (hansı?) ilə işlənir"],
    ["Sinifdə *neçə* şagird var?", "say", "neçə şagird? — miqdarı soruşur, sayın yerində işlənir"],
    ["Rəfdə *neçə* kitab var?", "say", "neçə kitab? — miqdarı soruşur, sayın yerində işlənir"],
    ["Məktəbdə *neçə* sinif var?", "say", "neçə sinif? — miqdarı soruşur, sayın yerində işlənir"],
    ["Qutuda *neçə* qələm var?", "say", "neçə qələm? — miqdarı soruşur, sayın yerində işlənir"],
    ["Həyətdə *neçə* uşaq oynayır?", "say", "neçə uşaq? — miqdarı soruşur, sayın yerində işlənir"],
    ["*Kim* gəlib?", "isim", "kim? — şəxsi soruşur, ismin yerində işlənir"],
    ["Sən *nə* oxuyursan?", "isim", "nə? — əşyanın adının (ismin) yerində işlənir"],
    ["Sən *nəyi* gözləyirsən?", "isim", "nəyi? — əşyanın adının (ismin) yerində işlənir"],
    ["*Hansı* fənni sevirsən?", "sifət", "hansı fənni? — ismə aiddir, sifətin sualı (hansı?) ilə işlənir"],
    ["*Hamı* öz yerini tutdu.", "isim", "kim? — şəxslərin yerində işlənir"],
    ["Rəfdə *hansı* kitab var?", "sifət", "hansı kitab? — ismə aiddir, sifətin sualı (hansı?) ilə işlənir"],
  ].map(([s, t, why]) => ({ s, t, why, w: s.match(/\*([^*]+)\*/)[1] }));
  const mark = s => { const p = s.split("*"); return h("span", {}, p[0], h("u", {}, h("b", {}, p[1])), p[2]); };
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);

  // ---- şəxs əvəzlikləri: I, II, III şəxsin təki və cəmi
  const SXL = ["I şəxsin təki", "I şəxsin cəmi", "II şəxsin təki", "II şəxsin cəmi", "III şəxsin təki", "III şəxsin cəmi"];
  const SXW = ["mən", "biz", "sən", "siz", "o", "onlar"];
  const SX = [
    ["*Mən* sabah kitabxanaya gedəcəyəm.", 0], ["*Mən* hər gün tezdən dururam.", 0],
    ["*Biz* bütün dərslərə yaxşı hazırlaşmalıyıq.", 1], ["*Biz* sinifdə şeir oxuyuruq.", 1],
    ["*Sən* hansı kitabı oxuyursan?", 2], ["*Sən* dərsə hazırlaşmısan?", 2],
    ["*Siz* məktəbə tezdən gəlirsiniz.", 3], ["*Siz* hansı fənni sevirsiniz?", 3],
    ["*O*, dünən Bakıya getdi.", 4], ["*O* hər gün kitabxanaya gedir.", 4],
    ["*Onlar* evə gec qayıtdılar.", 5], ["*Onlar* nəyi gözləyirlər?", 5],
    ["*Mən* dərsə hazırlaşıram.", 0], ["*Biz* sabah görüşəcəyik.", 1], ["*Sən* sabah gələcəksən.", 2],
    ["*Siz* bizə kömək edəcəksiniz.", 3], ["*O*, sabah imtahan verəcək.", 4], ["*Onlar* sabah gələcəklər.", 5],
    ["*Biz* dərsdən sonra oynadıq.", 1], ["*O* hər gün tezdən durur.", 4], ["*Mən* nəyi gözləyirəm?", 0], ["*Sən* nə oxuyursan?", 2],
  ].map(([s, k]) => ({ s, k, w: s.match(/\*([^*]+)\*/)[1] }));

  // ---- "o", "bu"-dan sonra vergül (6-cı sinif, 2-ci hissə, s. 84). [növ, düzgün, səhv, sonrakı söz və ya aid olduğu söz]
  // M — mübtəda + isim/sifət/say/zərf: vergül qoyulur; K — mübtəda + əvəzlik/feil/köməkçi: qoyulmur; T — təyin: qoyulmur
  const VG = [
    ["M", "Bu, Sonanı çox narahat edirdi.", "Bu Sonanı çox narahat edirdi.", "Sonanı — isim"],
    ["M", "O, Azərbaycanın Milli Qəhrəmanıdır.", "O Azərbaycanın Milli Qəhrəmanıdır.", "Azərbaycanın — isim"],
    ["M", "Bu, maraqlı hekayədir.", "Bu maraqlı hekayədir.", "maraqlı — sifət"],
    ["M", "Bu, Aygünün kitabıdır.", "Bu Aygünün kitabıdır.", "Aygünün — isim"],
    ["M", "O, tələsik otaqdan çıxdı.", "O tələsik otaqdan çıxdı.", "tələsik — zərf"],
    ["M", "O, yaxşı şagirddir.", "O yaxşı şagirddir.", "yaxşı — sifət"],
    ["M", "Bu, gözəl ideyadır.", "Bu gözəl ideyadır.", "gözəl — sifət"],
    ["M", "O, çox yorğundur.", "O çox yorğundur.", "çox — zərf"],
    ["K", "O da olimpiadada iştirak edir.", "O, da olimpiadada iştirak edir.", "da — köməkçi nitq hissəsi (ədat)"],
    ["K", "Bu öz günahı idi.", "Bu, öz günahı idi.", "öz — əvəzlik"],
    ["K", "O dedi ki, gec gələcək.", "O, dedi ki, gec gələcək.", "dedi — feil"],
    ["K", "Bu isə Humayın oyuncağıdır.", "Bu, isə Humayın oyuncağıdır.", "isə — köməkçi nitq hissəsi"],
    ["K", "O bizi məğlubiyyətdən xilas etdi.", "O, bizi məğlubiyyətdən xilas etdi.", "bizi — əvəzlik"],
    ["K", "Bu sənin şəxsi fikrindir?", "Bu, sənin şəxsi fikrindir?", "sənin — əvəzlik"],
    ["K", "O gəldi və hamı sevindi.", "O, gəldi və hamı sevindi.", "gəldi — feil"],
    ["K", "Bu da məni sevindirdi.", "Bu, da məni sevindirdi.", "da — köməkçi nitq hissəsi (ədat)"],
    ["K", "O və Aygün dostdurlar.", "O, və Aygün dostdurlar.", "və — köməkçi nitq hissəsi (bağlayıcı)"],
    ["K", "Bu mənim kitabımdır.", "Bu, mənim kitabımdır.", "mənim — əvəzlik"],
    ["T", "O sinfin şagirdləri çalışqan və bacarıqlıdırlar.", "O, sinfin şagirdləri çalışqan və bacarıqlıdırlar.", "sinfin — hansı sinfin?"],
    ["T", "Atam bu xəbəri eşidəndə çox sevinəcək.", "Atam bu, xəbəri eşidəndə çox sevinəcək.", "xəbəri — hansı xəbəri?"],
    ["T", "Bu yerlərin təbiəti gözəldir.", "Bu, yerlərin təbiəti gözəldir.", "yerlərin — hansı yerlərin?"],
    ["T", "Mən bu kitabı oxumuşam.", "Mən bu, kitabı oxumuşam.", "kitabı — hansı kitabı?"],
    ["T", "Ayla o kitabı mənə verdi.", "Ayla o, kitabı mənə verdi.", "kitabı — hansı kitabı?"],
    ["T", "Bu şəkli Aygün çəkib.", "Bu, şəkli Aygün çəkib.", "şəkli — hansı şəkli?"],
    ["T", "Mən o mağazanı tanıyıram.", "Mən o, mağazanı tanıyıram.", "mağazanı — hansı mağazanı?"],
    ["T", "Bu qatarla yeni sərnişinlər gəldi.", "Bu, qatarla yeni sərnişinlər gəldi.", "qatarla — hansı qatar?"],
  ].map(([k, ok, bad, info]) => ({ k, ok, bad, info }));
  const whyOk = x => x.k === "M" ? "«o/bu» mübtədadır, ondan sonra gələn söz: " + x.info + " → vergül qoyulur"
    : x.k === "K" ? "«o/bu» mübtədadır, ondan sonra gələn söz: " + x.info + " → vergül qoyulmur" : "«o/bu» təyin vəzifəsindədir (" + x.info + ") → vergül qoyulmur";
  const whyBad = x => x.k === "M" ? "vergül buraxılıb: «o/bu» mübtədadır, sonra " + x.info.replace(/ — /, " (") + ") gəlir"
    : x.k === "K" ? "vergül artıqdır: «o/bu» mübtədadır, sonra " + x.info.replace(/ — /, " (") + ") gəlir" : "vergül artıqdır: «o/bu» təyindir (" + x.info + ")";
  const SHOWN = x => x.k === "M" ? x.bad : x.ok; // vergülsüz görünən forma
  const markOB = s => { const t = s.split(" "), i = t.findIndex(w => /^(o|bu)$/i.test(w)); return h("span", {}, ...t.map((w, j) => [j ? " " : "", j === i ? h("u", {}, h("b", {}, w)) : w])); };
  const VKIND = { M: 0, K: 1, T: 2 };
  const VCH = ["Vergül lazımdır: o/bu mübtədadır, sonra isim, sifət, say və ya zərf gəlir",
    "Vergül lazım deyil: o/bu mübtədadır, sonra əvəzlik, feil və ya köməkçi nitq hissəsi gəlir", "Vergül lazım deyil: o/bu təyindir"];

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "tap", ad: "Əvəzliyi tap", izah: "Əvəzlik əsas nitq hissələrinin (isim, sifət, say) yerində işlənir. Cümlədəki bütün əvəzliklərə toxun. «heç kim» kimi sözlər bir əvəzlikdir.",
      gen() {
        const s = pick(BANK), duz = idxs(s, x => x.t);
        return { text: "Cümlədəki bütün əvəzliklərə toxun.", sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
          solution: "Əvəzliklər: " + listP(s) + ". Qalan sözlər başqa nitq hissələridir." };
      } },
    { id: "yer", ad: "Əvəzlik nəyin yerində", izah: "Əvəzlik əvəz etdiyi sözün sualına cavab verir: kim? nə? — ismin yerində; hansı? — sifətin yerində; neçə? — sayın yerində.",
      gen() {
        const o = pick(YER), opts = ["isim", "sifət", "say", "zərf", "feil"];
        return { text: h("span", {}, "Fərqləndirilmiş əvəzlik hansı nitq hissəsinin yerində işlənib?", line(mark(o.s))), choices: opts, correct: opts.indexOf(o.t), show: o.t,
          solution: "“" + o.w + "” — " + o.why + ". Deməli, " + o.t + " yerində işlənib." };
      } },
    { id: "sexs", ad: "Şəxs əvəzlikləri", izah: "Mən, sən, o — təkdə; biz, siz, onlar — cəmdə. Mən, biz — I şəxs; sən, siz — II şəxs; o, onlar — III şəxs.",
      gen() {
        const o = pick(SX);
        return { text: h("span", {}, "Fərqləndirilmiş şəxs əvəzliyi hansı şəxsin təkini və ya cəmini bildirir?", line(mark(o.s))), choices: SXL, correct: o.k, show: SXL[o.k],
          solution: "“" + o.w + "” — " + SXL[o.k] + ". Cədvəl: mən, sən, o (tək); biz, siz, onlar (cəm)." };
      } },
    { id: "novu", ad: "Əvəzliyin növü", izah: "Şəxs — ismi əvəz edir; işarə — nəyə işarə etdiyini göstərir; sual — sual cümləsi yaradır; qeyri-müəyyən — kim? nə?; təyini — necə? hansı?",
      gen() {
        const s = pick(NO_O), i = pick(idxs(s, x => x.t)), t = s[i].t, opts = KEYS.map(k => NAME[k]);
        return { text: h("span", {}, "Fərqləndirilmiş söz hansı növ əvəzlikdir?", line(markSent(s, i))), choices: opts, correct: KEYS.indexOf(t), show: NAME[t],
          solution: "“" + s[i].w + "” — " + WHY[t] + "." };
      } },
    { id: "bolgu", ad: "Bölgü: əvəzlik növləri", izah: "Cümlədəki əvəzlikləri növlərinə ayır: şəxs, işarə, sual, qeyri-müəyyən, təyini.",
      gen() {
        const s = pick(NO_O.filter(x => typesOf(x).length >= 2)), ws = prons(s), here = typesOf(s);
        const extra = sample(KEYS.filter(t => !here.includes(t)), 1 + R(2)), tags = KEYS.filter(t => here.includes(t) || extra.includes(t));
        return { text: "«" + plain(s) + "» — əvəzlikləri növlərinə ayır.", bol: { soz: ws.map(w => w.w), qrup: tags.map(t => TIP[t]), duz: ws.map(w => tags.indexOf(w.t)) },
          show: ws.map(w => w.w + " — " + TIP[w.t]).join("; "), solution: ws.map(w => w.w + " — " + NAME[w.t]).join("; ") + "." };
      } },
    { id: "vergul", ad: "O, bu-dan sonra vergül", izah: "O, bu təyindirsə — vergül yoxdur. Mübtədadırsa — sonrakı sözə bax: isim, sifət, say, zərf gələrsə vergül qoyulur; əvəzlik, feil, köməkçi nitq hissəsi gələrsə qoyulmur.",
      gen() {
        const r = pick(VG), others = sample(VG.filter(x => x !== r), 3), ch = shuffle([r.ok, ...others.map(x => x.bad)]);
        return { text: "Hansı cümlədə vergül düzgün işlədilib (və ya düzgün buraxılıb)?", choices: ch, correct: ch.indexOf(r.ok), show: r.ok,
          solution: "“" + r.ok + "” — " + whyOk(r) + ". Qalanları: " + others.map(x => "“" + x.bad + "” — " + whyBad(x)).join("; ") + "." };
      } },
    { id: "vergul2", ad: "Vergül lazımdırmı?", izah: "Əvvəl o, bu-nun cümlədəki vəzifəsini müəyyən et: təyin, yoxsa mübtəda. Mübtədadırsa, sonrakı sözün nitq hissəsinə bax.",
      gen() {
        const r = pick(VG);
        return { text: h("span", {}, "Fərqləndirilmiş «o» (və ya «bu») sözündən sonra vergül lazımdırmı?", line(markOB(SHOWN(r)))), choices: VCH, correct: VKIND[r.k], show: VCH[VKIND[r.k]],
          solution: "“" + r.ok + "” — " + whyOk(r) + "." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird üç əvəzliyin növünü yazıb. Biri səhvdir — hansı?",
      gen() {
        const ks = sample(KEYS, 3), ws = ks.map(t => ({ t, w: pick(SOZ[t]) })), k = R(3);
        const lab = ws.map((x, j) => j === k ? pick(KEYS.filter(t => t !== x.t)) : x.t), ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "Şagird əvəzliklərin növünü yazıb: " + ws.map((x, j) => (j + 1) + ") " + x.w + " — " + TIP[lab[j]]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "“" + ws[k].w + "” " + TIP[lab[k]] + " əvəzliyi deyil, " + NAME[ws[k].t] + "dir. Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const FIKIR_DUZ = [
    "Əvəzlik əsas nitq hissəsidir.",
    "Əvəzlik əsas nitq hissələrinin yerində işlənir.",
    "Şəxs əvəzlikləri I, II və III şəxsin təkində və cəmində işlənir.",
    "Qeyri-müəyyən əvəzliklər kim? nə? suallarına cavab verir.",
    "Təyini əvəzliklər necə? hansı? suallarına cavab verir.",
    "Öz, hər, bütün, filan təyini əvəzliklərdir.",
    "Öz təyini əvəzliyindən sonra gələn söz mənsubiyyət şəkilçisi qəbul edir.",
    "Tərkibində heç sözü olan və inkar mənası ifadə edən əvəzliklər də qeyri-müəyyən əvəzlik sayılır.",
    "Kimsə, hamı, heç kim qeyri-müəyyən əvəzliklərdir.",
    "O, bu əvəzlikləri təyin vəzifəsində işləndikdə onlardan sonra vergül qoyulmur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra isim gələrsə, vergül qoyulur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra sifət gələrsə, vergül qoyulur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra feil gələrsə, vergül qoyulmur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra əvəzlik gələrsə, vergül qoyulmur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra köməkçi nitq hissəsi gələrsə, vergül qoyulmur.",
  ];
  const FIKIR_SEHV = [
    "Əvəzlik köməkçi nitq hissəsidir.",
    "Qeyri-müəyyən əvəzliklər necə? hansı? suallarına cavab verir.",
    "Təyini əvəzliklər kim? nə? suallarına cavab verir.",
    "Öz təyini əvəzliyindən sonra gələn söz mənsubiyyət şəkilçisi qəbul etmir.",
    "Kimsə, hamı, bütün qeyri-müəyyən əvəzliklərdir.",
    "Öz, hər, bütün, filan qeyri-müəyyən əvəzliklərdir.",
    "Heç kim sözü sual əvəzliyidir.",
    "Mən sözü II şəxsin təkini bildirir.",
    "Biz sözü III şəxsin cəmini bildirir.",
    "O, bu əvəzlikləri təyin vəzifəsində işləndikdə onlardan sonra vergül qoyulur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra isim gələrsə, vergül qoyulmur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra sifət gələrsə, vergül qoyulmur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra feil gələrsə, vergül qoyulur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra əvəzlik gələrsə, vergül qoyulur.",
    "Mübtəda vəzifəsində olan o, bu əvəzliklərindən sonra köməkçi nitq hissəsi gələrsə, vergül qoyulur.",
  ];

  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1. biri fərqlidir: dörd əvəzlik + bir başqa nitq hissəsi
    { tip: "qapali", gen: () => Oyun.again(() => {
      const four = sample(EVP, 4), odd = pick(NON);
      return AEq("Ümumi qrammatik mənasına görə biri fərqlidir:", odd[0], four.map(x => x.w),
        "“" + odd[0] + "” — " + odd[1] + ". Qalanları əvəzlikdir: " + four.map(x => x.w + " — " + TIP[x.t]).join(", ") + ". Əvəzlik əsas nitq hissələrinin yerində işlənir.");
    }) },
    // 2. nömrə kombinasiyası: verilmiş növ əvəzliklər
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["S", "Q", "T"]), k = 1 + R(3), mine = sample(SOZ[t], k), rest = sample(EVP.filter(x => x.t !== t), 5 - k);
      const five = shuffle([...mine.map(w => ({ w, t })), ...rest]);
      const right = five.map((x, i) => x.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı sözlər " + NAME[t] + "dir?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". " + x.w))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.w + " — " + TIP[x.t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 3. cümlələrin birində verilmiş növ əvəzlik yoxdur
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(KEYS);
      const four = sample(NO_O.filter(x => hasT(x, t)), 4), odd = pick(NO_O.filter(x => !hasT(x, t)));
      return AEq("Cümlələrin birində " + NAME[t] + " yoxdur:", plain(odd), four.map(plain),
        "“" + plain(odd) + "” — burada " + NAME[t] + " yoxdur (" + listP(odd) + "). Digər cümlələrdə: " + four.map(s => prons(s).filter(x => x.t === t).map(x => x.w).join(", ")).join("; ") + ".");
    }) },
    // 4. fərqləndirilmiş söz hansı növ əvəzlikdir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const s = pick(NO_O), i = pick(idxs(s, x => x.t)), t = s[i].t;
      return AEq(h("span", {}, "Cümlədə fərqləndirilmiş söz hansı əvəzlikdir?", line(markSent(s, i))), NAME[t], KEYS.filter(k => k !== t).map(k => NAME[k]), "“" + s[i].w + "” — " + WHY[t] + ".");
    }) },
    // 5. şəxs əvəzliyi: şəxs və kəmiyyət
    { tip: "qapali", gen: () => Oyun.again(() => {
      const k = R(6), right = SXW[k], wrong = sample(SXW.filter((_, j) => j !== k), 4);
      return AEq("Hansı şəxs əvəzliyi " + SXL[k] + "ni bildirir?", right, wrong, "“" + right + "” — " + SXL[k] + ". Cədvəl: mən, sən, o (tək); biz, siz, onlar (cəm).");
    }) },
    // 6. vergül düzgün
    { tip: "qapali", gen: () => Oyun.again(() => {
      const r = pick(VG), others = sample(VG.filter(x => x !== r), 4);
      return AEq("Cümlələrin hansında vergül düzgün işlədilib (və ya düzgün buraxılıb)?", r.ok, others.map(x => x.bad), "“" + r.ok + "” — " + whyOk(r) + ". Qalanları: " + others.map(x => whyBad(x)).join("; ") + ".");
    }) },
    // 7. vergül səhv
    { tip: "qapali", gen: () => Oyun.again(() => {
      const r = pick(VG), others = sample(VG.filter(x => x !== r), 4);
      return AEq("Cümlələrin birində vergül qaydası pozulub:", r.bad, others.map(x => x.ok), "“" + r.bad + "” — " + whyBad(r) + ". Qalan cümlələrdə vergül düzgündür.");
    }) },
    // 8. nömrə kombinasiyası: vergül qoyulmalı cümlələr
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(VG, 5), right = five.map((x, i) => x.k === "M" ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə «o» və ya «bu» sözündən sonra vergül qoyulmalıdır?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". " + SHOWN(x)))), ...o, show: o.choices[o.correct],
        solution: five.map((x, i) => (i + 1) + ") " + x.ok + " — " + whyOk(x)).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 9. nömrə kombinasiyası: təyini əvəzlik olan cümlələr
    { tip: "qapali", gen: () => Oyun.again(() => {
      const five = sample(BANK, 5), right = five.map((s, i) => hasT(s, "T") ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      return { text: h("span", {}, "Hansı cümlələrdə təyini əvəzlik işlənib?", ...five.map((s, i) => h("span", { style: "display:block" }, (i + 1) + ". " + plain(s)))), ...o, show: o.choices[o.correct],
        solution: five.map((s, i) => (i + 1) + ") " + plain(s) + " — " + listP(s)).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 10. fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("Əvəzliklə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Əvəzliklə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  window.__levels = levels;
  window.__bank = { BANK, SOZ, NON, YER, SX, VG, FIKIR_DUZ, FIKIR_SEHV };

  // ======== müstəqil yoxlama siyahısı (Codex): bankdakı hər fakt ========
  const Y = []; const addY = (id, sual, cavab) => Y.push({ id, sual, cavab });
  const ALLP = ["mən", "sən", "biz", "siz", "onlar", "bu", "kim", "nə", "hansı", "neçə", "kimsə", "hamı", "biri", "birisi", "heç kim", "heç nə", "heç kəs", "öz", "hər", "bütün", "filan"];
  const TYP_OF = {}; KEYS.forEach(t => SOZ[t].forEach(w => { TYP_OF[w] = t; })); ["nə", "neçə"].forEach(w => { TYP_OF[w] = "U"; }); ["biri", "birisi"].forEach(w => { TYP_OF[w] = "Q"; });
  ALLP.forEach((w, i) => addY("soz" + (i + 1), "«" + w + "» sözü (cümlədən kənarda) hansı növ əvəzlikdir? (" + TIPLER + ")", TIP[TYP_OF[w]]));
  SXW.forEach((w, i) => addY("sx" + (i + 1), "«" + w + "» şəxs əvəzliyi hansı şəxsin hansı kəmiyyətidir? (I şəxsin təki, I şəxsin cəmi, II şəxsin təki, II şəxsin cəmi, III şəxsin təki, III şəxsin cəmi)", SXL[SXW.indexOf(w)]));
  BANK.forEach((s, i) => {
    prons(s).forEach((x, j) => addY("cum" + (i + 1) + "_" + (j + 1), "«" + plain(s) + "» cümləsində «" + x.w + "» sözü hansı növ əvəzlikdir? (" + TIPLER + ")", TIP[x.t]));
    addY("say" + (i + 1), "«" + plain(s) + "» cümləsində neçə əvəzlik var? («heç kim», «heç nə» kimi iki sözlü ifadələr bir əvəzlik sayılır; rəqəmlə yaz)", String(prons(s).length));
  });
  YER.forEach((o, i) => addY("yer" + (i + 1), "«" + o.s.replace(/\*/g, "") + "» cümləsində «" + o.w + "» əvəzliyi hansı nitq hissəsinin yerində işlənib? (isim, sifət, say)", o.t));
  SX.forEach((o, i) => addY("sxc" + (i + 1), "«" + o.s.replace(/\*/g, "") + "» cümləsində «" + o.w + "» şəxs əvəzliyi hansı şəxsin hansı kəmiyyətidir? (I şəxsin təki, I şəxsin cəmi, II şəxsin təki, II şəxsin cəmi, III şəxsin təki, III şəxsin cəmi)", SXL[o.k]));
  VG.forEach((x, i) => {
    addY("vgf" + (i + 1), "«" + x.ok + "» cümləsində «o» (və ya «bu») hansı vəzifədədir? (mübtəda, təyin)", x.k === "T" ? "təyin" : "mübtəda");
    addY("vgv" + (i + 1), "«" + SHOWN(x) + "» cümləsində «o» (və ya «bu») " + (x.k === "T" ? "təyin" : "mübtəda") + " vəzifəsindədir. Ondan sonra vergül qoyulmalıdırmı? (qoyulmalıdır, qoyulmamalıdır)", x.k === "M" ? "qoyulmalıdır" : "qoyulmamalıdır");
    addY("vgb" + (i + 1), "«" + x.bad + "» cümləsində «o» (və ya «bu») " + (x.k === "T" ? "təyin" : "mübtəda") + " vəzifəsindədir. Vergül düzgün qoyulubmu? (düzgün, səhv)", "səhv");
  });
  NON.forEach((o, i) => addY("non" + (i + 1), "«" + o[0] + "» sözü əvəzlikdirmi? (bəli, xeyr)", "xeyr"));
  FIKIR_DUZ.forEach((x, i) => addY("dogru" + (i + 1), "Fikir: «" + x + "» (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach((x, i) => addY("sehv" + (i + 1), "Fikir: «" + x + "» (doğru, səhv)", "səhv"));
  window.__yoxla = Y;

  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-evezlik", title: "Əvəzlik", fenn: "azdili", link: "dersler/az-evezlik.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Əvəzlik əvəz etdiyi sözün sualına cavab verir: kim? nə? hansı? neçə?",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tap", "yer", "sexs", "sexs", "novu", "novu", "bolgu", "vergul", "vergul2", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-evezlik.html")) b.push("dersler/az-evezlik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
