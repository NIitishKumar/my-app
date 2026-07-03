import { Spinner } from './Spinner';

interface FormFooterProps {
  onCancel?: () => void;
  onSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isSaving: boolean;
  isDisabled: boolean;
}

/** Sticky Cancel / Save Class footer bar. */
export const FormFooter = ({ onCancel, onSave, isSaving, isDisabled }: FormFooterProps) => (
  <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex items-center justify-between">
    <button
      type="button"
      onClick={onCancel}
      disabled={isDisabled}
      className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
    >
      Cancel
    </button>

    <button
      type="submit"
      onClick={onSave}
      disabled={isDisabled || isSaving}
      className={`px-6 py-2.5 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 ${
        isDisabled || isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {isSaving ? (
        <>
          <Spinner />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <i className="fas fa-save"></i>
          <span>Save Class</span>
        </>
      )}
    </button>
  </div>
);
