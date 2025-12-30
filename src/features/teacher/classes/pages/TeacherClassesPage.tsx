/**
 * TeacherClassesPage Component
 * My Classes page for teachers
 */

import { useNavigate } from 'react-router-dom';
import { ClassesList } from '../components/ClassesList';

export const TeacherClassesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Classes</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage your assigned classes</p>
        </div>
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Classes List */}
      <ClassesList />
    </div>
  );
};

