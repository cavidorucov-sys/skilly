// Səhv jurnalı: lesson pages log wrong answers here automatically. Local-first (localStorage), then synced
// to Firebase (Firestore, project in data/config.json) once Fikrət or his father signs in with Google on this
// device. Only those two accounts may read or write (Firestore rules); anyone else stays local-only.
(function () {
  const BASE = new URL("..", document.currentScript.src).href;
  const LS = "skilly-sehv", QUEUE = "skilly-queue";
  const DAY = 864e5;
  const OK = ["orujov.fikret@gmail.com", "cavid.orucov@gmail.com"];
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const plus = (iso, days) => { const d = new Date(iso + "T12:00:00"); d.setTime(d.getTime() + days * DAY); return d.toISOString().slice(0, 10); };

  // Firebase is loaded on first use; resolves once this device's sign-in state is known (null when offline)
  const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
  let fbP = null;
  function fb() {
    if (!fbP) fbP = (async () => {
      const c = await fetch(BASE + "data/config.json", { cache: "no-cache" }).then(r => r.json());
      const [A, U, S] = await Promise.all(["firebase-app.js", "firebase-auth.js", "firebase-firestore.js"].map(f => import(FB + f)));
      const app = A.initializeApp(c.firebase), auth = U.getAuth(app), db = S.getFirestore(app);
      await new Promise(r => { const off = U.onAuthStateChanged(auth, () => { off(); r(); }); });
      return { U, S, auth, db };
    })().catch(() => null);
    return fbP;
  }
  async function api() { const f = await fb(); return f && f.auth.currentUser && OK.includes(f.auth.currentUser.email) ? f : null; }
  const docId = id => String(id).replace(/\//g, "_");
  const fromDoc = d => { try { return JSON.parse(d.data().json); } catch (e) { return null; } };

  const all = () => get(LS, []);
  function save(list) { put(LS, list); }
  function enqueue(item) { const q = get(QUEUE, []).filter(x => x.id !== item.id); q.push(item); put(QUEUE, q); flush(); }
  const RES = "skilly-netice";

  let flushing = false;
  async function flush() {
    if (flushing) return; const a = await api(); if (!a) return;
    // first sign-in on this device: everything recorded here before goes up too
    if (!get("skilly-fb", 0)) { const q = get(QUEUE, []), ids = new Set(q.map(x => x.id)); [...get(RES, []), ...all()].forEach(x => { if (!ids.has(x.id)) q.push(x); }); put(QUEUE, q); put("skilly-fb", 1); }
    const q = get(QUEUE, []); if (!q.length) return; flushing = true;
    try {
      for (const x of q) {
        const col = x._t === "netice" ? "netice" : "sehv";
        try { await a.S.setDoc(a.S.doc(a.db, col, docId(x.id)), { id: String(x.id), upd: x.upd || 0, json: JSON.stringify(x) }); }
        catch (e) { if (!(col === "netice" && e.code === "permission-denied")) throw e; } // a result is stored once; a repeat is refused
        put(QUEUE, get(QUEUE, []).filter(y => !(y.id === x.id && y.upd === x.upd)));
      }
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
    // Finished lesson/test: score, time and per-question detail; one record per attempt (same id = no duplicate).
    netice(r) {
      const list = get(RES, []); if (list.some(x => x.id === r.id)) return null;
      const item = { tarix: today(), ...r, _t: "netice", upd: Date.now() };
      list.push(item); put(RES, list); enqueue(item); return item;
    },
    // Topic reviews ("yaddaş yoxlaması"): planned when a final test is passed; done inside the lesson page.
    planReview(key, link, title) {
      const list = get("skilly-yoxla", []).filter(r => r.key !== key || r.done);
      list.push({ id: key + "@" + plus(today(), 7), key, link, title, due: plus(today(), 7), n: 3 },
                { id: key + "@" + plus(today(), 30), key, link, title, due: plus(today(), 30), n: 5 });
      put("skilly-yoxla", list);
    },
    reviews: () => get("skilly-yoxla", []),
    dueReviews(key) { const t = today(); return get("skilly-yoxla", []).filter(r => !r.done && r.due <= t && (!key || r.key === key)); },
    reviewDone(id, ok) {
      let list = get("skilly-yoxla", []);
      const r = list.find(x => x.id === id); if (!r) return;
      r.done = today(); r.ok = ok;
      if (!ok) list = list.filter(x => x.key !== r.key || x.done); // topic reopens; new reviews come after the next pass
      put("skilly-yoxla", list);
    },
    update(id, fields) { const x = all().find(x => x.id === id); return x ? upsert({ ...x, ...fields }) : null; },
    // Redo result: success moves 7 days → 30 days → closed; failure returns to 7 days.
    tekrar(id, ok) {
      const x = all().find(x => x.id === id); if (!x) return null;
      const n = ok ? x.tekrar + 1 : 0;
      return upsert({ ...x, tekrar: n, status: ok && n >= 2 ? "baglandi" : "aciq", novbeti: ok ? (n >= 2 ? "" : plus(today(), 30)) : plus(today(), 7) });
    },
    // Pull the cloud copy (other devices, father's edits); newer "upd" wins.
    async pull() {
      const a = await api(); if (!a) return { synced: false };
      try {
        const snap = await a.S.getDocs(a.S.collection(a.db, "sehv"));
        const byId = new Map(all().map(x => [x.id, x]));
        snap.forEach(d => { const s = fromDoc(d); if (!s) return; const l = byId.get(s.id); if (!l || (s.upd || 0) > (l.upd || 0)) byId.set(s.id, s); });
        save([...byId.values()]); await flush(); return { synced: true };
      } catch (e) { return { synced: false }; }
    },
    // Closed topics from the results of all devices (this one + cloud), in time order: a passed final test
    // closes a topic, a failed review reopens it. Rewrites "skilly-bag"; changed = the portal must redraw.
    async pullBag() {
      const a = await api(); let items = [], synced = false;
      if (a) try { (await a.S.getDocs(a.S.collection(a.db, "netice"))).forEach(d => { const x = fromDoc(d); if (x) items.push(x); }); synced = true; } catch (e) {}
      const byId = new Map(); [...get(RES, []), ...items].forEach(x => byId.set(String(x.id), x));
      const state = {};
      [...byId.values()].map(x => [String(x.id).match(/^(.+)-(test|yoxla)@(\d+)$/), x]).filter(([m]) => m)
        .sort((p, q) => p[0][3] - q[0][3])
        .forEach(([m, x]) => {
          const link = "dersler/" + m[1] + ".html", ok = /^keçdi/.test(x.qeyd || "");
          if (m[2] === "test" && ok) state[link] = true;
          if (m[2] === "yoxla" && !ok) state[link] = false;
        });
      const before = get("skilly-bag", []), bag = new Set(before);
      for (const l in state) state[l] ? bag.add(l) : bag.delete(l);
      const after = [...bag]; put("skilly-bag", after);
      return { synced, changed: after.length !== before.length || after.some(x => !before.includes(x)) };
    },
    configured: async () => !!(await api()),
    // Google sign-in: only Fikrət's and his father's accounts are kept signed in
    async user() { const a = await api(); return a ? a.auth.currentUser.email : null; },
    async signIn() {
      const f = await fb(); if (!f) throw new Error("İnternet yoxdur");
      const r = await f.U.signInWithPopup(f.auth, new f.U.GoogleAuthProvider());
      if (!OK.includes(r.user.email)) { await f.U.signOut(f.auth); throw new Error("Bu hesaba icazə yoxdur: " + r.user.email); }
      await flush(); return r.user.email;
    },
    async signOut() { const f = await fb(); if (f) await f.U.signOut(f.auth); },
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
  // One-time import of work done before the portal existed (data/kecmis.json): lesson answers go into the
  // lessons' own storage if this device has none, past mistakes into the journal with their original dates.
  window.Skilly.ready = (async () => {
    let past; try { past = await fetch(BASE + "data/kecmis.json", { cache: "no-cache" }).then(r => r.json()); } catch (e) { return; }
    (past.neticeler || []).forEach(r => window.Skilly.netice(r)); // by id, so repeating is harmless
    if (get("skilly-kecmis", 0) >= past.versiya) return;
    for (const k in past.lessons) { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(past.lessons[k])); } catch (e) {} }
    past.sehvler.forEach(e => window.Skilly.sehv(e));
    put("skilly-kecmis", past.versiya);
  })();
  window.addEventListener("online", flush);
  flush();
})();
