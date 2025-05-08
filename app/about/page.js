import Header from "@/Components/Header1";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faHeart, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <div>
        <div className="absolute top-6 left-6 sm:top-6 sm:left-6 lg:top-8 lg:left-8 flex items-center gap-2 z-20">
                <FontAwesomeIcon icon={faCode} className="text-blue-500 text-xl sm:text-xl" />
                <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">CoreAcademy</span>
              </div>
        
              {/* Navigation Links */}
              <div className="absolute top-6 right-6 sm:top-6 sm:right-6 lg:top-8 lg:right-8 flex items-center gap-3 sm:gap-4 z-20">
                
                <Link
                href="/"
                className="text-sm sm:text-base lg:text-lg text-white bg-blue-500 px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 sm:gap-2"
              >
                Home
              </Link>
              </div>
      </div>
      <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6 pt-24 sm:pt-28">
        <div className="w-full max-w-3xl p-6 sm:p-8 bg-white rounded-t-3xl sm:rounded-xl shadow-lg border border-gray-200 mt-6 sm:mt-0">
          {/* Heading Section */}
          <div className="flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faCode} className="text-blue-500 text-xm" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">About CoreAcademy</h1>
          </div>

          {/* Intro Section */}
          <section className="mb-8">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              CoreAcademy was born out of real struggles—the confusion, lack of structure, and loneliness that often come with being a self-taught developer. <span className="font-semibold text-blue-600">We’re here to change that.</span>
            </p>
          </section>

          {/* Mission Section */}
          <section className="mb-8">
            <div className="flex items-start gap-2 mb-4">
              <FontAwesomeIcon icon={faPeopleGroup} className="text-orange-500 text-xm mt-1.5" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              At CoreAcademy, aspiring developers get structured learning paths, weekly live sessions, and a supportive community—all designed to help you grow with clarity and purpose.
            </p>
          </section>

          {/* Impact Section */}
          <section className="mb-8">
            <div className="flex items-start gap-2 mb-4">
              <FontAwesomeIcon icon={faHeart} className="text-red-500 text-xm mt-1.5" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Building with Purpose</h2>
            </div>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              We’re not just building developers—we’re building people who care. A percentage of every payment goes to <span className="font-semibold text-blue-600">CoreFoundation</span>, our outreach initiative focused on feeding the poor and supporting the needy.
            </p>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mt-4">
              <span className="font-semibold italic">Grow in tech. Give with purpose.</span>
            </p>
          </section>

          {/* Closing Note */}
          <section className="mb-8">
            <h3 className="text-gray-600 text-sm sm:text-base italic text-center">
              This page is still in progress—just like us. Thanks for building with us from the ground up!
            </h3>
          </section>
        </div>
      </main>
    </>
  );
}