import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'register',
      'password_change',
      'password_reset',
      'email_verification',
      'email_change',
      'role_change',
      'profile_update',
      'account_lock',
      'account_unlock',
      'token_refresh',
      'session_create',
      'session_destroy'
    ],
    index: true
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'error'],
    default: 'success'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for common queries
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;

