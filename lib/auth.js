// Auth admin minimaliste : mot de passe (ADMIN_PASSWORD) -> cookie signé HMAC.
// Compatible Edge runtime (middleware) grâce à Web Crypto.
export const ADMIN_COOKIE = 'nt_admin';

const enc = new TextEncoder();
const secret = () => process.env.ADMIN_SECRET || 'dev-secret-change-me';

async function hmac(value) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createToken() {
  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12 h
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifyToken(token) {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return sig === (await hmac(exp));
}
