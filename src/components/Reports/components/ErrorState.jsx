// src/components/Reports/components/ErrorState.jsx
import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';


const ErrorState = ({ error }) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <FaExclamationCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error loading results</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error || 'An unknown error occurred while fetching the results.'}</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-red-50 text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;