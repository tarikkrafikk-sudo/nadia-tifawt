// Téléversement d'images (et PDF pour l'attestation) vers Cloudinary.
// Variables d'environnement (Render → Environment) :
//   CLOUDINARY_CLOUD_NAME=eewe1vjr   CLOUDINARY_API_KEY=…   CLOUDINARY_API_SECRET=…
// Rien n'est exécuté au chargement du module : le build ne casse jamais si une variable manque.
import { v2 as cloudinary } from 'cloudinary';

const FOLDER = 'nadia-tifawt';
const MAX_BYTES = 10 * 1024 * 1024; // 10 Mo

export const IMAGE_TYPES = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/pjpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'image/gif': 'gif', 'image/heic': 'heic', 'image/heif': 'heif', 'image/avif': 'avif',
};
export const DOC_TYPES = { ...IMAGE_TYPES, 'application/pdf': 'pdf' };

let configured = false;
function getCloudinary() {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const api_key = (process.env.CLOUDINARY_API_KEY || '').trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || '').trim();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Cloudinary non configuré : ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans Render → Environment.');
  }
  if (!configured) {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    configured = true;
  }
  return cloudinary;
}

// Reconnaît le vrai type à partir des premiers octets (iPhone envoie parfois un type vide ou « application/octet-stream »)
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

function isAccepted(type, { allowPdf = false } = {}) {
  if (!type) return false;
  if (type.startsWith('image/')) return true;
  return allowPdf && type === 'application/pdf';
}

async function readFile(file) {
  if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') throw new Error('Aucun fichier reçu.');
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!buffer.length) throw new Error('Fichier vide.');
  const declared = String(file.type || '').toLowerCase();
  const detected = sniff(buffer);
  const type = declared.startsWith('image/') || declared === 'application/pdf' ? declared : detected || declared;
  return { buffer, type };
}

async function uploadBuffer(buffer, type, { publicId, isPdf } = {}) {
  const cld = getCloudinary();
  const dataUri = `data:${type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
  const isHeic = /heic|heif/.test(type);
  const result = await cld.uploader.upload(dataUri, {
    folder: FOLDER,
    resource_type: isPdf ? 'auto' : 'image',
    ...(publicId ? { public_id: publicId } : {}),
    ...(isHeic ? { format: 'jpg' } : {}), // photos iPhone HEIC converties en JPG lisible partout
  });
  return result.secure_url;
}

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
  return getCloudinary().uploader.destroy(publicId, { resource_type: 'image' });
}

/**
 * Compatibilité avec les routes existantes : saveUpload(file, prefix, { types, maxBytes }).
 * Accepte aussi l'ancienne signature saveUpload(file, prefix, types, maxBytes).
 */
export async function saveUpload(file, prefix = 'fichier', opts = {}, legacyMax) {
  const types = opts && opts.types ? opts.types : opts && typeof opts === 'object' && !('maxBytes' in opts) ? opts : IMAGE_TYPES;
  const maxBytes = (opts && opts.maxBytes) || legacyMax || MAX_BYTES;
  const allowPdf = Boolean(types['application/pdf']);
  const { buffer, type } = await readFile(file);
  if (!isAccepted(type, { allowPdf })) throw new Error(`Type non accepté : ${type || 'inconnu'}. Formats acceptés : images${allowPdf ? ' et PDF' : ''}.`);
  if (buffer.length > maxBytes) throw new Error(`Fichier trop lourd (${Math.round(maxBytes / 1024 / 1024)} Mo max).`);
  const publicId = `${String(prefix).replace(/[^\w-]/g, '')}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return uploadBuffer(buffer, type, { publicId, isPdf: type === 'application/pdf' });
}
