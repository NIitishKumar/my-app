const { getDatabase, ObjectId } = require('../db');

/**
 * Subject Schema
 * Represents a subject/book in the system
 */
class SubjectSchema {
  constructor() {
    this.collectionName = 'subjects';
    this.indexesCreated = false;
  }

  /**
   * Get the subjects collection
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

      await collection.createIndex({ name: 1 });
      await collection.createIndex({ author: 1 });
      await collection.createIndex({ classes: 1 });
      await collection.createIndex({ isActive: 1 });
      await collection.createIndex({ price: 1 });
      await collection.createIndex({ createdAt: -1 });
      await collection.createIndex({ name: 1, author: 1 }); // Compound index for search

      this.indexesCreated = true;
      console.log('✅ Subject indexes created successfully');
    } catch (error) {
      console.error('Error creating subject indexes:', error);
    }
  }

  /**
   * Validate subject data
   */
  validateSubject(data) {
    const errors = [];

    // Name validation
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Name is required and must be a string');
    } else {
      const trimmedName = data.name.trim();
      if (trimmedName.length < 2 || trimmedName.length > 100) {
        errors.push('Name must be between 2 and 100 characters');
      }
    }

    // Author validation
    if (!data.author || typeof data.author !== 'string') {
      errors.push('Author is required and must be a string');
    } else {
      const trimmedAuthor = data.author.trim();
      if (trimmedAuthor.length < 2 || trimmedAuthor.length > 100) {
        errors.push('Author must be between 2 and 100 characters');
      }
    }

    // Price validation
    if (data.price === undefined || data.price === null) {
      errors.push('Price is required');
    } else if (typeof data.price !== 'number' || isNaN(data.price)) {
      errors.push('Price must be a number');
    } else if (data.price < 0 || data.price > 999999.99) {
      errors.push('Price must be between 0 and 999999.99');
    }

    // Description validation
    if (data.description !== undefined && data.description !== null) {
      if (typeof data.description !== 'string') {
        errors.push('Description must be a string');
      } else if (data.description.length > 1000) {
        errors.push('Description cannot exceed 1000 characters');
      }
    }

    // Classes validation
    if (!data.classes || !Array.isArray(data.classes)) {
      errors.push('Classes is required and must be an array');
    } else if (data.classes.length === 0) {
      errors.push('At least one class is required');
    } else {
      // Validate each class ID is a valid ObjectId
      for (const classId of data.classes) {
        if (!ObjectId.isValid(classId)) {
          errors.push(`Invalid class ID format: ${classId}`);
        }
      }
    }

