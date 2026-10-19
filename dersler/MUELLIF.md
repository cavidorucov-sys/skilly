# Mövzu necə qurulur (Skilly müəllif bələdçisi)

Hər mövzu = iki fayl:
- `dersler/<slug>.html` — `_sablon.html`-dan: Giriş testi, Dərs 1…N (3–5), Oyun, Sınaq tabları.
- `dersler/oyun-<slug>.js` — səviyyələr (generatorlar) və `Oyun.mount(...)`.

Nümunə: `triqonometriya-1.html` + `oyun-triqonometriya.js` (o, şablondan əvvəl yazılıb — tabları öz skripti ilədir; yeni mövzular `assets/tabs.js` işlədir).

## Dil və ton
- Azərbaycan dilində, Fikrətə "sən" ilə. Sadə dil, qısa cümlələr. Kalka yox (məs. "katet", "hipotenuz", "vətər" — rəsmi terminlər; DİM proqramındakı terminləri işlət).
- Hər dərs: niyə lazımdır (həyatdan) → əsas fikir → düstur/qayda (`.fm`) → həll olunmuş nümunə(lər) (`.ex`, addım-addım) → `.life` həyatdan nümunə → `.mist` tipik səhvlər → `.sum` yadda saxla → `details.check` 3 sual (cavablar `<span class="ans">` içində gizli).
- Hər dərs 3–6 `h3` addımıdır (`<span class="st">n</span>`) — `ders.js` onları addım-addım göstərir; `.mist`, `.sum`, `details.check` son addıma ("Özünü yoxla") toplanır.
- Riyazi işarələr: `·`, `−` (minus), `²`, `√`, `≤ ≥ ≠`, `π`. Dəyişənlər `<span class="m">x</span>`. Kəsrlər `a/b`.
- Şəkillər inline SVG (`.fig` içində), rənglər `var(--ink)`, `var(--accent)`, `var(--vec)`, `var(--accent-soft)`.
- `.fm` sətirləri bölünmür (white-space: pre) — uzun düsturu sətirlərə özün böl.
- Məktəbdə heç bir tapşırıq yoxdur; dərs mətnində "məktəbdə et" yazma.

## Səviyyələr (oyun-<slug>.js)
- 5–7 səviyyə: hər dərsə 1–2 səviyyə + "Həyatdan" (mətnli məsələ) + mümkünsə "Səhvi tap" (3 addımlı həll, birində səhv; choices: 1/2/3-cü addım).
- Generator hər çağırışda **yeni** sual qaytarır (təsadüfi ədədlər), forması:
  `{ text, svg?, answer, show, solution, unit?, tol?, placeholder? }` — ədədi cavab;
  `{ text, svg?, choices: [...], correct, show, solution }` — seçim (yalnız tanıma/səhvi tap üçün; 3+ variant).
- `answer` — ədəd (kəsr cavab üçün dəyəri, məs. 0.6). `show` — Fikrətə göstərilən düz cavab ("3/5", "5√3", "−1/2", "12 m"). `show` mütləq checker-dən keçməlidir: `parse(show)` ≈ `answer`.
- Checker qəbul edir: tam/onluq (vergül də), `a/b`, `k√n`, `√n/m`, mənfi. Tolerans default: max(0.005, 0.5%). Dəqiq tam cavab üçün `tol: 0.01`.
- Cavabı ədəd olmayan şey (ifadə, interval, bərabərsizlik) — ədədə çevir: "ən kiçik tam həll", "intervalın uzunluğu", "köklərin cəmi", "x = ?" və s.
- Təxminlə keçilə bilən sual yazma. Seçim olan səviyyədə ən az 3 variant.
- `solution`: addım-addım qısa izah (1–3 cümlə), düz cavabla.
- Sabit cədvəl öyrədən səviyyədə (məs. xüsusi bucaqlar) `minVariety` qoy.
- Faylın sonunda `window.__levels = levels;` və `start()` — `Oyun.mount({ key, title, fenn, link, format, levels, oyunEl, testEl, entryEl, entry: { n: 8, min: 10 }, test: { n: 10, pass: 8, from: [...10 level id...] }, goTest, goGame, goLesson, onState, onPass })`. `oyun-triqonometriya.js`-dəki `start()`-ı nümunə götür; `entryEl: document.getElementById("giris-root")`, `goLesson: () => SkillyTab("d1")`, `goTest: () => SkillyTab("sinaq")`, `goGame: () => SkillyTab("oyun")`.
- `onPass`: `skilly-bag`-a `dersler/<slug>.html` əlavə et (triqonometriyadakı kimi).

## Yoxlama (məcburi)
```
node tools/oyun-test.js dersler/oyun-<slug>.js 300
```
Hamısı `ok` olmalıdır. `data/movzular.json`-a toxunma — onu koordinator yeniləyir.
