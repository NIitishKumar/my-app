import { useStudentDetails } from '../classDetails/index.hook';

// Component to fetch and display a single student
export const StudentDetailItem = ({ studentId }: { studentId: string }) => {
  const { data: student, isLoading, error } = useStudentDetails(studentId);

  if (isLoading) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg bg-red-50">
        <p className="text-sm text-red-600">Student not found (ID: {studentId})</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {student.firstName} {student.lastName}
          </h4>
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <i className="fas fa-id-card w-4"></i>
              <span>ID: {student.studentId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-envelope w-4"></i>
              <span>{student.email}</span>
            </div>
            {student.age && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-birthday-cake w-4"></i>
                <span>Age: {student.age}</span>
              </div>
            )}
            {student.grade && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-graduation-cap w-4"></i>
                <span>Grade: {student.grade}</span>
              </div>
            )}
            {student.phone && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-phone w-4"></i>
                <span>{student.phone}</span>
              </div>
            )}
            {student.enrolledAt && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-calendar w-4"></i>
                <span>Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        <div className="ml-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              student.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {student.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};
