// Azərbaycan dili · Feilin təsriflənməyən formaları (məsdər, feili sifət, feili bağlama) — oyun, sınaq və imtahan formatlı sınaq.
// Mənbə: "Azərbaycan dili" 5-ci sinif, 2-ci hissə (2024), s. 62–63 (təsriflənməyən feillər; məsdər), s. 68–69 (feili sifət, feili sifət və
// feildən düzəlmiş sifət, feili bağlama), s. 80 (isimləşmiş feili sifət), s. 48 (keçmiş zaman -ıb⁴); 7-ci sinif, 2-ci hissə, s. 37 (köməkçi:
// məsdərin mənsubiyyət şəkilçisi qəbul etməsi). Suallar cümlə bankından qurulur; bankdakı hər feil forması etiketlənib. Bankda qəsdən olmayanlar:
// məsdər tərkibi və feili sifət tərkibi (feili birləşmələr — 16-cı mövzu), -ma² şəkilçisinin başqa funksiyaları, -ar²/-ası² feili sifətləri,
// söz sonunda "idi/imiş/isə", mübahisəli -an²/-ıb⁴ halları.
(function () {
  const h = Oyun.h;
  // etiketlər: M məsdər, S feili sifət, B feili bağlama, T təsriflənən feil, D feildən düzələn (düzəltmə) sifət, N başqa söz
  const LAB = { M: "məsdər", S: "feili sifət", B: "feili bağlama", T: "təsriflənən feil", D: "feildən düzələn sifət", N: "feil formalarından deyil" };
  const FORM4 = ["M", "S", "B", "T"];
  const REASON = {
    M: "hərəkətin adını bildirir (-maq²), şəxsə görə dəyişmir",
    S: "ismə aiddir, hansı? sualına cavab verir və hərəkət bildirir; şəxsə görə dəyişmir",
    B: "hərəkət bildirən sözlə bağlıdır, onun tərzini, zamanını və ya səbəbini bildirir; şəxsə görə dəyişmir",
    T: "cümlənin xəbəridir; hərəkətin zamanını və şəxsini bildirir, şəxsə görə dəyişir",
    D: "feildən düzəlib, amma inkarlıq şəkilçisi qəbul etmir (düzəltmə sifət)",
  };
  const HAL = { yo: "yönlük", yi: "yiyəlik", te: "təsirlik", ci: "çıxışlıq" };

  // ---- cümlə bankı: "söz:ETİKET"; "_" iki sözdən ibarət bir vahiddir; etiketsiz söz — başqa söz (N); etiketsiz işarə — durğu.
  // Etiketdə kiçik "s" — isimləşmiş feili sifət (5-ci sinif, s. 80: feili sifət olaraq qalır); ".yo" kimi son hissə — məsdərin halı.
  const BANK = [
    // dərslikdən (5b s. 62, 68, 69, 80)
    "Mən oxuyub:B anladım:T .",
    "Biz oxuyub:B anladıq:T .",
    "Uçan:S quşların səsi bir-birinə qarışmışdı:T .",
    "Fit çalınanda:B yarışan:S idmançılar sıraya düzüldülər:T .",
    "Dünən baxdığım:S film məni çox sevindirdi:T .",
    "Yetişmiş:S meyvələri dərdim:T .",
    "Gedəndə:B dostu ilə qarşılaşdı:T .",
    "Mətni dinləyərkən:B açar sözləri qeyd_edin:T .",
    "Öyrənmək:M üçün heç vaxt gec olmaz:T .",
    "Uzaq səmada ulduzlar parıldamağa:M.yo başlayırdı:T .",
    "Açıq havada gəzməyin:M.yi faydası çoxdur .",
    "Sinif nümayəndəsi seçilməyim:M məni sevindirmişdi:T .",
    "Mağazada kitab seçməyimiz:M bizi yordu:T .",
    "Sizin iştirak_etməyiniz:M məni çox sevindirdi:T .",
    "Lalə düşünmədən:B cavab_verdi:T .",
    "Axşam düşəndə:B hava sərinləşir:T .",
    "Həkim gülümsəyərək:B soruşdu:T .",
    "Uşaq qorxub:B ağladı:T .",
    "Ana övladının uğurlarını gördükcə:B fərəhlənirdi:T .",
    "İrəli getdikcə:B daha gözəl mənzərələr gördük:T .",
    "O dayanmadan:B yol gedirdi:T .",
    "Elxan ona rişxəndlə gülüb:B dedi:T .",
    "Tahir mağazadan çıxanda:B Cəmilə rast_gəldi:T .",
    "Təyyarə səmada görünəndə:B hamı çox sevindi:T .",
    "Bildiyin:S məsələni mənə də danış:T .",
    "Bilmədiyin:S məsələni müəllimdən soruş:T .",
    "Pambıqla yüklənmiş:S maşınlar sürətlə hərəkət_edirdi:T .",
    "O içməli:S sudan bir stəkan mənə ver:T .",
    "Dünən gördüyün:S hadisəni bizə də danış:T .",
    "Hələ görüləsi:S işimiz çoxdur .",
    "Gec gələn:S qonaq öz kisəsindən yeyər:T .",
    "Atılan:S ox geri qayıtmaz:T .",
    "Zəhmət_çəkən:S adam rahatlığın qədrini bilməz:T .",
    "Sürüdən ayrılan:S qoyunu qurd yeyər:T .",
    "İmzalanacaq:S sənədlərin sayı çoxdur .",
    "Yaxın günlərdə sülh müqaviləsi imzalanacaq:T .",
    "Gediləcək:S yol uzundur .",
    "İşləməyən:s dişləməz:T .",
    "Tələsən:s təndirə düşər:T .",
    "Çox gəzən:s çox bilər:T .",
    "Cəfa_çəkməyən:s səfa_görməz:T .",
    // məsdər (özümüzünkü, dərslikdəki formalarla)
    "Uşaqlar yatmaq:M istəmədilər:T .",
    "Biz gəzməyə:M.yo çıxdıq:T .",
    "Bağda işləməkdən:M.ci yorulmadım:T .",
    "Qardaşım şahmat oynamağı:M.te öyrəndi:T .",
    "Hər gün səhər yeriməyi:M.te sevirəm:T .",
    "Yaxşı yazmaq:M üçün çox oxumaq:M lazımdır .",
    "Bu əsəri oxumaq:M çox maraqlıdır .",
    "Kitab oxumağı:M.te sevənlər:s çoxdur .",
    // feili sifət
    "Qaçan:S oğlan yıxıldı:T .",
    "Ağlayan:S körpəni anası qucağına aldı:T .",
    "Solmuş:S gül vazada qalmışdı:T .",
    "Qorxmuş:S uşaq anasına sığındı:T .",
    // feildən düzələn sifət (düzəltmə sifət)
    "Ağlağan:D qız dərsə gecikdi:T .",
    "Solğun:D çiçək küləkdə əyildi:T .",
    "Qorxaq:D insan çətinlikdən qaçır:T .",
    "Qaçağan:D at sürücünü yıxdı:T .",
    "Çalışqan:D şagird tapşırığı vaxtında yazdı:T .",
    "Unutqan:D adam açarını evdə qoydu:T .",
    "Ağlağan:D qız ağlayan:S körpəni sakitləşdirdi:T .",
    "Solğun:D çiçək solmuş:S gülün yanında qaldı:T .",
    // feili bağlama
    "Evdən çıxanda:B yağış yağırdı:T .",
    "Qızlar şən-şən gülərək:B evə qayıtdılar:T .",
    "Atam işdən gəlib:B dincəldi:T .",
    "Şagirdlər dərsi oxuyub:B getdilər:T .",
    "Uşaqlar tapşırığı bitirib:B evə getdilər:T .",
    "Biz qapını açıb:B içəri keçdik:T .",
    "Qonaqlar ev yiyəsi ilə salamlaşıb:B içəri keçdilər:T .",
    // -ıb⁴ keçmiş zamanda (xəbər)
    "Qız kitabı götürüb:B otağa getdi:T .",
    "Biz xəritəyə baxıb:B yolu tapdıq:T .",
    "Anam çörək bişirib:B süfrəyə qoydu:T .",
    "Bahar gəlib:T .",
    "Çay donub:T .",
    "Şagirdlər çıxıb:T .",
    "Qonaqlar gəlib:T .",
    "Uşaq çox qorxub:T .",
    "Atam işdən gəlib:T .",
    "Hamı artıq toplaşıb:T .",
    "Qardaşım yatıb:T .",
    "Hava çox soyuyub:T .",
  ].map(s => s.split(" ").map(t => {
    const m = t.match(/^(.+):([A-Za-z])(?:\.([a-z]+))?$/);
    if (m) { const c = m[2]; return { w: m[1].replace(/_/g, " "), t: c === "s" ? "S" : c, ...(c === "s" ? { m: "~" } : {}), ...(m[3] ? { hal: HAL[m[3]] } : {}) }; }
    return /\p{L}/u.test(t) ? { w: t.replace(/_/g, " "), t: "N" } : { w: t, t: null };
  }));
  const isF = x => x.t && "MSBTD".includes(x.t); // etiketli feil forması (və ya düzəltmə sifət)
  const words = s => s.filter(x => x.t);
  const plain = s => s.map((x, i) => (i && x.t ? " " : "") + x.w).join("");
  const has = (s, t) => s.some(x => x.t === t);
  // sözü qalın və altdan xətli göstərən cümlə
  const hl = (s, k) => h("span", {}, ...s.map((x, i) => [i && x.t ? " " : "", i === k ? h("u", {}, h("b", {}, x.w)) : x.w]));
  const line = (...k) => h("span", { style: "display:block;margin-top:6px" }, ...k);
  const mark = p => { const q = p.split("*"); return h("span", {}, q[0], h("u", {}, h("b", {}, q[1])), q[2]); };
  const isIb = x => x.t && "BT".includes(x.t) && /[ıiuü]b$/.test(x.w);
  const idxOf = (s, ok) => s.map((x, i) => (x.t && ok(x) ? i : -1)).filter(i => i >= 0);
  const SING = []; // fərqləndirilmiş tək söz: { s, i, t }
  BANK.forEach(s => s.forEach((x, i) => { if (isF(x)) SING.push({ s, i, t: x.t }); }));

  // ---- tək sözlər (cümlədən kənarda da forması birmənalıdır; -ıb⁴ və -anda² qəsdən yoxdur)
  const SOZ = {
    M: ["oxumaq", "yazmaq", "bilmək", "gülmək", "baxmaq", "gəzmək", "öyrənmək", "çalışmaq", "yatmaq", "qaçmaq", "danışmaq", "düşünmək"],
    S: ["yazan", "oxuyan", "qaçan", "gülən", "ağlayan", "uçan", "bildiyin", "gördüyüm", "atılan", "gələn"],
    B: ["gülümsəyərək", "oxuyaraq", "yazaraq", "gördükcə", "yazdıqca", "düşünmədən", "dayanmadan", "görüncə", "dinləyərkən"],
    T: ["oxudu", "yazır", "gedirik", "başladı", "gələrsiniz", "bilirəm", "baxdılar", "gəldin", "görəcəyik", "danışdıq", "qaçırsan", "yazdım"],
  };
  const NONFIN = [...SOZ.M, ...SOZ.S, ...SOZ.B];

  // ---- feili sifət ↔ feildən düzələn sifət (5b s. 68–69: solmuş gül, solğun çiçək, qorxaq insan, qorxmuş uşaq, ağlağan qız, ağlayan körpə, qaçan/qaçağan)
  const PH_S = [ // [birləşmə, söz, inkarı]
    ["solmuş gül", "solmuş", "solmamış gül"], ["qorxmuş uşaq", "qorxmuş", "qorxmamış uşaq"], ["ağlayan körpə", "ağlayan", "ağlamayan körpə"],
    ["qaçan oğlan", "qaçan", "qaçmayan oğlan"], ["yetişmiş meyvə", "yetişmiş", "yetişməmiş meyvə"], ["uçan quş", "uçan", "uçmayan quş"],
    ["yazan şagird", "yazan", "yazmayan şagird"], ["bacardığım iş", "bacardığım", "bacarmadığım iş"],
  ];
  const PH_D = ["solğun çiçək", "qorxaq insan", "ağlağan qız", "qaçağan at", "çalışqan şagird", "unutqan adam"];
  const wm = (p, k) => { const q = p.split(" "); return q.map((x, i) => i === k ? "*" + x + "*" : x).join(" "); }; // 1-ci söz fərqləndirilir

  // ---- feili bağlamanın mənası (5b s. 69: zaman — nə vaxt?, tərz — necə?, səbəb — niyə?)
  const BM = { // cümlə, fərqləndirilmiş söz
    Z: [["Ana övladının uğurlarını *gördükcə* fərəhlənirdi.", "gördükcə"], ["Axşam *düşəndə* hava sərinləşir.", "düşəndə"], ["Təyyarə səmada *görünəndə* hamı çox sevindi.", "görünəndə"],
      ["İrəli *getdikcə* daha gözəl mənzərələr gördük.", "getdikcə"], ["Tahir mağazadan *çıxanda* Cəmilə rast gəldi.", "çıxanda"], ["*Gedəndə* dostu ilə qarşılaşdı.", "Gedəndə"],
      ["Mətni *dinləyərkən* açar sözləri qeyd edin.", "dinləyərkən"],
      ["Dərs *bitəndə* şagirdlər həyətə çıxdılar.", "bitəndə"], ["Qapını *açanda* içəridən səs gəldi.", "açanda"], ["Yağış *başlayanda* biz evə çatmışdıq.", "başlayanda"]],
    T: [["Həkim *gülümsəyərək* soruşdu.", "gülümsəyərək"], ["Lalə *düşünmədən* cavab verdi.", "düşünmədən"], ["Qızlar şən-şən *gülərək* evə qayıtdılar.", "gülərək"],
      ["Quş qanad *çalaraq* göyə qalxdı.", "çalaraq"], ["Qız başını *əyərək* salam verdi.", "əyərək"]],
    S: [["Uşaq *qorxub* ağladı.", "qorxub"]],
  };
  const BMAD = { Z: "zaman (nə vaxt?)", T: "tərz (necə?)", S: "səbəb (niyə?)" };
  const BMWHY = { Z: "zamanı bildirir: nə vaxt? sualına cavab verir", T: "tərzi bildirir: necə? sualına cavab verir", S: "səbəbi bildirir: niyə? sualına cavab verir" };

  // ---- məsdərin və başqa formaların xüsusiyyətləri: [forma, xüsusiyyət, nitq hissəsi] (5b s. 62, 63, 68, 69; 7b s. 37)
  const XS = [
    ["məsdər", "hərəkət bildirir (baxmaq, gülmək)", "feil"], ["məsdər", "təsdiq və inkarda olur (bilmək – bilməmək)", "feil"],
    ["məsdər", "hallanır (oxumağa, oxumağı)", "isim"], ["məsdər", "mənsubiyyətə görə dəyişir (oxumağım)", "isim"],
    ["feili sifət", "hərəkət bildirir (yazan şagird)", "feil"], ["feili sifət", "təsdiq və inkarda olur (bildiyin məsələ – bilmədiyin məsələ)", "feil"],
    ["feili sifət", "hansı? sualına cavab verir (sınmış fincan)", "sifət"],
    ["feili bağlama", "hərəkət bildirir (yazanda, güləndə)", "feil"], ["feili bağlama", "təsdiq və inkarda olur (biləndə – bilməyəndə)", "feil"],
    ["feili bağlama", "hərəkət bildirən sözlə bağlı olur, onun tərzini, zamanını, səbəbini bildirir", "zərf"],
    ["feili bağlama", "necə? nə vaxt? niyə? suallarına cavab verir", "zərf"],
  ];
  const XSAD = { M: "məsdər", S: "feili sifət", B: "feili bağlama" };

  // ---- köməkçi
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
  const sol1 = (s, k) => "“" + s[k].w + "” — " + LAB[s[k].t] + " (" + REASON[s[k].t] + ")";
  const feSol = s => s.filter(isF).map(x => x.w + " — " + LAB[x.t]).join("; ");
  const dat = { M: "məsdərlərə", S: "feili sifətlərə", B: "feili bağlamalara", T: "təsriflənən feillərə" };
  const pl = { M: "Məsdərlər", S: "Feili sifətlər", B: "Feili bağlamalar", T: "Təsriflənən feillər" };

  // ======== oyun səviyyələri ========
  const levels = [
    { id: "tapf", ad: "Cümlədə tap", izah: "Cümlədə istənilən feil formasına aid bütün sözlərə toxun. Yadda saxla: təsriflənməyən feillər şəxsə görə dəyişmir — məsdər, feili sifət, feili bağlama.",
      gen() {
        const k = pick(["M", "S", "B", "T", "TL", "S", "B"]);
        const ok = x => k === "TL" ? "MSB".includes(x.t) : x.t === k;
        const s = pick(BANK.filter(x => x.some(w => w.t && ok(w))));
        const duz = idxOf(s, ok), tx = k === "TL" ? "Cümlədə şəxsə görə dəyişməyən feil formalarının (məsdər, feili sifət, feili bağlama) hamısına toxun." : "Cümlədəki bütün " + dat[k] + " toxun.";
        return { text: tx, sec: { soz: s.map(x => x.w), duz }, show: duz.map(i => s[i].w).join(", "),
          solution: duz.map(i => s[i].w + " — " + LAB[s[i].t]).join("; ") + ". " + (s.some(x => x.t === "D" || (x.t === "T" && k !== "T")) ? "Qalan feil sözləri: " + s.filter(x => isF(x) && !ok(x)).map(x => x.w + " — " + LAB[x.t]).join("; ") + "." : "") };
      } },
    { id: "forma", ad: "Formanı müəyyən et", izah: "Məsdər hərəkətin adını bildirir, feili sifət ismə aiddir (hansı?), feili bağlama feilə aiddir (necə? nə vaxt? niyə?), təsriflənən feil xəbərdir. Feildən düzələn sifət inkarlıq şəkilçisini qəbul etmir.",
      gen() {
        const s = pick(BANK.filter(x => x.some(isF))), k = pick(idxOf(s, isF)), opts = ["M", "S", "B", "T", "D"].map(t => LAB[t]);
        return { text: h("span", {}, "Fərqləndirilmiş söz hansı formadadır?", line(hl(s, k))), choices: opts, correct: opts.indexOf(LAB[s[k].t]), show: LAB[s[k].t], solution: sol1(s, k) + "." };
      } },
    { id: "bolgu", ad: "Bölgü: feil formaları", izah: "Cümlədəki sözləri qruplara ayır. Hər feil forması üçün sual ver və şəxsə görə dəyişib-dəyişmədiyinə bax.",
      gen() {
        const s = pick(BANK.filter(x => !has(x, "D") && x.filter(w => FORM4.includes(w.t)).length >= 2 && new Set(x.filter(w => FORM4.includes(w.t)).map(w => w.t)).size >= 2));
        const f = s.filter(w => FORM4.includes(w.t)), n = s.filter(w => w.t === "N");
        let ws = [...f, ...sample(n, Math.min(n.length, Math.max(2, 7 - f.length)))].sort((a, b) => s.indexOf(a) - s.indexOf(b));
        const qrup = ["məsdər", "feili sifət", "feili bağlama", "təsriflənən feil", "feil formalarından deyil"], ix = { M: 0, S: 1, B: 2, T: 3, N: 4 };
        return { text: "«" + plain(s) + "» — sözləri qruplara ayır.", bol: { soz: ws.map(w => w.w), qrup, duz: ws.map(w => ix[w.t]) },
          show: ws.map(w => w.w + " — " + qrup[ix[w.t]]).join("; "), solution: ws.map(w => w.w + " — " + (w.t === "N" ? "feil forması deyil" : LAB[w.t])).join("; ") + "." };
      } },
    { id: "xusus", minVariety: 10, ad: "Feilə, ismə, sifətə, zərfə aid xüsusiyyət", izah: "Hər təsriflənməyən forma iki nitq hissəsinin xüsusiyyətlərini daşıyır: məsdər — feilin və ismin; feili sifət — feilin və sifətin; feili bağlama — feilin və zərfin.",
      gen() {
        const x = pick(XS), opts = ["feil", "isim", "sifət", "zərf"];
        return { text: "“" + x[0] + "” üçün göstərilən xüsusiyyət hansı nitq hissəsinin xüsusiyyətidir? " + x[1] + ".", choices: opts, correct: opts.indexOf(x[2]), show: x[2],
          solution: "“" + x[1].replace(/ \(.*\)$/, "") + "” — " + x[2] + " xüsusiyyətidir. " + x[0][0].toUpperCase() + x[0].slice(1) + " iki nitq hissəsinin xüsusiyyətlərini daşıyır: feilin və " + (x[0] === "məsdər" ? "ismin" : x[0] === "feili sifət" ? "sifətin" : "zərfin") + "." };
      } },
    { id: "ferq", ad: "Feili sifət, yoxsa düzəltmə sifət", izah: "Feili sifət inkarda da işlənir (qaçan – qaçmayan), feildən düzələn sifət inkarlıq şəkilçisini qəbul etmir (qaçağan).",
      gen() {
        if (Math.random() < .5) {
          const isS = Math.random() < .5, p = isS ? pick(PH_S) : null, d = isS ? null : pick(PH_D), w = isS ? p[0] : d;
          const opts = ["feili sifət", "feildən düzələn sifət", "məsdər", "feili bağlama"], ans = isS ? "feili sifət" : "feildən düzələn sifət";
          return { text: h("span", {}, "Fərqləndirilmiş söz hansıdır?", line(mark(wm(w, 0)))), choices: opts, correct: opts.indexOf(ans), show: ans,
            solution: isS ? "“" + p[1] + "” — feili sifətdir: inkarda da işlənir (" + p[2] + ")." : "“" + w.split(" ")[0] + "” — feildən düzələn sifətdir: inkarlıq şəkilçisi qəbul etmir. Feili sifət olsaydı, inkarda da işlənərdi." };
        }
        const wantS = Math.random() < .5, four = wantS ? [[pick(PH_S)[0]], ...sample(PH_D, 3).map(x => [x])] : [[pick(PH_D)], ...sample(PH_S, 3).map(x => [x[0]])];
        const right = four[0][0], arr = shuffle(four.map(x => x[0])), ca = arr.indexOf(right);
        return { text: wantS ? "Hansı söz birləşməsində feili sifət işlənib?" : "Hansı söz birləşməsində feildən düzələn sifət işlənib?", choices: arr, correct: ca, show: right,
          solution: wantS ? "“" + right + "” — feili sifət (inkarda da işlənir). Qalanları feildən düzələn sifətlərdir: inkarlıq şəkilçisi qəbul etmirlər." : "“" + right + "” — feildən düzələn sifət: inkarlıq şəkilçisi qəbul etmir. Qalanları feili sifətdir: inkarda da işlənirlər." };
      } },
    { id: "bagma", minVariety: 12, ad: "Feili bağlamanın mənası", izah: "Feili bağlama necə? nə vaxt? niyə? suallarına cavab verir: tərzi, zamanı, səbəbi bildirir.",
      gen() {
        const c = pick(["Z", "Z", "T", "T", "S"]), [s, w] = pick(BM[c]), opts = ["zaman (nə vaxt?)", "tərz (necə?)", "səbəb (niyə?)"];
        return { text: h("span", {}, "Fərqləndirilmiş feili bağlama hansı mənanı bildirir?", line(mark(s))), choices: opts, correct: opts.indexOf(BMAD[c]), show: BMAD[c],
          solution: "“" + w + "” — feili bağlamadır, " + BMWHY[c] + "." };
      } },
    { id: "ib", ad: "-ıb⁴: bağlama, yoxsa keçmiş zaman", izah: "Başqa hərəkəti izah edib şəxsə görə dəyişmirsə — feili bağlama (oxuyub anladım). Cümlənin xəbəri olan -ıb⁴ keçmiş zaman şəkilçisidir (gəlib — gəlibsən).",
      gen() {
        const s = pick(BANK.filter(x => x.some(isIb))), k = pick(idxOf(s, isIb)), opts = ["M", "S", "B", "T"].map(t => LAB[t]);
        return { text: h("span", {}, "Fərqləndirilmiş söz hansı formadadır?", line(hl(s, k))), choices: opts, correct: opts.indexOf(LAB[s[k].t]), show: LAB[s[k].t],
          solution: s[k].t === "B" ? "“" + s[k].w + "” — feili bağlama: başqa hərəkəti izah edir (tərz, zaman, səbəb), şəxsə görə dəyişmir."
            : "“" + s[k].w + "” — təsriflənən feil: cümlənin xəbəridir, keçmiş zamanı bildirir (-ıb⁴), şəxsə görə dəyişə bilir." };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Şagird cümlədə üç sözün formasını yazıb. Biri səhvdir — hansı?",
      gen() {
        const s = pick(BANK.filter(x => !has(x, "D") && x.filter(w => FORM4.includes(w.t)).length >= 2 && words(x).length >= 3));
        const f = s.filter(w => FORM4.includes(w.t)), n = s.filter(w => w.t === "N");
        const fk = f.length >= 3 ? sample(f, 3) : [...f, ...sample(n, 3 - f.length)];
        const ws = fk.sort((a, b) => s.indexOf(a) - s.indexOf(b)), k = R(3);
        const lab = ws.map((w, j) => j === k ? pick(FORM4.filter(t => t !== w.t).map(t => LAB[t])) : LAB[w.t]);
        const ord = ["1-ci", "2-ci", "3-cü"];
        return { text: "«" + plain(s) + "» — şagirdin təhlili: " + ws.map((w, j) => (j + 1) + ") " + w.w + " — " + lab[j]).join("; ") + ". Hansı bənddə səhv var?",
          choices: ord.map(x => x + " bənd"), correct: k, show: ord[k] + " bənd",
          solution: "“" + ws[k].w + "” — " + lab[k] + " deyil, " + (ws[k].t === "N" ? "feil forması deyil" : LAB[ws[k].t]) + ". Digər iki bənd düzdür." };
      } },
  ];

  // ======== imtahan formatlı sınaq: 10 qapalı (A–E), DİM-in dil qaydaları bloku kimi ========
  const AEq = (text, right, wrong, solution) => { const o = Oyun.ae(right, wrong, x => x); return o && { text, ...o, show: o.choices[o.correct], solution }; };
  const FIKIR_DUZ = [
    "Şəxsə görə dəyişməyən feillərə təsriflənməyən feillər deyilir.",
    "Məsdər, feili sifət və feili bağlama təsriflənməyən feil formalarıdır.",
    "Təsriflənməyən feillər başqa nitq hissələrinin də qrammatik xüsusiyyətlərinə malik olur.",
    "Məsdər hərəkətin adını bildirir.",
    "Lüğətlərdə feillər məsdər formasında verilir.",
    "Məsdər həm feilin, həm də ismin xüsusiyyətlərini daşıyır.",
    "Məsdər hallanır və mənsubiyyətə görə dəyişir.",
    "Məsdər təsdiqdə və inkarda ola bilir.",
    "Feili sifət həm feilin, həm də sifətin xüsusiyyətlərini daşıyır.",
    "Feili sifət, əsasən, hansı? sualına cavab verir.",
    "Feili sifət inkarda da işlənir.",
    "Feili bağlama həm feilin, həm də zərfin xüsusiyyətlərini daşıyır.",
    "Feili bağlama hərəkət bildirən sözlə bağlı olur, onun tərzini, zamanını, səbəbini bildirir.",
    "Feili bağlama necə? nə vaxt? niyə? suallarına cavab verir.",
    "Düzəltmə sifət inkarlıq şəkilçisini qəbul etmir.",
    "Feili sifət isimləşəndə də feili sifət olaraq qalır.",
    "Təsriflənməyən feillər çox zaman söz birləşmələri yaradır.",
  ];
  const FIKIR_SEHV = [
    "Təsriflənməyən feillər şəxsə görə dəyişir.",
    "Feili bağlama yalnız feilin xüsusiyyətlərini daşıyır.",
    "Məsdər yalnız ismin xüsusiyyətlərini daşıyır.",
    "Feili sifət inkarda işlənmir.",
    "Feili sifət, əsasən, nə vaxt? sualına cavab verir.",
    "Feili bağlama, əsasən, hansı? sualına cavab verir.",
    "Düzəltmə sifət inkarlıq şəkilçisini qəbul edir.",
    "Məsdər hallanmır.",
    "Məsdər mənsubiyyət şəkilçisi qəbul etmir.",
    "Feili bağlama isim kimi hallanır.",
    "Təsriflənməyən feillər başqa nitq hissələrinin xüsusiyyətlərinə malik deyil.",
    "Lüğətlərdə feillər feili bağlama formasında verilir.",
    "Feili sifət şəxsə görə dəyişən feil formasıdır.",
    "Feili bağlama zərfin deyil, sifətin xüsusiyyətlərini daşıyır.",
  ];
  // söz haqqında fikirlər: [söz, doğru fikirlər, səhv fikirlər] (5-ci sinif, 2-ci hissə, s. 62–63, 68–69, 80)
  const PROFIL = [
    ["“oxumağa” sözü", ["məsdərdir", "hərəkətin adını bildirir", "yönlük haldadır", "isim kimi hallanıb", "təsriflənməyən feil formasıdır"], ["feili bağlamadır", "təsriflənən feildir", "yiyəlik haldadır", "hansı? sualına cavab verir", "şəxsə görə dəyişən feildir"]],
    ["“gülümsəyərək” sözü", ["feili bağlamadır", "hərəkətin tərzini bildirir", "necə? sualına cavab verir", "feilin və zərfin xüsusiyyətlərini daşıyır", "təsriflənməyən feil formasıdır"], ["məsdərdir", "feili sifətdir", "sifətin xüsusiyyətlərini daşıyır", "isim kimi hallanır", "şəxsə görə dəyişir"]],
    ["“yetişmiş meyvə” birləşməsində “yetişmiş” sözü", ["feili sifətdir", "hansı? sualına cavab verir", "feilin və sifətin xüsusiyyətlərini daşıyır", "inkarda işlənə bilər (yetişməmiş)", "təsriflənməyən feil formasıdır"], ["məsdərdir", "feili bağlamadır", "feildən düzələn sifətdir", "zərfin xüsusiyyətlərini daşıyır", "şəxsə görə dəyişir"]],
    ["“ağlağan qız” birləşməsində “ağlağan” sözü", ["feildən düzələn sifətdir", "inkarlıq şəkilçisi qəbul etmir", "feili sifət deyil", "sifətdir"], ["feili sifətdir", "inkarda işlənir", "məsdərdir", "feili bağlamadır", "təsriflənən feildir"]],
    ["“Tələsən təndirə düşər” cümləsində “tələsən” sözü", ["feili sifətdir", "isimləşib", "kim? sualına cavab verir", "isimləşsə də feili sifət olaraq qalır", "təsriflənməyən feil formasıdır"], ["isimdir", "təsriflənən feildir", "məsdərdir", "feili bağlamadır", "isimləşdiyi üçün feili sifət olmaqdan çıxıb"]],
  ];
  const IMT = { fenn: "azdili", vaxt: 15, suallar: [
    // 1) formaca biri fərqlidir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [a, b] = sample(["M", "S", "B"], 2), four = sample(SOZ[a], 4), odd = pick(SOZ[b]);
      return AEq("Təsriflənməyən feil formasına görə biri fərqlidir:", odd, four, "“" + odd + "” — " + LAB[b] + ". Qalanları " + LAB[a] + " formasındadır: " + four.join(", ") + ".");
    }) },
    // 2) təsriflənən / təsriflənməyən
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) {
        const one = pick(NONFIN), four = sample(SOZ.T, 4);
        return AEq("Sözlərdən hansı təsriflənməyən feildir?", one, four, "“" + one + "” — şəxsə görə dəyişmir (təsriflənməyən feil). Qalanları şəxsə görə dəyişən, yəni təsriflənən feillərdir: " + four.join(", ") + ".");
      }
      const one = pick(SOZ.T), four = sample(NONFIN, 4);
      return AEq("Sözlərdən hansı təsriflənən feildir?", one, four, "“" + one + "” — xəbər olur, şəxsə görə dəyişir (təsriflənən feil). Qalanları şəxsə görə dəyişmir: " + four.join(", ") + ".");
    }) },
    // 3) cümlələrin birində ... yoxdur
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["M", "S", "B"]), withT = BANK.filter(x => has(x, t)), noT = BANK.filter(x => !has(x, t));
      const four = sample(withT, 4), odd = pick(noT);
      return AEq("Cümlələrin birində " + LAB[t] + " yoxdur:", plain(odd), four.map(plain),
        "“" + plain(odd) + "” — burada " + LAB[t] + " yoxdur (" + (feSol(odd) || "feil forması yoxdur") + "). Digər cümlələrdə " + LAB[t] + ": " + four.map(s => s.filter(x => x.t === t).map(x => x.w).join(", ")).join("; ") + ".");
    }) },
    // 4) nömrə kombinasiyası: fərqləndirilmiş söz hansı formadadır
    { tip: "qapali", gen: () => Oyun.again(() => {
      const t = pick(["M", "S", "B", "T"]), five = sample(SING, 5);
      if (new Set(five.map(x => BANK.indexOf(x.s))).size < 5) return null;
      const right = five.map((x, i) => x.t === t ? i + 1 : 0).filter(Boolean);
      if (!right.length || right.length > 4) return null;
      const o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı cümlələrdə fərqləndirilmiş söz " + (t === "T" ? "təsriflənən feildir" : t === "M" ? "məsdərdir" : t === "S" ? "feili sifətdir" : "feili bağlamadır") + "?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". ", hl(x.s, x.i))));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((x, i) => (i + 1) + ") " + x.s[x.i].w + " — " + LAB[x.t]).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 5) feili sifət ↔ feildən düzələn sifət
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const s = pick(PH_S), four = sample(PH_D, 4); return AEq("Söz birləşmələrinin birində feili sifət işlənib:", s[0], four, "“" + s[0] + "” — feili sifət: inkarda da işlənir (" + s[2] + "). Qalanlarında feildən düzələn sifət var: inkarlıq şəkilçisi qəbul etmirlər."); }
      const d = pick(PH_D), four = sample(PH_S, 4).map(x => x[0]); return AEq("Söz birləşmələrinin birində feildən düzələn sifət işlənib:", d, four, "“" + d + "” — feildən düzələn sifət: inkarlıq şəkilçisi qəbul etmir. Qalanlarında feili sifət var: inkarda da işlənirlər.");
    }) },
    // 6) nömrə kombinasiyası: feili sifət işlənib
    { tip: "qapali", gen: () => Oyun.again(() => {
      const ps = sample(PH_S, 3).map(x => ({ p: x[0], s: true })), pd = sample(PH_D, 2).map(x => ({ p: x, s: false })), five = shuffle([...ps, ...pd]);
      const right = five.map((x, i) => x.s ? i + 1 : 0).filter(Boolean), o = comboChoices(right); if (!o) return null;
      const txt = h("span", {}, "Hansı söz birləşmələrində feili sifət işlənib?", ...five.map((x, i) => h("span", { style: "display:block" }, (i + 1) + ". " + x.p)));
      return { text: txt, ...o, show: o.choices[o.correct], solution: five.map((x, i) => (i + 1) + ") " + x.p + " — " + (x.s ? "feili sifət (inkarda da işlənir)" : "feildən düzələn sifət (inkarlıq şəkilçisi qəbul etmir)")).join("; ") + ". Cavab: " + combo(right) + "." };
    }) },
    // 7) feili bağlamanın mənası
    { tip: "qapali", gen: () => Oyun.again(() => {
      const askZ = Math.random() < .5, right = pick(BM[askZ ? "Z" : "T"]), wrong = sample(BM[askZ ? "T" : "Z"], 4), rs = right[0].replace(/\*/g, ""), ws = wrong.map(x => x[0].replace(/\*/g, ""));
      return AEq("Cümlələrin birində feili bağlama " + (askZ ? "zamanı" : "tərzi") + " bildirir:", rs, ws, "“" + right[1] + "” — " + (askZ ? "zaman (nə vaxt?)" : "tərz (necə?)") + ". Qalan cümlələrdə feili bağlama " + (askZ ? "tərzi (necə?)" : "zamanı (nə vaxt?)") + " bildirir: " + wrong.map(x => x[1]).join(", ") + ".");
    }) },
    // 8) ümumi fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      if (Math.random() < .5) { const bad = pick(FIKIR_SEHV); return AEq("Təsriflənməyən feillərlə bağlı səhv fikri müəyyən edin.", bad, sample(FIKIR_DUZ, 4), "Səhvdir: “" + bad + "” Qalan dörd fikir dərslikdəki qaydadır."); }
      const ok = pick(FIKIR_DUZ); return AEq("Təsriflənməyən feillərlə bağlı doğru fikri müəyyən edin.", ok, sample(FIKIR_SEHV, 4), "Doğrudur: “" + ok + "” Qalan dörd fikir səhvdir.");
    }) },
    // 9) söz haqqında fikir
    { tip: "qapali", gen: () => Oyun.again(() => {
      const [w, duz, sehv] = pick(PROFIL);
      if (Math.random() < .5) { const bad = pick(sehv); return AEq(w + " ilə bağlı səhv fikri müəyyən edin.", bad, sample(duz, 4), w + ": " + duz.join("; ") + ". Səhv fikir: " + bad + "."); }
      const ok = pick(duz); return AEq(w + " ilə bağlı doğru fikri müəyyən edin.", ok, sample(sehv, 4), w + ": " + duz.join("; ") + ". Doğru fikir: " + ok + ".");
    }) },
    // 10) -ıb⁴: feili bağlama / təsriflənən feil
    { tip: "qapali", gen: () => Oyun.again(() => {
      const bag = Math.random() < .5, pool = SING.filter(x => isIb(x.s[x.i])), one = pick(pool.filter(x => x.t === (bag ? "B" : "T"))), four = sample(pool.filter(x => x.t === (bag ? "T" : "B")), 4);
      if (!one || four.length < 4) return null;
      const fm = x => plain(x.s);
      return AEq("Cümlələrin birində -ıb⁴ şəkilçili söz " + (bag ? "feili bağlamadır" : "təsriflənən feildir") + ":", fm(one), four.map(fm),
        "“" + one.s[one.i].w + "” — " + (bag ? "feili bağlama: başqa hərəkəti izah edir, şəxsə görə dəyişmir" : "təsriflənən feil: cümlənin xəbəridir, keçmiş zamanı bildirir") + ". Qalan cümlələrdə -ıb⁴ şəkilçili söz " + (bag ? "xəbərdir (keçmiş zaman)" : "feili bağlamadır") + ".");
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT, { izah: "Sual imtahandakı kimidir: beş variant (A–E), biri düzdür. Diqqətlə oxu, sonra seç." }));
  window.__imtahan = IMT;

  // ======== Codex üçün yoxlama bankı: bankdakı hər fakt öz-özlüyündə tam sual kimi ========
  const YOX = []; let yn = 0;
  const addY = (sual, cavab) => YOX.push({ id: "f" + (++yn), sual, cavab });
  const FORMS = "(məsdər, feili sifət, feili bağlama, təsriflənən feil, feildən düzələn sifət)";
  BANK.forEach(s => s.forEach(x => {
    if (!isF(x)) return;
    addY("«" + plain(s) + "» cümləsində “" + x.w + "” sözü hansı formadadır? " + FORMS + (x.m === "~" ? " (Dərslik qaydası: isimləşmiş feili sifət feili sifət olaraq qalır.)" : ""), LAB[x.t]);
    if (x.hal) addY("«" + plain(s) + "» cümləsində məsdər olan “" + x.w + "” sözü hansı haldadır? (adlıq, yiyəlik, yönlük, təsirlik, yerlik, çıxışlıq)", x.hal);
  }));
  const MENS = [["Sinif nümayəndəsi seçilməyim məni sevindirmişdi.", "seçilməyim", "1-ci şəxsin təki"], ["Mağazada kitab seçməyimiz bizi yordu.", "seçməyimiz", "1-ci şəxsin cəmi"], ["Sizin iştirak etməyiniz məni çox sevindirdi.", "iştirak etməyiniz", "2-ci şəxsin cəmi"]];
  MENS.forEach(([c, w, a]) => addY("«" + c + "» cümləsində məsdər olan “" + w + "” hansı şəxsin mənsubiyyət şəkilçisini qəbul edib? (1-ci şəxsin təki, 2-ci şəxsin təki, 3-cü şəxsin təki, 1-ci şəxsin cəmi, 2-ci şəxsin cəmi, 3-cü şəxsin cəmi)", a));
  Object.keys(SOZ).forEach(t => SOZ[t].forEach(w => addY("“" + w + "” — tək söz kimi hansı formadadır? " + "(məsdər, feili sifət, feili bağlama, təsriflənən feil)", LAB[t])));
  PH_S.forEach(p => { addY("“" + p[0] + "” birləşməsindəki “" + p[1] + "” sözü feili sifətdirmi, yoxsa feildən düzələn sifət? (feili sifət, feildən düzələn sifət)", "feili sifət"); addY("“" + p[1] + "” feili sifətinin inkar forması: “" + p[2] + "”. Bu söz inkarda işlənə bilirmi? (bəli, xeyr)", "bəli"); });
  PH_D.forEach(p => addY("“" + p + "” birləşməsindəki “" + p.split(" ")[0] + "” sözü feili sifətdirmi, yoxsa feildən düzələn sifət? (feili sifət, feildən düzələn sifət) — dərslik qaydası: düzəltmə sifət inkarlıq şəkilçisini qəbul etmir", "feildən düzələn sifət"));
  Object.keys(BM).forEach(c => BM[c].forEach(([s, w]) => addY("«" + s.replace(/\*/g, "") + "» cümləsində feili bağlama olan “" + w + "” sözü hansı mənanı bildirir? (zaman, tərz, səbəb)", { Z: "zaman", T: "tərz", S: "səbəb" }[c])));
  XS.forEach(x => addY("“" + x[0] + "” formasının «" + x[1] + "» xüsusiyyəti hansı nitq hissəsinin xüsusiyyətidir? (feil, isim, sifət, zərf)", x[2]));
  PROFIL.forEach(([w, duz, sehv]) => { duz.forEach(f => addY(w + " haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — təsriflənməyən feillər üzrə 5-ci sinif dərsliyinin qaydasına görə", "doğru")); sehv.forEach(f => addY(w + " haqqında deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv) — təsriflənməyən feillər üzrə 5-ci sinif dərsliyinin qaydasına görə", "səhv")); });
  FIKIR_DUZ.forEach(f => addY("Təsriflənməyən feillər (məsdər, feili sifət, feili bağlama) haqqında 5-ci sinif dərsliyinə görə deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "doğru"));
  FIKIR_SEHV.forEach(f => addY("Təsriflənməyən feillər (məsdər, feili sifət, feili bağlama) haqqında 5-ci sinif dərsliyinə görə deyilir: «" + f + "». Bu fikir doğrudurmu? (doğru, səhv)", "səhv"));
  window.__yoxla = YOX;

  window.__levels = levels;
  window.__bank = { BANK, SOZ, PH_S, PH_D, BM, XS, FIKIR_DUZ, FIKIR_SEHV, PROFIL, LAB };
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "az-feil-formalari", title: "Feilin təsriflənməyən formaları", fenn: "azdili", link: "dersler/az-feil-formalari.html",
      tesadufi: "nümunələr təsadüfi seçilir",
      format: "Cavab: variant seçmək, cümlədə sözə toxunmaq və ya sözləri qruplara ayırmaq. Hər feil formasına sual ver və şəxsə görə dəyişib-dəyişmədiyinə bax.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tapf", "tapf", "forma", "bolgu", "xusus", "ferq", "bagma", "ib", "sehv", "forma"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/az-feil-formalari.html")) b.push("dersler/az-feil-formalari.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
