import type { FormikHandlers } from 'formik';
import { FieldLabel } from './FieldLabel';

interface StatusSectionProps {
  isActive: boolean | undefined;
  onChange: (isActive: boolean) => void;
  onBlur: FormikHandlers['handleBlur'];
}

/** Active / Inactive radio toggle for the class record. */
export const StatusSection = ({ isActive, onChange, onBlur }: StatusSectionProps) => (
  <div>
    <FieldLabel required className="mb-3">
      Status
    </FieldLabel>
    <div className="flex items-center space-x-6">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="isActive"
          value="true"
          checked={isActive === true}
          onChange={() => onChange(true)}
          onBlur={onBlur}
          className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
          required
        />
        <span className="text-sm text-gray-700">Active</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="isActive"
          value="false"
          checked={isActive === false}
          onChange={() => onChange(false)}
          onBlur={onBlur}
          className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
          required
        />
        <span className="text-sm text-gray-700">Inactive</span>
      </label>
    </div>
  </div>
);
