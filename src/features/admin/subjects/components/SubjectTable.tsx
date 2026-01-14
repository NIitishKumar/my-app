/**
 * SubjectTable Component
 */

import type { Subject } from '../types/subjects.types';
import { formatPrice } from '../utils/subjects.utils';
import { useClasses } from '../../classes/hooks/useClasses';
import { useMemo } from 'react';

interface SubjectTableProps {
  subjects: Subject[];
  onView?: (subject: Subject) => void;
  onEdit?: (subject: Subject) => void;
  onDelete?: (id: string) => void;
}

export const SubjectTable = ({ subjects, onView, onEdit, onDelete }: SubjectTableProps) => {
  // Fetch classes to display class names
  const { data: allClasses } = useClasses();
  const classes = useMemo(() => allClasses || [], [allClasses]);

  // Create a map of class IDs to class names for quick lookup
  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach((cls) => {
      map.set(cls.id, `${cls.className} - Grade ${cls.grade}${cls.section ? ` (${cls.section})` : ''}`);
    });
    return map;
  }, [classes]);

  const getClassNames = (classIds: string[]): string => {
    if (classIds.length === 0) return 'No classes';
    const names = classIds
      .map((id) => classMap.get(id))
      .filter((name): name is string => !!name);
    if (names.length === 0) return 'Unknown classes';
    if (names.length <= 2) return names.join(', ');
    return `${names.slice(0, 2).join(', ')} +${names.length - 2} more`;
  };

  if (subjects.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="fas fa-inbox text-gray-400 text-4xl mb-3"></i>
        <p className="text-sm font-medium text-gray-900">No subjects found</p>
        <p className="text-xs text-gray-500 mt-1">Start by adding your first subject</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Subject Name</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Author</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Price</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Classes
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Status</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subjects.map((subject) => (
            <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 sm:px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                {subject.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{subject.description}</div>
                )}
              </td>
              <td className="px-3 sm:px-6 py-4">
                <div className="text-sm text-gray-900">{subject.author}</div>
              </td>
              <td className="px-3 sm:px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{formatPrice(subject.price)}</div>
              </td>
              <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                <div className="text-sm text-gray-900 max-w-xs truncate" title={getClassNames(subject.classes)}>
                  {getClassNames(subject.classes)}
                </div>
              </td>
              <td className="px-3 sm:px-6 py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    subject.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {subject.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  {onView && (
                    <button
                      onClick={() => onView(subject)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      title="View details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(subject)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(subject.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

