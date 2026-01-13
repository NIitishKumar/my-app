/**
 * OfflineBanner Component
 * Banner showing offline status
 */

import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center"
      role="status"
      aria-live="polite"
      aria-label="Offline mode"
    >
      <p className="text-sm text-yellow-800">
        <i className="fas fa-wifi-slash mr-2" aria-hidden="true" />
        You're offline — showing saved data
      </p>
    </div>
  );
};
