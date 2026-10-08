import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAr: String,
    // Traductions : { en: { name, shortDescription, description, ingredients, usage, size }, ar: {...} }
    i18n: { type: mongoose.Schema.Types.Mixed, default: {} },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, enum: ['zoyout', 'miel', 'amlou', 'tbrima', 'cosmetiques'], required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: Number,
    size: String,
    stock: { type: Number, default: 0, min: 0 },
    images: [String],
    shortDescription: String,
    description: String,
    ingredients: String,
    usage: String,
    bestseller: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    // Calculés automatiquement à partir des avis approuvés
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },

  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
