/**
 * SubjectForm Component
 */

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { validateSubjectForm, getDefaultSubjectFormData, formatPrice, parsePrice } from '../utils/subjects.utils';
import { useClasses } from '../../classes/hooks/useClasses';
import type { CreateSubjectData, Subject } from '../types/subjects.types';
import type { ValidationErrors } from '../utils/subjects.utils';
import { VALIDATION } from '../constants/subjects.constants';

interface SubjectFormProps {
  initialData?: Subject;
  onSubmit: (data: CreateSubjectData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const SubjectForm = ({ initialData, onSubmit, onCancel, isLoading }: SubjectFormProps) => {
  // Fetch classes from API
  const { data: allClasses, isLoading: isLoadingClasses } = useClasses();
  const classes = useMemo(() => allClasses || [], [allClasses]);

  // State for class search and dropdown
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const classDropdownRef = useRef<HTMLDivElement>(null);

  // Close class dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        classDropdownRef.current &&
        !classDropdownRef.current.contains(event.target as Node)
      ) {
        setIsClassDropdownOpen(false);
      }
    };

    if (isClassDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClassDropdownOpen]);

  // Memoize initial values
  const initialValues = useMemo<Partial<CreateSubjectData>>(() => {
    if (initialData) {
      return {
        name: initialData.name,
        author: initialData.author,
        price: initialData.price,
        description: initialData.description || '',
        classes: initialData.classes || [],
        isActive: initialData.isActive,
      };
    }
    return getDefaultSubjectFormData();
  }, [initialData]);

  const formik = useFormik<Partial<CreateSubjectData>>({
    initialValues,
    validate: (values) => {
      const errors = validateSubjectForm(values);
      const formikErrors: Record<string, string> = {};

      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof ValidationErrors];
        if (typeof error === 'string') {
          formikErrors[key] = error;
        }
      });

      return formikErrors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: (values, { setSubmitting }) => {
      try {
        onSubmit(values as CreateSubjectData);
      } catch (error) {
        console.error('Error in onSubmit callback:', error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const getFieldError = (field: string): string | undefined => {
    return formik.errors[field as keyof typeof formik.errors] as string | undefined;
  };

  const isFieldTouched = (field: string): boolean => {
    return formik.touched[field as keyof typeof formik.touched] || false;
  };

  const isFieldInvalid = (field: string): boolean => {
    const error = getFieldError(field);
    return isFieldTouched(field) && !!error;
  };

  // Class selection helpers
  const selectedClassIds = useMemo(() => formik.values.classes || [], [formik.values.classes]);
  const selectedClasses = useMemo(() => {
    return classes.filter((cls) => selectedClassIds.includes(cls.id));
  }, [classes, selectedClassIds]);

  const filteredClasses = useMemo(() => {
    if (!classSearchTerm.trim()) {
      return classes;
    }
    const searchLower = classSearchTerm.toLowerCase();
    return classes.filter(
      (cls) =>
        cls.className.toLowerCase().includes(searchLower) ||
        cls.grade.toLowerCase().includes(searchLower) ||
        (cls.section && cls.section.toLowerCase().includes(searchLower))
    );
  }, [classes, classSearchTerm]);

  const handleClassToggle = useCallback(
    (classId: string) => {
      const currentIds = formik.values.classes || [];
      const newIds = currentIds.includes(classId)
        ? currentIds.filter((id) => id !== classId)
        : [...currentIds, classId];
      formik.setFieldValue('classes', newIds);
      formik.setFieldTouched('classes', true);
    },
    [formik]
  );

  const handleRemoveClass = useCallback(
    (classId: string) => {
      const currentIds = formik.values.classes || [];
      formik.setFieldValue(
        'classes',
        currentIds.filter((id) => id !== classId)
      );
      formik.setFieldTouched('classes', true);
    },
    [formik]
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsed = parsePrice(value);
      formik.setFieldValue('price', parsed);
      formik.setFieldTouched('price', true);
    },
    [formik]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Subject' : 'Create New Subject'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {initialData ? 'Update subject information' : 'Fill in the details to create a new subject'}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Subject Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formik.values.name || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
              isFieldInvalid('name')
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter subject name"
          />
          {isFieldInvalid('name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
          )}
        </div>

        {/* Author Field */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formik.values.author || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
              isFieldInvalid('author')
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter author name"
          />
          {isFieldInvalid('author') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('author')}</p>
          )}
        </div>

        {/* Price Field */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              id="price"
              name="price"
              value={formik.values.price ? formatPrice(formik.values.price) : ''}
              onChange={handlePriceChange}
              onBlur={formik.handleBlur}
              className={`block w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                isFieldInvalid('price')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
              placeholder="0.00"
            />
          </div>
          {isFieldInvalid('price') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('price')}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formik.values.description || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
              isFieldInvalid('description')
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter subject description (optional)"
          />
          {isFieldInvalid('description') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
          )}
        </div>

        {/* Classes Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Classes <span className="text-red-500">*</span>
          </label>
          <div className="relative" ref={classDropdownRef}>
            <button
              type="button"
              onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              className={`w-full px-4 py-2.5 text-left border rounded-lg focus:outline-none focus:ring-2 ${
                isFieldInvalid('classes')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={selectedClassIds.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                  {selectedClassIds.length === 0
                    ? 'Select classes'
                    : `${selectedClassIds.length} class${selectedClassIds.length > 1 ? 'es' : ''} selected`}
                </span>
                <i className={`fas fa-chevron-${isClassDropdownOpen ? 'up' : 'down'} text-gray-400`}></i>
              </div>
            </button>

            {isClassDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search classes..."
                    value={classSearchTerm}
                    onChange={(e) => setClassSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {isLoadingClasses ? (
                    <div className="text-center py-4 text-gray-500">Loading classes...</div>
                  ) : filteredClasses.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No classes found</div>
                  ) : (
                    <div className="space-y-1">
                      {filteredClasses.map((cls) => (
                        <label
                          key={cls.id}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedClassIds.includes(cls.id)}
                            onChange={() => handleClassToggle(cls.id)}
                            className="mr-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">
                            {cls.className} - Grade {cls.grade}
                            {cls.section && ` (${cls.section})`}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selected Classes Display */}
          {selectedClasses.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedClasses.map((cls) => (
                <span
                  key={cls.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  {cls.className} - Grade {cls.grade}
                  {cls.section && ` (${cls.section})`}
                  <button
                    type="button"
                    onClick={() => handleRemoveClass(cls.id)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ))}
            </div>
          )}

          {isFieldInvalid('classes') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('classes')}</p>
          )}
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formik.values.isActive ?? true}
              onChange={formik.handleChange}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {initialData ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              initialData ? 'Update Subject' : 'Create Subject'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

