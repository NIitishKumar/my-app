/**
 * TeachersPage Component
 */

import { useState, useMemo } from 'react';
import { useTeachers } from '../hooks/useTeachers';
import { useCreateTeacher } from '../hooks/useCreateTeacher';
import { useUpdateTeacher } from '../hooks/useUpdateTeacher';
import { useDeleteTeacher } from '../hooks/useDeleteTeacher';
import { TeacherTable } from '../components/TeacherTable';
import { TeacherForm } from '../components/TeacherForm';
import { generateMockTeachers, filterTeachers } from '../utils/teachers.utils';
import type { Teacher, CreateTeacherData } from '../types/teachers.types';

const ITEMS_PER_PAGE = 10;

export const TeachersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'on-leave'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Use mock data for now
  const mockTeachers = useMemo(() => generateMockTeachers(), []);
  const { data: apiTeachers, isLoading, error } = useTeachers();
  
  // Use mock data if API data is not available
  const allTeachers = apiTeachers && apiTeachers.length > 0 ? apiTeachers : mockTeachers;

  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  // Filter teachers based on search and status
  const filteredTeachers = useMemo(() => {
    let filtered = allTeachers || [];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filterTeachers(filtered, searchTerm);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((teacher) => teacher.status === statusFilter);
    }

    return filtered;
  }, [allTeachers, searchTerm, statusFilter]);

  // Paginate filtered teachers
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTeachers.slice(startIndex, endIndex);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredTeachers.length);

  const handleSubmit = (data: CreateTeacherData) => {
    if (editingTeacher) {
      updateTeacher.mutate(
        { id: editingTeacher.id, ...data },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingTeacher(undefined);
          },
        }
      );
    } else {
      createTeacher.mutate(data, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeacher(undefined);
  };

  const handleAddNew = () => {
    setEditingTeacher(undefined);
    setShowForm(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleView = (teacher: Teacher) => {
    // TODO: Implement view functionality (maybe show details modal)
    console.log('View teacher:', teacher);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      deleteTeacher.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !mockTeachers.length) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading teachers...</div>
      </div>
    );
  }

  if (error && !mockTeachers.length) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">Error loading teachers</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">All Teachers</h1>
        <p className="text-sm text-gray-600">Manage teacher records</p>
      </div>

      {showForm ? (
        <div className="mb-6">
          <TeacherForm
            initialData={editingTeacher}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createTeacher.isPending || updateTeacher.isPending}
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
                  placeholder="Search by name, email, employee ID, or department..."
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
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'on-leave');
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
              <button
                onClick={handleAddNew}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add Teacher</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {paginatedTeachers && paginatedTeachers.length > 0 ? (
              <>
                <TeacherTable
                  teachers={paginatedTeachers}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{filteredTeachers.length}</span> results
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
                  {searchTerm || statusFilter !== 'all'
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
