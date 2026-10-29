// Lesson pages inside Skilly: (1) a lesson always opens inside the portal (ders.html frames it), and
// (2) each long lesson card is split into steps — one section at a time, with a step bar and
// Back/Next — so the page is short. The step reached is remembered per lesson on this device.
(function () {
  const name = location.pathname.split("/").pop().replace(/\.html$/, "");
  if (window.top === window.self) { location.replace("../ders.html?p=" + encodeURIComponent(name) + location.hash); return; }
  document.documentElement.classList.add("in-frame");

  // Vector notation: the combining arrow (a + U+20D7) has no glyph in our fonts and shows as a box.
  // Rewrite it everywhere — static lessons and game questions added later — as a drawn arrow over the letter.
  const VEC = "⃗", NS = "http://www.w3.org/2000/svg";
  function fixVec(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.includes(VEC) ? 1 : 3 });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach(t => {
      const parts = t.nodeValue.split(/(.⃗)/), inSvg = t.parentNode.namespaceURI === NS, frag = document.createDocumentFragment();
      parts.forEach(p => {
        if (!p) return;
        if (!p.endsWith(VEC)) { frag.append(p); return; }
        const ch = p[0];
        if (inSvg) {
          const a = document.createElementNS(NS, "tspan"); a.textContent = ch; frag.append(a);
          const b = document.createElementNS(NS, "tspan"); b.setAttribute("dx", "-0.7em"); b.setAttribute("dy", "-0.72em"); b.setAttribute("font-size", "0.9em"); b.setAttribute("font-weight", "700"); b.textContent = "→"; frag.append(b);
          const c = document.createElementNS(NS, "tspan"); c.setAttribute("dy", "0.648em"); c.textContent = " "; frag.append(c);
        } else { const sp = document.createElement("span"); sp.className = "vec"; sp.textContent = ch; frag.append(sp); }
      });
      t.replaceWith(frag);
    });
  }
  // Subscripts were typed as "F_əv", "v_0": show the part after "_" as a real subscript (HTML <sub> or an SVG tspan).
  const SUB = /([A-Za-zΑ-Ωα-ω)])_([0-9A-Za-zƏəÜüÖöĞğIıÇçŞş]+)/g;
  function fixSub(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (SUB.lastIndex = 0, SUB.test(n.nodeValue)) && !n.parentNode.closest("script,style,textarea,input,code") ? 1 : 3 });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach(t => {
      const inSvg = t.parentNode.namespaceURI === NS, frag = document.createDocumentFragment();
      let last = 0; const s = t.nodeValue; SUB.lastIndex = 0;
      for (let m; (m = SUB.exec(s));) {
        frag.append(s.slice(last, m.index) + m[1]);
        if (inSvg) {
          const a = document.createElementNS(NS, "tspan"); a.setAttribute("baseline-shift", "sub"); a.setAttribute("font-size", "0.72em"); a.textContent = m[2]; frag.append(a);
          const b = document.createElementNS(NS, "tspan"); b.textContent = "​"; frag.append(b);
        } else { const sb = document.createElement("sub"); sb.textContent = m[2]; frag.append(sb); }
        last = m.index + m[0].length;
      }
      frag.append(s.slice(last)); t.replaceWith(frag);
    });
  }
  // Formula summaries were typed as space-aligned monospace text; show them as tidy rows of formula chips instead.
  // A line "Label: a = b    c = d" becomes a bold label and two chips; 2+ spaces separate formulas on a line.
  function prettyFormulas(root) {
    root.querySelectorAll(".sum .ex, .fm").forEach(box => {
      if (box.dataset.pretty || box.querySelector("svg, table")) return;
      box.querySelectorAll("br").forEach(b => b.replaceWith("\n"));
      const lines = box.textContent.split("\n").map(l => l.trim()).filter(Boolean);
      if (!lines.length) return;
      const out = document.createElement("div"); out.className = "frows";
      lines.forEach(line => {
        const row = document.createElement("div"); row.className = "frow";
        let rest = line;
        const m = line.match(/^([^=:]{2,40}):\s+(.+)$/);
        if (m && !/[=<>≤≥]/.test(m[1])) { const lab = document.createElement("span"); lab.className = "flab"; lab.textContent = m[1]; row.append(lab); rest = m[2]; }
        rest.split(/\s{2,}/).forEach(f => { const c = document.createElement("span"); c.className = "fchip"; c.textContent = f; row.append(c); });
        out.append(row);
      });
      box.replaceChildren(out); box.dataset.pretty = "1"; box.classList.add("pretty");
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    prettyFormulas(document.body);
    fixVec(document.body); fixSub(document.body);
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 || n.nodeType === 3) { const r = n.nodeType === 1 ? n : n.parentNode || document.body; fixVec(r); fixSub(r); } }))).observe(document.body, { childList: true, subtree: true });
  });
  // Topic illustration (assets/ill/<page>.webp) under the first "Niyə lazımdır" heading; dropped if the file is missing.
  function illustrate() {
    // first "Niyə … lazımdır" heading; lessons without one get the picture under their first heading
    const hs = [...document.querySelectorAll("article.lesson h3")], h = hs.find(x => /Niyə.*lazımdır/i.test(x.textContent)) || hs[0];
    if (!h) return;
    const fig = document.createElement("figure"); fig.className = "ill";
    const img = new Image(); img.src = "../assets/ill/" + name + ".webp"; img.alt = ""; img.decoding = "async";
    img.onerror = () => fig.remove();
    fig.append(img); h.after(fig);
  }
  // Self-check: the questions are open, each answer stays hidden until its own "Cavabı göstər" is pressed.
  function hideAnswers(root) {
    root.querySelectorAll("details.check").forEach(d => {
      d.open = true;
      d.querySelectorAll(".ans").forEach(a => {
        a.hidden = true;
        const b = document.createElement("button"); b.type = "button"; b.className = "ans-btn"; b.textContent = "Cavabı göstər";
        b.addEventListener("click", () => { a.hidden = false; b.remove(); });
        a.before(b);
      });
    });
  }
  // worked examples beside a method: each "Cavab: …" line stays hidden until asked for
  function hideExAnswers(root) {
    root.querySelectorAll(".pair .nums .ex").forEach(ex => {
      for (let n = ex.firstChild; n; n = n.nextSibling) {
        if (n.nodeType !== 3) continue;
        const m = /(^|\n)[ \t]*(Cavab:)/.exec(n.data);
        if (!m) continue;
        const start = n.splitText(m.index + m[0].length - m[2].length);
        n.data = n.data.replace(/\s+$/, "");
        const hid = document.createElement("span"); hid.className = "ex-cavab"; hid.hidden = true;
        ex.insertBefore(hid, start);
        // the answer runs to the end of its line, across inline elements
        let cur = start;
        while (cur) {
          const nl = cur.nodeType === 3 ? cur.data.indexOf("\n") : -1;
          if (nl >= 0) { cur.splitText(nl); hid.append(cur); break; }
          const nx = cur.nextSibling; hid.append(cur); cur = nx;
        }
        const b = document.createElement("button"); b.type = "button"; b.className = "ans-btn"; b.textContent = "Cavabı göstər";
        b.addEventListener("click", () => { hid.hidden = false; b.remove(); });
        ex.insertBefore(b, hid);
        if (hid.nextSibling && hid.nextSibling.nodeType === 3) hid.nextSibling.data = hid.nextSibling.data.replace(/^\n/, "");
        n = hid;
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    illustrate();
    hideAnswers(document);
    hideExAnswers(document);
    // links that leave the lesson open in the portal window, not inside the frame
    document.querySelectorAll('a[href^="../"]').forEach(a => { a.target = "_top"; });
    document.querySelectorAll("article.lesson").forEach((art, li) => stepify(art, name + ":" + li));
  });

  const CHECK = ["mist", "sum", "check"];
  function stepify(art, key) {
    const kids = [...art.children];
    if (kids.filter(k => k.tagName === "H3").length < 2) return;
    // group: intro before the first h3 joins step 1; each h3 opens a step; mistakes/summary/self-check form the last step
    const steps = []; let cur = null; const intro = [], tail = [];
    kids.forEach(k => {
      if (CHECK.some(c => k.classList.contains(c))) { tail.push(k); return; }
      if (k.tagName === "H3") { cur = { title: k.textContent.replace(/^\s*\d+\s*/, "").trim(), nodes: [k] }; steps.push(cur); return; }
      // a .pair (method beside examples) is one step, titled after its first heading
      if (k.classList.contains("pair")) { const h = k.querySelector("h3"); cur = { title: h ? h.textContent.replace(/^\s*\d+\s*/, "").trim() + " və nümunələr" : "Üsul", nodes: [k] }; steps.push(cur); return; }
      (cur ? cur.nodes : intro).push(k);
    });
    if (!steps.length) return;
    steps[0].nodes.unshift(...intro);
    // the self-check goes into a step of its own — or into the last step if the lesson already ends with one
    const last = steps[steps.length - 1];
    if (tail.length) { if (/özünü yoxla/i.test(last.title)) last.nodes.push(...tail); else steps.push({ title: "Özünü yoxla", nodes: tail }); }

    const bar = document.createElement("nav"); bar.className = "stepbar"; bar.setAttribute("aria-label", "Addımlar");
    const secs = steps.map((s, i) => {
      const sec = document.createElement("section"); sec.className = "step"; sec.append(...s.nodes);
      const b = document.createElement("button"); b.type = "button"; b.className = "stepchip";
      b.innerHTML = '<span class="no"></span><span class="tt"></span>';
      b.querySelector(".no").textContent = i + 1; b.querySelector(".tt").textContent = s.title;
      b.addEventListener("click", () => show(i, true)); bar.append(b);
      return sec;
    });
    const nav = document.createElement("div"); nav.className = "stepnav";
    const prev = document.createElement("button"); prev.type = "button"; prev.className = "btn ghost"; prev.textContent = "← Əvvəlki";
    const next = document.createElement("button"); next.type = "button"; next.className = "btn"; next.textContent = "Növbəti →";
    const pos = document.createElement("span"); pos.className = "steppos";
    nav.append(prev, pos, next);
    art.replaceChildren(bar, ...secs, nav);
    // the panel's own "next lesson" button only makes sense on the last step
    const lessonNext = art.parentElement.querySelector(":scope > .next");

    let at = 0; try { at = Math.min(+localStorage.getItem("step:" + key) || 0, secs.length - 1); } catch (e) {}
    function show(i, scroll) {
      at = i;
      secs.forEach((s, j) => { s.hidden = j !== i; });
      [...bar.children].forEach((b, j) => { b.setAttribute("aria-current", j === i ? "step" : "false"); b.classList.toggle("done", j < i); });
      prev.hidden = i === 0; next.hidden = i === secs.length - 1; pos.textContent = (i + 1) + " / " + secs.length;
      if (lessonNext) lessonNext.hidden = i !== secs.length - 1;
      try { localStorage.setItem("step:" + key, i); } catch (e) {} if (window.Skilly && Skilly.hal) Skilly.hal("step:" + key);
      if (scroll) art.scrollIntoView({ block: "start", behavior: "smooth" });
      bar.children[i].scrollIntoView({ block: "nearest", inline: "center" });
    }
    prev.addEventListener("click", () => show(at - 1, true));
    next.addEventListener("click", () => show(at + 1, true));
    show(at, false);
  }
})();
