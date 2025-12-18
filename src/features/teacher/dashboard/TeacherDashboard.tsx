export const TeacherDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Assigned Classes</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Total Periods</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Pending Queries</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">-</p>
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        <p className="text-gray-600">No classes scheduled for today.</p>
      </div>
    </div>
  );
};

