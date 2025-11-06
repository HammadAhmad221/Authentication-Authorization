import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.model.js';
import VerificationToken from '../models/VerificationToken.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../utils/rateLimiter.js';
import { sendVerificationEmail } from '../utils/email.utils.js';
import { logAuditEvent, getRequestInfo } from '../utils/auditLogger.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register
router.post('/register', 
  authLimiter,
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
  ],
  validate,
  async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email 
            ? 'Email already registered' 
            : 'Username already taken'
        });
      }

      // Prevent role escalation - users cannot register as admin
      const allowedRole = role && ['user', 'moderator'].includes(role) ? role : 'user';

      // Create new user
      const user = new User({
        username,
        email,
        password,
        role: allowedRole
      });

      await user.save();

      // Create email verification token
      const verificationToken = await VerificationToken.createToken(
        user._id,
        'email',
        24 // 24 hours
      );

      // Send verification email
      try {
        await sendVerificationEmail(user.email, verificationToken.token, user.username);
      } catch (emailError) {
        logger.warn('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to database
      user.refreshToken = refreshToken;
      await user.save();

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      const requestInfo = getRequestInfo(req);
      await logAuditEvent({
        userId: user._id,
        action: 'register',
        ...requestInfo,
        details: { username: user.username, email: user.email, role: user.role },
        status: 'success'
      });

      res.status(201).json({
        message: 'User registered successfully. Please check your email to verify your account.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        accessToken
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// Login
router.post('/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
      const userAgent = req.headers['user-agent'] || 'Unknown';

      // Find user with password field
      const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if account is locked
      if (user.isLocked) {
        const lockTime = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
        return res.status(423).json({ 
          message: `Account is locked due to too many failed login attempts. Please try again in ${lockTime} minutes.` 
        });
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        // Increment login attempts
        await user.incLoginAttempts();
        
        // Check if account should be locked now
        const updatedUser = await User.findById(user._id).select('+loginAttempts +lockUntil');
        if (updatedUser.isLocked) {
          const requestInfo = getRequestInfo(req);
          await logAuditEvent({
            userId: user._id,
            action: 'account_lock',
            ...requestInfo,
            details: { reason: 'too_many_failed_attempts' },
            status: 'success'
          });
          
          return res.status(423).json({ 
            message: 'Account has been locked due to too many failed login attempts. Please try again in 2 hours.' 
          });
        }
        
        // Log failed login attempt
        const requestInfo = getRequestInfo(req);
        await logAuditEvent({
          userId: user._id,
          action: 'login',
          ...requestInfo,
          details: { email: user.email, reason: 'invalid_password' },
          status: 'failure'
        });
        
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();
      
      // Update last login info
      user.lastLogin = new Date();
      user.lastLoginIP = clientIP;
      
      // Log successful login
      const requestInfo = getRequestInfo(req);
      await logAuditEvent({
        userId: user._id,
        action: 'login',
        ...requestInfo,
        details: { email: user.email },
        status: 'success'
      });

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to database and track session
      user.refreshToken = refreshToken;
      
      // Add session tracking
      if (!user.sessions) {
        user.sessions = [];
      }
      user.sessions.push({
        token: refreshToken,
        ip: clientIP,
        userAgent: userAgent
      });
      
      // Keep only last 5 sessions
      if (user.sessions.length > 5) {
        user.sessions = user.sessions.slice(-5);
      }
      
      await user.save();

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        accessToken
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// Refresh token with rotation
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken +sessions');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens (token rotation)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    
    // Update session with new token
    if (user.sessions && user.sessions.length > 0) {
      const sessionIndex = user.sessions.findIndex(s => s.token === refreshToken);
      if (sessionIndex !== -1) {
        user.sessions[sessionIndex].token = newRefreshToken;
      }
    }
    
    await user.save();

    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    // Clear refresh token from database
    const user = await User.findById(req.user._id).select('+refreshToken +sessions');
    if (user) {
      user.refreshToken = null;
      // Remove session if token matches
      if (user.sessions && refreshToken) {
        user.sessions = user.sessions.filter(s => s.token !== refreshToken);
      }
      await user.save();
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    const requestInfo = getRequestInfo(req);
    await logAuditEvent({
      userId: req.user._id,
      action: 'logout',
      ...requestInfo,
      status: 'success'
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

// Logout from all devices
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+refreshToken +sessions');
    if (user) {
      user.refreshToken = null;
      user.sessions = [];
      await user.save();
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    const requestInfo = getRequestInfo(req);
    await logAuditEvent({
      userId: req.user._id,
      action: 'session_destroy',
      ...requestInfo,
      details: { action: 'logout_all' },
      status: 'success'
    });

    res.json({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    logger.error('Logout all error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('sessions lastLogin lastLoginIP');
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
        lastLogin: user?.lastLogin,
        lastLoginIP: user?.lastLoginIP,
        activeSessions: user?.sessions?.length || 0
      }
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active sessions
router.get('/sessions', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+refreshToken sessions');
    if (!user || !user.sessions) {
      return res.json({ sessions: [] });
    }
    
    // Return sessions without tokens for security
    const sessions = user.sessions.map(session => ({
      ip: session.ip,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      isCurrent: session.token === user.refreshToken
    }));
    
    res.json({ sessions });
  } catch (error) {
    logger.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

