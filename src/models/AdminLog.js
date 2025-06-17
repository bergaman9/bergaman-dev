import mongoose from 'mongoose';

// Admin log schema
const adminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'login', 
      'logout', 
      'failed_login', 
      'create', 
      'update', 
      'delete', 
      'view',
      'password_change',
      'profile_update',
      'settings_update',
      'media_upload',
      'media_delete',
      'post_create',
      'post_update',
      'post_delete',
      'comment_approve',
      'comment_reject',
      'comment_delete',
      'contact_reply',
      'contact_delete',
      'portfolio_create',
      'portfolio_update',
      'portfolio_delete',
      'recommendation_create',
      'recommendation_update',
      'recommendation_delete',
      'other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexler
adminLogSchema.index({ timestamp: -1 });
adminLogSchema.index({ user: 1 });
adminLogSchema.index({ action: 1 });

// TTL index - 90 gün sonra logları otomatik sil
adminLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Model oluştur veya varsa getir
const AdminLog = mongoose.models.AdminLog || mongoose.model('AdminLog', adminLogSchema);

export default AdminLog; 