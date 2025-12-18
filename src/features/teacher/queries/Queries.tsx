export const Queries = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Teacher – Queries</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Raise Query
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600">Query management interface will be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">
            This page will allow teachers to raise queries to admin and view query status.
          </p>
        </div>
      </div>
    </div>
  );
};

