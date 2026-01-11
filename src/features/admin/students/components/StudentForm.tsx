/**
 * StudentForm Component
 */

import { useState, useEffect } from 'react';
import { GENDER_OPTIONS, GRADE_OPTIONS } from '../constants/students.constants';
import { validateStudentForm, formatDateForInput, getDefaultStudentFormData } from '../utils/students.utils';
import type { CreateStudentData, Student } from '../types/students.types';
import type { ValidationErrors } from '../utils/students.utils';

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: CreateStudentData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const StudentForm = ({ initialData, onSubmit, onCancel, isLoading }: StudentFormProps) => {
  const defaultData = getDefaultStudentFormData();
  
  const [formData, setFormData] = useState<Partial<CreateStudentData>>(
    initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          studentId: initialData.studentId,
          age: initialData.age,
          gender: initialData.gender,
          phone: initialData.phone,
          grade: initialData.grade,
          address: initialData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
          },
          enrolledAt: initialData.enrolledAt ? (typeof initialData.enrolledAt === 'string' ? initialData.enrolledAt : formatDateForInput(initialData.enrolledAt)) : undefined,
          isActive: initialData.isActive,
        }
      : defaultData
  );

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate on change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validateStudentForm(formData);
      setErrors(validationErrors);
    }
  }, [formData, touched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate
    const validationErrors = validateStudentForm(formData);
    setErrors(validationErrors);

    // Check if there are any errors
    const hasErrors = Object.keys(validationErrors).some(
      (key) => validationErrors[key as keyof ValidationErrors] !== undefined
    );

    if (hasErrors) {
      return;
    }

    // Submit - convert enrolledAt to string if it's a Date
    const submitData: CreateStudentData = {
      ...formData,
      enrolledAt: formData.enrolledAt
        ? typeof formData.enrolledAt === 'string'
          ? formData.enrolledAt
          : formatDateForInput(formData.enrolledAt)
        : undefined,
    } as CreateStudentData;
    
    onSubmit(submitData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNestedFieldChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value,
      },
    }));
    setTouched((prev) => ({ ...prev, [`${parent}.${field}`]: true }));
  };

  const getFieldError = (field: string): string | undefined => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      return (errors[parent as keyof ValidationErrors] as any)?.[child];
    }
    return errors[field as keyof ValidationErrors] as string | undefined;
  };

  const isFieldValid = (field: string): boolean => {
    const error = getFieldError(field);
    return touched[field] && !error;
  };

  const isFieldInvalid = (field: string): boolean => {
    const error = getFieldError(field);
    return touched[field] && !!error;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? 'Edit Student' : 'Add Student'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Enter student information below</p>
        </div>

        {showSuccess && (
          <div className="mx-6 mt-4 flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-green-600"></i>
              <p className="text-sm text-green-800">Record saved successfully!</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-600 hover:text-green-800"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName || ''}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, firstName: true }))}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('firstName')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('firstName')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                    required
                  />
                  {isFieldValid('firstName') && (
                    <i className="fas fa-check-circle absolute right-3 top-3 text-green-500"></i>
                  )}
                  {isFieldInvalid('firstName') && (
                    <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
                  )}
                </div>
                {isFieldInvalid('firstName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('firstName')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName || ''}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('lastName')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('lastName')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                    required
                  />
                  {isFieldValid('lastName') && (
                    <i className="fas fa-check-circle absolute right-3 top-3 text-green-500"></i>
                  )}
                  {isFieldInvalid('lastName') && (
                    <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
                  )}
                </div>
                {isFieldInvalid('lastName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('lastName')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="student@school.com"
                    value={formData.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('email')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('email')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                    required
                  />
                  {isFieldValid('email') && (
                    <i className="fas fa-check-circle absolute right-3 top-3 text-green-500"></i>
                  )}
                  {isFieldInvalid('email') && (
                    <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
                  )}
                </div>
                {isFieldInvalid('email') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('email')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2024001"
                  value={formData.studentId || ''}
                  onChange={(e) => handleFieldChange('studentId', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, studentId: true }))}
                  disabled={!!initialData}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('studentId')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : isFieldValid('studentId')
                      ? 'border-green-500 bg-green-50 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  } ${initialData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  required
                />
                {isFieldInvalid('studentId') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('studentId')}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Unique student identifier {initialData && '(cannot be updated)'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  value={formData.grade || ''}
                  onChange={(e) => handleFieldChange('grade', e.target.value || undefined)}
                  onBlur={() => setTouched((prev) => ({ ...prev, grade: true }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select grade</option>
                  {GRADE_OPTIONS.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  placeholder="e.g., 15"
                  value={formData.age || ''}
                  onChange={(e) => handleFieldChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                  onBlur={() => setTouched((prev) => ({ ...prev, age: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('age')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('age') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('age')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => handleFieldChange('gender', e.target.value || undefined)}
                  onBlur={() => setTouched((prev) => ({ ...prev, gender: true }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('phone')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('phone') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('phone')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Address Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street
                </label>
                <input
                  type="text"
                  placeholder="Enter street address"
                  value={formData.address?.street || ''}
                  onChange={(e) => handleNestedFieldChange('address', 'street', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={formData.address?.city || ''}
                  onChange={(e) => handleNestedFieldChange('address', 'city', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={formData.address?.state || ''}
                  onChange={(e) => handleNestedFieldChange('address', 'state', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  placeholder="Enter zip code"
                  value={formData.address?.zipCode || ''}
                  onChange={(e) => handleNestedFieldChange('address', 'zipCode', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Enrollment Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrolled At
            </label>
            <input
              type="date"
              value={formData.enrolledAt ? (typeof formData.enrolledAt === 'string' ? formData.enrolledAt : formatDateForInput(formData.enrolledAt)) : ''}
              onChange={(e) => {
                handleFieldChange('enrolledAt', e.target.value || undefined);
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, enrolledAt: true }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                isFieldInvalid('enrolledAt')
                  ? 'border-red-500 bg-red-50 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
            />
            {isFieldInvalid('enrolledAt') && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <i className="fas fa-exclamation-circle"></i>
                <span>{getFieldError('enrolledAt')}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Optional - will be auto-generated by API if not provided</p>
          </div>

          {/* Status Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={formData.isActive === true}
                  onChange={() => handleFieldChange('isActive', true)}
                  className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={formData.isActive === false}
                  onChange={() => handleFieldChange('isActive', false)}
                  className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Inactive</span>
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">Optional - defaults to Active if not provided</p>
          </div>

          {/* Form Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-blue-900">Form Tips</p>
                <p className="text-xs text-blue-700 mt-1">
                  Required fields: First Name, Last Name, Email, Student ID. Email and Student ID must be unique. Enrolled At and Status are optional (auto-generated by API).
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-6 py-2.5 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>{initialData ? 'Update Student' : 'Create Student'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

