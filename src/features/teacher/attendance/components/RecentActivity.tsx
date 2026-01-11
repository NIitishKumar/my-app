/**
 * RecentActivity Component
 * Timeline of recent attendance marking activity
 */

import { formatAttendanceDate } from '../utils/attendance.utils';
import type { RecentActivityItem } from '../types/attendance.types';

interface RecentActivityProps {
  activities: RecentActivityItem[];
  isLoading?: boolean;
  maxItems?: number;
}

export const RecentActivity = ({ 
  activities, 
  isLoading = false,
  maxItems = 10 
}: RecentActivityProps) => {
  const displayActivities = activities.slice(0, maxItems);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start space-x-4 animate-pulse">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-history text-gray-400 text-4xl mb-4"></i>
        <p className="text-gray-600 font-medium">No recent activity</p>
        <p className="text-sm text-gray-500 mt-1">Attendance marking activity will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {displayActivities.map((activity, idx) => (
          <li key={idx}>
            <div className="relative pb-8">
              {idx !== displayActivities.length - 1 && (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                ></span>
              )}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                    <i className="fas fa-clipboard-check text-white text-sm"></i>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{activity.className}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Marked attendance for {activity.studentsCount} students
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="text-xs text-gray-500">
                      {formatAttendanceDate(activity.date)} • {new Date(activity.markedAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

