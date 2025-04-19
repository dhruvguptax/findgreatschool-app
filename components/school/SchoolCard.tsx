// components/school/SchoolCard.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useCompareStore } from '@/store/compareStore';
// Consider adding an icon library like react-icons if you want icons for features
// import { FaMapMarkerAlt } from 'react-icons/fa'; // Example icon

interface Institution {
  id: string;
  name: string;
  address?: string;
  images?: string[];
  type?: 'school' | 'coaching' | 'college';
  city?: string; // Add city if available for display
  // features?: Record<string, boolean>; // Pass features if you want to display icons/text
}

interface SchoolCardProps {
  institution: Institution;
}

export default function SchoolCard({ institution }: SchoolCardProps) {
  const { addCompareItem, removeCompareItem, isComparing, items, maxItems } = useCompareStore();
  const isInCompare = isComparing(institution.id);
  const canAddToCompare = items.length < maxItems;

  const imageUrl = institution.images?.[0] ?? 'https://via.placeholder.com/800x600?text=No+Image'; // Larger placeholder
  const profileUrl = `/school/${institution.id}`;

  const handleCompareChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      if(canAddToCompare) {
        addCompareItem(institution.id);
      } else {
        event.target.checked = false;
        alert(`You can only compare up to ${maxItems} institutions at a time.`);
      }
    } else {
      removeCompareItem(institution.id);
    }
  };

  return (
    // Add group utility for hover effects, refine shadow/border/transition
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg">

      {/* Compare Checkbox - Improved Styling & Placement */}
      <div className="absolute right-2 top-2 z-20">
          <label htmlFor={`compare-${institution.id}`} className="flex cursor-pointer items-center rounded-full bg-white/80 p-1.5 shadow backdrop-blur-sm transition hover:bg-white/90" title={isInCompare ? "Remove from Compare" : "Add to Compare"}>
             <input
              type="checkbox"
              id={`compare-${institution.id}`}
              checked={isInCompare}
              onChange={handleCompareChange}
              disabled={!isInCompare && !canAddToCompare}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
             {/* Optional: Add text next to checkbox if desired */}
             {/* <span className="ml-1.5 text-xs font-medium text-gray-700">{isInCompare ? 'Comparing' : 'Compare'}</span> */}
          </label>
      </div>

      {/* Image Container with Aspect Ratio and Hover Effect */}
      <Link href={profileUrl} className="block overflow-hidden aspect-[4/3] bg-gray-100"> {/* Standard 4:3 Aspect Ratio */}
        <img
          src={imageUrl}
          alt={`${institution.name} primary image`}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" // object-cover + scale on group hover
        />
      </Link>

      {/* Content Area with Improved Padding and Spacing */}
      <div className="flex flex-1 flex-col p-4 space-y-2"> {/* Use space-y for vertical spacing */}
        {/* Name - Larger, Bolder */}
        <Link href={profileUrl} className="block hover:text-blue-700">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2"> {/* Limit name to 2 lines */}
              {institution.name}
          </h3>
        </Link>

        {/* Location (Address/City) - Smaller, Gray */}
        {/* Example using City if available, otherwise Address */}
        <p className="text-sm text-gray-600 line-clamp-1" title={institution.address}> {/* Limit to 1 line, show full on hover */}
            {/* <FaMapMarkerAlt className="inline mr-1 mb-0.5 text-gray-400" /> Example Icon */}
            {institution.city ? institution.city : (institution.address || 'Location not available')}
        </p>

        {/* Type/Features Placeholder - Tiny Text */}
        <div className="text-xs text-gray-500 pt-1">
          {/* Example: You could render actual feature icons/tags here later */}
          <span className="inline-block bg-gray-100 rounded px-1.5 py-0.5 capitalize">{institution.type || 'Institution'}</span>
          {/* <span className="ml-2">Feature A</span> */}
        </div>

        {/* Action Buttons - Pushed to bottom */}
        <div className="pt-2 mt-auto"> {/* mt-auto pushes this section down */}
          <div className="flex justify-between items-center">
              <Link href={profileUrl} passHref>
                {/* Consistent Button Style */}
                <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                  View Profile
                </button>
              </Link>
               {/* Add other actions if needed, e.g., maybe a simplified apply button here later? */}
          </div>
        </div>
      </div>
    </div>
  );
}