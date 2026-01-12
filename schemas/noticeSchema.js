const { getDatabase, ObjectId } = require('../db');

/**
 * Notice Schema
 * Represents a notice in the system
 */
class NoticeSchema {
  constructor() {
    this.collectionName = 'notices';
    this.indexesCreated = false;
  }

  /**
   * Get the notices collection
   */
  getCollection() {
    const db = getDatabase();
    return db.collection(this.collectionName);
  }

  /**
   * Create indexes for better query performance
   */
  async createIndexes() {
    if (this.indexesCreated) return;

    try {
      const collection = this.getCollection();

      await collection.createIndex({ createdBy: 1 });
      await collection.createIndex({ audience: 1 });
      await collection.createIndex({ status: 1 });
      await collection.createIndex({ priority: 1 });
      await collection.createIndex({ publishAt: 1 });
      await collection.createIndex({ expiresAt: 1 });
      await collection.createIndex({ classIds: 1 });
      await collection.createIndex({ title: "text", description: "text" });
      await collection.createIndex({ createdAt: -1 });

      this.indexesCreated = true;
      console.log('✅ Notice indexes created successfully');
    } catch (error) {
      console.error('Error creating notice indexes:', error);
    }
  }

  /**
   * Validate notice data
   */
  validateNotice(data) {
    const errors = [];

    // Title validation
    if (!data.title || typeof data.title !== 'string') {
      errors.push('Title is required and must be a string');
    } else {
      const trimmedTitle = data.title.trim();
      if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
        errors.push('Title must be between 3 and 100 characters');
      }
    }

    // Description validation
    if (!data.description || typeof data.description !== 'string') {
      errors.push('Description is required and must be a string');
    } else {
      const trimmedDescription = data.description.trim();
      if (trimmedDescription.length < 10 || trimmedDescription.length > 5000) {
        errors.push('Description must be between 10 and 5000 characters');
      }
    }

    // Audience validation
    const validAudiences = ['ALL', 'TEACHERS', 'STUDENTS', 'PARENTS'];
    if (!data.audience || typeof data.audience !== 'string') {
      errors.push('Audience is required and must be a string');
    } else if (!validAudiences.includes(data.audience)) {
      errors.push('Audience must be one of: ALL, TEACHERS, STUDENTS, PARENTS');
    }

    // ClassIds validation
    if (data.audience !== 'ALL') {
      if (!data.classIds || !Array.isArray(data.classIds)) {
        errors.push('Class IDs are required when audience is not ALL');
      } else if (data.classIds.length === 0) {
        errors.push('At least one class must be selected when audience is not ALL');
      } else {
        for (const classId of data.classIds) {
          if (!ObjectId.isValid(classId)) {
            errors.push(`Invalid class ID format: ${classId}`);
          }
        }
      }
    }

    // Priority validation
    const validPriorities = ['NORMAL', 'IMPORTANT', 'URGENT'];
    if (!data.priority || typeof data.priority !== 'string') {
      errors.push('Priority is required and must be a string');
    } else if (!validPriorities.includes(data.priority)) {
      errors.push('Priority must be one of: NORMAL, IMPORTANT, URGENT');
    }

    // PublishAt validation
    if (data.publishAt !== undefined && data.publishAt !== null) {
      const publishDate = new Date(data.publishAt);
      if (isNaN(publishDate.getTime())) {
        errors.push('PublishAt must be a valid ISO 8601 datetime');
      }
    }

