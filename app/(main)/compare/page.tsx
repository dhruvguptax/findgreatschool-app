// app/(main)/compare/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompareStore } from '@/store/compareStore'; // Import the Zustand store
import { createClient } from '@/lib/supabase/client'; // Use standard client
import { Database } from '@/lib/database.types'; // Import generated types

// Use a more complete Institution type, including fields to compare
type ComparedInstitution = Database['public']['Tables']['institutions']['Row'];

export default function ComparePage() {
  const supabase = createClient();
  // Get state and actions from the Zustand store
  const { items: compareIds, removeCompareItem, clearCompare } = useCompareStore(); // Added clearCompare

  const [comparedInstitutions, setComparedInstitutions] = useState<ComparedInstitution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch details for institutions in the compare list
  useEffect(() => {
    if (compareIds.length === 0) {
      setComparedInstitutions([]); // Clear if no IDs
      return; // Don't fetch if list is empty
    }

    const fetchCompareData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: queryError } = await supabase
          .from('institutions')
          .select('*') // Select all columns for comparison
          .in('id', compareIds) // Fetch only institutions whose IDs are in the list
          .eq('is_approved', true); // Ensure they are approved

        if (queryError) throw queryError;

        // Ensure the order matches the selection order (optional, but nice)
        const sortedData = compareIds
            .map(id => data?.find(inst => inst.id === id))
            .filter((inst): inst is ComparedInstitution => inst !== undefined);

        setComparedInstitutions(sortedData);

      } catch (err: any) {
        console.error("Error fetching comparison data:", err);
        setError(err.message || "Failed to load comparison data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [compareIds, supabase]); // Re-fetch if the list of IDs changes


  // --- Render Logic ---

  // Handle empty comparison list
  if (compareIds.length === 0 && !loading) { // Show only if not loading
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Compare Institutions</h1>
        <p className="text-gray-600 mb-6">You haven't selected any institutions to compare yet.</p>
        <Link href="/explore">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded transition-colors">
            Explore Schools
          </button>
        </Link>
      </div>
    );
  }

  // --- Attributes to Compare (Customize this list!) ---
  // Make sure the 'key' matches a column name in your 'institutions' table
  const attributesToCompare: Array<{ key: keyof ComparedInstitution; label: string; format?: (value: any, id?: string) => React.ReactNode }> = [
      { key: 'name', label: 'Name', format: (val, id) => id ? <Link href={`/school/${id}`} className="text-blue-600 hover:underline font-semibold">{val || 'N/A'}</Link> : String(val || 'N/A')},
      { key: 'type', label: 'Type', format: (val) => <span className="capitalize">{val}</span> },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'address', label: 'Address' },
      { key: 'board', label: 'Board' },
      { key: 'fee_structure', label: 'Fees', format: (val) => <pre className="whitespace-pre-wrap text-xs font-sans">{val || 'N/A'}</pre> },
      { key: 'student_teacher_ratio', label: 'Student:Teacher', format: (val) => val ? `${val}:1` : 'N/A'},
      { key: 'features', label: 'Key Features', format: (val) => {
          if (!val || typeof val !== 'object') return 'N/A';
          // Ensure 'val' is treated as Record<string, any> for safety
          const featuresObj = val as Record<string, any>;
          const enabled = Object.entries(featuresObj).filter(([k, v]) => v === true).map(([k]) => k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
          return enabled.length > 0 ? <ul className="list-disc list-inside text-xs">{enabled.map((f, i)=><li key={i}>{f}</li>)}</ul> : 'None listed';
      }},
      { key: 'contact_email', label: 'Email', format: (val) => val ? <a href={`mailto:${val}`} className="text-blue-600 hover:underline">{val}</a> : 'N/A' },
      { key: 'contact_phone', label: 'Phone' },
      // Add/Remove attributes as needed for comparison
  ];
  // --- End Attributes ---


  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Compare Institutions ({compareIds.length})</h1>
            {compareIds.length > 0 && (
                 <button
                    onClick={clearCompare} // Assumes clearCompare is from your store
                    className="text-sm text-red-600 hover:text-red-800"
                    title="Clear all items from comparison"
                >
                    Clear All
                </button>
            )}
       </div>


      {loading && <p className="text-center py-10">Loading comparison data...</p>}
      {error && <p className="text-center py-10 text-red-600">Error: {error}</p>}

      {!loading && !error && comparedInstitutions.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300 bg-white">
            {/* Header Row - Institution Names + Remove Buttons */}
            <thead className="sticky top-0 z-20"> {/* Make header sticky */}
              <tr className="bg-gray-100">
                {/* Sticky Attribute Label Column Header */}
                <th className="border border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 sticky left-0 bg-gray-100 z-30 w-48 md:w-1/4">Attribute</th>
                {/* Institution Column Headers */}
                {comparedInstitutions.map((inst) => (
                  <th key={inst.id} className="border border-gray-300 p-2 text-left text-sm font-semibold text-gray-700 relative min-w-[200px]">
                       <Link href={`/school/${inst.id}`} className="text-blue-700 hover:underline block mb-1 font-bold">
                            {inst.name}
                       </Link>
                       <p className="text-xs text-gray-500 font-normal">{inst.city || ''}</p>
                       {/* Remove Button */}
                       <button
                         onClick={() => removeCompareItem(inst.id)}
                         className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-lg font-bold p-1 bg-gray-100 hover:bg-red-100 rounded-full leading-none z-40"
                         title="Remove from Compare"
                       >
                         &times;
                       </button>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Attribute Rows */}
            <tbody>
              {attributesToCompare.map((attr) => (
                 <tr key={attr.key} className="hover:bg-gray-50 even:bg-gray-50">
                   {/* Sticky Attribute Label Column */}
                   <td className="border border-gray-300 p-3 font-medium text-sm text-gray-800 sticky left-0 bg-white group-hover:bg-gray-50 z-10 w-48 md:w-1/4">{attr.label}</td>
                   {/* Data Columns */}
                   {comparedInstitutions.map((inst) => (
                     <td key={`${inst.id}-${attr.key}`} className="border border-gray-300 p-3 text-sm align-top min-w-[200px]">
                        {/* Use formatting function if provided, pass institution ID */}
                        {attr.format
                          ? attr.format(inst[attr.key], inst.id) // Pass inst.id as second argument
                          : String(inst[attr.key] ?? 'N/A') // Handle null/undefined safely
                        }
                     </td>
                   ))}
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        {/* Handle case where some items might not have loaded */}
        {!loading && !error && comparedInstitutions.length > 0 && comparedInstitutions.length !== compareIds.length && (
             <p className="text-sm text-red-500 mt-4">Note: {compareIds.length - comparedInstitutions.length} selected institution(s) could not be loaded (perhaps they are no longer available or approved).</p>
        )}

    </div>
  );
}