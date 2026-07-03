/**
 * fieldStyles
 * ---------------------------------------------------------------------------
 * Centralizes the border/background/ring classes that were previously
 * duplicated as inline ternaries on every input/select in ClassForm.
 */

export type FieldState = 'disabled' | 'invalid' | 'valid' | 'default';

const STATE_STYLES: Record<FieldState, string> = {
  disabled: 'bg-gray-100 cursor-not-allowed border-gray-300',
  invalid: 'border-red-500 bg-red-50 focus:ring-red-500',
  valid: 'border-green-500 bg-green-50 focus:ring-green-500',
  default: 'border-gray-300 focus:ring-indigo-500 focus:border-transparent',
};

const BASE_INPUT_CLASSES = 'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2';

/** Resolve the semantic state for a field from its disabled/valid/invalid flags. */
export const resolveFieldState = (isDisabled: boolean, isInvalid: boolean, isValid: boolean): FieldState => {
  if (isDisabled) return 'disabled';
  if (isInvalid) return 'invalid';
  if (isValid) return 'valid';
  return 'default';
};

/** Build the full className string for a text/select input given its state. */
export const getInputClassName = (state: FieldState, extraClasses = ''): string =>
  `${BASE_INPUT_CLASSES} ${STATE_STYLES[state]} ${extraClasses}`.trim();
