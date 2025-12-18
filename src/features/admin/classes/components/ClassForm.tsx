/**
 * ClassForm Component
 */

import { useState } from 'react';
import { GRADE_OPTIONS, SECTION_OPTIONS } from '../constants/classes.constants';
import type { CreateClassData, Class } from '../types/classes.types';

interface ClassFormProps {
  initialData?: Class;
  onSubmit: (data: CreateClassData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ClassForm = ({ initialData, onSubmit, onCancel, isLoading }: ClassFormProps) => {
  const [formData, setFormData] = useState<CreateClassData>({
    name: initialData?.name || '',
    grade: initialData?.grade || '',
    section: initialData?.section || '',
    teacherId: initialData?.teacherId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Class Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
          Grade
        </label>
        <select
          id="grade"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select Grade</option>
          {GRADE_OPTIONS.map((grade) => (
            <option key={grade} value={grade}>
              Grade {grade}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="section" className="block text-sm font-medium text-gray-700">
          Section
        </label>
        <select
          id="section"
          value={formData.section}
          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select Section</option>
          {SECTION_OPTIONS.map((section) => (
            <option key={section} value={section}>
              Section {section}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};


