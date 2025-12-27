/**
 * TeacherTable Component
 */

import type { Teacher } from '../types/teachers.types';
import { TeacherAvatar } from './TeacherAvatar';

interface TeacherTableProps {
  teachers: Teacher[];
  onView?: (teacher: Teacher) => void;
  onEdit?: (teacher: Teacher) => void;
  onDelete?: (id: string) => void;
}

export const TeacherTable = ({ teachers, onView, onEdit, onDelete }: TeacherTableProps) => {
  const getStatusColor = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-400';
      case 'on-leave':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'on-leave':
        return 'On Leave';
      default:
        return status;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Teacher Name</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>EMPLOYEE ID</span>
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
                <span>DEPARTMENT</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>QUALIFICATION</span>
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
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <TeacherAvatar
                    firstName={teacher.firstName}
                    lastName={teacher.lastName}
                    size="md"
                  />
                  <div className="text-sm font-medium text-gray-900">
                    {teacher.firstName} {teacher.lastName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.employeeId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.department || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.qualification || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(teacher.status)}`}
                  ></div>
                  <span className="text-sm text-gray-900">
                    {getStatusLabel(teacher.status)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-3">
                  {onView && (
                    <button
                      onClick={() => onView(teacher)}
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                      title="View"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(teacher)}
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(teacher.id)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
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

