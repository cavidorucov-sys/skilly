# Səhv jurnalını Google Sheets-ə qoşmaq (ata üçün, ~10 dəqiqə)

Bu qurulmayana qədər jurnal işləyir, amma səhvlər yalnız Fikrətin cihazında saxlanır.

1. Google Drive-da yeni cədvəl yarat: **Skilly**.
2. **Extensions → Apps Script**. Açılan `Code.gs` faylının içini sil, bu qovluqdakı [Code.gs](Code.gs)-in mətnini yapışdır, saxla.
3. Açar yarat: soldakı dişli çarx **Project Settings → Script properties → Add script property**.
   - Property: `SKILLY_KEY`
   - Value: 20+ simvollu təsadüfi söz (məsələn, parol generatorundan). Bunu heç yerdə dərc etmə.
4. **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Google icazə istəyəcək, ona öz hesabınla icazə ver.
5. Verilən **Web app URL**-i (`https://script.google.com/macros/s/…/exec`) mənə göndər. Mən onu `data/config.json`-a yazıb saytı yeniləyəcəyəm. Bu URL açarsız işləmir, ona görə saytda açıq durması problem deyil.
6. Fikrətin telefonunda və kompüterində **bir dəfə** bu ünvanı aç (öz açarını yaz):
   `https://cavidorucov-sys.github.io/skilly/temrar.html#key=AÇAR`
   Açar cihazda yadda qalır və ünvan sətrindən silinir. Səhifədə "Google Sheets-ə qoşulub" yazısı görünəcək.

Cədvəldə **Səhvlər** vərəqi avtomatik yaranır: hər sətir bir səhvdir (tarix, fənn, mənbə, sual, cavab, növ, düzgün yol, vəziyyət, növbəti təkrar). Sətirləri əl ilə dəyişmə, `json` sütunu sayt üçündür. Qeyd əlavə etmək lazımdırsa, sağda yeni sütun aç.

Kodu dəyişəndə: **Deploy → Manage deployments → Edit → Version: New version**. Belə edəndə URL dəyişmir.
