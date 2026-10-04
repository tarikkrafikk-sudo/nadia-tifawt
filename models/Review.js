import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    product: { type: String, required: true, index: true }, // slug du produit
    productName: String,
    name: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true, maxlength: 1200 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    featured: { type: Boolean, default: false }, // affiché sur la page d'accueil
    photos: [String], // photos envoyées par le client (3 max)
    verified: { type: Boolean, default: false }, // achat vérifié (n° de commande correspondant)
    orderRef: String, // jamais affiché publiquement
    source: { type: String, enum: ['site', 'whatsapp', 'instagram', 'boutique'], default: 'site' },
    reply: String, // réponse de la marque
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
