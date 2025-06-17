"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUserCheck,
  faCreditCard,
  faKey,
  faUsers,
  faCopyright,
  faCommentDots,
  faFileAlt,
  faHeart,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function TermsAndConditions() {
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
            CoreAcademy Terms & Conditions
          </h1>
          <div className="space-y-10 text-gray-700 text-base sm:text-lg leading-relaxed">
            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Effective Date: May 20, 2025</h2>
              </div>
              <p>
                Welcome to CoreAcademy. By accessing our platform, submitting your information, making payments, or participating in our community, you agree to be bound by the following Terms and Conditions. Please review them carefully.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faUserCheck} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">1. Eligibility</h2>
              </div>
              <p>To join CoreAcademy, you must:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Be at least 13 years of age</li>
                <li>Provide accurate and current information during registration</li>
                <li>Accept these Terms and Conditions in their entirety</li>
              </ul>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faCreditCard} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">2. Payments and Refunds</h2>
              </div>
              <p>
                Access to CoreAcademy’s content and sessions requires a one-time or recurring payment, depending on your chosen plan. Additional details include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>All payments are processed securely through our payment gateway</li>
                <li>Payments are non-refundable unless specified otherwise under exceptional circumstances</li>
                <li>For inquiries, please contact us at{" "}
                  <a
                    href="mailto:support@coreacademy.com"
                    className="text-blue-600 hover:text-blue-700 underline transition-colors"
                  >
                    support@coreacademy.com
                  </a>
                </li>
              </ul>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faKey} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">3. Access and Usage</h2>
              </div>
              <p>
                Upon successful registration and payment, you will receive a role in our Discord server granting access to your designated learning path and live sessions. Usage terms include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access is restricted to the registered user only</li>
                <li>Account sharing, redistribution, or resale of content is strictly prohibited</li>
              </ul>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">4. Code of Conduct</h2>
              </div>
              <p>
                CoreAcademy is committed to maintaining a safe and respectful learning environment. All members are required to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Treat others with respect</li>
                <li>Refrain from harassment, hate speech, or disruptive behavior</li>
                <li>Adhere to Discord’s Terms of Service</li>
              </ul>
              <p className="mt-3">
                Violations of these guidelines may result in removal from the platform without a refund.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faCopyright} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">5. Intellectual Property</h2>
              </div>
              <p>
                All content provided by CoreAcademy—including lessons, roadmaps, designs, and session recordings—is the property of CoreAcademy and protected by copyright laws. Unauthorized copying, recording, or distribution of our content is prohibited.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faCommentDots} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">6. Community Contributions</h2>
              </div>
              <p>
                Contributions such as code, feedback, or testimonials submitted by you may be used by CoreAcademy for educational or promotional purposes, with appropriate credit where applicable.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faFileAlt} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">7. Changes to These Terms</h2>
              </div>
              <p>
                CoreAcademy reserves the right to update these Terms and Conditions periodically. Updates will be posted on this page with a revised effective date. Continued use of the platform constitutes acceptance of any revisions.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faHeart} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">8. Social Impact</h2>
              </div>
              <p>
                By joining CoreAcademy, you contribute to CoreFoundation, our nonprofit initiative. A portion of our earnings is dedicated to feeding the poor and supporting those in need.
              </p>
            </motion.section>

            <hr className="border-gray-300" />

            <motion.section variants={sectionVariants} initial="initial" animate="animate">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-base" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">9. Contact</h2>
              </div>
              <p>
                For questions or concerns regarding these Terms and Conditions, please contact us at:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@coreacademy.com"
                    className="text-blue-600 hover:text-blue-700 underline transition-colors"
                  >
                    support@coreacademy.com
                  </a>
                </li>
                <li>
                  Website:{" "}
                  <a
                    href="https://coreacademy.com"
                    className="text-blue-600 hover:text-blue-700 underline transition-colors"
                  >
                    coreacademy.com
                  </a>
                </li>
              </ul>
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