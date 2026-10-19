# Köməkçi üçün tapşırıq qəlibi (koordinator doldurur)

Sən "Skilly" adlı statik hazırlıq portalı üçün mövzu qurursan. Şagird: Fikrət, 9-cu sinif, Azərbaycan (DİM buraxılışı aprel 2027; RFO riyaziyyat və fizika). Şagirdin gördüyü hər şey Azərbaycan dilindədir.

Əvvəlcə tam oxu:
- `D:\Private\dev\fikret\portal\dersler\MUELLIF.md` — qaydalar (dəqiq əməl et);
- `D:\Private\dev\fikret\portal\dersler\_sablon.html` — səhifə şablonu;
- `D:\Private\dev\fikret\portal\dersler\oyun-kesr-rasional-tenlikler.js` və `kesr-rasional-tenlikler.html` — şablondan qurulmuş tam nümunə (yeni mövzu belə olmalıdır);
- həndəsə mövzusu üçün əlavə: `oyun-triqonometriya.js` (təsadüfi döndərilmiş SVG üçbucaq).
Mövzunun əhatəsini rəsmi proqramdan götür (Grep ilə bölməni tap):
- buraxılış: `D:\Private\dev\fikret\research\proqramlar\dim-riyaziyyat-9-2027.txt`
- olimpiada riyaziyyatı: `...\rfo-riyaziyyat-proqram.txt` (kodlaşma xarabdır, sözləri bərpa et)
- fizika: `...\rfo-fizika-proqram.txt` (8–9-cu sinif qrupu)

Hər mövzu üçün: 3–5 dərs; 5–7 oyun səviyyəsi ("Həyatdan" və mümkünsə "Səhvi tap" daxil); `test.from` — 10 səviyyə id-si; giriş testi `{ n: 8, min: 10 }`. Cavablar ədəd olmalıdır. `data-kat`: buraxılış `math`, olimpiada riyaziyyatı `olym`, fizika `phys`; `sk-sub` və `eyebrow` müvafiq ("Buraxılış · …", "Olimpiada · …", "Fizika · …").

Fayllar: `dersler/<slug>.html`, `dersler/oyun-<slug>.js`. `D:\Private\dev\fikret\portal` qovluğundan `node tools/oyun-test.js dersler/oyun-<slug>.js 300` hər səviyyə `ok` olana qədər; `node --check`. Başqa heç bir mövcud fayla toxunma (xüsusən `data/movzular.json`, `assets/*`, başqa dərslər). git işlətmə.

Riyazi/fiziki düzgünlük həcmdən vacibdir: hər həll olunmuş nümunəni və hər generatorun cavab məntiqini yoxla; bir neçə generasiya olunmuş sualı əl ilə həll et (harness yalnız göstərilən cavabın hesablananla üst-üstə düşdüyünü yoxlayır). Fizikada vahidlər SI, `g = 10 m/s²` (başqa hal dərsdə açıq yazılmırsa). Ədəddən sonra şəkilçi riskli olanda cümləni şəkilçisiz qur.

Qısa cavab ver: yaradılan fayllar, dərs adları, səviyyə id-ləri, test nəticəsi, şübhəli yerlər.

Köməkçi skriptlərin (yoxlama və s.) adına mövzunun slug-ını əlavə et — başqa köməkçilər paralel işləyir və eyni scratchpad-i işlədir.
Cavab "hazır ədəd" şəklində olmalıdır (oyun ifadəni qəbul etmir): 12, −0,5, 3/5, 5√3, √3/2, √23 − 4. `show` da bu şəkildə olmalıdır — harness bunu yoxlayır.
Heç vaxt `taskkill /IM node.exe` və ya bütün prosesləri öldürən əmr işlətmə — paralel köməkçilərin testləri dayanır. Sonsuz dövrə şübhəsi varsa, testi `timeout` ilə işlət.
