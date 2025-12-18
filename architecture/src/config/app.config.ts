// Application configuration
export const appConfig = {
  appName: 'School Management System',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

