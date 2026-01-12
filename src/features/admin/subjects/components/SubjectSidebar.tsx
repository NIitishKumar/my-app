/**
 * SubjectSidebar Component
 */

import { useState } from 'react';
import { useClasses } from '../../classes/hooks/useClasses';

interface SubjectSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedClassId: string;
  onClassFilterChange: (classId: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void;
}

export const SubjectSidebar = ({
  searchTerm,
  onSearchChange,
  selectedClassId,
  onClassFilterChange,
  statusFilter,
  onStatusFilterChange,
}: SubjectSidebarProps) => {
  const { data: allClasses, isLoading: isLoadingClasses } = useClasses();
  const classes = allClasses || [];

  return (
    <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Filters</h3>
        
        {/* Search */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400 text-sm"></i>
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search subjects..."
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Class Filter */}
        <div className="mb-4">
          <label htmlFor="classFilter" className="block text-xs font-medium text-gray-700 mb-2">
            Filter by Class
          </label>
          <select
            id="classFilter"
            value={selectedClassId}
            onChange={(e) => onClassFilterChange(e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoadingClasses}
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className} - Grade {cls.grade}
                {cls.section && ` (${cls.section})`}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="statusFilter" className="block text-xs font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(searchTerm || selectedClassId !== 'all' || statusFilter !== 'all') && (
        <button
          onClick={() => {
            onSearchChange('');
            onClassFilterChange('all');
            onStatusFilterChange('all');
          }}
          className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

