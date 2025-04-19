// app/(main)/school/[id]/page.tsx

import { createClient } from '@/lib/supabase/client'; // Or use a server client if configured
import { notFound } from 'next/navigation';
import React from 'react';
import ApplyButtonClient from './ApplyButtonClient'; // <-- Import the new client component

// Define the shape of the institution data - should match your DB precisely
interface InstitutionProfile {
  id: string;
  name: string;
  type: 'school' | 'coaching' | 'college';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contact_email?: string;
  contact_phone?: string;
  board?: string;
  fee_structure?: string;
  student_teacher_ratio?: number;
  classes_offered?: string[];
  programs_offered?: string[];
  exams_coached?: string[];
  features?: Record<string, boolean>;
  images?: string[]; // Expecting array with 0 or 1 URL for the primary image
  created_at?: string;
  updated_at?: string; // Added this column earlier
  user_id?: string; // Might be useful later
  is_approved?: boolean;
  // Add any other fields from your 'institutions' table
}

// Async function to fetch data specifically for this page
async function fetchInstitutionProfile(id: string): Promise<InstitutionProfile | null> {
  // Consider creating/using a server-specific Supabase client here
  const supabase = createClient();
  const { data, error } = await supabase
    .from('institutions')
    .select('*') // Select all columns needed
    .eq('id', id)
    .eq('is_approved', true) // Ensure only approved profiles are viewable
    .single(); // Expect only one result

  if (error && error.code !== 'PGRST116') { // PGRST116 = "response contains multiple rows" / "exactly one row" violation (when 0 rows found with .single())
    console.error("Error fetching profile:", error);
    return null;
  }
  if (!data) {
    console.log(`No approved institution found for ID: ${id}`);
    return null;
  }
  return data as InstitutionProfile;
}


// The Page component - remains an async Server Component
export default async function SchoolProfilePage({ params }: { params: { id: string } }) {

  const institutionId = params.id;
  const institution = await fetchInstitutionProfile(institutionId);

  // If no institution data is found, show 404
  if (!institution) {
    notFound();
  }

  // Helper to render features (same as before)
  const renderFeatures = () => {
    if (!institution.features || Object.keys(institution.features).length === 0) {
        return <p className="text-sm text-gray-500">No specific features listed.</p>;
    }
    const featureList = Object.entries(institution.features)
      .filter(([key, value]) => value === true)
      .map(([key]) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    if (featureList.length === 0) {
        return <p className="text-sm text-gray-500">No specific features enabled.</p>;
    }

    return (
      <ul className="list-disc list-inside grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-700">
        {featureList.map((feature, index) => <li key={index}>{feature}</li>)}
      </ul>
    );
  };

  // Get the primary image URL safely
  const primaryImageUrl = institution.images?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{institution.name}</h1>
        <p className="text-lg text-gray-600">{institution.address || 'Address not provided'}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mt-2">
          {institution.type.charAt(0).toUpperCase() + institution.type.slice(1)}
        </span>
         {institution.board && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mt-2">
                Board: {institution.board}
            </span>
        )}
      </div>

      {/* Image Section - Displaying only the primary image */}
      <div className="mb-8">
        {primaryImageUrl ? (
           <img
             src={primaryImageUrl}
             alt={`${institution.name} primary image`}
             // Adjust size as needed - maybe wider here than on card
             className="w-full max-w-2xl mx-auto h-auto object-contain rounded-lg shadow-md bg-gray-100"
             // Use object-contain to show full image, background for letterboxing
           />
        ) : (
          <div className="col-span-full text-center text-gray-500 bg-gray-100 h-60 flex items-center justify-center rounded-lg">No primary image available.</div>
        )}
      </div>
      {/* If you want a gallery later, you'd modify the images column and map over institution.images here */}


      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Details</h2>
          <div className="space-y-3 text-sm">
             {institution.fee_structure && <div><strong>Fee Structure:</strong> <pre className="whitespace-pre-wrap font-sans text-sm">{institution.fee_structure}</pre></div>}
             {institution.student_teacher_ratio && <div><strong>Student-Teacher Ratio:</strong> {institution.student_teacher_ratio}:1</div>}
             {institution.contact_email && <div><strong>Email:</strong> <a href={`mailto:${institution.contact_email}`} className="text-blue-600 hover:underline">{institution.contact_email}</a></div>}
             {institution.contact_phone && <div><strong>Phone:</strong> {institution.contact_phone}</div>}

             {/* Display List fields */}
             {institution.classes_offered && institution.classes_offered.length > 0 && (
               <div><strong>Classes Offered:</strong> {institution.classes_offered.join(', ')}</div>
             )}
             {institution.exams_coached && institution.exams_coached.length > 0 && (
               <div><strong>Exams Coached:</strong> {institution.exams_coached.join(', ')}</div>
             )}
             {institution.programs_offered && institution.programs_offered.length > 0 && (
               <div><strong>Programs Offered:</strong> {institution.programs_offered.join(', ')}</div>
             )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Features & Amenities</h2>
          {renderFeatures()}
        </div>
      </div>


      {/* --- UPDATED Call to Action Section --- */}
      {/* Render the client component, passing necessary props */}
      <ApplyButtonClient institutionId={institution.id} institutionName={institution.name} />
      {/* --- End Call to Action --- */}

    </div>
  );
}