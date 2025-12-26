/**
 * LectureForm Component
 */

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import {
  DAY_OF_WEEK_OPTIONS,
  LECTURE_TYPE_OPTIONS,
  MATERIAL_TYPE_OPTIONS,
  SUBJECT_OPTIONS,
  TIME_OPTIONS,
  VALIDATION,
} from '../constants/lectures.constants';
import { formatDateForInput, getDefaultLectureFormData, calculateDuration } from '../utils/lectures.utils';
import type { CreateLectureData, Lecture, LectureMaterial } from '../types/lectures.types';

interface LectureFormProps {
  initialData?: Lecture;
  onSubmit: (data: CreateLectureData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Validation schema
const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(VALIDATION.TITLE_MIN_LENGTH, `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`)
    .max(VALIDATION.TITLE_MAX_LENGTH, `Title must not exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`),
  description: yup
    .string()
    .max(VALIDATION.DESCRIPTION_MAX_LENGTH, `Description must not exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`),
  subject: yup
    .string()
    .required('Subject is required')
    .min(VALIDATION.SUBJECT_MIN_LENGTH, `Subject must be at least ${VALIDATION.SUBJECT_MIN_LENGTH} characters`)
    .max(VALIDATION.SUBJECT_MAX_LENGTH, `Subject must not exceed ${VALIDATION.SUBJECT_MAX_LENGTH} characters`),
  teacher: yup.object({
    firstName: yup
      .string()
      .required('Teacher first name is required')
      .min(VALIDATION.FIRST_NAME_MIN_LENGTH, `First name must be at least ${VALIDATION.FIRST_NAME_MIN_LENGTH} characters`)
      .max(VALIDATION.FIRST_NAME_MAX_LENGTH, `First name must not exceed ${VALIDATION.FIRST_NAME_MAX_LENGTH} characters`),
    lastName: yup
      .string()
      .required('Teacher last name is required')
      .min(VALIDATION.LAST_NAME_MIN_LENGTH, `Last name must be at least ${VALIDATION.LAST_NAME_MIN_LENGTH} characters`)
      .max(VALIDATION.LAST_NAME_MAX_LENGTH, `Last name must not exceed ${VALIDATION.LAST_NAME_MAX_LENGTH} characters`),
    email: yup
      .string()
      .required('Teacher email is required')
      .email('Please enter a valid email address')
      .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must not exceed ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
    teacherId: yup
      .string()
      .required('Teacher ID is required')
      .min(VALIDATION.TEACHER_ID_MIN_LENGTH, `Teacher ID must be at least ${VALIDATION.TEACHER_ID_MIN_LENGTH} characters`)
      .max(VALIDATION.TEACHER_ID_MAX_LENGTH, `Teacher ID must not exceed ${VALIDATION.TEACHER_ID_MAX_LENGTH} characters`),
  }),
  schedule: yup.object({
    dayOfWeek: yup.string().oneOf([...DAY_OF_WEEK_OPTIONS], 'Invalid day of week').required('Day of week is required'),
    startTime: yup.string().required('Start time is required'),
    endTime: yup.string().required('End time is required'),
    room: yup.string().max(VALIDATION.ROOM_MAX_LENGTH, `Room must not exceed ${VALIDATION.ROOM_MAX_LENGTH} characters`),
  }),
  duration: yup
    .number()
    .required('Duration is required')
    .min(VALIDATION.DURATION_MIN, `Duration must be at least ${VALIDATION.DURATION_MIN} minutes`)
    .max(VALIDATION.DURATION_MAX, `Duration must not exceed ${VALIDATION.DURATION_MAX} minutes`),
  type: yup.string().oneOf([...LECTURE_TYPE_OPTIONS], 'Invalid lecture type').required('Lecture type is required'),
  isActive: yup.boolean().required(),
});

