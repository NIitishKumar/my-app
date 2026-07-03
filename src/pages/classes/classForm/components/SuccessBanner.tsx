interface SuccessBannerProps {
  visible: boolean;
  onDismiss: () => void;
}

/** Green confirmation banner shown after a successful save. */
export const SuccessBanner = ({ visible, onDismiss }: SuccessBannerProps) => {
  if (!visible) return null;

  return (
    <div className="mx-6 mt-4 flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <i className="fas fa-check-circle text-green-600"></i>
        <p className="text-sm text-green-800">Record saved successfully!</p>
      </div>
      <button onClick={onDismiss} className="text-green-600 hover:text-green-800" type="button">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};
