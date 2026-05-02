import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  clientHashes: [{
    type: String,
    required: true,
  }],
}, {
  timestamps: true,
});

LikeSchema.index({ slug: 1, clientHashes: 1 });

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);
