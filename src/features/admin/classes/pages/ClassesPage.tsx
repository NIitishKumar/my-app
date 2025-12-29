/**
 * ClassesPage Component
 */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses';
import { useCreateClass } from '../hooks/useCreateClass';
import { useUpdateClass } from '../hooks/useUpdateClass';
import { useDeleteClass } from '../hooks/useDeleteClass';
import { useClassDetails } from '../hooks/useClassDetails';
import { ClassTable } from '../components/ClassTable';
import { ClassForm } from '../components/ClassForm';
import { filterClasses } from '../utils/classes.utils';
import { useUIStore } from '../../../../store/ui.store';
import type { Class, CreateClassData } from '../types/classes.types';

const ITEMS_PER_PAGE = 10;

export const ClassesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | undefined>();
  const [editingClass, setEditingClass] = useState<Class | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allClasses = [], isLoading, error } = useClasses();

  // Handle edit from navigation state
  useEffect(() => {
    const editClassId = (location.state as any)?.editClassId;
    if (editClassId) {
      const classToEdit = allClasses.find((c) => c.id === editClassId);
      if (classToEdit) {
        setEditingClass(classToEdit);
        setEditingClassId(classToEdit.id);
        setShowForm(true);
        // Clear the state to prevent re-triggering
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, allClasses]);
  
  // Fetch class details when editing
  const { 
    data: fetchedClassData, 
    isLoading: isLoadingClassDetails,
    error: classDetailsError 
  } = useClassDetails(editingClassId || '');

  // Update editingClass when fetched data is available or use table data as fallback
  useEffect(() => {
    if (editingClassId) {
      if (fetchedClassData) {
        // Use fresh data from API
        setEditingClass(fetchedClassData);
      } else if (classDetailsError && allClasses.length > 0) {
        // Fallback to table data if API call fails
        const classFromTable = allClasses.find(c => c.id === editingClassId);
        if (classFromTable) {
          setEditingClass(classFromTable);
        }
      }
    }
  }, [editingClassId, fetchedClassData, classDetailsError, allClasses]);

  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();
  const addToast = useUIStore((state) => state.addToast);

  // Filter classes based on search and status
  const filteredClasses = useMemo(() => {
    let filtered = allClasses || [];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filterClasses(filtered, searchTerm);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((classItem) =>
        statusFilter === 'active' ? classItem.isActive : !classItem.isActive
      );
    }

    return filtered;
  }, [allClasses, searchTerm, statusFilter]);

  // Paginate filtered classes
  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage]);

  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredClasses.length);

  const handleSubmit = (data: CreateClassData) => {
    console.log('handleSubmit called with data:', data);
    console.log('editingClassId:', editingClassId);
    console.log('editingClass:', editingClass);
    
    if (editingClassId || editingClass) {
      const classId = editingClass?.id || editingClassId;
      if (!classId) {
        console.error('Cannot update: missing class ID');
        alert('Error: Missing class ID. Please try again.');
        return;
      }
      
      console.log('Submitting update for class ID:', classId);
      console.log('Update data:', data);
      
      updateClass.mutate(
        { id: classId, ...data },
        {
          onSuccess: (result) => {
            console.log('Class updated successfully:', result);
            setShowForm(false);
            setEditingClass(undefined);
            setEditingClassId(undefined);
          },
          onError: (error) => {
            console.error('Error updating class:', error);
            alert(`Error updating class: ${error instanceof Error ? error.message : 'Unknown error'}`);
          },
        }
      );
    } else {
      console.log('Creating new class');
      createClass.mutate(data, {
        onSuccess: (result, variables, context) => {
          console.log('Class created successfully:', result);
          // Show success toast message (use API message if available)
          addToast({
            type: 'success',
            message: 'Class created successfully!',
            duration: 3000,
          });
          // Close form and redirect to listing
          setShowForm(false);
          setEditingClass(undefined);
          setEditingClassId(undefined);
        },
        onError: (error) => {
          console.error('Error creating class:', error);
          addToast({
            type: 'error',
            message: `Error creating class: ${error instanceof Error ? error.message : 'Unknown error'}`,
            duration: 5000,
          });
        },
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClass(undefined);
    setEditingClassId(undefined);
  };

  const handleAddNew = () => {
    setEditingClass(undefined);
    setEditingClassId(undefined);
    setShowForm(true);
  };

  const handleEdit = (classItem: Class) => {
    // Set the ID to trigger API fetch, and use table data as initial fallback
    setEditingClass(classItem);
    setEditingClassId(classItem.id);
    setShowForm(true);
  };

  const handleView = (classItem: Class) => {
    navigate(`/admin/classes/${classItem.id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      deleteClass.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading classes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">Error loading classes: {error instanceof Error ? error.message : 'Unknown error'}</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">All Classes</h1>
        <p className="text-sm text-gray-600">Manage class records</p>
      </div>

      {showForm ? (
        <div className="mb-6">
          {isLoadingClassDetails && !editingClass ? (
            <div className="text-center py-8">Loading class details...</div>
          ) : (
            <ClassForm
              initialData={editingClass}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={createClass.isPending || updateClass.isPending || (isLoadingClassDetails && !!editingClassId)}
            />
          )}
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
                  placeholder="Search by class name or section..."
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
                  setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
                  setCurrentPage(1); // Reset to first page on filter change
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
                <span>Add Class</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {paginatedClasses && paginatedClasses.length > 0 ? (
              <>
                <ClassTable
                  classes={paginatedClasses}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{filteredClasses.length}</span> results
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
