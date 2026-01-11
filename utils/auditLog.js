const { getDatabase, ObjectId } = require('../db');

/**
 * Audit Logging
 * Logs all attendance operations for audit trail
 */

/**
 * Log audit entry
 * @param {string} action - Action type (create, update, delete, lock, unlock)
 * @param {string} recordId - Attendance record ID
 * @param {string} userId - User ID who performed the action
 * @param {string} userRole - User role (TEACHER, ADMIN)
 * @param {object} metadata - Additional metadata
 * @param {string} ipAddress - IP address of the request
 */
const logAudit = async (action, recordId, userId, userRole, metadata = {}, ipAddress = null) => {
  try {
    const db = getDatabase();

    const auditEntry = {
      action,
      recordId: new ObjectId(recordId),
      userId: new ObjectId(userId),
      userRole,
      metadata,
      ipAddress,
      timestamp: new Date(),
      createdAt: new Date()
    };

    await db.collection('attendance_audit').insertOne(auditEntry);

    // Also log to console for development
    console.log(`[AUDIT] ${action.toUpperCase()} - Record: ${recordId}, User: ${userId} (${userRole})`);
  } catch (error) {
    console.error('Failed to log audit entry:', error);
    // Don't throw - audit logging failure shouldn't break the application
  }
};

/**
 * Get audit trail for a record
 * @param {string} recordId - Attendance record ID
 * @param {number} limit - Number of entries to return
 */
const getAuditTrail = async (recordId, limit = 50) => {
  try {
    const db = getDatabase();

    const trail = await db.collection('attendance_audit')
      .find({ recordId: new ObjectId(recordId) })
      .sort({ timestamp: -1 })
      .limit(limit)
      .project({
        action: 1,
        userId: 1,
        userRole: 1,
        metadata: 1,
        ipAddress: 1,
        timestamp: 1
      })
      .toArray();

    return trail;
  } catch (error) {
    console.error('Failed to get audit trail:', error);
    return [];
  }
};

/**
 * Create audit log for attendance operations
 */
const AuditLog = {
  /**
   * Log attendance creation
   */
  create: async (recordId, userId, userRole, metadata = {}, ipAddress = null) => {
    await logAudit('create', recordId, userId, userRole, metadata, ipAddress);
  },

  /**
   * Log attendance update
   */
  update: async (recordId, userId, userRole, metadata = {}, ipAddress = null) => {
    await logAudit('update', recordId, userId, userRole, metadata, ipAddress);
  },

  /**
   * Log attendance deletion
   */
  delete: async (recordId, userId, userRole, metadata = {}, ipAddress = null) => {
    await logAudit('delete', recordId, userId, userRole, metadata, ipAddress);
  },

  /**
   * Log attendance lock
   */
  lock: async (recordId, userId, userRole, metadata = {}, ipAddress = null) => {
    await logAudit('lock', recordId, userId, userRole, metadata, ipAddress);
  },

  /**
   * Log attendance unlock
   */
  unlock: async (recordId, userId, userRole, metadata = {}, ipAddress = null) => {
    await logAudit('unlock', recordId, userId, userRole, metadata, ipAddress);
  },

  /**
   * Log bulk import
   */
  bulkImport: async (userId, userRole, metadata = {}, ipAddress = null) => {
    await logAudit('bulk_import', null, userId, userRole, metadata, ipAddress);
  },

  /**
   * Get audit trail for a record
   */
  getTrail: async (recordId, limit = 50) => {
    return await getAuditTrail(recordId, limit);
  }
};

/**
 * Middleware to automatically log attendance operations
 */
const auditMiddleware = (action) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override res.json to log after response
    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.params.recordId) {
        // Async logging - don't wait for it
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const ipAddress = req.ip || req.connection.remoteAddress;

        setImmediate(async () => {
          try {
            await AuditLog[action](
              req.params.recordId,
              userId,
              userRole,
              { body: req.body, params: req.params },
              ipAddress
            );
          } catch (error) {
            console.error('Audit logging failed:', error);
          }
        });
      }

      // Call original json method
      return originalJson(data);
    };

    next();
  };
};

module.exports = {
  AuditLog,
  auditMiddleware,
  logAudit,
  getAuditTrail
};
