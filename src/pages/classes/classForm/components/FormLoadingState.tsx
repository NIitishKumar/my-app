interface FormLoadingStateProps {
  message?: string;
}

/** Simple centered loading state, shown while edit-mode data is in flight. */
export const FormLoadingState = ({ message = 'Loading...' }: FormLoadingStateProps) => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 flex flex-col items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  </div>
);
