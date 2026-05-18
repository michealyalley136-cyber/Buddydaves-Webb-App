/**
 * Downloads the staff order-announcement clip from YouTube into public/sounds/.
 * Source: https://youtu.be/ii8zdA_teQE
 *
 * Requires: pip install yt-dlp
 * Run from repo root: node web/scripts/download-order-announcement.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "sounds");
const url = "https://youtu.be/ii8zdA_teQE";
const baseName = "buddy-daves-announcement";

fs.mkdirSync(outDir, { recursive: true });

for (const f of fs.readdirSync(outDir)) {
  if (f.startsWith(baseName + ".")) fs.unlinkSync(path.join(outDir, f));
}

const outTemplate = path.join(outDir, `${baseName}.%(ext)s`);
execSync(
  `python -m yt_dlp -f "bestaudio[ext=m4a]/bestaudio/best" -o "${outTemplate}" --no-playlist "${url}"`,
  { stdio: "inherit" }
);

const written = fs.readdirSync(outDir).find((f) => f.startsWith(baseName + "."));
console.log(written ? `Saved: public/sounds/${written}` : "Download may have failed — check output above.");
