// components/search/Filters.tsx
"use client";

import React from 'react';

interface FiltersProps {
  category: string | null;
  currentFilters: {
    boards: string[];
    features: string[];
  };
  onFilterChange: (filterType: 'boards' | 'features', value: string, isChecked: boolean) => void;
}

// --- Filter Options Definitions ---
const boardOptions = ['CBSE', 'ICSE', 'State Board', 'IB', 'Other'];

// --- >>> EXPANDED Feature Options <<< ---
// Add/remove features here as desired. Ensure 'key' matches database JSON keys.
const featureOptions = [
  { key: 'science_lab', label: 'Science Lab' },
  { key: 'computer_lab', label: 'Computer Lab' },
  { key: 'library', label: 'Library' },
  { key: 'auditorium', label: 'Auditorium' },
  { key: 'canteen', label: 'Canteen / Cafeteria' },
  { key: 'ac_classrooms', label: 'AC Classrooms' },
  { key: 'playground', label: 'Playground' },
  { key: 'sports_coaching', label: 'Sports Coaching' },
  { key: 'transport', label: 'Transport Facility' },
  { key: 'hostel', label: 'Hostel Facility' },
  { key: 'online_classes', label: 'Online Classes' },
  // Add more key features from your featureCategories...
];
// --- >>> End Expanded Features <<< ---


export default function Filters({ category, currentFilters, onFilterChange }: FiltersProps) {

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name: filterType, value, checked } = event.target;
    onFilterChange(filterType as 'boards' | 'features', value, checked);
  };

  return (
    // Added slightly more padding and spacing
    <div className="w-full md:w-64 lg:w-72 p-5 border rounded-lg shadow-sm bg-white space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Filters</h3>

      {/* --- Board Filter (Only for Schools) --- */}
      {category === 'school' && (
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-700">Board</h4>
          <div className="space-y-2.5"> {/* Increased spacing slightly */}
            {boardOptions.map((board) => (
              <div key={board} className="flex items-center">
                <input
                  id={`board-${board}`}
                  name="boards"
                  type="checkbox"
                  value={board}
                  checked={currentFilters.boards.includes(board)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`board-${board}`} className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  {board}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Features Filter --- */}
      <div>
        <h4 className="font-semibold text-sm mb-3 text-gray-700">Features & Amenities</h4>
        <div className="space-y-2.5"> {/* Increased spacing slightly */}
          {featureOptions.map((feature) => (
            <div key={feature.key} className="flex items-center">
              <input
                id={`feature-${feature.key}`}
                name="features"
                type="checkbox"
                value={feature.key} // Use the key (e.g., 'hostel')
                checked={currentFilters.features.includes(feature.key)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`feature-${feature.key}`} className="ml-2 block text-sm text-gray-900 cursor-pointer">
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>

       {/* Add Fee Range Slider / Rating Filter section here later */}

    </div>
  );
}