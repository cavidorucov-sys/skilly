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
          const b = document.createElementNS(NS, "tspan"); b.setAttribute("dx", "-0.62em"); b.setAttribute("dy", "-0.72em"); b.setAttribute("font-size", "0.62em"); b.textContent = "→"; frag.append(b);
          const c = document.createElementNS(NS, "tspan"); c.setAttribute("dy", "0.446em"); c.textContent = " "; frag.append(c);
        } else { const sp = document.createElement("span"); sp.className = "vec"; sp.textContent = ch; frag.append(sp); }
      });
      t.replaceWith(frag);
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    fixVec(document.body);
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 || n.nodeType === 3) fixVec(n.nodeType === 1 ? n : n.parentNode || document.body); }))).observe(document.body, { childList: true, subtree: true });
  });
  document.addEventListener("DOMContentLoaded", () => {
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
      try { localStorage.setItem("step:" + key, i); } catch (e) {}
      if (scroll) art.scrollIntoView({ block: "start", behavior: "smooth" });
      bar.children[i].scrollIntoView({ block: "nearest", inline: "center" });
    }
    prev.addEventListener("click", () => show(at - 1, true));
    next.addEventListener("click", () => show(at + 1, true));
    show(at, false);
  }
})();
