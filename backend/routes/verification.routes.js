import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.model.js';
import VerificationToken from '../models/VerificationToken.model.js';
import { sendVerificationEmail } from '../utils/email.utils.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../utils/rateLimiter.js';
import { logAuditEvent, getRequestInfo } from '../utils/auditLogger.js';
import logger from '../utils/logger.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Verify email
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const verification = await VerificationToken.verifyToken(token, 'email');

    if (!verification.valid) {
      return res.status(400).json({ message: verification.error });
    }

    const user = await User.findById(verification.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.isVerified = true;
    await user.save();

    // Delete used token
    await VerificationToken.deleteOne({ _id: verification.tokenDoc._id });

    const requestInfo = getRequestInfo(req);
    await logAuditEvent({
      userId: user._id,
      action: 'email_verification',
      ...requestInfo,
      details: { email: user.email },
      status: 'success'
    });

    logger.info(`Email verified for user: ${user.email}`);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

// Resend verification email
router.post('/resend-verification',
  authLimiter,
  authenticate,
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Email already verified' });
      }

      // Create new verification token
      const verificationToken = await VerificationToken.createToken(
        user._id,
        'email',
        24 // 24 hours
      );

      // Send verification email
      await sendVerificationEmail(user.email, verificationToken.token, user.username);

      const requestInfo = getRequestInfo(req);
      await logAuditEvent({
        userId: user._id,
        action: 'email_verification',
        ...requestInfo,
        details: { action: 'resend' },
        status: 'success'
      });

      res.json({ message: 'Verification email sent successfully' });
    } catch (error) {
      logger.error('Resend verification error:', error);
      res.status(500).json({ message: 'Server error sending verification email' });
    }
  }
);

export default router;

