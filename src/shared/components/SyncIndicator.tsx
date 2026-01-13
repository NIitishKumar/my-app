/**
 * SyncIndicator Component
 * Shows syncing status when connection is restored
 */

import { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import toast from 'react-hot-toast';

export const SyncIndicator = () => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setIsSyncing(false);
    } else if (wasOffline && isOnline) {
      // Connection restored
      setIsSyncing(true);
      toast.success('Connection restored. Syncing data...', {
        duration: 3000,
      });
      
      // Simulate sync completion after a short delay
      const timer = setTimeout(() => {
        setIsSyncing(false);
        setWasOffline(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!isSyncing) {
    return null;
  }

  return (
    <div
      className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-center"
      role="status"
      aria-live="polite"
      aria-label="Syncing data"
    >
      <p className="text-sm text-blue-800 flex items-center justify-center">
        <svg
          className="animate-spin h-4 w-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Syncing when connection is restored...
      </p>
    </div>
  );
};
