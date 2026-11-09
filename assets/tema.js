// Light / dark theme for the portal and the lessons. Loaded first in <head>, so the page never flashes the wrong theme.
// "skilly-tema" holds the choice ("light" | "dark"); without one the device setting decides. <html data-theme> always
// carries the resolved theme, so the CSS needs only :root[data-theme="dark"]. A lesson inside the portal frame
// follows a change made in the portal through the storage event.
(function () {
  const KEY = "skilly-tema", mq = window.matchMedia("(prefers-color-scheme: dark)");
  const choice = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const resolved = () => { const c = choice(); return c === "light" || c === "dark" ? c : (mq.matches ? "dark" : "light"); };
  const apply = () => { document.documentElement.dataset.theme = resolved(); };
  apply();
  mq.addEventListener("change", apply);
  window.addEventListener("storage", e => { if (e.key === KEY) apply(); });
  window.SkillyTema = {
    get: resolved,
    toggle() { const t = resolved() === "dark" ? "light" : "dark"; try { localStorage.setItem(KEY, t); } catch (e) {} apply(); return t; }
  };
})();
