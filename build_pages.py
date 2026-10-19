# Generates the portal's top-level pages; all content is rendered by assets/app.js from data/*.json.
PAGE = """<!doctype html>
<html lang="az"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title} · Fikrət</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/style.css">
<script src="assets/app.js" defer></script>
</head><body data-page="{page}"><noscript>Bu səhifə JavaScript tələb edir.</noscript></body></html>
"""
pages = {"index": "Bu həftə", "riyaziyyat": "Riyaziyyat", "olimpiada": "Riyaziyyat olimpiadası", "fizika": "Fizika",
         "sinaqlar": "Sınaqlar", "temrar": "Təkrar", "dusturlar": "Düsturlar"}
for page, title in pages.items():
    open(page + ".html", "w", encoding="utf-8").write(PAGE.replace("{title}", title).replace("{page}", page))
print("ok", len(pages))
