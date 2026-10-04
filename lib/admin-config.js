// Mot de passe admin par défaut — utilisé si ADMIN_PASSWORD n'est pas défini dans .env.local.
// ⚠️ Changez-le avant la mise en ligne (dans .env.local : ADMIN_PASSWORD=...).
export const DEFAULT_ADMIN_PASSWORD = 'Tifawt-Miel-2026!';
export const adminPassword = () => process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
export const usingDefaultPassword = () => !process.env.ADMIN_PASSWORD?.trim();
