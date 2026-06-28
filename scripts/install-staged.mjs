// Install curated staged photos into public/players + patch src/lib/player-photos.ts.
// Reads /tmp/photo-staging/_meta.json; skips any ids passed as a comma list to reject.
//   node scripts/install-staged.mjs [reject-id,reject-id,...]
import fs from "node:fs";
import path from "node:path";

const STAGE = "/tmp/photo-staging";
const meta = JSON.parse(fs.readFileSync(path.join(STAGE, "_meta.json"), "utf8"));
const reject = new Set((process.argv[2] || "").split(",").map((s) => s.trim()).filter(Boolean));

const PUB = path.join(process.cwd(), "public", "players");
const MAN = path.join(process.cwd(), "src", "lib", "player-photos.ts");
const esc = (v) => String(v ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s+/g, " ").trim();

let man = fs.readFileSync(MAN, "utf8");
const added = [], updated = [], skipped = [];

for (const m of meta) {
  if (reject.has(m.id)) { skipped.push(m.id); continue; }
  const src = path.join(STAGE, `${m.id}.jpg`);
  if (!fs.existsSync(src)) { skipped.push(m.id); continue; }
  fs.copyFileSync(src, path.join(PUB, `${m.id}.jpg`));
  const line = `  "${m.id}": { src: "/players/${m.id}.jpg", author: "${esc(m.author)}", license: "${esc(m.license)}", licenseUrl: "${esc(m.licenseUrl)}", source: "${esc(m.filePage)}" },`;
  const re = new RegExp(`^  "${m.id}": \\{.*$`, "m");
  if (re.test(man)) { man = man.replace(re, line); updated.push(m.id); }
  else { man = man.replace(/\n};\n\nexport function playerPhoto/, `\n${line}\n};\n\nexport function playerPhoto`); added.push(m.id); }
}

fs.writeFileSync(MAN, man);
console.log(`added ${added.length}: ${added.join(", ")}`);
console.log(`updated ${updated.length}: ${updated.join(", ")}`);
if (skipped.length) console.log(`skipped ${skipped.length}: ${skipped.join(", ")}`);
