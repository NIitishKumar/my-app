/**
 * ClassForm Component
 */

import { useState, useEffect } from 'react';
import { GRADE_OPTIONS, SEMESTER_OPTIONS, SUBJECT_OPTIONS, getAcademicYearOptions } from '../constants/classes.constants';
import { validateClassForm, formatDateForInput, parseDateFromInput, getDefaultClassFormData } from '../utils/classes.utils';
import type { CreateClassData, Class } from '../types/classes.types';
import type { ValidationErrors } from '../utils/classes.utils';

interface ClassFormProps {
  initialData?: Class;
  onSubmit: (data: CreateClassData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ClassForm = ({ initialData, onSubmit, onCancel, isLoading }: ClassFormProps) => {
  const defaultData = getDefaultClassFormData();
  
  const [formData, setFormData] = useState<Partial<CreateClassData>>(
    initialData
      ? {
          className: initialData.className,
          subjects: initialData.subjects,
          grade: initialData.grade,
          roomNo: initialData.roomNo,
          capacity: initialData.capacity,
          enrolled: initialData.enrolled,
          students: initialData.students,
          classHead: {
            firstName: initialData.classHead.firstName,
            lastName: initialData.classHead.lastName,
            email: initialData.classHead.email,
            employeeId: initialData.classHead.employeeId,
          },
          lectures: initialData.lectures,
          schedule: {
            academicYear: initialData.schedule.academicYear,
            semester: initialData.schedule.semester,
            startDate: initialData.schedule.startDate,
            endDate: initialData.schedule.endDate,
          },
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
      const validationErrors = validateClassForm(formData);
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
    const validationErrors = validateClassForm(formData);
    setErrors(validationErrors);

    // Check if there are any errors
    const hasErrors = Object.keys(validationErrors).some(
      (key) => validationErrors[key as keyof ValidationErrors] !== undefined
    );

    if (hasErrors) {
      return;
    }

    // Submit
    onSubmit(formData as CreateClassData);
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

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = formData.subjects || [];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];
    handleFieldChange('subjects', newSubjects);
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

  const academicYearOptions = getAcademicYearOptions();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Add / Edit Class</h3>
          <p className="text-sm text-gray-600 mt-1">Enter class information below</p>
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
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Grade 10"
                    value={formData.className || ''}
                    onChange={(e) => handleFieldChange('className', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, className: true }))}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('className')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('className')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                    required
                  />
                  {isFieldValid('className') && (
                    <i className="fas fa-check-circle absolute right-3 top-3 text-green-500"></i>
                  )}
                  {isFieldInvalid('className') && (
                    <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
                  )}
                </div>
                {isFieldInvalid('className') ? (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('className')}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Enter the grade or class level</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.grade || ''}
                  onChange={(e) => handleFieldChange('grade', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, grade: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('grade')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : isFieldValid('grade')
                      ? 'border-green-500 bg-green-50 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                >
                  <option value="">Select grade</option>
                  {GRADE_OPTIONS.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('grade') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('grade')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Room 201"
                  value={formData.roomNo || ''}
                  onChange={(e) => handleFieldChange('roomNo', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, roomNo: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('roomNo')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : isFieldValid('roomNo')
                      ? 'border-green-500 bg-green-50 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                />
                {isFieldInvalid('roomNo') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('roomNo')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  placeholder="e.g., 30"
                  value={formData.capacity || ''}
                  onChange={(e) => handleFieldChange('capacity', parseInt(e.target.value) || 0)}
                  onBlur={() => setTouched((prev) => ({ ...prev, capacity: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('capacity')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : isFieldValid('capacity')
                      ? 'border-green-500 bg-green-50 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                />
                {isFieldInvalid('capacity') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('capacity')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subjects <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {SUBJECT_OPTIONS.map((subject) => (
                <label
                  key={subject}
                  className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={(formData.subjects || []).includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
            {isFieldInvalid('subjects') && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <i className="fas fa-exclamation-circle"></i>
                <span>{getFieldError('subjects')}</span>
              </p>
            )}
          </div>

          {/* Class Head Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Class Head Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={formData.classHead?.firstName || ''}
                  onChange={(e) => handleNestedFieldChange('classHead', 'firstName', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, 'classHead.firstName': true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('classHead.firstName')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                />
                {isFieldInvalid('classHead.firstName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('classHead.firstName')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={formData.classHead?.lastName || ''}
                  onChange={(e) => handleNestedFieldChange('classHead', 'lastName', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, 'classHead.lastName': true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('classHead.lastName')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                />
                {isFieldInvalid('classHead.lastName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('classHead.lastName')}</span>
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
                    placeholder="teacher@school.com"
                    value={formData.classHead?.email || ''}
                    onChange={(e) => handleNestedFieldChange('classHead', 'email', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, 'classHead.email': true }))}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('classHead.email')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('classHead.email')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                    required
                  />
                  {isFieldValid('classHead.email') && (
                    <i className="fas fa-check-circle absolute right-3 top-3 text-green-500"></i>
                  )}
                  {isFieldInvalid('classHead.email') && (
                    <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
                  )}
                </div>
                {isFieldInvalid('classHead.email') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('classHead.email')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter employee ID"
                  value={formData.classHead?.employeeId || ''}
                  onChange={(e) => handleNestedFieldChange('classHead', 'employeeId', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, 'classHead.employeeId': true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('classHead.employeeId')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                />
                {isFieldInvalid('classHead.employeeId') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('classHead.employeeId')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Schedule Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.schedule?.academicYear || ''}
                  onChange={(e) => handleNestedFieldChange('schedule', 'academicYear', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, 'schedule.academicYear': true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('schedule.academicYear')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                >
                  <option value="">Select academic year</option>
                  {academicYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('schedule.academicYear') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('schedule.academicYear')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.schedule?.semester || ''}
                  onChange={(e) => handleNestedFieldChange('schedule', 'semester', e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, 'schedule.semester': true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('schedule.semester')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                >
                  <option value="">Select semester</option>
                  {SEMESTER_OPTIONS.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('schedule.semester') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('schedule.semester')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.schedule?.startDate)}
                  onChange={(e) => {
                    const date = parseDateFromInput(e.target.value);
                    handleNestedFieldChange('schedule', 'startDate', date);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, 'schedule.startDate': true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('schedule.startDate')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                />
                {isFieldInvalid('schedule.startDate') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('schedule.startDate')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.schedule?.endDate)}
                  onChange={(e) => {
                    const date = parseDateFromInput(e.target.value);
                    handleNestedFieldChange('schedule', 'endDate', date);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, 'schedule.endDate': true }))}
                  min={formatDateForInput(formData.schedule?.startDate)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('schedule.endDate')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  required
                />
                {isFieldInvalid('schedule.endDate') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('schedule.endDate')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status <span className="text-red-500">*</span>
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
                  required
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
                  required
                />
                <span className="text-sm text-gray-700">Inactive</span>
              </label>
            </div>
          </div>

          {/* Form Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-blue-900">Form Tips</p>
                <p className="text-xs text-blue-700 mt-1">
                  All fields marked with <span className="text-red-500">*</span> are required. Make sure to assign a class head before saving.
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
                <span>Save Class</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
