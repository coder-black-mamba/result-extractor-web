// src/components/Reports/components/LoadingState.jsx
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-gray-600">Loading results...</p>
    </div>
  );
};

export default LoadingState;