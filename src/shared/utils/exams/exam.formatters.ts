/**
 * Exam Formatters
 * Utility functions for formatting exam data
 */

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Format time range
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `${hours}h ${mins}m`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: Date | string, time: string): string => {
  const formattedDate = formatDate(date);
  return `${formattedDate} at ${time}`;
};


