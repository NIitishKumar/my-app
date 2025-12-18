export const ParentDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Parent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Children</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Attendance %</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Pending Queries</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">-</p>
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Children Overview</h2>
        <p className="text-gray-600">No children information available.</p>
      </div>
    </div>
  );
};

