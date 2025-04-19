// components/compare/CompareIndicator.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useCompareStore } from '@/store/compareStore';

export default function CompareIndicator() {
  const { items } = useCompareStore();
  const count = items.length;

  // Don't render anything if count is 0
  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href="/compare">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-all flex items-center space-x-2">
          <span>Compare Items</span>
          <span className="bg-white text-indigo-600 text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        </button>
      </Link>
    </div>
  );
}