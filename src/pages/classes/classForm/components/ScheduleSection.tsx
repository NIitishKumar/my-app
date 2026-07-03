import type { FormikProps } from 'formik';
// import { formatDateForInput, parseDateFromInput } from '../../utils/classes.utils';
import { FieldLabel } from './FieldLabel';
import type { CreateClassData } from '../../index.types';
import { FieldError } from './FieldError';
import { getInputClassName, resolveFieldState } from './FieldStyles';

interface ScheduleSectionProps {
  formik: FormikProps<CreateClassData>;
  academicYearOptions: readonly string[];
  semesterOptions: readonly string[];
  getFieldError: (field: string) => string | undefined;
  isFieldInvalid: (field: string) => boolean;
}

/** Academic Year, Semester, Start Date, and End Date fields. */
export const ScheduleSection = ({ formik, academicYearOptions, getFieldError, isFieldInvalid }: ScheduleSectionProps) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <h4 className="text-sm font-semibold text-gray-900 mb-3">Schedule Information</h4>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Academic Year */}
      <div>
        <FieldLabel required>Academic Year</FieldLabel>
        <select
          name="schedule.academicYear"
          value={formik.values.schedule?.academicYear || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={getInputClassName(resolveFieldState(false, isFieldInvalid('schedule.academicYear'), false))}
        >
          <option value="">Select academic year</option>
          {academicYearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <FieldError message={getFieldError('schedule.academicYear')} />
      </div>
    </div>
  </div>
);
