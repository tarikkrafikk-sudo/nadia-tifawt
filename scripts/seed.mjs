// Usage : npm run seed   (nécessite MONGODB_URI dans .env.local)
import fs from 'fs';
import mongoose from 'mongoose';
import { PRODUCTS } from '../lib/catalog.js';

const env = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
const uri = process.env.MONGODB_URI || env.match(/^MONGODB_URI=(.+)$/m)?.[1]?.trim();
if (!uri) { console.error('✖ MONGODB_URI manquant dans .env.local'); process.exit(1); }

const opts = { strict: false, timestamps: true };
const Product = mongoose.model('Product', new mongoose.Schema({}, opts));
const Review = mongoose.model('Review', new mongoose.Schema({}, opts));
await mongoose.connect(uri);
for (const { rating, reviewsCount, ...p } of PRODUCTS) await Product.updateOne({ slug: p.slug }, { $setOnInsert: { active: true, ...p } }, { upsert: true });
for (const p of PRODUCTS) {
  const ok = await Review.find({ product: p.slug, status: 'approved' }).lean();
  await Product.updateOne({ slug: p.slug }, { reviewsCount: ok.length, rating: ok.length ? Math.round((ok.reduce((a, r) => a + r.rating, 0) / ok.length) * 10) / 10 : 0 });
}
console.log(`✔ ${PRODUCTS.length} produits importés dans MongoDB`);
await mongoose.disconnect();
