import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true, sparse: true, lowercase: true },
    phone: { type: String, index: true },
    passwordHash: String, // bcrypt/argon2 — à brancher si vous ajoutez les comptes clients
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [{ label: String, city: String, address: String }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
