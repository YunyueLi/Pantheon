// One-shot (idempotent) image optimizer: convert every public/players/*.jpg to a
// sibling *.webp resized to a max 800px long edge (quality 80), then delete the
// original .jpg. Re-runnable — skips any jpg whose .webp already exists and is
// newer than it. Usage: node scripts/optimize-photos.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUB = path.join(process.cwd(), "public", "players");
const jpgs = fs.readdirSync(PUB).filter((f) => f.toLowerCase().endsWith(".jpg"));

let converted = 0,
  skipped = 0,
  bytesBefore = 0,
  bytesAfter = 0;

for (const name of jpgs) {
  const jpg = path.join(PUB, name);
  const webp = path.join(PUB, name.replace(/\.jpg$/i, ".webp"));

  // Idempotent guard: if a same-named .webp already exists and is newer, drop the
  // stale .jpg (if present) and move on.
  if (fs.existsSync(webp) && fs.statSync(webp).mtimeMs >= fs.statSync(jpg).mtimeMs) {
    skipped++;
    fs.rmSync(jpg, { force: true });
    continue;
  }

  bytesBefore += fs.statSync(jpg).size;
  await sharp(jpg)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(webp);
  bytesAfter += fs.statSync(webp).size;
  fs.rmSync(jpg, { force: true });
  converted++;
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(`converted ${converted}, skipped ${skipped} (already up-to-date)`);
console.log(`before: ${mb(bytesBefore)} MB  →  after: ${mb(bytesAfter)} MB  (saved ${mb(bytesBefore - bytesAfter)} MB)`);
