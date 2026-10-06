import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const srcDir = path.join(root, 'src', 'portrait-originals');
const outDir = path.join(root, 'public', 'portraits', 'artists');

const files = Array.from({ length: 18 }, (_, i) => `artist-${String(i + 1).padStart(2, '0')}.png`);

for (const file of files) {
  const full = path.join(srcDir, file);
  if (!fs.existsSync(full)) throw new Error(`Missing portrait: ${full}`);
}

const hashes = files.map(file => crypto.createHash('sha256').update(fs.readFileSync(path.join(srcDir, file))).digest('hex'));
if (new Set(hashes).size !== 18) throw new Error(`Expected 18 unique portraits; found ${new Set(hashes).size}`);

fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < files.length; i++) {
  const n = String(i + 1).padStart(2, '0');
  const input = path.join(srcDir, files[i]);
  const output = path.join(outDir, `artist-${n}.webp`);
  await sharp(input)
    .resize(768, 768, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88 })
    .toFile(output);
  console.log(`✅ artist-${n}.webp`);
}

console.log('\n🔥 Verified 18 unique PNG originals and created 18 production WebP portraits.');
