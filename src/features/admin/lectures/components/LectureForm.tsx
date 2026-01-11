/**
 * LectureForm Component
 */

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState, useMemo } from 'react';
import { useTeachers } from '../../teachers/hooks/useTeachers';
import { useClasses } from '../../classes/hooks/useClasses';
import {
  DAY_OF_WEEK_OPTIONS,
  LECTURE_TYPE_OPTIONS,
  MATERIAL_TYPE_OPTIONS,
  SUBJECT_OPTIONS,
  TIME_OPTIONS,
  VALIDATION,
} from '../constants/lectures.constants';
import { getDefaultLectureFormData, calculateDuration } from '../utils/lectures.utils';
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
  teacher: yup.mixed().required('Teacher is required'),
  selectedTeacherId: yup.string().required('Please select a teacher'),
  classId: yup.string().optional(),
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
  type: yup.string().oneOf([...LECTURE_TYPE_OPTIONS], 'Invalid lecture type'),
  isActive: yup.boolean(),
});

export const LectureForm = ({ initialData, onSubmit, onCancel, isLoading }: LectureFormProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const defaultData = getDefaultLectureFormData();

  // Fetch teachers and classes
  const { data: teachersResponse, isLoading: isLoadingTeachers } = useTeachers();
  const { data: classesData, isLoading: isLoadingClasses } = useClasses();

  // Extract teachers array from response (API returns { teachers: [], pagination: {} })
  const teachers = useMemo(() => {
    if (!teachersResponse) return [];
    // Handle both array and object response formats
    if (Array.isArray(teachersResponse)) {
      return teachersResponse;
    }
    if (teachersResponse && typeof teachersResponse === 'object' && 'teachers' in teachersResponse) {
      return teachersResponse.teachers;
    }
    if (teachersResponse && typeof teachersResponse === 'object' && 'data' in teachersResponse) {
      return (teachersResponse as any).data || [];
    }
    return [];
  }, [teachersResponse]);

  const classes = useMemo(() => classesData || [], [classesData]);

  // Filter teachers and classes based on search
  const filteredTeachers = useMemo(() => {
    if (!teacherSearchTerm.trim()) return teachers;
    const searchLower = teacherSearchTerm.toLowerCase();
    return teachers.filter(
      (teacher: any) =>
        teacher.firstName.toLowerCase().includes(searchLower) ||
        teacher.lastName.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower) ||
        teacher.employeeId.toLowerCase().includes(searchLower)
    );
  }, [teachers, teacherSearchTerm]);

  const filteredClasses = useMemo(() => {
    if (!classSearchTerm.trim()) return classes;
    const searchLower = classSearchTerm.toLowerCase();
    return classes.filter(
      (classItem) =>
        classItem.className.toLowerCase().includes(searchLower) ||
        classItem.grade.toLowerCase().includes(searchLower) ||
        classItem.roomNo.toLowerCase().includes(searchLower)
    );
  }, [classes, classSearchTerm]);

  // Find selected teacher ID from initial data
  const initialTeacherId = useMemo(() => {
    if (!initialData || teachers.length === 0) return '';
    // Try to find by employeeId first (most reliable)
    const foundById = teachers.find((t) => t.employeeId === initialData.teacher.teacherId);
    if (foundById) return foundById.id;
    // Fallback to name matching
    const foundByName = teachers.find(
      (t: any) =>
        t.firstName === initialData.teacher.firstName &&
        t.lastName === initialData.teacher.lastName
    );
    return foundByName?.id || '';
  }, [initialData, teachers]);

  const formik = useFormik<CreateLectureData & { selectedTeacherId?: string; selectedClassId?: string }>({
    initialValues: {
      ...(initialData
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
            classId: initialData.classId || '',
            lectureGroup: initialData.lectureGroup || '',
            selectedTeacherId: initialTeacherId,
            selectedClassId: initialData.classId || '',
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
            classId: '',
            lectureGroup: '',
            selectedTeacherId: '',
            selectedClassId: '',
          }),
    },
    validationSchema,
    onSubmit: (values) => {
      // Calculate duration from start and end time if not set
      if (!values.duration || values.duration === 0) {
        values.duration = calculateDuration(values.schedule.startTime, values.schedule.endTime);
      }
      // Prepare submission data - replace teacher object with teacher ID
      const { selectedTeacherId, selectedClassId, teacher, ...rest } = values;
      const submitData: CreateLectureData = {
        ...rest,
        // Pass teacher ID as string instead of teacher object
        teacher: selectedTeacherId || '',
        teacherId: selectedTeacherId, // Add teacherId for mapper to use
      };
      onSubmit(submitData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  // Handle teacher selection
  const handleTeacherChange = (teacherId: string) => {
    const selectedTeacher = teachers.find((t: any) => t.id === teacherId);
    if (selectedTeacher) {
      formik.setFieldValue('selectedTeacherId', teacherId);
      formik.setFieldValue('teacher', {
        firstName: selectedTeacher.firstName,
        lastName: selectedTeacher.lastName,
        email: selectedTeacher.email,
        teacherId: selectedTeacher.employeeId,
      });
      // Clear search term
      setTeacherSearchTerm('');
    }
  };

  // Handle class selection
  const handleClassChange = (classId: string) => {
    formik.setFieldValue('selectedClassId', classId);
    formik.setFieldValue('classId', classId);
    // Clear search term
    setClassSearchTerm('');
  };

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
    formik.setFieldValue('materials', [...(formik.values.materials || []), newMaterial]);
  };

  const handleRemoveMaterial = (index: number) => {
    const newMaterials = (formik.values.materials || []).filter((_, i) => i !== index);
    formik.setFieldValue('materials', newMaterials);
  };

  const handleMaterialChange = (index: number, field: keyof LectureMaterial, value: string) => {
    const newMaterials = [...(formik.values.materials || [])];
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lecture Group <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="lectureGroup"
                  placeholder="e.g., Group A, Week 1, Module 1"
                  value={formik.values.lectureGroup || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Use this to group related lectures together</p>
              </div>
            </div>
          </div>

          {/* Teacher & Class Selection Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Teacher & Class Selection</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Teacher Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isLoadingTeachers ? 'Loading teachers...' : 'Search and select teacher'}
                    value={
                      formik.values.selectedTeacherId && !teacherSearchTerm && typeof formik.values.teacher !== 'string'
                        ? `${formik.values.teacher.firstName} ${formik.values.teacher.lastName}`
                        : teacherSearchTerm
                    }
                    onChange={(e) => setTeacherSearchTerm(e.target.value)}
                    onFocus={() => {
                      if (formik.values.selectedTeacherId) {
                        setTeacherSearchTerm('');
                      }
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isFieldInvalid('selectedTeacherId')
                        ? 'border-red-500 bg-red-50 focus:ring-red-500'
                        : isFieldValid('selectedTeacherId')
                        ? 'border-green-500 bg-green-50 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                  {isFieldValid('selectedTeacherId') && !teacherSearchTerm && (
                    <i className="fas fa-check-circle absolute right-3 top-3 text-green-500"></i>
                  )}
                  {isFieldInvalid('selectedTeacherId') && (
                    <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
                  )}
                  {(teacherSearchTerm || !formik.values.selectedTeacherId) && filteredTeachers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredTeachers.map((teacher: any) => (
                        <button
                          key={teacher.id}
                          type="button"
                          onClick={() => handleTeacherChange(teacher.id)}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                        >
                          <div className="font-medium text-gray-900">
                            {teacher.firstName} {teacher.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {teacher.employeeId} • {teacher.email}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {isFieldInvalid('selectedTeacherId') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{getFieldError('selectedTeacherId')}</span>
                  </p>
                )}
              </div>

              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isLoadingClasses ? 'Loading classes...' : 'Search and select class'}
                    value={
                      formik.values.selectedClassId && !classSearchTerm
                        ? classes.find((c) => c.id === formik.values.selectedClassId)?.className || ''
                        : classSearchTerm
                    }
                    onChange={(e) => setClassSearchTerm(e.target.value)}
                    onFocus={() => {
                      if (formik.values.selectedClassId) {
                        setClassSearchTerm('');
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {(classSearchTerm || !formik.values.selectedClassId) && filteredClasses.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredClasses.map((classItem) => (
                        <button
                          key={classItem.id}
                          type="button"
                          onClick={() => handleClassChange(classItem.id)}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                        >
                          <div className="font-medium text-gray-900">{classItem.className}</div>
                          <div className="text-sm text-gray-500">
                            {classItem.grade} • Room {classItem.roomNo}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
            {formik.values.materials && formik.values.materials.length > 0 && (
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

