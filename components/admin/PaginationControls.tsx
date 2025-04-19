// components/admin/PaginationControls.tsx
import Link from 'next/link';
import React from 'react';

// Updated interface to accept the raw searchParams object from the page
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: { [key: string]: string | string[] | undefined }; // Accept the object directly
}

export default function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
  searchParams, // Receive the raw object
}: PaginationControlsProps) {

  if (totalPages <= 1) {
    return null; // Don't show controls if only one page
  }

  // Function to create the URL for a specific page, preserving other params
  const createPageURL = (pageNumber: number): string => {
    // Create a new URLSearchParams instance
    const params = new URLSearchParams();
    // Iterate over the received searchParams object
    if (searchParams) {
        for (const [key, value] of Object.entries(searchParams)) {
            // Copy existing params, EXCLUDING the 'page' param
            if (key !== 'page' && value !== undefined) {
                if (Array.isArray(value)) {
                    // If it's an array (like multiple 'board' params), append each value
                    value.forEach(v => params.append(key, v));
                } else {
                    // If it's a single string, set it
                    params.set(key, value);
                }
            }
        }
    }
    // Set the new page number
    params.set('page', pageNumber.toString());
    // Construct the final URL
    return `<span class="math-inline">\{baseUrl\}?</span>{params.toString()}`;
  };

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
      {/* Previous Button */}
      <Link
         href={createPageURL(currentPage - 1)}
         className={`inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
           !hasPreviousPage ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''
         }`}
         aria-disabled={!hasPreviousPage}
         tabIndex={!hasPreviousPage ? -1 : undefined}
         scroll={false} // Keep scroll false
       >
         Previous
      </Link>

      {/* Page Indicator */}
      <div className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
      </div>

      {/* Next Button */}
       <Link
         href={createPageURL(currentPage + 1)}
         className={`inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
           !hasNextPage ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''
         }`}
         aria-disabled={!hasNextPage}
         tabIndex={!hasNextPage ? -1 : undefined}
         scroll={false} // Keep scroll false
       >
         Next
       </Link>
    </div>
  );
}