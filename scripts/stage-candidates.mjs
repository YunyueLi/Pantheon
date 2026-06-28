// Download the photo-sourcing workflow's candidates into a STAGING dir for manual
// curation — never touches public/players or the manifest. For each player, tries
// candidates in rank order until one downloads + validates as an image.
//   node scripts/stage-candidates.mjs <workflow-output.json>
// Output: /tmp/photo-staging/<id>.jpg + /tmp/photo-staging/_meta.json
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const OUT = process.argv[2];
if (!OUT) { console.error("usage: node scripts/stage-candidates.mjs <output.json>"); process.exit(1); }
const raw = fs.readFileSync(OUT, "utf8");
let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  const a = raw.indexOf("["), o = raw.indexOf("{");
  if (a !== -1 && (o === -1 || a < o)) parsed = JSON.parse(raw.slice(a, raw.lastIndexOf("]") + 1));
  else parsed = JSON.parse(raw.slice(o, raw.lastIndexOf("}") + 1));
}
const arr = Array.isArray(parsed) ? parsed : (parsed.result || parsed.results || parsed.data || []);
const results = arr.filter((r) => r && r.found && (r.candidates || []).length && r.id);
const notfound = arr.filter((r) => r && !r.found).map((r) => r.id);

const STAGE = "/tmp/photo-staging";
fs.mkdirSync(STAGE, { recursive: true });
const UA = "PantheonBot/1.0 (https://pantheon.ungetsu.net; yunyue.li@mirofish.ai)";
const meta = [], failed = [];

for (const r of results) {
  const dest = path.join(STAGE, `${r.id}.jpg`);
  const tmp = `${dest}.tmp`;
  let chosen = null;
  for (const c of r.candidates) {
    const url = c.imageUrl || c.url;
    if (!url || !/^https?:\/\//.test(url)) continue;
    try {
      execFileSync("curl", ["-sL", "--fail", "--max-time", "45", "-A", UA, "-o", tmp, url], { stdio: "ignore" });
      execFileSync("sips", ["-Z", "1100", "-s", "format", "jpeg", "-s", "formatOptions", "86", tmp, "--out", dest], { stdio: "ignore" });
      fs.rmSync(tmp, { force: true });
      if (fs.statSync(dest).size < 3000) throw new Error("too small");
      chosen = c;
      break;
    } catch {
      fs.rmSync(tmp, { force: true });
      fs.rmSync(dest, { force: true });
    }
  }
  if (!chosen) { failed.push(r.id); continue; }
  meta.push({
    id: r.id, sport: r.sport || "", name: r.name || "",
    imageUrl: chosen.imageUrl || chosen.url || "",
    filePage: chosen.filePage || chosen.sourcePage || "",
    license: chosen.license || "", licenseUrl: chosen.licenseUrl || "",
    author: chosen.author || "", framing: chosen.framing || "",
  });
}

fs.writeFileSync(path.join(STAGE, "_meta.json"), JSON.stringify(meta, null, 2));
console.log(`staged ${meta.length} → ${STAGE}`);
if (failed.length) console.log(`download-failed ${failed.length}: ${failed.join(", ")}`);
if (notfound.length) console.log(`agent-not-found ${notfound.length}: ${notfound.join(", ")}`);
