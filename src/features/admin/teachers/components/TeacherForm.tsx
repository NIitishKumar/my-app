/**
 * TeacherForm Component
 */

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  STATUS_OPTIONS,
  DEPARTMENT_OPTIONS,
  SUBJECT_OPTIONS,
  QUALIFICATION_OPTIONS,
  VALIDATION,
} from '../constants/teachers.constants';
import { formatDateForInput, getDefaultTeacherFormData } from '../utils/teachers.utils';
import type { CreateTeacherData, Teacher } from '../types/teachers.types';

interface TeacherFormProps {
  initialData?: Teacher;
  onSubmit: (data: CreateTeacherData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Validation schema (matching API requirements)
const validationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(VALIDATION.FIRST_NAME_MIN_LENGTH, `First name must be at least ${VALIDATION.FIRST_NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.FIRST_NAME_MAX_LENGTH, `First name must not exceed ${VALIDATION.FIRST_NAME_MAX_LENGTH} characters`),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(VALIDATION.LAST_NAME_MIN_LENGTH, `Last name must be at least ${VALIDATION.LAST_NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.LAST_NAME_MAX_LENGTH, `Last name must not exceed ${VALIDATION.LAST_NAME_MAX_LENGTH} characters`),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must not exceed ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
  employeeId: yup
    .string()
    .required('Employee ID is required')
    .min(VALIDATION.EMPLOYEE_ID_MIN_LENGTH, `Employee ID must be at least ${VALIDATION.EMPLOYEE_ID_MIN_LENGTH} characters`)
    .max(VALIDATION.EMPLOYEE_ID_MAX_LENGTH, `Employee ID must not exceed ${VALIDATION.EMPLOYEE_ID_MAX_LENGTH} characters`),
  phone: yup
    .string()
    .test('phone-format', 'Please enter a valid phone number', (value) => {
      if (!value) return true; // Optional field
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      return phoneRegex.test(value) && value.replace(/\D/g, '').length >= VALIDATION.PHONE_MIN_LENGTH;
    })
    .max(VALIDATION.PHONE_MAX_LENGTH, `Phone number must not exceed ${VALIDATION.PHONE_MAX_LENGTH} characters`),
  qualification: yup
    .string()
    .max(VALIDATION.QUALIFICATION_MAX_LENGTH, `Qualification must not exceed ${VALIDATION.QUALIFICATION_MAX_LENGTH} characters`),
  specialization: yup.string().max(200, 'Specialization must not exceed 200 characters'),
  subjects: yup.array().of(yup.string()).min(1, 'At least one subject is required'),
  experience: yup
    .number()
    .min(VALIDATION.EXPERIENCE_MIN, `Experience must be at least ${VALIDATION.EXPERIENCE_MIN} years`)
    .max(VALIDATION.EXPERIENCE_MAX, `Experience must not exceed ${VALIDATION.EXPERIENCE_MAX} years`)
    .nullable(),
  joiningDate: yup.string(),
  employmentType: yup.string().oneOf([...EMPLOYMENT_TYPE_OPTIONS], 'Invalid employment type'),
  department: yup.string().oneOf([...DEPARTMENT_OPTIONS, undefined], 'Invalid department'),
  status: yup.string().oneOf([...STATUS_OPTIONS], 'Invalid status'),
});

export const TeacherForm = ({ initialData, onSubmit, onCancel, isLoading }: TeacherFormProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const defaultData = getDefaultTeacherFormData();

  const formik = useFormik<CreateTeacherData>({
    initialValues: initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          employeeId: initialData.employeeId,
          phone: initialData.phone || '',
          department: initialData.department,
          qualification: initialData.qualification || '',
          specialization: initialData.specialization || '',
          subjects: initialData.subjects || [],
          experience: initialData.experience,
          joiningDate: initialData.joiningDate 
            ? (typeof initialData.joiningDate === 'string' 
                ? initialData.joiningDate 
                : formatDateForInput(initialData.joiningDate))
            : '',
          employmentType: initialData.employmentType,
          status: initialData.status,
        }
      : {
          firstName: defaultData.firstName || '',
          lastName: defaultData.lastName || '',
          email: defaultData.email || '',
          employeeId: defaultData.employeeId || '',
          phone: defaultData.phone || '',
          department: defaultData.department,
          qualification: defaultData.qualification || '',
          specialization: defaultData.specialization || '',
          subjects: defaultData.subjects || [],
          experience: defaultData.experience,
          joiningDate: defaultData.joiningDate || '',
          employmentType: defaultData.employmentType || 'full-time',
          status: defaultData.status || 'active',
        },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = formik.values.subjects || [];
    if (currentSubjects.includes(subject)) {
      formik.setFieldValue('subjects', currentSubjects.filter((s) => s !== subject));
    } else {
      formik.setFieldValue('subjects', [...currentSubjects, subject]);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return formik.errors[field as keyof typeof formik.errors] as string | undefined;
  };

  const isFieldTouched = (field: string): boolean => {
    return !!formik.touched[field as keyof typeof formik.touched];
  };

  const isFieldInvalid = (field: string): boolean => {
    return isFieldTouched(field) && !!getFieldError(field);
  };

  const isFieldValid = (field: string): boolean => {
    return isFieldTouched(field) && !getFieldError(field);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? 'Edit Teacher' : 'Add Teacher'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Enter teacher information below</p>
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

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
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
                    name="firstName"
                    placeholder="Enter first name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('firstName')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('firstName')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
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
                    name="lastName"
                    placeholder="Enter last name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('lastName')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('lastName')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
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
                    name="email"
                    placeholder="teacher@school.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('email')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('email')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
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
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  placeholder="e.g., EMP001"
                  value={formik.values.employeeId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!!initialData}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('employeeId')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : isFieldValid('employeeId')
                      ? 'border-green-500 bg-green-50 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  } ${initialData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {isFieldInvalid('employeeId') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('employeeId')}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Unique employee identifier {initialData && '(cannot be updated)'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1-234-567-8900"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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

          {/* Professional Information Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Professional Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                <select
                  name="qualification"
                  value={formik.values.qualification}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select qualification</option>
                  {QUALIFICATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  min={VALIDATION.EXPERIENCE_MIN}
                  max={VALIDATION.EXPERIENCE_MAX}
                  placeholder="e.g., 5"
                  value={formik.values.experience || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    formik.setFieldValue('experience', value);
                  }}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {isFieldInvalid('experience') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('experience')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formik.values.joiningDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="e.g., Algebra, Calculus"
                  value={formik.values.specialization}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Enter specialization areas separated by commas</p>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_OPTIONS.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleSubjectToggle(subject)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formik.values.subjects?.includes(subject)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
                {isFieldInvalid('subjects') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('subjects')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Employment Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                <select
                  name="employmentType"
                  value={formik.values.employmentType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  name="department"
                  value={formik.values.department || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  {DEPARTMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>Save Teacher</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
