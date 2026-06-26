// Merge the portrait-candidate workflow output into the existing manifest:
// download each returned player's TOP candidate, overwrite + downsize, and patch
// (or append) that player's line in src/lib/player-photos.ts. Players not in the
// output are left untouched. Usage: node scripts/merge-candidates.mjs <output.json>
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const OUT = process.argv[2];
const raw = fs.readFileSync(OUT, "utf8");
const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
const data = parsed.result || parsed;
const results = (data.results || []).filter((r) => r && r.found && (r.candidates || []).length && r.id);

const PUB = path.join(process.cwd(), "public", "players");
const MAN = path.join(process.cwd(), "src", "lib", "player-photos.ts");
const UA = "PantheonBot/1.0 (https://pantheon.ungetsu.net; yunyue.li@mirofish.ai)";
const esc = (v) => String(v ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s+/g, " ").trim();

let man = fs.readFileSync(MAN, "utf8");
const updated = [], added = [], failed = [];

for (const r of results) {
  const dest = path.join(PUB, `${r.id}.jpg`);
  const tmp = `${dest}.tmp`;
  let chosen = null;
  // Try candidates in rank order until one downloads; write via temp so a failure
  // never deletes a pre-existing good file.
  for (const c of r.candidates) {
    try {
      execFileSync("curl", ["-sL", "--fail", "--max-time", "45", "-A", UA, "-o", tmp, c.url], { stdio: "ignore" });
      execFileSync("sips", ["-Z", "1000", "-s", "formatOptions", "82", tmp], { stdio: "ignore" });
      if (fs.readFileSync(tmp).length < 3000) throw new Error("too small");
      fs.renameSync(tmp, dest);
      chosen = c;
      break;
    } catch {
      fs.rmSync(tmp, { force: true });
    }
  }
  if (!chosen) {
    failed.push(r.id);
    continue;
  }
  const c = chosen;
  const line = `  "${r.id}": { src: "/players/${r.id}.jpg", author: "${esc(c.author)}", license: "${esc(c.license)}", licenseUrl: "${esc(c.licenseUrl)}", source: "${esc(c.sourcePage)}" },`;
  const re = new RegExp(`^  "${r.id}": \\{.*$`, "m");
  if (re.test(man)) {
    man = man.replace(re, line);
    updated.push(r.id);
  } else {
    man = man.replace(/\n};\n\nexport function playerPhoto/, `\n${line}\n};\n\nexport function playerPhoto`);
    added.push(r.id);
  }
}

fs.writeFileSync(MAN, man);
console.log(`updated ${updated.length}: ${updated.join(", ")}`);
console.log(`added ${added.length}: ${added.join(", ")}`);
if (failed.length) console.log(`FAILED ${failed.length}: ${failed.join(" | ")}`);
