/**
 * NoticePreview Component
 */

import { getPriorityBadgeColor, getAudienceBadgeColor } from '../../utils/notices.utils';
import type { CreateNoticeData } from '../../types/notices.types';

interface NoticePreviewProps {
  data: Partial<CreateNoticeData>;
}

export const NoticePreview = ({ data }: NoticePreviewProps) => {
  if (!data.title && !data.description) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-gray-500 text-center">Fill in the form to see preview</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
      
      <div className="space-y-4">
        {/* Title with Priority */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xl font-semibold text-gray-900">
              {data.title || 'Untitled Notice'}
            </h4>
            {data.priority && (
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityBadgeColor(data.priority)}`}>
                {data.priority}
              </span>
            )}
          </div>
        </div>

        {/* Audience Badge */}
        {data.audience && (
          <div>
            <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getAudienceBadgeColor(data.audience)}`}>
              {data.audience === 'ALL' ? 'All' : data.audience}
            </span>
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {data.description || 'No description provided'}
          </p>
        </div>

        {/* Publish Date */}
        {data.publishAt && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <i className="fas fa-calendar mr-1"></i>
              Publish: {data.publishAt instanceof Date ? data.publishAt.toLocaleString() : new Date(data.publishAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Expiry Date */}
        {data.expiresAt && (
          <div>
            <p className="text-xs text-gray-500">
              <i className="fas fa-clock mr-1"></i>
              Expires: {data.expiresAt instanceof Date ? data.expiresAt.toLocaleString() : new Date(data.expiresAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
