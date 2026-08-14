import mongoose from 'mongoose';

const RateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
}, { versionKey: false });

export default mongoose.models.RateLimit || mongoose.model('RateLimit', RateLimitSchema);
