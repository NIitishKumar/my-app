/**
 * AttendanceStatistics Component
 * Comprehensive statistics display with charts and analytics
 */

import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useClasses } from '../../../admin/classes/hooks/useClasses';
import { useAttendanceStats } from '../hooks/useAttendanceStats';
import { formatPercentage, formatAttendanceDate, getTrendColorClass } from '../utils/attendance.utils';
import { DATE_RANGE_PRESETS, DATE_RANGE_PRESET_OPTIONS } from '../constants/attendance.constants';
import toast from 'react-hot-toast';
import type { Class } from '../../../admin/classes/types/classes.types';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

interface AttendanceStatisticsProps {
  onExport?: (format: 'excel' | 'csv') => void;
}

export const AttendanceStatistics = ({ onExport }: AttendanceStatisticsProps) => {
  const { data: classes = [] } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [dateRangePreset, setDateRangePreset] = useState<string>(DATE_RANGE_PRESETS.THIS_MONTH);
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const { data: stats, isLoading, error } = useAttendanceStats(selectedClassId, {
    startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
    endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
  });


  const handlePresetChange = (preset: string) => {
    setDateRangePreset(preset);
    const today = new Date();
    let start: Date;
    const end: Date = today;

    switch (preset) {
      case DATE_RANGE_PRESETS.TODAY:
        start = today;
        break;
      case DATE_RANGE_PRESETS.THIS_WEEK:
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        break;
      case DATE_RANGE_PRESETS.THIS_MONTH:
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case DATE_RANGE_PRESETS.THIS_SEMESTER:
        start = new Date(today.getFullYear(), today.getMonth() >= 8 ? 8 : 0, 1);
        break;
      default:
        return; // Custom - no change
    }

    setStartDate(start);
    setEndDate(end);
  };

  const handleExport = (format: 'excel' | 'csv') => {
    if (!stats) {
      toast.error('No statistics data to export');
      return;
    }

    // Convert stats to exportable format compatible with export functions
    const exportData = stats.studentStats.map((student) => ({
      'Student Name': student.studentName,
      'Total Days': student.totalDays,
      'Present': student.presentDays,
      'Absent': student.absentDays,
      'Late': student.lateDays,
      'Excused': student.excusedDays,
      'Attendance Rate': `${student.attendanceRate}%`,
      'Trend': student.trend,
    }));

    try {
      const filename = `attendance_statistics_${selectedClassId || 'all'}`;
      
      if (format === 'excel') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Statistics');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        saveAs(blob, `${filename}.xlsx`);
        toast.success('Statistics exported to Excel');
      } else {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
        toast.success('Statistics exported to CSV');
      }
      onExport?.(format);
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      toast.error(errorMessage);
    }
  };

  if (!selectedClassId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <i className="fas fa-chart-bar text-gray-400 text-4xl mb-4"></i>
        <p className="text-gray-600 font-medium">Select a class to view statistics</p>
        <p className="text-sm text-gray-500 mt-1">Choose a class from the dropdown above</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
        <p className="text-red-800 font-medium">Failed to load statistics</p>
        <p className="text-sm text-red-600 mt-1">Please try again later</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <i className="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
        <p className="text-gray-600 font-medium">No statistics available</p>
        <p className="text-sm text-gray-500 mt-1">No attendance data found for the selected period</p>
      </div>
    );
  }

  // Prepare chart data
  const dailyChartData = stats.dailyBreakdown.map((day) => ({
    date: formatAttendanceDate(day.date),
    fullDate: day.date,
    present: day.present,
    absent: day.absent,
    late: day.late,
    excused: day.excused,
    rate: day.present + day.late + day.excused > 0 
      ? Math.round(((day.present + day.late) / (day.present + day.absent + day.late + day.excused)) * 100)
      : 0,
  }));

  const statusDistributionData = [
    { name: 'Present', value: stats.overall.presentDays },
    { name: 'Absent', value: stats.overall.absentDays },
    { name: 'Late', value: stats.overall.lateDays },
    { name: 'Excused', value: stats.overall.excusedDays },
  ].filter((item) => item.value > 0);

  const studentChartData = stats.studentStats.slice(0, 10).map((student) => ({
    name: student.studentName.split(' ')[0], // First name only for display
    fullName: student.studentName,
    rate: student.attendanceRate,
    present: student.presentDays,
    absent: student.absentDays,
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Class Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a class</option>
              {classes.map((cls: Class) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Preset */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preset</label>
            <select
              value={dateRangePreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {DATE_RANGE_PRESET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => {
                setStartDate(date);
                setDateRangePreset(DATE_RANGE_PRESETS.CUSTOM);
              }}
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => {
                setEndDate(date);
                setDateRangePreset(DATE_RANGE_PRESETS.CUSTOM);
              }}
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <i className="fas fa-file-csv mr-2"></i>
            Export CSV
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <i className="fas fa-file-excel mr-2"></i>
            Export Excel
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Overall Rate</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatPercentage(stats.overall.attendanceRate)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Days</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.overall.totalDays}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Present</p>
          <p className="text-2xl font-semibold text-green-600">{stats.overall.presentDays}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Absent</p>
          <p className="text-2xl font-semibold text-red-600">{stats.overall.absentDays}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Late/Excused</p>
          <p className="text-2xl font-semibold text-yellow-600">
            {stats.overall.lateDays + stats.overall.excusedDays}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Attendance Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#3b82f6" name="Attendance Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student-wise Attendance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Students by Attendance Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studentChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rate" fill="#3b82f6" name="Attendance Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Student Statistics Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Student Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excused
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.studentStats.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPercentage(student.attendanceRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {student.presentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {student.absentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                    {student.lateDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {student.excusedDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getTrendColorClass(student.trend)}>
                      <i
                        className={`fas fa-arrow-${
                          student.trend === 'improving'
                            ? 'up'
                            : student.trend === 'declining'
                            ? 'down'
                            : 'right'
                        } mr-1`}
                      ></i>
                      {student.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

