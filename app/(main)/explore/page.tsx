// app/(main)/explore/page.tsx
"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SchoolCard from '@/components/school/SchoolCard';
import Filters from '@/components/search/Filters'; // <-- Import Filters component

interface Institution { // Ensure this matches your data structure
  id: string;
  name: string;
  address?: string;
  images?: string[];
  type?: 'school' | 'coaching' | 'college';
  city?: string;
  board?: string; // Need board for filtering
  features?: Record<string, boolean>; // Need features for filtering
  classes_offered?: string[];
  exams_coached?: string[];
  programs_offered?: string[];
  is_approved?: boolean; // Needed for filtering
  // Add other fields if needed
}

function LoadingFallback() {
    return <div className="text-center py-10">Loading search results...</div>;
}

// Main component logic separated to use hooks after Suspense
function ExplorePageContent() {
  const router = useRouter(); // Hook for navigation
  const pathname = usePathname(); // Get the current path
  const searchParams = useSearchParams(); // Hook to read URL query parameters
  const supabase = createClient(); // Standard Supabase client

  // State for results, loading, and errors
  const [results, setResults] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Read params used for UI state outside useEffect ---
  const category = searchParams.get('category');
  const detail = searchParams.get('detail'); // Read detail for display only
  const city = searchParams.get('city'); // Read city for display only
  const currentSort = searchParams.get('sort') || 'relevance';
  const currentBoards = searchParams.getAll('board');
  const currentFeatures = searchParams.getAll('feature');

  // --- Fetch data Effect ---
  useEffect(() => {
    // --- Read params needed for QUERY *inside* the effect ---
    const categoryParam = searchParams.get('category');
    const detailParam = searchParams.get('detail');
    const cityParam = searchParams.get('city');
    const sortParam = searchParams.get('sort') || 'relevance';
    const boardParams = searchParams.getAll('board');
    const featureParams = searchParams.getAll('feature');
    // --- End reading params inside ---

    const fetchInstitutions = async () => {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        let query = supabase
            .from('institutions')
            .select('*')
            .eq('is_approved', true); // IMPORTANT: Only fetch approved institutions

        // Apply filters using params read *inside* effect
        if (categoryParam) query = query.eq('type', categoryParam);
        if (cityParam) query = query.ilike('city', `%${cityParam}%`); // Filter on city column
        if (detailParam && categoryParam) {
            console.log(`Applying detail filter: ${detailParam} for category: ${categoryParam}`);
            // Use .contains() which checks if a text[] array contains a specific value
            if (categoryParam === 'school') query = query.contains('classes_offered', [detailParam]);
            else if (categoryParam === 'coaching') query = query.contains('exams_coached', [detailParam]);
            else if (categoryParam === 'college') query = query.contains('programs_offered', [detailParam]);
            // NOTE: Requires corresponding text[] columns in DB
        }
        // Board Filter (only if category is school)
        if (categoryParam === 'school' && boardParams.length > 0) {
            console.log('Applying board filter:', boardParams);
            query = query.in('board', boardParams); // Assumes 'board' column exists
        }
        // Features Filter
        if (featureParams.length > 0) {
            console.log('Applying feature filter:', featureParams);
            featureParams.forEach(featureKey => {
                query = query.contains('features', { [featureKey]: true }); // Assumes 'features' is jsonb
            });
        }

        // Apply Sorting using param read *inside* effect
       console.log("Applying sort:", sortParam);
       if (sortParam === 'name_asc') query = query.order('name', { ascending: true });
       else if (sortParam === 'name_desc') query = query.order('name', { ascending: false });
       else query = query.order('name', { ascending: true }); // Default sort A-Z

        // Execute query
        const { data, error: queryError } = await query;
        if (queryError) throw queryError;

        // State update based on result
        setResults(data || []);

      } catch (err: any) {
         console.error("Error fetching institutions:", err);
         // State update for error
         setError(err.message || "Failed to fetch results.");
      } finally {
        // Final state update for loading
        setLoading(false);
      }
    };

    fetchInstitutions();
  // Update dependency array - only depends on searchParams changes and client instance
  }, [searchParams, supabase]); // Simplified dependency array


  // --- Filter change handler (memoized) ---
  const handleFilterChange = useCallback((filterType: 'boards' | 'features', value: string, isChecked: boolean) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    const paramKey = filterType === 'boards' ? 'board' : 'feature';
    let existingValues = currentParams.getAll(paramKey);

    currentParams.delete(paramKey); // Clear existing for this key
    if (isChecked) {
        existingValues.push(value);
    } else {
        existingValues = existingValues.filter(v => v !== value);
    }
    // Ensure unique values before re-adding
    [...new Set(existingValues)].forEach(v => currentParams.append(paramKey, v));

    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);


  // --- Sort change handler (remains the same) ---
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSortValue = event.target.value;
      const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
      if (newSortValue && newSortValue !== 'relevance') {
          currentParams.set('sort', newSortValue);
      } else {
          currentParams.delete('sort');
      }
      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  // Prepare filter values for the Filters component based on current searchParams
   const currentFilterValues = {
        boards: searchParams.getAll('board'),
        features: searchParams.getAll('feature')
   };

  // --- Render the Page ---
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        {/* Criteria display */}
        <div className="bg-gray-100 p-3 rounded-md mb-6 text-sm">
             Showing results for:
                {category && <span className="font-semibold mx-1">{category}</span>}
                {detail && <span className="mx-1">({detail})</span>} {/* Use detail read outside effect */}
                {city && <span className="font-semibold mx-1">in {city}</span>} {/* Use city read outside effect */}
                {!category && !detail && !city && <span> All approved institutions</span>}
                {(currentFilterValues.boards.length > 0 || currentFilterValues.features.length > 0) && (
                    <span className="ml-2 italic text-gray-600">
                        Filtered by: {currentFilterValues.boards.join(', ')}{currentFilterValues.boards.length > 0 && currentFilterValues.features.length > 0 ? '; ' : ''}{currentFilterValues.features.join(', ')}
                    </span>
                 )}
        </div>

        {/* Layout for Filters + Results */}
        <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="md:w-1/4 flex-shrink-0">
                <Filters
                    category={category} // Pass category read outside effect
                    currentFilters={currentFilterValues}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Results Area */}
            <div className="flex-grow">
                {/* Sorting Dropdown */}
               <div className="mb-4 flex justify-end">
                    <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 mr-2 self-center">Sort by:</label>
                    <select
                        id="sort-select"
                        value={currentSort} // Use currentSort read outside effect
                        onChange={handleSortChange}
                        className="block w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white"
                    >
                        <option value="relevance">Relevance</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="name_desc">Name (Z-A)</option>
                    </select>
                </div>

                {/* Results Display */}
                {loading && <p className="text-center py-10">Loading results...</p>}
                {error && <p className="text-center py-10 text-red-600">Error: {error}</p>}
                {!loading && !error && results.length === 0 && ( <p className="text-center py-10 text-gray-600">No institutions found matching your criteria.</p> )}
                {!loading && !error && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.map((institution) => (
                        <SchoolCard key={institution.id} institution={institution} />
                    ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

// Export component wrapped in Suspense
export default function ExplorePage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ExplorePageContent />
        </Suspense>
    );
}