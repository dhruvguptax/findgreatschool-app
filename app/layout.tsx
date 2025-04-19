// app/layout.tsx (Root Layout)

import type { Metadata } from "next";
// Import fonts (e.g., Poppins and Inter)
import { Poppins, Inter } from "next/font/google";
// Import CSS
import "./globals.css"; // Imports globals including Tailwind directives & custom styles
// Import Providers/Components
import { AuthProvider } from "@/context/AuthContext";
import CursorTrailEffect from '@/components/effects/CursorTrailEffect'; // Import the effect component

// Instantiate fonts with variables
const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap',
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ['400', '500', '600', '700'], // Include needed weights
    variable: '--font-poppins', // CSS variable for Poppins (used in tailwind.config.js)
    display: 'swap',
});

// Define metadata
export const metadata: Metadata = {
  title: "FindGreatSchool.com",
  description: "Find the Perfect School, Coaching, or College for You",
};

// Define the Root Layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply font variables - font-sans default applied via globals.css or tailwind config */}
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>

        {/* Render the cursor effect component globally */}
        {/* Ensure components/effects/CursorTrailEffect.tsx exists */}
        <CursorTrailEffect />

        {/* Wrap content with AuthProvider */}
        <AuthProvider>
          {/* The {children} here will be the content from app/(main)/layout.tsx */}
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}