// app/(main)/about/page.tsx (No Images)
import type { Metadata } from 'next';
import Link from 'next/link';
// Example Icons from react-icons
import { FiTarget, FiUsers, FiHeart, FiBookOpen, FiNavigation, FiAward, FiEye, FiEdit, FiTrendingUp } from 'react-icons/fi';

// --- Metadata ---
export const metadata: Metadata = {
  title: 'About Us | FindGreatSchool.com',
  description: 'Learn about the mission, vision, and values behind FindGreatSchool.com - connecting students with educational opportunities across India.',
};

// --- Page Component ---
export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* --- Hero Section --- */}
      <section className="relative bg-gradient-to-r from-blue-50 to-indigo-100 py-16 md:py-24 text-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <FiTarget className="text-6xl text-brand mx-auto mb-4 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Our Mission: Simplifying Your Educational Journey
          </h1>
          <p className="text-lg md:text-xl text-subtle-text max-w-3xl mx-auto">
            We believe finding the right educational institution should be clear, easy, and empowering. Discover how FindGreatSchool.com connects students and institutions across India.
          </p>
        </div>
      </section>

      {/* --- Main Content Area --- */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* --- Our Vision Section (Text Only) --- */}
          <section>
             {/* Removed the flex/grid layout that included the image */}
             <div>
                 <h2 className="text-2xl font-semibold text-brand-dark mb-3 flex items-center gap-2">
                     <FiNavigation /> Our Vision
                 </h2>
                 <p className="text-base-text leading-relaxed text-sm space-y-3">
                    <span>
                        Our vision is to create India's most trusted, comprehensive, and user-friendly platform for discovering educational opportunities. We aim to empower every student and parent with clear, accessible information and tools to confidently choose the best path forward – be it a school, a coaching center, or a college. We envision a future where finding the right fit is no longer a barrier, but an exciting first step.
                    </span>
                 </p>
              </div>
          </section>

          <hr className="border-border-color"/>

          {/* --- For Students Section (No Image Was Here) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-brand-dark mb-6 flex items-center gap-2">
              <FiUsers /> Empowering Students & Parents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Benefit Cards (Text Only) */}
                <div className="bg-light-bg p-5 rounded-lg border border-border-color shadow-sm"> <h3 className="font-semibold text-base-text mb-1">Find Your Fit, Faster</h3> <p className="text-sm text-subtle-text leading-relaxed">Stop juggling multiple tabs. Search thousands of institutions using filters for location, category, courses, exams, boards, fees, and essential features – all in one place.</p> </div>
                <div className="bg-light-bg p-5 rounded-lg border border-border-color shadow-sm"> <h3 className="font-semibold text-base-text mb-1">Compare Confidently</h3> <p className="text-sm text-subtle-text leading-relaxed">Don't just browse, analyze. Select your top choices and use our side-by-side comparison tool to evaluate key details objectively.</p> </div>
                <div className="bg-light-bg p-5 rounded-lg border border-border-color shadow-sm"> <h3 className="font-semibold text-base-text mb-1">Apply with Ease</h3> <p className="text-sm text-subtle-text leading-relaxed">Streamline your application process by applying directly to many participating institutions through our secure platform.</p> </div>
                <div className="bg-light-bg p-5 rounded-lg border border-border-color shadow-sm"> <h3 className="font-semibold text-base-text mb-1">Trustworthy Information</h3> <p className="text-sm text-subtle-text leading-relaxed">Access detailed profiles with up-to-date information provided by institutions (and soon, insights from student reviews).</p> </div>
            </div>
          </section>

           <hr className="border-border-color"/>

          {/* --- For Institutions Section (Text Only) --- */}
           <section>
                 {/* Removed the flex/grid layout that included the image */}
                 <div>
                    <h2 className="text-2xl font-semibold text-brand-dark mb-4 flex items-center gap-2">
                      <FiBookOpen /> Partnering with Institutions
                    </h2>
                    <p className="text-base-text leading-relaxed mb-6 text-sm">
                      FindGreatSchool.com offers institutions a unique platform to connect with a highly relevant audience of prospective students and parents across India. Listing with us provides numerous benefits:
                    </p>
                     <ul className="list-none space-y-3 text-sm">
                        {/* List items with icons */}
                        <li className="flex items-start gap-2"><FiEye className="text-green-500 mt-1 flex-shrink-0"/><span>Reach Thousands: Gain visibility among students actively searching for your specific type of institution and courses.</span></li>
                        <li className="flex items-start gap-2"><FiEdit className="text-blue-500 mt-1 flex-shrink-0"/><span>Showcase Your Strengths: Build a comprehensive profile highlighting your unique features, faculty, infrastructure, fees, and achievements.</span></li>
                        <li className="flex items-start gap-2"><FiTarget className="text-red-500 mt-1 flex-shrink-0"/><span>Generate Quality Leads: Connect directly with interested students through inquiries and direct applications initiated via your profile.</span></li>
                        <li className="flex items-start gap-2"><FiTrendingUp className="text-yellow-500 mt-1 flex-shrink-0"/><span>Cost-Effective Marketing: An efficient digital channel to boost your admissions outreach.</span></li>
                     </ul>
                      <div className="mt-6">
                          <Link href="/for-institutions">
                              <button className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-5 rounded transition-colors text-sm shadow">
                                  Learn More & Register Your Institution
                              </button>
                          </Link>
                      </div>
                </div>
          </section>

          {/* --- Our Values Section (Text/Icons Only) --- */}
          <hr className="border-border-color"/>
           <section className="text-center">
                <h2 className="text-2xl font-semibold text-brand-dark mb-6 flex items-center justify-center gap-2">
                  <FiHeart /> Our Values
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="text-center"> <FiAward className="text-4xl text-indigo-500 mx-auto mb-2"/> <h4 className="font-semibold text-base-text">Trust</h4> <p className="text-xs text-subtle-text">Providing accurate and reliable information.</p> </div>
                    <div className="text-center"> <FiNavigation className="text-4xl text-indigo-500 mx-auto mb-2"/> <h4 className="font-semibold text-base-text">Accessibility</h4> <p className="text-xs text-subtle-text">Making educational discovery easy for everyone.</p> </div>
                    <div className="text-center"> <FiUsers className="text-4xl text-indigo-500 mx-auto mb-2"/> <h4 className="font-semibold text-base-text">Connection</h4> <p className="text-xs text-subtle-text">Facilitating meaningful connections between students and institutions.</p> </div>
                </div>
           </section>
        </div>
      </div>
    </div>
  );
}