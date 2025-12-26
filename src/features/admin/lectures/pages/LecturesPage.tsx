/**
 * LecturesPage Component
 */

import { useState, useMemo } from 'react';
import { useLectures } from '../hooks/useLectures';
import { useCreateLecture } from '../hooks/useCreateLecture';
import { useUpdateLecture } from '../hooks/useUpdateLecture';
import { useDeleteLecture } from '../hooks/useDeleteLecture';
import { LectureTable } from '../components/LectureTable';
import { LectureForm } from '../components/LectureForm';
import { generateMockLectures, filterLectures } from '../utils/lectures.utils';
import type { Lecture, CreateLectureData } from '../types/lectures.types';

const ITEMS_PER_PAGE = 10;

export const LecturesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lecture' | 'lab' | 'seminar' | 'tutorial'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Use mock data for now
  const mockLectures = useMemo(() => generateMockLectures(), []);
  const { data: apiLectures, isLoading, error } = useLectures();
  
  // Use mock data if API data is not available
  const allLectures = apiLectures && apiLectures.length > 0 ? apiLectures : mockLectures;

  const createLecture = useCreateLecture();
  const updateLecture = useUpdateLecture();
  const deleteLecture = useDeleteLecture();

  // Filter lectures based on search, type, and status
  const filteredLectures = useMemo(() => {
    let filtered = allLectures || [];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filterLectures(filtered, searchTerm);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((lecture) => lecture.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((lecture) =>
        statusFilter === 'active' ? lecture.isActive : !lecture.isActive
      );
    }

    return filtered;
  }, [allLectures, searchTerm, typeFilter, statusFilter]);

  // Paginate filtered lectures
  const paginatedLectures = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredLectures.slice(startIndex, endIndex);
  }, [filteredLectures, currentPage]);

  const totalPages = Math.ceil(filteredLectures.length / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredLectures.length);

  const handleSubmit = (data: CreateLectureData) => {
    if (editingLecture) {
      updateLecture.mutate(
        { id: editingLecture.id, ...data },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingLecture(undefined);
          },
        }
      );
    } else {
      createLecture.mutate(data, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLecture(undefined);
  };

  const handleAddNew = () => {
    setEditingLecture(undefined);
    setShowForm(true);
  };

  const handleEdit = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setShowForm(true);
  };

  const handleView = (lecture: Lecture) => {
    // TODO: Implement view functionality (maybe show details modal)
    console.log('View lecture:', lecture);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      deleteLecture.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !mockLectures.length) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading lectures...</div>
      </div>
    );
  }

  if (error && !mockLectures.length) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">Error loading lectures</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">All Lectures</h1>
        <p className="text-sm text-gray-600">Manage lecture records</p>
      </div>

      {showForm ? (
        <div className="mb-6">
          <LectureForm
            initialData={editingLecture}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createLecture.isPending || updateLecture.isPending}
          />
        </div>
      ) : (
        <>
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search by title, subject, teacher, or room..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as 'all' | 'lecture' | 'lab' | 'seminar' | 'tutorial');
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="all">All Types</option>
                <option value="lecture">Lecture</option>
                <option value="lab">Lab</option>
                <option value="seminar">Seminar</option>
                <option value="tutorial">Tutorial</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={handleAddNew}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add Lecture</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {paginatedLectures && paginatedLectures.length > 0 ? (
              <>
                <LectureTable
                  lectures={paginatedLectures}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{filteredLectures.length}</span> results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {totalPages > 1 && (
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                currentPage === page
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {totalPages === 1 && (
                      <div className="flex items-center space-x-1">
                        <button
                          className="px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white"
                        >
                          1
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <i className="fas fa-inbox text-gray-400 text-4xl mb-3"></i>
                <p className="text-sm font-medium text-gray-900">No records found</p>
                <p className="text-xs text-gray-500 mt-1">
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by adding your first record using the form above'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

