import type { RefObject } from 'react';
import { FieldLabel } from './FieldLabel';
import { FieldError } from './FieldError';

export interface TeacherOption {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  employeeId?: string;
}

interface TeacherSelectorProps {
  isDisabled: boolean;
  isLoadingTeachers: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  isDropdownOpen: boolean;
  onDropdownOpenChange: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement>;
  filteredTeachers: TeacherOption[];
  selectedTeacherId: string | null | undefined;
  onSelectTeacher: (teacher: TeacherOption) => void;
  errorMessage?: string;
  hasError: boolean;
}

/** Search-and-select control for assigning a single teacher as class head. */
export const TeacherSelector = ({
  isDisabled,
  isLoadingTeachers,
  searchTerm,
  onSearchTermChange,
  isDropdownOpen,
  onDropdownOpenChange,
  dropdownRef,
  filteredTeachers,
  selectedTeacherId,
  onSelectTeacher,
  errorMessage,
  hasError,
}: TeacherSelectorProps) => {
  const fieldDisabled = isDisabled || isLoadingTeachers;

  return (
    <div>
      <FieldLabel required>Class Head</FieldLabel>
      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search teachers by name, email, or employee ID..."
          value={searchTerm}
          onChange={(e) => {
            onSearchTermChange(e.target.value);
            onDropdownOpenChange(true);
          }}
          onFocus={() => onDropdownOpenChange(true)}
          disabled={fieldDisabled}
          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
        />
        <div className="absolute right-3 top-3 pointer-events-none">
          <i className="fas fa-chevron-down text-gray-400" />
        </div>

        {isDropdownOpen && !isLoadingTeachers && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredTeachers.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">{searchTerm.trim() ? 'No teachers found' : 'No teachers available'}</div>
            ) : (
              <ul className="py-1">
                {filteredTeachers.map((teacher) => {
                  const isSelected = selectedTeacherId === teacher?.id;
                  return (
                    <li
                      key={teacher?.id || teacher?.employeeId}
                      className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${isSelected ? 'bg-indigo-100' : ''}`}
                      onClick={() => onSelectTeacher(teacher)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input type="radio" checked={isSelected} readOnly className="w-4 h-4 text-indigo-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {teacher?.firstName ?? ''} {teacher?.lastName ?? ''}
                            </div>
                            <div className="text-xs text-gray-500">
                              {teacher?.email ?? ''} • {teacher?.employeeId ?? ''}
                            </div>
                          </div>
                        </div>
                        {isSelected && <i className="fas fa-check text-indigo-600" />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
      {hasError && <FieldError message={errorMessage} />}
    </div>
  );
};
