// Səhv jurnalı: lesson pages log wrong answers here automatically. Local-first (localStorage), then synced
// to Google Sheets through the Apps Script in apps-script/Code.gs when data/config.json has an "api" URL
// and this device has the key (opened once with #key=… in the address).
(function () {
  const BASE = new URL("..", document.currentScript.src).href;
  const LS = "skilly-sehv", QUEUE = "skilly-queue", KEY = "skilly-key";
  const DAY = 864e5;
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const plus = (iso, days) => { const d = new Date(iso + "T12:00:00"); d.setTime(d.getTime() + days * DAY); return d.toISOString().slice(0, 10); };

  // one-time device setup: …/any-page.html#key=XXXX stores the key and removes it from the address bar
  const m = location.hash.match(/key=([^&]+)/);
  if (m) { put(KEY, decodeURIComponent(m[1])); history.replaceState(null, "", location.pathname + location.search); }

  let cfg = null;
  async function api() {
    if (!cfg) cfg = await fetch(BASE + "data/config.json", { cache: "no-cache" }).then(r => r.json()).catch(() => ({}));
    const key = get(KEY, "");
    return cfg.api && key ? { url: cfg.api, key } : null;
  }

  const all = () => get(LS, []);
  function save(list) { put(LS, list); }
  function enqueue(item) { const q = get(QUEUE, []).filter(x => x.id !== item.id); q.push(item); put(QUEUE, q); flush(); }

  let flushing = false;
  async function flush() {
    if (flushing) return; const a = await api(); const q = get(QUEUE, []);
    if (!a || !q.length) return; flushing = true;
    try {
      const r = await fetch(a.url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ key: a.key, op: "upsert", items: q }) });
      const j = await r.json();
      if (j.ok) { const sent = new Set(q.map(x => x.id + x.upd)); put(QUEUE, get(QUEUE, []).filter(x => !sent.has(x.id + x.upd))); }
    } catch (e) { /* offline: stays queued */ } finally { flushing = false; }
  }

  function upsert(item) {
    item.upd = Date.now();
    const list = all(); const i = list.findIndex(x => x.id === item.id);
    if (i >= 0) list[i] = item; else list.push(item);
    save(list); enqueue(item); return item;
  }

  window.Skilly = {
    today, plus, all, flush,
    // New mistake. Same id twice (same question) is ignored, so a page can call this freely.
    sehv(e) {
      if (all().some(x => x.id === e.id)) return null;
      return upsert({ tarix: today(), menbe: "", movzu: "", sual: "", cavab: "", duz: "", kat: "", yol: "", status: "yeni", novbeti: plus(today(), 7), tekrar: 0, ...e });
    },
    update(id, fields) { const x = all().find(x => x.id === id); return x ? upsert({ ...x, ...fields }) : null; },
    // Redo result: success moves 7 days → 30 days → closed; failure returns to 7 days.
    tekrar(id, ok) {
      const x = all().find(x => x.id === id); if (!x) return null;
      const n = ok ? x.tekrar + 1 : 0;
      return upsert({ ...x, tekrar: n, status: ok && n >= 2 ? "baglandi" : "aciq", novbeti: ok ? (n >= 2 ? "" : plus(today(), 30)) : plus(today(), 7) });
    },
    // Pull Sheets copy (other devices, father's edits); newer "upd" wins.
    async pull() {
      const a = await api(); if (!a) return { synced: false };
      try {
        const j = await fetch(a.url + "?op=list&key=" + encodeURIComponent(a.key)).then(r => r.json());
        if (!j.ok) return { synced: false, error: j.error };
        const list = all(); const byId = new Map(list.map(x => [x.id, x]));
        j.items.forEach(s => { const l = byId.get(s.id); if (!l || (s.upd || 0) > (l.upd || 0)) byId.set(s.id, s); });
        save([...byId.values()]); await flush(); return { synced: true };
      } catch (e) { return { synced: false }; }
    },
    configured: async () => !!(await api()),
    // Answer checking shared with the lesson pages (same normalisation and hash recipe).
    norm(v, mode) {
      let s = String(v).trim().replace(/[−–—]/g, "-").replace(/,/g, ".").replace(/\s+/g, "");
      s = mode === "p1" ? s.toUpperCase().replace(/^\+/, "") : s.replace(/^[a-zA-Zkbcx₀y]+=/, "").replace(/^\+/, "");
      const f = Number(s); if (s !== "" && isFinite(f)) return Number.isInteger(f) ? String(f) : String(+f.toFixed(6)); return s;
    },
    async hash(prefix, n, s) {
      const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(prefix + "|" + n + "|" + s));
      return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("").slice(0, 16);
    },
  };
  window.addEventListener("online", flush);
  flush();
})();
