import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create transporter
const createTransporter = () => {
  // For development, use Gmail or other SMTP service
  // For production, use SendGrid, AWS SES, or similar
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Development: Use Ethereal Email (fake SMTP for testing)
  // Or configure with your SMTP settings
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const transporter = createTransporter();

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    logger.warn('Email transporter not configured properly:', error.message);
    logger.warn('Email functionality will be disabled. Set EMAIL_USER and EMAIL_PASSWORD in .env');
  } else {
    logger.info('Email transporter ready');
  }
});

// Send email
export const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      logger.warn('Email not sent - Email credentials not configured');
      // In development, log the email content instead
      if (process.env.NODE_ENV === 'development') {
        logger.info('Email would be sent:', options);
        return { messageId: 'dev-mode' };
      }
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Auth System'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

// Send verification email
export const sendVerificationEmail = async (email, token, username) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .button:hover { background-color: #0056b3; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Verify Your Email Address</h2>
          <p>Hi ${username},</p>
          <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <div class="footer">
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
    Hi ${username},
    
    Thank you for registering! Please verify your email address by visiting:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, please ignore this email.
  `;

  return sendEmail({
    email,
    subject: 'Verify Your Email Address',
    text,
    html,
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token, username) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .button:hover { background-color: #c82333; }
          .warning { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reset Your Password</h2>
          <p>Hi ${username},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <div class="warning">
            <strong>Warning:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </div>
          <div class="footer">
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
    Hi ${username},
    
    You requested to reset your password. Visit this link:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
  `;

  return sendEmail({
    email,
    subject: 'Reset Your Password',
    text,
    html,
  });
};

