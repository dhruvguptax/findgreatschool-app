// app/(main)/(student)/dashboard/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'; // Server client for session/data
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Database } from '@/lib/database.types'; // Assuming you have generated types

// Define type for fetched application data including joined institution details
// Adjust based on your select query and actual table structure
type ApplicationWithInstitution = Database['public']['Tables']['applications']['Row'] & {
  institutions: Pick<Database['public']['Tables']['institutions']['Row'], 'id' | 'name' | 'type' | 'city'> | null;
};

// Fetch applications for the current user
async function fetchUserApplications(userId: string) {
    const supabase = createSupabaseServerClient(); // Reads cookies server-side

    // Fetch applications joined with relevant institution data
    const { data, error } = await supabase
      .from('applications')
      // Select application fields + specific fields from related institution
      .select(`
        id,
        created_at,
        status,
        institutions ( id, name, type, city )
      `)
      .eq('student_id', userId) // Filter by logged-in user ID
      .order('created_at', { ascending: false }); // Show most recent first

    if (error) {
        console.error("Error fetching user applications:", error);
        // Handle error appropriately, maybe return empty or throw
        return [];
    }
    // Type assertion might be needed if Supabase types aren't perfect with joins
    return (data as unknown as ApplicationWithInstitution[]) || [];
}


// The Dashboard Page Server Component
export default async function StudentDashboardPage() {
    const supabase = createSupabaseServerClient();

    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login page if not authenticated
        redirect('/login'); // Or show an unauthorized message
    }

    // 2. Fetch the user's applications
    const applications = await fetchUserApplications(user.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Applications</h1>

            {applications.length === 0 ? (
                <p className="text-gray-600">You haven't submitted any applications yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Institution Name</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Type</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">City</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Applied On</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-sm">
                                {app.institutions ? (
                                    // Link to the institution's profile page
                                    <Link href={`/school/${app.institutions.id}`} className="text-blue-600 hover:underline">
                                        {app.institutions.name || 'N/A'}
                                    </Link>
                                ) : (
                                    'Institution data missing'
                                )}
                            </td>
                            <td className="py-2 px-4 border-b text-sm capitalize">{app.institutions?.type || 'N/A'}</td>
                            <td className="py-2 px-4 border-b text-sm">{app.institutions?.city || 'N/A'}</td>
                            <td className="py-2 px-4 border-b text-sm">{new Date(app.created_at).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b text-sm capitalize">{app.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}