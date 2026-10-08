// Téléversement d'images (et PDF pour l'attestation) vers Cloudinary — via l'API HTTP officielle,
// SANS le paquet npm « cloudinary » : rien à charger au build, donc le build ne peut pas casser ici.
//
// Variables d'environnement (Render → Environment) :
//   CLOUDINARY_CLOUD_NAME=eewe1vjr   CLOUDINARY_API_KEY=…   CLOUDINARY_API_SECRET=…
//   (ou seulement CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@eewe1vjr)
import crypto from 'crypto';

const FOLDER = 'nadia-tifawt';
const MAX_BYTES = 10 * 1024 * 1024; // 10 Mo

export const IMAGE_TYPES = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/pjpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'image/gif': 'gif', 'image/heic': 'heic', 'image/heif': 'heif', 'image/avif': 'avif',
};
export const DOC_TYPES = { ...IMAGE_TYPES, 'application/pdf': 'pdf' };

/* ───────── configuration (lue seulement au moment d'un envoi) ───────── */
function getConfig() {
  let cloud = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  let key = (process.env.CLOUDINARY_API_KEY || '').trim();
  let secret = (process.env.CLOUDINARY_API_SECRET || '').trim();
  const url = (process.env.CLOUDINARY_URL || '').trim();
  const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (m) { key ||= m[1]; secret ||= m[2]; cloud ||= m[3]; }
  if (!cloud || !key || !secret) {
    throw new Error('Cloudinary non configuré : ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans Render → Environment.');
  }
  return { cloud, key, secret };
}

// Signature Cloudinary : paramètres triés « a=1&b=2 » + secret, en SHA-1
function sign(params, secret) {
  const str = Object.keys(params).filter((k) => params[k] !== undefined && params[k] !== '').sort()
    .map((k) => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + secret).digest('hex');
}

async function callCloudinary(path, params) {
  const { cloud, key, secret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const { file, ...signed } = { ...params, timestamp };
  const body = new FormData();
  for (const [k, v] of Object.entries(signed)) if (v !== undefined && v !== '') body.append(k, String(v));
  if (file) body.append('file', file);
  body.append('api_key', key);
  body.append('signature', sign(signed, secret));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${path}`, { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Cloudinary : ${data?.error?.message || `erreur HTTP ${res.status}`}`);
  return data;
}

/* ───────── détection du type (iPhone envoie parfois un type vide) ───────── */
function sniff(buf) {
  const hex = buf.subarray(0, 12).toString('hex');
  const ascii = buf.subarray(0, 12).toString('latin1');
  if (hex.startsWith('ffd8ff')) return 'image/jpeg';
  if (hex.startsWith('89504e47')) return 'image/png';
  if (ascii.startsWith('GIF8')) return 'image/gif';
  if (ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP') return 'image/webp';
  if (ascii.slice(4, 8) === 'ftyp') {
    const brand = ascii.slice(8, 12).toLowerCase();
    if (brand.startsWith('avif')) return 'image/avif';
    if (['heic', 'heix', 'hevc', 'heim', 'heis', 'mif1', 'msf1'].includes(brand)) return 'image/heic';
  }
  if (ascii.startsWith('%PDF')) return 'application/pdf';
  return '';
}

const isAccepted = (type, allowPdf = false) =>
  Boolean(type) && (type.startsWith('image/') || (allowPdf && type === 'application/pdf'));

async function readFile(file) {
  if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') throw new Error('Aucun fichier reçu.');
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!buffer.length) throw new Error('Fichier vide.');
  const declared = String(file.type || '').toLowerCase();
  const type = declared.startsWith('image/') || declared === 'application/pdf' ? declared : sniff(buffer) || declared;
  return { buffer, type };
}

async function uploadBuffer(buffer, type, publicId) {
  const isPdf = type === 'application/pdf';
  const isHeic = /heic|heif/.test(type);
  const data = await callCloudinary(`${isPdf ? 'auto' : 'image'}/upload`, {
    file: `data:${type || 'image/jpeg'};base64,${buffer.toString('base64')}`,
    folder: FOLDER,
    public_id: publicId,
    format: isHeic ? 'jpg' : undefined, // photos iPhone HEIC converties en JPG lisible partout
  });
  return data.secure_url;
}

/* ───────── API publique ───────── */

/** Téléverse une image (File reçu via formData) et renvoie son URL https Cloudinary. */
export async function uploadImage(file) {
  const { buffer, type } = await readFile(file);
  if (!isAccepted(type)) throw new Error(`Type non accepté : ${type || 'inconnu'}. Envoyez une photo (JPG, PNG, WEBP, HEIC…).`);
  if (buffer.length > MAX_BYTES) throw new Error('Fichier trop lourd (10 Mo max).');
  return uploadBuffer(buffer, type);
}

/** Supprime une image Cloudinary à partir de son public_id (ex. « nadia-tifawt/produit-123 ») ou de son URL. */
export async function deleteImage(publicIdOrUrl) {
  if (!publicIdOrUrl) return { result: 'not found' };
  let publicId = String(publicIdOrUrl);
  const m = publicId.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-z0-9]+$/i);
  if (m) publicId = m[1];
  return callCloudinary('image/destroy', { public_id: publicId });
}

/** Utilisé par les routes : saveUpload(file, prefix, { types, maxBytes }) — accepte aussi (file, prefix, types, maxBytes). */
export async function saveUpload(file, prefix = 'fichier', opts = {}, legacyMax) {
  const types = opts?.types || (opts && !('maxBytes' in opts) && Object.keys(opts).length ? opts : IMAGE_TYPES);
  const maxBytes = opts?.maxBytes || legacyMax || MAX_BYTES;
  const allowPdf = Boolean(types['application/pdf']);
  const { buffer, type } = await readFile(file);
  if (!isAccepted(type, allowPdf)) throw new Error(`Type non accepté : ${type || 'inconnu'}. Formats acceptés : images${allowPdf ? ' et PDF' : ''}.`);
  if (buffer.length > maxBytes) throw new Error(`Fichier trop lourd (${Math.round(maxBytes / 1024 / 1024)} Mo max).`);
  const publicId = `${String(prefix).replace(/[^\w-]/g, '')}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
  return uploadBuffer(buffer, type, publicId);
}
