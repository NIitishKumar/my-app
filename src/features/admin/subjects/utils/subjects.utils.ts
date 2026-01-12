/**
 * Subjects Utility Functions
 */

import type { Subject, CreateSubjectData } from '../types/subjects.types';
import { VALIDATION } from '../constants/subjects.constants';

/**
 * Format price as currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Parse price string to number
 */
export const parsePrice = (priceString: string): number => {
  const cleaned = priceString.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Filter subjects by search term
 */
export const filterSubjects = (subjects: Subject[], searchTerm: string): Subject[] => {
  const term = searchTerm.toLowerCase();
  return subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(term) ||
      subject.author.toLowerCase().includes(term) ||
      (subject.description && subject.description.toLowerCase().includes(term))
  );
};

/**
 * Filter subjects by class ID
 */
export const filterSubjectsByClass = (subjects: Subject[], classId: string): Subject[] => {
  if (!classId || classId === 'all') {
    return subjects;
  }
  return subjects.filter((subject) => subject.classes.includes(classId));
};

/**
 * Filter subjects by status
 */
export const filterSubjectsByStatus = (
  subjects: Subject[],
  status: 'all' | 'active' | 'inactive'
): Subject[] => {
  if (status === 'all') {
    return subjects;
  }
  return subjects.filter((subject) =>
    status === 'active' ? subject.isActive : !subject.isActive
  );
};

/**
 * Sort subjects
 */
export const sortSubjects = (
  subjects: Subject[],
  sortBy: 'name' | 'author' | 'price' | 'createdAt',
  order: 'asc' | 'desc' = 'asc'
): Subject[] => {
  const sorted = [...subjects].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'author':
        comparison = a.author.localeCompare(b.author);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Validation errors interface
 */
export interface ValidationErrors {
  name?: string;
  author?: string;
  price?: string;
  description?: string;
  classes?: string;
  isActive?: string;
}

/**
 * Validate subject form data
 */
export const validateSubjectForm = (data: Partial<CreateSubjectData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Subject name is required';
  } else if (data.name.length < VALIDATION.NAME_MIN_LENGTH) {
    errors.name = `Subject name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
  } else if (data.name.length > VALIDATION.NAME_MAX_LENGTH) {
    errors.name = `Subject name must not exceed ${VALIDATION.NAME_MAX_LENGTH} characters`;
  }

  // Author validation
  if (!data.author || data.author.trim().length === 0) {
    errors.author = 'Author is required';
  } else if (data.author.length < VALIDATION.AUTHOR_MIN_LENGTH) {
    errors.author = `Author name must be at least ${VALIDATION.AUTHOR_MIN_LENGTH} characters`;
  } else if (data.author.length > VALIDATION.AUTHOR_MAX_LENGTH) {
    errors.author = `Author name must not exceed ${VALIDATION.AUTHOR_MAX_LENGTH} characters`;
  }

  // Price validation
  if (data.price === undefined || data.price === null) {
    errors.price = 'Price is required';
  } else if (data.price < VALIDATION.PRICE_MIN) {
    errors.price = `Price must be at least ${VALIDATION.PRICE_MIN}`;
  } else if (data.price > VALIDATION.PRICE_MAX) {
    errors.price = `Price must not exceed ${VALIDATION.PRICE_MAX}`;
  }

  // Description validation (optional)
  if (data.description && data.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must not exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
  }

  // Classes validation
  if (!data.classes || data.classes.length === 0) {
    errors.classes = 'At least one class must be selected';
  } else if (data.classes.length < VALIDATION.CLASSES_MIN) {
    errors.classes = `At least ${VALIDATION.CLASSES_MIN} class must be selected`;
  }

  return errors;
};

/**
 * Get default subject form data
 */
export const getDefaultSubjectFormData = (): Partial<CreateSubjectData> => {
  return {
    name: '',
    author: '',
    price: 0,
    description: '',
    classes: [],
    isActive: true,
  };
};

