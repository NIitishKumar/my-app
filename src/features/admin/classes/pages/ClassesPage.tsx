/**
 * ClassesPage Component
 */

import { useState } from 'react';
import { useClasses } from '../hooks/useClasses';
import { useCreateClass } from '../hooks/useCreateClass';
import { useDeleteClass } from '../hooks/useDeleteClass';
import { ClassTable } from '../components/ClassTable';
import { ClassForm } from '../components/ClassForm';
import type { Class } from '../types/classes.types';

export const ClassesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>();

  const { data: classes, isLoading, error } = useClasses();
  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();

  const handleCreate = (data: any) => {
    createClass.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      deleteClass.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading classes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">Error loading classes</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin – Classes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Class'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingClass ? 'Edit Class' : 'Create New Class'}
          </h2>
          <ClassForm
            initialData={editingClass}
            onSubmit={handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingClass(undefined);
            }}
            isLoading={createClass.isPending}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {classes && classes.length > 0 ? (
          <ClassTable
            classes={classes}
            onEdit={(classItem) => {
              setEditingClass(classItem);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        ) : (
          <div className="p-6 text-center text-gray-500">
            No classes found. Create your first class to get started.
          </div>
        )}
      </div>
    </div>
  );
};


