/**
 * TeachersPage Component
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTeachers } from '../hooks/useTeachers';
import { useCreateTeacher } from '../hooks/useCreateTeacher';
import { useUpdateTeacher } from '../hooks/useUpdateTeacher';
import { useDeleteTeacher } from '../hooks/useDeleteTeacher';
import { TeacherTable } from '../components/TeacherTable';
import { TeacherForm } from '../components/TeacherForm';
import { DEPARTMENT_OPTIONS } from '../constants/teachers.constants';
import type { Teacher, CreateTeacherData, TeachersQueryParams } from '../types/teachers.types';

const ITEMS_PER_PAGE = 10;

export const TeachersPage = () => {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'on-leave'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Build query params for API
  const queryParams: TeachersQueryParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    ...(searchTerm.trim() && { search: searchTerm.trim() }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(departmentFilter !== 'all' && { department: departmentFilter }),
  };

  const { data, isLoading, error } = useTeachers(queryParams);
  const teachers = data?.teachers || [];
  const pagination = data?.pagination || {
    count: 0,
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    pages: 1,
  };

  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, departmentFilter]);

  // Handle openForm from navigation state (for Quick Actions)
  useEffect(() => {
    const shouldOpenForm = (location.state as any)?.openForm;
    if (shouldOpenForm) {
      setEditingTeacher(undefined);
      setShowForm(true);
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = (formData: CreateTeacherData) => {
    if (editingTeacher) {
      updateTeacher.mutate(
        { id: editingTeacher.id, ...formData },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingTeacher(undefined);
          },
        }
      );
    } else {
      createTeacher.mutate(formData, {
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

  if (isLoading && teachers.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading teachers...</div>
      </div>
    );
  }

  if (error && teachers.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">Error loading teachers: {error.message || 'Unknown error'}</div>
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
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="all">All Departments</option>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'on-leave');
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
            {teachers.length > 0 ? (
              <>
                <TeacherTable
                  teachers={teachers}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{pagination.count > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                        currentPage === 1 || isLoading
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {pagination.pages > 1 && (
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                          let page;
                          if (pagination.pages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= pagination.pages - 2) {
                            page = pagination.pages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              disabled={isLoading}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                currentPage === page
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                              } disabled:opacity-50`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {pagination.pages === 1 && (
                      <div className="flex items-center space-x-1">
                        <button
                          className="px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white"
                          disabled
                        >
                          1
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages || isLoading}
                      className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                        currentPage === pagination.pages || isLoading
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
                  {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by adding your first teacher using the "Add Teacher" button'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