export const LectureForm = ({ initialData, onSubmit, onCancel, isLoading }: LectureFormProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const defaultData = getDefaultLectureFormData();

  const formik = useFormik<CreateLectureData>({
    initialValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          subject: initialData.subject,
          teacher: {
            firstName: initialData.teacher.firstName,
            lastName: initialData.teacher.lastName,
            email: initialData.teacher.email,
            teacherId: initialData.teacher.teacherId,
          },
          schedule: {
            dayOfWeek: initialData.schedule.dayOfWeek,
            startTime: initialData.schedule.startTime,
            endTime: initialData.schedule.endTime,
            room: initialData.schedule.room || '',
          },
          duration: initialData.duration,
          type: initialData.type,
          materials: initialData.materials || [],
          isActive: initialData.isActive,
        }
      : {
          title: defaultData.title || '',
          description: defaultData.description || '',
          subject: defaultData.subject || '',
          teacher: defaultData.teacher || {
            firstName: '',
            lastName: '',
            email: '',
            teacherId: '',
          },
          schedule: defaultData.schedule || {
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '10:00',
            room: '',
          },
          duration: defaultData.duration || 60,
          type: defaultData.type || 'lecture',
          materials: defaultData.materials || [],
          isActive: defaultData.isActive ?? true,
        },
    validationSchema,
    onSubmit: (values) => {
      // Calculate duration from start and end time if not set
      if (!values.duration || values.duration === 0) {
        values.duration = calculateDuration(values.schedule.startTime, values.schedule.endTime);
      }
      onSubmit(values);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  // Auto-calculate duration when times change
  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    formik.setFieldValue(`schedule.${field}`, value);
    if (formik.values.schedule.startTime && formik.values.schedule.endTime) {
      const newStartTime = field === 'startTime' ? value : formik.values.schedule.startTime;
      const newEndTime = field === 'endTime' ? value : formik.values.schedule.endTime;
      const calculatedDuration = calculateDuration(newStartTime, newEndTime);
      if (calculatedDuration > 0) {
        formik.setFieldValue('duration', calculatedDuration);
      }
    }
  };

  const handleAddMaterial = () => {
    const newMaterial: LectureMaterial = {
      name: '',
      type: 'document',
      url: '',
    };
    formik.setFieldValue('materials', [...formik.values.materials, newMaterial]);
  };

  const handleRemoveMaterial = (index: number) => {
    const newMaterials = formik.values.materials.filter((_, i) => i !== index);
    formik.setFieldValue('materials', newMaterials);
  };

  const handleMaterialChange = (index: number, field: keyof LectureMaterial, value: string) => {
    const newMaterials = [...formik.values.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    formik.setFieldValue('materials', newMaterials);
  };

  const getFieldError = (field: string): string | undefined => {
    if (field.includes('.')) {
      const parts = field.split('.');
      let error: any = formik.errors;
      for (const part of parts) {
        error = error?.[part];
        if (!error) return undefined;
      }
      return error as string;
    }
    return formik.errors[field as keyof typeof formik.errors] as string | undefined;
  };

  const isFieldTouched = (field: string): boolean => {
    if (field.includes('.')) {
      const parts = field.split('.');
      let touched: any = formik.touched;
      for (const part of parts) {
        touched = touched?.[part];
        if (!touched) return false;
      }
      return !!touched;
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
          <h3 className="text-lg font-bold text-gray-900">Add / Edit Lecture</h3>
          <p className="text-sm text-gray-600 mt-1">Enter lecture information below</p>
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
          {/* Basic Information Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter lecture title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('title')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('title')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  {isFieldValid('title') && (
                    <i className="fas fa-check-circle absolute right-3 top-3 text-green-500"></i>
                  )}
                  {isFieldInvalid('title') && (
                    <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
                  )}
                </div>
                {isFieldInvalid('title') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('title')}</span>
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Enter lecture description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {isFieldInvalid('description') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('description')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('subject')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                >
                  <option value="">Select subject</option>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('subject') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('subject')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('type')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                >
                  {LECTURE_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('type') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('type')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Teacher Information Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Teacher Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teacher.firstName"
                  placeholder="Enter first name"
                  value={formik.values.teacher.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('teacher.firstName')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('teacher.firstName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('teacher.firstName')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teacher.lastName"
                  placeholder="Enter last name"
                  value={formik.values.teacher.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('teacher.lastName')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('teacher.lastName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('teacher.lastName')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="teacher.email"
                  placeholder="teacher@school.com"
                  value={formik.values.teacher.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('teacher.email')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('teacher.email') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('teacher.email')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teacher.teacherId"
                  placeholder="e.g., T001"
                  value={formik.values.teacher.teacherId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('teacher.teacherId')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('teacher.teacherId') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('teacher.teacherId')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Schedule</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week <span className="text-red-500">*</span>
                </label>
                <select
                  name="schedule.dayOfWeek"
                  value={formik.values.schedule.dayOfWeek}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('schedule.dayOfWeek')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                >
                  {DAY_OF_WEEK_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('schedule.dayOfWeek') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('schedule.dayOfWeek')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                <input
                  type="text"
                  name="schedule.room"
                  placeholder="e.g., Room 101"
                  value={formik.values.schedule.room}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <select
                  name="schedule.startTime"
                  value={formik.values.schedule.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('schedule.startTime')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('schedule.startTime') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('schedule.startTime')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <select
                  name="schedule.endTime"
                  value={formik.values.schedule.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('schedule.endTime')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {isFieldInvalid('schedule.endTime') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('schedule.endTime')}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  min={VALIDATION.DURATION_MIN}
                  max={VALIDATION.DURATION_MAX}
                  placeholder="e.g., 60"
                  value={formik.values.duration}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : 0;
                    formik.setFieldValue('duration', value);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid('duration')
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {isFieldInvalid('duration') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('duration')}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Auto-calculated from start and end time</p>
              </div>
            </div>
          </div>

          {/* Materials Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Materials</h4>
              <button
                type="button"
                onClick={handleAddMaterial}
                className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <i className="fas fa-plus mr-1"></i>
                Add Material
              </button>
            </div>
            {formik.values.materials.length > 0 && (
              <div className="space-y-3">
                {formik.values.materials.map((material, index) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Material name"
                        value={material.name}
                        onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={material.type}
                        onChange={(e) => handleMaterialChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {MATERIAL_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        placeholder="Material URL"
                        value={material.url}
                        onChange={(e) => handleMaterialChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(index)}
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
                  <span>Save Lecture</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

