/**
 * ReportsPage Component
 * Placeholder page for generating reports
 */

export const ReportsPage = () => {
  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Generate Report</h1>
        <p className="text-sm text-gray-600">Create and download various reports</p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-file-invoice text-orange-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            The report generation feature is currently under development. You'll be able to generate and download various reports here.
          </p>
        </div>
      </div>
    </div>
  );
};
