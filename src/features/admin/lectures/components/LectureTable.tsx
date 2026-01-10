/**
 * LectureTable Component
 */

import type { Lecture } from '../types/lectures.types';

interface LectureTableProps {
  lectures: Lecture[];
  onView?: (lecture: Lecture) => void;
  onEdit?: (lecture: Lecture) => void;
  onDelete?: (id: string) => void;
}

export const LectureTable = ({ lectures, onView, onEdit, onDelete }: LectureTableProps) => {
  const formatTime = (time: string) => {
    return time; // Already in HH:MM format
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Title</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>SUBJECT</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>TEACHER</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>SCHEDULE</span>
                <div className="flex flex-col">
                  <i className="fas fa-chevron-up text-[8px] text-gray-400"></i>
                  <i className="fas fa-chevron-down text-[8px] text-gray-400 -mt-1"></i>
                </div>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>TYPE</span>
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
          {lectures.map((lecture) => (
            <tr key={lecture.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-gray-900">{lecture.title}</div>
                  {lecture.lectureGroup && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {lecture.lectureGroup}
                    </span>
                  )}
                </div>
                {lecture.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{lecture.description}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{lecture.subject}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {lecture.teacher.firstName} {lecture.teacher.lastName}
                </div>
                <div className="text-xs text-gray-500">{lecture.teacher.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {lecture.schedule.dayOfWeek}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(lecture.schedule.startTime)} - {formatTime(lecture.schedule.endTime)}
                </div>
                {lecture.schedule.room && (
                  <div className="text-xs text-gray-500">{lecture.schedule.room}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                  {lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)}
                </span>
                <div className="text-xs text-gray-500 mt-1">{formatDuration(lecture.duration)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      lecture.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                  <span className="text-sm text-gray-900">
                    {lecture.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-3">
                  {onView && (
                    <button
                      onClick={() => onView(lecture)}
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                      title="View"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(lecture)}
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(lecture.id)}
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

