// components/layout/Footer.tsx
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="bg-gray-200 text-center p-4 mt-10">
        <div className="container mx-auto">
          © {currentYear} FindGreatSchool.com. All rights reserved.
          {/* Add links to Privacy Policy, Terms etc. later */}
        </div>
      </footer>
    );
  }