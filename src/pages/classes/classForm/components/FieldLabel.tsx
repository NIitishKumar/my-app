import type { ReactNode } from 'react';

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
  className?: string;
}

/** Standardized label used above every input/select/group in the form. */
export const FieldLabel = ({ children, required, className = 'mb-2' }: FieldLabelProps) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);
