import fs from 'fs/promises';
import path from 'path';

const MIME = { pdf: 'application/pdf', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

// Sert les fichiers téléversés depuis l'admin (data/uploads)
export async function GET(_req, { params }) {
  const name = path.basename(params.name);
  const ext = name.split('.').pop().toLowerCase();
  if (!MIME[ext]) return new Response('Not found', { status: 404 });
  try {
    const buf = await fs.readFile(path.join(process.cwd(), 'data', 'uploads', name));
    return new Response(buf, { headers: { 'Content-Type': MIME[ext], 'Cache-Control': 'public, max-age=86400' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
