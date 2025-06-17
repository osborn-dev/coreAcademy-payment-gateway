"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faShieldAlt, faShareAlt, faClock, faUserShield, faCookieBite, faFileAlt, faLock } from "@fortawesome/free-solid-svg-icons";

export default function PrivacyPolicy() {
  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6 sm:p-8 lg:p-12">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
            CoreAcademy Privacy Policy
          </h1>
          <div className="space-y-10 text-gray-700 text-base sm:text-lg leading-relaxed">
            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Effective Date: May 20, 2025</h2>
              </div>
              <p>
                CoreAcademy is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you interact with our platform.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faUser} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Information We Collect</h2>
              </div>
              <p>We collect the following information when you engage with CoreAcademy:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>Selected learning path (e.g., Frontend, Backend, Fullstack)</li>
                <li>Payment method (processed securely via third-party gateways)</li>
                <li>How you discovered CoreAcademy</li>
                <li>Discord User ID</li>
              </ul>
              <p className="mt-3">
                Additionally, we may gather technical data, such as IP addresses and browser information, for analytical purposes.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Use of Your Information</h2>
              </div>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Establish and manage your account and learning profile</li>
                <li>Grant access to relevant classes via Discord roles</li>
                <li>Process payments securely</li>
                <li>Deliver important updates regarding your learning journey</li>
                <li>Enhance our platform and community experience</li>
              </ul>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faShareAlt} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Information Sharing</h2>
              </div>
              <p>We share your information solely with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment processors to facilitate secure transactions</li>
                <li>Discord to assign roles and provide class access</li>
              </ul>
              <p className="mt-3">
                CoreAcademy does not sell or lease your personal data to third parties.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faClock} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Data Retention</h2>
              </div>
              <p>
                We retain your personal information only for as long as necessary to support your participation and fulfill legal obligations.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faUserShield} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Your Rights</h2>
              </div>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request corrections or deletion of your data</li>
                <li>Request that we cease using your data, where applicable</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:support@coreacademy.com"
                  className="text-blue-600 hover:text-blue-700 underline transition-colors"
                >
                  support@coreacademy.com
                </a>.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faCookieBite} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Cookies and Analytics</h2>
              </div>
              <p>
                We may utilize cookies and analytics tools, such as Vercel Analytics, to improve user experience and analyze platform traffic.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faFileAlt} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Policy Updates</h2>
              </div>
              <p>
                We may revise this Privacy Policy to reflect changes in our practices. Significant updates will be communicated via email or platform notifications.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faLock} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Our Commitment</h2>
              </div>
              <p>
                CoreAcademy is dedicated to maintaining a secure and growth-focused environment. Your trust is paramount, and we are committed to protecting your personal information.
              </p>
            </motion.section>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}