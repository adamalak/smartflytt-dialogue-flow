
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white text-gray-600 p-4 rounded-2xl shadow-md border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm font-medium">Chattbotten skriver...</span>
        </div>
      </div>
    </div>
  );
};
