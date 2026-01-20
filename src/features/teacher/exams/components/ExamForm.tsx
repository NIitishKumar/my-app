/**
 * ExamForm Component for Teachers
 * Create/Edit exam form (filtered to teacher's assigned classes)
 */

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAssignedClasses } from '../../hooks/useTeacher';
import type { CreateExamData } from '../../../admin/exams/types/exam.types';

interface ExamFormProps {
  initialData?: Partial<CreateExamData>;
  onSubmit: (data: CreateExamData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  subject: Yup.string().required('Subject is required'),
  classIds: Yup.array().of(Yup.string()).min(1, 'At least one class must be selected'),
  date: Yup.string().required('Date is required'),
  startTime: Yup.string().required('Start time is required'),
  duration: Yup.number().positive('Duration must be positive').required('Duration is required'),
  totalMarks: Yup.number().positive('Total marks must be positive').required('Total marks is required'),
});

export const ExamForm: React.FC<ExamFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { data: assignedClasses = [] } = useAssignedClasses();

  const formik = useFormik<CreateExamData>({
    initialValues: {
      title: initialData?.title || '',
      subject: initialData?.subject || '',
      subjectCode: initialData?.subjectCode || '',
      classIds: initialData?.classIds || [],
      date: initialData?.date || '',
      startTime: initialData?.startTime || '',
      duration: initialData?.duration || 60,
      totalMarks: initialData?.totalMarks || 100,
      room: initialData?.room || '',
      instructions: initialData?.instructions || '',
      examType: initialData?.examType || 'midterm',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const calculateEndTime = () => {
    if (!formik.values.startTime || !formik.values.duration) return '';
    const [hours, minutes] = formik.values.startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + formik.values.duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  };

  // Filter classIds to only include assigned classes (backend validation should also handle this)
  const validClassIds = formik.values.classIds.filter((id) =>
    assignedClasses.some((cls) => (cls.id || (cls as any)._id) === id)
  );

  // If initial data had invalid classIds, update them
  React.useEffect(() => {
    if (initialData?.classIds && validClassIds.length !== formik.values.classIds.length) {
      formik.setFieldValue('classIds', validClassIds);
    }
  }, [assignedClasses]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...formik.getFieldProps('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...formik.getFieldProps('subject')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.subject && formik.errors.subject && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
          <input
            type="text"
            {...formik.getFieldProps('subjectCode')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Type
          </label>
          <select
            {...formik.getFieldProps('examType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...formik.getFieldProps('date')}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.date && formik.errors.date && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            {...formik.getFieldProps('startTime')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.startTime && formik.errors.startTime && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...formik.getFieldProps('duration')}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.duration && formik.errors.duration && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.duration}</p>
          )}
          {calculateEndTime() && (
            <p className="text-xs text-gray-500 mt-1">End Time: {calculateEndTime()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Marks <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...formik.getFieldProps('totalMarks')}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.totalMarks && formik.errors.totalMarks && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.totalMarks}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
          <input
            type="text"
            {...formik.getFieldProps('room')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classes (Your Assigned Classes) <span className="text-red-500">*</span>
          </label>
          {assignedClasses.length === 0 ? (
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 text-center text-gray-500">
              <p>No assigned classes found. Please contact administrator to assign classes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {assignedClasses.map((cls) => {
                const className = (cls as any).name || (cls as any).className || cls.className || 'Unnamed Class';
                const classId = cls.id || (cls as any)._id || '';
                return (
                  <label key={classId} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formik.values.classIds.includes(classId)}
                      onChange={(e) => {
                        const classIds = e.target.checked
                          ? [...formik.values.classIds, classId]
                          : formik.values.classIds.filter((id) => id !== classId);
                        formik.setFieldValue('classIds', classIds);
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{className}</span>
                  </label>
                );
              })}
            </div>
          )}
          {formik.touched.classIds && formik.errors.classIds && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.classIds}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
          <textarea
            {...formik.getFieldProps('instructions')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter exam instructions..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || assignedClasses.length === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Exam' : 'Create Exam'}
        </button>
      </div>
    </form>
  );
};

