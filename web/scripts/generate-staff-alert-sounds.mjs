/**
 * Generates placeholder alert WAV files for staff dashboard.
 * Run: node web/scripts/generate-staff-alert-sounds.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "sounds");

function writeWav(filePath, segments) {
  const sampleRate = 44100;
  const samples = [];
  for (const seg of segments) {
    const { freq, duration, gain = 0.35 } = seg;
    const n = Math.floor(sampleRate * duration);
    for (let i = 0; i < n; i++) {
      const t = i / sampleRate;
      const env = Math.min(1, i / 400) * Math.min(1, (n - i) / 400);
      samples.push(Math.sin(2 * Math.PI * freq * t) * gain * env);
    }
    const gap = Math.floor(sampleRate * (seg.gap ?? 0.06));
    for (let i = 0; i < gap; i++) samples.push(0);
  }
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(v * 32767), 44 + i * 2);
  }
  fs.writeFileSync(filePath, buffer);
}

const presets = {
  "classic-bell": [
    { freq: 880, duration: 0.12 },
    { freq: 1174, duration: 0.18, gain: 0.4 },
    { freq: 880, duration: 0.14 },
  ],
  "diner-ding": [
    { freq: 1200, duration: 0.08, gain: 0.45 },
    { freq: 1500, duration: 0.22, gain: 0.38 },
  ],
  "kitchen-buzzer": [
    { freq: 220, duration: 0.15, gain: 0.5 },
    { freq: 220, duration: 0.15, gain: 0.5, gap: 0.04 },
    { freq: 220, duration: 0.15, gain: 0.5 },
  ],
  "double-beep": [
    { freq: 980, duration: 0.1, gain: 0.42 },
    { freq: 980, duration: 0.1, gain: 0.42, gap: 0.12 },
  ],
  "long-alert": [
    { freq: 740, duration: 0.35, gain: 0.4 },
    { freq: 988, duration: 0.45, gain: 0.38 },
  ],
};

fs.mkdirSync(outDir, { recursive: true });
for (const [name, segments] of Object.entries(presets)) {
  const file = path.join(outDir, `${name}.wav`);
  writeWav(file, segments);
  console.log("Wrote", file);
}

fs.writeFileSync(
  path.join(outDir, "README.txt"),
  `Staff alert sounds (placeholder WAV — replace with final assets anytime).\n` +
    `Files: ${Object.keys(presets).join(", ")}.wav\n` +
    `Regenerate: node web/scripts/generate-staff-alert-sounds.mjs\n`
);

console.log("Done.");
