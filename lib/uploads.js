// Enregistrement des fichiers téléversés dans data/uploads (servis par /api/files/<nom>).
// NB : sur un hébergement « serverless » (Vercel…), le disque n'est pas persistant —
// utilisez alors un VPS / hébergement Node classique, ou branchez Cloudinary/S3 ici.
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const DOC_TYPES = { ...IMAGE_TYPES, 'application/pdf': 'pdf' };

export async function saveUpload(file, prefix, { types = IMAGE_TYPES, maxBytes = 8 * 1024 * 1024 } = {}) {
  if (!file || typeof file === 'string') throw new Error('Aucun fichier reçu.');
  const ext = types[file.type];
  if (!ext) {
    if (/heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name || '')) throw new Error('Format HEIC (iPhone) non pris en charge : choisissez la photo depuis « Photos » ou réglez l’appareil sur « Le plus compatible » (JPG).');
    throw new Error(`Format non accepté (${Object.values(types).join(', ').toUpperCase()}).`);
  }
  if (file.size > maxBytes) throw new Error(`Fichier trop lourd (${Math.round(maxBytes / 1024 / 1024)} Mo max).`);
  const name = `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
  const dir = path.join(process.cwd(), 'data', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/api/files/${name}`;
}
