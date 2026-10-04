'use client';
// Redimensionne une photo (téléphone ou PC) avant envoi : max 1600 px, JPEG 85 %.
// Rend les envois rapides même en 4G et évite les fichiers de 10 Mo.
export async function prepareImage(file, { max = 1600, quality = 0.85 } = {}) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob) return file;
    return new File([blob], (file.name || 'photo').replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file; // format non décodable (ex. HEIC sur PC) : le serveur renverra un message clair
  }
}

export async function uploadImage(file, endpoint, extra = {}) {
  const ready = await prepareImage(file);
  const fd = new FormData();
  fd.append('file', ready);
  Object.entries(extra).forEach(([k, v]) => fd.append(k, v));
  const res = await fetch(endpoint, { method: 'POST', body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Échec de l’envoi');
  return data.url;
}
