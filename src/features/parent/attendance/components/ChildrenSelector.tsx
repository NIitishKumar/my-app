/**
 * ChildrenSelector Component
 */

import React from 'react';

export interface Child {
  id: string;
  name: string;
  classId: string;
  className: string;
  avatar?: string;
}

interface ChildrenSelectorProps {
  children: Child[];
  selectedChildId: string | null;
  onSelectChild: (childId: string) => void;
  className?: string;
}

export const ChildrenSelector: React.FC<ChildrenSelectorProps> = ({
  children,
  selectedChildId,
  onSelectChild,
  className = '',
}) => {
  if (children.length === 0) {
    return (
      <div className={`text-center text-gray-500 p-4 ${className}`}>
        <p>No children found</p>
      </div>
    );
  }

  if (children.length === 1) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center gap-3">
          {children[0].avatar ? (
            <img
              src={children[0].avatar}
              alt={children[0].name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
              {children[0].name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{children[0].name}</p>
            <p className="text-sm text-gray-600">{children[0].className}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Child
      </label>
      <select
        value={selectedChildId || ''}
        onChange={(e) => onSelectChild(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Children</option>
        {children.map((child) => (
          <option key={child.id} value={child.id}>
            {child.name} - {child.className}
          </option>
        ))}
      </select>
    </div>
  );
};

