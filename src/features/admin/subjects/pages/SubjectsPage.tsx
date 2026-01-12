/**
 * SubjectsPage Component
 */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubjects } from '../hooks/useSubjects';
import { useCreateSubject } from '../hooks/useCreateSubject';
import { useUpdateSubject } from '../hooks/useUpdateSubject';
import { useDeleteSubject } from '../hooks/useDeleteSubject';
import { useSubject } from '../hooks/useSubject';
import { SubjectTable } from '../components/SubjectTable';
import { SubjectForm } from '../components/SubjectForm';
import { SubjectSidebar } from '../components/SubjectSidebar';
import {
  filterSubjects,
  filterSubjectsByClass,
  filterSubjectsByStatus,
} from '../utils/subjects.utils';
import { useUIStore } from '../../../../store/ui.store';
import type { Subject, CreateSubjectData } from '../types/subjects.types';

const ITEMS_PER_PAGE = 10;

export const SubjectsPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | undefined>();
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allSubjects = [], isLoading, error } = useSubjects();

  // Fetch subject details when editing
  const {
    data: fetchedSubjectData,
    isLoading: isLoadingSubjectDetails,
    error: subjectDetailsError,
  } = useSubject(editingSubjectId || '');

  // Update editingSubject when fetched data is available
  useEffect(() => {
    if (editingSubjectId) {
      if (fetchedSubjectData) {
        setEditingSubject(fetchedSubjectData);
      } else if (subjectDetailsError && allSubjects.length > 0) {
        const subjectFromTable = allSubjects.find((s) => s.id === editingSubjectId);
        if (subjectFromTable) {
          setEditingSubject(subjectFromTable);
        }
      }
    }
  }, [editingSubjectId, fetchedSubjectData, subjectDetailsError, allSubjects]);

  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();
  const addToast = useUIStore((state) => state.addToast);

  // Filter subjects based on search, class, and status
  const filteredSubjects = useMemo(() => {
    let filtered = allSubjects || [];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filterSubjects(filtered, searchTerm);
    }

    // Apply class filter
    if (classFilter !== 'all') {
      filtered = filterSubjectsByClass(filtered, classFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filterSubjectsByStatus(filtered, statusFilter);
    }

    return filtered;
  }, [allSubjects, searchTerm, classFilter, statusFilter]);

  // Paginate filtered subjects
  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSubjects.slice(startIndex, endIndex);
  }, [filteredSubjects, currentPage]);

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length);

  const handleSubmit = (data: CreateSubjectData) => {
    if (editingSubjectId || editingSubject) {
      const subjectId = editingSubject?.id || editingSubjectId;
      if (!subjectId) {
        alert('Error: Missing subject ID. Please try again.');
        return;
      }

      updateSubject.mutate(
        { id: subjectId, ...data },
        {
          onSuccess: () => {
            addToast({
              type: 'success',
              message: 'Subject updated successfully!',
              duration: 3000,
            });
            setShowForm(false);
            setEditingSubject(undefined);
            setEditingSubjectId(undefined);
          },
          onError: (error) => {
            addToast({
              type: 'error',
              message: `Error updating subject: ${error instanceof Error ? error.message : 'Unknown error'}`,
              duration: 5000,
            });
          },
        }
      );
    } else {
      createSubject.mutate(data, {
        onSuccess: () => {
          addToast({
            type: 'success',
            message: 'Subject created successfully!',
            duration: 3000,
          });
          setShowForm(false);
          setEditingSubject(undefined);
          setEditingSubjectId(undefined);
        },
        onError: (error) => {
          addToast({
            type: 'error',
            message: `Error creating subject: ${error instanceof Error ? error.message : 'Unknown error'}`,
            duration: 5000,
          });
        },
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubject(undefined);
    setEditingSubjectId(undefined);
  };

  const handleAddNew = () => {
    setEditingSubject(undefined);
    setEditingSubjectId(undefined);
    setShowForm(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setEditingSubjectId(subject.id);
    setShowForm(true);
  };

  const handleView = (subject: Subject) => {
    navigate(`/admin/subjects/${subject.id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      deleteSubject.mutate(id, {
        onSuccess: () => {
          addToast({
            type: 'success',
            message: 'Subject deleted successfully!',
            duration: 3000,
          });
        },
        onError: (error) => {
          addToast({
            type: 'error',
            message: `Error deleting subject: ${error instanceof Error ? error.message : 'Unknown error'}`,
            duration: 5000,
          });
        },
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading subjects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">
          Error loading subjects: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">All Subjects</h1>
        <p className="text-sm text-gray-600">Manage subject records</p>
      </div>

      {showForm ? (
        <div className="mb-6">
          {isLoadingSubjectDetails && !editingSubject ? (
            <div className="text-center py-8">Loading subject details...</div>
          ) : (
            <SubjectForm
              initialData={editingSubject}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={
                createSubject.isPending ||
                updateSubject.isPending ||
                (isLoadingSubjectDetails && !!editingSubjectId)
              }
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <SubjectSidebar
              searchTerm={searchTerm}
              onSearchChange={(term) => {
                setSearchTerm(term);
                setCurrentPage(1);
              }}
              selectedClassId={classFilter}
              onClassFilterChange={(classId) => {
                setClassFilter(classId);
                setCurrentPage(1);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={(status) => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Add Subject Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleAddNew}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add Subject</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {paginatedSubjects && paginatedSubjects.length > 0 ? (
                <>
                  <SubjectTable
                    subjects={paginatedSubjects}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startItem}</span> to{' '}
                      <span className="font-medium">{endItem}</span> of{' '}
                      <span className="font-medium">{filteredSubjects.length}</span> results
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
                          <button className="px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white">
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
                    {searchTerm || classFilter !== 'all' || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start by adding your first subject using the form above'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

