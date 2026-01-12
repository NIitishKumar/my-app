/**
 * NoticeTable Component
 */

import { getPriorityBadgeColor, getAudienceBadgeColor } from '../utils/notices.utils';
import type { Notice } from '../types/notices.types';

interface NoticeTableProps {
  notices: Notice[];
  onView?: (notice: Notice) => void;
  onEdit?: (notice: Notice) => void;
  onDelete?: (id: string) => void;
}

export const NoticeTable = ({ notices, onView, onEdit, onDelete }: NoticeTableProps) => {
  if (notices.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="fas fa-inbox text-gray-400 text-4xl mb-3"></i>
        <p className="text-sm font-medium text-gray-900">No notices found</p>
        <p className="text-xs text-gray-500 mt-1">Create your first notice to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Audience
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Publish Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notices.map((notice) => (
            <tr key={notice.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                <div className="text-xs text-gray-500 truncate max-w-xs">
                  {notice.description.substring(0, 50)}...
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getAudienceBadgeColor(notice.audience)}`}>
                  {notice.audience === 'ALL' ? 'All' : notice.audience}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getPriorityBadgeColor(notice.priority)}`}>
                  {notice.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {notice.status === 'SCHEDULED' && (
                  <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                    Scheduled
                  </span>
                )}
                {notice.status === 'PUBLISHED' && (
                  <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                )}
                {notice.status === 'DRAFT' && (
                  <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    Draft
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {notice.publishAt.toLocaleDateString()} {notice.publishAt.toLocaleTimeString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  {onView && (
                    <button
                      onClick={() => onView(notice)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(notice)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(notice.id)}
                      className="text-red-600 hover:text-red-900"
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
