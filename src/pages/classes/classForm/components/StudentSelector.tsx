import type { RefObject } from 'react';
import { FieldLabel } from './FieldLabel';

export interface StudentOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
}

interface StudentSelectorProps {
  isDisabled: boolean;
  isLoadingStudents: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  isDropdownOpen: boolean;
  onDropdownOpenChange: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement>;
  filteredStudents: StudentOption[];
  selectedStudentIds: string[];
  selectedStudents: StudentOption[];
  onToggleStudent: (studentId: string) => void;
  onRemoveStudent: (studentId: string) => void;
}

/** Search-and-select control for enrolling/unenrolling students in a class. */
export const StudentSelector = ({
  isDisabled,
  isLoadingStudents,
  searchTerm,
  onSearchTermChange,
  isDropdownOpen,
  onDropdownOpenChange,
  dropdownRef,
  filteredStudents,
  selectedStudentIds,
  selectedStudents,
  onToggleStudent,
  onRemoveStudent,
}: StudentSelectorProps) => {
  const fieldDisabled = isDisabled || isLoadingStudents;

  return (
    <div className="lg:col-span-2">
      <FieldLabel>Students</FieldLabel>

      <div className="relative">
        {selectedStudents.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedStudents.map((student) => (
              <span
                key={student.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200"
              >
                {student.firstName} {student.lastName} ({student.studentId})
                <button
                  type="button"
                  onClick={() => onRemoveStudent(student.id)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                  disabled={isDisabled}
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search students by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => {
              onSearchTermChange(e.target.value);
              onDropdownOpenChange(true);
            }}
            onFocus={() => onDropdownOpenChange(true)}
            disabled={fieldDisabled}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
              fieldDisabled ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
            }`}
          />
          <div className="absolute right-3 top-3 pointer-events-none">
            <i className="fas fa-chevron-down text-gray-400"></i>
          </div>

          {isDropdownOpen && !isLoadingStudents && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredStudents.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">{searchTerm.trim() ? 'No students found' : 'No students available'}</div>
              ) : (
                <ul className="py-1">
                  {filteredStudents.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    return (
                      <li
                        key={student.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${isSelected ? 'bg-indigo-100' : ''}`}
                        onClick={() => {
                          onToggleStudent(student.id);
                          onSearchTermChange('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              readOnly
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {student.email} • {student.studentId}
                              </div>
                            </div>
                          </div>
                          {isSelected && <i className="fas fa-check text-indigo-600"></i>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {isLoadingStudents && <p className="mt-1 text-xs text-gray-500">Loading students...</p>}
        <p className="mt-1 text-xs text-gray-500">Select students to add to this class. {selectedStudents.length} student(s) selected.</p>
      </div>
    </div>
  );
};
