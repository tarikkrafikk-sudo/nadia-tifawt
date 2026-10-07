import crypto from "crypto";
import cloudinary from "./cloudinary.js";

export const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const DOC_TYPES = { ...IMAGE_TYPES, 'application/pdf': 'pdf' };

export async function saveUpload(file, prefix, types = IMAGE_TYPES, maxBytes = 8 * 1024 * 1024) {
  if (typeof file === 'string') throw new Error("Ancien fichier reçu.");
  if (!types[file.type]) throw new Error(`Type non accepté: ${file.type}`);
  if (file.size > maxBytes) throw new Error(`Fichier trop lourd.`);
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
  const randomName = `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const result = await cloudinary.uploader.upload(base64, { folder: 'nadia-tifawt', public_id: randomName, resource_type: 'auto' });
  return result.secure_url;
}
