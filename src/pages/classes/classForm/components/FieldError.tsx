interface FieldErrorProps {
  message?: string;
}

/** Renders a red inline validation message, or nothing if there isn't one. */
export const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) return null;

  return (
    <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
      <i className="fas fa-exclamation-circle"></i>
      <span>{message}</span>
    </p>
  );
};
