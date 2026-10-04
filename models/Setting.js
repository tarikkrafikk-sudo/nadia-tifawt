import mongoose from 'mongoose';

// Document unique (key: 'site') pour les réglages modifiables depuis l'admin.
const SettingSchema = new mongoose.Schema(
  { key: { type: String, unique: true, default: 'site' }, data: { type: mongoose.Schema.Types.Mixed, default: {} } },
  { timestamps: true, minimize: false }
);

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
