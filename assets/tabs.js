// Tabs for lesson pages built from the template: every <button role="tab" aria-controls="ID"> in .tabs
// switches the matching panel. Remembers the open tab per page; #ID in the address opens that tab;
// any element with data-go="ID" opens tab ID.
(function () {
  const run = () => {
    const btns = [...document.querySelectorAll('.tabs [role="tab"]')];
    if (!btns.length) return;
    const ids = btns.map(b => b.getAttribute("aria-controls"));
    const KEY = "tab:" + location.pathname.split("/").pop();
    function tab(id, focus) {
      if (!ids.includes(id)) id = ids[0];
      btns.forEach((b, i) => { const on = ids[i] === id; document.getElementById(ids[i]).hidden = !on; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
      try { localStorage.setItem(KEY, id); } catch (e) {}
      if (focus) btns[ids.indexOf(id)].focus();
      window.scrollTo({ top: 0 });
    }
    btns.forEach((b, i) => b.addEventListener("click", () => tab(ids[i])));
    document.querySelector(".tabs").addEventListener("keydown", e => {
      const i = ids.findIndex(id => !document.getElementById(id).hidden);
      if (e.key === "ArrowRight") tab(ids[(i + 1) % ids.length], true);
      if (e.key === "ArrowLeft") tab(ids[(i - 1 + ids.length) % ids.length], true);
    });
    document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => tab(b.dataset.go)));
    let t = location.hash.slice(1);
    if (!ids.includes(t)) { try { t = localStorage.getItem(KEY); } catch (e) {} }
    tab(t || ids[0]);
    window.SkillyTab = tab;
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
