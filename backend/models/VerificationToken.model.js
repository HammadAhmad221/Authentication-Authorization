import mongoose from 'mongoose';
import crypto from 'node:crypto';

const verificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['email', 'password-reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete expired tokens
  }
}, {
  timestamps: true
});

// Generate token
verificationTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Create token for user
verificationTokenSchema.statics.createToken = async function(userId, type, expiresInHours = 24) {
  // Delete any existing tokens of this type for the user
  await this.deleteMany({ userId, type });

  const token = this.generateToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  return this.create({
    userId,
    token,
    type,
    expiresAt
  });
};

// Verify token
verificationTokenSchema.statics.verifyToken = async function(token, type) {
  const tokenDoc = await this.findOne({ token, type });

  if (!tokenDoc) {
    return { valid: false, error: 'Invalid token' };
  }

  if (tokenDoc.expiresAt < new Date()) {
    await this.deleteOne({ _id: tokenDoc._id });
    return { valid: false, error: 'Token expired' };
  }

  return { valid: true, userId: tokenDoc.userId, tokenDoc };
};

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

export default VerificationToken;

