// app/admin/dashboard/page.tsx
import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
// Corrected import paths:
import AdminActionButtons from '@/components/admin/AdminActionButtons';
import Link from 'next/link';
import PaginationControls from '@/components/admin/PaginationControls';
import AdminSearchForm from '@/components/admin/AdminSearchForm';
import { Database } from '@/lib/database.types';

type PendingInstitution = Pick<Database['public']['Tables']['institutions']['Row'],
    'id' | 'name' | 'type' | 'city' | 'created_at'
>;

const ITEMS_PER_PAGE = 10;

// Component now accepts searchParams directly from Next.js
export default async function AdminDashboardPage({
   searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const supabaseUserClient = createSupabaseServerClient();
    const { data: { session } } = await supabaseUserClient.auth.getSession();
    const adminUserId = process.env.ADMIN_USER_ID;

    if (!session || !adminUserId || session.user.id !== adminUserId) {
        console.warn('Admin access denied.');
        redirect('/');
    }

    const currentPage = parseInt(searchParams?.page as string ?? '1');
    const searchTerm = searchParams?.search as string ?? '';
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const supabaseAdmin = createSupabaseServerAdminClient();

    // Base query for counting (respects search filter)
    let countQuery = supabaseAdmin
        .from('institutions')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);
    if (searchTerm) {
         countQuery = countQuery.ilike('name', `%${searchTerm}%`);
    }

     // Base query for fetching data (respects search filter)
    let dataQueryBuilder = supabaseAdmin
        .from('institutions')
        .select('id, name, type, city, created_at') // Select only needed columns
        .eq('is_approved', false);
    if (searchTerm) {
        dataQueryBuilder = dataQueryBuilder.ilike('name', `%${searchTerm}%`);
    }
     // Apply ordering and range to data query only
    const dataQuery = dataQueryBuilder
        .order('created_at', { ascending: true })
        .range(offset, offset + ITEMS_PER_PAGE - 1);


    // Execute both queries in parallel
    const [
        { data: institutions, error: fetchError },
        { count: totalCount, error: countError }
    ] = await Promise.all([ dataQuery, countQuery ]);


    if (fetchError || countError) {
        console.error("Error fetching admin data:", fetchError || countError);
    }

    const totalPages = totalCount ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Pending Approvals</h1>
        {/* Search Form Component */}
        <AdminSearchForm />

        {(fetchError || countError) && ( <p className="text-red-600 bg-red-100 p-3 rounded-md my-4"> Error loading data: {fetchError?.message || countError?.message} </p> )}
        {!(fetchError || countError) && institutions && institutions.length === 0 && ( <p className="text-gray-600 mt-4"> {searchTerm ? `No institutions found matching "${searchTerm}".` : 'No institutions pending approval.'} </p> )}

        {!(fetchError || countError) && institutions && institutions.length > 0 && (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 my-4">
              <table className="min-w-full bg-white">
                 <thead className="bg-gray-100"> <tr> <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name (View Details)</th> <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th> <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">City</th> <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th> <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Edit</th> <th className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th> </tr> </thead>
                <tbody className="divide-y divide-gray-200">
                  {(institutions as PendingInstitution[]).map((inst) => (
                    <tr key={inst.id} className="hover:bg-gray-50">
                       <td className="py-3 px-4 border-b text-sm whitespace-nowrap"> <Link href={`/school/${inst.id}`} className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer"> {inst.name} </Link> </td>
                       <td className="py-3 px-4 border-b text-sm capitalize whitespace-nowrap">{inst.type}</td>
                       <td className="py-3 px-4 border-b text-sm whitespace-nowrap">{inst.city || 'N/A'}</td>
                       <td className="py-3 px-4 border-b text-sm whitespace-nowrap">{new Date(inst.created_at).toLocaleDateString()}</td>
                       <td className="py-2 px-4 border-b text-sm whitespace-nowrap"> <Link href={`/admin/edit/${inst.id}`} className="text-indigo-600 hover:text-indigo-900 hover:underline text-xs"> Edit </Link> </td>
                       <td className="py-2 px-4 border-b text-sm whitespace-nowrap"> <AdminActionButtons institutionId={inst.id} institutionName={inst.name ?? 'this institution'} /> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/admin/dashboard"
                // Pass the raw searchParams object from the page props
                searchParams={searchParams}
            />
          </>
        )}
      </div>
    );
}