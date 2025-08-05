// /components/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">상품 정보를 불러오는 중...</p>
      </div>
    </div>
  );
}