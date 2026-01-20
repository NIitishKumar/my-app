/**
 * ExamAnalytics Component
 * Statistics dashboard with charts
 */

import React from 'react';
import type { ExamAnalytics as ExamAnalyticsType } from '../types/exam.types';

interface ExamAnalyticsProps {
  analyticsData?: ExamAnalyticsType;
  isLoading?: boolean;
  className?: string;
}

export const ExamAnalytics: React.FC<ExamAnalyticsProps> = ({
  analyticsData,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Exams by Subject */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exams by Subject</h3>
        <div className="space-y-3">
          {analyticsData.examsBySubject.map((item) => (
            <div key={item.subject}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                <span className="text-sm text-gray-600">{item.count} exams</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${(item.count / analyticsData.examsBySubject.reduce((sum, s) => sum + s.count, 0)) * 100}%` }}
                ></div>
              </div>
              <div className="flex gap-4 text-xs text-gray-500 mt-1">
                <span>Upcoming: {item.upcoming}</span>
                <span>Completed: {item.completed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exams by Class */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exams by Class</h3>
        <div className="space-y-3">
          {analyticsData.examsByClass.map((item) => (
            <div key={item.classId}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.className}</span>
                <span className="text-sm text-gray-600">{item.count} exams</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(item.count / analyticsData.examsByClass.reduce((sum, c) => sum + c.count, 0)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analyticsData.monthlyDistribution.map((item) => (
            <div key={item.month} className="text-center">
              <p className="text-xs text-gray-600 mb-1">{item.month}</p>
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Room Utilization */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Utilization</h3>
        <div className="space-y-3">
          {analyticsData.roomUtilization.map((item) => (
            <div key={item.room}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.room}</span>
                <span className="text-sm text-gray-600">{item.usageCount} uses</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(item.utilizationRate, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.utilizationRate.toFixed(1)}% utilization</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

