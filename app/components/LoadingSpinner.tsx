import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading...", size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-24 h-24 border-8',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-green-600 border-r-green-600 border-b-gray-200 border-l-gray-200`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span> {/* For accessibility */}
      </div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 