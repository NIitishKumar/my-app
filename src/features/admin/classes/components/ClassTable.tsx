/**
 * ClassTable Component
 */

import type { Class } from '../types/classes.types';
import { TeacherAvatar } from './TeacherAvatar';
import { getTeacherInitials } from '../utils/classes.utils';

interface ClassTableProps {
  classes: Class[];
  onView?: (classItem: Class) => void;
  onEdit?: (classItem: Class) => void;
  onDelete?: (id: string) => void;
}

export const ClassTable = ({ classes, onView, onEdit, onDelete }: ClassTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Class Name</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>SECTION</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>CLASS TEACHER</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Total Students</span>
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
          {classes.map((classItem) => {
            const initials = getTeacherInitials(classItem.classHead.firstName, classItem.classHead.lastName);
            let prefix = 'Mr.';
            // const fullName = `${classItem.classHead.firstName} ${classItem.classHead.lastName}`;
            if (classItem.classHead.firstName === 'Sarah' && classItem.classHead.lastName === 'Miller') prefix = 'Dr.';
            else if (classItem.classHead.firstName === 'Emily' && classItem.classHead.lastName === 'Davis') prefix = 'Ms.';
            
            return (
              <tr key={classItem.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{classItem.className}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{classItem.section || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <TeacherAvatar
                      firstName={classItem.classHead.firstName}
                      lastName={classItem.classHead.lastName}
                      size="md"
                    />
                    <div className="text-sm text-gray-900">
                      {initials} {prefix} {classItem.classHead.firstName} {classItem.classHead.lastName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{classItem.enrolled} students</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        classItem.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className="text-sm text-gray-900">
                      {classItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    {onView && (
                      <button
                        onClick={() => onView(classItem)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                        title="View"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(classItem)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(classItem.id)}
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
