import { SITE } from '@/lib/utils';
export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/checkout'] }], sitemap: `${SITE.url}/sitemap.xml` };
}
