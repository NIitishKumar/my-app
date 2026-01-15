/**
 * Academic Performance Component
 * Academic summary and performance for student dashboard
 */

import { useNavigate } from 'react-router-dom';
import { useAcademicSummary } from '../hooks/useDashboard';
import { ROUTES } from '../../../../shared/constants';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
  if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-gray-600 bg-gray-50 border-gray-200';
};

const getGPAColor = (gpa: number) => {
  if (gpa >= 3.5) return 'text-green-600';
  if (gpa >= 3.0) return 'text-blue-600';
  if (gpa >= 2.5) return 'text-yellow-600';
  return 'text-red-600';
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const AcademicPerformance = () => {
  const navigate = useNavigate();
  const { data: academic, isLoading } = useAcademicSummary();

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  if (!academic) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <i className="fas fa-graduation-cap text-indigo-600 flex-shrink-0"></i>
          <span className="truncate">Academic Performance</span>
        </h2>
        <button
          onClick={() => navigate(ROUTES.STUDENT_RECORDS)}
          className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium whitespace-nowrap flex-shrink-0"
        >
          View All →
        </button>
      </div>

      {/* Overall GPA */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <p className={`text-3xl sm:text-4xl font-bold ${getGPAColor(academic.overallGPA)}`}>
            {academic.overallGPA.toFixed(1)}
          </p>
          <span className="text-sm text-gray-600">GPA</span>
        </div>
        <p className="text-sm text-gray-600">Overall: {academic.overallPercentage.toFixed(1)}%</p>
      </div>

      {/* Subject Summary */}
      {academic.subjectSummary.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Subject Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {academic.subjectSummary.slice(0, 4).map((subject) => (
              <div
                key={subject.subject}
                className={`p-3 rounded-lg border ${getGradeColor(subject.grade)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{subject.subject}</span>
                  <span className="font-bold text-sm">{subject.grade}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>{subject.obtainedMarks}/{subject.totalMarks}</span>
                  <span className="font-medium">{subject.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Grades */}
      {academic.recentGrades.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Grades</h3>
          <div className="space-y-2">
            {academic.recentGrades.slice(0, 3).map((grade, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getGradeColor(grade.grade)}`}>
                    <span className="font-bold text-sm">{grade.grade}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{grade.subject}</p>
                    <p className="text-xs text-gray-500">{grade.term}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{grade.percentage}%</p>
                  <p className="text-xs text-gray-500">{formatDate(grade.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

