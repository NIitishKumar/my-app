/**
 * TeacherForm Component
 */

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import {
  GENDER_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  STATUS_OPTIONS,
  DEPARTMENT_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  SUBJECT_OPTIONS,
  QUALIFICATION_OPTIONS,
  SPECIALIZATION_OPTIONS,
  RELATIONSHIP_OPTIONS,
  VALIDATION,
} from '../constants/teachers.constants';
import { formatDateForInput, getDefaultTeacherFormData } from '../utils/teachers.utils';
import type { CreateTeacherData, Teacher, TeacherDocument } from '../types/teachers.types';

interface TeacherFormProps {
  initialData?: Teacher;
  onSubmit: (data: CreateTeacherData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Validation schema
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
  dateOfBirth: yup.date().nullable(),
  gender: yup.string().oneOf([...GENDER_OPTIONS, undefined], 'Invalid gender'),
  qualification: yup
    .string()
    .required('Qualification is required')
    .min(VALIDATION.QUALIFICATION_MIN_LENGTH, `Qualification must be at least ${VALIDATION.QUALIFICATION_MIN_LENGTH} characters`)
    .max(VALIDATION.QUALIFICATION_MAX_LENGTH, `Qualification must not exceed ${VALIDATION.QUALIFICATION_MAX_LENGTH} characters`),
  specialization: yup.array().of(yup.string()),
  subjects: yup.array().of(yup.string()).min(1, 'At least one subject is required'),
  experience: yup
    .number()
    .min(VALIDATION.EXPERIENCE_MIN, `Experience must be at least ${VALIDATION.EXPERIENCE_MIN} years`)
    .max(VALIDATION.EXPERIENCE_MAX, `Experience must not exceed ${VALIDATION.EXPERIENCE_MAX} years`)
    .nullable(),
  joiningDate: yup.date().required('Joining date is required'),
  employmentType: yup.string().oneOf([...EMPLOYMENT_TYPE_OPTIONS], 'Invalid employment type').required('Employment type is required'),
  department: yup.string().oneOf([...DEPARTMENT_OPTIONS, undefined], 'Invalid department'),
  salary: yup
    .number()
    .min(VALIDATION.SALARY_MIN, `Salary must be at least ${VALIDATION.SALARY_MIN}`)
    .nullable(),
  status: yup.string().oneOf([...STATUS_OPTIONS], 'Invalid status').required('Status is required'),
  isActive: yup.boolean().required(),
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
          dateOfBirth: initialData.dateOfBirth,
          gender: initialData.gender,
          address: initialData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
          },
          qualification: initialData.qualification,
          specialization: initialData.specialization || [],
          subjects: initialData.subjects || [],
          experience: initialData.experience,
          joiningDate: initialData.joiningDate,
          employmentType: initialData.employmentType,
          department: initialData.department,
          salary: initialData.salary,
          status: initialData.status,
          emergencyContact: initialData.emergencyContact || {
            name: '',
            relationship: '',
            phone: '',
          },
          documents: initialData.documents || [],
          classes: initialData.classes || [],
          isActive: initialData.isActive,
        }
      : {
          firstName: defaultData.firstName || '',
          lastName: defaultData.lastName || '',
          email: defaultData.email || '',
          employeeId: defaultData.employeeId || '',
          phone: defaultData.phone || '',
          dateOfBirth: defaultData.dateOfBirth,
          gender: defaultData.gender,
          address: defaultData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
          },
          qualification: defaultData.qualification || '',
          specialization: defaultData.specialization || [],
          subjects: defaultData.subjects || [],
          experience: defaultData.experience,
          joiningDate: defaultData.joiningDate || new Date(),
          employmentType: defaultData.employmentType || 'permanent',
          department: defaultData.department,
          salary: defaultData.salary,
          status: defaultData.status || 'active',
          emergencyContact: defaultData.emergencyContact || {
            name: '',
            relationship: '',
            phone: '',
          },
          documents: defaultData.documents || [],
          classes: defaultData.classes || [],
          isActive: defaultData.isActive ?? true,
        },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleAddDocument = () => {
    const newDoc: TeacherDocument = {
      name: '',
      type: 'resume',
      url: '',
    };
    formik.setFieldValue('documents', [...formik.values.documents, newDoc]);
  };

  const handleRemoveDocument = (index: number) => {
    const newDocs = formik.values.documents.filter((_, i) => i !== index);
    formik.setFieldValue('documents', newDocs);
  };

  const handleDocumentChange = (index: number, field: keyof TeacherDocument, value: string) => {
    const newDocs = [...formik.values.documents];
    newDocs[index] = { ...newDocs[index], [field]: value };
    formik.setFieldValue('documents', newDocs);
  };

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = formik.values.subjects || [];
    if (currentSubjects.includes(subject)) {
      formik.setFieldValue('subjects', currentSubjects.filter((s) => s !== subject));
    } else {
      formik.setFieldValue('subjects', [...currentSubjects, subject]);
    }
  };

  const handleSpecializationToggle = (spec: string) => {
    const currentSpecs = formik.values.specialization || [];
    if (currentSpecs.includes(spec)) {
      formik.setFieldValue('specialization', currentSpecs.filter((s) => s !== spec));
    } else {
      formik.setFieldValue('specialization', [...currentSpecs, spec]);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      return (formik.errors[parent as keyof typeof formik.errors] as any)?.[child];
    }
    return formik.errors[field as keyof typeof formik.errors] as string | undefined;
  };

  const isFieldTouched = (field: string): boolean => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      return !!(formik.touched[parent as keyof typeof formik.touched] as any)?.[child];
    }
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
          <h3 className="text-lg font-bold text-gray-900">Add / Edit Teacher</h3>
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
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('employeeId')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : isFieldValid('employeeId')
                      ? 'border-green-500 bg-green-50 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('employeeId') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('employeeId')}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Unique employee identifier</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth ? formatDateForInput(formik.values.dateOfBirth) : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    formik.setFieldValue('dateOfBirth', date);
                  }}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formik.values.gender || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Address</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                <input
                  type="text"
                  name="address.street"
                  placeholder="Enter street address"
                  value={formik.values.address?.street || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="address.city"
                  placeholder="Enter city"
                  value={formik.values.address?.city || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="address.state"
                  placeholder="Enter state"
                  value={formik.values.address?.state || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  placeholder="Enter zip code"
                  value={formik.values.address?.zipCode || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Professional Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <select
                  name="qualification"
                  value={formik.values.qualification}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('qualification')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                >
                  <option value="">Select qualification</option>
                  {QUALIFICATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('qualification') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('qualification')}</span>
                  </p>
                )}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joining Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formatDateForInput(formik.values.joiningDate)}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : new Date();
                    formik.setFieldValue('joiningDate', date);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('joiningDate')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('joiningDate') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('joiningDate')}</span>
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleSpecializationToggle(spec)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formik.values.specialization?.includes(spec)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="employmentType"
                  value={formik.values.employmentType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('employmentType')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                >
                  {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('employmentType') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('employmentType')}</span>
                  </p>
                )}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                <input
                  type="number"
                  name="salary"
                  min={VALIDATION.SALARY_MIN}
                  placeholder="e.g., 50000"
                  value={formik.values.salary || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    formik.setFieldValue('salary', value);
                  }}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {isFieldInvalid('salary') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('salary')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('status')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('status') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('status')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Emergency Contact</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  placeholder="Enter contact name"
                  value={formik.values.emergencyContact?.name || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  name="emergencyContact.relationship"
                  value={formik.values.emergencyContact?.relationship || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  {RELATIONSHIP_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  placeholder="+1-234-567-8900"
                  value={formik.values.emergencyContact?.phone || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Documents</h4>
              <button
                type="button"
                onClick={handleAddDocument}
                className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <i className="fas fa-plus mr-1"></i>
                Add Document
              </button>
            </div>
            {formik.values.documents.length > 0 && (
              <div className="space-y-3">
                {formik.values.documents.map((doc, index) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Document name"
                        value={doc.name}
                        onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={doc.type}
                        onChange={(e) => handleDocumentChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {DOCUMENT_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        placeholder="Document URL"
                        value={doc.url}
                        onChange={(e) => handleDocumentChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
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

