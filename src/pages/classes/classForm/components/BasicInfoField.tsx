import type { FormikProps } from 'formik';
// import type { CreateClassData } from '../../types/classes.types';
// import { FieldLabel } from './shared/FieldLabel';
// import { getInputClassName, resolveFieldState } from '../utils/fieldStyles';
import type { CreateClassData } from '../../index.types';
import { FieldLabel } from './FieldLabel';
import { getInputClassName, resolveFieldState } from './FieldStyles';
import { FieldError } from './FieldError';

interface BasicInfoFieldsProps {
  formik: FormikProps<CreateClassData>;
  isLoading?: boolean;
  gradeOptions: readonly (string | number)[];
  getFieldError: (field: string) => string | undefined;
  isFieldValid: (field: string) => boolean;
  isFieldInvalid: (field: string) => boolean;
}

/** Class Name, Grade, Room Number, and Capacity inputs. */
export const BasicInfoFields = ({ formik, isLoading, gradeOptions, getFieldError, isFieldValid, isFieldInvalid }: BasicInfoFieldsProps) => {
  const isDisabled = Boolean(isLoading || formik.isSubmitting);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Class Name */}
      <div>
        <FieldLabel required>Class Name</FieldLabel>
        <div className="relative">
          <input
            type="text"
            name="className"
            placeholder="e.g., Grade 10"
            value={formik.values.className || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isDisabled}
            required
            className={getInputClassName(resolveFieldState(isDisabled, isFieldInvalid('className'), isFieldValid('className')))}
          />
          {isFieldValid('className') && <i className="fas fa-check-circle absolute right-3 top-3 text-green-500"></i>}
          {isFieldInvalid('className') && <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>}
        </div>
        {isFieldInvalid('className') ? (
          <FieldError message={getFieldError('className')} />
        ) : (
          <p className="mt-1 text-xs text-gray-500">Enter the grade or class level</p>
        )}
      </div>

      {/* Grade */}
      <div>
        <FieldLabel required>Grade</FieldLabel>
        <select
          name="grade"
          value={formik.values.grade || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isDisabled}
          required
          className={getInputClassName(resolveFieldState(isDisabled, isFieldInvalid('grade'), isFieldValid('grade')))}
        >
          <option value="">Select grade</option>
          {gradeOptions.map((grade) => (
            <option key={grade} value={grade}>
              Grade {grade}
            </option>
          ))}
        </select>
        <FieldError message={getFieldError('grade')} />
      </div>

      {/* Room Number */}
      <div>
        <FieldLabel required>Room Number</FieldLabel>
        <input
          type="text"
          name="roomNo"
          placeholder="e.g., Room 201"
          value={formik.values.roomNo || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={getInputClassName(resolveFieldState(false, isFieldInvalid('roomNo'), isFieldValid('roomNo')))}
        />
        <FieldError message={getFieldError('roomNo')} />
      </div>

      {/* Capacity */}
      <div>
        <FieldLabel required>Capacity</FieldLabel>
        <input
          type="number"
          name="capacity"
          min={1}
          max={200}
          placeholder="e.g., 30"
          value={formik.values.capacity || ''}
          onChange={(e) => formik.setFieldValue('capacity', parseInt(e.target.value, 10) || 0)}
          onBlur={formik.handleBlur}
          required
          className={getInputClassName(resolveFieldState(false, isFieldInvalid('capacity'), isFieldValid('capacity')))}
        />
        <FieldError message={getFieldError('capacity')} />
      </div>
    </div>
  );
};
