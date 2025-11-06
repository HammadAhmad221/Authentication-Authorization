import AuditLog from '../models/AuditLog.model.js';
import logger from './logger.js';

export const logAuditEvent = async (data) => {
  try {
    const auditLog = new AuditLog({
      userId: data.userId || null,
      action: data.action,
      ip: data.ip,
      userAgent: data.userAgent,
      details: data.details || {},
      status: data.status || 'success',
      metadata: data.metadata || {}
    });

    await auditLog.save();
    logger.info(`Audit log: ${data.action} - User: ${data.userId || 'Anonymous'}`);
  } catch (error) {
    // Don't throw error - audit logging should not break the application
    logger.error('Error logging audit event:', error);
  }
};

// Helper function to extract request info
export const getRequestInfo = (req) => {
  return {
    ip: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
    userAgent: req.headers['user-agent'] || 'Unknown'
  };
};