    // isActive validation
    if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
      errors.push('isActive must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize subject data before saving
   */
  sanitizeSubject(data) {
    const sanitized = {
      name: data.name?.trim(),
      author: data.author?.trim(),
      price: parseFloat(data.price),
      description: data.description?.trim() || '',
      classes: data.classes.map(id => typeof id === 'string' ? new ObjectId(id) : id),
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    };

    return sanitized;
  }

  /**
   * Create a new subject
   */
  async create(subjectData) {
    try {
      const collection = this.getCollection();

      // Validate data
      const validation = this.validateSubject(subjectData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Check if all classes exist
      const db = getDatabase();
      const existingClasses = await db.collection('classes')
        .find({ _id: { $in: subjectData.classes }, isActive: true })
        .toArray();

      if (existingClasses.length !== subjectData.classes.length) {
        throw new Error('One or more class IDs are invalid or inactive');
      }

      // Sanitize data
      const sanitizedData = this.sanitizeSubject(subjectData);

      // Check for duplicate subject name (optional - uncomment if name should be unique)
      // const existingSubject = await collection.findOne({ name: sanitizedData.name });
      // if (existingSubject) {
      //   throw new Error('Subject with this name already exists');
      // }

      // Insert subject
      const result = await collection.insertOne(sanitizedData);

      // Return the created subject
      const createdSubject = await collection.findOne({ _id: result.insertedId });

      return {
        _id: createdSubject._id.toString(),
        name: createdSubject.name,
        author: createdSubject.author,
        price: createdSubject.price,
        description: createdSubject.description,
        classes: createdSubject.classes.map(id => id.toString()),
        isActive: createdSubject.isActive,
        createdAt: createdSubject.createdAt,
        updatedAt: createdSubject.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all subjects with filtering and pagination
   */
  async getAll(filters = {}) {
    try {
      const collection = this.getCollection();

      const {
        search = '',
        classId = null,
        status = 'all',
        minPrice = null,
        maxPrice = null,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = filters;

      // Build query
      const query = {};

      // Search by name or author
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by class
      if (classId) {
        query.classes = ObjectId.isValid(classId) ? new ObjectId(classId) : classId;
      }

      // Filter by status
      if (status !== 'all') {
        query.isActive = status === 'active';
      }

      // Filter by price range
      if (minPrice !== null || maxPrice !== null) {
        query.price = {};
        if (minPrice !== null) query.price.$gte = parseFloat(minPrice);
        if (maxPrice !== null) query.price.$lte = parseFloat(maxPrice);
      }

      // Calculate skip for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Get total count
      const count = await collection.countDocuments(query);

      // Get subjects with pagination
      const subjects = await collection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      // Transform subjects to DTO format
      const transformedSubjects = subjects.map(subject => ({
        _id: subject._id.toString(),
        name: subject.name,
        author: subject.author,
        price: subject.price,
        description: subject.description || '',
        classes: subject.classes.map(id => id.toString()),
        isActive: subject.isActive,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt
      }));

      return {
        subjects: transformedSubjects,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get subject by ID
   */
  async getById(id) {
    try {
      const collection = this.getCollection();

      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid subject ID format');
      }

      const subject = await collection.findOne({ _id: new ObjectId(id) });

      if (!subject) {
        throw new Error('Subject not found');
      }

      return {
        _id: subject._id.toString(),
        name: subject.name,
        author: subject.author,
        price: subject.price,
        description: subject.description || '',
        classes: subject.classes.map(classId => classId.toString()),
        isActive: subject.isActive,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update subject
   */
  async update(id, updateData) {
    try {
      const collection = this.getCollection();

      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid subject ID format');
      }

      // Check if subject exists
      const existingSubject = await collection.findOne({ _id: new ObjectId(id) });
      if (!existingSubject) {
        throw new Error('Subject not found');
      }

      // Validate update data
      if (updateData.name !== undefined) {
        const nameValidation = this.validateSubject({ ...existingSubject, ...updateData });
        if (!nameValidation.isValid) {
          throw new Error(nameValidation.errors.join(', '));
        }
      }

      // Check if classes are provided and validate them
      if (updateData.classes && Array.isArray(updateData.classes)) {
        if (updateData.classes.length === 0) {
          throw new Error('At least one class is required');
        }

        const db = getDatabase();
        const existingClasses = await db.collection('classes')
          .find({
            _id: { $in: updateData.classes },
            isActive: true
          })
          .toArray();

        if (existingClasses.length !== updateData.classes.length) {
          throw new Error('One or more class IDs are invalid or inactive');
        }
      }

      // Build update object
      const updateObj = {
        updatedAt: new Date()
      };

      if (updateData.name !== undefined) updateObj.name = updateData.name.trim();
      if (updateData.author !== undefined) updateObj.author = updateData.author.trim();
      if (updateData.price !== undefined) updateObj.price = parseFloat(updateData.price);
      if (updateData.description !== undefined) updateObj.description = updateData.description.trim();
      if (updateData.classes !== undefined) {
        updateObj.classes = updateData.classes.map(cid =>
          typeof cid === 'string' ? new ObjectId(cid) : cid
        );
      }
      if (updateData.isActive !== undefined) updateObj.isActive = updateData.isActive;

      // Update subject
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateObj }
      );

      // Get updated subject
      const updatedSubject = await collection.findOne({ _id: new ObjectId(id) });

      return {
        _id: updatedSubject._id.toString(),
        name: updatedSubject.name,
        author: updatedSubject.author,
        price: updatedSubject.price,
        description: updatedSubject.description || '',
        classes: updatedSubject.classes.map(classId => classId.toString()),
        isActive: updatedSubject.isActive,
        createdAt: updatedSubject.createdAt,
        updatedAt: updatedSubject.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete subject
   */
  async delete(id) {
    try {
      const collection = this.getCollection();

      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid subject ID format');
      }

      const subject = await collection.findOne({ _id: new ObjectId(id) });

      if (!subject) {
        throw new Error('Subject not found');
      }

      await collection.deleteOne({ _id: new ObjectId(id) });

      return {
        _id: subject._id.toString(),
        name: subject.name,
        author: subject.author,
        message: 'Subject deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SubjectSchema();
