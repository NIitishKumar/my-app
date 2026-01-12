/**
 * NoticesListPage Component
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoticeTable } from '../components/NoticeTable';
import { useNotices } from '../hooks/useNotices';
import { useDeleteNotice } from '../hooks/useDeleteNotice';
import { useNoticeDraft } from '../hooks/useNoticeDraft';
import { useNoticesStore, selectDrafts } from '../../../store/notices.store';
import { ROUTES } from '../../../shared/constants';
import { filterNotices } from '../utils/notices.utils';
import type { Notice } from '../types/notices.types';

export const NoticesListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filters = useMemo(() => {
    const f: any = {};
    if (audienceFilter !== 'all') f.audience = audienceFilter;
    if (statusFilter !== 'all') f.status = statusFilter;
    if (priorityFilter !== 'all') f.priority = priorityFilter;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [audienceFilter, statusFilter, priorityFilter]);

  const { data: notices = [], isLoading, error } = useNotices(filters);
  const deleteNotice = useDeleteNotice();
  const { getAllDrafts } = useNoticeDraft();
  
  // Get drafts from store - use selector to get stable reference and avoid infinite loop
  const rawDrafts = useNoticesStore(selectDrafts);
  const drafts = useMemo(() => {
    if (rawDrafts.length === 0) return [];
    // Convert drafts to include Date objects (same logic as getAllDrafts in store)
    return rawDrafts.map((draft) => ({
      ...draft,
      publishAt: draft.publishAt ? new Date(draft.publishAt) : undefined,
      expiresAt: draft.expiresAt ? new Date(draft.expiresAt) : undefined,
      createdAt: new Date(draft.createdAt),
      updatedAt: new Date(draft.updatedAt),
    }));
  }, [rawDrafts]);

  // Filter notices by search term
  const filteredNotices = useMemo(() => {
    let filtered = notices;
    if (searchTerm.trim()) {
      filtered = filterNotices(filtered, searchTerm);
    }
    return filtered;
  }, [notices, searchTerm]);

  const handleCreate = () => {
    navigate(`${ROUTES.ADMIN_NOTICES}/create`);
  };

  const handleEdit = (notice: Notice) => {
    navigate(`${ROUTES.ADMIN_NOTICES}/${notice.id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      deleteNotice.mutate(id);
    }
  };

  const handleContinueDraft = (draftId: string) => {
    navigate(`${ROUTES.ADMIN_NOTICES}/create`, { state: { draftId } });
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading notices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">
          Error loading notices: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">All Notices</h1>
        <p className="text-sm text-gray-600">Manage notices and announcements</p>
      </div>

      {/* Drafts Section */}
      {drafts.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                You have {drafts.length} draft notice(s)
              </h3>
              <p className="text-xs text-yellow-700">
                {navigator.onLine
                  ? 'Drafts will be synced automatically'
                  : 'Drafts will be published when you come back online'}
              </p>
            </div>
            <button
              onClick={() => handleContinueDraft(drafts[0].id)}
              className="px-4 py-2 text-sm font-medium text-yellow-900 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200"
            >
              Continue Editing
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="all">All Audiences</option>
            <option value="ALL">All</option>
            <option value="TEACHERS">Teachers</option>
            <option value="STUDENTS">Students</option>
            <option value="PARENTS">Parents</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DRAFT">Draft</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="NORMAL">Normal</option>
            <option value="IMPORTANT">Important</option>
            <option value="URGENT">Urgent</option>
          </select>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>Create Notice</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <NoticeTable
          notices={filteredNotices}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
