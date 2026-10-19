# Generates the portal's top-level pages from one template (run once after editing).
HEAD = """<!doctype html>
<html lang="az"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&family=Noto+Serif:wght@400;600&family=JetBrains+Mono:wght@500;700&display=swap">
<link rel="stylesheet" href="assets/style.css">
<script src="assets/app.js"></script>
</head><body>
<main>
{body}
</main>
<footer>Fikrət · Hazırlıq portalı. Cavablar səhifələrdə şifrəlidir — özün həll et.</footer>
<script>{script}</script>
</body></html>
"""

TOPICS_JS = """
load("data/movzular.json").then(d => {
  const rows = d[KEY]; const box = document.getElementById("list");
  const n = s => rows.filter(r => r.status === s).length;
  document.getElementById("sum").textContent = `${rows.length} mövzu · bağlanıb ${n("bag")} · işlənir ${n("isl")} · başlanmayıb ${n("yox")}`;
  const tb = el("tbody", {}); let sec = null, i = 0;
  rows.forEach(r => {
    if (r.bolme !== sec) { sec = r.bolme; tb.append(el("tr", {}, el("td", { colspan: "4", class: "sec" }, sec))); }
    i++;
    const name = r.ders ? el("a", { href: r.ders }, r.ad) : el("span", {}, r.ad);
    const tags = [];
    if (r.fritl) tags.push(" ", el("span", { class: "pill s-yox" }, "FRİTL"));
    if (r.yeni) tags.push(" ", el("span", { class: "pill s-yox" }, "əlavə"));
    tb.append(el("tr", {}, el("td", { class: "n" }, String(i)), el("td", {}, name, ...tags), el("td", {}, pill(r.status)),
      el("td", { class: "muted" }, r.ders ? "dərs var" : "tezliklə")));
  });
  box.replaceChildren(el("div", { class: "tbl" }, el("table", {}, el("thead", {}, el("tr", {}, el("th", {}, "№"), el("th", {}, "Mövzu"), el("th", {}, "Vəziyyət"), el("th", {}, "Material"))), tb)));
}).catch(e => { document.getElementById("list").textContent = "Siyahı yüklənmədi: " + e.message; });
"""

