// components/admin/AdminSearchForm.tsx
'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTransition, useEffect, useRef } from 'react'; // Added useEffect, useRef

export default function AdminSearchForm() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null); // Ref to input
    const currentSearch = searchParams.get('search') || '';

    // Update input value if URL search param changes (e.g., browser back button)
    useEffect(() => {
        if (inputRef.current && inputRef.current.value !== currentSearch) {
             inputRef.current.value = currentSearch;
        }
    }, [currentSearch]);


    const handleSearch = (term: string) => {
         const params = new URLSearchParams(searchParams);
         params.set('page', '1'); // Reset to page 1 on new search
         if (term) {
             params.set('search', term);
         } else {
             params.delete('search');
         }
         startTransition(() => {
            // Use replace to avoid adding every keystroke to history
            router.replace(`<span class="math-inline">\{pathname\}?</span>{params.toString()}`);
         });
    };

    // Use Debounce? Or search on blur/enter? For now, searches on change.
    // Consider adding debouncing later for better performance.

    return (
        <div className="mb-4 relative"> {/* Added relative for potential spinner */}
            <label htmlFor="admin-search" className="sr-only">Search Institutions</label>
            <input
                ref={inputRef} // Attach ref
                type="search" // Use type search for potential clear button
                id="admin-search"
                defaultValue={currentSearch} // Set initial value from URL
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name..."
                className="block w-full md:w-1/2 lg:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
             {isPending && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {/* Basic spinner or text */}
                    Loading...
                </span>
             )}
        </div>
    );
}