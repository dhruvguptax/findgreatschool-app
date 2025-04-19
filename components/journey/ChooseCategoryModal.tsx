// components/journey/ChooseCategoryModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/ui/Modal'; // Use your base modal

interface ChooseCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: 'school' | 'coaching' | 'college') => void;
}

export default function ChooseCategoryModal({
  isOpen,
  onClose,
  onCategorySelect,
}: ChooseCategoryModalProps) {

  const handleSelect = (category: 'school' | 'coaching' | 'college') => {
    onCategorySelect(category); // Pass the selected category up
    onClose(); // Close this modal
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What are you looking for?">
      <div className="space-y-4 mt-4">
        <button
          onClick={() => handleSelect('school')}
          className="w-full text-left p-4 border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="font-semibold text-lg">🏫 School</h3>
          <p className="text-sm text-gray-600">Find primary, middle, or high schools.</p>
        </button>
        <button
          onClick={() => handleSelect('coaching')}
          className="w-full text-left p-4 border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="font-semibold text-lg">📚 Coaching Institute</h3>
          <p className="text-sm text-gray-600">Prepare for competitive exams (JEE, NEET, etc.).</p>
        </button>
        <button
          onClick={() => handleSelect('college')}
          className="w-full text-left p-4 border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="font-semibold text-lg">🎓 College / University</h3>
          <p className="text-sm text-gray-600">Search for degree programs (B.Tech, MBA, etc.).</p>
        </button>
      </div>
    </Modal>
  );
}