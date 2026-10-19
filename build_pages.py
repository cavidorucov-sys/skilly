# Generates the portal's top-level pages; all content is rendered by assets/app.js from data/*.json.
PAGE = """<!doctype html>
<html lang="az"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title} · Skilly</title>
<link rel="stylesheet" href="assets/fonts.css">
<link rel="stylesheet" href="assets/style.css">
<script src="assets/icons.js" defer></script>
<script src="assets/jurnal.js" defer></script>
<script src="assets/app.js" defer></script>
</head><body data-page="{page}"><noscript>Bu səhifə JavaScript tələb edir.</noscript></body></html>
"""
pages = {"index": "Bu gün", "teqvim": "Təqvim", "riyaziyyat": "Buraxılış", "olimpiada": "Olimpiada", "fizika": "Fizika",
         "sinaqlar": "Sınaqlar", "temrar": "Səhv jurnalı", "dusturlar": "Düsturlar", "ders": "Dərs"}
for page, title in pages.items():
    open(page + ".html", "w", encoding="utf-8").write(PAGE.replace("{title}", title).replace("{page}", page))
print("ok", len(pages))
