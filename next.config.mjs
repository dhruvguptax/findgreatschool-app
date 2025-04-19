// next.config.mjs (Plain JavaScript ESM Syntax)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // A common default setting, keep it unless you have specific reasons to remove
  // Add any other Next.js config options you need here, using JavaScript syntax.
  // For example, allowing images from Supabase:
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'febfjajjtpetbeylxfim.supabase.co', // Your project ref
  //       port: '',
  //       pathname: '/storage/v1/object/public/institution-images/**',
  //     },
  //   ],
  // },
};

export default nextConfig; // Use standard ES Module export