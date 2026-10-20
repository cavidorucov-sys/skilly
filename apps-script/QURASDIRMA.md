> **20 okt 2026-dan istifadə olunmur.** Portal Firebase-ə keçdi (layihə `skilly-39ccb`, Google girişi). Bu qovluq köhnə Sheets cədvəlindəki məlumat üçün saxlanır.

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
5. Əgər icazə pəncərəsi xəta verərsə (avtomatlaşdırılmış brauzerdə olur): layihəni adi brauzerdə aç, yuxarıda funksiya kimi `setup` seç, **Run** bas, icazə ver. Sonra dərci yenidən et.
6. Verilən **Web app URL**-i (`https://script.google.com/macros/s/…/exec`) mənə göndər. Mən onu `data/config.json`-a yazıb saytı yeniləyəcəyəm. Bu URL açarsız işləmir, ona görə saytda açıq durması problem deyil.
7. Fikrətin telefonunda və kompüterində **bir dəfə** bu ünvanı aç (öz açarını yaz):
   `https://cavidorucov-sys.github.io/skilly/temrar.html#key=AÇAR`
   Açar cihazda yadda qalır və ünvan sətrindən silinir. Səhifədə "Google Sheets-ə qoşulub" yazısı görünəcək.

Cədvəldə **Səhvlər** vərəqi avtomatik yaranır: hər sətir bir səhvdir (tarix, fənn, mənbə, sual, cavab, növ, düzgün yol, vəziyyət, növbəti təkrar). Sətirləri əl ilə dəyişmə, `json` sütunu sayt üçündür. Qeyd əlavə etmək lazımdırsa, sağda yeni sütun aç.

Kodu dəyişəndə: **Deploy → Manage deployments → Edit → Version: New version**. Belə edəndə URL dəyişmir.

## Yeniləmə (20 okt 2026): bağlanmış mövzular Sheets-dən

`Code.gs` dəyişib: portal bağlanmış mövzuları bütün cihazların "Nəticələr" sətirlərindən oxuyur.
1. Apps Script redaktorunda köhnə kodu silib yeni `Code.gs`-i yapışdır, **Save**.
2. **Deploy → Manage deployments → ✏️ (Edit) → Version: New version → Deploy.** Ünvan (URL) dəyişmir.
