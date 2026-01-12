/**
 * ClassSelector Component
 * Multi-select dropdown for selecting classes
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { useClasses } from '../../admin/classes/hooks/useClasses';
import type { Class } from '../../admin/classes/types/classes.types';

interface ClassSelectorProps {
  selectedClassIds: string[];
  onSelectionChange: (classIds: string[]) => void;
  disabled?: boolean;
  error?: string;
}

export const ClassSelector = ({
  selectedClassIds,
  onSelectionChange,
  disabled = false,
  error,
}: ClassSelectorProps) => {
  const { data: allClasses = [], isLoading } = useClasses();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter classes based on search term
  const filteredClasses = useMemo(() => {
    if (!searchTerm.trim()) return allClasses;
    const term = searchTerm.toLowerCase();
    return allClasses.filter(
      (classItem) =>
        classItem.className.toLowerCase().includes(term) ||
        classItem.grade.includes(term) ||
        classItem.roomNo.toLowerCase().includes(term)
    );
  }, [allClasses, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleToggleClass = (classId: string) => {
    const currentIds = selectedClassIds || [];
    if (currentIds.includes(classId)) {
      onSelectionChange(currentIds.filter((id) => id !== classId));
    } else {
      onSelectionChange([...currentIds, classId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedClassIds.length === filteredClasses.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredClasses.map((c) => c.id));
    }
  };

  const selectedClasses = useMemo(() => {
    return allClasses.filter((c) => selectedClassIds.includes(c.id));
  }, [allClasses, selectedClassIds]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Target Classes <span className="text-red-500">*</span>
      </label>

      {/* Selected classes display */}
      <div
        onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
        className={`min-h-[42px] w-full px-3 py-2 border rounded-lg cursor-pointer ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-indigo-500'} focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500`}
      >
        {selectedClasses.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedClasses.map((classItem) => (
              <span
                key={classItem.id}
                className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-sm"
              >
                {classItem.className} - Grade {classItem.grade}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleClass(classItem.id);
                    }}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500 text-sm">Select classes...</span>
        )}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-gray-400`}></i>
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {isDropdownOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Select All option */}
          {filteredClasses.length > 0 && (
            <div
              onClick={handleSelectAll}
              className="px-4 py-2 hover:bg-indigo-50 cursor-pointer border-b border-gray-100"
            >
              <span className="text-sm font-medium text-indigo-600">
                {selectedClassIds.length === filteredClasses.length ? 'Deselect All' : 'Select All'}
              </span>
            </div>
          )}

          {/* Classes list */}
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading classes...</div>
          ) : filteredClasses.length > 0 ? (
            <div className="max-h-48 overflow-auto">
              {filteredClasses.map((classItem) => {
                const isSelected = selectedClassIds.includes(classItem.id);
                return (
                  <div
                    key={classItem.id}
                    onClick={() => handleToggleClass(classItem.id)}
                    className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between ${
                      isSelected ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <span className="text-sm text-gray-900">
                      {classItem.className} - Grade {classItem.grade}
                    </span>
                    {isSelected && (
                      <i className="fas fa-check text-indigo-600"></i>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">No classes found</div>
          )}
        </div>
      )}
    </div>
  );
};