    // ExpiresAt validation
    if (data.expiresAt !== undefined && data.expiresAt !== null) {
      const expiresDate = new Date(data.expiresAt);
      if (isNaN(expiresDate.getTime())) {
        errors.push('ExpiresAt must be a valid ISO 8601 datetime');
      } else if (data.publishAt) {
        const publishDate = new Date(data.publishAt);
        if (expiresDate <= publishDate) {
          errors.push('ExpiresAt must be after PublishAt');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize notice data before saving
   */
  sanitizeNotice(data, userId) {
    const sanitized = {
      title: data.title?.trim(),
      description: data.description?.trim(),
      audience: data.audience,
      classIds: data.classIds ? data.classIds.map(id => typeof id === 'string' ? new ObjectId(id) : id) : [],
      priority: data.priority,
      status: 'PUBLISHED',
      publishAt: data.publishAt ? new Date(data.publishAt) : new Date(),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      attachmentUrl: data.attachmentUrl || null,
      attachmentName: data.attachmentName || null,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Determine status based on publishAt
    if (data.publishAt) {
      const publishDate = new Date(data.publishAt);
      sanitized.publishAt = publishDate;
      sanitized.status = publishDate > new Date() ? 'SCHEDULED' : 'PUBLISHED';
    }

    return sanitized;
  }

  /**
   * Create a new notice
   */
  async create(noticeData, userId) {
    try {
      const collection = this.getCollection();

      // Validate data
      const validation = this.validateNotice(noticeData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // If audience is not ALL, validate class IDs exist
      if (noticeData.audience !== 'ALL' && noticeData.classIds) {
        try {
          const db = getDatabase();
          const classObjectIds = noticeData.classIds.map(id =>
            typeof id === 'string' ? new ObjectId(id) : id
          );

          const existingClasses = await db.collection('classes')
            .find({ _id: { $in: classObjectIds } })
            .toArray();

          if (existingClasses.length !== noticeData.classIds.length) {
            const existingIds = existingClasses.map(c => c._id.toString());
            const invalidIds = noticeData.classIds
              .map(id => typeof id === 'string' ? id : id.toString())
              .filter(id => !existingIds.includes(id));

            console.warn(`Warning: The following class IDs were not found: ${invalidIds.join(', ')}`);
          }
        } catch (err) {
          console.warn('Warning: Could not validate class IDs:', err.message);
        }
      }

      // Sanitize data
      const sanitizedData = this.sanitizeNotice(noticeData, userId);

      // Insert notice
      const result = await collection.insertOne(sanitizedData);

      // Return the created notice
      const createdNotice = await collection.findOne({ _id: result.insertedId });

      return {
        _id: createdNotice._id.toString(),
        title: createdNotice.title,
        description: createdNotice.description,
        audience: createdNotice.audience,
        classIds: createdNotice.classIds.map(id => id.toString()),
        priority: createdNotice.priority,
        status: createdNotice.status,
        publishAt: createdNotice.publishAt,
        expiresAt: createdNotice.expiresAt,
        attachmentUrl: createdNotice.attachmentUrl,
        attachmentName: createdNotice.attachmentName,
        createdBy: createdNotice.createdBy.toString(),
        createdAt: createdNotice.createdAt,
        updatedAt: createdNotice.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all notices with filtering
   */
  async getAll(filters = {}) {
    try {
      await this.createIndexes();

      const collection = this.getCollection();

      const {
        audience,
        status,
        priority
      } = filters;

      // Build query
      const query = {};

      // Filter by audience
      if (audience) {
        query.audience = audience;
      }

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Filter by priority
      if (priority) {
        query.priority = priority;
      }

      // Get notices
      const notices = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      // Transform notices to DTO format
      const transformedNotices = notices.map(notice => ({
        _id: notice._id.toString(),
        title: notice.title,
        description: notice.description,
        audience: notice.audience,
        classIds: notice.classIds.map(id => id.toString()),
        priority: notice.priority,
        status: notice.status,
        publishAt: notice.publishAt,
        expiresAt: notice.expiresAt,
        attachmentUrl: notice.attachmentUrl,
        attachmentName: notice.attachmentName,
        createdBy: notice.createdBy.toString(),
        createdAt: notice.createdAt,
        updatedAt: notice.updatedAt
      }));

      return {
        notices: transformedNotices,
        count: transformedNotices.length
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get notice by ID
   */
  async getById(id) {
    try {
      const collection = this.getCollection();

      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid notice ID format');
      }

      const notice = await collection.findOne({ _id: new ObjectId(id) });

      if (!notice) {
        throw new Error('Notice not found');
      }

      return {
        _id: notice._id.toString(),
        title: notice.title,
        description: notice.description,
        audience: notice.audience,
        classIds: notice.classIds.map(id => id.toString()),
        priority: notice.priority,
        status: notice.status,
        publishAt: notice.publishAt,
        expiresAt: notice.expiresAt,
        attachmentUrl: notice.attachmentUrl,
        attachmentName: notice.attachmentName,
        createdBy: notice.createdBy.toString(),
        createdAt: notice.createdAt,
        updatedAt: notice.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update notice
   */
  async update(id, updateData) {
    try {
      const collection = this.getCollection();

      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid notice ID format');
      }

      // Check if notice exists
      const existingNotice = await collection.findOne({ _id: new ObjectId(id) });
      if (!existingNotice) {
        throw new Error('Notice not found');
      }

      // Validate update data
      const validation = this.validateNotice({
        ...existingNotice,
        ...updateData
      });

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Build update object
      const updateObj = {
        updatedAt: new Date()
      };

      if (updateData.title !== undefined) updateObj.title = updateData.title.trim();
      if (updateData.description !== undefined) updateObj.description = updateData.description.trim();
      if (updateData.audience !== undefined) updateObj.audience = updateData.audience;
      if (updateData.priority !== undefined) updateObj.priority = updateData.priority;
      if (updateData.classIds !== undefined) {
        updateObj.classIds = updateData.classIds.map(cid =>
          typeof cid === 'string' ? new ObjectId(cid) : cid
        );
      }
      if (updateData.attachmentUrl !== undefined) updateObj.attachmentUrl = updateData.attachmentUrl;
      if (updateData.attachmentName !== undefined) updateObj.attachmentName = updateData.attachmentName;

      // Handle publishAt and status
      if (updateData.publishAt !== undefined) {
        const publishDate = new Date(updateData.publishAt);
        updateObj.publishAt = publishDate;
        updateObj.status = publishDate > new Date() ? 'SCHEDULED' : 'PUBLISHED';
      }

      if (updateData.expiresAt !== undefined) {
        updateObj.expiresAt = new Date(updateData.expiresAt);
      }

      // Update notice
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateObj }
      );

      // Get updated notice
      const updatedNotice = await collection.findOne({ _id: new ObjectId(id) });

      return {
        _id: updatedNotice._id.toString(),
        title: updatedNotice.title,
        description: updatedNotice.description,
        audience: updatedNotice.audience,
        classIds: updatedNotice.classIds.map(id => id.toString()),
        priority: updatedNotice.priority,
        status: updatedNotice.status,
        publishAt: updatedNotice.publishAt,
        expiresAt: updatedNotice.expiresAt,
        attachmentUrl: updatedNotice.attachmentUrl,
        attachmentName: updatedNotice.attachmentName,
        createdBy: updatedNotice.createdBy.toString(),
        createdAt: updatedNotice.createdAt,
        updatedAt: updatedNotice.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete notice
   */
  async delete(id) {
    try {
      const collection = this.getCollection();

      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid notice ID format');
      }

      const notice = await collection.findOne({ _id: new ObjectId(id) });

      if (!notice) {
        throw new Error('Notice not found');
      }

      await collection.deleteOne({ _id: new ObjectId(id) });

      return {
        _id: notice._id.toString(),
        title: notice.title,
        message: 'Notice deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new NoticeSchema();
