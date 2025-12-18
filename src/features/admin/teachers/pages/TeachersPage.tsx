export const TeachersPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin – Teachers</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Add Teacher
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600">Teachers management interface will be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">
            This page will allow admins to manage teachers and their assignments.
          </p>
        </div>
      </div>
    </div>
  );
};


