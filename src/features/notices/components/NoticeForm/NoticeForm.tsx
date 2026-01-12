/**
 * NoticeForm Component
 */

import { useNoticeForm } from './NoticeForm.hook';
import { ClassSelector } from '../ClassSelector';
import { AUDIENCE_OPTIONS, PRIORITY_OPTIONS, VALIDATION } from '../../constants/notices.constants';
import type { NoticeFormProps } from './NoticeForm.types';

export const NoticeForm = ({
  initialData,
  onSubmit,
  onSaveDraft,
  onCancel,
  isLoading = false,
  onFormDataChange,
}: NoticeFormProps) => {
  const {
    formik,
    isOffline,
    handleSaveDraft,
    getFieldError,
    isFieldInvalid,
    titleCharCount,
    descriptionCharCount,
    formatDateTimeForInput,
    parseDateTimeFromInput,
  } = useNoticeForm(initialData, onSubmit, onSaveDraft, isLoading, onFormDataChange);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? 'Edit Notice' : 'Create Notice'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Enter notice information below</p>
        </div>

        {/* Offline Banner */}
        {isOffline && (
          <div className="mx-6 mt-4 flex items-center justify-between px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="fas fa-exclamation-triangle text-yellow-600"></i>
              <p className="text-sm text-yellow-800">
                You're offline. Notice will be saved as draft and published when you come back online.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                placeholder="Enter notice title..."
                value={formik.values.title || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading || formik.isSubmitting}
                maxLength={VALIDATION.TITLE_MAX_LENGTH}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  isLoading || formik.isSubmitting
                    ? 'bg-gray-100 cursor-not-allowed'
                    : isFieldInvalid('title')
                    ? 'border-red-500 bg-red-50 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                }`}
                required
              />
              {isFieldInvalid('title') && (
                <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between">
              {isFieldInvalid('title') ? (
                <p className="text-xs text-red-600">{getFieldError('title')}</p>
              ) : (
                <p className="text-xs text-gray-500">Enter a clear and concise title</p>
              )}
              <p className="text-xs text-gray-500">
                {titleCharCount}/{VALIDATION.TITLE_MAX_LENGTH}
              </p>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                rows={6}
                placeholder="Enter notice description..."
                value={formik.values.description || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading || formik.isSubmitting}
                maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                  isLoading || formik.isSubmitting
                    ? 'bg-gray-100 cursor-not-allowed'
                    : isFieldInvalid('description')
                    ? 'border-red-500 bg-red-50 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                }`}
                required
              />
              {isFieldInvalid('description') && (
                <i className="fas fa-exclamation-circle absolute right-3 top-3 text-red-500"></i>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between">
              {isFieldInvalid('description') ? (
                <p className="text-xs text-red-600">{getFieldError('description')}</p>
              ) : (
                <p className="text-xs text-gray-500">Provide detailed information about the notice</p>
              )}
              <p className="text-xs text-gray-500">
                {descriptionCharCount}/{VALIDATION.DESCRIPTION_MAX_LENGTH}
              </p>
            </div>
          </div>

          {/* Audience Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audience <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AUDIENCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formik.values.audience === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  } ${isLoading || formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="audience"
                    value={option.value}
                    checked={formik.values.audience === option.value}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading || formik.isSubmitting}
                    className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {isFieldInvalid('audience') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('audience')}</p>
            )}
          </div>

          {/* Class Selector (shown when audience is not ALL) */}
          {formik.values.audience && formik.values.audience !== 'ALL' && (
            <div>
              <ClassSelector
                selectedClassIds={formik.values.classIds || []}
                onSelectionChange={(classIds) => formik.setFieldValue('classIds', classIds)}
                disabled={isLoading || formik.isSubmitting}
                error={getFieldError('classIds')}
              />
            </div>
          )}

          {/* Priority Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formik.values.priority || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading || formik.isSubmitting}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                isLoading || formik.isSubmitting
                  ? 'bg-gray-100 cursor-not-allowed'
                  : isFieldInvalid('priority')
                  ? 'border-red-500 bg-red-50 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
              required
            >
              <option value="">Select priority</option>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isFieldInvalid('priority') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('priority')}</p>
            )}
          </div>

          {/* Publish Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formik.values.publishType === 'NOW'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                } ${isLoading || formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="publishType"
                  value="NOW"
                  checked={formik.values.publishType === 'NOW'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading || formik.isSubmitting}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Publish Now</span>
              </label>
              <label
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formik.values.publishType === 'SCHEDULED'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                } ${isLoading || formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="publishType"
                  value="SCHEDULED"
                  checked={formik.values.publishType === 'SCHEDULED'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading || formik.isSubmitting}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Schedule</span>
              </label>
            </div>
            {isFieldInvalid('publishType') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('publishType')}</p>
            )}
          </div>

          {/* Schedule Date/Time (shown when SCHEDULED) */}
          {formik.values.publishType === 'SCHEDULED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publish Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="publishAt"
                value={formik.values.publishAt ? formatDateTimeForInput(formik.values.publishAt) : ''}
                onChange={(e) => {
                  const date = parseDateTimeFromInput(e.target.value);
                  formik.setFieldValue('publishAt', date);
                }}
                onBlur={formik.handleBlur}
                disabled={isLoading || formik.isSubmitting}
                min={formatDateTimeForInput(new Date())}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  isLoading || formik.isSubmitting
                    ? 'bg-gray-100 cursor-not-allowed'
                    : isFieldInvalid('publishAt')
                    ? 'border-red-500 bg-red-50 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                }`}
                required
              />
              {isFieldInvalid('publishAt') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('publishAt')}</p>
              )}
            </div>
          )}

          {/* Expiry Date (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date <span className="text-gray-500 text-xs font-normal">(Optional)</span>
            </label>
            <input
              type="date"
              name="expiresAt"
              value={formik.values.expiresAt ? formatDateTimeForInput(formik.values.expiresAt) : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                formik.setFieldValue('expiresAt', date);
              }}
              onBlur={formik.handleBlur}
              disabled={isLoading || formik.isSubmitting}
              min={formik.values.publishAt ? formatDateTimeForInput(formik.values.publishAt) : formatDateTimeForInput(new Date())}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                isLoading || formik.isSubmitting
                  ? 'bg-gray-100 cursor-not-allowed'
                  : isFieldInvalid('expiresAt')
                  ? 'border-red-500 bg-red-50 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
            />
            {isFieldInvalid('expiresAt') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('expiresAt')}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Notice will automatically expire on this date
            </p>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading || formik.isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-3">
              {onSaveDraft && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isLoading || formik.isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-save mr-2"></i>
                  Save Draft
                </button>
              )}
              <button
                type="button"
                onClick={() => formik.submitForm()}
                disabled={isLoading || formik.isSubmitting || isOffline}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg ${
                  isOffline
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading || formik.isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Publishing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
