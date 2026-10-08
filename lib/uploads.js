import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
];

export async function uploadImage(file) {
  if (!file) throw new Error('No file provided');
  
  if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
    throw new Error(`Type non accepté: ${file.type}`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: 'nadia-tifawt',
    resource_type: 'image',
  });

  return result.secure_url;
}

export async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId);
}
