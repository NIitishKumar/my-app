/** Static helper tip reminding users about required fields. */
export const FormTips = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-start space-x-3">
      <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
      <div>
        <p className="text-sm font-medium text-blue-900">Form Tips</p>
        <p className="text-xs text-blue-700 mt-1">
          All fields marked with <span className="text-red-500">*</span> are required. Make sure to assign a class head before saving.
        </p>
      </div>
    </div>
  </div>
);
