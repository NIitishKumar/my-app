/**
 * Skeleton Loader Components
 * Loading placeholders for better UX
 */

export const SkeletonLoader = ({ 
  className = '', 
  lines = 1 
}: { 
  className?: string; 
  lines?: number 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded mb-2"
          style={{ width: i === lines - 1 ? '75%' : '100%' }}
        />
      ))}
    </div>
  );
};

export const ClassCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="h-16 bg-gray-200 rounded-lg"></div>
      <div className="h-16 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex space-x-2">
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);


