import { useLectureDetails } from '../../../features/admin';

export const LectureDetailItem = ({ lectureId }: { lectureId: string }) => {
  const { data: lecture, isLoading, error } = useLectureDetails(lectureId);

  if (isLoading) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg bg-red-50">
        <p className="text-sm text-red-600">Lecture not found (ID: {lectureId})</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{lecture.title}</h4>
          {lecture.description && <p className="mt-1 text-xs text-gray-600">{lecture.description}</p>}
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <i className="fas fa-book w-4"></i>
              <span>Subject: {lecture.subject}</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-chalkboard-teacher w-4"></i>
              <span>
                Teacher: {lecture.teacher.firstName} {lecture.teacher.lastName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-calendar-day w-4"></i>
              <span>
                Schedule: {lecture.schedule.dayOfWeek} {lecture.schedule.startTime} - {lecture.schedule.endTime}
              </span>
            </div>
            {lecture.schedule.room && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-door-open w-4"></i>
                <span>Room: {lecture.schedule.room}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock w-4"></i>
              <span>Duration: {lecture.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-tag w-4"></i>
              <span>Type: {lecture.type}</span>
            </div>
            {lecture.materials && lecture.materials.length > 0 && (
              <div className="flex items-start space-x-2 mt-2">
                <i className="fas fa-paperclip w-4 mt-0.5"></i>
                <div>
                  <span className="font-medium">Materials:</span>
                  <ul className="mt-1 space-y-1">
                    {lecture.materials.map((material, idx) => (
                      <li key={idx} className="text-xs">
                        • {material.name} ({material.type})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="ml-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              lecture.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {lecture.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};
