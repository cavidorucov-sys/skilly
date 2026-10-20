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

  const all = () => get(LS, []);
  function save(list) { put(LS, list); }
  function enqueue(item) { const q = get(QUEUE, []).filter(x => x.id !== item.id); q.push(item); put(QUEUE, q); flush(); }
  const RES = "skilly-netice";
  // Fikrət's progress kept in this browser and mirrored to the cloud ("hal"): game levels, lesson step, review plan.
  // HAL_UPD = when each key was last changed here; the newest change wins on every device.
  const HAL_UPD = "skilly-hal";
  const isHal = k => /^(oyun:|step:)/.test(k) || k === "skilly-yoxla";
  const FIKRET = OK[0];

  let flushing = false;
  async function flush() {
    if (flushing) return; const a = await api(); if (!a) return;
    flushing = true;
    try {
      const me = a.auth.currentUser.email;
      // first sign-in on this device: what was recorded here before goes up too (progress only from Fikrət's account,
      // and only for keys the cloud does not have yet — the pull before this has filled HAL_UPD with those)
      if (!get("skilly-fb", 0)) {
        await pullHal(a);
        const q = get(QUEUE, []), ids = new Set(q.map(x => x.id)), upd = get(HAL_UPD, {});
        [...get(RES, []), ...all()].forEach(x => { if (!ids.has(x.id)) q.push(x); });
        if (me === FIKRET) for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (isHal(k) && !upd[k]) q.push({ id: "hal:" + k, _t: "hal", key: k, upd: 1 }); }
        put(QUEUE, q); put("skilly-fb", 1);
      }
      for (const x of get(QUEUE, [])) {
        const col = x._t === "netice" ? "netice" : x._t === "hal" ? "hal" : "sehv";
        if (col === "hal" && me !== FIKRET) { put(QUEUE, get(QUEUE, []).filter(y => y.id !== x.id)); continue; } // father's clicks don't move Fikrət's progress
        const json = col === "hal" ? localStorage.getItem(x.key) : JSON.stringify(x);
        if (json != null) try {
          await a.S.setDoc(a.S.doc(a.db, col, docId(x.id)), { id: String(x.id), key: x.key || null, upd: x.upd || 0, t: a.S.serverTimestamp(), json });
        } catch (e) { if (!(col === "netice" && e.code === "permission-denied")) throw e; } // a result is stored once; a repeat is refused
        put(QUEUE, get(QUEUE, []).filter(y => !(y.id === x.id && y.upd === x.upd)));
      }
      if (get(QUEUE, []).length) setTimeout(flush, 1000); // added while this run was sending
    } catch (e) { /* offline: stays queued */ } finally { flushing = false; }
  }

  // only what changed in the cloud since the last pull on this device (server time "t")
  async function pullCol(a, col) {
    const k = "skilly-t:" + col, since = get(k, 0);
    const ref = a.S.collection(a.db, col);
    const snap = await a.S.getDocs(since ? a.S.query(ref, a.S.where("t", ">", a.S.Timestamp.fromMillis(since))) : ref);
    let max = since; const docs = [];
    snap.forEach(d => { const v = d.data(); if (v.t && v.t.toMillis() > max) max = v.t.toMillis(); docs.push(v); });
    return { docs, done: () => put(k, max) };
  }
  // progress from other devices: written straight into this browser when newer than the copy here
  async function pullHal(a) {
    const { docs, done } = await pullCol(a, "hal"); const upd = get(HAL_UPD, {}); let changed = false;
    docs.forEach(v => { if (v.key && v.json != null && (v.upd || 0) > (upd[v.key] || 0)) { try { localStorage.setItem(v.key, v.json); } catch (e) {} upd[v.key] = v.upd; changed = true; } });
    put(HAL_UPD, upd); done(); return changed;
  }
  async function pullNetice(a) {
    const { docs, done } = await pullCol(a, "netice"); const list = get(RES, []), ids = new Set(list.map(x => String(x.id)));
    docs.forEach(v => { try { const x = JSON.parse(v.json); if (!ids.has(String(x.id))) { list.push(x); ids.add(String(x.id)); } } catch (e) {} });
    put(RES, list); done();
  }
  // Closed topics from all results (this device's list now includes the cloud's), in time order: a passed final
  // test closes a topic, a failed review reopens it. Rewrites "skilly-bag"; returns true when it changed.
  function deriveBag() {
    const state = {};
    get(RES, []).map(x => [String(x.id).match(/^(.+)-(test|yoxla)@(\d+)$/), x]).filter(([m]) => m)
      .sort((p, q) => p[0][3] - q[0][3])
      .forEach(([m, x]) => {
        const link = "dersler/" + m[1] + ".html", ok = /^keçdi/.test(x.qeyd || "");
        if (m[2] === "test" && ok) state[link] = true;
        if (m[2] === "yoxla" && !ok) state[link] = false;
      });
    const before = get("skilly-bag", []), bag = new Set(before);
    for (const l in state) state[l] ? bag.add(l) : bag.delete(l);
    const after = [...bag]; put("skilly-bag", after);
    return after.length !== before.length || after.some(x => !before.includes(x));
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
      put("skilly-yoxla", list); window.Skilly.hal("skilly-yoxla");
    },
    reviews: () => get("skilly-yoxla", []),
    dueReviews(key) { const t = today(); return get("skilly-yoxla", []).filter(r => !r.done && r.due <= t && (!key || r.key === key)); },
    reviewDone(id, ok) {
      let list = get("skilly-yoxla", []);
      const r = list.find(x => x.id === id); if (!r) return;
      r.done = today(); r.ok = ok;
      if (!ok) list = list.filter(x => x.key !== r.key || x.done); // topic reopens; new reviews come after the next pass
      put("skilly-yoxla", list); window.Skilly.hal("skilly-yoxla");
    },
    update(id, fields) { const x = all().find(x => x.id === id); return x ? upsert({ ...x, ...fields }) : null; },
    // Redo result: success moves 7 days → 30 days → closed; failure returns to 7 days.
    tekrar(id, ok) {
      const x = all().find(x => x.id === id); if (!x) return null;
      const n = ok ? x.tekrar + 1 : 0;
      return upsert({ ...x, tekrar: n, status: ok && n >= 2 ? "baglandi" : "aciq", novbeti: ok ? (n >= 2 ? "" : plus(today(), 30)) : plus(today(), 7) });
    },
    // A progress key was just written here (game state, lesson step, reviews): send it to the cloud.
    hal(key) { if (!isHal(key)) return; const upd = get(HAL_UPD, {}); upd[key] = Date.now(); put(HAL_UPD, upd); enqueue({ id: "hal:" + key, _t: "hal", key, upd: upd[key] }); },
    // Pull the cloud copy of the error journal (other devices, father's edits); newer "upd" wins.
    async pull() {
      const a = await api(); if (!a) return { synced: false };
      try {
        const { docs, done } = await pullCol(a, "sehv");
        const byId = new Map(all().map(x => [x.id, x]));
        docs.forEach(v => { let s; try { s = JSON.parse(v.json); } catch (e) { return; } const l = byId.get(s.id); if (!l || (s.upd || 0) > (l.upd || 0)) byId.set(s.id, s); });
        save([...byId.values()]); done(); await flush(); return { synced: true };
      } catch (e) { return { synced: false }; }
    },
    // Everything from the other devices: results (→ closed topics) and progress. changed = the page must redraw.
    async sync() {
      const a = await api(); let changed = false;
      if (a) try { await pullNetice(a); changed = await pullHal(a); await flush(); } catch (e) {}
      return { synced: !!a, changed: deriveBag() || changed };
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
  // every page picks up the other devices' work once on load; a page drawn from older data redraws once
  window.Skilly.synced = window.Skilly.sync().then(r => { if (r.changed) location.reload(); return r; });
})();
