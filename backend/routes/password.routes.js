import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.model.js';
import VerificationToken from '../models/VerificationToken.model.js';
import { sendPasswordResetEmail } from '../utils/email.utils.js';
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

// Forgot password - request password reset
router.post('/forgot-password',
  authLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email')
  ],
  validate,
  async (req, res) => {
    try {
      const { email } = req.body;

      // Don't reveal if email exists (security best practice)
      const user = await User.findOne({ email });

      if (user) {
        // Create password reset token
        const resetToken = await VerificationToken.createToken(
          user._id,
          'password-reset',
          1 // 1 hour expiration
        );

        // Send password reset email
        await sendPasswordResetEmail(user.email, resetToken.token, user.username);

        const requestInfo = getRequestInfo(req);
        await logAuditEvent({
          userId: user._id,
          action: 'password_reset',
          ...requestInfo,
          details: { action: 'request' },
          status: 'success'
        });

        logger.info(`Password reset requested for: ${user.email}`);
      }

      // Always return success message (don't reveal if email exists)
      res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({ message: 'Server error processing password reset request' });
    }
  }
);

// Reset password with token
router.post('/reset-password',
  authLimiter,
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
  ],
  validate,
  async (req, res) => {
    try {
      const { token, password } = req.body;

      const verification = await VerificationToken.verifyToken(token, 'password-reset');

      if (!verification.valid) {
        return res.status(400).json({ message: verification.error });
      }

      const user = await User.findById(verification.userId).select('+password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if password is in history
      const isInHistory = await user.isPasswordInHistory(password);
      if (isInHistory) {
        return res.status(400).json({
          message: 'You cannot use a password that you have used recently. Please choose a different password.'
        });
      }

      // Update password
      user.password = password;
      await user.save();

      // Delete used token
      await VerificationToken.deleteOne({ _id: verification.tokenDoc._id });

      // Invalidate all refresh tokens (force re-login)
      user.refreshToken = null;
      user.sessions = [];
      await user.save();

      const requestInfo = getRequestInfo(req);
      await logAuditEvent({
        userId: user._id,
        action: 'password_reset',
        ...requestInfo,
        details: { action: 'complete' },
        status: 'success'
      });

      logger.info(`Password reset completed for user: ${user.email}`);

      res.json({ message: 'Password reset successfully. Please login with your new password.' });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({ message: 'Server error during password reset' });
    }
  }
);

// Change password (requires authentication)
router.post('/change-password',
  authLimiter,
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
  ],
  validate,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id).select('+password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        const requestInfo = getRequestInfo(req);
        await logAuditEvent({
          userId: user._id,
          action: 'password_change',
          ...requestInfo,
          details: { action: 'failed', reason: 'invalid_current_password' },
          status: 'failure'
        });

        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Check if new password is same as current
      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return res.status(400).json({
          message: 'New password must be different from current password'
        });
      }

      // Check if password is in history
      const isInHistory = await user.isPasswordInHistory(newPassword);
      if (isInHistory) {
        return res.status(400).json({
          message: 'You cannot use a password that you have used recently. Please choose a different password.'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      const requestInfo = getRequestInfo(req);
      await logAuditEvent({
        userId: user._id,
        action: 'password_change',
        ...requestInfo,
        details: { action: 'success' },
        status: 'success'
      });

      logger.info(`Password changed for user: ${user.email}`);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({ message: 'Server error during password change' });
    }
  }
);

export default router;

