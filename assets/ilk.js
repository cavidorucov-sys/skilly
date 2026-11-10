// Instant first paint: each page is drawn by app.js only after sign-in and the private plan are loaded (~0.5 s).
// Until then the last view of this page from this tab is shown, so moving between sections does not flash empty.
// app.js replaces it with the fresh page and saves a new copy when the page is left. The lesson page is not kept.
(function () {
  const p = document.body.dataset.page;
  if (!p || p === "ders") return;
  let h = null; try { h = sessionStorage.getItem("skilly-snap:" + p); } catch (e) {}
  if (!h) return;
  document.documentElement.classList.add("warm");
  document.body.insertAdjacentHTML("afterbegin", h);
})();
