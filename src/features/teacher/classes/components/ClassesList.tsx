/**
 * ClassesList Component
 * List/grid view of assigned classes with filtering and sorting
 */

import { useState, useMemo } from 'react';
import { useTeacherClasses } from '../hooks/useTeacherClasses';
import { ClassCard } from './ClassCard';
import type { TeacherClass } from '../types/teacher-classes.types';

interface ClassesListProps {
  onClassSelect?: (classData: TeacherClass) => void;
}

export const ClassesList = ({ onClassSelect }: ClassesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'students' | 'attendance' | 'recent'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: classes = [], isLoading, error } = useTeacherClasses();

  // Get unique subjects and grades for filters
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>();
    classes.forEach((cls) => {
      if (cls.subject) {
        subjects.add(cls.subject);
      }
      cls.subjects?.forEach((subj) => subjects.add(subj));
    });
    return Array.from(subjects).sort();
  }, [classes]);

  const uniqueGrades = useMemo(() => {
    const grades = new Set<string>();
    classes.forEach((cls) => grades.add(cls.grade));
    return Array.from(grades).sort();
  }, [classes]);

  // Filter and sort classes
  const filteredAndSortedClasses = useMemo(() => {
    let filtered = [...classes];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cls) =>
          cls.className.toLowerCase().includes(searchLower) ||
          cls.grade.toLowerCase().includes(searchLower) ||
          cls.subject?.toLowerCase().includes(searchLower) ||
          cls.subjects?.some((s) => s.toLowerCase().includes(searchLower))
      );
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(
        (cls) =>
          cls.subject === subjectFilter ||
          cls.subjects?.includes(subjectFilter)
      );
    }

    // Grade filter
    if (gradeFilter !== 'all') {
      filtered = filtered.filter((cls) => cls.grade === gradeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.className.localeCompare(b.className);
        case 'students':
          return b.enrolled - a.enrolled;
        case 'attendance':
          const rateA = a.attendanceRate || 0;
          const rateB = b.attendanceRate || 0;
          return rateB - rateA;
        case 'recent':
          const dateA = a.lastAttendanceDate?.getTime() || 0;
          const dateB = b.lastAttendanceDate?.getTime() || 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [classes, searchTerm, subjectFilter, gradeFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading classes: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <i className="fas fa-chalkboard-teacher text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Assigned</h3>
          <p className="text-gray-600">
            You don't have any classes assigned yet. Contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="all">All Grades</option>
              {uniqueGrades.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and View Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="name">Name</option>
              <option value="students">Students</option>
              <option value="attendance">Attendance Rate</option>
              <option value="recent">Recent Activity</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Grid View"
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="List View"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredAndSortedClasses.length} of {classes.length} class(es)
      </div>

      {/* Classes Grid/List */}
      {filteredAndSortedClasses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <i className="fas fa-search text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-600">No classes match your filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSubjectFilter('all');
              setGradeFilter('all');
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredAndSortedClasses.map((classData) => (
            <ClassCard
              key={classData.id}
              classData={classData}
              onClick={onClassSelect ? () => onClassSelect(classData) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

