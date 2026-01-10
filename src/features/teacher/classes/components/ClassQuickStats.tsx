/**
 * ClassQuickStats Component
 * Quick statistics display for class cards
 */

interface ClassQuickStatsProps {
  studentCount: number;
  attendanceRate?: number;
  lastAttendanceDate?: Date;
}

export const ClassQuickStats = ({
  studentCount,
  attendanceRate,
  lastAttendanceDate,
}: ClassQuickStatsProps) => {
  const getAttendanceColor = (rate?: number | null) => {
    if (rate == null || isNaN(rate)) return 'text-gray-500';
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastAttendance = (date?: Date) => {
    if (!date) return 'Never';
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-1 text-gray-600">
        <i className="fas fa-user-graduate text-xs"></i>
        <span>{studentCount} students</span>
      </div>
      {attendanceRate != null && !isNaN(attendanceRate) && (
        <div className={`flex items-center space-x-1 ${getAttendanceColor(attendanceRate)}`}>
          <i className="fas fa-chart-line text-xs"></i>
          <span>{attendanceRate.toFixed(1)}%</span>
        </div>
      )}
      <div className="flex items-center space-x-1 text-gray-500 text-xs">
        <i className="fas fa-calendar-check"></i>
        <span>{formatLastAttendance(lastAttendanceDate)}</span>
      </div>
    </div>
  );
};

