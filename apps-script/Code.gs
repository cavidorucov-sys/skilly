// Skilly — səhv jurnalı backend. Paste into Extensions → Apps Script of the Google Sheet, set the
// script property SKILLY_KEY, deploy as a web app (Execute as: Me, Who has access: Anyone).
// The key keeps the public web-app URL from being read or written by others.
const SHEET = "Səhvlər";
const COLS = ["id", "tarix", "fenn", "movzu", "menbe", "sual", "cavab", "duz", "kat", "yol", "status", "novbeti", "tekrar", "bos", "link", "upd", "json"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(COLS); sh.setFrozenRows(1); }
  return sh;
}
// Run once from the editor: grants permissions and creates the "Səhvlər" sheet.
function setup() { sheet_(); }
function out_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function keyOk_(k) { return k && k === PropertiesService.getScriptProperties().getProperty("SKILLY_KEY"); }

function doGet(e) {
  if (!keyOk_(e.parameter.key)) return out_({ ok: false, error: "key" });
  const rows = sheet_().getDataRange().getValues().slice(1);
  const j = COLS.indexOf("json");
  return out_({ ok: true, items: rows.filter(r => r[j]).map(r => JSON.parse(r[j])) });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (!keyOk_(body.key)) return out_({ ok: false, error: "key" });
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = sheet_();
    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
    (body.items || []).forEach(it => {
      const row = COLS.map(c => c === "json" ? JSON.stringify(it) : (it[c] === undefined || it[c] === null ? "" : it[c]));
      const i = ids.indexOf(String(it.id));
      if (i > 0) {
        const cur = sh.getRange(i + 1, COLS.indexOf("upd") + 1).getValue();
        if (Number(cur) <= Number(it.upd)) sh.getRange(i + 1, 1, 1, COLS.length).setValues([row]);
      } else { sh.appendRow(row); ids.push(String(it.id)); }
    });
    return out_({ ok: true });
  } finally { lock.releaseLock(); }
}
