import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  { product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, slug: String, name: String, image: String, price: Number, quantity: Number },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, index: true },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
      city: { type: String, required: true },
      address: { type: String, required: true },
      notes: String,
    },
    shippingZone: { type: String, enum: ['oujda', 'agadir', 'maroc'], default: 'maroc' },
    locale: { type: String, enum: ['fr', 'ar', 'en'], default: 'fr' }, // langue de la commande (e-mail client)
    items: [OrderItemSchema],
    subtotal: Number,
    shippingFee: Number,
    total: Number,
    paymentMethod: { type: String, enum: ['cod', 'wafacash', 'mopay', 'cmi'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    status: { type: String, enum: ['nouvelle', 'confirmee', 'expediee', 'livree', 'annulee'], default: 'nouvelle', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    locale: { type: String, enum: ['fr', 'ar', 'en'], default: 'fr' }, // langue du client
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
