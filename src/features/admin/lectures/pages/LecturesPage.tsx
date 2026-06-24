/**
 * LecturesPage Component
 */

import { LectureTable } from '../components/LectureTable';
import { LectureForm } from '../components/LectureForm';
import { useLecturesPage } from './index.hook.js';

export const LecturesPage = () => {
  const {
    view,
    selectedClass,
    editingLecture,
    classSearchTerm,
    lectureSearchTerm,
    filteredClasses,
    classLectures,
    isLoading,
    isFormLoading,
    error,
    setClassSearchTerm,
    setLectureSearchTerm,
    getLectureCountForClass,
    handleSelectClass,
    handleBackToClasses,
    handleAddLecture,
    handleEditLecture,
    handleCancelForm,
    handleSubmit,
    handleView,
    handleDelete,
  } = useLecturesPage();

  if (isLoading && view === 'classes' && filteredClasses.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-gray-600">Loading classes and lectures...</div>
      </div>
    );
  }

  if (error && view === 'classes' && filteredClasses.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">
          Error loading data: {error.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (view === 'form' && selectedClass) {
    return (
      <div className="p-4 lg:p-6">
        <button
          type="button"
          onClick={handleCancelForm}
          className="mb-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to {selectedClass.className}
        </button>
        <LectureForm
          initialData={editingLecture}
          selectedClass={selectedClass}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isLoading={isFormLoading}
        />
      </div>
    );
  }

  if (view === 'class-lectures' && selectedClass) {
    return (
      <div className="p-4 lg:p-6">
        <button
          type="button"
          onClick={handleBackToClasses}
          className="mb-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          All Classes
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{selectedClass.className}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Grade {selectedClass.grade} • Room {selectedClass.roomNo} • {classLectures.length} lecture(s)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddLecture}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>Add Lecture</span>
          </button>
        </div>

        <div className="mb-6 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search lectures in this class..."
              value={lectureSearchTerm}
              onChange={(e) => setLectureSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {classLectures.length > 0 ? (
            <LectureTable
              lectures={classLectures}
              onView={handleView}
              onEdit={handleEditLecture}
              onDelete={handleDelete}
            />
          ) : (
            <div className="p-10 text-center">
              <i className="fas fa-chalkboard-teacher text-gray-300 text-4xl mb-3"></i>
              <p className="text-sm font-medium text-gray-900">No lectures for this class yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                {lectureSearchTerm.trim()
                  ? 'Try a different search term'
                  : 'Add the first lecture to get started'}
              </p>
              {!lectureSearchTerm.trim() && (
                <button
                  type="button"
                  onClick={handleAddLecture}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Add Lecture
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Lectures by Class</h1>
        <p className="text-sm text-gray-600">Select a class to view and manage its lectures</p>
      </div>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search classes..."
            value={classSearchTerm}
            onChange={(e) => setClassSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClasses.map((classItem) => {
            const lectureCount = getLectureCountForClass(classItem.id);
            const teacherName = `${classItem.classHead.firstName} ${classItem.classHead.lastName}`.trim();

            return (
              <button
                key={classItem.id}
                type="button"
                onClick={() => handleSelectClass(classItem)}
                className="text-left bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{classItem.className}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Grade {classItem.grade} • Room {classItem.roomNo}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {lectureCount} lecture{lectureCount === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <p>Class head: {teacherName || 'Unassigned'}</p>
                  <p className="mt-1">{classItem.enrolled ?? 0} students enrolled</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <i className="fas fa-school text-gray-300 text-4xl mb-3"></i>
          <p className="text-sm font-medium text-gray-900">No classes found</p>
          <p className="text-xs text-gray-500 mt-1">
            {classSearchTerm.trim()
              ? 'Try adjusting your search'
              : 'Create a class first, then add lectures to it'}
          </p>
        </div>
      )}
    </div>
  );
};
