/**
 * ClassForm Component
 */

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { GRADE_OPTIONS, SEMESTER_OPTIONS, SUBJECT_OPTIONS, getAcademicYearOptions } from '../constants/classes.constants';
import { validateClassForm, formatDateForInput, parseDateFromInput, getDefaultClassFormData } from '../utils/classes.utils';
import { useStudents } from '../../students/hooks/useStudents';
import type { CreateClassData, Class } from '../types/classes.types';
import type { ValidationErrors } from '../utils/classes.utils';

interface ClassFormProps {
  initialData?: Class;
  onSubmit: (data: CreateClassData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ClassForm = ({ initialData, onSubmit, onCancel, isLoading }: ClassFormProps) => {
  // Fetch students from API
  const { data: allStudents, isLoading: isLoadingStudents } = useStudents();
  const students = useMemo(() => allStudents || [], [allStudents]);

  // State for student search and dropdown
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const studentDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        studentDropdownRef.current &&
        !studentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStudentDropdownOpen(false);
      }
    };

    if (isStudentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStudentDropdownOpen]);

  // Memoize initial values to prevent unnecessary re-renders that block input
  // Only recalculate when initialData changes (not on every render)
  const initialValues = useMemo<Partial<CreateClassData>>(() => {
    if (initialData) {
      return {
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
      };
    }
    // Call getDefaultClassFormData inside useMemo so it's only called when needed
    return getDefaultClassFormData();
  }, [initialData]);

  const formik = useFormik<Partial<CreateClassData>>({
    initialValues,
    validate: (values) => {
      const errors = validateClassForm(values);
      // Convert ValidationErrors to Formik errors format
      const formikErrors: Record<string, string | Record<string, string>> = {};
      
      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof ValidationErrors];
        if (typeof error === 'string') {
          formikErrors[key] = error;
        } else if (error && typeof error === 'object') {
          // Check if the nested object has any actual error messages
          const nestedErrors = error as Record<string, string>;
          const hasNestedErrors = Object.keys(nestedErrors).some(
            (nestedKey) => nestedErrors[nestedKey] !== undefined && nestedErrors[nestedKey] !== ''
          );
          // Only add nested errors if there are actual error messages
          if (hasNestedErrors) {
            formikErrors[key] = nestedErrors;
          }
        }
      });
      
      return formikErrors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: (values, { setSubmitting }) => {
      // Log form values and validation errors
      console.log('=== FORM SUBMISSION ===');
      console.log('Is Edit Mode:', !!initialData);
      console.log('Initial Data:', initialData);
      
      // Log all form values
      console.log('--- FORM VALUES ---');
      console.log('Form Data (raw):', values);
      console.log('Form Data (stringified):', JSON.stringify(values, null, 2));
      
      // Log each field individually for clarity
      console.log('Class Name:', values.className);
      console.log('Grade:', values.grade);
      console.log('Room No:', values.roomNo);
      console.log('Capacity:', values.capacity);
      console.log('Enrolled:', values.enrolled);
      console.log('Subjects:', values.subjects);
      console.log('Class Head:', values.classHead);
      console.log('Schedule:', values.schedule);
      console.log('Is Active:', values.isActive);
      console.log('Students:', values.students);
      console.log('Lectures:', values.lectures);
      
      // Run validation and log errors
      const validationErrors = validateClassForm(values);
      console.log('--- VALIDATION ERRORS ---');
      console.log('Validation Errors (raw):', validationErrors);
      console.log('Validation Errors (stringified):', JSON.stringify(validationErrors, null, 2));

    // Check if there are any errors
    const hasErrors = Object.keys(validationErrors).some(
        (key) => {
          const error = validationErrors[key as keyof ValidationErrors];
          if (typeof error === 'string') {
            return !!error;
          }
          if (error && typeof error === 'object') {
            return Object.keys(error).length > 0;
          }
          return false;
        }
      );
      
      console.log('Has Validation Errors:', hasErrors);
      console.log('Form is Valid:', !hasErrors);
      
      // Log Formik's internal state
      console.log('--- FORMIK STATE ---');
      console.log('Formik Errors:', formik.errors);
      console.log('Formik Touched:', formik.touched);
      console.log('Formik isSubmitting:', formik.isSubmitting);
      console.log('Formik isValid:', formik.isValid);
      console.log('======================');

      // Always call parent onSubmit - let the parent handle validation
      // The validation check above is just for logging
      console.log('Calling parent onSubmit with values:', values);
      try {
        onSubmit(values as CreateClassData);
        // Show success message
        formik.setStatus({ showSuccess: true });
        setTimeout(() => {
          formik.setStatus({ showSuccess: false });
        }, 3000);
      } catch (error) {
        console.error('Error in onSubmit callback:', error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const getFieldError = (field: string): string | undefined => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentError = formik.errors[parent as keyof typeof formik.errors];
      if (parentError && typeof parentError === 'object') {
        return (parentError as Record<string, string>)?.[child];
      }
      return undefined;
    }
    return formik.errors[field as keyof typeof formik.errors] as string | undefined;
  };

  const isFieldTouched = (field: string): boolean => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentTouched = formik.touched[parent as keyof typeof formik.touched];
      if (parentTouched && typeof parentTouched === 'object') {
        return (parentTouched as Record<string, boolean>)?.[child] || false;
      }
      return false;
    }
    return formik.touched[field as keyof typeof formik.touched] || false;
  };

  const isFieldValid = (field: string): boolean => {
    const error = getFieldError(field);
    return isFieldTouched(field) && !error;
  };

  const isFieldInvalid = (field: string): boolean => {
    const error = getFieldError(field);
    return isFieldTouched(field) && !!error;
  };

  const academicYearOptions = useMemo(() => getAcademicYearOptions(), []);

  // Student selection helpers
  const selectedStudentIds = useMemo(() => formik.values.students || [], [formik.values.students]);
  const selectedStudents = useMemo(() => {
    return students.filter((student) => selectedStudentIds.includes(student.id));
  }, [students, selectedStudentIds]);

  const filteredStudents = useMemo(() => {
    if (!studentSearchTerm.trim()) {
      return students;
    }
    const searchLower = studentSearchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower)
    );
  }, [students, studentSearchTerm]);

  const handleStudentToggle = useCallback(
    (studentId: string) => {
      const currentIds = formik.values.students || [];
      const newIds = currentIds.includes(studentId)
        ? currentIds.filter((id) => id !== studentId)
        : [...currentIds, studentId];
      formik.setFieldValue('students', newIds);
    },
    [formik]
  );

  const handleRemoveStudent = useCallback(
    (studentId: string) => {
      const currentIds = formik.values.students || [];
      formik.setFieldValue(
        'students',
        currentIds.filter((id) => id !== studentId)
      );
    },
    [formik]
  );

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = formik.values.subjects || [];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];
    formik.setFieldValue('subjects', newSubjects);
    formik.setFieldTouched('subjects', true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Add / Edit Class</h3>
          <p className="text-sm text-gray-600 mt-1">Enter class information below</p>
        </div>

        {formik.status?.showSuccess && (
          <div className="mx-6 mt-4 flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-green-600"></i>
              <p className="text-sm text-green-800">Record saved successfully!</p>
            </div>
            <button
              onClick={() => formik.setStatus({ ...formik.status, showSuccess: false })}
              className="text-green-600 hover:text-green-800"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
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
                    name="className"
                    placeholder="e.g., Grade 10"
                    value={formik.values.className || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading || formik.isSubmitting}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isLoading || formik.isSubmitting
                        ? 'bg-gray-100 cursor-not-allowed'
                        : isFieldInvalid('className')
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
                  name="grade"
                  value={formik.values.grade || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading || formik.isSubmitting}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isLoading || formik.isSubmitting
                      ? 'bg-gray-100 cursor-not-allowed'
                      : isFieldInvalid('grade')
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

              {/* Student Selection Field */}
              <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Students
              </label>
              <div className="relative">
                {/* Selected Students Display */}
                {selectedStudents.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedStudents.map((student) => (
                      <span
                        key={student.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200"
                      >
                        {student.firstName} {student.lastName} ({student.studentId})
                        <button
                          type="button"
                          onClick={() => handleRemoveStudent(student.id)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                          disabled={isLoading || formik.isSubmitting}
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search Input and Dropdown */}
                <div className="relative" ref={studentDropdownRef}>
                  <input
                    type="text"
                    placeholder="Search students by name, email, or student ID..."
                    value={studentSearchTerm}
                    onChange={(e) => {
                      setStudentSearchTerm(e.target.value);
                      setIsStudentDropdownOpen(true);
                    }}
                    onFocus={() => setIsStudentDropdownOpen(true)}
                    disabled={isLoading || formik.isSubmitting || isLoadingStudents}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isLoading || formik.isSubmitting || isLoadingStudents
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>

                  {/* Dropdown */}
                  {isStudentDropdownOpen && !isLoadingStudents && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredStudents.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          {studentSearchTerm.trim() ? 'No students found' : 'No students available'}
                        </div>
                      ) : (
                        <ul className="py-1">
                          {filteredStudents.map((student) => {
                            const isSelected = selectedStudentIds.includes(student.id);
                            return (
                              <li
                                key={student.id}
                                className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${
                                  isSelected ? 'bg-indigo-100' : ''
                                }`}
                                onClick={() => {
                                  handleStudentToggle(student.id);
                                  setStudentSearchTerm('');
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {}}
                                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                      readOnly
                                    />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {student.firstName} {student.lastName}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {student.email} • {student.studentId}
                                      </div>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <i className="fas fa-check text-indigo-600"></i>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {isLoadingStudents && (
                  <p className="mt-1 text-xs text-gray-500">Loading students...</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Select students to add to this class. {selectedStudents.length} student(s) selected.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number <span className="text-red-500">*</span>
              </label>
                <input
                  type="text"
                  name="roomNo"
                  placeholder="e.g., Room 201"
                  value={formik.values.roomNo || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  name="capacity"
                  min={1}
                  max={200}
                  placeholder="e.g., 30"
                  value={formik.values.capacity || ''}
                  onChange={(e) => {
                    formik.setFieldValue('capacity', parseInt(e.target.value) || 0);
                  }}
                  onBlur={formik.handleBlur}
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
                    checked={(formik.values.subjects || []).includes(subject)}
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
                  name="classHead.firstName"
                  placeholder="Enter first name"
                  value={formik.values.classHead?.firstName || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  name="classHead.lastName"
                  placeholder="Enter last name"
                  value={formik.values.classHead?.lastName || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                    name="classHead.email"
                    placeholder="teacher@school.com"
                    value={formik.values.classHead?.email || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                  name="classHead.employeeId"
                  placeholder="Enter employee ID"
                  value={formik.values.classHead?.employeeId || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  name="schedule.academicYear"
                  value={formik.values.schedule?.academicYear || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  name="schedule.semester"
                  value={formik.values.schedule?.semester || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  name="schedule.startDate"
                  value={formatDateForInput(formik.values.schedule?.startDate)}
                  onChange={(e) => {
                    const date = parseDateFromInput(e.target.value);
                    formik.setFieldValue('schedule.startDate', date);
                  }}
                  onBlur={formik.handleBlur}
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
                  name="schedule.endDate"
                  value={formatDateForInput(formik.values.schedule?.endDate)}
                  onChange={(e) => {
                    const date = parseDateFromInput(e.target.value);
                    formik.setFieldValue('schedule.endDate', date);
                  }}
                  onBlur={formik.handleBlur}
                  min={formatDateForInput(formik.values.schedule?.startDate)}
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
                  checked={formik.values.isActive === true}
                  onChange={() => formik.setFieldValue('isActive', true)}
                  onBlur={formik.handleBlur}
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
                  checked={formik.values.isActive === false}
                  onChange={() => formik.setFieldValue('isActive', false)}
                  onBlur={formik.handleBlur}
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
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              // Validate and submit
              formik.validateForm().then((errors) => {
                console.log('=== BUTTON CLICK - VALIDATION CHECK ===');
                console.log('Formik Validation Errors:', errors);
                console.log('Formik Values:', formik.values);
                console.log('Is Edit Mode:', !!initialData);
                console.log('Formik Errors Object:', formik.errors);
                console.log('Formik isValid:', formik.isValid);
                console.log('========================================');
                
                // Submit the form - Formik will handle validation
                formik.submitForm();
              });
            }}
            disabled={isLoading || formik.isSubmitting}
            className={`px-6 py-2.5 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isLoading || formik.isSubmitting
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
