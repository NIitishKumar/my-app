/**
 * StudentTable Component
 */

import type { Student } from '../types/students.types';
import { StudentAvatar } from './StudentAvatar';
import { getStudentInitials } from '../utils/students.utils';

interface StudentTableProps {
  students: Student[];
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
}

export const StudentTable = ({ students, onView, onEdit, onDelete }: StudentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Student Name</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>STUDENT ID</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>EMAIL</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>GRADE</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>AGE</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>GENDER</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>STATUS</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => {
            const initials = getStudentInitials(student.firstName, student.lastName);
            
            return (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <StudentAvatar
                      firstName={student.firstName}
                      lastName={student.lastName}
                      size="md"
                    />
                    <div className="text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.studentId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.grade || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.age || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        student.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className="text-sm text-gray-900">
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    {onView && (
                      <button
                        onClick={() => onView(student)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                        title="View"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(student)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(student.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