pages = {
    "index.html": ("Bu həftə", """
<h1>Bu həftə</h1>
<p class="lead" id="meta"></p>
<div class="grid" id="days"><p class="empty">Yüklənir…</p></div>
""", """
load("data/hefte.json").then(d => {
  document.getElementById("meta").textContent = d.hefte + " · " + d.qeyd;
  const today = new Date(); const iso = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");
  const box = document.getElementById("days"); box.replaceChildren();
  d.gunler.forEach(g => {
    const items = g.isler.map(t => el("div", { class: "task" }, el("span", { class: "t" }, t.saat),
      el("span", { class: "w" }, t.link ? el("a", { href: t.link }, t.is) : t.is)));
    const card = el("section", { class: "card day" + (g.tarix === iso ? " today" : "") },
      el("h3", {}, el("span", {}, g.gun), el("span", { class: "muted" }, g.tarix.slice(8) + "." + g.tarix.slice(5,7) + (g.tarix === iso ? " · bu gün" : ""))), ...items);
    box.append(card);
  });
  const t = box.querySelector(".today"); if (t) t.scrollIntoView({ block: "nearest" });
}).catch(e => { document.getElementById("days").textContent = "Cədvəl yüklənmədi: " + e.message; });
"""),
    "riyaziyyat.html": ("Riyaziyyat", """
<h1>Riyaziyyat — buraxılış</h1>
<p class="lead">Hər mövzu giriş testi ilə başlayır: 80% və çox — mövzu bağlanır. Az olarsa: dərs → 20–25 məşq sualı → yekun test (80%). Bir həftə və bir ay sonra təkrar.</p>
<p class="muted" id="sum"></p>
<div class="card" id="list"><p class="empty">Yüklənir…</p></div>
""", "const KEY='riyaziyyat';" + TOPICS_JS),
    "olimpiada.html": ("Riyaziyyat olimpiadası", """
<h1>Riyaziyyat olimpiadası</h1>
<p class="lead">Hər mövzuya ~2 həftə: dərs və 12–15 məşq sualı, sonra 5–6 olimpiada məsələsi (həll kağızda yazılır, şəkli göndərilir) və yekun test.</p>
<p class="muted" id="sum"></p>
<div class="card" id="list"><p class="empty">Yüklənir…</p></div>
""", "const KEY='olimpiada';" + TOPICS_JS),
    "fizika.html": ("Fizika", """
<h1>Fizika</h1>
<p class="lead">FRİTL-də keçilən hər mövzu növbəti həftə burada təkrarlanır: sadə izah, məşq, test. FRİTL-in keçmədiyi mövzular ayrıca əlavə olunur.</p>
<p class="muted" id="sum"></p>
<div class="card" id="list"><p class="empty">Yüklənir…</p></div>
""", "const KEY='fizika';" + TOPICS_JS),
    "sinaqlar.html": ("Sınaqlar", """
<h1>Sınaqlar</h1>
<p class="lead">Şənbə 11:00–12:30 vaxt limitli sınaq: bir həftə riyaziyyat, bir həftə fizika.</p>
<div class="card"><h2>Fizika</h2><p><a href="dersler/fizika-mexanika-1.html">Mexanika sınağı 1</a> — 24 tapşırıq, 60 dəq <span class="pill s-bag">işlənib: 23/24</span></p></div>
<div class="card"><h2>Riyaziyyat</h2><p class="empty">Növbəti sınaq tezliklə.</p></div>
""", ""),
    "temrar.html": ("Təkrar", """
<h1>Təkrar</h1>
<p class="lead">Bağlanmış mövzulardan bir həftə və bir ay sonra 5 qarışıq sual; testlərdə səhv edilən suallar da bura düşür.</p>
<div class="card"><p class="empty">Hələ bağlanmış mövzu yoxdur — ilk mövzu bağlananda burada suallar görünəcək.</p></div>
""", ""),
    "dusturlar.html": ("Düsturlar", """
<h1>Düsturlar</h1>
<p class="lead">Hər düsturun yanında: nə vaxt işlədilir, tipik səhv və izahı olan dərs.</p>
<input class="search" id="q" type="search" placeholder="Axtar: məsələn, sin, təcil, parabola" aria-label="Düstur axtar">
<div id="list" style="display:grid;gap:12px"><p class="empty">Yüklənir…</p></div>
""", """
let ALL = [];
function draw(q) {
  q = (q || "").toLowerCase();
  const box = document.getElementById("list"); box.replaceChildren();
  let fenn = null, mov = null;
  ALL.filter(f => !q || (f.ad + f.fx + f.movzu + (f.nevaxt||"")).toLowerCase().includes(q)).forEach(f => {
    if (f.fenn !== fenn) { fenn = f.fenn; mov = null; box.append(el("h2", {}, fenn)); }
    const card = el("div", { class: "card f" },
      el("div", { class: "muted" }, f.movzu + " · " + f.ad),
      el("div", { class: "fx" }, f.fx),
      el("div", { class: "note" }, f.nevaxt || ""));
    if (f.sehv) card.append(el("div", { class: "err" }, "Tipik səhv: " + f.sehv));
    if (f.ders) card.append(el("a", { href: f.ders, class: "note" }, "İzahı dərsdə →"));
    box.append(card);
  });
  if (!box.children.length) box.append(el("p", { class: "empty" }, "Tapılmadı."));
}
load("data/dusturlar.json").then(d => { ALL = d; draw(""); }).catch(e => { document.getElementById("list").textContent = "Yüklənmədi: " + e.message; });
document.addEventListener("input", e => { if (e.target.id === "q") draw(e.target.value); });
"""),
}

for fn, (title, body, script) in pages.items():
    open(fn, "w", encoding="utf-8").write(HEAD.replace("{title}", title + " · Fikrət").replace("{body}", body.strip()).replace("{script}", script))
print("ok", len(pages))
