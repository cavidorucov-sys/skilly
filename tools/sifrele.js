// Encrypts a private JSON file for the public site:  node tools/sifrele.js <key file> <input.json> <output.enc.json>
// AES-256-GCM; the key (base64, 32 bytes) is kept outside this repo and in Firestore gizli/acar (readable only by
// Fikrət's and his father's accounts). The site decrypts with Skilly.gizli(name) in assets/jurnal.js.
const fs = require("fs"), { webcrypto: { subtle }, randomBytes } = require("crypto");
const [keyFile, input, output] = process.argv.slice(2);
if (!output) { console.error("usage: node tools/sifrele.js <key file> <input.json> <output.enc.json>"); process.exit(1); }
(async () => {
  const text = fs.readFileSync(input, "utf8");
  JSON.parse(text); // refuse to publish a broken file
  const key = await subtle.importKey("raw", Buffer.from(fs.readFileSync(keyFile, "utf8").trim(), "base64"), "AES-GCM", false, ["encrypt"]);
  const iv = randomBytes(12);
  const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, Buffer.from(text, "utf8"));
  fs.writeFileSync(output, JSON.stringify({ v: 1, iv: iv.toString("base64"), ct: Buffer.from(ct).toString("base64") }) + "\n");
  console.log(output, "←", input);
})();
