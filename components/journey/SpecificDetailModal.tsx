// components/journey/SpecificDetailModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';

interface SpecificDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'school' | 'coaching' | 'college' | null;
  onDetailSubmit: (detail: string) => void;
}

// --- Placeholder Lists ---
const schoolClasses = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const coachingExams = [
  'JEE (Main/Advanced)', 'NEET', 'CUET', 'UPSC CSE', 'CAT', 'GATE', 'CLAT',
  'IBPS PO/Clerk', 'SBI PO/Clerk', 'SSC CGL', 'NDA', 'CA Foundation', 'CS Foundation',
  // Add 'Other' if needed
];
const collegePrograms = [
  'B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'B.Tech Civil', 'B.Tech EEE',
  'MBBS', 'BDS', 'B.Pharm', 'B.Sc Nursing',
  'B.Com (Hons)', 'B.Com (General)', 'BBA', 'BCA',
  'B.Sc Physics', 'B.Sc Chemistry', 'B.Sc Maths', 'B.Sc Biology',
  'BA English', 'BA History', 'BA Political Science', 'BA Economics',
  'LLB', 'B.Arch', 'Diploma Engineering',
  // Add 'Other' if needed
];
// --- End Placeholder Lists ---


export default function SpecificDetailModal({
  isOpen,
  onClose,
  category,
  onDetailSubmit,
}: SpecificDetailModalProps) {
  const [detailValue, setDetailValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDetailValue(''); // Reset on open/category change
    }
  }, [isOpen, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (detailValue.trim()) {
      onDetailSubmit(detailValue.trim());
      onClose();
    }
  };

  let title = "Enter Details";
  let label = "Detail";
  let options: string[] = [];
  let inputType: 'select' | 'text' = 'text'; // Default assumption

  switch (category) {
    case 'school':
      title = "Select Class";
      label = "Which class are you looking to enroll in?";
      inputType = 'select';
      options = schoolClasses;
      break;
    case 'coaching':
      title = "Select Exam";
      label = "Which exam are you preparing for?";
      inputType = 'select'; // Changed to select
      options = coachingExams;
      break;
    case 'college':
      title = "Select Program/Degree";
      label = "Which program or degree are you interested in?";
      inputType = 'select'; // Changed to select
      options = collegePrograms;
      break;
  }

  const selectDefaultText = ` -- Select ${category === 'school' ? 'Class' : category === 'coaching' ? 'Exam' : 'Program'} -- `;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <label htmlFor="detail-input" className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {inputType === 'select' ? (
          <select
            id="detail-input"
            value={detailValue}
            onChange={(e) => setDetailValue(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
          >
            <option value="" disabled>{selectDefaultText}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          // Fallback text input if needed, though all categories now use select
          <input
            id="detail-input"
            type="text"
            value={detailValue}
            onChange={(e) => setDetailValue(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter detail..."
          />
        )}
        <button
          type="submit"
          disabled={!detailValue} // Disable button if no selection is made
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Next
        </button>
      </form>
    </Modal>
  );
}