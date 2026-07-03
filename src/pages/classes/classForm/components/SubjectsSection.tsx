import { FieldError } from './FieldError';
import { FieldLabel } from './FieldLabel';

interface SubjectsSectionProps {
  subjectOptions: readonly string[];
  selectedSubjects: string[];
  onToggleSubject: (subject: string) => void;
  errorMessage?: string;
  hasError: boolean;
}

/** Checkbox grid for choosing which subjects this class covers. */
export const SubjectsSection = ({ subjectOptions, selectedSubjects, onToggleSubject, errorMessage, hasError }: SubjectsSectionProps) => (
  <div>
    <FieldLabel required className="mb-3">
      Subjects
    </FieldLabel>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {subjectOptions.map((subject) => (
        <label
          key={subject}
          className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedSubjects.includes(subject)}
            onChange={() => onToggleSubject(subject)}
            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">{subject}</span>
        </label>
      ))}
    </div>
    {hasError && <FieldError message={errorMessage} />}
  </div>
);
